import os
import re

print("🔍 Analyzing Content Quality for All Tool Pages...\n")

tools_dir = "pages/tools"
issues = []
analysis = []

# Get all tool files
tool_files = [f for f in os.listdir(tools_dir) if f.endswith('.js') and f != 'bulk.js']

print(f"📄 Found {len(tool_files)} tool pages to analyze\n")
print("="*100)

for tool_file in tool_files:
    file_path = os.path.join(tools_dir, tool_file)
    tool_name = tool_file.replace('.js', '')
    url = f"https://www.prourlmonitor.com/tools/{tool_name}"
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Analysis metrics
    metrics = {
        'file': tool_file,
        'url': url,
        'has_title': False,
        'has_description': False,
        'has_canonical': False,
        'title_length': 0,
        'desc_length': 0,
        'word_count': 0,
        'has_h1': False,
        'has_schema': False,
        'issues': []
    }
    
    # Check for title tag
    title_match = re.search(r'<title>(.*?)</title>', content)
    if title_match:
        metrics['has_title'] = True
        metrics['title_length'] = len(title_match.group(1))
        if metrics['title_length'] < 30 or metrics['title_length'] > 60:
            metrics['issues'].append(f"⚠️ Title length {metrics['title_length']} (should be 30-60)")
    else:
        metrics['issues'].append("❌ No title tag found")
    
    # Check for meta description
    desc_match = re.search(r'<meta name="description" content="(.*?)"', content)
    if desc_match:
        metrics['has_description'] = True
        metrics['desc_length'] = len(desc_match.group(1))
        if metrics['desc_length'] < 120 or metrics['desc_length'] > 160:
            metrics['issues'].append(f"⚠️ Description length {metrics['desc_length']} (should be 120-160)")
    else:
        metrics['issues'].append("❌ No meta description found")
    
    # Check for canonical
    if 'rel="canonical"' in content:
        metrics['has_canonical'] = True
    else:
        metrics['issues'].append("⚠️ No canonical URL")
    
    # Check for H1
    if '<h1' in content:
        metrics['has_h1'] = True
    else:
        metrics['issues'].append("❌ No H1 heading")
    
    # Estimate word count (rough estimation)
    # Remove JSX/code and count text content
    text_content = re.sub(r'<[^>]+>', '', content)
    text_content = re.sub(r'{.*?}', '', text_content)
    words = len(text_content.split())
    metrics['word_count'] = words
    
    if words < 300:
        metrics['issues'].append(f"⚠️ Low word count: {words} (should be 300+)")
    
    # Check for schema markup
    if 'schema.org' in content or '@type' in content:
        metrics['has_schema'] = True
    
    analysis.append(metrics)
    
    # Print status
    status = "✅ GOOD" if len(metrics['issues']) == 0 else f"⚠️ {len(metrics['issues'])} ISSUES"
    print(f"{status} - {tool_name}")
    if metrics['issues']:
        for issue in metrics['issues']:
            print(f"  {issue}")
    print()

# Summary
print("\n" + "="*100)
print("📊 CONTENT QUALITY SUMMARY")
print("="*100)

good_pages = [m for m in analysis if len(m['issues']) == 0]
poor_pages = [m for m in analysis if len(m['issues']) >= 3]

print(f"✅ Good Quality Pages: {len(good_pages)}/{len(analysis)}")
print(f"⚠️ Pages with 3+ Issues: {len(poor_pages)}/{len(analysis)}")
print(f"\n📉 Average Word Count: {sum(m['word_count'] for m in analysis) / len(analysis):.0f} words")

# Pages with most issues
print(f"\n🔴 TOP 10 PAGES WITH MOST ISSUES:")
print("="*100)
sorted_analysis = sorted(analysis, key=lambda x: len(x['issues']), reverse=True)[:10]
for i, page in enumerate(sorted_analysis, 1):
    print(f"{i}. {page['file']} - {len(page['issues'])} issues")
    print(f"   URL: {page['url']}")
    print(f"   Word Count: {page['word_count']}, Title: {page['title_length']}ch, Desc: {page['desc_length']}ch")
    for issue in page['issues']:
        print(f"   {issue}")
    print()

# Save problematic URLs
with open('low_quality_pages.txt', 'w') as f:
    for page in sorted_analysis:
        if len(page['issues']) >= 2:
            f.write(f"{page['url']}\n")

print(f"\n💾 Low quality URLs saved to: low_quality_pages.txt")
