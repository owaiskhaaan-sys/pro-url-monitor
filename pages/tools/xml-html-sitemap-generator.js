import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function XMLHTMLSitemapGenerator() {
  const [domain, setDomain] = useState('');
  const [urls, setUrls] = useState('');
  const [generated, setGenerated] = useState(null);
  const [format, setFormat] = useState('xml');

  const handleGenerate = () => {
    if (!domain.trim()) {
      alert('Please enter a domain');
      return;
    }
    
    const urlList = urls.trim() ? urls.split('\n').map(u => u.trim()).filter(u => u) : ['/', '/about', '/contact', '/blog', '/products'];
    
    let sitemapContent = '';
    if (format === 'xml') {
      sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlList.map(url => `  <url>
    <loc>${domain}${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;
    } else {
      sitemapContent = urlList.map(url => `${domain}${url}`).join('\n');
    }
    
    setGenerated({ content: sitemapContent, format });
  };

  const downloadSitemap = () => {
    const element = document.createElement('a');
    const file = new Blob([generated.content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `sitemap.${generated.format === 'xml' ? 'xml' : 'txt'}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Layout>
      <Head>
        <title>Sitemap Generator - Create XML & HTML Sitemaps Free</title>
        <meta name="description" content="Generate XML and HTML sitemaps for your website automatically. Free sitemap generator tool to create SEO-friendly sitemaps for Google, Bing, and other search engines." />
      </Head>
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-emerald-800 mb-6">XML & HTML Sitemap Generator</h1>
        <p className="text-gray-600 mb-8">Generate XML or HTML sitemaps for your website to improve SEO.</p>

        <div className="bg-white p-8 rounded-lg shadow-md border border-emerald-100 mb-8">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Domain</label>
            <input
              type="text"
              placeholder="https://example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">URLs (one per line, leave empty for defaults)</label>
            <textarea
              placeholder="/&#10;/about&#10;/contact&#10;/blog"
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 h-24 font-mono text-sm"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
            >
              <option value="xml">XML Sitemap</option>
              <option value="html">HTML Sitemap</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            className="btn btn-primary px-8 py-3 w-full"
          >
            Generate Sitemap
          </button>

          {generated && (
            <div className="mt-8">
              <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200 mb-4">
                <pre className="text-xs overflow-x-auto max-h-64 text-gray-800">
                  {generated.content.substring(0, 500)}
                  {generated.content.length > 500 && '\n...(truncated)'}
                </pre>
              </div>
              <button
                onClick={downloadSitemap}
                className="btn btn-primary w-full"
              >
                Download Sitemap
              </button>
            </div>
          )}
        </div>

        {/* SEO Content Section */}
        <div className="prose prose-emerald max-w-none mt-16">
          <h2 className="text-2xl font-bold text-emerald-700 mb-4">What is an XML & HTML Sitemap Generator?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            A sitemap generator is an essential SEO tool that automatically creates structured lists of all pages on your website in either XML or HTML format. XML sitemaps are specifically designed for search engines like Google, Bing, and Yahoo, helping their crawlers discover and index your content efficiently. HTML sitemaps, on the other hand, provide a user-friendly navigation resource that helps visitors explore your site structure.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Our free XML & HTML sitemap generator simplifies the technical process of creating these crucial files. Instead of manually coding XML syntax or compiling page lists, simply enter your domain and URLs, and our tool instantly generates a properly formatted sitemap ready for submission to search engines. Whether you're launching a new website, managing an established site, or performing SEO maintenance, generating and submitting accurate sitemaps is fundamental to ensuring search engines can discover and index all your valuable content.
          </p>

          <h2 className="text-2xl font-bold text-emerald-700 mb-4">Why Sitemaps Are Critical for SEO Success</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Sitemaps serve as roadmaps for search engine crawlers, providing numerous SEO benefits:
          </p>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">Faster Indexing of New Content</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            When you publish new blog posts, product pages, or landing pages, submitting an updated sitemap to Google Search Console notifies search engines immediately about the new content. This dramatically speeds up indexing compared to waiting for crawlers to naturally discover pages through internal links. Fast indexing means quicker visibility in search results and faster traffic generation. Combine this with our <a href="/tools/google-index-checker" className="text-emerald-600 hover:underline">Google Index Checker</a> to verify pages are successfully indexed.
          </p>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">Improved Crawl Efficiency</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Search engines allocate a specific crawl budget to each website—the number of pages Googlebot will crawl within a given timeframe. Sitemaps help prioritize important pages and ensure crawlers don't waste resources on low-value pages. For large websites with thousands of URLs, a well-structured sitemap is essential for ensuring all important content gets crawled regularly. Use our <a href="/tools/http-status-checker" className="text-emerald-600 hover:underline">HTTP Status Checker</a> to verify sitemap URLs return proper 200 status codes.
          </p>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">Discovery of Orphaned Pages</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Orphaned pages—those with no internal links pointing to them—are nearly impossible for crawlers to discover through traditional navigation. Including these pages in your sitemap ensures they still get indexed despite lacking internal links. However, it's best practice to also add internal links to orphaned pages for better SEO. Check for broken internal links using our <a href="/tools/broken-links-checker" className="text-emerald-600 hover:underline">Broken Links Checker</a> to maintain strong site architecture.
          </p>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">Structured Data Communication</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            XML sitemaps communicate important metadata to search engines: last modification dates, change frequency, and page priority. This structured data helps crawlers make informed decisions about recrawling schedules. Pages marked with recent modification dates and higher priority signals get crawled more frequently, ensuring your most important content stays fresh in search indexes.
          </p>

          <h2 className="text-2xl font-bold text-emerald-700 mb-4">XML Sitemap vs. HTML Sitemap: Understanding the Difference</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            While both serve navigation purposes, XML and HTML sitemaps have distinct functions:
          </p>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">XML Sitemap (For Search Engines)</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            XML sitemaps are machine-readable files designed exclusively for search engine crawlers. They follow the sitemaps.org protocol and include:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
            <li><strong>URL List:</strong> Complete list of pages you want indexed</li>
            <li><strong>Last Modified Date:</strong> Helps crawlers identify updated content</li>
            <li><strong>Change Frequency:</strong> Indicates how often pages typically update (daily, weekly, monthly)</li>
            <li><strong>Priority:</strong> Relative importance of pages (0.0 to 1.0 scale)</li>
            <li><strong>Image/Video URLs:</strong> Can include media assets for better indexing</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-4">
            XML sitemaps are typically named sitemap.xml and placed in your website's root directory. They're submitted to Google Search Console, Bing Webmaster Tools, and other search engines for optimal crawling.
          </p>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">HTML Sitemap (For Users)</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            HTML sitemaps are human-readable pages that display your website's structure in an organized, clickable format. They serve as:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
            <li><strong>Navigation Aid:</strong> Helps visitors quickly find specific content</li>
            <li><strong>Site Architecture Overview:</strong> Shows how your site is organized</li>
            <li><strong>Internal Linking Resource:</strong> Provides additional internal links to important pages</li>
            <li><strong>User Experience Enhancement:</strong> Especially valuable for large sites with complex structures</li>
          </ul>

          <h2 className="text-2xl font-bold text-emerald-700 mb-4">How to Use Our Sitemap Generator Tool</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Creating professional sitemaps with our tool takes just minutes:
          </p>
          <ol className="list-decimal pl-6 mb-6 text-gray-700 space-y-2">
            <li><strong>Enter Your Domain:</strong> Input your complete website URL including https:// (e.g., https://www.yoursite.com)</li>
            <li><strong>Add URLs:</strong> List the specific pages you want included, one per line. Use relative paths like /about, /blog/post-name, or /products/category. Leave empty to use default examples.</li>
            <li><strong>Select Format:</strong> Choose XML sitemap for search engines or HTML sitemap for users</li>
            <li><strong>Generate Sitemap:</strong> Click the "Generate Sitemap" button to create your formatted file</li>
            <li><strong>Review Output:</strong> Preview the generated sitemap to ensure all URLs are correct</li>
            <li><strong>Download:</strong> Click "Download Sitemap" to save the file to your computer</li>
            <li><strong>Upload to Website:</strong> Place sitemap.xml in your root directory (e.g., yoursite.com/sitemap.xml)</li>
            <li><strong>Submit to Search Engines:</strong> Add the sitemap URL in Google Search Console and Bing Webmaster Tools</li>
          </ol>

          <h2 className="text-2xl font-bold text-emerald-700 mb-4">Best Practices for Sitemap Creation</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Follow these guidelines to create effective sitemaps that maximize SEO value:
          </p>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">1. Include Only Indexable Pages</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Only add pages you want search engines to index. Exclude:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
            <li>Pages with noindex meta tags</li>
            <li>Thank you pages and confirmation pages</li>
            <li>Duplicate content or parameter URLs</li>
            <li>Blocked URLs in robots.txt</li>
            <li>404 error pages or redirect chains</li>
            <li>Login/logout pages and user account pages</li>
          </ul>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">2. Keep Sitemaps Under 50MB and 50,000 URLs</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Google recommends limiting individual sitemap files to 50MB (uncompressed) or 50,000 URLs, whichever comes first. For larger sites, create multiple sitemaps and use a sitemap index file to reference them all. This organization improves processing efficiency and ensures no URLs are missed.
          </p>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">3. Use Absolute URLs with Proper Protocol</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Always use complete, absolute URLs including the protocol (https://). Ensure all URLs match your preferred version (www vs. non-www) and use HTTPS if your site has an SSL certificate. Consistency prevents indexing confusion and consolidates ranking signals. Verify URLs return proper status codes with our <a href="/tools/http-status-checker" className="text-emerald-600 hover:underline">HTTP Status Checker</a>.
          </p>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">4. Update Regularly</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Whenever you publish new content, add new pages to your sitemap and resubmit it to search engines. For dynamic sites, consider automating sitemap generation through your CMS or build process. Many platforms like WordPress, Shopify, and Wix automatically generate and update sitemaps, but verifying their accuracy is still important.
          </p>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">5. Set Realistic Change Frequencies</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            The changefreq attribute tells search engines how often pages typically update. Be honest: homepage might be "daily," blog posts "weekly," and static pages "yearly." Don't mark everything as "daily" hoping for more frequent crawls—search engines detect patterns and may ignore unrealistic frequencies. Accurate change frequencies help crawlers allocate resources efficiently.
          </p>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">6. Prioritize Important Pages</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Use the priority attribute (0.0 to 1.0) to indicate relative importance. Homepage might be 1.0, category pages 0.8, product/blog pages 0.6, and utility pages 0.3. This doesn't affect rankings directly but helps crawlers understand your site structure. Reserve highest priorities for your most important content and money pages.
          </p>

          <h2 className="text-2xl font-bold text-emerald-700 mb-4">Submitting Your Sitemap to Search Engines</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            After generating your sitemap, submit it to search engines for maximum impact:
          </p>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">Google Search Console Submission</h3>
          <ol className="list-decimal pl-6 mb-4 text-gray-700 space-y-2">
            <li>Log into Google Search Console (verify ownership if needed)</li>
            <li>Select your property from the dropdown</li>
            <li>Navigate to "Sitemaps" in the left sidebar</li>
            <li>Enter your sitemap URL (e.g., sitemap.xml) in the "Add a new sitemap" field</li>
            <li>Click "Submit"</li>
            <li>Monitor status and check for errors in the Sitemaps report</li>
          </ol>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">Bing Webmaster Tools Submission</h3>
          <ol className="list-decimal pl-6 mb-4 text-gray-700 space-y-2">
            <li>Log into Bing Webmaster Tools</li>
            <li>Select your website</li>
            <li>Go to "Sitemaps" under "Configure My Site"</li>
            <li>Click "Submit Sitemap" and enter your sitemap URL</li>
            <li>Submit and monitor for processing status</li>
          </ol>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">robots.txt Reference</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Add your sitemap location to robots.txt to help search engines discover it automatically. Add this line at the end of your robots.txt file: <code className="bg-gray-100 px-2 py-1 rounded">Sitemap: https://www.yoursite.com/sitemap.xml</code>. This ensures all crawlers can find your sitemap even without manual submission. Generate a proper robots.txt file with our <a href="/tools/robots-txt-generator" className="text-emerald-600 hover:underline">Robots.txt Generator</a>.
          </p>

          <h2 className="text-2xl font-bold text-emerald-700 mb-4">Advanced Sitemap Strategies</h2>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">Multiple Sitemaps for Large Sites</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Large websites with thousands of pages benefit from organizing sitemaps by content type or category:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
            <li>sitemap-posts.xml for blog posts</li>
            <li>sitemap-products.xml for e-commerce products</li>
            <li>sitemap-pages.xml for static pages</li>
            <li>sitemap-categories.xml for taxonomy pages</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-4">
            Create a sitemap index file (sitemap_index.xml) that references all individual sitemaps. This organization improves maintenance and helps search engines process content more efficiently.
          </p>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">Image and Video Sitemaps</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Extend your XML sitemap to include image and video content using specialized tags. Image sitemaps help your photos appear in Google Images search, while video sitemaps enable rich video snippets in search results. For media-heavy sites (photography portfolios, video platforms, e-commerce with extensive product images), specialized sitemaps significantly improve media discoverability.
          </p>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">Multilingual Sitemaps with hreflang</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Websites serving multiple languages or regions should include hreflang annotations in sitemaps. This tells search engines about alternate language versions of pages, ensuring users in different countries see the appropriate version in search results. Proper hreflang implementation prevents duplicate content issues and improves international SEO performance.
          </p>

          <h2 className="text-2xl font-bold text-emerald-700 mb-4">Troubleshooting Common Sitemap Issues</h2>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">Sitemap Not Being Crawled</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            If Google Search Console shows your sitemap as "Pending" or not crawled, check:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
            <li>Sitemap is accessible at the submitted URL (test in browser)</li>
            <li>File isn't blocked by robots.txt</li>
            <li>XML syntax is valid (use an XML validator)</li>
            <li>Server returns 200 status code for sitemap URL</li>
            <li>File size doesn't exceed limits</li>
          </ul>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">URLs Not Indexed Despite Being in Sitemap</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Inclusion in sitemap doesn't guarantee indexing. Common reasons URLs aren't indexed:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
            <li>Pages have noindex tags or canonical tags pointing elsewhere</li>
            <li>Content is thin, duplicate, or low-quality</li>
            <li>URLs return errors (404, 500, etc.)</li>
            <li>Site has low domain authority or is very new</li>
            <li>Crawl budget limitations for large sites</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-4">
            Use our <a href="/tools/google-index-checker" className="text-emerald-600 hover:underline">Google Index Checker</a> to verify which sitemap URLs are actually indexed, then investigate non-indexed pages individually.
          </p>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">Sitemap Errors in Search Console</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Google Search Console reports various sitemap errors. Common ones include:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
            <li><strong>"Couldn't fetch":</strong> Server timeout or connectivity issues</li>
            <li><strong>"HTTP error":</strong> Sitemap URL returns 404 or other error code</li>
            <li><strong>"General HTTP error":</strong> Server problems or blocking</li>
            <li><strong>"Parsing error":</strong> Invalid XML syntax</li>
            <li><strong>"Unsupported format":</strong> File format doesn't match sitemaps.org protocol</li>
          </ul>

          <h2 className="text-2xl font-bold text-emerald-700 mb-4">Sitemaps for Different Website Types</h2>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">E-commerce Websites</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Online stores face unique sitemap challenges: thousands of product URLs, frequently changing inventory, and category/filter pages. Best practices include separating products, categories, and static pages into different sitemaps, excluding out-of-stock products or marking them appropriately, using image sitemaps for product photos, and implementing dynamic sitemap generation to handle inventory changes automatically.
          </p>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">News and Blog Sites</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Content-heavy sites publishing frequently benefit from specialized news sitemaps (for sites eligible for Google News) and automated sitemap updates when new posts publish. Prioritize recent content with higher priority values and more frequent change frequencies, and maintain separate sitemaps for evergreen content vs. time-sensitive news.
          </p>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">Small Business Websites</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Small sites (under 100 pages) can use simple, single sitemaps including all important pages. Focus on local landing pages, service pages, and contact information. Even small sites benefit from proper sitemap implementation for faster indexing and better crawl efficiency. Check your domain's SEO health with our <a href="/tools/seo-audit" className="text-emerald-600 hover:underline">SEO Audit Tool</a>.
          </p>

          <h2 className="text-2xl font-bold text-emerald-700 mb-4">Frequently Asked Questions About Sitemaps</h2>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">Q1: Is a sitemap required for SEO?</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            A: While not technically required, sitemaps are highly recommended for all websites, especially larger sites with complex structures or new sites with few backlinks. Small sites with strong internal linking might rank without sitemaps, but having one ensures faster indexing and better crawl coverage. There's no downside to having a sitemap, so it's always best practice to create and submit one.
          </p>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">Q2: How often should I update my sitemap?</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            A: Update your sitemap whenever you add, remove, or significantly modify pages. For blogs publishing regularly, automate daily or weekly sitemap updates. For static sites that rarely change, quarterly updates may suffice. After updating, resubmit the sitemap in Google Search Console to notify search engines of changes.
          </p>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">Q3: Can I have multiple sitemaps?</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            A: Yes! Large sites often use multiple sitemaps organized by content type, language, or category. Create a sitemap index file to reference all individual sitemaps. Submit the index file to search engines, and they'll automatically discover and process all referenced sitemaps. This organization improves management and processing efficiency.
          </p>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">Q4: Do HTML sitemaps help SEO?</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            A: HTML sitemaps provide indirect SEO benefits: they improve user experience by helping visitors navigate your site, create additional internal links to important pages, and can help search engines discover pages through crawling (though XML sitemaps are more effective for this). While not as critical as XML sitemaps, HTML sitemaps are valuable additions, especially for large sites.
          </p>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">Q5: Should I include all pages in my sitemap?</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            A: No. Only include pages you want indexed in search results. Exclude noindexed pages, duplicate content, parameter URLs, thin content, admin/login pages, and thank you pages. Including pages you don't want indexed wastes crawl budget and can confuse search engines about your site's structure. Quality over quantity is key.
          </p>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">Q6: What's the difference between a sitemap and robots.txt?</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            A: Robots.txt tells search engines which pages NOT to crawl, while sitemaps tell them which pages you WANT crawled and indexed. They serve opposite but complementary purposes. Use robots.txt to block unimportant areas (admin sections, duplicate content) and sitemaps to highlight important content. Generate proper robots.txt files with our <a href="/tools/robots-txt-generator" className="text-emerald-600 hover:underline">Robots.txt Generator</a>.
          </p>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">Q7: How do I check if my sitemap is working?</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            A: Submit your sitemap to Google Search Console and check the Sitemaps report for status, processing date, and discovered URLs. Look for errors or warnings. Test sitemap accessibility by visiting the URL directly in a browser (e.g., yoursite.com/sitemap.xml). Use our <a href="/tools/http-status-checker" className="text-emerald-600 hover:underline">HTTP Status Checker</a> to verify the sitemap URL returns a 200 status code.
          </p>

          <h3 className="text-xl font-semibold text-emerald-600 mb-3">Q8: Can sitemaps improve my search rankings?</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            A: Sitemaps don't directly improve rankings, but they enable rankings by ensuring pages get indexed. Unindexed pages can't rank at all. Sitemaps help search engines discover, crawl, and index your content more efficiently, which is the foundation of SEO success. Think of sitemaps as infrastructure—necessary for SEO but not a ranking factor themselves. For comprehensive SEO optimization, use our <a href="/tools/seo-audit" className="text-emerald-600 hover:underline">SEO Audit Tool</a>.
          </p>

          <h2 className="text-2xl font-bold text-emerald-700 mb-4">Related SEO and Indexing Tools</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Maximize your website's search visibility by combining our sitemap generator with these complementary tools:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
            <li><a href="/tools/google-index-checker" className="text-emerald-600 hover:underline font-semibold">Google Index Checker</a> - Verify which sitemap URLs are actually indexed by Google</li>
            <li><a href="/tools/robots-txt-generator" className="text-emerald-600 hover:underline font-semibold">Robots.txt Generator</a> - Create robots.txt files to control crawler access</li>
            <li><a href="/tools/http-status-checker" className="text-emerald-600 hover:underline font-semibold">HTTP Status Checker</a> - Ensure sitemap URLs return proper status codes</li>
            <li><a href="/tools/broken-links-checker" className="text-emerald-600 hover:underline font-semibold">Broken Links Checker</a> - Find broken links that shouldn't be in sitemaps</li>
            <li><a href="/tools/seo-audit" className="text-emerald-600 hover:underline font-semibold">SEO Audit Tool</a> - Comprehensive technical SEO analysis including sitemap checks</li>
            <li><a href="/tools/domain-authority-checker" className="text-emerald-600 hover:underline font-semibold">Domain Authority Checker</a> - Evaluate your site's authority affecting crawl priority</li>
            <li><a href="/tools/meta-generator" className="text-emerald-600 hover:underline font-semibold">Meta Tags Generator</a> - Optimize sitemap pages for better search performance</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-8">
            For detailed SEO strategies and technical guidance, explore our blog including <a href="/blog/how-to-check-http-status-codes-for-seo" className="text-emerald-600 hover:underline">How to Check HTTP Status Codes for SEO</a> and <a href="/blog/meta-tags-seo-guide-2026" className="text-emerald-600 hover:underline">Meta Tags SEO Guide</a>.
          </p>
        </div>
      </section>
    </Layout>
  );
}