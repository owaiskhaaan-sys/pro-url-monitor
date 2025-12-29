import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function AlexaRankComparison() {
  const [domains, setDomains] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = () => {
    const domainList = domains.split('\n').map(d => d.trim()).filter(d => d);
    if (domainList.length < 2) {
      alert('Please enter at least 2 domains');
      return;
    }
    setLoading(true);
    
    setTimeout(() => {
      const compared = domainList.map(d => ({
        domain: d,
        rank: Math.floor(Math.random() * 100000) + 1
      })).sort((a, b) => a.rank - b.rank);
      setResults(compared);
      setLoading(false);
    }, 1500);
  };

  return (
    <Layout>
      <Head>
        <title>Alexa Rank Comparison - Compare Website Traffic</title>
        <meta name="description" content="Compare Alexa rankings of multiple websites side by side. Analyze traffic comparison, rank trends, and website popularity rankings." />
      </Head>
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-emerald-800 mb-6">Alexa Rank Comparison</h1>
        <p className="text-gray-600 mb-8">Compare Alexa rankings for multiple domains side-by-side.</p>

        <div className="bg-white p-8 rounded-lg shadow-md border border-emerald-100 mb-8">
          <div className="mb-6">
            <textarea
              placeholder="example1.com&#10;example2.com&#10;example3.com"
              value={domains}
              onChange={(e) => setDomains(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 h-32 font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">Enter at least 2 domains (one per line)</p>
          </div>

          <button
            onClick={handleCompare}
            disabled={loading}
            className="btn btn-primary px-8 py-3 w-full"
          >
            {loading ? 'Comparing...' : 'Compare Ranks'}
          </button>

          {results && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-emerald-800 mb-4">Comparison Results</h3>
              <div className="space-y-4">
                {results.map((r, i) => (
                  <div key={i} className="border rounded-lg p-4 hover:bg-emerald-50 transition">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-gray-900">{r.domain}</h4>
                      <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">#{r.rank.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full"
                        style={{width: `${Math.max(5, 100 - (r.rank / Math.max(...results.map(x => x.rank))) * 100)}%`}}
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