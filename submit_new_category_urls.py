"""
Submit New Category Pages to Google Indexing API
=================================================
This script submits only the new category pages created today
"""

import json
import time
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SERVICE_ACCOUNT_FILE = 'service-account.json'
SCOPES = ['https://www.googleapis.com/auth/indexing']

# New category URLs to submit
NEW_CATEGORY_URLS = [
    'https://www.prourlmonitor.com/tools/category/seo',
    'https://www.prourlmonitor.com/tools/category/domain',
    'https://www.prourlmonitor.com/tools/category/network',
    'https://www.prourlmonitor.com/tools/category/text',
    'https://www.prourlmonitor.com/tools/category/code',
    'https://www.prourlmonitor.com/tools/category/converters',
    'https://www.prourlmonitor.com/tools/category/ai',
]

def get_indexing_service():
    """Create authenticated indexing service"""
    try:
        credentials = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_FILE, 
            scopes=SCOPES
        )
        service = build('indexing', 'v3', credentials=credentials)
        return service
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def submit_url(service, url):
    """Submit URL for indexing"""
    try:
        body = {
            'url': url,
            'type': 'URL_UPDATED'
        }
        response = service.urlNotifications().publish(body=body).execute()
        return True, response
    except HttpError as e:
        error_details = json.loads(e.content.decode('utf-8'))
        error_message = error_details.get('error', {}).get('message', str(e))
        return False, error_message
    except Exception as e:
        return False, str(e)

def main():
    print("=" * 80)
    print("🆕 SUBMITTING NEW CATEGORY PAGES TO GOOGLE")
    print("=" * 80)
    print()
    print("📊 New Pages Created:")
    print("   7 category pages for better organization")
    print()
    print("-" * 80)
    
    # Get service
    service = get_indexing_service()
    if not service:
        return
    
    print("✅ Connected to Google Indexing API")
    print()
    print("📤 Submitting category pages...")
    print("-" * 80)
    
    success_count = 0
    failed_count = 0
    
    for index, url in enumerate(NEW_CATEGORY_URLS, 1):
        print(f"\n[{index}/{len(NEW_CATEGORY_URLS)}] {url}")
        
        success, result = submit_url(service, url)
        
        if success:
            success_count += 1
            print(f"   ✅ Successfully submitted")
        else:
            failed_count += 1
            print(f"   ❌ Failed: {result}")
        
        # Rate limiting
        if index < len(NEW_CATEGORY_URLS):
            time.sleep(0.5)
    
    # Summary
    print()
    print("=" * 80)
    print("📊 SUBMISSION COMPLETE")
    print("=" * 80)
    print()
    print(f"Total URLs: {len(NEW_CATEGORY_URLS)}")
    print(f"✅ Successfully submitted: {success_count}")
    print(f"❌ Failed: {failed_count}")
    print()
    print("=" * 80)
    print("⏰ WHAT'S NEXT?")
    print("=" * 80)
    print()
    print("These new category pages will be indexed by Google in 2-5 days.")
    print()
    print("Benefits:")
    print("   ✅ Better site structure")
    print("   ✅ More pages in Google index")
    print("   ✅ Improved navigation for users")
    print("   ✅ Enhanced internal linking")
    print()
    print("Monitor progress:")
    print("   → https://www.google.com/search?q=site:www.prourlmonitor.com/tools/category")
    print()
    print("=" * 80)

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Process interrupted")
    except Exception as e:
        print(f"\n\n❌ Error: {e}")
