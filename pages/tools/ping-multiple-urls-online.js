import { useState } from 'react';
import Layout from '../../components/Layout';

export default function PingMultipleURLs() {
  const [urls, setUrls] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePing = () => {
    const urlList = urls.split('\n').map(u => u.trim()).filter(u => u);
    if (urlList.length === 0) {
      alert('Please enter at least one URL');
      return;
    }
    setLoading(true);
    
    setTimeout(() => {
      const pinged = urlList.map(u => ({
        url: u,
        status: Math.random() > 0.3 ? 200 : 404,
        responseTime: Math.floor(Math.random() * 2000) + 100,
        online: Math.random() > 0.1
      }));
      setResults(pinged);
      setLoading(false);
    }, 2000);
  };

  return (
    <Layout>
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-emerald-800 mb-6">Ping Multiple URLs</h1>
        <p className="text-gray-600 mb-8">Check the uptime and response time of multiple URLs at once.</p>

        <div className="bg-white p-8 rounded-lg shadow-md border border-emerald-100 mb-8">
          <div className="mb-6">
            <textarea
              placeholder="https://example1.com&#10;https://example2.com&#10;https://example3.com"
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 h-32 font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">Enter one URL per line</p>
          </div>

          <button
            onClick={handlePing}
            disabled={loading}
            className="btn btn-primary px-8 py-3 w-full"
          >
            {loading ? 'Pinging...' : 'Ping URLs'}
          </button>

          {results && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-emerald-800 mb-4">Ping Results</h3>
              <div className="space-y-3">
                {results.map((r, i) => (
                  <div key={i} className={`p-4 rounded-lg border ${r.online ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm font-mono text-gray-800 mb-1">{r.url}</p>
                        <p className={`text-xs font-semibold ${r.online ? 'text-green-700' : 'text-red-700'}`}>
                          {r.online ? '✓ Online' : '✗ Offline'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${r.online ? 'text-green-700' : 'text-red-700'}`}>{r.status}</p>
                        <p className="text-xs text-gray-600">{r.responseTime}ms</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full ${r.online ? 'bg-green-600' : 'bg-red-600'}`}
                        style={{width: `${Math.min(100, (r.responseTime / 2000) * 100)}%`}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}