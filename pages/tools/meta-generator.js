import { useState } from 'react';
import Layout from '../../components/Layout';

export default function MetaGenerator() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [keywords, setKeywords] = useState('');

  function suggestFromTitle(t) {
    setDesc(t ? `${t} — Learn more about ${t} and how to optimize it.` : '');
    setKeywords(t ? t.split(' ').slice(0,8).join(', ') : '');
  }

  return (
    <Layout>
      <section className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-emerald-700 mb-3">Meta Tag Generator</h1>
        <p className="text-gray-600 mb-4">Create SEO-friendly title, description and keywords quickly.</p>

        <div className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Page Title"
            className="w-full p-3 rounded border border-gray-200" />

          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Meta description"
            rows={4} className="w-full p-3 rounded border border-gray-200" />

          <input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="keywords, comma, separated"
            className="w-full p-3 rounded border border-gray-200" />

          <div className="flex gap-2">
            <button onClick={() => suggestFromTitle(title)} className="btn btn-primary">Suggest</button>
            <button onClick={() => { setTitle(''); setDesc(''); setKeywords(''); }} className="btn btn-secondary">Clear</button>
          </div>

          <div className="card">
            <div className="text-sm text-gray-500">Generated HTML</div>
            <pre className="mt-2 text-sm bg-gray-50 p-3 rounded overflow-x-auto"><code>{`<title>${title}</title>\n<meta name="description" content="${desc}" />\n<meta name="keywords" content="${keywords}" />`}</code></pre>
          </div>
        </div>
      </section>

      <section className="mt-12 space-y-8">
        <section className="bg-blue-50 p-8 rounded-lg border border-blue-200">
          <h3 className="text-2xl font-bold text-blue-900 mb-4">What are Meta Tags?</h3>
          <p className="text-blue-800 mb-4">Meta tags provide search engines and social platforms with page title, description, and keyword hints. Well-written meta tags improve click-through rates and SEO relevance.</p>
          <p className="text-blue-800">Your title should be concise (50–60 characters) and your description should be clear (140–160 characters) to maximize visibility in search results.</p>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-emerald-800 mb-4">How to Use</h3>
          <ol className="list-decimal pl-6 space-y-3 text-gray-700">
            <li>Enter a page title</li>
            <li>Write a clear meta description</li>
            <li>Add comma-separated keywords (optional)</li>
            <li>Click "Suggest" to auto-generate from title (optional)</li>
            <li>Copy the generated HTML meta tags and paste into your page head</li>
          </ol>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-emerald-800 mb-4">Best Practices</h3>
          <ul className="list-disc pl-6 space-y-3 text-gray-700">
            <li><strong>Title Length:</strong> Keep titles under ~60 characters</li>
            <li><strong>Description Length:</strong> Aim for 140–160 characters</li>
            <li><strong>Clarity:</strong> Use action verbs and benefits</li>
            <li><strong>Uniqueness:</strong> One unique title/description per page</li>
            <li><strong>Keywords:</strong> Avoid stuffing; use natural phrasing</li>
          </ul>
        </section>

        <section className="bg-gray-50 p-8 rounded-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Related SEO Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <a href="/tools/xml-html-sitemap-generator" className="text-emerald-600 hover:underline">→ Sitemap Generator</a>
            <a href="/tools/google-pagerank-checker" className="text-emerald-600 hover:underline">→ PageRank Checker</a>
            <a href="/tools/link-extractor" className="text-emerald-600 hover:underline">→ Link Extractor</a>
            <a href="/tools/broken-links-checker" className="text-emerald-600 hover:underline">→ Broken Links Checker</a>
          </div>
        </section>
      </section>
    </Layout>
  );
}
