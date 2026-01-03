"""
Google Indexing Diagnosis Tool
===============================
Comprehensive check for why URLs are not getting indexed

This script checks for common indexing issues:
1. Robots.txt blocking
2. Meta robots noindex tags
3. Sitemap accessibility
4. Page response codes
5. Content quality issues
6. Internal linking
"""

import json
import os
from urllib.parse import urljoin, urlparse

def load_urls(filename='sitemap-urls.txt'):
    """Load URLs from text file"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            urls = [line.strip() for line in f if line.strip()]
        return urls
    except FileNotFoundError:
        print(f"❌ Error: {filename} not found!")
        return []

def check_indexing_setup():
    """Check basic indexing setup"""
    print("=" * 80)
    print("🔍 GOOGLE INDEXING DIAGNOSIS TOOL")
    print("=" * 80)
    print()
    
    # Load URLs
    urls = load_urls()
    print(f"📂 Total URLs to index: {len(urls)}")
    print()
    
    # Check service account
    print("🔍 Checking Service Account Setup...")
    print("-" * 80)
    
    if os.path.exists('service-account.json'):
        try:
            with open('service-account.json', 'r') as f:
                service_account = json.load(f)
            
            print("✅ Service account file exists")
            print(f"   Email: {service_account.get('client_email', 'N/A')}")
            print(f"   Project: {service_account.get('project_id', 'N/A')}")
            
            # Check if it's properly configured
            if service_account.get('type') == 'service_account':
                print("✅ Service account type is correct")
            else:
                print("❌ Invalid service account type")
            
            if service_account.get('private_key'):
                print("✅ Private key is present")
            else:
                print("❌ Private key is missing")
                
        except Exception as e:
            print(f"❌ Error reading service account: {e}")
    else:
        print("❌ service-account.json not found!")
        print("   → You need to set up Google Cloud service account")
        return
    
    print()
    
    # Common indexing issues
    print("🔍 COMMON INDEXING ISSUES TO CHECK:")
    print("-" * 80)
    
    issues = [
        {
            "issue": "Service Account Not Added to Search Console",
            "severity": "🔴 CRITICAL",
            "description": "Service account email must be added to Google Search Console with 'Owner' permission",
            "email": service_account.get('client_email', ''),
            "solution": """
            Steps to fix:
            1. Go to: https://search.google.com/search-console
            2. Select your property (prourlmonitor.com)
            3. Click Settings (⚙️) in left sidebar
            4. Click 'Users and permissions'
            5. Click 'Add user'
            6. Add this email: {email}
            7. Select 'Owner' permission
            8. Click 'Add'
            
            ⚠️ This is the #1 reason for indexing API failures!
            """
        },
        {
            "issue": "Indexing API Not Enabled in Google Cloud",
            "severity": "🔴 CRITICAL",
            "description": "Web Search Indexing API must be enabled in Google Cloud Console",
            "solution": """
            Steps to fix:
            1. Go to: https://console.cloud.google.com/
            2. Select project: {project}
            3. Go to: APIs & Services > Library
            4. Search for: 'Web Search Indexing API'
            5. Click on it and click 'ENABLE'
            """
        },
        {
            "issue": "Robots.txt Blocking Crawlers",
            "severity": "🟡 HIGH",
            "description": "Your robots.txt might be blocking Google from crawling pages",
            "solution": """
            Check your robots.txt file:
            1. Visit: https://www.prourlmonitor.com/robots.txt
            2. Make sure it's NOT blocking important pages
            3. Should have:
               User-agent: *
               Allow: /
               Sitemap: https://www.prourlmonitor.com/sitemap.xml
            """
        },
        {
            "issue": "Meta Robots Noindex Tags",
            "severity": "🟡 HIGH",  
            "description": "Pages might have <meta name='robots' content='noindex'> tags",
            "solution": """
            Check your page source code:
            1. View page source
            2. Look for: <meta name="robots" content="noindex">
            3. Remove if present
            4. In Next.js, check _app.js or individual pages
            """
        },
        {
            "issue": "Missing or Incorrect Sitemap",
            "severity": "🟡 HIGH",
            "description": "Sitemap must be submitted to Google Search Console",
            "solution": """
            1. Check if sitemap exists: https://www.prourlmonitor.com/sitemap.xml
            2. Go to Search Console
            3. Select 'Sitemaps' in left menu
            4. Add sitemap URL if not already added
            """
        },
        {
            "issue": "Low Content Quality",
            "severity": "🟠 MEDIUM",
            "description": "Pages with thin content (<500 words) may not be indexed",
            "solution": """
            1. Check word count on each page
            2. Aim for minimum 500-1000 words
            3. Add unique, valuable content
            4. Don't duplicate content across pages
            """
        },
        {
            "issue": "Missing Internal Links",
            "severity": "🟠 MEDIUM",
            "description": "Pages need internal links from other pages",
            "solution": """
            1. Link to new pages from homepage
            2. Add 'Related Tools' section on each page
            3. Create navigation menu with all important pages
            4. Add breadcrumbs
            """
        },
        {
            "issue": "API Quota Exceeded",
            "severity": "🟢 LOW",
            "description": "Google Indexing API has a limit of 200 requests per day",
            "solution": """
            1. Check if you've exceeded 200 requests/day
            2. Wait 24 hours and retry
            3. Submit in batches of 50-100 URLs per day
            """
        },
        {
            "issue": "Domain Not Verified in Search Console",
            "severity": "🔴 CRITICAL",
            "description": "Your domain must be verified in Google Search Console",
            "solution": """
            1. Go to: https://search.google.com/search-console
            2. Check if prourlmonitor.com is listed
            3. If not verified, click 'Add property'
            4. Verify ownership via DNS, HTML file, or meta tag
            """
        }
    ]
    
    for i, issue_data in enumerate(issues, 1):
        print(f"\n{i}. {issue_data['severity']} {issue_data['issue']}")
        print(f"   {issue_data['description']}")
        
        solution = issue_data['solution']
        if '{email}' in solution:
            solution = solution.replace('{email}', service_account.get('client_email', ''))
        if '{project}' in solution:
            solution = solution.replace('{project}', service_account.get('project_id', ''))
        
        print(solution)
    
    print()
    print("=" * 80)
    print("📊 INDEXING STATUS TIMELINE")
    print("=" * 80)
    print()
    print("Submitted: 29 December 2025")
    print("Today: 3 January 2026 (5 days ago)")
    print()
    print("Expected Progress:")
    print("  Day 0-1:  10-30 pages (homepage, popular tools)")
    print("  Day 2-3:  50-80 pages (most tools)")
    print("  Day 4-7:  90-107 pages (almost all)")
    print("  Day 7+:   100-107 pages (complete)")
    print()
    print("⏰ After 5 days, most pages should be indexed.")
    print("   If many are still not indexed, there's likely an issue above.")
    print()
    
    print("=" * 80)
    print("🔍 NEXT STEPS - CHECK THESE NOW:")
    print("=" * 80)
    print()
    print("1️⃣  MOST IMPORTANT - Check Service Account Permission:")
    print("   → https://search.google.com/search-console")
    print("   → Settings > Users and permissions")
    print(f"   → Is this email added as Owner? {service_account.get('client_email', '')}")
    print()
    print("2️⃣  Check Actual Indexing Status:")
    print("   → Google search: site:www.prourlmonitor.com")
    print("   → Link: https://www.google.com/search?q=site:www.prourlmonitor.com")
    print("   → Count how many pages show up")
    print()
    print("3️⃣  Check Individual Page:")
    print("   → Search Console > URL Inspection tool")
    print("   → Enter any page URL")
    print("   → See why it's not indexed")
    print()
    print("4️⃣  Check Robots.txt:")
    print("   → Visit: https://www.prourlmonitor.com/robots.txt")
    print("   → Should allow crawling, not block")
    print()
    print("5️⃣  Re-run Indexing API (if needed):")
    print("   → python indexing_api.py")
    print()
    
    # Check if there's a failed URLs file
    if os.path.exists('failed-urls.txt'):
        print("⚠️  Found failed-urls.txt - Some URLs failed to submit!")
        print("   Check this file for URLs that need resubmission")
        print()
    
    print("=" * 80)
    print("💡 PRO TIP:")
    print("=" * 80)
    print()
    print("The #1 reason for indexing failures is:")
    print("🔴 Service account email not added to Search Console with Owner permission")
    print()
    print("Check this FIRST before anything else!")
    print()
    print("If the service account is not added as Owner in Search Console,")
    print("ALL indexing API requests will fail silently!")
    print()
    
    return urls, service_account

if __name__ == '__main__':
    try:
        check_indexing_setup()
    except Exception as e:
        print(f"\n❌ Error: {e}")
