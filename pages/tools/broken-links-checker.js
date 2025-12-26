import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function BrokenLinksChecker() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const checkLinks = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults(null);

    try {
      let targetUrl = url.trim();
      if (!targetUrl.startsWith('http')) {
        targetUrl = 'https://' + targetUrl;
      }

      // Fetch the HTML
      const response = await fetch(`/api/fetch-page?url=${encodeURIComponent(targetUrl)}`);
      if (!response.ok) throw new Error('Failed to fetch page');
      
      const html = await response.text();
      
      // Extract all links
      const linkRegex = /<a[^>]+href=["']([^"']+)["']/gi;
      const links = [];
      let match;
      
      while ((match = linkRegex.exec(html)) !== null) {
        let href = match[1];
        
        // Convert relative URLs to absolute
        if (href.startsWith('/')) {
          const urlObj = new URL(targetUrl);
          href = urlObj.origin + href;
        } else if (!href.startsWith('http')) {
          continue; // Skip mailto:, tel:, javascript:, etc.
        }
        
        links.push(href);
      }

      const uniqueLinks = [...new Set(links)];
      
      // Check each link
      const linkStatuses = await Promise.all(
        uniqueLinks.slice(0, 50).map(async (link) => { // Limit to 50 links
          try {
            const checkResponse = await fetch(`/api/check-url?url=${encodeURIComponent(link)}`);
            const data = await checkResponse.json();
            return {
              url: link,
              status: data.status,
              statusText: data.statusText,
              broken: data.status >= 400
            };
          } catch (err) {
            return {
              url: link,
              status: 0,
              statusText: 'Failed to check',
              broken: true
            };
          }
        })
      );

      const brokenLinks = linkStatuses.filter(l => l.broken);
      const workingLinks = linkStatuses.filter(l => !l.broken);

      setResults({
        total: linkStatuses.length,
        broken: brokenLinks.length,
        working: workingLinks.length,
        links: linkStatuses,
        brokenLinks,
        workingLinks
      });

    } catch (err) {
      setError('Error checking links: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Broken Links Checker - Find 404 Errors | ProURLMonitor</title>
        <meta name="description" content="Free broken links checker tool. Scan your website for 404 errors, dead links, and broken URLs. Improve SEO and user experience." />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4">Broken Links Checker</h1>
        <p className="text-gray-600 mb-8">Scan and identify all broken links on your website (checks up to 50 links)</p>

        <form onSubmit={checkLinks} className="card mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? '🔍 Scanning Links...' : '🔍 Check Broken Links'}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        {results && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="card bg-emerald-50">
              <h2 className="text-2xl font-bold text-emerald-700 mb-4">Summary</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-gray-700">{results.total}</div>
                  <div className="text-sm text-gray-600">Total Links</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">{results.working}</div>
                  <div className="text-sm text-gray-600">Working</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-600">{results.broken}</div>
                  <div className="text-sm text-gray-600">Broken</div>
                </div>
              </div>
            </div>

            {/* Broken Links */}
            {results.broken > 0 && (
              <div className="card">
                <h2 className="text-xl font-bold text-red-700 mb-4">❌ Broken Links ({results.broken})</h2>
                <div className="space-y-3">
                  {results.brokenLinks.map((link, idx) => (
                    <div key={idx} className="border-l-4 border-red-500 pl-4 py-2">
                      <div className="font-mono text-sm text-gray-700 break-all">{link.url}</div>
                      <div className="text-xs text-red-600 mt-1">
                        Status: {link.status} {link.statusText}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Working Links */}
            <div className="card">
              <h2 className="text-xl font-bold text-green-700 mb-4">✅ Working Links ({results.working})</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {results.workingLinks.map((link, idx) => (
                  <div key={idx} className="text-sm text-gray-600 border-b border-gray-100 pb-2">
                    <div className="font-mono break-all">{link.url}</div>
                    <div className="text-xs text-green-600">Status: {link.status} {link.statusText}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SEO Content Section */}
        <div className="mt-16 prose prose-emerald max-w-none">
          <h2 className="text-2xl font-bold text-emerald-700 mb-4">What is a Broken Links Checker and Why You Need It</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            A broken links checker is an essential SEO tool that scans your website to identify dead links, 404 errors, and broken URLs. These broken links can severely damage your website's search engine rankings, user experience, and credibility. When visitors click on a link and land on a "404 Not Found" page, they're likely to leave your site immediately, increasing your bounce rate and signaling to Google that your site isn't well-maintained.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Using a free broken links checker tool like ours helps you discover and fix these issues before they hurt your SEO performance. Whether you're a blogger, business owner, or web developer, regularly checking for broken links should be part of your website maintenance routine.
          </p>

          <h2 className="text-2xl font-bold text-emerald-700 mb-4">How Broken Links Hurt Your SEO Rankings</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Search engines like Google prioritize websites that provide excellent user experiences. When your site has multiple broken links, it sends negative signals to search engine crawlers. Here's how broken links damage your SEO:
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            <strong>Wasted Crawl Budget:</strong> Google allocates a specific crawl budget to each website. When crawlers encounter broken links, they waste valuable resources trying to access non-existent pages instead of indexing your fresh content.
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            <strong>Poor User Experience:</strong> Nothing frustrates visitors more than clicking a link only to find a dead end. High bounce rates caused by broken links tell Google that your site doesn't satisfy user intent, which can lead to ranking penalties.
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            <strong>Lost Link Equity:</strong> Internal links help distribute page authority throughout your site. When these links break, the link juice stops flowing, and important pages lose their ranking power.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Damaged Credibility:</strong> A website riddled with broken links appears unprofessional and outdated. Users are less likely to trust your content or return to your site.
          </p>

          <h2 className="text-2xl font-bold text-emerald-700 mb-4">Common Causes of Broken Links</h2>
          <p className="text-gray-700 leading-relaxed mb-4">Understanding why links break helps you prevent future issues:</p>
          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
            <li><strong>Deleted or moved pages</strong> without proper 301 redirects</li>
            <li><strong>Renamed files or URLs</strong> during website redesigns</li>
            <li><strong>Expired external domains</strong> that you linked to</li>
            <li><strong>Typos in URLs</strong> during content creation</li>
            <li><strong>Changes in website structure</strong> without updating internal links</li>
            <li><strong>Third-party websites</strong> removing or relocating their content</li>
          </ul>

          <h2 className="text-2xl font-bold text-emerald-700 mb-4">How Our Free Broken Links Checker Works</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Our broken links checker tool makes it incredibly easy to find and fix 404 errors on your website. Here's the step-by-step process:
          </p>
          <ol className="list-decimal pl-6 mb-6 text-gray-700 space-y-2">
            <li><strong>Enter Your Website URL:</strong> Simply paste your homepage URL or any specific page you want to scan.</li>
            <li><strong>Automatic Link Extraction:</strong> Our tool crawls the page and extracts all internal and external links (up to 50 links for quick analysis).</li>
            <li><strong>Status Code Verification:</strong> Each link is checked to determine its HTTP status code (200 OK, 404 Not Found, 301 Redirect, etc.).</li>
            <li><strong>Instant Results:</strong> Within seconds, you'll see a comprehensive report showing total links, working links, and broken links with their specific error codes.</li>
          </ol>
          <p className="text-gray-700 leading-relaxed mb-6">
            Unlike complex enterprise tools that require downloads or installations, our web-based broken links checker delivers instant results directly in your browser.
          </p>

          <h2 className="text-2xl font-bold text-emerald-700 mb-4">Step-by-Step Guide to Fix Broken Links</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Once you've identified broken links using our tool, follow these best practices to fix them:
          </p>
          <h3 className="text-xl font-semibold text-emerald-600 mb-3">For Internal Broken Links:</h3>
          <ol className="list-decimal pl-6 mb-4 text-gray-700 space-y-2">
            <li>Check if the page was accidentally deleted or moved</li>
            <li>Set up a 301 redirect from the old URL to the new location</li>
            <li>Update all internal links pointing to the old URL</li>
            <li>If the page no longer exists, create a custom 404 page or redirect to a relevant alternative</li>
          </ol>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">For External Broken Links:</h3>
          <ol className="list-decimal pl-6 mb-4 text-gray-700 space-y-2">
            <li>Search for an updated version of the external resource</li>
            <li>Replace the broken link with a working alternative source</li>
            <li>Use the Wayback Machine to find archived versions of deleted pages</li>
            <li>If no replacement exists, remove the link or add a note explaining the resource is no longer available</li>
          </ol>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">For Redirect Chains:</h3>
          <ol className="list-decimal pl-6 mb-6 text-gray-700 space-y-2">
            <li>Identify redirect loops (A→B→C→A)</li>
            <li>Update links to point directly to the final destination</li>
            <li>Avoid multiple redirect hops that slow down page load times</li>
          </ol>

          <h2 className="text-2xl font-bold text-emerald-700 mb-4">Best Practices for Link Management</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Preventing broken links is easier than fixing them. Implement these strategies:
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            <strong>Regular Audits:</strong> Use our broken links checker tool monthly to catch issues early. Set a recurring reminder to scan your most important pages.
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            <strong>Update Old Content:</strong> When publishing new articles, review and update links in older posts that cover similar topics. This keeps your content fresh and maintains link integrity.
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            <strong>Monitor External Links:</strong> While you can't control external websites, regularly check outbound links to ensure they're still active. Consider using rel="nofollow" for less trustworthy external sources.
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            <strong>Implement Proper Redirects:</strong> Whenever you delete or move a page, always set up a 301 permanent redirect. Never leave old URLs returning 404 errors if they had backlinks or traffic.
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            <strong>Use Link Management Tools:</strong> Bookmark our <a href="/tools/http-status-checker" className="text-emerald-600 hover:underline">HTTP Status Checker</a> to verify individual URLs, and use our <a href="/tools/xml-html-sitemap-generator" className="text-emerald-600 hover:underline">XML & HTML Sitemap Generator</a> to ensure search engines can discover all your pages.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Test Before Publishing:</strong> Before going live with website changes, test all links in your staging environment. This prevents broken links from ever appearing on your live site.
          </p>

          <h2 className="text-2xl font-bold text-emerald-700 mb-4">Broken Links Checker for Large Websites</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you manage a large website with hundreds or thousands of pages, manual link checking becomes impractical. For comprehensive audits, consider these approaches:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
            <li><strong>Crawl Your Sitemap:</strong> Use our <a href="/tools/http-status-checker" className="text-emerald-600 hover:underline">sitemap crawler</a> to check every URL listed in your XML sitemap</li>
            <li><strong>Focus on Priority Pages:</strong> Start with your most important pages (homepage, top blog posts, product pages, landing pages)</li>
            <li><strong>Schedule Regular Scans:</strong> Set up weekly or monthly scans for different sections of your site</li>
            <li><strong>Track Historical Data:</strong> Keep records of past scans to identify patterns and recurring issues</li>
          </ul>

          <h2 className="text-2xl font-bold text-emerald-700 mb-4">Internal Linking Best Practices</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            While fixing broken links, take the opportunity to improve your internal linking structure:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
            <li>Link to related tools like our <a href="/tools/binary-translator" className="text-emerald-600 hover:underline">Binary Translator</a> or <a href="/tools/meta-generator" className="text-emerald-600 hover:underline">Meta Generator</a> when relevant</li>
            <li>Use descriptive anchor text instead of generic "click here" phrases</li>
            <li>Ensure important pages receive internal links from multiple sources</li>
            <li>Create content hubs that link to comprehensive guides like <a href="/blog/how-to-check-http-status-codes-for-seo" className="text-emerald-600 hover:underline">How to Check HTTP Status Codes for SEO</a></li>
            <li>Balance the number of internal and external links on each page</li>
          </ul>

          <h2 className="text-2xl font-bold text-emerald-700 mb-4">Frequently Asked Questions About Broken Links</h2>
          
          <h3 className="text-xl font-semibold text-emerald-600 mb-3">Q1: How often should I check for broken links?</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            A: For actively updated websites, check for broken links at least once per month. E-commerce sites and blogs that publish frequently should scan weekly. After major website updates or redesigns, run an immediate check.
          </p>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">Q2: Do broken links directly hurt my Google rankings?</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            A: While broken links aren't a direct ranking factor, they indirectly harm SEO by wasting crawl budget, increasing bounce rates, and damaging user experience—all of which negatively impact rankings.
          </p>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">Q3: Should I fix all broken links at once?</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            A: Prioritize based on importance. Fix broken links on high-traffic pages first, then tackle less critical pages. Internal broken links should be fixed before external ones since you have full control over them.
          </p>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">Q4: What's the difference between 404 and 410 errors?</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            A: A 404 error means "not found" temporarily, while a 410 error indicates the page is "gone" permanently. Use 410 when you intentionally delete content and don't want search engines to keep checking for it.
          </p>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">Q5: Can too many redirects hurt my SEO?</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            A: Redirect chains (multiple hops from one URL to another) slow down page load times and waste crawl budget. Always redirect directly to the final destination rather than creating chains.
          </p>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">Q6: How do I create a custom 404 page?</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            A: Design a helpful 404 page that includes a search bar, links to popular content, and your main navigation. This keeps users on your site even when they hit a dead link. Check our <a href="/tools/seo-audit" className="text-emerald-600 hover:underline">SEO Audit Tool</a> for more optimization tips.
          </p>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">Q7: Are broken external links as harmful as broken internal links?</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            A: Broken internal links are more harmful because they directly affect your site's crawlability and link equity distribution. However, too many broken external links also hurt user experience and credibility.
          </p>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">Q8: Can I automate broken link checking?</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            A: Yes! Bookmark our tool and set up a monthly reminder, or explore our other tools like the <a href="/tools/bulk" className="text-emerald-600 hover:underline">Bulk URL Checker</a> for batch processing multiple URLs at once.
          </p>

          <h2 className="text-2xl font-bold text-emerald-700 mb-4">Related SEO Tools</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Maximize your website's performance by combining our broken links checker with these complementary tools:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
            <li><a href="/tools/http-status-checker" className="text-emerald-600 hover:underline font-semibold">HTTP Status Checker</a> - Verify individual URL status codes and response times</li>
            <li><a href="/tools/xml-html-sitemap-generator" className="text-emerald-600 hover:underline font-semibold">XML & HTML Sitemap Generator</a> - Create comprehensive sitemaps for better indexing</li>
            <li><a href="/tools/seo-audit" className="text-emerald-600 hover:underline font-semibold">SEO Audit Tool</a> - Get a complete technical SEO analysis of your website</li>
            <li><a href="/tools/meta-generator" className="text-emerald-600 hover:underline font-semibold">Meta Tags Generator</a> - Optimize title tags and meta descriptions for better CTR</li>
            <li><a href="/tools/heading-analyzer" className="text-emerald-600 hover:underline font-semibold">Heading Analyzer</a> - Ensure proper heading structure for SEO and accessibility</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-8">
            For more detailed guides, read our blog post on <a href="/blog/how-to-check-http-status-codes-for-seo" className="text-emerald-600 hover:underline">How to Check HTTP Status Codes for SEO</a>.
          </p>
        </div>
      </div>
    </Layout>
  );
}
