"""
SEO Audit Script - Check Meta Tags and Content Length
======================================================

This script checks all pages for:
1. Meta title (present and optimal length 50-60 chars)
2. Meta description (present and optimal length 150-160 chars)
3. Content word count (minimum 1000 words)
4. H1 tag presence

Usage:
    python seo_audit.py
"""

import re
import time
from urllib.parse import urlparse
import requests
from bs4 import BeautifulSoup

# Load URLs
def load_urls(filename='sitemap-urls.txt'):
    """Load URLs from text file"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            urls = [line.strip() for line in f if line.strip()]
        return urls
    except FileNotFoundError:
        print(f"❌ Error: {filename} not found!")
        return []

# Count words in text
def count_words(text):
    """Count words in text content"""
    # Remove extra whitespace and count words
    words = re.findall(r'\b\w+\b', text)
    return len(words)

# Check single page
def check_page(url):
    """Check meta tags and content for a single page"""
    try:
        # Fetch page
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        # Parse HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Check meta title
        title_tag = soup.find('title')
        meta_title = title_tag.string.strip() if title_tag else None
        title_length = len(meta_title) if meta_title else 0
        
        # Check meta description
        meta_desc_tag = soup.find('meta', attrs={'name': 'description'})
        meta_description = meta_desc_tag.get('content', '').strip() if meta_desc_tag else None
        desc_length = len(meta_description) if meta_description else 0
        
        # Check H1
        h1_tag = soup.find('h1')
        h1_text = h1_tag.get_text().strip() if h1_tag else None
        
        # Count content words (excluding header, footer, nav)
        # Remove script and style elements
        for script in soup(["script", "style", "nav", "header", "footer"]):
            script.decompose()
        
        # Get text from main content
        main_content = soup.find('main') or soup.find('body')
        if main_content:
            text = main_content.get_text()
            word_count = count_words(text)
        else:
            word_count = 0
        
        # Determine issues
        issues = []
        if not meta_title:
            issues.append("❌ No meta title")
        elif title_length < 30:
            issues.append(f"⚠️ Title too short ({title_length} chars)")
        elif title_length > 60:
            issues.append(f"⚠️ Title too long ({title_length} chars)")
        
        if not meta_description:
            issues.append("❌ No meta description")
        elif desc_length < 120:
            issues.append(f"⚠️ Description too short ({desc_length} chars)")
        elif desc_length > 160:
            issues.append(f"⚠️ Description too long ({desc_length} chars)")
        
        if not h1_text:
            issues.append("❌ No H1 tag")
        
        if word_count < 1000:
            issues.append(f"⚠️ Low word count ({word_count} words, need 1000+)")
        
        return {
            'url': url,
            'meta_title': meta_title,
            'title_length': title_length,
            'meta_description': meta_description,
            'desc_length': desc_length,
            'h1': h1_text,
            'word_count': word_count,
            'issues': issues,
            'status': 'success'
        }
        
    except requests.exceptions.RequestException as e:
        return {
            'url': url,
            'meta_title': None,
            'title_length': 0,
            'meta_description': None,
            'desc_length': 0,
            'h1': None,
            'word_count': 0,
            'issues': [f"❌ Failed to fetch: {str(e)}"],
            'status': 'error'
        }
    except Exception as e:
        return {
            'url': url,
            'meta_title': None,
            'title_length': 0,
            'meta_description': None,
            'desc_length': 0,
            'h1': None,
            'word_count': 0,
            'issues': [f"❌ Error: {str(e)}"],
            'status': 'error'
        }

# Main execution
def main():
    print("=" * 80)
    print("SEO Audit - Meta Tags & Content Length Checker")
    print("=" * 80)
    print()
    
    # Load URLs
    print("📂 Loading URLs from sitemap-urls.txt...")
    urls = load_urls()
    
    if not urls:
        print("❌ No URLs found!")
        return
    
    print(f"✅ Loaded {len(urls)} URLs")
    print()
    
    # Check each page
    print("🔍 Checking pages...")
    print("-" * 80)
    
    results = []
    pages_with_issues = []
    perfect_pages = []
    
    for index, url in enumerate(urls, 1):
        print(f"\n[{index}/{len(urls)}] Checking: {url}")
        
        result = check_page(url)
        results.append(result)
        
        if result['status'] == 'success':
            print(f"   Title: {result['title_length']} chars | Description: {result['desc_length']} chars | Words: {result['word_count']}")
            
            if result['issues']:
                pages_with_issues.append(result)
                for issue in result['issues']:
                    print(f"   {issue}")
            else:
                perfect_pages.append(result)
                print("   ✅ Perfect! All SEO requirements met")
        else:
            pages_with_issues.append(result)
            print(f"   ❌ Failed to check")
        
        # Rate limiting - be nice to server
        if index < len(urls):
            time.sleep(0.5)
    
    # Generate Report
    print()
    print("=" * 80)
    print("SUMMARY REPORT")
    print("=" * 80)
    print(f"Total Pages: {len(urls)}")
    print(f"✅ Perfect Pages: {len(perfect_pages)}")
    print(f"⚠️  Pages with Issues: {len(pages_with_issues)}")
    print()
    
    # Categorize issues
    no_title = [r for r in pages_with_issues if not r['meta_title']]
    no_description = [r for r in pages_with_issues if not r['meta_description']]
    low_word_count = [r for r in pages_with_issues if r['word_count'] < 1000 and r['status'] == 'success']
    no_h1 = [r for r in pages_with_issues if not r['h1'] and r['status'] == 'success']
    
    print("📊 Issue Breakdown:")
    print(f"   ❌ Missing meta title: {len(no_title)} pages")
    print(f"   ❌ Missing meta description: {len(no_description)} pages")
    print(f"   ❌ No H1 tag: {len(no_h1)} pages")
    print(f"   ⚠️  Low word count (<1000): {len(low_word_count)} pages")
    print()
    
    # Detailed reports
    if no_title:
        print("=" * 80)
        print("PAGES MISSING META TITLE")
        print("=" * 80)
        for result in no_title:
            print(f"❌ {result['url']}")
        print()
    
    if no_description:
        print("=" * 80)
        print("PAGES MISSING META DESCRIPTION")
        print("=" * 80)
        for result in no_description:
            print(f"❌ {result['url']}")
        print()
    
    if low_word_count:
        print("=" * 80)
        print("PAGES WITH LOW WORD COUNT (<1000 words)")
        print("=" * 80)
        for result in low_word_count:
            print(f"⚠️  {result['url']} - {result['word_count']} words")
        print()
    
    # Save detailed report to CSV
    try:
        import csv
        with open('seo-audit-report.csv', 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['URL', 'Meta Title', 'Title Length', 'Meta Description', 'Desc Length', 'H1', 'Word Count', 'Issues'])
            
            for result in results:
                writer.writerow([
                    result['url'],
                    result['meta_title'] or 'MISSING',
                    result['title_length'],
                    result['meta_description'] or 'MISSING',
                    result['desc_length'],
                    result['h1'] or 'MISSING',
                    result['word_count'],
                    ' | '.join(result['issues']) if result['issues'] else 'OK'
                ])
        
        print("💾 Detailed report saved to: seo-audit-report.csv")
        print()
    except Exception as e:
        print(f"⚠️  Could not save CSV: {e}")
    
    # Save problem URLs
    if pages_with_issues:
        with open('pages-need-fixing.txt', 'w', encoding='utf-8') as f:
            for result in pages_with_issues:
                f.write(f"{result['url']}\n")
                for issue in result['issues']:
                    f.write(f"  {issue}\n")
                f.write("\n")
        print("💾 Pages needing fixes saved to: pages-need-fixing.txt")

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Process interrupted by user")
    except Exception as e:
        print(f"\n\n❌ Unexpected error: {e}")
