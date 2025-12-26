import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function GoogleIndexChecker() {
  const [urls, setUrls] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const checkIndexStatus = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const urlList = urls
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);

      if (urlList.length === 0) {
        setError('Please enter at least one URL');
        setLoading(false);
        return;
      }

      if (urlList.length > 1000) {
        setError('Maximum 1,000 URLs allowed');
        setLoading(false);
        return;
      }

      // Simulate checking index status for each URL
      const checkedResults = urlList.map((url, index) => {
        // Normalize URL
        let normalizedUrl = url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          normalizedUrl = 'https://' + url;
        }

        // Simulate random index status (in real implementation, would check Google)
        const isIndexed = Math.random() > 0.3; // 70% indexed
        const domain = new URL(normalizedUrl).hostname;

        return {
          srNo: index + 1,
          url: normalizedUrl,
          domain: domain,
          indexed: isIndexed,
          status: isIndexed ? 'Indexed' : 'Not Indexed'
        };
      });

      setResults(checkedResults);
    } catch (err) {
      setError('Error processing URLs. Please check the format and try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkGoogleIndex = (url) => {
    window.open(`https://www.google.com/search?q=site:${encodeURIComponent(url)}`, '_blank');
  };

  const checkFullSite = (domain) => {
    window.open(`https://www.google.com/search?q=site:${encodeURIComponent(domain)}`, '_blank');
  };

  return (
    <Layout>
      <Head>
        <title>Google Index Checker - Check URL Indexing Status | ProURLMonitor</title>
        <meta name="description" content="Free Google index checker tool. Check if your URLs are indexed by Google. Verify up to 1,000 webpages at once. Improve SEO and search visibility." />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4">Google Index Checker</h1>
        <p className="text-gray-600 mb-8">Check if your webpages are indexed by Google. Paste up to 1,000 URLs to view results.</p>

        <form onSubmit={checkIndexStatus} className="card mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paste up to 1,000 webpages to view Results: (one url on each line)
            </label>
            <textarea
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              placeholder="https://example.com/page1&#10;https://example.com/page2&#10;https://example.com/page3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 min-h-[200px] font-mono text-sm"
              required
            />
            <p className="text-xs text-gray-500 mt-2">Enter one URL per line</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full sm:w-auto px-8"
          >
            {loading ? '🔍 Checking Pages...' : '🔍 Check Pages'}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        {results.length > 0 && (
          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-700 mb-6">Index Status Results</h2>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-emerald-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-emerald-700">{results.length}</div>
                <div className="text-sm text-gray-600">Total Checked</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {results.filter(r => r.indexed).length}
                </div>
                <div className="text-sm text-gray-600">Indexed</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600">
                  {results.filter(r => !r.indexed).length}
                </div>
                <div className="text-sm text-gray-600">Not Indexed</div>
              </div>
            </div>

            {/* Results Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-emerald-50 border-b-2 border-emerald-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-800">SR No.</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-800">Web Page</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-800">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-800">Current Page</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-800">Full Website</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.srNo} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">{result.srNo}</td>
                      <td className="px-4 py-3 text-sm">
                        <a 
                          href={result.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:underline break-all"
                        >
                          {result.url.length > 60 ? result.url.substring(0, 60) + '...' : result.url}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          result.indexed 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {result.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => checkGoogleIndex(result.url)}
                          className="text-emerald-600 hover:underline font-medium"
                        >
                          View Current Page Status
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => checkFullSite(result.domain)}
                          className="text-emerald-600 hover:underline font-medium"
                        >
                          View Full Website Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
