"""
Automatic SEO Meta Tags Fixer
==============================
Adds missing meta titles and descriptions to tool pages
"""

import os
import re

# Meta data for each tool
TOOL_META = {
    'xml-html-sitemap-generator': ('Sitemap Generator - Create XML & HTML Sitemaps Free', 'Generate XML and HTML sitemaps for your website automatically. Free sitemap generator tool to create SEO-friendly sitemaps for Google, Bing, and other search engines.'),
    'bulk-domain-age-checker': ('Bulk Domain Age Checker - Check Multiple Domains', 'Check domain age for multiple websites instantly. Free bulk domain age checker tool to verify registration date, domain history, and website age for SEO analysis.'),
    'bulk-domain-whois-checker': ('Bulk WHOIS Checker - Domain Information Lookup', 'Check WHOIS information for multiple domains at once. Get domain registration details, owner information, expiry dates, and registrar data instantly.'),
    'domain-ip-history-checker': ('Domain IP History Checker - Track IP Changes', 'Check domain IP history and track IP address changes over time. Analyze DNS history, hosting changes, and server migrations for any domain.'),
    'reverse-ip-domain-checker': ('Reverse IP Domain Checker - Find Websites on IP', 'Find all websites hosted on the same IP address. Reverse IP lookup tool to discover domains sharing the same server. Check IP neighbors.'),
    'reverse-whois-checker': ('Reverse WHOIS Checker - Find Domains by Owner', 'Search domains by owner name or email using reverse WHOIS lookup. Find all domains registered under the same owner. Track domain portfolios.'),
    'link-extractor': ('Link Extractor - Extract All Links from Webpage', 'Extract all links from any webpage instantly. Get internal links, external links, and backlinks in one click. Free URL link extractor tool for SEO.'),
    'backlinks-maker': ('Backlinks Maker - Free Instant Backlink Generator', 'Create instant backlinks to boost your SEO rankings. Free backlink maker tool to generate quality backlinks automatically. Submit to 1000+ platforms.'),
    'link-search': ('Link Search Tool - Find Backlinks & Link Opportunities', 'Search and analyze backlinks for any website. Find link building opportunities, check competitor backlinks, and discover high-quality link sources.'),
    'social-media-counter': ('Social Media Share Counter - Check Social Signals', 'Count social media shares for any URL. Check Facebook likes, Twitter shares, Pinterest pins, and LinkedIn shares. Free social share counter tool.'),
    'google-malware-checker': ('Google Malware Checker - Check Website Security', 'Check if your website is infected with malware using Google Safe Browsing API. Free malware scanner to detect viruses, phishing, and security threats.'),
    'google-pagerank-checker': ('Google PageRank Checker - Check PR Score Free', 'Check Google PageRank score for any website. Free PR checker tool to analyze website authority and Google ranking. Get accurate PageRank data.'),
    'bulk-alexa-rank-checker': ('Bulk Alexa Rank Checker - Check Multiple Ranks', 'Check Alexa rank for multiple websites at once. Free bulk Alexa ranking checker to analyze website traffic and popularity. Compare performance.'),
    'alexa-rank-comparison': ('Alexa Rank Comparison - Compare Website Traffic', 'Compare Alexa rankings of multiple websites side by side. Analyze traffic comparison, rank trends, and website popularity rankings.'),
    'case-converter': ('Case Converter - Change Text Case Online Free', 'Convert text to uppercase, lowercase, title case, sentence case, and more. Free online case converter tool for text formatting instantly.'),
    'text-cleaner': ('Text Cleaner - Remove Extra Spaces & Format Text', 'Clean and format text by removing extra spaces, line breaks, and special characters. Free text cleaning tool to sanitize your content.'),
    'text-reverser': ('Text Reverser - Reverse Words and Letters Online', 'Reverse text, words, or letters instantly. Free online text reverser tool to flip text backwards, create mirror text, and reverse strings.'),
    'text-to-slug': ('Text to Slug Converter - Create SEO-Friendly URLs', 'Convert text to SEO-friendly URL slugs instantly. Remove special characters, convert spaces to hyphens, and create clean, readable URLs.'),
    'duplicate-line-remover': ('Duplicate Line Remover - Remove Duplicate Text', 'Remove duplicate lines from text instantly. Free duplicate line remover tool to clean text, eliminate repeated lines, and organize content.'),
    'lorem-ipsum-generator': ('Lorem Ipsum Generator - Placeholder Text Generator', 'Generate Lorem Ipsum dummy text for design mockups and layouts. Free placeholder text generator with customizable paragraphs and words.'),
    'paraphraser': ('Paraphraser Tool - Rewrite Text Online Free', 'Paraphrase text automatically with AI-powered tool. Rewrite sentences, articles, and content while maintaining meaning. Free paraphrasing tool.'),
    'plagiarism': ('Plagiarism Checker - Free Online Detector', 'Check plagiarism online for free. Detect copied content, find duplicate text, and ensure originality. Accurate plagiarism checker.'),
    'json-beautifier-validator': ('JSON Beautifier & Validator - Format JSON Online', 'Beautify, format, and validate JSON data online. Free JSON beautifier tool to format minified JSON, check syntax errors instantly.'),
    'xml-beautifier-validator': ('XML Beautifier & Validator - Format XML Online', 'Beautify, format, and validate XML code online. Free XML beautifier tool to format minified XML, check syntax errors instantly.'),
    'sql-formatter': ('SQL Formatter - Format SQL Queries Online Free', 'Format and beautify SQL queries instantly. Free SQL formatter tool to indent SQL code, improve readability, and standardize formatting.'),
    'php-beautifier': ('PHP Beautifier - Format PHP Code Online Free', 'Beautify and format PHP code online. Free PHP formatter tool to clean up code, add proper indentation, and improve readability.'),
    'python-formatter': ('Python Formatter - Format Python Code Online', 'Format Python code according to PEP 8 standards. Free online Python formatter and beautifier tool to clean up code and fix indentation.'),
    'code-syntax-highlighter': ('Code Syntax Highlighter - Highlight Code Online', 'Highlight code syntax for multiple programming languages. Free online syntax highlighter supporting Python, JavaScript, PHP, HTML, CSS.'),
    'regex-tester': ('Regex Tester - Test Regular Expressions Online', 'Test and debug regular expressions online. Free regex tester with real-time matching, explanations, and support for multiple languages.'),
    'base64-encoder-decoder': ('Base64 Encoder & Decoder - Encode/Decode Online', 'Encode and decode Base64 strings online. Free Base64 encoder/decoder tool for text, images, and files. Convert to/from Base64.'),
    'url-encoder-decoder': ('URL Encoder & Decoder - Encode/Decode URLs Online', 'Encode and decode URLs online. Free URL encoder/decoder tool to convert special characters, spaces, and symbols for web-safe URLs.'),
    'html-encoder-decoder': ('HTML Encoder & Decoder - Convert HTML Entities', 'Encode and decode HTML entities online. Free HTML encoder/decoder to convert special characters, prevent XSS attacks display HTML safely.'),
    'jwt-decoder': ('JWT Decoder - Decode JSON Web Tokens Online', 'Decode and verify JSON Web Tokens (JWT) online. Free JWT decoder tool to inspect token headers, payloads, and signatures instantly.'),
    'ascii-converter': ('ASCII Converter - Text to ASCII Code Converter', 'Convert text to ASCII code and vice versa. Free ASCII converter tool to encode/decode characters, get ASCII values, and work with ASCII art.'),
    'rot13-cipher': ('ROT13 Cipher - Encrypt/Decrypt Text with ROT13', 'Encrypt and decrypt text using ROT13 cipher. Free ROT13 encoder/decoder tool for simple text obfuscation. Apply Caesar cipher rotation.'),
    'md5-generator': ('MD5 Hash Generator - Generate MD5 Checksums', 'Generate MD5 hash checksums for text and files. Free MD5 generator tool to create cryptographic hashes for password encryption and verification.'),
    'sha256-generator': ('SHA256 Hash Generator - Generate SHA256 Checksums', 'Generate SHA256 hash checksums for secure encryption. Free SHA256 generator tool to create cryptographic hashes for passwords and files.'),
    'sha512-generator': ('SHA512 Hash Generator - Generate SHA512 Checksums', 'Generate SHA512 hash checksums for maximum security. Free SHA512 generator tool to create strong cryptographic hashes for sensitive data.'),
    'binary-converter': ('Binary Converter - Convert Binary to Decimal & Hex', 'Convert binary numbers to decimal, hexadecimal, and octal. Free binary converter tool for number system conversions and binary math.'),
    'hex-converter': ('Hex Converter - Convert Hexadecimal to Decimal', 'Convert hexadecimal numbers to decimal, binary, and octal. Free hex converter tool for number system conversions and color codes.'),
    'image-compress': ('Image Compressor - Compress Images Online Free', 'Compress images without losing quality. Free online image compressor for JPEG, PNG, WebP. Reduce image size for faster website loading.'),
    'submit': ('Submit URL - Add Your Website to Our Directory', 'Submit your website URL to get indexed faster. Free URL submission tool to add your website to search engines and directories for better SEO.'),
    'bulk': ('Bulk SEO Tools - Check Multiple URLs at Once', 'Access bulk SEO tools to check multiple URLs simultaneously. Batch process domain authority, WHOIS lookups, Alexa ranks, and more.'),
}

