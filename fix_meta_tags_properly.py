"""
Fix Meta Tags - Add Head sections properly
===========================================
This script fixes pages where Head import exists but Head section is not properly added
"""

import os
import re

base_path = r"C:\Users\DELL\Downloads\pro-url-monitor backup\pro-url-monitor-main\pages"

# Pages and their meta data
pages_to_fix = {
    'tools/sql-formatter.js': {
        'title': 'SQL Formatter - Format SQL Queries Online Free',
        'description': 'Format and beautify SQL queries instantly. Free SQL formatter tool to indent SQL code, improve readability, and standardize query formatting for databases.'
    },
    'tools/hex-converter.js': {
        'title': 'Hex Converter - Convert Hexadecimal to Decimal',
        'description': 'Convert hexadecimal numbers to decimal, binary, and octal. Free hex converter tool for number system conversions and color codes.'
    },
    'tools/url-encoder-decoder.js': {
        'title': 'URL Encoder & Decoder - Encode/Decode URLs Online',
        'description': 'Encode and decode URLs online. Free URL encoder/decoder tool to convert special characters, spaces, and symbols for web-safe URLs.'
    },
    'tools/html-encoder-decoder.js': {
        'title': 'HTML Encoder & Decoder - Convert HTML Entities',
        'description': 'Encode and decode HTML entities online. Free HTML encoder/decoder to convert special characters, prevent XSS attacks display HTML safely.'
    },
    'tools/base64-encoder-decoder.js': {
        'title': 'Base64 Encoder & Decoder - Encode/Decode Online',
        'description': 'Encode and decode Base64 strings online. Free Base64 encoder/decoder tool for text, images, and files. Convert to/from Base64.'
    },
    'tools/md5-generator.js': {
        'title': 'MD5 Hash Generator - Generate MD5 Checksums',
        'description': 'Generate MD5 hash checksums for text and files. Free MD5 generator tool to create cryptographic hashes for password encryption and verification.'
    },
    'tools/case-converter.js': {
        'title': 'Case Converter - Change Text Case Online Free',
        'description': 'Convert text to uppercase, lowercase, title case, sentence case, and more. Free online case converter tool for text formatting instantly.'
    },
    'tools/ascii-converter.js': {
        'title': 'ASCII Converter - Text to ASCII Code Converter',
        'description': 'Convert text to ASCII code and vice versa. Free ASCII converter tool to encode/decode characters, get ASCII values, and work with ASCII art.'
    },
    'tools/text-to-slug.js': {
        'title': 'Text to Slug Converter - Create SEO-Friendly URLs',
        'description': 'Convert text to SEO-friendly URL slugs instantly. Remove special characters, convert spaces to hyphens, and create clean, readable URLs.'
    },
    'tools/sha512-generator.js': {
        'title': 'SHA512 Hash Generator - Generate SHA512 Checksums',
        'description': 'Generate SHA512 hash checksums for maximum security. Free SHA512 generator tool to create strong cryptographic hashes for sensitive data.'
    },
    'about.js': {
        'title': 'About Us - Pro URL Monitor Team & Mission',
        'description': 'Learn about Pro URL Monitor. We provide free SEO tools, website monitoring, and URL checking services to help businesses improve online presence.'
    },
    'tools/binary-converter.js': {
        'title': 'Binary Converter - Convert Binary to Decimal & Hex',
        'description': 'Convert binary numbers to decimal, hexadecimal, and octal. Free binary converter tool for number system conversions and binary math.'
    },
    'tools/json-beautifier-validator.js': {
        'title': 'JSON Beautifier & Validator - Format JSON Online',
        'description': 'Beautify, format, and validate JSON data online. Free JSON beautifier tool to format minified JSON, check syntax errors instantly.'
    },
    'tools/python-formatter.js': {
        'title': 'Python Formatter - Format Python Code Online',
        'description': 'Format Python code according to PEP 8 standards. Free online Python formatter and beautifier tool to clean up code and fix indentation.'
    },
    'tools/regex-tester.js': {
        'title': 'Regex Tester - Test Regular Expressions Online',
        'description': 'Test and debug regular expressions online. Free regex tester with real-time matching, explanations, and support for multiple languages.'
    },
    'tools/jwt-decoder.js': {
        'title': 'JWT Decoder - Decode JSON Web Tokens Online',
        'description': 'Decode and verify JSON Web Tokens (JWT) online. Free JWT decoder tool to inspect token headers, payloads, and signatures instantly.'
    },
    'tools/index.js': {
        'title': 'SEO Tools - Free Online Tools for Webmasters',
        'description': 'Access 100+ free SEO tools for website optimization. Check URLs, analyze domains, generate meta tags, and improve your website performance.'
    },
    'tools/lorem-ipsum-generator.js': {
        'title': 'Lorem Ipsum Generator - Placeholder Text Generator',
        'description': 'Generate Lorem Ipsum dummy text for design mockups and layouts. Free placeholder text generator with customizable paragraphs and words.'
    },
    'tools/php-beautifier.js': {
        'title': 'PHP Beautifier - Format PHP Code Online Free',
        'description': 'Beautify and format PHP code online. Free PHP formatter tool to clean up code, add proper indentation, and improve readability.'
    },
    'tools/rot13-cipher.js': {
        'title': 'ROT13 Cipher - Encrypt/Decrypt Text with ROT13',
        'description': 'Encrypt and decrypt text using ROT13 cipher. Free ROT13 encoder/decoder tool for simple text obfuscation. Apply Caesar cipher rotation.'
    },
    'tools/text-reverser.js': {
        'title': 'Text Reverser - Reverse Words and Letters Online',
        'description': 'Reverse text, words, or letters instantly. Free online text reverser tool to flip text backwards, create mirror text, and reverse strings.'
    },
    'tools/code-syntax-highlighter.js': {
        'title': 'Code Syntax Highlighter - Highlight Code Online',
        'description': 'Highlight code syntax for multiple programming languages. Free online syntax highlighter supporting Python, JavaScript, PHP, HTML, CSS.'
    },
    'tools/xml-beautifier-validator.js': {
        'title': 'XML Beautifier & Validator - Format XML Online',
        'description': 'Beautify, format, and validate XML code online. Free XML beautifier tool to format minified XML, check syntax errors instantly.'
    },
    'tools/duplicate-line-remover.js': {
        'title': 'Duplicate Line Remover - Remove Duplicate Text',
        'description': 'Remove duplicate lines from text instantly. Free duplicate line remover tool to clean text, eliminate repeated lines, and organize content.'
    },
}

