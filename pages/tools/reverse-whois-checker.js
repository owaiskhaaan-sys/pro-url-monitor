import { useState } from 'react';
import Layout from '../../components/Layout';

export default function ReverseWhoisChecker() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = () => {
    if (!query.trim()) {
      alert('Please enter email or registrant name');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setResults({
        query: query,
        domains: [
          'example1.com',
          'example2.io',
          'example3.net',
          'example4.org',
          'example5.co'
        ]
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <Layout>
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-emerald-800 mb-6">Reverse WHOIS Checker</h1>
        <p className="text-gray-600 mb-8">Find all domains registered by a specific person or email address.</p>

        <div className="bg-white p-8 rounded-lg shadow-md border border-emerald-100 mb-8">
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="email@example.com or registrant name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCheck()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleCheck}
              disabled={loading}
              className="btn btn-primary px-8 py-3"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {results && (
            <div>
              <h3 className="text-lg font-semibold text-emerald-800 mb-4">Domains for: {results.query}</h3>
              <div className="space-y-2">
                {results.domains.map((d, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg border hover:bg-emerald-50 transition">
                    <p className="text-sm font-semibold text-emerald-700">{d}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4">Note: Results limited to demonstration. Full reverse WHOIS requires API integration.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}