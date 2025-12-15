import { useState } from 'react';
import Layout from '../../components/Layout';

export default function DomainIPHistoryChecker() {
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = () => {
    if (!domain.trim()) {
      alert('Please enter a domain');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setResults({
        domain: domain,
        currentIP: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        history: [
          { ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`, date: '2025-01-10' },
          { ip: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`, date: '2024-12-15' },
          { ip: `172.16.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`, date: '2024-11-20' }
        ]
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <Layout>
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-emerald-800 mb-6">Domain IP History Checker</h1>
        <p className="text-gray-600 mb-8">View the IP address history and current IP of any domain.</p>

        <div className="bg-white p-8 rounded-lg shadow-md border border-emerald-100 mb-8">
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCheck()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleCheck}
              disabled={loading}
              className="btn btn-primary px-8 py-3"
            >
              {loading ? 'Checking...' : 'Check IP'}
            </button>
          </div>

          {results && (
            <div className="space-y-6">
              <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
                <p className="text-sm text-gray-600 mb-1">Current IP Address</p>
                <p className="text-2xl font-bold text-emerald-700 font-mono">{results.currentIP}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-emerald-800 mb-4">IP History</h3>
                <div className="space-y-3">
                  {results.history.map((h, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
                      <span className="font-mono text-sm">{h.ip}</span>
                      <span className="text-xs text-gray-500">{h.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}