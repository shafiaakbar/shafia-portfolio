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
from kafka import KafkaProducer
import json

# Load environment variables from .env file
load_dotenv()

# Environment variables
ON_PREMISES = os.getenv('ON_PREMISES')
ACCESS_KEY = os.getenv('ACCESS_KEY')
SECRET_KEY = os.getenv('SECRET_KEY')
DELEGATED_ADMIN_EMAIL = os.getenv('DELEGATED_ADMIN_EMAIL')
SERVICE_ACCOUNT_FILE = os.getenv('SERVICE_ACCOUNT_FILE')
BUCKET_NAME = os.getenv('BUCKET_NAME')
KAFKA_BOOTSTRAP_SERVERS = 'localhost:9092'
KAFKA_TOPIC = 'email_data'

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
    producer = KafkaProducer(
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS.split(','),
        value_serializer=lambda v: json.dumps(v).encode('utf-8')
    )
    logging.info(f"Kafka producer successfully connected to {KAFKA_BOOTSTRAP_SERVERS}")
except Exception as e:
    log_error(f"Failed to connect to Kafka: {e}")
    raise

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
        future = producer.send(KAFKA_TOPIC, email_data)
        result = future.get(timeout=10)  # Wait for the send to complete and get result
        logging.info(f"Sent email to Kafka topic {KAFKA_TOPIC}: {result}")
    except Exception as e:
        log_error(f"Failed to send email to Kafka: {e}")

def fetch_emails_for_user(user_email):
    logging.info(f"Switching to user: {user_email}")
    total_emails_fetched = 0
    try:
        delegated_credentials = credentials.with_subject(user_email)
        service = build('gmail', 'v1', credentials=delegated_credentials)
        user_folder = os.path.join(os.path.dirname(__file__), 'emails', user_email)
        os.makedirs(user_folder, exist_ok=True)
        email_processor = EmailProcessor(user_folder)

        query = "in:anywhere"  # This query will fetch emails from all parts including spam and bin
        next_page_token = None
        while True:
            messages = service.users().messages().list(userId='me', q=query, pageToken=next_page_token, maxResults=100).execute()
            if 'messages' in messages:
                for message in messages['messages']:
                    message_id = message['id']
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
                        'raw_email_bytes': raw_email_bytes.decode('utf-8')
                    }
                    # Send email data to Kafka
                    send_email_to_kafka(email_data)

                    # Upload email to S3
                    s3_file_path = os.path.join('emails', user_email, eml_file_name)
                    upload_to_s3(eml_file_path, s3_file_path)

            next_page_token = messages.get('nextPageToken')
            if not next_page_token:
                break
        logging.info(f"Total emails fetched for user {user_email}: {total_emails_fetched}")
    except HttpError as error:
        log_error(f'Error fetching emails for user {user_email}: {error}')
    except Exception as e:
        log_error(f'Unexpected error occurred while fetching emails for user {user_email}: {e}')

def fetch_emails_for_all_users():
    try:
        # Fetch the list of users
        service = build('admin', 'directory_v1', credentials=delegated_credentials)
        request = service.users().list(customer='my_customer', maxResults=500)
        while request is not None:
            response = request.execute()
            for user in response['users']:
                user_email = user['primaryEmail']
                fetch_emails_for_user(user_email)

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
