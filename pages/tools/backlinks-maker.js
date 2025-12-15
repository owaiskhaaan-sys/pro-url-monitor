import { useState } from 'react';
import Layout from '../../components/Layout';

export default function BacklinksMaker() {
  const [url, setUrl] = useState('');
  const [anchorText, setAnchorText] = useState('');
  const [generated, setGenerated] = useState(null);

  const handleGenerate = () => {
    if (!url.trim() || !anchorText.trim()) {
      alert('Please enter URL and anchor text');
      return;
    }

    const htmlCode = `<a href="${url}" title="${anchorText}">${anchorText}</a>`;
    const markdownCode = `[${anchorText}](${url})`;

    setGenerated({
      html: htmlCode,
      markdown: markdownCode,
      preview: { text: anchorText, href: url }
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <Layout>
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-emerald-800 mb-6">Backlinks Maker</h1>
        <p className="text-gray-600 mb-8">Generate HTML and Markdown backlink code for easy sharing and embedding.</p>

        <div className="bg-white p-8 rounded-lg shadow-md border border-emerald-100 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">URL</label>
              <input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Anchor Text</label>
              <input
                type="text"
                placeholder="Click here"
                value={anchorText}
                onChange={(e) => setAnchorText(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={handleGenerate}
              className="btn btn-primary px-8 py-3 w-full"
            >
              Generate Backlink
            </button>

            {generated && (
              <div className="space-y-6 mt-8">
                <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
                  <h3 className="font-semibold text-emerald-800 mb-3">Preview</h3>
                  <a href={generated.preview.href} className="text-emerald-600 hover:underline">
                    {generated.preview.text}
                  </a>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">HTML Code</h3>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg flex justify-between items-start gap-4">
                    <code className="text-sm font-mono break-all flex-1">{generated.html}</code>
                    <button
                      onClick={() => copyToClipboard(generated.html)}
                      className="btn btn-sm bg-emerald-600 text-white hover:bg-emerald-700 whitespace-nowrap"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Markdown Code</h3>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg flex justify-between items-start gap-4">
                    <code className="text-sm font-mono break-all flex-1">{generated.markdown}</code>
                    <button
                      onClick={() => copyToClipboard(generated.markdown)}
                      className="btn btn-sm bg-emerald-600 text-white hover:bg-emerald-700 whitespace-nowrap"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}