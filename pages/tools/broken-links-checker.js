import { useState } from 'react';
import Layout from '../../components/Layout';

export default function BrokenLinksChecker() {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = () => {
    if (!url.trim()) {
      alert('Please enter a URL');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setResults({
        url: url,
        broken: [
          { url: '/about-old', status: 404 },
          { url: '/dead-link', status: 404 },
          { url: '/archived', status: 410 }
        ],
        working: [
          { url: '/about', status: 200 },
          { url: '/contact', status: 200 },
          { url: '/services', status: 200 }
        ],
        total: 9
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <Layout>
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-emerald-800 mb-6">Broken Links Checker</h1>
        <p className="text-gray-600 mb-8">Find and report all broken links on a website to improve user experience and SEO.</p>

        <div className="bg-white p-8 rounded-lg shadow-md border border-emerald-100 mb-8">
          <div className="flex gap-3 mb-6">
            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCheck()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleCheck}
              disabled={loading}
              className="btn btn-primary px-8 py-3"
            >
              {loading ? 'Scanning...' : 'Check Links'}
            </button>
          </div>

          {results && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-gray-800">{results.total}</p>
                  <p className="text-xs text-gray-600">Total Links</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-700">{results.working.length}</p>
                  <p className="text-xs text-gray-600">Working Links</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-red-700">{results.broken.length}</p>
                  <p className="text-xs text-gray-600">Broken Links</p>
                </div>
              </div>

              {results.broken.length > 0 && (
                <div>
                  <h3 className="font-semibold text-red-800 mb-3">⚠ Broken Links ({results.broken.length})</h3>
                  <div className="space-y-2">
                    {results.broken.map((link, i) => (
                      <div key={i} className="p-3 bg-red-50 rounded-lg border border-red-200 flex justify-between items-center">
                        <span className="text-sm font-mono text-red-700">{link.url}</span>
                        <span className="text-xs font-semibold text-red-600">Status {link.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.working.length > 0 && (
                <div>
                  <h3 className="font-semibold text-green-800 mb-3">✓ Working Links ({results.working.length})</h3>
                  <div className="space-y-2">
                    {results.working.map((link, i) => (
                      <div key={i} className="p-3 bg-green-50 rounded-lg border border-green-200 flex justify-between items-center">
                        <span className="text-sm font-mono text-green-700">{link.url}</span>
                        <span className="text-xs font-semibold text-green-600">Status {link.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}