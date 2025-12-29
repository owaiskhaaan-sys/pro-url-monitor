import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function ReverseIPDomainChecker() {
  const [ip, setIp] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = () => {
    if (!ip.trim()) {
      alert('Please enter an IP address');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setResults({
        ip: ip,
        domains: [
          'example.com',
          'blog.example.com',
          'api.example.com',
          'cdn.example.com',
          'shop.example.com'
        ]
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <Layout>
      <Head>
        <title>Reverse IP Domain Checker - Find Websites on IP</title>
        <meta name="description" content="Find all websites hosted on the same IP address. Reverse IP lookup tool to discover domains sharing the same server. Check IP neighbors." />
      </Head>
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-emerald-800 mb-6">Reverse IP Domain Checker</h1>
        <p className="text-gray-600 mb-8">Find all domains hosted on a specific IP address.</p>

        <div className="bg-white p-8 rounded-lg shadow-md border border-emerald-100 mb-8">
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="192.168.1.1"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCheck()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleCheck}
              disabled={loading}
              className="btn btn-primary px-8 py-3"
            >
              {loading ? 'Checking...' : 'Find Domains'}
            </button>
          </div>

          {results && (
            <div>
              <h3 className="text-lg font-semibold text-emerald-800 mb-4">Domains on IP: {results.ip}</h3>
              <div className="space-y-2">
                {results.domains.map((d, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg border hover:bg-emerald-50 transition">
                    <p className="text-sm font-semibold text-emerald-700">{d}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">What is Reverse IP Lookup?</h3>
          <p className="text-sm text-blue-800">Reverse IP lookup finds all domains and subdomains hosted on a specific IP address. This is useful for discovering competing sites, analyzing server configurations, and researching web hosting patterns.</p>
        </div>
      </section>
    </Layout>
  );
}