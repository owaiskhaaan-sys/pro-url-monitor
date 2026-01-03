"""
Quick Indexing Status Report
Generate list of all URLs for manual checking
"""

# Get all URLs from sitemap
urls = []

# Static pages
static_pages = [
    'https://www.prourlmonitor.com',
    'https://www.prourlmonitor.com/login',
    'https://www.prourlmonitor.com/signup',
    'https://www.prourlmonitor.com/app/dashboard',
    'https://www.prourlmonitor.com/blog',
    'https://www.prourlmonitor.com/about',
    'https://www.prourlmonitor.com/contact',
    'https://www.prourlmonitor.com/pricing',
    'https://www.prourlmonitor.com/privacy',
    'https://www.prourlmonitor.com/terms',
]

# Tool pages
tools = [
    'seo-audit', 'meta-generator', 'schema-generator', 'faq-schema-generator',
    'keyword-density-checker', 'heading-analyzer', 'robots-txt-generator',
    'xml-html-sitemap-generator', 'meta-description-generator', 'seo-title-generator',
    'alt-text-generator', 'semantic-keyword-finder', 'internal-linking-assistant',
    'content-readability-optimizer', 'google-index-checker', 'ai-search-ranking-checker',
    'ai-prompt-generator', 'ai-content-detector', 'ai-resume-optimizer',
    'chatgpt-prompt-templates', 'ai-text-humanizer', 'http-status-checker',
    'broken-links-checker', 'ping-multiple-urls-online', 'server-status-checker',
    'server-port-scanner', 'traceroute', 'different-locations-ping',
    'dns-records-checker', 'dns-propagation-checker', 'dns-report-checker',
    'reverse-ns-checker', 'domain-authority-checker', 'bulk-domain-age-checker',
    'bulk-domain-whois-checker', 'domain-ip-history-checker', 'reverse-ip-domain-checker',
    'reverse-whois-checker', 'class-c-ip-checker', 'ip-location',
    'link-extractor', 'backlinks-maker', 'link-search', 'social-media-counter',
    'google-malware-checker', 'google-pagerank-checker', 'bulk-alexa-rank-checker',
    'alexa-rank-comparison', 'word-counter', 'voice-to-text', 'case-converter',
    'text-cleaner', 'text-reverser', 'text-to-slug', 'find-and-replace',
    'sort-text-lines', 'remove-line-breaks', 'duplicate-line-remover',
    'text-diff-checker', 'character-frequency-counter', 'lorem-ipsum-generator',
    'paraphraser', 'plagiarism', 'html-beautifier-minifier', 'css-beautifier-minifier',
    'json-beautifier-validator', 'xml-beautifier-validator', 'sql-formatter',
    'php-beautifier', 'python-formatter', 'code-syntax-highlighter', 'regex-tester',
    'base64-encoder-decoder', 'url-encoder-decoder', 'html-encoder-decoder',
    'jwt-decoder', 'ascii-converter', 'binary-translator', 'rot13-cipher',
    'md5-generator', 'sha256-generator', 'sha512-generator', 'hex-to-rgb',
    'rgb-to-hex', 'hsl-to-rgb', 'rgb-to-hsl', 'cmyk-to-rgb', 'rgb-to-cmyk',
    'color-palette-generator', 'color-shades-generator', 'color-mixer',
    'color-name-finder', 'binary-converter', 'binary-calculator', 'binary-to-decimal',
    'binary-to-hex', 'binary-to-octal', 'decimal-to-binary', 'decimal-to-hex',
    'hex-converter', 'hex-to-binary', 'hex-to-decimal', 'octal-to-binary',
    'octal-to-decimal', 'bitwise-operations', 'twos-complement-calculator',
    'image-compress', 'submit', 'bulk'
]

tool_urls = [f'https://www.prourlmonitor.com/tools/{tool}' for tool in tools]

# Blog posts
blog_posts = [
    'binary-translator-guide-2026',
    'how-to-check-http-status-codes-for-seo',
    'meta-tags-seo-guide-2026',
    'ai-content-detector-guide-2026'
]
blog_urls = [f'https://www.prourlmonitor.com/blog/{post}' for post in blog_posts]

# Combine all
all_urls = static_pages + tool_urls + blog_urls

print(f"\n📊 ProURLMonitor Indexing Status Report")
print("=" * 80)
print(f"\n✅ Total URLs to check: {len(all_urls)}")
print(f"   • Static pages: {len(static_pages)}")
print(f"   • Tool pages: {len(tool_urls)}")
print(f"   • Blog posts: {len(blog_urls)}")
print()

# Save to file
with open('urls-to-check.txt', 'w', encoding='utf-8') as f:
    for url in all_urls:
        f.write(url + '\n')

print("✅ All URLs saved to: urls-to-check.txt")
print()
print("📝 To check indexing status:")
print("   1. Go to: https://search.google.com/search-console")
print("   2. Use 'URL Inspection' tool")
print("   3. Or search: site:www.prourlmonitor.com in Google")
print()
print(f"🔗 Quick Google search: https://www.google.com/search?q=site:www.prourlmonitor.com")
print()
