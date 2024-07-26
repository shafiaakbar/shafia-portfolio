import os
import logging
import base64
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import boto3
from botocore.exceptions import NoCredentialsError, ClientError
from dotenv import load_dotenv
from error_logger import log_error, error_log_file
from email_processor import EmailProcessor  # Import the EmailProcessor class
from confluent_kafka import Producer, Consumer, KafkaException, KafkaError
import json

# Load environment variables from .env file
load_dotenv()

# Environment variables
ON_PREMISES = os.getenv('ON_PREMISES')
ACCESS_KEY = os.getenv('ACCESS_KEY')
SECRET_KEY = os.getenv('SECRET_KEY')
DELEGATED_ADMIN_EMAIL = os.getenv('DELEGATED_ADMIN_EMAIL')
SERVICE_ACCOUNT_FILE = os.getenv('SERVICE_ACCOUNT_FILE')
BUCKET_NAME = os.getenv('BUCKET_NAME').strip()
KAFKA_BOOTSTRAP_SERVERS = os.getenv('KAFKA_BOOTSTRAP_SERVERS')  # Ensure this is set to 'localhost:9092'
KAFKA_TOPIC = os.getenv('KAFKA_TOPIC')
PROCESSED_EMAILS_TOPIC = os.getenv('PROCESSED_EMAILS_TOPIC')

# Set up logging
info_log_file = 'email_extraction_info.log'

# General logging setup
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    handlers=[logging.FileHandler(info_log_file), logging.StreamHandler()])

SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/admin.directory.user.readonly'
]

credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES)
delegated_credentials = credentials.with_subject(DELEGATED_ADMIN_EMAIL)

# Initialize Kafka producer with debug logs
try:
    producer = Producer({'bootstrap.servers': KAFKA_BOOTSTRAP_SERVERS})
    logging.info(f"Kafka producer successfully connected to {KAFKA_BOOTSTRAP_SERVERS}")
except Exception as e:
    log_error(f"Failed to connect to Kafka: {e}")
    raise

def get_processed_email_ids():
    consumer = Consumer({
        'bootstrap.servers': KAFKA_BOOTSTRAP_SERVERS,
        'group.id': 'email-processor',
        'auto.offset.reset': 'earliest'
    })

    processed_email_ids = set()
    consumer.subscribe([PROCESSED_EMAILS_TOPIC])

    try:
        while True:
            msg = consumer.poll(1.0)
            if msg is None:
                break
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    continue
                else:
                    log_error(f"Consumer error: {msg.error()}")
                    break

            processed_email_id = msg.value().decode('utf-8')
            processed_email_ids.add(processed_email_id)
    finally:
        consumer.close()

    return processed_email_ids

def mark_email_as_processed(email_id):
    try:
        producer.produce(PROCESSED_EMAILS_TOPIC, key=email_id, value=email_id)
        producer.flush()
        logging.info(f"Marked email {email_id} as processed")
    except Exception as e:
        log_error(f"Failed to mark email {email_id} as processed: {e}")

def upload_to_s3(local_file_path, s3_file_path):
    try:
        s3_client = boto3.client('s3', aws_access_key_id=ACCESS_KEY, aws_secret_access_key=SECRET_KEY)
        s3_client.upload_file(local_file_path, BUCKET_NAME, s3_file_path)
        logging.info(f"Uploaded {local_file_path} to S3 bucket {BUCKET_NAME} as {s3_file_path}")
    except FileNotFoundError:
        log_error(f"The file {local_file_path} was not found")
    except NoCredentialsError:
        log_error("Credentials not available for AWS S3")
    except ClientError as e:
        log_error(f"Failed to upload {local_file_path} to S3: {e}")

def send_email_to_kafka(email_data):
    try:
        # Encode the raw email bytes to base64 and decode to string
        email_data['raw_email_bytes'] = base64.b64encode(email_data['raw_email_bytes']).decode('utf-8')
        
        # Produce the message to Kafka as bytes
        producer.produce(KAFKA_TOPIC, key=email_data['message_id'], value=json.dumps(email_data).encode('utf-8'))
        producer.flush()
        logging.info(f"Sent email to Kafka topic {KAFKA_TOPIC}")
    except Exception as e:
        log_error(f"Failed to send email to Kafka: {e}")

def fetch_emails_for_user(user_email, processed_email_ids):
    logging.info(f"Switching to user: {user_email}")
    total_emails_fetched = 0
    try:
        delegated_credentials = credentials.with_subject(user_email)
        service = build('gmail', 'v1', credentials=delegated_credentials)
        user_folder = os.path.join(os.path.dirname(__file__), 'emails', user_email)
        os.makedirs(user_folder, exist_ok=True)
        email_processor = EmailProcessor(user_folder)

        query = "in:anywhere"  # This query will fetch emails from all parts including spam and bin
        logging.info(f"Query: {query}")

        next_page_token = None
        while True:
            messages = service.users().messages().list(userId='me', q=query, pageToken=next_page_token, maxResults=100).execute()
            if 'messages' in messages:
                for message in messages['messages']:
                    message_id = message['id']
                    
                    # Skip if the email has already been processed
                    if message_id in processed_email_ids:
                        logging.info(f"Email {message_id} already processed. Skipping.")
                        continue

                    raw_message = service.users().messages().get(userId='me', id=message_id, format='raw').execute()
                    raw_email_bytes = base64.urlsafe_b64decode(raw_message['raw'].encode('utf-8'))

                    # Save the raw email content to a .eml file
                    eml_file_name = f"email_{message_id}.eml"
                    eml_file_path = email_processor.save_mime_as_eml(raw_email_bytes, eml_file_name)
                    total_emails_fetched += 1

                    # Prepare email data for Kafka
                    email_data = {
                        'user_email': user_email,
                        'message_id': message_id,
                        'raw_email_bytes': raw_email_bytes
                    }
                    # Send email data to Kafka
                    send_email_to_kafka(email_data)

                    # Upload email to S3
                    s3_file_path = os.path.join('emails', user_email, eml_file_name)
                    upload_to_s3(eml_file_path, s3_file_path)

                    # Mark email as processed
                    mark_email_as_processed(message_id)

            next_page_token = messages.get('nextPageToken')
            if not next_page_token:
                break
        logging.info(f"Total emails fetched for user {user_email}: {total_emails_fetched}")
    except HttpError as error:
        log_error(f'Error fetching emails for user {user_email}: {error}')
    except Exception as e:
        log_error(f'Unexpected error occurred while fetching emails for user {user_email}: {e}')

def fetch_emails_for_all_users():
    processed_email_ids = get_processed_email_ids()
    try:
        # Fetch the list of users
        service = build('admin', 'directory_v1', credentials=delegated_credentials)
        request = service.users().list(customer='my_customer', maxResults=500)
        while request is not None:
            response = request.execute()
            for user in response['users']:
                user_email = user['primaryEmail']
                fetch_emails_for_user(user_email, processed_email_ids)

            request = service.users().list_next(previous_request=request, previous_response=response)
    except HttpError as error:
        log_error(f'An error occurred while fetching user list: {error}')
    except Exception as e:
        log_error(f'Unexpected error occurred while fetching user list: {e}')

if __name__ == '__main__':
    fetch_emails_for_all_users()

    # Upload log files to S3 if not on-premises
    if not ON_PREMISES:
        upload_to_s3(info_log_file, info_log_file)
        upload_to_s3(error_log_file, error_log_file)
