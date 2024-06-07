import os
import base64
from email import policy
from email.parser import BytesParser
from email.generator import BytesGenerator
import logging

class EmailProcessor:
    def __init__(self, save_directory):
        self.save_directory = save_directory

    def process_mime_part(self, part):
        if part.get_content_maintype() == 'multipart':
            for subpart in part.get_payload():
                self.process_mime_part(subpart)
        elif part.get_content_maintype() == 'image':
            if not part.get('Content-ID'):
                part.add_header('Content-ID', f'<{part.get("Content-ID")}>')

    def save_mime_as_eml(self, raw_email_bytes, file_name):
        parsed_email = BytesParser(policy=policy.default).parsebytes(raw_email_bytes)
        self.process_mime_part(parsed_email)
        file_path = os.path.join(self.save_directory, file_name)
        with open(file_path, 'wb') as file:
            gen = BytesGenerator(file, policy=policy.default)
            gen.flatten(parsed_email)
        logging.info(f"Saved email to {file_path}")
        return file_path
