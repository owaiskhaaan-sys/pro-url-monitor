import { useState } from 'react';
import Layout from '../../components/Layout';

export default function DomainAuthorityChecker() {
  const [urls, setUrls] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const OPENPAGERANK_API_KEY = 'ow0o8csgcg4woo80owso8kookgc4sw4k0coog48o';

  const normalizeDomain = (url) => {
    return url.trim().toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/.*$/, '');
  };

  const handleCheck = async () => {
    if (!urls.trim()) {
      setError('Please enter at least one URL');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);

    try {
      // Split URLs by newline and clean them
      const urlList = urls.split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0)
        .slice(0, 100); // Limit to 100 URLs

      if (urlList.length === 0) {
        setError('No valid URLs found');
        setLoading(false);
        return;
      }

      // Normalize domains
      const domains = urlList.map(normalizeDomain);

      // Call OpenPageRank API
      const response = await fetch('https://openpagerank.com/api/v1.0/getPageRank', {
        method: 'POST',
        headers: {
          'API-OPR': OPENPAGERANK_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          domains: domains
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.response && Array.isArray(data.response)) {
        const resultsData = data.response.map(item => ({
          domain: item.domain,
          pageRank: item.page_rank_integer || 0,
          rank: item.rank || 0,
          status: item.status_code === 200 ? 'success' : 'error',
          error: item.error || null
        }));
        setResults(resultsData);
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (err) {
      setError(`Error: ${err.message}. Please check your API key or try again later.`);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setUrls('');
    setResults([]);
    setError('');
  };

  const loadExample = () => {
    setUrls('google.com\nfacebook.com\nyoutube.com\namazon.com\nwikipedia.org');
  };

  return (
    <Layout
      title="Domain Authority Checker - Check DA PA Free Online"
      description="Free bulk domain authority checker. Check domain authority (DA), page authority (PA), and page rank for multiple URLs instantly using OpenPageRank API."
    >
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Domain Authority Checker
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Check domain authority, page rank, and SEO metrics for multiple URLs instantly. Powered by OpenPageRank API.
            </p>
          </div>

          {/* Tool Interface */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            {/* Input Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Enter URLs (one per line, max 100)
              </label>
              <textarea
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
                placeholder="google.com&#10;facebook.com&#10;youtube.com&#10;amazon.com"
                className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none font-mono text-sm"
              />
              <div className="mt-2 text-sm text-gray-600">
                {urls.split('\n').filter(u => u.trim()).length} URLs entered
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={handleCheck}
                disabled={loading}
                className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Checking...' : 'Check Authority'}
              </button>
              <button
                onClick={loadExample}
                className="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
              >
                Load Examples
              </button>
              <button
                onClick={clearAll}
                className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Clear All
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="font-semibold text-red-800 mb-1">Error</div>
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            {/* Results Table */}
            {results.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Results ({results.length} domains)
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200">
                    <thead className="bg-emerald-50">
                      <tr>
                        <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                        <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Domain</th>
                        <th className="border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700">Page Rank</th>
                        <th className="border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700">Rank Score</th>
                        <th className="border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-200 px-4 py-3 text-sm">{index + 1}</td>
                          <td className="border border-gray-200 px-4 py-3 text-sm font-mono">
                            <a 
                              href={`https://${result.domain}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:text-emerald-800 hover:underline"
                            >
                              {result.domain}
                            </a>
                          </td>
                          <td className="border border-gray-200 px-4 py-3 text-center">
                            <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${
                              result.pageRank >= 8 ? 'bg-green-100 text-green-800' :
                              result.pageRank >= 6 ? 'bg-blue-100 text-blue-800' :
                              result.pageRank >= 4 ? 'bg-yellow-100 text-yellow-800' :
                              result.pageRank >= 2 ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {result.pageRank}
                            </span>
                          </td>
                          <td className="border border-gray-200 px-4 py-3 text-center text-sm font-semibold">
                            {result.rank ? result.rank.toLocaleString() : 'N/A'}
                          </td>
                          <td className="border border-gray-200 px-4 py-3 text-center">
                            {result.status === 'success' ? (
                              <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                ✓ Success
                              </span>
                            ) : (
                              <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                ✗ Error
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Info Notice */}
            <div className="p-4 bg-blue-50 border-l-4 border-blue-400">
              <div className="flex">
                <span className="text-blue-400 mr-3">ℹ️</span>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">About Page Rank</h4>
                  <p className="text-sm text-blue-700">
                    Page Rank is a score from 0-10 indicating domain authority and trustworthiness. 
                    Higher scores (8-10) indicate very authoritative domains. This tool uses OpenPageRank API 
                    which provides similar metrics to traditional Domain Authority.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Information Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              About Domain Authority & Page Rank
            </h2>

            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">What is Page Rank?</h3>
                <p>
                  Page Rank is a metric (0-10 scale) that measures the authority and trustworthiness of a domain 
                  based on its backlink profile and overall web presence. Originally developed by Google, 
                  it's now provided by OpenPageRank as an alternative to proprietary metrics.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Page Rank Score Interpretation</h3>
                <ul className="space-y-2">
                  <li><strong>9-10:</strong> Extremely authoritative domains (Google, YouTube, Facebook)</li>
                  <li><strong>7-8:</strong> Very strong authority, major publications and platforms</li>
                  <li><strong>5-6:</strong> Good authority, established websites</li>
                  <li><strong>3-4:</strong> Moderate authority, growing websites</li>
                  <li><strong>0-2:</strong> Low authority, new or small websites</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">How to Use This Tool</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Enter URLs (one per line) in the text area - you can check up to 100 URLs at once</li>
                  <li>Click "Check Authority" to analyze all domains</li>
                  <li>View Page Rank scores, rank positions, and status for each domain</li>
                  <li>Click on domain names to visit the websites</li>
                  <li>Use results to compare domain authority across multiple sites</li>
                </ol>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Why Check Domain Authority?</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>SEO Analysis:</strong> Evaluate link building opportunities and competitor strength</li>
                  <li><strong>Backlink Quality:</strong> Assess the value of potential backlink sources</li>
                  <li><strong>Content Partnerships:</strong> Find authoritative sites for guest posting</li>
                  <li><strong>Competitor Research:</strong> Compare your domain authority with competitors</li>
                  <li><strong>Portfolio Monitoring:</strong> Track authority metrics for multiple domains</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Tips for Improving Page Rank</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Build high-quality backlinks from authoritative domains</li>
                  <li>Create valuable, shareable content that attracts natural links</li>
                  <li>Remove toxic or spammy backlinks that hurt your profile</li>
                  <li>Improve internal linking structure across your website</li>
                  <li>Maintain consistent content publishing and site updates</li>
                  <li>Fix technical SEO issues (broken links, crawl errors)</li>
                </ul>
              </div>

              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <h4 className="font-semibold text-yellow-800 mb-2">Important Notes</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Page Rank updates periodically - scores may not reflect very recent changes</li>
                  <li>• This tool uses OpenPageRank API which provides similar metrics to traditional Domain Authority</li>
                  <li>• Enter domains without "http://" or "https://" - the tool normalizes URLs automatically</li>
                  <li>• Bulk checking supports up to 100 URLs per request</li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What's the difference between Page Rank and Domain Authority?
                </h3>
                <p className="text-gray-700">
                  Page Rank (0-10 scale) and Moz's Domain Authority (0-100 scale) both measure domain 
                  strength and authority. Page Rank is based on Google's original algorithm, while DA 
                  is a proprietary metric by Moz. Both use backlink profiles as primary factors.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How often should I check my domain authority?
                </h3>
                <p className="text-gray-700">
                  Check monthly or quarterly to track long-term trends. Domain authority changes slowly, 
                  so daily checking isn't necessary. Focus on consistent SEO efforts rather than score fluctuations.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Is a higher Page Rank guaranteed to rank better?
                </h3>
                <p className="text-gray-700">
                  Not guaranteed. While higher authority correlates with better rankings, Google uses 200+ 
                  ranking factors including content quality, user experience, technical SEO, and relevance. 
                  Authority is just one piece of the puzzle.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I check authority for subdomains?
                </h3>
                <p className="text-gray-700">
                  Yes! Enter the full subdomain (e.g., blog.example.com) to check its specific authority. 
                  Subdomains may have different authority scores than the main domain.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Why do some domains show no data?
                </h3>
                <p className="text-gray-700">
                  Very new domains, private/local domains, or domains with no backlinks may not have 
                  Page Rank data available. The API requires a minimum web presence to generate scores.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
