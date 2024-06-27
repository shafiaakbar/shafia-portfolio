import sys
import json
from email import policy
from email.parser import BytesParser

def parse_email_from_stdin():
    # Use sys.stdin.buffer to access the binary input stream
    email_message = BytesParser(policy=policy.default).parse(sys.stdin.buffer)

    # Extract all headers and convert keys to lowercase
    headers = {k.lower(): v for k, v in email_message.items()}

    # Initialize additional fields
    headers['legalholds_id'] = []
    headers['policy_id'] = []
    headers['label_id'] = []
    headers['email_text'] = ""
    headers['html_body'] = ""

    # Function to decode payload with a default charset if none is specified
    def get_decoded_payload(part):
        charset = part.get_content_charset()
        if charset is None:
            charset = 'utf-8'
        return part.get_payload(decode=True).decode(charset, errors='replace')

    # Handle different content types within the email
    if email_message.is_multipart():
        for part in email_message.iter_parts():
            content_type = part.get_content_type()
            if content_type == 'text/plain':
                headers['email_text'] = get_decoded_payload(part)
            elif content_type == 'text/html':
                headers['html_body'] = get_decoded_payload(part)
    else:
        content_type = email_message.get_content_type()
        if content_type == 'text/plain':
            headers['email_text'] = get_decoded_payload(email_message)
        elif content_type == 'text/html':
            headers['html_body'] = get_decoded_payload(email_message)

    return headers

if __name__ == '__main__':
    email_data = parse_email_from_stdin()
    print(json.dumps(email_data, ensure_ascii=False, indent=4))