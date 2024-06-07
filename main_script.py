# import os
# import base64
# import logging
# from email import policy
# from email.parser import BytesParser
# from email.generator import BytesGenerator
# from google.oauth2 import service_account
# from googleapiclient.discovery import build
# from googleapiclient.errors import HttpError
# from fetch_all_users import all_users


# #strenghen error handling, logging setup, dockerize, figuring out deployment options with configurations with clients
# #figure this out for microsoft365
# # Set up logging
# logging.basicConfig(level=logging.INFO)

# SCOPES = ['https://www.googleapis.com/auth/gmail.readonly','https://www.googleapis.com/auth/admin.directory.user.readonly'] 
# SERVICE_ACCOUNT_FILE = 'C:/Users/Sanaan/Downloads/fiery-iridium-391414-debc38f08308.json'
# DELEGATED_ADMIN_EMAIL = 'ali@ecompasse.com'  # Admin email for delegation

# credentials = service_account.Credentials.from_service_account_file(
#     SERVICE_ACCOUNT_FILE, scopes=SCOPES)
# delegated_credentials = credentials.with_subject(DELEGATED_ADMIN_EMAIL)

# def process_mime_part(part):
#     if part.get_content_maintype() == 'multipart':
#         for subpart in part.get_payload():
#             process_mime_part(subpart)
#     elif part.get_content_maintype() == 'image':
#         if not part.get('Content-ID'):
#             part.add_header('Content-ID', f'<{part.get("Content-ID")}>')

# def save_mime_as_eml(raw_email_bytes, file_path):
#     parsed_email = BytesParser(policy=policy.default).parsebytes(raw_email_bytes)
#     process_mime_part(parsed_email)
#     with open(file_path, 'wb') as file:
#         gen = BytesGenerator(file, policy=policy.default)
#         gen.flatten(parsed_email)

# def fetch_emails_for_user(user_email):
#     logging.info(f"Switching to user: {user_email}")
#     delegated_credentials = credentials.with_subject(user_email)
#     service = build('gmail', 'v1', credentials=delegated_credentials)
#     try:
#         messages = service.users().messages().list(userId=user_email, maxResults=5).execute()
#         for message in messages.get('messages', []):
#             message_id = message['id']
#             raw_message = service.users().messages().get(userId=user_email, id=message_id, format='raw').execute()
#             raw_email_bytes = base64.urlsafe_b64decode(raw_message['raw'].encode('utf-8'))

#             # Save the raw email content to a .eml file
#             eml_file_name = f"email_{user_email}_{message_id}.eml"
#             eml_file_path = os.path.join(os.path.dirname(__file__), eml_file_name)
#             save_mime_as_eml(raw_email_bytes, eml_file_path)

#     except HttpError as error:
#         logging.error(f'Error fetching emails for user {user_email}: {error}')

# def fetch_emails_for_all_users():
#     try:
#         # Fetch the list of users
#         service = build('admin', 'directory_v1', credentials=delegated_credentials)
#         request = service.users().list(customer='my_customer', maxResults=500)
#         while request is not None:
#             response = request.execute()
#             for user in response['users']:
#                 user_email = user['primaryEmail']
#                 fetch_emails_for_user(user_email)

#             request = service.users().list_next(previous_request=request, previous_response=response)

#     except HttpError as error:
#         logging.error(f'An error occurred: {error}')

# if __name__ == '__main__':
#     fetch_emails_for_all_users()

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

# Load environment variables from .env file
load_dotenv()

# Environment variables
ON_PREMISES = os.getenv('ON_PREMISES', 'true').lower() == 'true'
ACCESS_KEY = os.getenv('ACCESS_KEY')
SECRET_KEY = os.getenv('SECRET_KEY')
DELEGATED_ADMIN_EMAIL = os.getenv('DELEGATED_ADMIN_EMAIL')
SERVICE_ACCOUNT_FILE = os.getenv('SERVICE_ACCOUNT_FILE')
BUCKET_NAME = os.getenv('BUCKET_NAME')

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

                    if not ON_PREMISES:
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
