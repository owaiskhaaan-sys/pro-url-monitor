import { useState, useRef } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function BulkUpload() {
  const [urls, setUrls] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0, success: 0, failed: 0 });
  const fileRef = useRef();

  const parseText = (text) => {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    // If first line looks like a header (contains 'url' or 'link'), drop it
    if (lines.length > 1 && /url|link/i.test(lines[0])) lines.shift();
    // For CSV lines, take first column if comma exists
    const parsed = lines.map(line => {
      if (line.includes(',')) return line.split(',')[0].trim();
      return line;
    }).filter(l => /^https?:\/\//i.test(l));
    return parsed;
  };

  const handleFile = (e) => {
    const file = e.target.files && e.target.files[0];
    setMessage(null);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      const parsed = parseText(text);
      if (parsed.length === 0) setMessage({ type: 'error', text: 'کوئی درست URL نہیں ملا' });
      setUrls(parsed.map(u => ({ url: u, status: 'pending' })));
    };
    reader.onerror = () => setMessage({ type: 'error', text: 'Error reading file' });
    reader.readAsText(file);
  };

  const handlePaste = (e) => {
    const text = e.target.value;
    const parsed = parseText(text);
    setUrls(parsed.map(u => ({ url: u, status: 'pending' })));
  };

  const submitAll = async () => {
    if (urls.length === 0) return setMessage({ type: 'error', text: 'No URLs to submit' });
    setLoading(true);
    setMessage(null);
    setProgress({ done: 0, total: urls.length, success: 0, failed: 0 });

    const updateStatus = (index, status) => {
      setUrls(prev => {
        const copy = [...prev];
        copy[index] = { ...copy[index], status };
        return copy;
      });
    };

    const concurrency = 5;
    let i = 0;
    const workers = Array.from({ length: concurrency }).map(async () => {
      while (i < urls.length) {
        const idx = i++;
        const entry = urls[idx];
        try {
          const res = await fetch('/api/urls/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: entry.url })
          });
          const data = await res.json();
          if (res.ok) {
            updateStatus(idx, 'success');
            setProgress(p => ({ ...p, done: p.done + 1, success: p.success + 1 }));
          } else {
            updateStatus(idx, 'failed');
            setProgress(p => ({ ...p, done: p.done + 1, failed: p.failed + 1 }));
          }
        } catch (err) {
          updateStatus(idx, 'failed');
          setProgress(p => ({ ...p, done: p.done + 1, failed: p.failed + 1 }));
        }
      }
    });

    await Promise.all(workers);
    setLoading(false);
    setMessage({ type: 'success', text: `Completed: ${progress.success} success, ${progress.failed} failed` });
  };

  return (
    <Layout>
      <Head>
        <title>Bulk SEO Tools - Check Multiple URLs at Once</title>
        <meta name="description" content="Access bulk SEO tools to check multiple URLs simultaneously. Batch process domain authority, WHOIS lookups, Alexa ranks, and more." />
      </Head>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold mb-4">Bulk Upload</h1>
        <p className="text-gray-600 mb-6">Upload a CSV or TXT file with one URL per line, or paste URLs below.</p>

        <div className="card mb-6">
          {message && (
            <div className={`mb-4 p-4 rounded ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>{message.text}</div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Choose file (CSV/TXT)</label>
            <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleFile} />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Or paste URLs (one per line)</label>
            <textarea rows={6} onChange={handlePaste} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" placeholder="https://example.com/page1\nhttps://example.com/page2"></textarea>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={submitAll} disabled={loading} className="btn btn-primary">{loading ? 'Submitting...' : 'Submit All'}</button>
            <button onClick={() => { setUrls([]); setMessage(null); fileRef.current && (fileRef.current.value = null); }} className="btn btn-secondary">Clear</button>
            <div className="ml-auto text-sm text-gray-600">Total: {urls.length}</div>
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-3">Preview ({urls.length})</h2>
          <div className="table-responsive">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-2">URL</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {urls.map((u, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 break-all">{u.url}</td>
                    <td className="py-2 capitalize">{u.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
