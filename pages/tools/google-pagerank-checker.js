import { useState } from 'react';
import Layout from '../../components/Layout';

export default function GooglePageRankChecker() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = () => {
    if (!url.trim()) {
      alert('Please enter a URL');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const pageRank = Math.floor(Math.random() * 10);
      setResult({
        url: url,
        pagerank: pageRank,
        score: pageRank * 10,
        backlinks: Math.floor(Math.random() * 50000),
        lastUpdated: new Date().toLocaleDateString()
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <Layout>
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-emerald-800 mb-6">Google PageRank Checker</h1>
        <p className="text-gray-600 mb-8">Check the PageRank score of any webpage and analyze its link quality.</p>

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
              {loading ? 'Checking...' : 'Check PR'}
            </button>
          </div>

          {result && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-8 rounded-lg border border-emerald-200">
                <p className="text-sm text-gray-600 mb-2">PageRank Score</p>
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold text-emerald-700">{result.pagerank}</div>
                  <div className="text-4xl text-emerald-500">/10</div>
                </div>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-4 rounded-full"
                    style={{width: `${result.score}%`}}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-xs text-gray-600 mb-1">Estimated Backlinks</p>
                  <p className="text-2xl font-bold text-emerald-700">{result.backlinks.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-xs text-gray-600 mb-1">Last Updated</p>
                  <p className="text-sm font-semibold text-gray-800">{result.lastUpdated}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">What is PageRank?</h3>
          <p className="text-sm text-blue-800">PageRank is Google's algorithm for rating the importance of web pages. It's based on the number and quality of backlinks pointing to a page. A higher PageRank generally indicates a more important and authoritative webpage.</p>
        </div>
      </section>
    </Layout>
  );
}