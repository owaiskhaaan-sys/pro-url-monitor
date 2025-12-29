"""
Google Indexing Status Checker
===============================
Check how many URLs from sitemap are indexed by Google
"""

import requests
from bs4 import BeautifulSoup
import time
from urllib.parse import quote_plus

def check_google_index(url):
    """Check if a URL is indexed in Google using site: search"""
    try:
        # Use site: search to check indexing
        search_query = f"site:{url}"
        search_url = f"https://www.google.com/search?q={quote_plus(search_query)}"
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(search_url, headers=headers, timeout=10)
        
        # Check if page found in results
        if 'did not match any documents' in response.text or 'No results found' in response.text:
            return False
        elif 'About' in response.text or 'results' in response.text:
            return True
        else:
            return None  # Uncertain
            
    except Exception as e:
        print(f"Error checking {url}: {e}")
        return None

def load_urls(filename='sitemap-urls.txt'):
    """Load URLs from text file"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            urls = [line.strip() for line in f if line.strip()]
        return urls
    except FileNotFoundError:
        print(f"❌ Error: {filename} not found!")
        return []

def check_indexing_status():
    """Check indexing status for all URLs"""
    print("=" * 80)
    print("Google Indexing Status Checker")
    print("=" * 80)
    print()
    print("⚠️  Note: This uses Google search to check indexing status.")
    print("    For accurate data, check Google Search Console directly.")
    print()
    
    urls = load_urls()
    
    if not urls:
        return
    
    print(f"📂 Loaded {len(urls)} URLs")
    print()
    
    indexed = []
    not_indexed = []
    uncertain = []
    
    print("🔍 Checking indexing status (this may take a while)...")
    print("-" * 80)
    
    for i, url in enumerate(urls[:10], 1):  # Check first 10 to avoid rate limiting
        print(f"[{i}/10] Checking: {url}")
        
        status = check_google_index(url)
        
        if status == True:
            indexed.append(url)
            print("   ✅ INDEXED")
        elif status == False:
            not_indexed.append(url)
            print("   ❌ NOT INDEXED")
        else:
            uncertain.append(url)
            print("   ⚠️  UNCERTAIN")
        
        # Rate limiting - be nice to Google
        time.sleep(2)
    
    # Summary
    print()
    print("=" * 80)
    print("SUMMARY (First 10 URLs)")
    print("=" * 80)
    print(f"✅ Indexed: {len(indexed)}/10")
    print(f"❌ Not Indexed: {len(not_indexed)}/10")
    print(f"⚠️  Uncertain: {len(uncertain)}/10")
    print()
    
    if indexed:
        print("Indexed URLs:")
        for url in indexed:
            print(f"  ✅ {url}")
        print()
    
    if not_indexed:
        print("Not Indexed Yet:")
        for url in not_indexed:
            print(f"  ❌ {url}")
        print()
    
    print("=" * 80)
    print("📊 BETTER OPTION: Check Google Search Console")
    print("=" * 80)
    print()
    print("For accurate indexing data:")
    print("1. Go to: https://search.google.com/search-console")
    print("2. Select your property: prourlmonitor.com")
    print("3. Click 'Coverage' or 'Pages' in left sidebar")
    print("4. Check 'Indexed' pages count")
    print()
    print("Or check specific URL:")
    print("1. Use 'URL Inspection' tool in Search Console")
    print("2. Paste any URL from your sitemap")
    print("3. See indexing status and last crawl date")
    print()

def quick_site_check():
    """Quick check using site: operator"""
    print("=" * 80)
    print("Quick Site Indexing Check")
    print("=" * 80)
    print()
    
    domain = "www.prourlmonitor.com"
    
    print(f"🔍 Checking: site:{domain}")
    print()
    print("To manually check:")
    print(f"1. Go to: https://www.google.com/search?q=site:{domain}")
    print(f"2. Count total results shown")
    print()
    print("Expected: ~107-118 pages indexed")
    print("Note: Indexing takes 1-3 days after submission")
    print()

if __name__ == '__main__':
    import sys
    
    print()
    choice = input("Choose option:\n1. Quick site check (manual)\n2. Check first 10 URLs (automated)\n\nEnter 1 or 2: ")
    
    if choice == '1':
        quick_site_check()
    elif choice == '2':
        check_indexing_status()
    else:
        print("Invalid choice. Run script again.")
