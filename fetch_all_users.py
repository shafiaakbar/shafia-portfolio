import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Path to the service account key file
SERVICE_ACCOUNT_FILE = 'C:/Users/Sanaan/Downloads/fiery-iridium-391414-debc38f08308.json'
emailz = ["ali@ecompasse.com", "alizafar@ecompasse.com"]
# Admin email for delegation
DELEGATED_ADMIN_EMAIL = 'ali@ecompasse.com'

# Scopes required for the API
SCOPES = [
    'https://www.googleapis.com/auth/admin.directory.user.readonly',
    'https://www.googleapis.com/auth/gmail.readonly'
]

# Create credentials using the service account
credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES)

# Delegate the credentials to the admin
delegated_credentials = credentials.with_subject(DELEGATED_ADMIN_EMAIL)

def fetch_all_users():
    try:
        # Build the service for the Admin SDK Directory API
        service = build('admin', 'directory_v1', credentials=delegated_credentials)

        # Request to list users
        request = service.users().list(customer='my_customer', maxResults=500)
        users = []

        while request is not None:
            response = request.execute()
            for user in response['users']:
                users.append(user['primaryEmail'])
            request = service.users().list_next(previous_request=request, previous_response=response)

        return users

    except HttpError as error:
        print(f'An error occurred: {error}')
        raise

# Fetch all users and print their email addresses
all_users = fetch_all_users()
for user_email in all_users:
    print(user_email)
