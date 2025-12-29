"""
Google Search Console Indexing API Script
==========================================

Setup Instructions:
1. Go to: https://console.cloud.google.com/
2. Create a new project or select existing
3. Enable "Web Search Indexing API"
4. Create Service Account:
   - Go to IAM & Admin > Service Accounts
   - Create Service Account
   - Download JSON key file
5. Add service account email to Google Search Console:
   - Go to: https://search.google.com/search-console
   - Select your property
   - Settings > Users and permissions
   - Add service account email with "Owner" permission
6. Save JSON file as 'service-account.json' in same folder
7. Install required packages: pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client

Usage:
    python indexing_api.py
"""

import json
import time
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Configuration
SERVICE_ACCOUNT_FILE = 'service-account.json'  # Your JSON key file
SCOPES = ['https://www.googleapis.com/auth/indexing']

# Load URLs from file
def load_urls(filename='sitemap-urls.txt'):
    """Load URLs from text file"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            urls = [line.strip() for line in f if line.strip()]
        return urls
    except FileNotFoundError:
        print(f"❌ Error: {filename} not found!")
        return []

# Authenticate with Google
def get_indexing_service():
    """Create authenticated indexing service"""
    try:
        credentials = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_FILE, 
            scopes=SCOPES
        )
        service = build('indexing', 'v3', credentials=credentials)
        return service
    except FileNotFoundError:
        print(f"❌ Error: {SERVICE_ACCOUNT_FILE} not found!")
        print("Please download JSON key from Google Cloud Console")
        return None
    except Exception as e:
        print(f"❌ Authentication error: {e}")
        return None

# Send indexing request
def submit_url_for_indexing(service, url, notification_type='URL_UPDATED'):
    """
    Submit URL for indexing
    notification_type: 'URL_UPDATED' or 'URL_DELETED'
    """
    try:
        body = {
            'url': url,
            'type': notification_type
        }
        
        response = service.urlNotifications().publish(body=body).execute()
        return True, response
    
    except HttpError as e:
        error_details = json.loads(e.content.decode('utf-8'))
        error_message = error_details.get('error', {}).get('message', str(e))
        return False, error_message
    
    except Exception as e:
        return False, str(e)

# Get URL status
def get_url_status(service, url):
    """Check indexing status of URL"""
    try:
        response = service.urlNotifications().getMetadata(url=url).execute()
        return True, response
    except HttpError as e:
        return False, str(e)
    except Exception as e:
        return False, str(e)

# Main execution
def main():
    print("=" * 60)
    print("Google Search Console Indexing API - Batch URL Submitter")
    print("=" * 60)
    print()
    
    # Load URLs
    print("📂 Loading URLs from sitemap-urls.txt...")
    urls = load_urls()
    
    if not urls:
        print("❌ No URLs found!")
        return
    
    print(f"✅ Loaded {len(urls)} URLs")
    print()
    
    # Authenticate
    print("🔐 Authenticating with Google...")
    service = get_indexing_service()
    
    if not service:
        return
    
    print("✅ Authentication successful!")
    print()
    
    # Submit URLs
    print("📤 Submitting URLs for indexing...")
    print("-" * 60)
    
    success_count = 0
    failed_count = 0
    failed_urls = []
    
    for index, url in enumerate(urls, 1):
        print(f"\n[{index}/{len(urls)}] Processing: {url}")
        
        success, result = submit_url_for_indexing(service, url)
        
        if success:
            success_count += 1
            print(f"✅ Success!")
            # Uncomment to see full response:
            # print(f"   Response: {result}")
        else:
            failed_count += 1
            failed_urls.append((url, result))
            print(f"❌ Failed: {result}")
        
        # Rate limiting: Google allows 200 requests per day
        # Add delay to avoid hitting rate limits too quickly
        if index < len(urls):
            time.sleep(0.5)  # 0.5 second delay between requests
    
    # Summary
    print()
    print("=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Total URLs: {len(urls)}")
    print(f"✅ Successfully submitted: {success_count}")
    print(f"❌ Failed: {failed_count}")
    
    if failed_urls:
        print()
        print("Failed URLs:")
        print("-" * 60)
        for url, error in failed_urls:
            print(f"❌ {url}")
            print(f"   Error: {error}")
    
    # Daily quota info
    print()
    print("ℹ️  Google Indexing API Limits:")
    print("   - 200 requests per day")
    print("   - 600 requests per minute")
    print()
    
    # Save failed URLs for retry
    if failed_urls:
        with open('failed-urls.txt', 'w', encoding='utf-8') as f:
            for url, error in failed_urls:
                f.write(f"{url}\n")
        print("💾 Failed URLs saved to: failed-urls.txt")

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Process interrupted by user")
    except Exception as e:
        print(f"\n\n❌ Unexpected error: {e}")
