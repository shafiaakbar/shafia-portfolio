import logging

error_log_file = 'email_extraction_error.log'

# Error logging setup
error_logger = logging.getLogger('error_logger')
error_handler = logging.FileHandler(error_log_file)
error_handler.setLevel(logging.ERROR)
error_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
error_handler.setFormatter(error_formatter)
error_logger.addHandler(error_handler)

def log_error(message):
    error_logger.error(message)
