import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function LinkSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) {
      alert('Please enter a search query');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setResults({
        query: query,
        links: [
          { url: 'https://example1.com', title: 'Example One - ' + query, description: 'Relevant result 1' },
          { url: 'https://example2.com', title: 'Example Two - ' + query, description: 'Relevant result 2' },
          { url: 'https://example3.com', title: 'Example Three - ' + query, description: 'Relevant result 3' },
          { url: 'https://example4.com', title: 'Example Four - ' + query, description: 'Relevant result 4' }
        ]
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <Layout>
      <Head>
        <title>Link Search Tool - Find Backlinks & Link Opportunities</title>
        <meta name="description" content="Search and analyze backlinks for any website. Find link building opportunities, check competitor backlinks, and discover high-quality link sources." />
      </Head>
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-emerald-800 mb-6">Link Search</h1>
        <p className="text-gray-600 mb-8">Find and analyze links for a specific search query or domain.</p>

        <div className="bg-white p-8 rounded-lg shadow-md border border-emerald-100 mb-8">
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="Search query or domain"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="btn btn-primary px-8 py-3"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {results && (
            <div>
              <h3 className="text-lg font-semibold text-emerald-800 mb-4">Results for "{results.query}"</h3>
              <div className="space-y-4">
                {results.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 border rounded-lg hover:bg-emerald-50 transition"
                  >
                    <p className="text-sm text-emerald-600 mb-1">{link.url}</p>
                    <h4 className="font-semibold text-gray-900 mb-1">{link.title}</h4>
                    <p className="text-sm text-gray-600">{link.description}</p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}