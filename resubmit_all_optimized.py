from google.oauth2 import service_account
from googleapiclient.discovery import build
import time

# Load credentials
credentials = service_account.Credentials.from_service_account_file(
    'service-account.json',
    scopes=['https://www.googleapis.com/auth/indexing']
)

# Build service
service = build('indexing', 'v3', credentials=credentials)

# Read URLs
with open('sitemap-urls.txt', 'r') as f:
    urls = [line.strip() for line in f if line.strip()]

print(f"Re-submitting {len(urls)} URLs with optimized meta tags...\n")
print("="*80)

success = 0
failed = 0
failed_urls = []

for i, url in enumerate(urls, 1):
    try:
        request = service.urlNotifications().publish(
            body={
                'url': url,
                'type': 'URL_UPDATED'
            }
        )
        response = request.execute()
        success += 1
        print(f"[{i}/{len(urls)}] SUCCESS - {url}")
        
        # Small delay to avoid rate limiting
        time.sleep(0.5)
        
    except Exception as e:
        failed += 1
        failed_urls.append((url, str(e)))
        print(f"[{i}/{len(urls)}] FAILED - {url} - Error: {str(e)}")

# Summary
print("\n" + "="*80)
print("RE-INDEXING COMPLETE!")
print("="*80)
print(f"Total URLs: {len(urls)}")
print(f"Successfully submitted: {success}")
print(f"Failed: {failed}")
print(f"Success rate: {(success/len(urls)*100):.1f}%")

if failed_urls:
    print(f"\nFailed URLs:")
    for url, error in failed_urls:
        print(f"  - {url}")
        print(f"    Error: {error}")

print("\n" + "="*80)
print("WHAT'S NEXT?")
print("="*80)
print("1. All URLs submitted with NEW optimized meta tags")
print("2. Vercel will auto-deploy changes in ~2-3 minutes")
print("3. Google will re-crawl and re-index pages in 2-7 days")
print("4. Expect indexing to improve from 31 to 100+ pages")
print("5. Monitor progress: site:https://www.prourlmonitor.com/ in Google")
print("\nIndexing should improve significantly with proper meta tags!")
