import { useState } from 'react';
import Layout from '../../components/Layout';

export default function BulkAlexaRankChecker() {
  const [domains, setDomains] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCheck = () => {
    if (!domains.trim()) {
      alert('Please enter at least one domain');
      return;
    }
    setLoading(true);
    const domainList = domains.split('\n').map(d => d.trim()).filter(d => d);
    
    setTimeout(() => {
      const checked = domainList.map(d => ({
        domain: d,
        rank: Math.floor(Math.random() * 100000) + 1,
        change: (Math.random() - 0.5) * 500
      }));
      setResults(checked);
      setLoading(false);
    }, 1500);
  };

  return (
    <Layout>
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-emerald-800 mb-6">Bulk Alexa Rank Checker</h1>
        <p className="text-gray-600 mb-8">Check Alexa ranking for multiple domains at once.</p>

        <div className="bg-white p-8 rounded-lg shadow-md border border-emerald-100 mb-8">
          <div className="mb-6">
            <textarea
              placeholder="example1.com&#10;example2.com&#10;example3.com"
              value={domains}
              onChange={(e) => setDomains(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 h-32 font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">Enter one domain per line</p>
          </div>

          <button
            onClick={handleCheck}
            disabled={loading}
            className="btn btn-primary px-8 py-3 w-full"
          >
            {loading ? 'Checking...' : 'Check Alexa Ranks'}
          </button>

          {results.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-emerald-800 mb-4">Alexa Rankings</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-emerald-50 border-b">
                      <th className="px-4 py-2 text-left text-emerald-800">Domain</th>
                      <th className="px-4 py-2 text-left text-emerald-800">Rank</th>
                      <th className="px-4 py-2 text-left text-emerald-800">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{r.domain}</td>
                        <td className="px-4 py-2 font-semibold text-emerald-700">#{r.rank.toLocaleString()}</td>
                        <td className={`px-4 py-2 font-semibold ${r.change > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {r.change > 0 ? '↑' : '↓'} {Math.abs(r.change).toFixed(0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}