import os.path
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow


FILE_CREDENTIALS = 'secrets/credentials.json'
FILE_TOKENS = 'secrets/token.json'
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']


def get_creds(
    credentials_file=FILE_CREDENTIALS,
    tokens_file=FILE_TOKENS,
    persist_tokens=True,
    scopes=SCOPES,
):
    creds = None

    # Check for pre-existing tokens file
    if os.path.exists(tokens_file):
        creds = Credentials.from_authorized_user_file(tokens_file, scopes)

    # If there are no (valid) credentials available, let the user log in or refresh
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(credentials_file, scopes)
            creds = flow.run_local_server(port=0)

        # Save the credentials for the next run
        if persist_tokens:
            with open(tokens_file, 'w') as token:
                token.write(creds.to_json())
    
    return creds
