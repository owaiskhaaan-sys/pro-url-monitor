'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tools = [
    { title: 'Domain Authority Checker', href: '/tools/domain-authority-checker' },
    { title: 'Bulk Domain Age Checker', href: '/tools/bulk-domain-age-checker' },
    { title: 'Bulk Domain WHOIS Checker', href: '/tools/bulk-domain-whois-checker' },
    { title: 'Domain IP History Checker', href: '/tools/domain-ip-history-checker' },
    { title: 'Reverse IP Domain Checker', href: '/tools/reverse-ip-domain-checker' },
    { title: 'Reverse WHOIS Checker', href: '/tools/reverse-whois-checker' },
    { title: 'XML & HTML Sitemap Generator', href: '/tools/xml-html-sitemap-generator' },
    { title: 'Google Malware Checker', href: '/tools/google-malware-checker' },
    { title: 'Google Index Checker', href: '/tools/google-index-checker' },
    { title: 'Bulk Alexa Rank Checker', href: '/tools/bulk-alexa-rank-checker' },
    { title: 'Alexa Rank Comparison', href: '/tools/alexa-rank-comparison' },
    { title: 'Backlinks Maker', href: '/tools/backlinks-maker' },
    { title: 'Social Media Counter', href: '/tools/social-media-counter' },
    { title: 'Link Search', href: '/tools/link-search' },
    { title: 'Broken Links Checker', href: '/tools/broken-links-checker' },
    { title: 'Google PageRank Checker', href: '/tools/google-pagerank-checker' },
    { title: 'Link Extractor', href: '/tools/link-extractor' },
    { title: 'Ping Multiple URLs', href: '/tools/ping-multiple-urls-online' },
    { title: 'Binary Translator', href: '/tools/binary-translator' },
    { title: 'Binary Calculator', href: '/tools/binary-calculator' },
    { title: 'Decimal to Binary Converter', href: '/tools/decimal-to-binary' },
    { title: 'Binary to Decimal Converter', href: '/tools/binary-to-decimal' },
    { title: 'Binary to Hex Converter', href: '/tools/binary-to-hex' },
    { title: 'Hex to Binary Converter', href: '/tools/hex-to-binary' },
    { title: 'Binary to Octal Converter', href: '/tools/binary-to-octal' },
    { title: 'Octal to Binary Converter', href: '/tools/octal-to-binary' },
    { title: 'Octal to Decimal Converter', href: '/tools/octal-to-decimal' },
    { title: "Two's Complement Calculator", href: '/tools/twos-complement-calculator' },
    { title: 'Decimal to Hex Converter', href: '/tools/decimal-to-hex' },
    { title: 'Hex to Decimal Converter', href: '/tools/hex-to-decimal' },
    { title: 'Bitwise Operations Calculator', href: '/tools/bitwise-operations' },
    { title: 'HTML Beautifier & Minifier', href: '/tools/html-beautifier-minifier' },
    { title: 'CSS Beautifier & Minifier', href: '/tools/css-beautifier-minifier' },
    { title: 'JSON Beautifier & Validator', href: '/tools/json-beautifier-validator' },
    { title: 'XML Beautifier & Validator', href: '/tools/xml-beautifier-validator' },
    { title: 'SQL Formatter', href: '/tools/sql-formatter' },
    { title: 'PHP Beautifier', href: '/tools/php-beautifier' },
    { title: 'Python Formatter', href: '/tools/python-formatter' },
    { title: 'Code Syntax Highlighter', href: '/tools/code-syntax-highlighter' },
    { title: 'Regex Tester', href: '/tools/regex-tester' },
    { title: 'Base64 Encoder/Decoder', href: '/tools/base64-encoder-decoder' },
    { title: 'URL Encoder/Decoder', href: '/tools/url-encoder-decoder' },
    { title: 'MD5 Hash Generator', href: '/tools/md5-generator' },
    { title: 'SHA-256 Hash Generator', href: '/tools/sha256-generator' },
    { title: 'SHA-512 Hash Generator', href: '/tools/sha512-generator' },
    { title: 'HTML Encoder/Decoder', href: '/tools/html-encoder-decoder' },
    { title: 'Binary Encoder/Decoder', href: '/tools/binary-converter' },
    { title: 'Hex Encoder/Decoder', href: '/tools/hex-converter' },
    { title: 'ROT13 Cipher', href: '/tools/rot13-cipher' },
    { title: 'ASCII Converter', href: '/tools/ascii-converter' },
    { title: 'Case Converter', href: '/tools/case-converter' },
    { title: 'Text Reverser', href: '/tools/text-reverser' },
    { title: 'Text to Slug Generator', href: '/tools/text-to-slug' },
    { title: 'Lorem Ipsum Generator', href: '/tools/lorem-ipsum-generator' },
    { title: 'Duplicate Line Remover', href: '/tools/duplicate-line-remover' },
    { title: 'Sort Text Lines', href: '/tools/sort-text-lines' },
    { title: 'JWT Decoder', href: '/tools/jwt-decoder' },
    { title: 'Meta Description Generator', href: '/tools/meta-description-generator' },
    { title: 'SEO Title Generator', href: '/tools/seo-title-generator' },
    { title: 'Alt Text Generator', href: '/tools/alt-text-generator' },
    { title: 'Schema Generator', href: '/tools/schema-generator' },
    { title: 'FAQ Schema Generator', href: '/tools/faq-schema-generator' },
    { title: 'Content Readability Optimizer', href: '/tools/content-readability-optimizer' },
    { title: 'Semantic Keyword Finder', href: '/tools/semantic-keyword-finder' },
    { title: 'Internal Linking Assistant', href: '/tools/internal-linking-assistant' },
    { title: 'DNS Records Checker', href: '/tools/dns-records-checker' },
    { title: 'DNS Report Checker', href: '/tools/dns-report-checker' },
    { title: 'DNS Propagation Checker', href: '/tools/dns-propagation-checker' },
    { title: 'Server Port Scanner', href: '/tools/server-port-scanner' },
    { title: 'Class C IP Checker', href: '/tools/class-c-ip-checker' },
    { title: 'IP Location', href: '/tools/ip-location' },
    { title: 'Server Status Checker', href: '/tools/server-status-checker' },
    { title: 'Different Locations Ping', href: '/tools/different-locations-ping' },
    { title: 'Traceroute', href: '/tools/traceroute' },
    { title: 'Reverse NS Checker', href: '/tools/reverse-ns-checker' }
  ];

  return (
    <header className="sticky top-0 bg-white border-b z-50" style={{borderColor: 'rgba(6,95,70,0.06)'}}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold">PUM</div>
          <div>
            <div className="text-lg font-bold text-emerald-700">ProURLMonitor</div>
            <div className="text-xs text-gray-500 -mt-1">Domain & Link Tools</div>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Tools Dropdown */}
          <div className="relative group">
            <button 
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
              onMouseEnter={() => setShowToolsDropdown(true)}
              onMouseLeave={() => setShowToolsDropdown(false)}
            >
              Tools
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
            
            {showToolsDropdown && (
              <div 
                className="absolute left-0 mt-0 w-64 bg-white border border-emerald-100 rounded-lg shadow-lg py-2 z-50"
                onMouseEnter={() => setShowToolsDropdown(true)}
                onMouseLeave={() => setShowToolsDropdown(false)}
              >
                <div className="grid grid-cols-1 max-h-96 overflow-y-auto">
                  {tools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition"
                    >
                      {tool.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/blog" className="text-sm text-emerald-600 hover:underline">Blog</Link>
          <Link href="/about" className="text-sm text-emerald-600 hover:underline">About</Link>
          <Link href="/pricing" className="text-sm text-emerald-600 hover:underline">Pricing</Link>
          <Link href="/login" className="btn btn-secondary btn-sm">Login</Link>
          <Link href="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden p-2 text-emerald-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-emerald-100 bg-white">
          <div className="px-4 py-3 space-y-3">
            <Link href="/tools" className="block text-emerald-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              All Tools
            </Link>
            <Link href="/blog" className="block text-emerald-600 py-2" onClick={() => setMobileMenuOpen(false)}>
              Blog
            </Link>
            <Link href="/about" className="block text-emerald-600 py-2" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            <Link href="/pricing" className="block text-emerald-600 py-2" onClick={() => setMobileMenuOpen(false)}>
              Pricing
            </Link>
            <div className="pt-3 border-t border-emerald-100 space-y-2">
              <Link href="/login" className="block btn btn-secondary w-full text-center" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
              <Link href="/signup" className="block btn btn-primary w-full text-center" onClick={() => setMobileMenuOpen(false)}>
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

