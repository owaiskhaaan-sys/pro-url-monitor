import { useState } from 'react';
import Layout from '../../components/Layout';

export default function SubmitTool() {
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (!url.trim()) return setMessage({ type: 'error', text: 'URL is required' });
    setLoading(true);
    try {
      const res = await fetch('/api/urls/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      if (res.ok) setMessage({ type: 'success', text: data.message || 'URL submitted successfully' });
      else setMessage({ type: 'error', text: data.error || 'Something went wrong' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error. Please try again' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold mb-4">Submit URL</h1>
        <p className="text-gray-600 mb-6">Enter your URL here to submit it for indexing</p>

        <div className="card">
          {message && (
            <div className={`mb-4 p-4 rounded ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/page" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="flex gap-4">
              <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Submitting...' : 'Submit'}</button>
              <button type="button" onClick={() => { setUrl(''); setMessage(null); }} className="btn btn-secondary">Clear</button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
