import requests
import time
from urllib.parse import quote

# Read all URLs from sitemap
with open('sitemap-urls.txt', 'r') as f:
    urls = [line.strip() for line in f if line.strip()]

print(f"📋 Checking {len(urls)} URLs for indexing status...\n")

indexed = []
not_indexed = []

for i, url in enumerate(urls, 1):
    # Check if URL is indexed by searching for it
    search_url = f"https://www.google.com/search?q={quote(url)}"
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(search_url, headers=headers, timeout=10)
        
        # Simple check - if exact URL appears in results, it's likely indexed
        if url in response.text and 'did not match any documents' not in response.text.lower():
            indexed.append(url)
            status = "✅ INDEXED"
        else:
            not_indexed.append(url)
            status = "❌ NOT INDEXED"
        
        print(f"{i}/{len(urls)} - {status} - {url}")
        
        # Sleep to avoid rate limiting
        time.sleep(2)
        
    except Exception as e:
        print(f"{i}/{len(urls)} - ⚠️ ERROR - {url} - {str(e)}")
        not_indexed.append(url)
    
    # Break after every 10 to avoid blocking
    if i % 10 == 0:
        print(f"\n⏸️ Pausing for 10 seconds to avoid rate limiting...\n")
        time.sleep(10)

# Summary
print("\n" + "="*80)
print("📊 INDEXING SUMMARY")
print("="*80)
print(f"✅ Indexed: {len(indexed)}/{len(urls)}")
print(f"❌ Not Indexed: {len(not_indexed)}/{len(urls)}")
print(f"📈 Indexing Rate: {(len(indexed)/len(urls)*100):.1f}%")

# Save results
with open('indexed_urls.txt', 'w') as f:
    for url in indexed:
        f.write(url + '\n')

with open('not_indexed_urls.txt', 'w') as f:
    for url in not_indexed:
        f.write(url + '\n')

print(f"\n💾 Results saved:")
print(f"  - indexed_urls.txt ({len(indexed)} URLs)")
print(f"  - not_indexed_urls.txt ({len(not_indexed)} URLs)")
