from google.oauth2 import service_account
from googleapiclient.discovery import build
import json

credentials = service_account.Credentials.from_service_account_file(
    'service-account.json',
    scopes=['https://www.googleapis.com/auth/indexing']
)

service = build('indexing', 'v3', credentials=credentials)

# Check a few random URLs to see their status
test_urls = [
    'https://www.prourlmonitor.com/',
    'https://www.prourlmonitor.com/tools/seo-audit',
    'https://www.prourlmonitor.com/tools/ai-content-detector',
    'https://www.prourlmonitor.com/tools/binary-converter',
    'https://www.prourlmonitor.com/tools/meta-generator'
]

print('Checking submission status for sample URLs...')
print('='*80)

for url in test_urls:
    try:
        request = service.urlNotifications().getMetadata(url=url)
        response = request.execute()
        print(f'\nURL: {url}')
        print(f'Status: SUBMITTED')
        latest = response.get('latestUpdate', {})
        notify_type = latest.get('type', 'N/A')
        notify_time = latest.get('notifyTime', 'N/A')
        print(f'Type: {notify_type}')
        print(f'Notify Time: {notify_time}')
    except Exception as e:
        print(f'\nURL: {url}')
        print(f'Status: NOT SUBMITTED')
        error_msg = str(e)
        print(f'Error: {error_msg}')
    print('-'*80)

print('\n\nKEY FINDINGS:')
print('='*80)
print('If URLs show "SUBMITTED" - Google received them via API')
print('If URLs show "NOT SUBMITTED" - They were never sent to Google')
print('\nNote: Search Console shows old data (Dec 23)')
print('This means Google hasnt crawled site recently or data is stale')
