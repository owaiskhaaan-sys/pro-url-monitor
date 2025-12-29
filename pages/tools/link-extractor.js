import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function LinkExtractor() {
  const [content, setContent] = useState('');
  const [links, setLinks] = useState(null);

  const handleExtract = () => {
    if (!content.trim()) {
      alert('Please enter some content');
      return;
    }

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const extractedLinks = content.match(urlRegex) || [];
    const uniqueLinks = [...new Set(extractedLinks)];

    setLinks({
      total: uniqueLinks.length,
      urls: uniqueLinks
    });
  };

  const downloadLinks = () => {
    const text = links.urls.join('\n');
    const element = document.createElement('a');
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'extracted-links.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Layout>
      <Head>
        <title>Link Extractor - Extract All Links from Webpage</title>
        <meta name="description" content="Extract all links from any webpage instantly. Get internal links, external links, and backlinks in one click. Free URL link extractor tool for SEO." />
      </Head>
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-emerald-800 mb-6">Link Extractor</h1>
        <p className="text-gray-600 mb-8">Extract all links from text, HTML, or web content quickly and easily.</p>

        <div className="bg-white p-8 rounded-lg shadow-md border border-emerald-100 mb-8">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Paste Content</label>
            <textarea
              placeholder="Paste text, HTML, or web content here to extract all links..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 h-32 font-mono text-sm"
            />
          </div>

          <button
            onClick={handleExtract}
            className="btn btn-primary px-8 py-3 w-full"
          >
            Extract Links
          </button>

          {links && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-emerald-800">Found {links.total} Link{links.total !== 1 ? 's' : ''}</h3>
                {links.total > 0 && (
                  <button
                    onClick={downloadLinks}
                    className="btn btn-sm bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Download
                  </button>
                )}
              </div>
              
              {links.urls.length > 0 ? (
                <div className="space-y-2">
                  {links.urls.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-gray-50 rounded-lg border hover:bg-emerald-50 transition text-sm text-emerald-600 hover:underline font-mono overflow-hidden text-ellipsis"
                      title={url}
                    >
                      {url}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">No links found in the content.</p>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}