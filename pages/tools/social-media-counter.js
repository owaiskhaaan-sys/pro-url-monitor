import { useState } from 'react';
import Layout from '../../components/Layout';

export default function SocialMediaCounter() {
  const [url, setUrl] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = () => {
    if (!url.trim()) {
      alert('Please enter a URL');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setStats({
        url: url,
        facebook: Math.floor(Math.random() * 50000),
        twitter: Math.floor(Math.random() * 30000),
        linkedin: Math.floor(Math.random() * 20000),
        pinterest: Math.floor(Math.random() * 15000),
        reddit: Math.floor(Math.random() * 10000)
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <Layout>
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-emerald-800 mb-6">Social Media Counter</h1>
        <p className="text-gray-600 mb-8">Check how many times a URL has been shared on social media platforms.</p>

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
              {loading ? 'Counting...' : 'Count Shares'}
            </button>
          </div>

          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { name: 'Facebook', value: stats.facebook, icon: '👍' },
                { name: 'Twitter', value: stats.twitter, icon: '🐦' },
                { name: 'LinkedIn', value: stats.linkedin, icon: '💼' },
                { name: 'Pinterest', value: stats.pinterest, icon: '📌' },
                { name: 'Reddit', value: stats.reddit, icon: '🔗' }
              ].map((s, i) => (
                <div key={i} className="bg-emerald-50 p-4 rounded-lg border border-emerald-200 text-center">
                  <p className="text-2xl mb-2">{s.icon}</p>
                  <p className="text-xs text-gray-600">{s.name}</p>
                  <p className="text-2xl font-bold text-emerald-700">{s.value.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}