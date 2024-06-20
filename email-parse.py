import os
import json
import base64
import uuid
import shutil
from email import policy
from email.parser import BytesParser
from datetime import datetime

def save_attachment(part, attachment_dir):
    content_disposition = part.get("Content-Disposition", "")
    if "attachment" in content_disposition:
        filename = part.get_filename()
        if filename:
            attachment_path = os.path.join(attachment_dir, filename)
            with open(attachment_path, 'wb') as f:
                f.write(part.get_payload(decode=True))
            return attachment_path
    return None

def parse_eml_file(file_path, attachments_base_dir):
    with open(file_path, 'rb') as f:
        email_message = BytesParser(policy=policy.default).parse(f)
    
    # Extract all headers
    headers = dict(email_message.items())
    
    # Add additional fields
    headers['legalholds_id'] = []
    headers['policy_id'] = []
    headers['label_id'] = []
    headers['email_text'] = ""
    headers['html_body'] = ""
    headers['attachments'] = []
    
    # Generate a unique identifier
    email_uuid = str(uuid.uuid4())
    headers['uuid'] = email_uuid

    # Parse date to create directory structure
    date_str = headers.get('Date', '')
    try:
        email_date = datetime.strptime(date_str, '%a, %d %b %Y %H:%M:%S %z')
        year = email_date.strftime('%Y')
        month = email_date.strftime('%B')
    except ValueError:
        year = 'unknown'
        month = 'unknown'
    
    # Create directory for storing the email and attachments
    email_dir = os.path.join(attachments_base_dir, year, month, email_uuid)
    os.makedirs(email_dir, exist_ok=True)

    # Save the .eml file
    eml_path = os.path.join(email_dir, f"{email_uuid}.eml")
    shutil.copy2(file_path, eml_path)
    headers['eml_path'] = eml_path

    # Add the body separately and check for attachments
    if email_message.is_multipart():
        for part in email_message.iter_parts():
            content_type = part.get_content_type()
            if content_type == 'text/plain':
                headers['email_text'] = part.get_payload(decode=True).decode(part.get_content_charset(), errors='replace')
            elif content_type == 'text/html':
                headers['html_body'] = part.get_payload(decode=True).decode(part.get_content_charset(), errors='replace')
            else:
                attachment_path = save_attachment(part, email_dir)
                if attachment_path:
                    headers['attachments'].append(attachment_path)
    else:
        content_type = email_message.get_content_type()
        if content_type == 'text/plain':
            headers['email_text'] = email_message.get_payload(decode=True).decode(email_message.get_content_charset(), errors='replace')
        elif content_type == 'text/html':
            headers['html_body'] = email_message.get_payload(decode=True).decode(email_message.get_content_charset(), errors='replace')

    return headers

def parse_eml_directory(directory, attachments_base_dir):
    email_list = []
    for filename in os.listdir(directory):
        if filename.endswith('.eml'):
            file_path = os.path.join(directory, filename)
            email_data = parse_eml_file(file_path, attachments_base_dir)
            email_list.append(email_data)
    return email_list

def save_to_json(email_list, output_json_file):
    print(json.dump(email_list,ensure_ascii=False,indent=4))
    with open(output_json_file, 'w', encoding='utf-8') as f:
        json.dump(email_list, f, ensure_ascii=False, indent=4)

if __name__ == '__main__':
    eml_directory = './emls'  # Replace with your directory containing .eml files
    output_json_file = 'output.json'  # Replace with your desired output JSON file path
    attachments_base_dir = './1archiver-catalog'  # Base directory to save attachments and .eml files

    email_list = parse_eml_directory(eml_directory, attachments_base_dir)
    # save_to_json(email_list, output_json_file)

    print(f"Successfully converted {len(email_list)} emails to {output_json_file} and saved attachments to {attachments_base_dir}")
