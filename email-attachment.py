import os
import sys
import json
import uuid
import boto3
from email import policy
from email.parser import BytesParser
from botocore.exceptions import ClientError
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Retrieve the environment variables

ACCESS_KEY = "AKIAQT6CMKOP6RBSHH3R"
SECRET_KEY = "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"
BUCKET_NAME = "1archiverfinal"
REGION= "us-east-1"

def save_attachment_to_s3(part, bucket_name, s3_client, email_uuid):
    content_disposition = part.get("Content-Disposition", "")
    if "attachment" in content_disposition or part.get_filename():
        filename = part.get_filename()
        if not filename:
            filename = str(uuid.uuid4())  # Generate a random filename if none exists

        payload = part.get_payload(decode=True)
        if payload:
            s3_key = f"{email_uuid}/attachments/{filename}"
            try:
                s3_client.put_object(
                    Bucket=bucket_name,
                    Key=s3_key,
                    Body=payload
                )
                # Generate a presigned URL for the uploaded attachment
                presigned_url = s3_client.generate_presigned_url(
                    'get_object',
                    Params={'Bucket': bucket_name, 'Key': s3_key},
                    ExpiresIn=3600  # URL expires in 1 hour
                )
                return {
                    "s3_path": f"s3://{bucket_name}/{s3_key}",
                    "presigned_url": presigned_url
                }
            except ClientError as e:
                print(f"Error uploading {filename} to S3: {e}", file=sys.stderr)
                return None
        else:
            print(f"Skipping part with filename {filename} because payload is None", file=sys.stderr)
    return None

def process_email(email_content, bucket_name, s3_client):
    attachments = []
    email_uuid = str(uuid.uuid4())
    try:
        email_message = BytesParser(policy=policy.default).parsebytes(email_content)

        if email_message.is_multipart():
            for part in email_message.iter_parts():
                attachment_info = save_attachment_to_s3(part, bucket_name, s3_client, email_uuid)
                if attachment_info:
                    attachments.append(attachment_info)
        else:
            attachment_info = save_attachment_to_s3(email_message, bucket_name, s3_client, email_uuid)
            if attachment_info:
                attachments.append(attachment_info)
    except Exception as e:
        print(f"Error processing email: {e}", file=sys.stderr)

    return attachments

def main():
    s3_client = boto3.client(
        's3',
        aws_access_key_id=ACCESS_KEY,
        aws_secret_access_key=SECRET_KEY,
        region_name=REGION
    )

    # Read email content from stdin
    email_content = sys.stdin.buffer.read()
    attachments = process_email(email_content, BUCKET_NAME, s3_client)

    # Output the JSON with the S3 paths and presigned URLs
    print(json.dumps({"attachments": attachments}, ensure_ascii=False, indent=4))

if __name__ == '__main__':
    main()
