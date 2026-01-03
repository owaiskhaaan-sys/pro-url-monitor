import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;
  const [searchQuery, setSearchQuery] = useState('');

  // All tools organized by category
  const allToolsByCategory = {
    seo: {
      name: 'SEO Tools',
      description: 'Comprehensive SEO analysis and optimization tools to improve your search engine rankings, monitor website health, and boost organic traffic.',
      icon: '🔍',
      tools: [
        { title: 'SEO Audit Tool', href: '/tools/seo-audit', desc: 'Complete website SEO analysis with 18+ checks' },
        { title: 'Meta Tag Generator', href: '/tools/meta-generator', desc: 'Generate SEO-friendly meta tags' },
        { title: 'Schema Markup Generator', href: '/tools/schema-generator', desc: 'Create JSON-LD structured data' },
        { title: 'FAQ Schema Generator', href: '/tools/faq-schema-generator', desc: 'Generate FAQ schema markup' },
        { title: 'Keyword Density Checker', href: '/tools/keyword-density-checker', desc: 'Analyze keyword frequency' },
        { title: 'Heading Tag Analyzer', href: '/tools/heading-analyzer', desc: 'Check H1-H6 structure' },
        { title: 'Robots.txt Generator', href: '/tools/robots-txt-generator', desc: 'AI-powered robots.txt generator' },
        { title: 'XML & HTML Sitemap Generator', href: '/tools/xml-html-sitemap-generator', desc: 'Create sitemaps' },
        { title: 'Meta Description Generator', href: '/tools/meta-description-generator', desc: 'Generate meta descriptions' },
        { title: 'SEO Title Generator', href: '/tools/seo-title-generator', desc: 'Create SEO titles' },
        { title: 'Alt Text Generator', href: '/tools/alt-text-generator', desc: 'Generate image alt text' },
        { title: 'Semantic Keyword Finder', href: '/tools/semantic-keyword-finder', desc: 'Find related keywords' },
        { title: 'Internal Linking Assistant', href: '/tools/internal-linking-assistant', desc: 'Optimize internal links' },
        { title: 'Content Readability Optimizer', href: '/tools/content-readability-optimizer', desc: 'Improve readability' },
        { title: 'Google Index Checker', href: '/tools/google-index-checker', desc: 'Check Google indexing' },
      ]
    },
    domain: {
      name: 'Domain Tools',
      description: 'Professional domain analysis tools for checking domain authority, WHOIS information, domain age, IP history, and comprehensive domain intelligence.',
      icon: '🌐',
      tools: [
        { title: 'Domain Authority Checker', href: '/tools/domain-authority-checker', desc: 'Check domain authority' },
        { title: 'Bulk Domain Age Checker', href: '/tools/bulk-domain-age-checker', desc: 'Check domain ages' },
        { title: 'Bulk Domain WHOIS Checker', href: '/tools/bulk-domain-whois-checker', desc: 'Bulk WHOIS lookup' },
        { title: 'Domain IP History Checker', href: '/tools/domain-ip-history-checker', desc: 'Check IP history' },
        { title: 'Reverse IP Domain Checker', href: '/tools/reverse-ip-domain-checker', desc: 'Find domains on IP' },
        { title: 'Reverse WHOIS Checker', href: '/tools/reverse-whois-checker', desc: 'Reverse WHOIS lookup' },
        { title: 'Class C IP Checker', href: '/tools/class-c-ip-checker', desc: 'Check Class C IPs' },
        { title: 'IP Location', href: '/tools/ip-location', desc: 'Find IP location' },
        { title: 'Bulk Alexa Rank Checker', href: '/tools/bulk-alexa-rank-checker', desc: 'Check Alexa ranks' },
        { title: 'Alexa Rank Comparison', href: '/tools/alexa-rank-comparison', desc: 'Compare Alexa ranks' },
      ]
    },
    network: {
      name: 'Network & HTTP Tools',
      description: 'Monitor website uptime, check HTTP status codes, find broken links, ping URLs from multiple locations, and diagnose network connectivity issues.',
      icon: '📡',
      tools: [
        { title: 'HTTP Status Checker', href: '/tools/http-status-checker', desc: 'Check 200, 301, 404, 500 codes' },
        { title: 'Broken Links Checker', href: '/tools/broken-links-checker', desc: 'Find broken links' },
        { title: 'Ping Multiple URLs', href: '/tools/ping-multiple-urls-online', desc: 'Ping multiple URLs' },
        { title: 'Server Status Checker', href: '/tools/server-status-checker', desc: 'Check server status' },
        { title: 'Server Port Scanner', href: '/tools/server-port-scanner', desc: 'Scan server ports' },
        { title: 'Traceroute Tool', href: '/tools/traceroute', desc: 'Trace network route' },
        { title: 'Different Locations Ping', href: '/tools/different-locations-ping', desc: 'Ping from multiple locations' },
        { title: 'DNS Records Checker', href: '/tools/dns-records-checker', desc: 'Check DNS records' },
        { title: 'DNS Propagation Checker', href: '/tools/dns-propagation-checker', desc: 'Check DNS propagation' },
        { title: 'DNS Report Checker', href: '/tools/dns-report-checker', desc: 'Comprehensive DNS report' },
        { title: 'Reverse NS Checker', href: '/tools/reverse-ns-checker', desc: 'Check nameservers' },
        { title: 'Google Malware Checker', href: '/tools/google-malware-checker', desc: 'Check for malware' },
        { title: 'Google PageRank Checker', href: '/tools/google-pagerank-checker', desc: 'Check PageRank' },
        { title: 'Link Extractor', href: '/tools/link-extractor', desc: 'Extract links from text' },
        { title: 'Backlinks Maker', href: '/tools/backlinks-maker', desc: 'Create backlinks' },
        { title: 'Link Search', href: '/tools/link-search', desc: 'Search for links' },
        { title: 'Social Media Counter', href: '/tools/social-media-counter', desc: 'Track social shares' },
      ]
    },
    text: {
      name: 'Text Tools',
      description: 'Powerful text manipulation tools including word counter, case converter, voice to text, text cleaner, find & replace, and more text utilities.',
      icon: '📝',
      tools: [
        { title: 'Word Counter', href: '/tools/word-counter', desc: 'Count words and characters' },
        { title: 'Voice to Text Converter', href: '/tools/voice-to-text', desc: 'Convert speech to text in 15+ languages' },
        { title: 'Case Converter', href: '/tools/case-converter', desc: 'Convert text case' },
        { title: 'Text Cleaner', href: '/tools/text-cleaner', desc: 'Clean text' },
        { title: 'Text Reverser', href: '/tools/text-reverser', desc: 'Reverse text' },
        { title: 'Text to Slug', href: '/tools/text-to-slug', desc: 'Convert to URL slug' },
        { title: 'Find and Replace', href: '/tools/find-and-replace', desc: 'Find and replace text' },
        { title: 'Sort Text Lines', href: '/tools/sort-text-lines', desc: 'Sort lines alphabetically' },
        { title: 'Remove Line Breaks', href: '/tools/remove-line-breaks', desc: 'Remove line breaks' },
        { title: 'Duplicate Line Remover', href: '/tools/duplicate-line-remover', desc: 'Remove duplicates' },
        { title: 'Text Diff Checker', href: '/tools/text-diff-checker', desc: 'Compare text differences' },
        { title: 'Character Frequency Counter', href: '/tools/character-frequency-counter', desc: 'Count character frequency' },
        { title: 'Lorem Ipsum Generator', href: '/tools/lorem-ipsum-generator', desc: 'Generate placeholder text' },
        { title: 'Paraphraser', href: '/tools/paraphraser', desc: 'Paraphrase text' },
        { title: 'Plagiarism Checker', href: '/tools/plagiarism', desc: 'Check plagiarism' },
      ]
    },
    code: {
      name: 'Code Tools & Formatters',
      description: 'Developer tools for formatting, beautifying, and validating HTML, CSS, JavaScript, JSON, XML, SQL, PHP, Python and more programming languages.',
      icon: '💻',
      tools: [
        { title: 'HTML Beautifier & Minifier', href: '/tools/html-beautifier-minifier', desc: 'Format HTML code' },
        { title: 'CSS Beautifier & Minifier', href: '/tools/css-beautifier-minifier', desc: 'Format CSS code' },
        { title: 'JSON Beautifier & Validator', href: '/tools/json-beautifier-validator', desc: 'Format JSON' },
        { title: 'XML Beautifier & Validator', href: '/tools/xml-beautifier-validator', desc: 'Format XML' },
        { title: 'SQL Formatter', href: '/tools/sql-formatter', desc: 'Format SQL queries' },
        { title: 'PHP Beautifier', href: '/tools/php-beautifier', desc: 'Format PHP code' },
        { title: 'Python Formatter', href: '/tools/python-formatter', desc: 'Format Python code' },
        { title: 'Code Syntax Highlighter', href: '/tools/code-syntax-highlighter', desc: 'Highlight code syntax' },
        { title: 'Regex Tester', href: '/tools/regex-tester', desc: 'Test regular expressions' },
      ]
    },
    converter: {
      name: 'Converters & Encoders',
      description: 'Convert between binary, hexadecimal, decimal, octal, Base64, URL encoding, color codes (RGB, HEX, HSL, CMYK), and various data formats.',
      icon: '🔄',
      tools: [
        { title: 'Base64 Encoder/Decoder', href: '/tools/base64-encoder-decoder', desc: 'Encode/decode Base64' },
        { title: 'URL Encoder/Decoder', href: '/tools/url-encoder-decoder', desc: 'Encode/decode URLs' },
        { title: 'HTML Encoder/Decoder', href: '/tools/html-encoder-decoder', desc: 'Encode/decode HTML' },
        { title: 'JWT Decoder', href: '/tools/jwt-decoder', desc: 'Decode JWT tokens' },
        { title: 'ASCII Converter', href: '/tools/ascii-converter', desc: 'Convert to ASCII' },
        { title: 'Binary Translator', href: '/tools/binary-translator', desc: 'Translate binary' },
        { title: 'ROT13 Cipher', href: '/tools/rot13-cipher', desc: 'ROT13 encryption' },
        { title: 'MD5 Generator', href: '/tools/md5-generator', desc: 'Generate MD5 hash' },
        { title: 'SHA256 Generator', href: '/tools/sha256-generator', desc: 'Generate SHA256 hash' },
        { title: 'SHA512 Generator', href: '/tools/sha512-generator', desc: 'Generate SHA512 hash' },
        { title: 'Binary Converter', href: '/tools/binary-converter', desc: 'Convert binary numbers' },
        { title: 'Binary Calculator', href: '/tools/binary-calculator', desc: 'Calculate binary' },
        { title: 'Binary to Decimal', href: '/tools/binary-to-decimal', desc: 'Convert binary to decimal' },
        { title: 'Binary to HEX', href: '/tools/binary-to-hex', desc: 'Convert binary to HEX' },
        { title: 'Binary to Octal', href: '/tools/binary-to-octal', desc: 'Convert binary to octal' },
        { title: 'Decimal to Binary', href: '/tools/decimal-to-binary', desc: 'Convert decimal to binary' },
        { title: 'Decimal to HEX', href: '/tools/decimal-to-hex', desc: 'Convert decimal to HEX' },
        { title: 'HEX Converter', href: '/tools/hex-converter', desc: 'Convert HEX numbers' },
        { title: 'HEX to Binary', href: '/tools/hex-to-binary', desc: 'Convert HEX to binary' },
        { title: 'HEX to Decimal', href: '/tools/hex-to-decimal', desc: 'Convert HEX to decimal' },
        { title: 'Octal to Binary', href: '/tools/octal-to-binary', desc: 'Convert octal to binary' },
        { title: 'Octal to Decimal', href: '/tools/octal-to-decimal', desc: 'Convert octal to decimal' },
        { title: 'Bitwise Operations', href: '/tools/bitwise-operations', desc: 'Perform bitwise operations' },
        { title: "Two's Complement Calculator", href: '/tools/twos-complement-calculator', desc: "Calculate two's complement" },
        { title: 'HEX to RGB Converter', href: '/tools/hex-to-rgb', desc: 'Convert HEX to RGB' },
        { title: 'RGB to HEX Converter', href: '/tools/rgb-to-hex', desc: 'Convert RGB to HEX' },
        { title: 'HSL to RGB Converter', href: '/tools/hsl-to-rgb', desc: 'Convert HSL to RGB' },
        { title: 'RGB to HSL Converter', href: '/tools/rgb-to-hsl', desc: 'Convert RGB to HSL' },
        { title: 'CMYK to RGB Converter', href: '/tools/cmyk-to-rgb', desc: 'Convert CMYK to RGB' },
        { title: 'RGB to CMYK Converter', href: '/tools/rgb-to-cmyk', desc: 'Convert RGB to CMYK' },
        { title: 'Color Palette Generator', href: '/tools/color-palette-generator', desc: 'Generate color palettes' },
        { title: 'Color Shades Generator', href: '/tools/color-shades-generator', desc: 'Generate color shades' },
        { title: 'Color Mixer', href: '/tools/color-mixer', desc: 'Mix colors' },
        { title: 'Color Name Finder', href: '/tools/color-name-finder', desc: 'Find color names' },
      ]
    },
    ai: {
      name: 'AI Tools',
      description: 'Artificial Intelligence powered tools for content detection, prompt generation, text humanization, resume optimization, and AI search ranking analysis.',
      icon: '🤖',
      tools: [
        { title: 'AI Content Detector', href: '/tools/ai-content-detector', desc: 'Detect AI-generated text from ChatGPT & other AI tools' },
        { title: 'AI Prompt Generator', href: '/tools/ai-prompt-generator', desc: 'Generate perfect prompts for ChatGPT, Claude, Gemini' },
        { title: 'AI Resume Optimizer', href: '/tools/ai-resume-optimizer', desc: 'Optimize resume for ATS with keyword matching & scoring' },
        { title: 'AI Search Ranking Checker', href: '/tools/ai-search-ranking-checker', desc: 'Track rankings in ChatGPT, Perplexity, Gemini' },
        { title: 'ChatGPT Prompt Templates', href: '/tools/chatgpt-prompt-templates', desc: '100+ ready-to-use AI prompts for every task' },
        { title: 'AI Text Humanizer', href: '/tools/ai-text-humanizer', desc: 'Make AI text sound natural and human-written' },
      ]
    }
  };

  const categoryData = allToolsByCategory[category] || null;

  if (!categoryData) {
    return (
      <Layout>
        <Head>
          <title>Category Not Found | ProURLMonitor</title>
        </Head>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Category Not Found</h1>
          <Link href="/" className="btn btn-primary">Go to Homepage</Link>
        </div>
      </Layout>
    );
  }

  const filteredTools = categoryData.tools.filter(tool => 
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <Head>
        <title>{categoryData.name} - Free {categoryData.name} | ProURLMonitor</title>
        <meta name="description" content={`${categoryData.description} ${categoryData.tools.length} free tools available.`} />
        <link rel="canonical" href={`https://www.prourlmonitor.com/tools/category/${category}`} />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-6xl mb-4">{categoryData.icon}</div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-emerald-800 mb-4">
              {categoryData.name}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
              {categoryData.description}
            </p>
            <div className="flex items-center justify-center gap-2 text-emerald-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">{categoryData.tools.length} Tools Available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder={`🔍 Search ${categoryData.name.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-12 border-2 border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          />
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filteredTools.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool, i) => (
                <Link
                  key={i}
                  href={tool.href}
                  className="card group hover:shadow-lg transition-all duration-200"
                >
                  <h3 className="text-xl font-semibold mb-2 text-emerald-700 group-hover:text-emerald-800">
                    {tool.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">{tool.desc}</p>
                  <div className="text-emerald-600 group-hover:text-emerald-700 font-medium flex items-center gap-2">
                    <span>Open Tool</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
            {searchQuery && (
              <div className="mt-8 text-center text-gray-600">
                Showing {filteredTools.length} of {categoryData.tools.length} tools
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No tools found matching "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Clear search
            </button>
          </div>
        )}
      </section>

      {/* Browse Other Categories */}
      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-emerald-700 mb-6 text-center">Browse Other Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(allToolsByCategory).filter(([key]) => key !== category).map(([key, cat]) => (
              <Link
                key={key}
                href={`/tools/category/${key}`}
                className="card text-center hover:shadow-lg transition group"
              >
                <div className="text-4xl mb-2">{cat.icon}</div>
                <h3 className="font-semibold text-emerald-700 group-hover:text-emerald-800 text-sm">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{cat.tools.length} tools</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/#all-tools" className="btn btn-primary">
              View All 140+ Tools
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

// Generate static paths for all category pages
export async function getStaticPaths() {
  const categories = ['seo', 'domain', 'network', 'text', 'code', 'image', 'converter', 'ai', 'security'];
  
  return {
    paths: categories.map(category => ({
      params: { category }
    })),
    fallback: false
  };
}

// Generate static props for each category page
export async function getStaticProps({ params }) {
  return {
    props: {
      category: params.category
    }
  };
}
