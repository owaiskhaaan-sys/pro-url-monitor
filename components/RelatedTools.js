import Link from 'next/link';

/**
 * Related Tools Component - Shows related tools based on category
 * Improves internal linking and helps users discover relevant tools
 * 
 * Usage:
 * <RelatedTools currentTool="/tools/http-status-checker" category="Network" />
 */

const allTools = {
  SEO: [
    { title: 'SEO Audit Tool', href: '/tools/seo-audit' },
    { title: 'Meta Tag Generator', href: '/tools/meta-generator' },
    { title: 'Schema Markup Generator', href: '/tools/schema-generator' },
    { title: 'Keyword Density Checker', href: '/tools/keyword-density-checker' },
    { title: 'Heading Tag Analyzer', href: '/tools/heading-analyzer' },
    { title: 'Robots.txt Generator', href: '/tools/robots-txt-generator' },
    { title: 'Sitemap Generator', href: '/tools/xml-html-sitemap-generator' },
    { title: 'Meta Description Generator', href: '/tools/meta-description-generator' },
    { title: 'SEO Title Generator', href: '/tools/seo-title-generator' },
    { title: 'Alt Text Generator', href: '/tools/alt-text-generator' },
    { title: 'Google Index Checker', href: '/tools/google-index-checker' },
    { title: 'Internal Linking Assistant', href: '/tools/internal-linking-assistant' },
  ],
  Network: [
    { title: 'HTTP Status Checker', href: '/tools/http-status-checker' },
    { title: 'Broken Links Checker', href: '/tools/broken-links-checker' },
    { title: 'Server Status Checker', href: '/tools/server-status-checker' },
    { title: 'Ping Multiple URLs', href: '/tools/ping-multiple-urls-online' },
    { title: 'Server Port Scanner', href: '/tools/server-port-scanner' },
    { title: 'Traceroute Tool', href: '/tools/traceroute' },
    { title: 'Different Locations Ping', href: '/tools/different-locations-ping' },
  ],
  DNS: [
    { title: 'DNS Records Checker', href: '/tools/dns-records-checker' },
    { title: 'DNS Propagation Checker', href: '/tools/dns-propagation-checker' },
    { title: 'DNS Report Checker', href: '/tools/dns-report-checker' },
    { title: 'Reverse NS Checker', href: '/tools/reverse-ns-checker' },
  ],
  Domain: [
    { title: 'Domain Authority Checker', href: '/tools/domain-authority-checker' },
    { title: 'Bulk Domain Age Checker', href: '/tools/bulk-domain-age-checker' },
    { title: 'Bulk Domain WHOIS Checker', href: '/tools/bulk-domain-whois-checker' },
    { title: 'Domain IP History Checker', href: '/tools/domain-ip-history-checker' },
    { title: 'Reverse IP Domain Checker', href: '/tools/reverse-ip-domain-checker' },
    { title: 'Reverse WHOIS Checker', href: '/tools/reverse-whois-checker' },
    { title: 'Class C IP Checker', href: '/tools/class-c-ip-checker' },
    { title: 'IP Location', href: '/tools/ip-location' },
  ],
  Text: [
    { title: 'Word Counter', href: '/tools/word-counter' },
    { title: 'Case Converter', href: '/tools/case-converter' },
    { title: 'Text Cleaner', href: '/tools/text-cleaner' },
    { title: 'Find and Replace', href: '/tools/find-and-replace' },
    { title: 'Sort Text Lines', href: '/tools/sort-text-lines' },
    { title: 'Remove Line Breaks', href: '/tools/remove-line-breaks' },
    { title: 'Duplicate Line Remover', href: '/tools/duplicate-line-remover' },
    { title: 'Text Diff Checker', href: '/tools/text-diff-checker' },
    { title: 'Text Reverser', href: '/tools/text-reverser' },
    { title: 'Text to Slug', href: '/tools/text-to-slug' },
  ],
  Code: [
    { title: 'HTML Beautifier', href: '/tools/html-beautifier-minifier' },
    { title: 'CSS Beautifier', href: '/tools/css-beautifier-minifier' },
    { title: 'JSON Beautifier', href: '/tools/json-beautifier-validator' },
    { title: 'XML Beautifier', href: '/tools/xml-beautifier-validator' },
    { title: 'SQL Formatter', href: '/tools/sql-formatter' },
    { title: 'PHP Beautifier', href: '/tools/php-beautifier' },
    { title: 'Python Formatter', href: '/tools/python-formatter' },
    { title: 'Regex Tester', href: '/tools/regex-tester' },
    { title: 'Code Syntax Highlighter', href: '/tools/code-syntax-highlighter' },
  ],
  Encoder: [
    { title: 'Base64 Encoder/Decoder', href: '/tools/base64-encoder-decoder' },
    { title: 'URL Encoder/Decoder', href: '/tools/url-encoder-decoder' },
    { title: 'HTML Encoder/Decoder', href: '/tools/html-encoder-decoder' },
    { title: 'JWT Decoder', href: '/tools/jwt-decoder' },
    { title: 'MD5 Generator', href: '/tools/md5-generator' },
    { title: 'SHA256 Generator', href: '/tools/sha256-generator' },
    { title: 'SHA512 Generator', href: '/tools/sha512-generator' },
    { title: 'Binary Translator', href: '/tools/binary-translator' },
    { title: 'ASCII Converter', href: '/tools/ascii-converter' },
    { title: 'ROT13 Cipher', href: '/tools/rot13-cipher' },
  ],
  Color: [
    { title: 'HEX to RGB Converter', href: '/tools/hex-to-rgb' },
    { title: 'RGB to HEX Converter', href: '/tools/rgb-to-hex' },
    { title: 'HSL to RGB Converter', href: '/tools/hsl-to-rgb' },
    { title: 'RGB to HSL Converter', href: '/tools/rgb-to-hsl' },
    { title: 'CMYK to RGB Converter', href: '/tools/cmyk-to-rgb' },
    { title: 'RGB to CMYK Converter', href: '/tools/rgb-to-cmyk' },
    { title: 'Color Palette Generator', href: '/tools/color-palette-generator' },
    { title: 'Color Shades Generator', href: '/tools/color-shades-generator' },
    { title: 'Color Mixer', href: '/tools/color-mixer' },
    { title: 'Color Name Finder', href: '/tools/color-name-finder' },
  ],
  Binary: [
    { title: 'Binary Converter', href: '/tools/binary-converter' },
    { title: 'Binary Calculator', href: '/tools/binary-calculator' },
    { title: 'Binary to Decimal', href: '/tools/binary-to-decimal' },
    { title: 'Binary to HEX', href: '/tools/binary-to-hex' },
    { title: 'Decimal to Binary', href: '/tools/decimal-to-binary' },
    { title: 'Decimal to HEX', href: '/tools/decimal-to-hex' },
    { title: 'HEX Converter', href: '/tools/hex-converter' },
    { title: 'HEX to Binary', href: '/tools/hex-to-binary' },
    { title: 'HEX to Decimal', href: '/tools/hex-to-decimal' },
    { title: 'Octal to Binary', href: '/tools/octal-to-binary' },
    { title: 'Bitwise Operations', href: '/tools/bitwise-operations' },
  ],
};

export default function RelatedTools({ currentTool, category = 'SEO', maxTools = 6 }) {
  if (!category || !allTools[category]) {
    return null;
  }

  // Get tools from category, exclude current tool
  const relatedTools = allTools[category]
    .filter(tool => tool.href !== currentTool)
    .slice(0, maxTools);

  if (relatedTools.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 pt-8 border-t-2 border-emerald-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-emerald-700 mb-2">Related Tools</h2>
        <p className="text-gray-600 text-sm">You might also find these tools useful</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedTools.map((tool, index) => (
          <Link
            key={index}
            href={tool.href}
            className="group p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-emerald-700 group-hover:text-emerald-800 text-sm">
                {tool.title}
              </h3>
              <svg 
                className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="mt-2 text-xs text-emerald-600 font-medium">
              Open Tool →
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link 
          href="/#all-tools" 
          className="inline-flex items-center text-emerald-700 hover:text-emerald-800 font-medium text-sm"
        >
          <span>Browse all {category} tools</span>
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
