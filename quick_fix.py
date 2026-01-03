"""
Quick Indexing Status Checker & Fixer
======================================

This script helps you:
1. Check current indexing status
2. Identify common issues
3. Provide quick fixes
"""

import json
import os
import sys

def print_header(text):
    print("\n" + "=" * 80)
    print(text)
    print("=" * 80)

def print_section(text):
    print("\n" + "-" * 80)
    print(text)
    print("-" * 80)

def check_service_account():
    """Check if service account is properly configured"""
    if not os.path.exists('service-account.json'):
        return False, "service-account.json file not found"
    
    try:
        with open('service-account.json', 'r') as f:
            sa = json.load(f)
        
        required_keys = ['type', 'project_id', 'private_key', 'client_email']
        missing = [key for key in required_keys if key not in sa]
        
        if missing:
            return False, f"Missing keys: {', '.join(missing)}"
        
        if sa.get('type') != 'service_account':
            return False, "Invalid service account type"
        
        return True, sa
    except Exception as e:
        return False, str(e)

def check_urls_file():
    """Check if URLs file exists"""
    if not os.path.exists('sitemap-urls.txt'):
        return False, "sitemap-urls.txt not found"
    
    try:
        with open('sitemap-urls.txt', 'r') as f:
            urls = [line.strip() for line in f if line.strip()]
        
        if not urls:
            return False, "No URLs found in sitemap-urls.txt"
        
        return True, len(urls)
    except Exception as e:
        return False, str(e)

def main():
    print_header("🔧 QUICK INDEXING STATUS CHECKER")
    
    print("\n📋 Running diagnostics...\n")
    
    # Check 1: Service Account
    print("1. Checking service account file...")
    success, result = check_service_account()
    
    if success:
        print(f"   ✅ Service account file OK")
        print(f"   📧 Email: {result.get('client_email')}")
        print(f"   🏢 Project: {result.get('project_id')}")
        sa_email = result.get('client_email')
        project_id = result.get('project_id')
    else:
        print(f"   ❌ ERROR: {result}")
        return
    
    # Check 2: URLs file
    print("\n2. Checking URLs file...")
    success, result = check_urls_file()
    
    if success:
        print(f"   ✅ URLs file OK")
        print(f"   📂 Total URLs: {result}")
        total_urls = result
    else:
        print(f"   ❌ ERROR: {result}")
        return
    
    # Check 3: Failed URLs
    print("\n3. Checking for previous failures...")
    if os.path.exists('failed-urls.txt'):
        with open('failed-urls.txt', 'r') as f:
            failed = [line.strip() for line in f if line.strip()]
        print(f"   ⚠️  Found {len(failed)} failed URLs from previous run")
        print("   💡 You should retry submitting these")
    else:
        print("   ✅ No failed URLs found")
    
    # Summary
    print_header("📊 QUICK CHECKLIST")
    
    checklist = [
        {
            "task": "Service Account Added to Search Console?",
            "status": "⚠️  NEED TO CHECK",
            "action": f"Add {sa_email} as Owner in Search Console",
            "url": "https://search.google.com/search-console"
        },
        {
            "task": "Web Search Indexing API Enabled?",
            "status": "⚠️  NEED TO CHECK",
            "action": f"Enable API in project: {project_id}",
            "url": "https://console.cloud.google.com/apis/library"
        },
        {
            "task": "Domain Verified in Search Console?",
            "status": "⚠️  NEED TO CHECK",
            "action": "Verify domain ownership",
            "url": "https://search.google.com/search-console"
        },
        {
            "task": "Sitemap Submitted?",
            "status": "⚠️  NEED TO CHECK",
            "action": "Submit sitemap.xml in Search Console",
            "url": "https://search.google.com/search-console"
        },
        {
            "task": "Check Current Indexing Status",
            "status": "⚠️  NEED TO CHECK",
            "action": "Search: site:www.prourlmonitor.com",
            "url": "https://www.google.com/search?q=site:www.prourlmonitor.com"
        }
    ]
    
    print()
    for i, item in enumerate(checklist, 1):
        print(f"{i}. {item['task']}")
        print(f"   Status: {item['status']}")
        print(f"   Action: {item['action']}")
        print(f"   Link:   {item['url']}")
        print()
    
    print_header("🚀 NEXT STEPS")
    
    steps = """
1. Open Google Search Console: https://search.google.com/search-console
   
2. Go to Settings > Users and Permissions
   → Add email: {email}
   → Permission: Owner
   → Click Add

3. Go to Google Cloud Console: https://console.cloud.google.com/
   → Select project: {project}
   → APIs & Services > Library
   → Search: Web Search Indexing API
   → Click Enable

4. After completing above steps, re-run indexing:
   → python indexing_api.py

5. Wait 24-48 hours and check status:
   → https://www.google.com/search?q=site:www.prourlmonitor.com

6. For detailed issues, check individual pages:
   → Search Console > URL Inspection
   → Paste any URL to see why it's not indexed
    """.format(email=sa_email, project=project_id)
    
    print(steps)
    
    print_header("💡 MOST COMMON ISSUES")
    
    issues = """
🔴 #1 ISSUE (90% of cases):
   Service account email NOT added to Search Console as Owner
   → This causes ALL API requests to fail silently
   → Must fix this first!

🔴 #2 ISSUE:
   Web Search Indexing API not enabled
   → API calls won't work without this
   → Enable in Google Cloud Console

🟡 #3 ISSUE:
   Low content quality (< 500 words per page)
   → Google may skip thin content pages
   → Add more content, FAQs, guides

🟡 #4 ISSUE:
   Missing internal links
   → Pages need links from other pages
   → Add related tools, navigation
    """
    
    print(issues)
    
    print_header("✅ READY TO RE-SUBMIT?")
    print()
    print("If you've fixed the issues above, run:")
    print("   python indexing_api.py")
    print()
    print(f"This will submit {total_urls} URLs to Google for indexing.")
    print()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nProcess interrupted.")
    except Exception as e:
        print(f"\n\n❌ Error: {e}")
