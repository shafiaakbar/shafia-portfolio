import os
import logging
import boto3
from botocore.exceptions import NoCredentialsError, ClientError
from dotenv import load_dotenv
from confluent_kafka import Producer

# Load environment variables from .env file
load_dotenv()

# Environment variables
ACCESS_KEY = os.getenv('ACCESS_KEY')
SECRET_KEY = os.getenv('SECRET_KEY')
BUCKET_NAME = "ecompasse-mails"  # Set the correct bucket name
PREFIX = 'emails\\'  # Set the prefix to match your S3 structure

# Kafka configuration
KAFKA_BOOTSTRAP_SERVERS = 'kafkaui.ecompasse.co:9092'
KAFKA_TOPIC = 'email_data'


# Set up logging
info_log_file = 'email_download_info.log'
error_log_file = 'email_download_error.log'

# General logging setup
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    handlers=[logging.FileHandler(info_log_file), logging.StreamHandler()])

def log_error(message):
    logging.error(message)
    with open(error_log_file, 'a') as f:
        f.write(message + '\n')

def fetch_emails_from_s3_and_store_in_kafka():
    try:
        s3_client = boto3.client('s3', aws_access_key_id=ACCESS_KEY, aws_secret_access_key=SECRET_KEY)
        response = s3_client.list_objects_v2(Bucket=BUCKET_NAME, Prefix=PREFIX)
        
        if 'Contents' in response:
            logging.info(f"Found {len(response['Contents'])} items in S3 bucket {BUCKET_NAME} with prefix '{PREFIX}'")
            # Create Kafka Producer
            producer = Producer({'bootstrap.servers': KAFKA_BOOTSTRAP_SERVERS})
            for obj in response['Contents']:
                s3_file_path = obj['Key']
                logging.info(f"Processing S3 file: {s3_file_path}")
                if s3_file_path.endswith('.eml'):
                    try:
                        # Get email content from S3
                        email_content = s3_client.get_object(Bucket=BUCKET_NAME, Key=s3_file_path)['Body'].read().decode('utf-8')
                        # Produce email content to Kafka
                        producer.produce(KAFKA_TOPIC, email_content.encode('utf-8'))
                        logging.info(f"Email from {s3_file_path} sent to Kafka topic '{KAFKA_TOPIC}'")
                    except Exception as e:
                        log_error(f"Failed to fetch email content from S3 or produce to Kafka: {e}")
            producer.flush()  # Flush the messages to ensure they are sent to Kafka
        else:
            logging.warning(f"No contents found in S3 bucket with the prefix '{PREFIX}'.")
        
        logging.info("All emails sent to Kafka.")
    except ClientError as e:
        log_error(f"Failed to list objects in S3 bucket {BUCKET_NAME}: {e}")

if _name_ == '_main_':
    # Fetch emails from S3 and store in Kafka
    fetch_emails_from_s3_and_store_in_kafka()