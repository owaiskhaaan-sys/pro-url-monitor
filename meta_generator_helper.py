"""
SEO Meta Tags Generator - Automatic Tool
=========================================

This script generates appropriate meta titles and descriptions
for tool pages based on their tool name/purpose.
"""

import json

# Tool page meta data generator
TOOL_META_DATA = {
    # Domain Tools
    'domain-authority-checker': {
        'title': 'Domain Authority Checker - Check DA/PA Score Free',
        'description': 'Check domain authority (DA) and page authority (PA) scores instantly. Free bulk domain authority checker using OpenPageRank API. Analyze website credibility and SEO strength.'
    },
    'bulk-domain-age-checker': {
        'title': 'Bulk Domain Age Checker - Check Multiple Domain Ages',
        'description': 'Check domain age for multiple websites instantly. Free bulk domain age checker tool to verify registration date, domain history, and website age for SEO analysis.'
    },
    'bulk-domain-whois-checker': {
        'title': 'Bulk WHOIS Checker - Domain Information Lookup Tool',
        'description': 'Check WHOIS information for multiple domains at once. Get domain registration details, owner information, expiry dates, and registrar data instantly.'
    },
    'domain-ip-history-checker': {
        'title': 'Domain IP History Checker - Track IP Changes',
        'description': 'Check domain IP history and track IP address changes over time. Analyze DNS history, hosting changes, and server migrations for any domain. Free IP history lookup tool.'
    },
    'reverse-ip-domain-checker': {
        'title': 'Reverse IP Domain Checker - Find Websites on Same IP',
        'description': 'Find all websites hosted on the same IP address. Reverse IP lookup tool to discover domains sharing the same server. Check IP neighbors and hosting patterns.'
    },
    'reverse-whois-checker': {
        'title': 'Reverse WHOIS Checker - Find Domains by Owner',
        'description': 'Search domains by owner name or email using reverse WHOIS lookup. Find all domains registered under the same owner. Track domain portfolios and ownership patterns.'
    },
    
    # Link Tools
    'link-extractor': {
        'title': 'Link Extractor - Extract All Links from Webpage',
        'description': 'Extract all links from any webpage instantly. Get internal links, external links, and backlinks in one click. Free URL link extractor tool for SEO analysis and link building.'
    },
    'backlinks-maker': {
        'title': 'Backlinks Maker - Free Instant Backlink Generator',
        'description': 'Create instant backlinks to boost your SEO rankings. Free backlink maker tool to generate quality backlinks automatically. Submit your website to 1000+ platforms instantly.'
    },
    'link-search': {
        'title': 'Link Search Tool - Find Backlinks and Link Opportunities',
        'description': 'Search and analyze backlinks for any website. Find link building opportunities, check competitor backlinks, and discover high-quality link sources for your SEO strategy.'
    },
    'social-media-counter': {
        'title': 'Social Media Share Counter - Check Social Signals',
        'description': 'Count social media shares for any URL. Check Facebook likes, Twitter shares, Pinterest pins, and LinkedIn shares. Free social share counter for SEO and content analysis.'
    },
    'google-malware-checker': {
        'title': 'Google Malware Checker - Check Website Security Status',
        'description': 'Check if your website is infected with malware using Google Safe Browsing API. Free malware scanner to detect viruses, phishing, and security threats on any website.'
    },
    'google-pagerank-checker': {
        'title': 'Google PageRank Checker - Check PR Score Free',
        'description': 'Check Google PageRank score for any website. Free PR checker tool to analyze website authority and Google ranking. Get accurate PageRank data instantly.'
    },
    'bulk-alexa-rank-checker': {
        'title': 'Bulk Alexa Rank Checker - Check Multiple Website Ranks',
        'description': 'Check Alexa rank for multiple websites at once. Free bulk Alexa ranking checker to analyze website traffic and popularity. Compare website performance instantly.'
    },
    'alexa-rank-comparison': {
        'title': 'Alexa Rank Comparison Tool - Compare Website Traffic',
        'description': 'Compare Alexa rankings of multiple websites side by side. Analyze traffic comparison, rank trends, and website popularity. Free Alexa rank comparison tool.'
    },
    
    # Text Tools
    'case-converter': {
        'title': 'Case Converter - Change Text Case Online Free',
        'description': 'Convert text to uppercase, lowercase, title case, sentence case, and more. Free online case converter tool for text formatting. Transform text case instantly.'
    },
    'text-cleaner': {
        'title': 'Text Cleaner - Remove Extra Spaces and Format Text',
        'description': 'Clean and format text by removing extra spaces, line breaks, and special characters. Free text cleaning tool to sanitize and beautify your content instantly.'
    },
    'text-reverser': {
        'title': 'Text Reverser - Reverse Words and Letters Online',
        'description': 'Reverse text, words, or letters instantly. Free online text reverser tool to flip text backwards, create mirror text, and reverse string order. Fun text manipulation tool.'
    },
    'text-to-slug': {
        'title': 'Text to Slug Converter - Create SEO-Friendly URLs',
        'description': 'Convert text to SEO-friendly URL slugs instantly. Remove special characters, convert spaces to hyphens, and create clean, readable URLs for better SEO.'
    },
    'duplicate-line-remover': {
        'title': 'Duplicate Line Remover - Remove Duplicate Text Lines',
        'description': 'Remove duplicate lines from text instantly. Free duplicate line remover tool to clean text, eliminate repeated lines, and organize content efficiently.'
    },
    'lorem-ipsum-generator': {
        'title': 'Lorem Ipsum Generator - Placeholder Text Generator',
        'description': 'Generate Lorem Ipsum dummy text for design mockups and layouts. Free placeholder text generator with customizable paragraphs, words, and sentences.'
    },
    'paraphraser': {
        'title': 'Paraphraser Tool - Rewrite Text Online Free',
        'description': 'Paraphrase text automatically with AI-powered tool. Rewrite sentences, articles, and content while maintaining meaning. Free online paraphrasing tool for writers.'
    },
    'plagiarism': {
        'title': 'Plagiarism Checker - Free Online Plagiarism Detector',
        'description': 'Check plagiarism online for free. Detect copied content, find duplicate text, and ensure originality. Accurate plagiarism checker for students, teachers, and writers.'
    },
    
    # Code Beautifiers
    'json-beautifier-validator': {
        'title': 'JSON Beautifier & Validator - Format and Validate JSON',
        'description': 'Beautify, format, and validate JSON data online. Free JSON beautifier tool to format minified JSON, check syntax errors, and validate JSON structure instantly.'
    },
    'xml-beautifier-validator': {
        'title': 'XML Beautifier & Validator - Format and Validate XML',
        'description': 'Beautify, format, and validate XML code online. Free XML beautifier tool to format minified XML, check syntax errors, and validate XML structure instantly.'
    },
    'sql-formatter': {
        'title': 'SQL Formatter - Format SQL Queries Online Free',
        'description': 'Format and beautify SQL queries instantly. Free SQL formatter tool to indent SQL code, improve readability, and standardize query formatting for databases.'
    },
    'php-beautifier': {
        'title': 'PHP Beautifier - Format PHP Code Online Free',
        'description': 'Beautify and format PHP code online. Free PHP formatter tool to clean up code, add proper indentation, and improve PHP code readability instantly.'
    },
    'python-formatter': {
        'title': 'Python Formatter - Format Python Code Online',
        'description': 'Format Python code according to PEP 8 standards. Free online Python formatter and beautifier tool to clean up code, fix indentation, and improve readability.'
    },
    'code-syntax-highlighter': {
        'title': 'Code Syntax Highlighter - Highlight Code Online',
        'description': 'Highlight code syntax for multiple programming languages. Free online syntax highlighter supporting Python, JavaScript, PHP, HTML, CSS, and 50+ languages.'
    },
    'regex-tester': {
        'title': 'Regex Tester - Test Regular Expressions Online',
        'description': 'Test and debug regular expressions online. Free regex tester with real-time matching, explanations, and support for JavaScript, Python, and PHP regex patterns.'
    },
    
    # Encoders & Decoders
    'base64-encoder-decoder': {
        'title': 'Base64 Encoder & Decoder - Encode/Decode Online',
        'description': 'Encode and decode Base64 strings online. Free Base64 encoder/decoder tool for text, images, and files. Convert to and from Base64 format instantly.'
    },
    'url-encoder-decoder': {
        'title': 'URL Encoder & Decoder - Encode/Decode URLs Online',
        'description': 'Encode and decode URLs online. Free URL encoder/decoder tool to convert special characters, spaces, and symbols for web-safe URLs. Percent encoding made easy.'
    },
    'html-encoder-decoder': {
        'title': 'HTML Encoder & Decoder - Convert HTML Entities',
        'description': 'Encode and decode HTML entities online. Free HTML encoder/decoder to convert special characters, prevent XSS attacks, and display HTML safely in web pages.'
    },
    'jwt-decoder': {
        'title': 'JWT Decoder - Decode JSON Web Tokens Online',
        'description': 'Decode and verify JSON Web Tokens (JWT) online. Free JWT decoder tool to inspect token headers, payloads, and signatures. Debug JWT authentication issues instantly.'
    },
    'ascii-converter': {
        'title': 'ASCII Converter - Text to ASCII Code Converter',
        'description': 'Convert text to ASCII code and vice versa. Free ASCII converter tool to encode/decode characters, get ASCII values, and work with ASCII art. Binary to ASCII converter.'
    },
    'rot13-cipher': {
        'title': 'ROT13 Cipher - Encrypt/Decrypt Text with ROT13',
        'description': 'Encrypt and decrypt text using ROT13 cipher. Free ROT13 encoder/decoder tool for simple text obfuscation. Apply Caesar cipher rotation online.'
    },
    'md5-generator': {
        'title': 'MD5 Hash Generator - Generate MD5 Checksums Online',
        'description': 'Generate MD5 hash checksums for text and files. Free MD5 generator tool to create cryptographic hashes for password encryption, file verification, and data integrity.'
    },
    'sha256-generator': {
        'title': 'SHA256 Hash Generator - Generate SHA256 Checksums',
        'description': 'Generate SHA256 hash checksums for secure encryption. Free SHA256 generator tool to create cryptographic hashes for passwords, files, and data verification.'
    },
    'sha512-generator': {
        'title': 'SHA512 Hash Generator - Generate SHA512 Checksums',
        'description': 'Generate SHA512 hash checksums for maximum security. Free SHA512 generator tool to create strong cryptographic hashes for sensitive data and file integrity checks.'
    },
    
    # Binary & Hex Tools
    'binary-converter': {
        'title': 'Binary Converter - Convert Binary to Decimal, Hex',
        'description': 'Convert binary numbers to decimal, hexadecimal, and octal. Free binary converter tool for number system conversions. Binary to text and ASCII converter included.'
    },
    'hex-converter': {
        'title': 'Hex Converter - Convert Hexadecimal to Decimal, Binary',
        'description': 'Convert hexadecimal numbers to decimal, binary, and octal. Free hex converter tool for number system conversions. Hex to text and color code converter.'
    },
    
    # Other Tools
    'image-compress': {
        'title': 'Image Compressor - Compress Images Online Free',
        'description': 'Compress images without losing quality. Free online image compressor for JPEG, PNG, WebP. Reduce image size for faster website loading and better SEO performance.'
    },
    'submit': {
        'title': 'Submit URL - Add Your Website to Our Directory',
        'description': 'Submit your website URL to get indexed faster. Free URL submission tool to add your website to search engines and directories. Boost your SEO and online visibility.'
    },
    'bulk': {
        'title': 'Bulk SEO Tools - Check Multiple URLs at Once',
        'description': 'Access bulk SEO tools to check multiple URLs simultaneously. Batch process domain authority, WHOIS lookups, Alexa ranks, and more. Free bulk checker tools for SEO.'
    },
    
    # XML Sitemap Generator
    'xml-html-sitemap-generator': {
        'title': 'Sitemap Generator - Create XML & HTML Sitemaps',
        'description': 'Generate XML and HTML sitemaps for your website automatically. Free sitemap generator tool to create SEO-friendly sitemaps for Google, Bing, and other search engines. Improve crawlability and indexing.'
    },
}

def generate_meta_imports():
    """Generate Head import statement"""
    return "import Head from 'next/head';"

def generate_head_section(title, description, includeIndex=True):
    """Generate Head section with meta tags"""
    robots = 'index, follow' if includeIndex else 'noindex, nofollow'
    return f"""      <Head>
        <title>{title}</title>
        <meta name="description" content="{description}" />
        <meta name="robots" content="{robots}" />
      </Head>"""

# Generate meta data for all tools
def print_tool_meta():
    print("=== META DATA FOR ALL TOOLS ===\n")
    for tool, data in TOOL_META_DATA.items():
        print(f"Tool: {tool}")
        print(f"Title ({len(data['title'])} chars): {data['title']}")
        print(f"Description ({len(data['description'])} chars): {data['description']}")
        print()

if __name__ == '__main__':
    print_tool_meta()
    print(f"\nTotal tools with meta data: {len(TOOL_META_DATA)}")
