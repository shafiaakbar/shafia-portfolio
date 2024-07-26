#THIS SCRIPT WILL PARSE THE EMAIL, EXTRACT THE ATTACHMENT SAVE IT TO S3BUCKET, CONVERTS THE EMAIL HEADERS INTO VECTOR AND RETURNS THE OUTPUT IN JSON FILE.

import sys
import json
import os
import uuid
import torch
from email import policy
from email.parser import BytesParser
from base64 import b64decode
import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv
from transformers import BertTokenizer, BertModel

# Load environment variables from .env file
load_dotenv()

# Environment variables
ACCESS_KEY = os.getenv('ACCESS_KEY')
SECRET_KEY = os.getenv('SECRET_KEY')
BUCKET_NAME = os.getenv('BUCKET_NAME')
REGION = os.getenv('REGION')

# Initialize S3 client
s3_client = boto3.client('s3', aws_access_key_id=ACCESS_KEY, aws_secret_access_key=SECRET_KEY, region_name=REGION)

# Load pre-trained model and tokenizer
tokenizer = BertTokenizer.from_pretrained('bert-large-uncased')
model = BertModel.from_pretrained('bert-large-uncased')

# Move model to GPU if available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

def encode_text(text):
    """
    Encode text into a vector using BERT.
    """
    try:
        inputs = tokenizer(text, return_tensors='pt', max_length=512, truncation=True, padding='max_length')
        inputs = {key: value.to(device) for key, value in inputs.items()}
        with torch.no_grad():
            outputs = model(**inputs)
        return outputs.last_hidden_state.mean(dim=1).cpu().numpy().flatten().tolist()
    except Exception as e:
        print(f"Error encoding text: {e}", file=sys.stderr)
        raise

def save_attachment_to_s3(part, email_uuid):
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
                    Bucket=BUCKET_NAME,
                    Key=s3_key,
                    Body=payload
                )
                # Generate an unsigned URL for the uploaded attachment
                presigned_url = s3_client.generate_presigned_url(
                    'get_object',
                    Params={'Bucket': BUCKET_NAME, 'Key': s3_key},
                    ExpiresIn=3600  # URL expires in 1 hour
                )
                return {
                    "s3_path": f"s3://{BUCKET_NAME}/{s3_key}",
                    "presigned_url": presigned_url
                }
            except ClientError as e:
                print(f"Error uploading {filename} to S3: {e}", file=sys.stderr)
                return None
        else:
            print(f"Skipping part with filename {filename} because payload is None", file=sys.stderr)
    return None

def parse_email(raw_email):
    email_uuid = str(uuid.uuid4())
    # Decode the base64 encoded email content
    email_message = BytesParser(policy=policy.default).parsebytes(b64decode(raw_email))
    
    # Extract all headers and convert keys to lowercase
    headers = {k.lower(): v for k, v in email_message.items()}
    
    # Initialize additional fields
    headers['attachments'] = []
    headers['legalholds_id'] = []
    headers['policy_id'] = []
    headers['label_id'] = []
    headers['email_text'] = ""
    headers['html_body'] = ""
 
    # Handle different content types within the email
    if email_message.is_multipart():
        for part in email_message.iter_parts():
            content_type = part.get_content_type()
            if content_type == 'text/plain':
                headers['email_text'] = part.get_payload(decode=True).decode(part.get_content_charset(), errors='replace')
            elif content_type == 'text/html':
                headers['html_body'] = part.get_payload(decode=True).decode(part.get_content_charset(), errors='replace')
    else:
        content_type = email_message.get_content_type()
        if content_type == 'text/plain':
            headers['email_text'] = email_message.get_payload(decode=True).decode(email_message.get_content_charset(), errors='replace')
        elif content_type == 'text/html':
            html_body = part.get_payload(decode=True).decode(charset, errors='replace')
            headers['html_body'] += html_body

    # Handle email content
    process_part(email_message)

    return headers

def process_email_json(json_data):
    """
    Process email JSON data to convert text fields to vectors.
    """
    email_vectors = {}
    
    try:
        if 'subject' in json_data:
            email_vectors['subject_vector'] = encode_text(json_data['subject'])
        
        if 'email_text' in json_data:
            email_vectors['email_text_vector'] = encode_text(json_data['email_text'])

        if 'delivered_to' in json_data:
            email_vectors['delivered_to_vector'] = encode_text(json_data['delivered_to'])
        
        if 'date' in json_data:
            email_vectors['date_vector'] = encode_text(json_data['date'])
        
        if 'to' in json_data:
            email_vectors['to_vector'] = encode_text(json_data['to'])
        
        if 'from' in json_data:
            email_vectors['from_vector'] = encode_text(json_data['from'])
    except Exception as e:
        print(f"Error processing email JSON: {e}", file=sys.stderr)
        raise
    
    return email_vectors

def main():
    try:
        # Read the JSON input from stdin
        input_data = sys.stdin.read()
        json_data = json.loads(input_data)
        
        # Extract the raw email content
        raw_email = json_data.get("raw_email_bytes", "")
        
        if not raw_email:
            print(json.dumps({"error": "No raw email content found"}, ensure_ascii=False, indent=4))
            return
        
        # Parse the email content
        email_data = parse_email(raw_email)
        
        # Convert the email JSON data to vectors
        email_vectors = process_email_json(email_data)
        
        # Merge email data with vectors
        merged_data = {**email_data, **email_vectors}
        
        # Print the formatted output
        formatted_output = json.dumps(merged_data, ensure_ascii=False, indent=4)
        
        # Ensure stdout uses UTF-8 encoding
        sys.stdout.buffer.write(formatted_output.encode('utf-8'))
    except Exception as e:
        print(f"Error in main: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    email_data = parse_email_from_stdin()
    print(json.dumps(email_data, ensure_ascii=False, indent=4))