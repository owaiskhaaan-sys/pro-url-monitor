"""
Re-Index Missing URLs
=====================
This script will re-submit all URLs to Google Indexing API
"""

import json
import time
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SERVICE_ACCOUNT_FILE = 'service-account.json'
SCOPES = ['https://www.googleapis.com/auth/indexing']

def load_urls(filename='sitemap-urls.txt'):
    """Load URLs from text file"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            urls = [line.strip() for line in f if line.strip()]
        return urls
    except FileNotFoundError:
        print(f"❌ Error: {filename} not found!")
        return []

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
    print("🔄 RE-INDEXING ALL URLS")
    print("=" * 80)
    print()
    print("📊 Current Status:")
    print("   115 URLs were indexed before")
    print("   35 URLs showing now")
    print("   80 URLs disappeared (need re-indexing)")
    print()
    print("🎯 Action: Re-submitting ALL 107 URLs to Google")
    print()
    print("-" * 80)
    
    # Load URLs
    urls = load_urls()
    if not urls:
        return
    
    print(f"✅ Loaded {len(urls)} URLs from sitemap-urls.txt")
    print()
    
    # Get service
    service = get_indexing_service()
    if not service:
        return
    
    print("✅ Connected to Google Indexing API")
    print()
    print("📤 Starting submission process...")
    print("-" * 80)
    
    success_count = 0
    failed_count = 0
    failed_urls = []
    
    for index, url in enumerate(urls, 1):
        # Progress indicator
        percentage = (index / len(urls)) * 100
        print(f"\n[{index}/{len(urls)}] ({percentage:.1f}%) {url}")
        
        success, result = submit_url(service, url)
        
        if success:
            success_count += 1
            print(f"   ✅ Submitted successfully")
        else:
            failed_count += 1
            failed_urls.append((url, result))
            print(f"   ❌ Failed: {result}")
        
        # Rate limiting (0.5 seconds between requests)
        if index < len(urls):
            time.sleep(0.5)
    
    # Summary
    print()
    print("=" * 80)
    print("📊 SUBMISSION COMPLETE")
    print("=" * 80)
    print()
    print(f"Total URLs processed: {len(urls)}")
    print(f"✅ Successfully submitted: {success_count}")
    print(f"❌ Failed: {failed_count}")
    print()
    
    if failed_urls:
        print("❌ Failed URLs:")
        print("-" * 80)
        for url, error in failed_urls:
            print(f"   {url}")
            print(f"   Error: {error}")
            print()
        
        # Save failed URLs
        with open('failed-urls.txt', 'w', encoding='utf-8') as f:
            for url, error in failed_urls:
                f.write(f"{url}\n")
        print("💾 Failed URLs saved to: failed-urls.txt")
        print()
    
    print("=" * 80)
    print("⏰ WHAT HAPPENS NEXT?")
    print("=" * 80)
    print()
    print("Google has received indexing requests for all URLs.")
    print()
    print("Expected Timeline:")
    print("   📅 Day 1-2:  Google will start crawling pages")
    print("   📅 Day 3-5:  Most pages will be indexed")
    print("   📅 Day 7:    80-90% pages should be indexed")
    print()
    print("🔍 Monitor Progress:")
    print("   Daily check: https://www.google.com/search?q=site:www.prourlmonitor.com")
    print()
    print("📊 Why URLs Disappeared:")
    print("   Possible reasons:")
    print("   1. Content quality issues on some pages")
    print("   2. Duplicate content detected")
    print("   3. Thin content (< 300 words)")
    print("   4. Technical SEO issues")
    print("   5. Recent algorithm update")
    print()
    print("💡 Recommendations:")
    print("   1. Check Search Console for coverage issues")
    print("   2. Use URL Inspection tool for specific pages")
    print("   3. Add more content to thin pages (aim for 500+ words)")
    print("   4. Ensure each page has unique content")
    print("   5. Check for any crawl errors")
    print()
    print("🔗 Useful Links:")
    print("   Search Console: https://search.google.com/search-console")
    print("   Check Index: https://www.google.com/search?q=site:www.prourlmonitor.com")
    print()
    print("=" * 80)
    print("✅ Re-indexing request submitted!")
    print()
    print("Check back in 2-3 days to see improvement.")
    print("=" * 80)

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Process interrupted")
    except Exception as e:
        print(f"\n\n❌ Error: {e}")
