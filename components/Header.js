'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);

  const tools = [
    { title: 'Domain Authority Checker', href: '/tools/domain-authority-checker' },
    { title: 'Bulk Domain Age Checker', href: '/tools/bulk-domain-age-checker' },
    { title: 'Bulk Domain WHOIS Checker', href: '/tools/bulk-domain-whois-checker' },
    { title: 'Domain IP History Checker', href: '/tools/domain-ip-history-checker' },
    { title: 'Reverse IP Domain Checker', href: '/tools/reverse-ip-domain-checker' },
    { title: 'Reverse WHOIS Checker', href: '/tools/reverse-whois-checker' },
    { title: 'XML & HTML Sitemap Generator', href: '/tools/xml-html-sitemap-generator' },
    { title: 'Google Malware Checker', href: '/tools/google-malware-checker' },
    { title: 'Bulk Alexa Rank Checker', href: '/tools/bulk-alexa-rank-checker' },
    { title: 'Alexa Rank Comparison', href: '/tools/alexa-rank-comparison' },
    { title: 'Backlinks Maker', href: '/tools/backlinks-maker' },
    { title: 'Social Media Counter', href: '/tools/social-media-counter' },
    { title: 'Link Search', href: '/tools/link-search' },
    { title: 'Broken Links Checker', href: '/tools/broken-links-checker' },
    { title: 'Google PageRank Checker', href: '/tools/google-pagerank-checker' },
    { title: 'Link Extractor', href: '/tools/link-extractor' },
    { title: 'Ping Multiple URLs', href: '/tools/ping-multiple-urls-online' },
    { title: 'Binary Translator', href: '/tools/binary-translator' }
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

        <div className="flex items-center gap-3">
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
      </nav>
    </header>
  );
}