def add_meta_to_file(filepath, tool_name):
    """Add meta tags to a tool file"""
    if tool_name not in TOOL_META:
        print(f"⚠️  No meta data for: {tool_name}")
        return False
    
    title, description = TOOL_META[tool_name]
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if Head is already imported
        if 'import Head from' in content:
            print(f"✅ {tool_name} - Already has Head import")
            return False
        
        # Add Head import after other imports
        if "import Layout from '../../components/Layout';" in content:
            content = content.replace(
                "import Layout from '../../components/Layout';",
                "import Head from 'next/head';\nimport Layout from '../../components/Layout';"
            )
        elif "import Layout from '../components/Layout';" in content:
            content = content.replace(
                "import Layout from '../components/Layout';",
                "import Head from 'next/head';\nimport Layout from '../components/Layout';"
            )
        
        # Add Head section after <Layout>
        if '  return (\n    <Layout>' in content:
            head_section = f'''  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta name="description" content="{description}" />
      </Head>'''
            content = content.replace('  return (\n    <Layout>', head_section)
        
        # Write back
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ {tool_name} - Added meta tags")
        return True
    
    except Exception as e:
        print(f"❌ {tool_name} - Error: {e}")
        return False

def main():
    base_path = r"C:\Users\DELL\Downloads\pro-url-monitor backup\pro-url-monitor-main\pages\tools"
    
    print("=" * 60)
    print("Adding Meta Tags to Tool Pages")
    print("=" * 60)
    print()
    
    success_count = 0
    for tool_name in TOOL_META.keys():
        filepath = os.path.join(base_path, f"{tool_name}.js")
        if os.path.exists(filepath):
            if add_meta_to_file(filepath, tool_name):
                success_count += 1
        else:
            print(f"⚠️  File not found: {tool_name}.js")
    
    print()
    print("=" * 60)
    print(f"SUMMARY: {success_count}/{len(TOOL_META)} files updated")
    print("=" * 60)

if __name__ == '__main__':
    main()
