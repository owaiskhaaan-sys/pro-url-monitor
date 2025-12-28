import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';
import VerifiedButton from '../../components/VerifiedButton';
import RelatedTools from '../../components/RelatedTools';

export default function HTTPStatusChecker() {
  const [urls, setUrls] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [crawling, setCrawling] = useState(false);
  const [crawlInfo, setCrawlInfo] = useState(null);

  const crawlWebsite = async (e) => {
    e.preventDefault();
    setCrawling(true);
    setCrawlInfo(null);

    try {
      let crawlUrl = websiteUrl.trim();
      if (!crawlUrl.startsWith('http')) {
        crawlUrl = 'https://' + crawlUrl;
      }

      const response = await fetch(`/api/crawl-sitemap?url=${encodeURIComponent(crawlUrl)}`);
      const data = await response.json();

      if (data.success) {
        setCrawlInfo({
          sitemaps: data.sitemaps,
          totalUrls: data.totalUrls,
          filteredUrls: data.filteredUrls
        });
        
        // Populate textarea with found URLs
        setUrls(data.urls.join('\n'));
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Failed to crawl website: ' + error.message);
    } finally {
      setCrawling(false);
    }
  };

  const checkStatus = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);

    try {
      const urlList = urls.split('\n').filter(u => u.trim()).map(u => u.trim());
      
      const statusResults = await Promise.all(
        urlList.map(async (url) => {
          try {
            let checkUrl = url;
            if (!checkUrl.startsWith('http')) {
              checkUrl = 'https://' + checkUrl;
            }

            const response = await fetch(`/api/check-url?url=${encodeURIComponent(checkUrl)}`);
            const data = await response.json();
            
            return {
              url: checkUrl,
              originalUrl: url,
              status: data.status || 0,
              statusText: data.statusText || 'Unknown',
              finalUrl: data.url || checkUrl,
              redirected: data.url !== checkUrl,
              success: data.status >= 200 && data.status < 400
            };
          } catch (error) {
            return {
              url,
              originalUrl: url,
              status: 0,
              statusText: 'Failed to check',
              finalUrl: url,
              redirected: false,
              success: false,
              error: error.message
            };
          }
        })
      );

      const summary = {
        total: statusResults.length,
        success: statusResults.filter(r => r.success).length,
        redirects: statusResults.filter(r => r.redirected).length,
        errors: statusResults.filter(r => !r.success).length,
        status200: statusResults.filter(r => r.status === 200).length,
        status301: statusResults.filter(r => r.status === 301).length,
        status302: statusResults.filter(r => r.status === 302).length,
        status404: statusResults.filter(r => r.status === 404).length,
        status500: statusResults.filter(r => r.status >= 500).length,
      };

      setResults({
        checks: statusResults,
        summary
      });
    } catch (error) {
      alert('Error checking URLs: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'text-green-600 bg-green-50';
    if (status >= 300 && status < 400) return 'text-blue-600 bg-blue-50';
    if (status >= 400 && status < 500) return 'text-orange-600 bg-orange-50';
    if (status >= 500) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const downloadCSV = () => {
    const csv = [
      ['URL', 'Status Code', 'Status Text', 'Final URL', 'Redirected'],
      ...results.checks.map(r => [
        r.originalUrl,
        r.status,
        r.statusText,
        r.finalUrl,
        r.redirected ? 'Yes' : 'No'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `http-status-check-${Date.now()}.csv`;
    a.click();
  };

  return (
    <Layout>
      <Head>
        <title>HTTP Status Checker - Check 200, 301, 404, 500 Status Codes | ProURLMonitor</title>
        <meta name="description" content="Free HTTP status checker tool. Check multiple URLs for 200, 301, 302, 404, 500 status codes and redirects in bulk." />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4">HTTP Status Checker</h1>
        <p className="text-gray-600 mb-8">Check 200, 301, 404, 500 status codes and redirects for multiple URLs</p>

        {/* Website Crawler Section */}
        <div className="card mb-6 bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200">
          <h2 className="text-xl font-bold text-emerald-700 mb-3">🕷️ Website Crawler</h2>
          <p className="text-sm text-gray-600 mb-4">Extract all URLs from your website's sitemap automatically</p>
          
          <form onSubmit={crawlWebsite} className="flex gap-3">
            <input
              type="text"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="Enter your website URL (e.g., example.com)"
              className="flex-1 px-4 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              required
            />
            <button
              type="submit"
              disabled={crawling}
              className="btn btn-primary px-6 whitespace-nowrap"
            >
              {crawling ? '🔍 Crawling...' : '🕷️ Extract URLs'}
            </button>
          </form>

          {crawlInfo && (
            <div className="mt-4 p-3 bg-white rounded-lg border border-emerald-200">
              <div className="text-sm space-y-1">
                <p className="text-green-600 font-semibold">✅ Crawl Complete!</p>
                <p className="text-gray-600">📑 Sitemaps found: {crawlInfo.sitemaps.length}</p>
                <p className="text-gray-600">🔗 Total URLs: {crawlInfo.totalUrls}</p>
                <p className="text-gray-600">✨ Filtered URLs: {crawlInfo.filteredUrls}</p>
                <p className="text-xs text-gray-500 mt-2">URLs have been added to the checker below ⬇️</p>
              </div>
            </div>
          )}
        </div>

        <div className="card mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter URLs (one per line)
            </label>
            <textarea
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              rows="8"
              placeholder="https://example.com&#10;https://google.com&#10;example.org/page"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
              required
            />
            <p className="text-xs text-gray-500 mt-2">Enter one URL per line. HTTP/HTTPS is optional.</p>
          </div>

          <VerifiedButton
            onClick={(e) => {
              e.preventDefault();
              checkStatus(e);
            }}
            loading={loading}
            className="w-full btn btn-primary"
          >
            Check Status Codes
          </VerifiedButton>
        </div>

        {results && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="card bg-emerald-50">
              <h2 className="text-2xl font-bold text-emerald-700 mb-4">Summary</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-700">{results.summary.total}</div>
                  <div className="text-xs text-gray-600">Total URLs</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{results.summary.status200}</div>
                  <div className="text-xs text-gray-600">200 OK</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{results.summary.status301 + results.summary.status302}</div>
                  <div className="text-xs text-gray-600">Redirects</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{results.summary.errors}</div>
                  <div className="text-xs text-gray-600">Errors</div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <button onClick={downloadCSV} className="btn btn-secondary">
                  📥 Download CSV Report
                </button>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="card">
              <h2 className="text-xl font-bold text-emerald-700 mb-4">Detailed Results</h2>
              <div className="space-y-3">
                {results.checks.map((check, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-mono text-sm text-gray-700 break-all mb-1">
                          {check.originalUrl}
                        </div>
                        {check.redirected && (
                          <div className="text-xs text-blue-600 mt-1">
                            ↳ Redirects to: {check.finalUrl}
                          </div>
                        )}
                      </div>
                      <div className={`ml-4 px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(check.status)}`}>
                        {check.status}
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      {check.statusText}
                      {check.redirected && ' (Redirect)'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SEO Content Section */}
        <div className="mt-12 space-y-8">
          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-700 mb-4">Complete Guide to HTTP Status Codes and Website Health</h2>
            <div className="prose max-w-none text-gray-700 space-y-4">
              <p>
                Alright, so you're probably wondering what all these <strong>HTTP status codes</strong> mean and why you should care. Here's the deal - every time someone (or a search engine bot) tries to access a page on your website, the server sends back a status code. Think of it as your website's way of saying "hey, everything's cool" or "oops, something's broken here."
              </p>
              <p>
                Our <strong>HTTP status checker tool</strong> is like having a watchdog that monitors all your URLs and tells you exactly which ones are working perfectly and which ones are causing problems. And trust me, broken links can seriously tank your SEO rankings and frustrate the heck out of your visitors.
              </p>
              
              <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Understanding the Most Common HTTP Status Codes</h3>
              <p>
                Let's break down what these numbers actually mean. A <strong>200 status code</strong> is the holy grail - it means everything loaded perfectly. When you see that green 200, you can breathe easy because that URL is working exactly as it should.
              </p>
              <p>
                Now, <strong>301 and 302 redirects</strong> are a bit different. A 301 is a permanent redirect (like when you've moved a page forever), while a 302 is temporary. Here's the thing though - too many redirects slow down your site and confuse search engines. Our tool shows you exactly which URLs are redirecting and where they're going, so you can clean up your redirect chains.
              </p>
              <p>
                The dreaded <strong>404 error</strong> means the page doesn't exist. These are SEO killers because they create a terrible user experience and waste your site's crawl budget. If Google's bots keep hitting 404s, they'll crawl your site less frequently. Not good.
              </p>
              <p>
                And then there's <strong>500 series errors</strong> - these are server errors that mean something's seriously wrong on the backend. A 500 error is basically your server throwing its hands up and saying "I can't handle this right now." These need immediate attention.
              </p>

              <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">How Our Website Crawler Works</h3>
              <p>
                Here's where things get really cool. You know how most <strong>URL checkers</strong> make you manually paste in every single URL? Yeah, that's tedious as hell. That's why we built a website crawler right into this tool.
              </p>
              <p>
                Just enter your homepage URL, click "Extract URLs," and our crawler goes to work. It fetches your <strong>robots.txt file</strong>, finds all your <strong>sitemap URLs</strong>, and extracts every single page on your website automatically. We even handle nested sitemaps - you know, those sitemap index files that link to other sitemaps. Our tool recursively crawls through all of them.
              </p>
              <p>
                And we're smart about filtering too. We automatically remove junk like RSS feeds, category pages, tag pages, and image files because let's be honest, you don't need to check the HTTP status of every single JPEG on your site. We focus on what matters - your actual content pages.
              </p>

              <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Bulk HTTP Status Checking for Large Websites</h3>
              <p>
                Got a massive website with hundreds or thousands of pages? No problem. Our <strong>bulk URL checker</strong> can handle it. Once you've extracted all your URLs using the crawler, just hit the "Check Status Codes" button and we'll verify every single one.
              </p>
              <p>
                We run all these checks in parallel (up to 50 URLs at a time for performance), so even if you've got a ton of pages, you'll get results fast. Each result shows you the original URL, the final URL (if there was a redirect), the status code, and whether the check was successful.
              </p>

              <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Why You Need Regular Link Checking</h3>
              <p>
                Look, websites aren't static things. Content gets updated, pages get moved, external links break, server configurations change. What was working perfectly last month might be throwing <strong>404 errors</strong> today. That's why regular <strong>link checking</strong> is crucial.
              </p>
              <p>
                I've seen sites lose 30-40% of their organic traffic just because they had a bunch of broken internal links that Google couldn't crawl properly. The worst part? The site owners had no idea until they ran a comprehensive <strong>status code check</strong>. Don't be that person.
              </p>

              <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">How This Impacts Your SEO Rankings</h3>
              <p>
                Here's something most people don't realize - <strong>HTTP status codes</strong> directly affect how Google crawls and indexes your site. When Googlebot encounters errors, it impacts your site's crawl budget. Basically, Google allocates a certain amount of resources to crawling your site, and if those resources are wasted on broken links and redirect chains, your fresh content doesn't get indexed as quickly.
              </p>
              <p>
                Plus, broken links create orphan pages that can't be reached through normal navigation. Even if these pages have great content, they won't rank because Google can't find them. Our tool helps you identify these issues before they hurt your search visibility.
              </p>

              <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Download Your Results as CSV</h3>
              <p>
                After running your <strong>bulk status check</strong>, you can download all the results as a CSV file. This is super handy if you need to share the report with your team, keep records of your site health over time, or import the data into other tools for further analysis. Just click the "Download CSV Report" button and you're good to go.
              </p>

              <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Best Practices for Maintaining Healthy URLs</h3>
              <p>
                First off, run this check at least once a month. Set a reminder, make it part of your routine. Second, when you find <strong>broken links</strong>, fix them immediately. Either restore the missing content, set up proper 301 redirects, or remove the links entirely.
              </p>
              <p>
                For redirects, try to minimize redirect chains. If page A redirects to page B which redirects to page C, that's inefficient. Update your links to point directly to the final destination. Your site will load faster and search engines will thank you.
              </p>

              <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Combine This with Other SEO Tools</h3>
              <p>
                Want to level up your SEO game? Use this tool alongside our <a href="/tools/seo-audit" className="text-emerald-600 hover:underline">SEO Audit tool</a> to get a complete picture of your site's health. While this tool focuses on link status and redirects, the SEO Audit checks things like page speed, meta tags, and Core Web Vitals. Together, they give you everything you need to optimize your website.
              </p>
              <p>
                Also check out our <a href="/tools/broken-links-checker" className="text-emerald-600 hover:underline">Broken Links Checker</a> which digs even deeper by analyzing the HTML of each page to find broken external links. It's like having a full technical SEO suite at your fingertips - and it's all completely free.
              </p>

              <p className="text-lg font-semibold text-emerald-700 mt-6">
                Stop letting broken links and redirect chains hurt your search rankings. Use our free HTTP status checker now to crawl your entire website, identify issues, and get actionable insights in minutes. Your SEO will thank you!
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4">
          <RelatedTools currentTool="/tools/http-status-checker" category="Network" />
        </div>
      </div>
    </Layout>
  );
}
