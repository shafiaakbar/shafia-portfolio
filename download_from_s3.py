import os
import boto3
import logging
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Retrieve the environment variables
ACCESS_KEY = os.getenv('ACCESS_KEY')
SECRET_KEY = os.getenv('SECRET_KEY')
REGION = os.getenv('REGION')
BUCKET_NAME = os.getenv('BUCKET_NAME')

# Initialize the S3 client
s3_client = boto3.client(
    's3',
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_KEY,
    region_name=REGION
)

# Setup logging
logging.basicConfig(filename='s3_pull_emails.log', level=logging.ERROR,
                    format='%(asctime)s:%(levelname)s:%(message)s')

# Define the directory to store emails
EMAIL_DIR = 'emails'

# Create the directory if it does not exist
if not os.path.exists(EMAIL_DIR):
    os.makedirs(EMAIL_DIR)

def list_s3_emails(bucket_name):
    """
    List all objects in the specified S3 bucket.
    """
    try:
        response = s3_client.list_objects_v2(Bucket=bucket_name)
        if 'Contents' in response:
            return [obj['Key'] for obj in response['Contents']]
        return []
    except Exception as e:
        logging.error(f"Error listing emails from bucket {bucket_name}: {e}")
        return []

def get_email_content(bucket_name, key):
    """
    Get the content of the specified S3 object.
    """
    try:
        response = s3_client.get_object(Bucket=bucket_name, Key=key)
        return response['Body'].read().decode('utf-8')
    except Exception as e:
        logging.error(f"Error getting email content for {key} from bucket {bucket_name}: {e}")
        return None

def save_email_to_file(email_content, email_key):
    """
    Save the email content to a file.
    """
    try:
        email_path = os.path.join(EMAIL_DIR, email_key.replace('/', '_'))
        with open(email_path, 'w') as email_file:
            email_file.write(email_content)
    except Exception as e:
        logging.error(f"Error saving email {email_key} to file: {e}")

def main():
    """
    Main function to list and save email contents from S3 bucket.
    """
    email_keys = list_s3_emails(BUCKET_NAME)
    if not email_keys:
        print(f"No emails found in bucket '{BUCKET_NAME}'.")
        return
    
    for key in email_keys:
        email_content = get_email_content(BUCKET_NAME, key)
        if email_content:
            save_email_to_file(email_content, key)
            print(f"Saved email '{key}' to '{EMAIL_DIR}'")

if __name__ == '__main__':
    main()
