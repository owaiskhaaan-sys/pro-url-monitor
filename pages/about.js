import Link from 'next/link';
import Layout from '../components/Layout';

export default function About() {
  return (
    <Layout>
      <section className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold text-emerald-800 mb-4">About ProURLMonitor</h1>
          <p className="text-lg text-gray-700">
            ProURLMonitor is a comprehensive suite of free online tools designed to help digital marketers, webmasters, and SEO professionals analyze domains, monitor links, and optimize website performance.
          </p>
        </div>

        {/* Our Mission */}
        <div className="mb-16 bg-emerald-50 border border-emerald-200 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-emerald-900 mb-4">Our Mission</h2>
          <p className="text-gray-800 mb-4">
            We believe that professional-grade SEO tools should be <strong>accessible to everyone</strong>, regardless of budget. Our mission is to provide free, instant, and accurate tools that help you understand your domain authority, backlink profile, and competitive landscape.
          </p>
          <p className="text-gray-800">
            No registration required. No hidden fees. No usage limits. Just powerful tools that run directly in your browser, with your data staying completely private and secure.
          </p>
        </div>

        {/* Why Choose ProURLMonitor */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-emerald-900 mb-8">Why Choose ProURLMonitor?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-emerald-100 rounded-lg p-6 hover:shadow-md transition">
              <h3 className="text-xl font-bold text-emerald-700 mb-3">✓ Completely Free</h3>
              <p className="text-gray-700">
                All tools are free forever. No premium tiers, no hidden charges, no subscription required. Analyze as many domains as you want without limitations.
              </p>
            </div>
            <div className="bg-white border border-emerald-100 rounded-lg p-6 hover:shadow-md transition">
              <h3 className="text-xl font-bold text-emerald-700 mb-3">✓ Instant Results</h3>
              <p className="text-gray-700">
                Get results in seconds, not hours. Our tools run directly in your browser, providing immediate feedback on domain authority, backlinks, rankings, and more.
              </p>
            </div>
            <div className="bg-white border border-emerald-100 rounded-lg p-6 hover:shadow-md transition">
              <h3 className="text-xl font-bold text-emerald-700 mb-3">✓ No Registration</h3>
              <p className="text-gray-700">
                Start using tools instantly. No account creation, no email verification, no login required. Just visit and use any tool immediately.
              </p>
            </div>
            <div className="bg-white border border-emerald-100 rounded-lg p-6 hover:shadow-md transition">
              <h3 className="text-xl font-bold text-emerald-700 mb-3">✓ Privacy First</h3>
              <p className="text-gray-700">
                Your data is your business. Most tools run in your browser, meaning we never store or analyze your searches. Complete privacy guaranteed.
              </p>
            </div>
            <div className="bg-white border border-emerald-100 rounded-lg p-6 hover:shadow-md transition">
              <h3 className="text-xl font-bold text-emerald-700 mb-3">✓ Comprehensive Coverage</h3>
              <p className="text-gray-700">
                From domain authority checking to backlink analysis, WHOIS lookups to malware scanning—17 tools covering every major SEO need.
              </p>
            </div>
            <div className="bg-white border border-emerald-100 rounded-lg p-6 hover:shadow-md transition">
              <h3 className="text-xl font-bold text-emerald-700 mb-3">✓ Easy to Use</h3>
              <p className="text-gray-700">
                Intuitive interfaces designed for everyone. No technical expertise needed. Complete beginners and SEO pros both love our tools.
              </p>
            </div>
          </div>
        </div>

        {/* Our Tools */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-emerald-900 mb-8">Our Tools Suite</h2>
          <p className="text-gray-800 mb-8">
            ProURLMonitor includes 17 carefully designed tools for domain analysis, link monitoring, and SEO optimization:
          </p>

          <div className="space-y-6">
            {/* Domain Tools */}
            <div className="bg-white border border-emerald-200 rounded-lg p-6">
              <h3 className="text-2xl font-bold text-emerald-700 mb-4">Domain Analysis Tools</h3>
              <ul className="space-y-2 text-gray-800">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <div>
                    <strong><Link href="/tools/domain-authority-checker" className="text-emerald-600 hover:underline">Domain Authority Checker</Link>:</strong> Check domain authority (DA) and spam scores instantly
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <div>
                    <strong><Link href="/tools/bulk-domain-age-checker" className="text-emerald-600 hover:underline">Bulk Domain Age Checker</Link>:</strong> Analyze creation date and age of multiple domains at once
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <div>
                    <strong><Link href="/tools/bulk-domain-whois-checker" className="text-emerald-600 hover:underline">Bulk Domain WHOIS Checker</Link>:</strong> Access WHOIS data including registrar and expiration dates
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <div>
                    <strong><Link href="/tools/domain-ip-history-checker" className="text-emerald-600 hover:underline">Domain IP History Checker</Link>:</strong> Trace IP address history and hosting changes
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <div>
                    <strong><Link href="/tools/reverse-ip-domain-checker" className="text-emerald-600 hover:underline">Reverse IP Domain Checker</Link>:</strong> Find all domains hosted on the same server
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <div>
                    <strong><Link href="/tools/reverse-whois-checker" className="text-emerald-600 hover:underline">Reverse WHOIS Checker</Link>:</strong> Identify domains registered by same person/company
                  </div>
                </li>
              </ul>
            </div>

            {/* Link & SEO Tools */}
            <div className="bg-white border border-emerald-200 rounded-lg p-6">
              <h3 className="text-2xl font-bold text-emerald-700 mb-4">Link & SEO Tools</h3>
              <ul className="space-y-2 text-gray-800">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <div>
                    <strong><Link href="/tools/backlinks-maker" className="text-emerald-600 hover:underline">Backlinks Maker</Link>:</strong> Generate HTML and Markdown backlink code for link building
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <div>
                    <strong><Link href="/tools/link-extractor" className="text-emerald-600 hover:underline">Link Extractor</Link>:</strong> Extract all URLs from text, HTML, or web content automatically
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <div>
                    <strong><Link href="/tools/broken-links-checker" className="text-emerald-600 hover:underline">Broken Links Checker</Link>:</strong> Find 404 errors and broken links on your website
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <div>
                    <strong><Link href="/tools/google-pagerank-checker" className="text-emerald-600 hover:underline">Google PageRank Checker</Link>:</strong> Check PageRank score and page authority
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <div>
                    <strong><Link href="/tools/link-search" className="text-emerald-600 hover:underline">Link Search</Link>:</strong> Search and analyze backlinks from your content
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <div>
                    <strong><Link href="/tools/social-media-counter" className="text-emerald-600 hover:underline">Social Media Counter</Link>:</strong> Track social shares and engagement metrics
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <div>
                    <strong><Link href="/tools/bulk-alexa-rank-checker" className="text-emerald-600 hover:underline">Bulk Alexa Rank Checker</Link>:</strong> Check website traffic rankings and popularity
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <div>
                    <strong><Link href="/tools/alexa-rank-comparison" className="text-emerald-600 hover:underline">Alexa Rank Comparison</Link>:</strong> Compare traffic and popularity between multiple websites
                  </div>
                </li>
              </ul>
            </div>

            {/* Technical & Security Tools */}
            <div className="bg-white border border-emerald-200 rounded-lg p-6">
              <h3 className="text-2xl font-bold text-emerald-700 mb-4">Technical & Security Tools</h3>
              <ul className="space-y-2 text-gray-800">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <div>
                    <strong><Link href="/tools/xml-html-sitemap-generator" className="text-emerald-600 hover:underline">XML & HTML Sitemap Generator</Link>:</strong> Create XML sitemaps for better search engine crawling
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <div>
                    <strong><Link href="/tools/google-malware-checker" className="text-emerald-600 hover:underline">Google Malware Checker</Link>:</strong> Scan websites for malware and security threats
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <div>
                    <strong><Link href="/tools/ping-multiple-urls-online" className="text-emerald-600 hover:underline">Ping Multiple URLs</Link>:</strong> Check website uptime and response times
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16 bg-emerald-50 border border-emerald-200 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-emerald-900 mb-6">How It Works</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div>
                <h3 className="text-lg font-bold text-emerald-900 mb-2">Choose a Tool</h3>
                <p className="text-gray-800">Visit our <Link href="/tools" className="text-emerald-600 hover:underline">Tools page</Link> and select the tool that fits your need—domain checker, backlink analyzer, rank tracker, or any other.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div>
                <h3 className="text-lg font-bold text-emerald-900 mb-2">Enter Your Data</h3>
                <p className="text-gray-800">Input your domain name, URL, or data into the tool. Most tools accept single or bulk entries for efficiency.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div>
                <h3 className="text-lg font-bold text-emerald-900 mb-2">Get Instant Results</h3>
                <p className="text-gray-800">Receive detailed insights about domain authority, backlinks, rankings, technical SEO, and more—all in seconds.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
              <div>
                <h3 className="text-lg font-bold text-emerald-900 mb-2">Take Action</h3>
                <p className="text-gray-800">Use the insights to improve your SEO strategy, identify opportunities, and make data-driven decisions for your website.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Who Uses ProURLMonitor */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-emerald-900 mb-8">Who Uses ProURLMonitor?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-emerald-100 rounded-lg p-6">
              <h3 className="text-xl font-bold text-emerald-700 mb-2">SEO Professionals</h3>
              <p className="text-gray-700">
                Analyze competitor domains, check backlink quality, track keyword rankings, and monitor domain authority changes to optimize campaigns.
              </p>
            </div>
            <div className="bg-white border border-emerald-100 rounded-lg p-6">
              <h3 className="text-xl font-bold text-emerald-700 mb-2">Digital Marketers</h3>
              <p className="text-gray-700">
                Evaluate link opportunities, analyze website traffic, check domain history, and build competitive analysis reports for your clients.
              </p>
            </div>
            <div className="bg-white border border-emerald-100 rounded-lg p-6">
              <h3 className="text-xl font-bold text-emerald-700 mb-2">Website Owners</h3>
              <p className="text-gray-700">
                Monitor your domain health, find and fix broken links, scan for malware, check rankings, and improve overall website performance.
              </p>
            </div>
            <div className="bg-white border border-emerald-100 rounded-lg p-6">
              <h3 className="text-xl font-bold text-emerald-700 mb-2">Agencies</h3>
              <p className="text-gray-700">
                Provide client reports with domain insights, backlink analysis, and competitive data to support your SEO and digital marketing services.
              </p>
            </div>
            <div className="bg-white border border-emerald-100 rounded-lg p-6">
              <h3 className="text-xl font-bold text-emerald-700 mb-2">Content Creators</h3>
              <p className="text-gray-700">
                Track social shares, analyze link performance, identify backlink opportunities, and understand audience engagement with your content.
              </p>
            </div>
            <div className="bg-white border border-emerald-100 rounded-lg p-6">
              <h3 className="text-xl font-bold text-emerald-700 mb-2">Beginners</h3>
              <p className="text-gray-700">
                Learn SEO fundamentals with easy-to-use tools. Understand domain authority, backlinks, rankings, and technical SEO concepts simply.
              </p>
            </div>
          </div>
        </div>

        {/* Common Questions */}
        <div className="mb-16 bg-white border border-emerald-200 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-emerald-900 mb-8">Common Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-emerald-700 mb-2">Are all tools really free?</h3>
              <p className="text-gray-800">Yes! Every tool is completely free. No hidden costs, no premium versions, no payment required ever. Use as much as you want.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-700 mb-2">Do I need to create an account?</h3>
              <p className="text-gray-800">No. All tools work without registration. Just visit, select a tool, and start using it immediately. No email required.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-700 mb-2">Is my data safe?</h3>
              <p className="text-gray-800">Yes. Most tools run directly in your browser, so we never store your search data. Your privacy is completely protected.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-700 mb-2">How accurate are the results?</h3>
              <p className="text-gray-800">Our tools use verified data sources and algorithms to provide accurate insights. Results are reliable for SEO analysis and decision-making.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-700 mb-2">Can I use bulk data?</h3>
              <p className="text-gray-800">Yes! Many tools like Domain Age Checker, WHOIS Checker, and Alexa Rank Checker accept bulk entries for checking multiple domains at once.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-700 mb-2">Do you offer API access?</h3>
              <p className="text-gray-800">Currently, all tools are web-based. <Link href="/contact" className="text-emerald-600 hover:underline">Contact us</Link> if you're interested in API integration for bulk operations.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-emerald-700 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Analyze Your Domains?</h2>
          <p className="text-emerald-100 mb-6 text-lg">
            Start using our free SEO tools today. No registration required, instant results, complete privacy.
          </p>
          <Link href="/tools" className="inline-block bg-white text-emerald-700 px-8 py-3 rounded-lg font-bold hover:bg-emerald-50 transition">
            Explore All Tools →
          </Link>
        </div>
      </section>
    </Layout>
  );
}
