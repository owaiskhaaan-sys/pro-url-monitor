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
      </div>
    </Layout>
  );
}
