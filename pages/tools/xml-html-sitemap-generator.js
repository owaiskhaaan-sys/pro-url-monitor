import { useState } from 'react';
import Layout from '../../components/Layout';

export default function XMLHTMLSitemapGenerator() {
  const [domain, setDomain] = useState('');
  const [urls, setUrls] = useState('');
  const [generated, setGenerated] = useState(null);
  const [format, setFormat] = useState('xml');

  const handleGenerate = () => {
    if (!domain.trim()) {
      alert('Please enter a domain');
      return;
    }
    
    const urlList = urls.trim() ? urls.split('\n').map(u => u.trim()).filter(u => u) : ['/', '/about', '/contact', '/blog', '/products'];
    
    let sitemapContent = '';
    if (format === 'xml') {
      sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlList.map(url => `  <url>
    <loc>${domain}${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;
    } else {
      sitemapContent = urlList.map(url => `${domain}${url}`).join('\n');
    }
    
    setGenerated({ content: sitemapContent, format });
  };

  const downloadSitemap = () => {
    const element = document.createElement('a');
    const file = new Blob([generated.content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `sitemap.${generated.format === 'xml' ? 'xml' : 'txt'}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Layout>
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-emerald-800 mb-6">XML & HTML Sitemap Generator</h1>
        <p className="text-gray-600 mb-8">Generate XML or HTML sitemaps for your website to improve SEO.</p>

        <div className="bg-white p-8 rounded-lg shadow-md border border-emerald-100 mb-8">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Domain</label>
            <input
              type="text"
              placeholder="https://example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">URLs (one per line, leave empty for defaults)</label>
            <textarea
              placeholder="/&#10;/about&#10;/contact&#10;/blog"
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 h-24 font-mono text-sm"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
            >
              <option value="xml">XML Sitemap</option>
              <option value="html">HTML Sitemap</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            className="btn btn-primary px-8 py-3 w-full"
          >
            Generate Sitemap
          </button>

          {generated && (
            <div className="mt-8">
              <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200 mb-4">
                <pre className="text-xs overflow-x-auto max-h-64 text-gray-800">
                  {generated.content.substring(0, 500)}
                  {generated.content.length > 500 && '\n...(truncated)'}
                </pre>
              </div>
              <button
                onClick={downloadSitemap}
                className="btn btn-primary w-full"
              >
                Download Sitemap
              </button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}