import sys
import json
from email import policy
from email.parser import BytesParser

def parse_email_from_stdin():
    email_message = BytesParser(policy=policy.default).parse(sys.stdin)
    
    # Extract all headers
    headers = dict(email_message.items())
    
    # Initialize additional fields
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
            headers['html_body'] = email_message.get_payload(decode=True).decode(email_message.get_content_charset(), errors='replace')

    return headers

if __name__ == '__main__':
    email_data = parse_email_from_stdin()
    print(json.dumps(email_data, ensure_ascii=False, indent=4))





