import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [urls, setUrls] = useState([
    { id: 1, url: 'https://example.com', status: 'indexed', date: '2025-12-01', crawlTime: '2h' },
    { id: 2, url: 'https://example.com/page1', status: 'pending', date: '2025-12-02', crawlTime: '—' },
    { id: 3, url: 'https://example.com/page2', status: 'error', date: '2025-12-02', crawlTime: '—' }
  ]);
  const [newUrl, setNewUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    const newEntry = {
      id: urls.length + 1,
      url: newUrl,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      crawlTime: '—'
    };

    setUrls([newEntry, ...urls]);
    setNewUrl('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/">
            <div className="text-2xl font-bold text-blue-600">Pro URL Monitor</div>
          </Link>
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-600">{user.email}</span>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name || 'User'}!</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total URLs', value: urls.length, color: 'blue' },
            { label: 'Indexed', value: urls.filter(u => u.status === 'indexed').length, color: 'green' },
            { label: 'Pending', value: urls.filter(u => u.status === 'pending').length, color: 'yellow' },
            { label: 'Errors', value: urls.filter(u => u.status === 'error').length, color: 'red' }
          ].map((stat, idx) => (
            <div key={idx} className={`card bg-${stat.color}-50 border-${stat.color}-200`}>
              <div className={`text-3xl font-bold text-${stat.color}-600 mb-2`}>{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Submit URL */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold mb-4">Submit New URL</h2>
          <form onSubmit={handleAddUrl} className="flex gap-4">
            <input type="url" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://example.com/new-page" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
            <button type="submit" className="btn btn-primary">Submit URL</button>
          </form>
        </div>

        {/* URLs Table */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Recent Submissions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 font-semibold text-gray-700">URL</th>
                  <th className="text-left py-3 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 font-semibold text-gray-700">Submitted</th>
                  <th className="text-left py-3 font-semibold text-gray-700">Crawl Time</th>
                </tr>
              </thead>
              <tbody>
                {urls.map((entry) => (
                  <tr key={entry.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 text-blue-600 break-all">{entry.url}</td>
                    <td className="py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        entry.status === 'indexed' ? 'bg-green-100 text-green-800' :
                        entry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">{entry.date}</td>
                    <td className="py-3 text-gray-600">{entry.crawlTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* API Documentation Link */}
        <div className="card mt-8 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Integrate via API</h3>
          <p className="text-sm text-blue-800 mb-4">
            Use our REST API to submit URLs programmatically. Check the documentation for more details.
          </p>
          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            View API Documentation →
          </a>
        </div>
      </main>
    </div>
  );
}