def fix_file(filepath, meta_data):
    """Fix a single file by adding proper Head section"""
    full_path = os.path.join(base_path, filepath)
    
    if not os.path.exists(full_path):
        print(f"⚠️  File not found: {filepath}")
        return False
    
    try:
        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if already has Head section in return statement
        if '<Head>' in content and 'return (' in content:
            # Check if Head is after return
            return_pos = content.find('return (')
            head_pos = content.find('<Head>')
            if head_pos > return_pos and head_pos - return_pos < 500:
                print(f"✅ {filepath} - Already has Head section")
                return False
        
        # Add Head import if not present
        if 'import Head from' not in content:
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
        
        # Find return ( <Layout> and add Head section
        # Pattern 1: return (\n    <Layout>
        pattern1 = r'return \(\s*<Layout>'
        if re.search(pattern1, content):
            head_section = f'''return (
    <Layout>
      <Head>
        <title>{meta_data['title']}</title>
        <meta name="description" content="{meta_data['description']}" />
      </Head>'''
            content = re.sub(pattern1, head_section, content)
        
        # Pattern 2: return (\n    <Layout\n      title="..."\n      description="..."\n    >
        pattern2 = r'return \(\s*<Layout\s+title="[^"]*"\s+description="[^"]*"\s*>'
        if re.search(pattern2, content):
            head_section = f'''return (
    <Layout>
      <Head>
        <title>{meta_data['title']}</title>
        <meta name="description" content="{meta_data['description']}" />
      </Head>'''
            content = re.sub(pattern2, head_section, content)
        
        # Write back
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ {filepath} - Fixed")
        return True
        
    except Exception as e:
        print(f"❌ {filepath} - Error: {e}")
        return False

def main():
    print("=" * 80)
    print("Fixing Meta Tags - Adding Head Sections")
    print("=" * 80)
    print()
    
    success_count = 0
    for filepath, meta_data in pages_to_fix.items():
        if fix_file(filepath, meta_data):
            success_count += 1
    
    print()
    print("=" * 80)
    print(f"SUMMARY: {success_count}/{len(pages_to_fix)} files fixed")
    print("=" * 80)

if __name__ == '__main__':
    main()
