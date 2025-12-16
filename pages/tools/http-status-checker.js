import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

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

        <form onSubmit={checkStatus} className="card mb-8">
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

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? '🔍 Checking URLs...' : '🔍 Check Status Codes'}
          </button>
        </form>

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
      </div>
    </Layout>
  );
}
