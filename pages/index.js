import { useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import Head from 'next/head';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const allTools = [
    // SEO Tools
    { title: 'SEO Audit Tool', href: '/tools/seo-audit', desc: 'Complete website SEO analysis with 18+ checks', category: 'SEO' },
    { title: 'Meta Tag Generator', href: '/tools/meta-generator', desc: 'Generate SEO-friendly meta tags', category: 'SEO' },
    { title: 'Schema Markup Generator', href: '/tools/schema-generator', desc: 'Create JSON-LD structured data', category: 'SEO' },
    { title: 'FAQ Schema Generator', href: '/tools/faq-schema-generator', desc: 'Generate FAQ schema markup', category: 'SEO' },
    { title: 'Keyword Density Checker', href: '/tools/keyword-density-checker', desc: 'Analyze keyword frequency', category: 'SEO' },
    { title: 'Heading Tag Analyzer', href: '/tools/heading-analyzer', desc: 'Check H1-H6 structure', category: 'SEO' },
    { title: 'Robots.txt Generator', href: '/tools/robots-txt-generator', desc: 'AI-powered robots.txt generator', category: 'SEO' },
    { title: 'XML & HTML Sitemap Generator', href: '/tools/xml-html-sitemap-generator', desc: 'Create sitemaps', category: 'SEO' },
    { title: 'Meta Description Generator', href: '/tools/meta-description-generator', desc: 'Generate meta descriptions', category: 'SEO' },
    { title: 'SEO Title Generator', href: '/tools/seo-title-generator', desc: 'Create SEO titles', category: 'SEO' },
    { title: 'Alt Text Generator', href: '/tools/alt-text-generator', desc: 'Generate image alt text', category: 'SEO' },
    { title: 'Semantic Keyword Finder', href: '/tools/semantic-keyword-finder', desc: 'Find related keywords', category: 'SEO' },
    { title: 'Internal Linking Assistant', href: '/tools/internal-linking-assistant', desc: 'Optimize internal links', category: 'SEO' },
    { title: 'Content Readability Optimizer', href: '/tools/content-readability-optimizer', desc: 'Improve readability', category: 'SEO' },
    { title: 'Google Index Checker', href: '/tools/google-index-checker', desc: 'Check Google indexing', category: 'SEO' },
    { title: 'AI Search Ranking Checker', href: '/tools/ai-search-ranking-checker', desc: 'Track rankings in ChatGPT, Perplexity, Gemini', category: 'SEO' },
    { title: 'AI Prompt Generator', href: '/tools/ai-prompt-generator', desc: 'Generate perfect prompts for ChatGPT, Claude, Gemini', category: 'SEO' },
    { title: 'AI Content Detector', href: '/tools/ai-content-detector', desc: 'Detect AI-generated text from ChatGPT & other AI tools', category: 'SEO' },
    { title: 'AI Resume Optimizer', href: '/tools/ai-resume-optimizer', desc: 'Optimize resume for ATS with keyword matching & scoring', category: 'SEO' },
    { title: 'ChatGPT Prompt Templates', href: '/tools/chatgpt-prompt-templates', desc: '100+ ready-to-use AI prompts for every task', category: 'SEO' },
    { title: 'AI Text Humanizer', href: '/tools/ai-text-humanizer', desc: 'Make AI text sound natural and human-written', category: 'SEO' },
    
    // HTTP & Network Tools
    { title: 'HTTP Status Checker', href: '/tools/http-status-checker', desc: 'Check 200, 301, 404, 500 codes', category: 'Network' },
    { title: 'Broken Links Checker', href: '/tools/broken-links-checker', desc: 'Find broken links', category: 'Network' },
    { title: 'Ping Multiple URLs', href: '/tools/ping-multiple-urls-online', desc: 'Ping multiple URLs', category: 'Network' },
    { title: 'Server Status Checker', href: '/tools/server-status-checker', desc: 'Check server status', category: 'Network' },
    { title: 'Server Port Scanner', href: '/tools/server-port-scanner', desc: 'Scan server ports', category: 'Network' },
    { title: 'Traceroute Tool', href: '/tools/traceroute', desc: 'Trace network route', category: 'Network' },
    { title: 'Different Locations Ping', href: '/tools/different-locations-ping', desc: 'Ping from multiple locations', category: 'Network' },
    
    // DNS Tools
    { title: 'DNS Records Checker', href: '/tools/dns-records-checker', desc: 'Check DNS records', category: 'DNS' },
    { title: 'DNS Propagation Checker', href: '/tools/dns-propagation-checker', desc: 'Check DNS propagation', category: 'DNS' },
    { title: 'DNS Report Checker', href: '/tools/dns-report-checker', desc: 'Comprehensive DNS report', category: 'DNS' },
    { title: 'Reverse NS Checker', href: '/tools/reverse-ns-checker', desc: 'Check nameservers', category: 'DNS' },
    
    // Domain Tools  
    { title: 'Domain Authority Checker', href: '/tools/domain-authority-checker', desc: 'Check domain authority', category: 'Domain' },
    { title: 'Bulk Domain Age Checker', href: '/tools/bulk-domain-age-checker', desc: 'Check domain ages', category: 'Domain' },
    { title: 'Bulk Domain WHOIS Checker', href: '/tools/bulk-domain-whois-checker', desc: 'Bulk WHOIS lookup', category: 'Domain' },
    { title: 'Domain IP History Checker', href: '/tools/domain-ip-history-checker', desc: 'Check IP history', category: 'Domain' },
    { title: 'Reverse IP Domain Checker', href: '/tools/reverse-ip-domain-checker', desc: 'Find domains on IP', category: 'Domain' },
    { title: 'Reverse WHOIS Checker', href: '/tools/reverse-whois-checker', desc: 'Reverse WHOIS lookup', category: 'Domain' },
    { title: 'Class C IP Checker', href: '/tools/class-c-ip-checker', desc: 'Check Class C IPs', category: 'Domain' },
    { title: 'IP Location', href: '/tools/ip-location', desc: 'Find IP location', category: 'Domain' },
    
    // Link Tools
    { title: 'Link Extractor', href: '/tools/link-extractor', desc: 'Extract links from text', category: 'Links' },
    { title: 'Backlinks Maker', href: '/tools/backlinks-maker', desc: 'Create backlinks', category: 'Links' },
    { title: 'Link Search', href: '/tools/link-search', desc: 'Search for links', category: 'Links' },
    { title: 'Social Media Counter', href: '/tools/social-media-counter', desc: 'Track social shares', category: 'Links' },
    { title: 'Google Malware Checker', href: '/tools/google-malware-checker', desc: 'Check for malware', category: 'Links' },
    { title: 'Google PageRank Checker', href: '/tools/google-pagerank-checker', desc: 'Check PageRank', category: 'Links' },
    { title: 'Bulk Alexa Rank Checker', href: '/tools/bulk-alexa-rank-checker', desc: 'Check Alexa ranks', category: 'Links' },
    { title: 'Alexa Rank Comparison', href: '/tools/alexa-rank-comparison', desc: 'Compare Alexa ranks', category: 'Links' },
    
    // Text Tools
    { title: 'Word Counter', href: '/tools/word-counter', desc: 'Count words and characters', category: 'Text' },
    { title: 'Voice to Text Converter', href: '/tools/voice-to-text', desc: 'Convert speech to text in 15+ languages', category: 'Text' },
    { title: 'Case Converter', href: '/tools/case-converter', desc: 'Convert text case', category: 'Text' },
    { title: 'Text Cleaner', href: '/tools/text-cleaner', desc: 'Clean text', category: 'Text' },
    { title: 'Text Reverser', href: '/tools/text-reverser', desc: 'Reverse text', category: 'Text' },
    { title: 'Text to Slug', href: '/tools/text-to-slug', desc: 'Convert to URL slug', category: 'Text' },
    { title: 'Find and Replace', href: '/tools/find-and-replace', desc: 'Find and replace text', category: 'Text' },
    { title: 'Sort Text Lines', href: '/tools/sort-text-lines', desc: 'Sort lines alphabetically', category: 'Text' },
    { title: 'Remove Line Breaks', href: '/tools/remove-line-breaks', desc: 'Remove line breaks', category: 'Text' },
    { title: 'Duplicate Line Remover', href: '/tools/duplicate-line-remover', desc: 'Remove duplicates', category: 'Text' },
    { title: 'Text Diff Checker', href: '/tools/text-diff-checker', desc: 'Compare text differences', category: 'Text' },
    { title: 'Character Frequency Counter', href: '/tools/character-frequency-counter', desc: 'Count character frequency', category: 'Text' },
    { title: 'Lorem Ipsum Generator', href: '/tools/lorem-ipsum-generator', desc: 'Generate placeholder text', category: 'Text' },
    { title: 'Paraphraser', href: '/tools/paraphraser', desc: 'Paraphrase text', category: 'Text' },
    { title: 'Plagiarism Checker', href: '/tools/plagiarism', desc: 'Check plagiarism', category: 'Text' },
    
    // Code Beautifiers
    { title: 'HTML Beautifier & Minifier', href: '/tools/html-beautifier-minifier', desc: 'Format HTML code', category: 'Code' },
    { title: 'CSS Beautifier & Minifier', href: '/tools/css-beautifier-minifier', desc: 'Format CSS code', category: 'Code' },
    { title: 'JSON Beautifier & Validator', href: '/tools/json-beautifier-validator', desc: 'Format JSON', category: 'Code' },
    { title: 'XML Beautifier & Validator', href: '/tools/xml-beautifier-validator', desc: 'Format XML', category: 'Code' },
    { title: 'SQL Formatter', href: '/tools/sql-formatter', desc: 'Format SQL queries', category: 'Code' },
    { title: 'PHP Beautifier', href: '/tools/php-beautifier', desc: 'Format PHP code', category: 'Code' },
    { title: 'Python Formatter', href: '/tools/python-formatter', desc: 'Format Python code', category: 'Code' },
    { title: 'Code Syntax Highlighter', href: '/tools/code-syntax-highlighter', desc: 'Highlight code syntax', category: 'Code' },
    { title: 'Regex Tester', href: '/tools/regex-tester', desc: 'Test regular expressions', category: 'Code' },
    
    // Encoders & Decoders
    { title: 'Base64 Encoder/Decoder', href: '/tools/base64-encoder-decoder', desc: 'Encode/decode Base64', category: 'Encoder' },
    { title: 'URL Encoder/Decoder', href: '/tools/url-encoder-decoder', desc: 'Encode/decode URLs', category: 'Encoder' },
    { title: 'HTML Encoder/Decoder', href: '/tools/html-encoder-decoder', desc: 'Encode/decode HTML', category: 'Encoder' },
    { title: 'JWT Decoder', href: '/tools/jwt-decoder', desc: 'Decode JWT tokens', category: 'Encoder' },
    { title: 'ASCII Converter', href: '/tools/ascii-converter', desc: 'Convert to ASCII', category: 'Encoder' },
    { title: 'Binary Translator', href: '/tools/binary-translator', desc: 'Translate binary', category: 'Encoder' },
    { title: 'ROT13 Cipher', href: '/tools/rot13-cipher', desc: 'ROT13 encryption', category: 'Encoder' },
    { title: 'MD5 Generator', href: '/tools/md5-generator', desc: 'Generate MD5 hash', category: 'Encoder' },
    { title: 'SHA256 Generator', href: '/tools/sha256-generator', desc: 'Generate SHA256 hash', category: 'Encoder' },
    { title: 'SHA512 Generator', href: '/tools/sha512-generator', desc: 'Generate SHA512 hash', category: 'Encoder' },
    
    // Color Tools
    { title: 'HEX to RGB Converter', href: '/tools/hex-to-rgb', desc: 'Convert HEX to RGB', category: 'Color' },
    { title: 'RGB to HEX Converter', href: '/tools/rgb-to-hex', desc: 'Convert RGB to HEX', category: 'Color' },
    { title: 'HSL to RGB Converter', href: '/tools/hsl-to-rgb', desc: 'Convert HSL to RGB', category: 'Color' },
    { title: 'RGB to HSL Converter', href: '/tools/rgb-to-hsl', desc: 'Convert RGB to HSL', category: 'Color' },
    { title: 'CMYK to RGB Converter', href: '/tools/cmyk-to-rgb', desc: 'Convert CMYK to RGB', category: 'Color' },
    { title: 'RGB to CMYK Converter', href: '/tools/rgb-to-cmyk', desc: 'Convert RGB to CMYK', category: 'Color' },
    { title: 'Color Palette Generator', href: '/tools/color-palette-generator', desc: 'Generate color palettes', category: 'Color' },
    { title: 'Color Shades Generator', href: '/tools/color-shades-generator', desc: 'Generate color shades', category: 'Color' },
    { title: 'Color Mixer', href: '/tools/color-mixer', desc: 'Mix colors', category: 'Color' },
    { title: 'Color Name Finder', href: '/tools/color-name-finder', desc: 'Find color names', category: 'Color' },
    
    // Binary & Hex Tools
    { title: 'Binary Converter', href: '/tools/binary-converter', desc: 'Convert binary numbers', category: 'Binary' },
    { title: 'Binary Calculator', href: '/tools/binary-calculator', desc: 'Calculate binary', category: 'Binary' },
    { title: 'Binary to Decimal', href: '/tools/binary-to-decimal', desc: 'Convert binary to decimal', category: 'Binary' },
    { title: 'Binary to HEX', href: '/tools/binary-to-hex', desc: 'Convert binary to HEX', category: 'Binary' },
    { title: 'Binary to Octal', href: '/tools/binary-to-octal', desc: 'Convert binary to octal', category: 'Binary' },
    { title: 'Decimal to Binary', href: '/tools/decimal-to-binary', desc: 'Convert decimal to binary', category: 'Binary' },
    { title: 'Decimal to HEX', href: '/tools/decimal-to-hex', desc: 'Convert decimal to HEX', category: 'Binary' },
    { title: 'HEX Converter', href: '/tools/hex-converter', desc: 'Convert HEX numbers', category: 'Binary' },
    { title: 'HEX to Binary', href: '/tools/hex-to-binary', desc: 'Convert HEX to binary', category: 'Binary' },
    { title: 'HEX to Decimal', href: '/tools/hex-to-decimal', desc: 'Convert HEX to decimal', category: 'Binary' },
    { title: 'Octal to Binary', href: '/tools/octal-to-binary', desc: 'Convert octal to binary', category: 'Binary' },
    { title: 'Octal to Decimal', href: '/tools/octal-to-decimal', desc: 'Convert octal to decimal', category: 'Binary' },
    { title: 'Bitwise Operations', href: '/tools/bitwise-operations', desc: 'Perform bitwise operations', category: 'Binary' },
    { title: "Two's Complement Calculator", href: '/tools/twos-complement-calculator', desc: "Calculate two's complement", category: 'Binary' },
    
    // Other Tools
    { title: 'Image Compress', href: '/tools/image-compress', desc: 'Compress images', category: 'Other' },
  ];

  const categories = ['All', 'SEO', 'Network', 'DNS', 'Domain', 'Links', 'Text', 'Code', 'Encoder', 'Color', 'Binary', 'Other'];

  const filteredTools = allTools.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredTools = [
    { title: 'SEO Audit Tool', href: '/tools/seo-audit', desc: 'Complete website SEO analysis with PageSpeed scores, Core Web Vitals, and 18+ checks.' },
    { title: 'Robots.txt Generator', href: '/tools/robots-txt-generator', desc: 'AI-powered robots.txt file generator with live preview and download.' },
    { title: 'HTTP Status Checker', href: '/tools/http-status-checker', desc: 'Check 200, 301, 404, 500 status codes and redirects for multiple URLs.' },
    { title: 'Meta Tag Generator', href: '/tools/meta-generator', desc: 'Generate SEO-friendly title tags, meta descriptions, and Open Graph tags with character counter.' },
    { title: 'Keyword Density Checker', href: '/tools/keyword-density-checker', desc: 'Analyze keyword frequency and density to avoid keyword stuffing and optimize content.' },
    { title: 'Domain Authority Checker', href: '/tools/domain-authority-checker', desc: 'Check domain authority and spam score instantly.' },
  ];
  return (
    <Layout>
      <Head>
        <title>ProURLMonitor - Free SEO Tools, Domain Authority Checker & URL Analysis</title>
        <meta name="description" content="ProURLMonitor offers 140+ free SEO tools including Domain Authority Checker, Broken Links Checker, HTTP Status Checker, Meta Tag Generator, AI Content Detector, and more. Analyze domains, check backlinks, and optimize your website for better search rankings." />
        <link rel="canonical" href="https://www.prourlmonitor.com/" />
      </Head>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-emerald-800 mb-4 leading-tight">Complete Domain & URL Intelligence Tools</h1>
        <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">ProURLMonitor provides a comprehensive suite of domain analysis, SEO auditing, and URL monitoring tools. Check domain authority, analyze backlinks, verify domain history, and monitor your web presence — all in one platform.</p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Link href="#all-tools" className="btn btn-primary text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 w-full sm:w-auto">Browse All Tools</Link>
          <Link href="/blog" className="btn btn-secondary text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 w-full sm:w-auto">Read Blog</Link>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-4 sm:mb-6">Featured Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {featuredTools.map((t, i) => (
            <div key={i} className="card">
              <h3 className="text-xl font-semibold mb-2 text-emerald-700">{t.title}</h3>
              <p className="text-gray-600 mb-4 text-sm">{t.desc}</p>
              <Link href={t.href} className="btn btn-primary">Open Tool</Link>
            </div>
          ))}
        </div>
      </section>

      {/* All Tools Section with Search */}
      <section id="all-tools" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-6">All Tools ({allTools.length})</h2>
        
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Search tools... (e.g., SEO, domain, color, binary)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border-2 border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-base"
            />
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              {cat} {cat === 'All' && `(${allTools.length})`}
              {cat !== 'All' && `(${allTools.filter(t => t.category === cat).length})`}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool, i) => (
              <Link
                key={i}
                href={tool.href}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition border border-emerald-100 hover:border-emerald-300 group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-emerald-700 group-hover:text-emerald-800 text-sm leading-tight flex-1">
                    {tool.title}
                  </h3>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded ml-2 whitespace-nowrap">
                    {tool.category}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-3">{tool.desc}</p>
                <div className="text-xs text-emerald-600 group-hover:text-emerald-700 font-medium">
                  Open Tool →
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-2">No tools found matching "{searchQuery}"</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Results Count */}
        {searchQuery || selectedCategory !== 'All' ? (
          <div className="mt-6 text-center text-sm text-gray-600">
            Showing {filteredTools.length} of {allTools.length} tools
          </div>
        ) : null}
      </section>

      {/* Tools Overview Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="prose prose-emerald max-w-none">
          <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-6">Comprehensive SEO & Domain Analysis Tools</h2>
          
          <div className="text-gray-700 leading-relaxed space-y-4">
            <p>
              ProURLMonitor is your all-in-one platform for <strong>professional SEO analysis and domain intelligence</strong>. Whether you're an SEO specialist, digital marketer, web developer, or website owner, our suite of <strong>140+ free tools</strong> helps you optimize your online presence, monitor website health, and improve search engine rankings. From AI-powered content detection to binary converters, we provide comprehensive tools for every digital need.
            </p>
            
            <p>
              Our <Link href="/tools/domain-authority-checker" className="text-emerald-600 hover:text-emerald-700 font-medium">Domain Authority Checker</Link> provides instant insights into your website's credibility with accurate DA scores and spam score analysis. Need to ensure your website is crawlable? Use our <Link href="/tools/robots-txt-generator" className="text-emerald-600 hover:text-emerald-700 font-medium">Robots.txt Generator</Link> to create perfectly formatted robots.txt files with AI-powered suggestions. Identify technical issues with our <Link href="/tools/http-status-checker" className="text-emerald-600 hover:text-emerald-700 font-medium">HTTP Status Checker</Link> that scans multiple URLs for 200, 301, 404, and 500 status codes, helping you fix broken pages and redirect chains.
            </p>
            
            <p>
              Optimize your on-page SEO with our <Link href="/tools/meta-generator" className="text-emerald-600 hover:text-emerald-700 font-medium">Meta Tag Generator</Link> for creating perfect title tags and meta descriptions, while the <Link href="/tools/heading-analyzer" className="text-emerald-600 hover:text-emerald-700 font-medium">Heading Analyzer</Link> ensures proper H1-H6 structure. Check your keyword optimization using the <Link href="/tools/keyword-density-checker" className="text-emerald-600 hover:text-emerald-700 font-medium">Keyword Density Checker</Link> to avoid over-optimization penalties. Enhance your search visibility with our <Link href="/tools/schema-generator" className="text-emerald-600 hover:text-emerald-700 font-medium">Schema Markup Generator</Link> that creates JSON-LD structured data for rich snippets.
            </p>
            
            <p>
              For comprehensive website audits, our <Link href="/tools/seo-audit" className="text-emerald-600 hover:text-emerald-700 font-medium">SEO Audit Tool</Link> performs 18+ critical checks including PageSpeed scores, Core Web Vitals, and mobile-friendliness. Maintain site health with the <Link href="/tools/broken-links-checker" className="text-emerald-600 hover:text-emerald-700 font-medium">Broken Links Checker</Link> that scans your entire website for dead links. Monitor your backlink profile and track social engagement using our <Link href="/tools/social-media-counter" className="text-emerald-600 hover:text-emerald-700 font-medium">Social Media Counter</Link>. Need to analyze competitors or check domain history? Try our <Link href="/tools/reverse-ip-domain-checker" className="text-emerald-600 hover:text-emerald-700 font-medium">Reverse IP Domain Checker</Link> and <Link href="/tools/bulk-domain-age-checker" className="text-emerald-600 hover:text-emerald-700 font-medium">Bulk Domain Age Checker</Link> for detailed domain intelligence.
            </p>
            
            <p>
              All our tools are designed with <strong>user experience in mind</strong>—fast loading, no registration required, and most tools run entirely in your browser for maximum privacy and security. From <Link href="/tools/link-extractor" className="text-emerald-600 hover:text-emerald-700 font-medium">Link Extraction</Link> to <Link href="/tools/xml-html-sitemap-generator" className="text-emerald-600 hover:text-emerald-700 font-medium">XML Sitemap Generation</Link>, ProURLMonitor provides everything you need to succeed in modern SEO.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Why ProURLMonitor?</h2>
        <ul className="list-disc pl-5 sm:pl-6 text-gray-700 space-y-2 text-sm sm:text-base">
          <li><strong>140+ professional SEO, domain, text, and developer tools</strong> - Complete toolkit for all your needs</li>
          <li><strong>100% free, no registration required</strong> - All tools work instantly without sign-up</li>
          <li><strong>Privacy-focused</strong> - Most tools run in your browser, no data uploaded to servers</li>
          <li><strong>Complete SEO suite</strong> - From keyword research to schema markup generation</li>
          <li><strong>Developer utilities</strong> - Code formatters, converters, encoders & more</li>
        </ul>
      </section>
    </Layout>
  );
}
