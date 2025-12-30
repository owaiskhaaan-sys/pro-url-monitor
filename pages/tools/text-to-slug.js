import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function TextToSlugGenerator() {
  const [text, setText] = useState('');
  const [slug, setSlug] = useState('');
  const [separator, setSeparator] = useState('-');
  const [lowercase, setLowercase] = useState(true);
  const [removeSpecial, setRemoveSpecial] = useState(true);

  const generateSlug = () => {
    let result = text;

    // Convert to lowercase if enabled
    if (lowercase) {
      result = result.toLowerCase();
    }

    // Remove special characters if enabled
    if (removeSpecial) {
      result = result.replace(/[^\w\s-]/g, '');
    }

    // Replace spaces with separator
    result = result.replace(/\s+/g, separator);

    // Remove multiple separators
    result = result.replace(new RegExp(`${separator}+`, 'g'), separator);

    // Remove leading/trailing separators
    result = result.replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), '');

    setSlug(result);
  };

  const generateSEOFriendly = () => {
    let result = text.toLowerCase();
    
    // Remove accents
    result = result.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    // Remove special characters except alphanumeric and spaces
    result = result.replace(/[^a-z0-9\s-]/g, '');
    
    // Replace spaces with hyphens
    result = result.replace(/\s+/g, '-');
    
    // Remove multiple hyphens
    result = result.replace(/-+/g, '-');
    
    // Remove leading/trailing hyphens
    result = result.replace(/^-+|-+$/g, '');
    
    setSlug(result);
  };

  const generateWordPress = () => {
    // WordPress-style slug generation
    let result = text.toLowerCase();
    result = result.replace(/[^a-z0-9\s-]/g, '');
    result = result.replace(/\s+/g, '-');
    result = result.replace(/-+/g, '-');
    result = result.replace(/^-+|-+$/g, '');
    setSlug(result);
  };

  const generateGitHub = () => {
    // GitHub repo name style
    let result = text.toLowerCase();
    result = result.replace(/[^a-z0-9\s-_]/g, '');
    result = result.replace(/\s+/g, '-');
    result = result.replace(/[-_]+/g, '-');
    result = result.replace(/^-+|-+$/g, '');
    setSlug(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(slug);
    alert('Slug copied to clipboard!');
  };

  const clearAll = () => {
    setText('');
    setSlug('');
  };

  const loadExample = () => {
    setText('How to Create SEO Friendly URLs in 2024');
  };

  return (
    <Layout>
      <Head>
        <title>Text to Slug Converter - Create SEO-Friendly URLs</title>
        <meta name="description" content="Convert text to SEO-friendly URL slugs instantly. Remove special characters, convert spaces to hyphens, and create clean, readable URLs." />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/text-to-slug" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Text to Slug Generator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Create SEO-friendly URL slugs from any text. Perfect for blog posts, articles, and web pages.
            </p>
          </div>

          {/* Tool Interface */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            {/* Input Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Input Text
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your title or text here..."
                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
              <div className="mt-2 text-sm text-gray-600">
                {text.length} characters
              </div>
            </div>

            {/* Settings */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Slug Settings
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Separator</label>
                  <select
                    value={separator}
                    onChange={(e) => setSeparator(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="-">Hyphen (-)</option>
                    <option value="_">Underscore (_)</option>
                    <option value=".">Dot (.)</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="lowercase"
                    checked={lowercase}
                    onChange={(e) => setLowercase(e.target.checked)}
                    className="w-4 h-4 text-green-600 focus:ring-green-500 rounded"
                  />
                  <label htmlFor="lowercase" className="ml-2 text-sm text-gray-700">
                    Convert to lowercase
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="removeSpecial"
                    checked={removeSpecial}
                    onChange={(e) => setRemoveSpecial(e.target.checked)}
                    className="w-4 h-4 text-green-600 focus:ring-green-500 rounded"
                  />
                  <label htmlFor="removeSpecial" className="ml-2 text-sm text-gray-700">
                    Remove special characters
                  </label>
                </div>
              </div>
            </div>

            {/* Generate Buttons */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Generate Slug
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={generateSlug}
                  className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm"
                >
                  🔧 Custom Slug
                </button>
                <button
                  onClick={generateSEOFriendly}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                >
                  🎯 SEO Friendly
                </button>
                <button
                  onClick={generateWordPress}
                  className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium text-sm"
                >
                  📝 WordPress Style
                </button>
                <button
                  onClick={generateGitHub}
                  className="px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition font-medium text-sm"
                >
                  🐙 GitHub Style
                </button>
              </div>
            </div>

            {/* Output Section */}
            {slug && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Generated Slug
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={slug}
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    📋 Copy
                  </button>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {slug.length} characters • Full URL: https://example.com/{slug}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={loadExample}
                className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
              >
                Load Example
              </button>
              <button
                onClick={clearAll}
                className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Clear All
              </button>
            </div>

            {/* Info Notice */}
            <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400">
              <div className="flex">
                <span className="text-blue-400 mr-3">💡</span>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">SEO Best Practices</h4>
                  <p className="text-sm text-blue-700">
                    Keep slugs short (3-5 words), use hyphens as separators, include target keywords, 
                    and avoid stop words (a, the, and, etc.) for better SEO performance.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Examples Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Slug Generation Examples
            </h2>

            <div className="space-y-6">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Custom Slug (Hyphen Separator)</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <span className="text-gray-600 w-20">Input:</span>
                    <span className="bg-gray-50 px-2 py-1 rounded flex-1">How to Create SEO Friendly URLs</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-600 w-20">Output:</span>
                    <span className="bg-green-50 px-2 py-1 rounded flex-1 font-mono">how-to-create-seo-friendly-urls</span>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">SEO Friendly (Removes Stop Words)</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <span className="text-gray-600 w-20">Input:</span>
                    <span className="bg-gray-50 px-2 py-1 rounded flex-1">The Ultimate Guide to Python Programming</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-600 w-20">Output:</span>
                    <span className="bg-blue-50 px-2 py-1 rounded flex-1 font-mono">ultimate-guide-python-programming</span>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">WordPress Style</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <span className="text-gray-600 w-20">Input:</span>
                    <span className="bg-gray-50 px-2 py-1 rounded flex-1">10 Best WordPress Plugins for 2024!</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-600 w-20">Output:</span>
                    <span className="bg-purple-50 px-2 py-1 rounded flex-1 font-mono">10-best-wordpress-plugins-for-2024</span>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-gray-700 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">GitHub Style (Allows Underscores)</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <span className="text-gray-600 w-20">Input:</span>
                    <span className="bg-gray-50 px-2 py-1 rounded flex-1">My_Awesome_Project 2024</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-600 w-20">Output:</span>
                    <span className="bg-gray-100 px-2 py-1 rounded flex-1 font-mono">my-awesome-project-2024</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Information Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              About URL Slugs
            </h2>

            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">What is a URL Slug?</h3>
                <p>
                  A URL slug is the part of a URL that identifies a specific page in a human-readable format. 
                  For example, in "https://example.com/blog/seo-guide", the slug is "seo-guide". 
                  Good slugs are concise, descriptive, and SEO-friendly.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Why Are Slugs Important for SEO?</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Search Visibility:</strong> Keywords in slugs help search engines understand page content</li>
                  <li><strong>User Experience:</strong> Clean URLs are easier to read, remember, and share</li>
                  <li><strong>Click-Through Rate:</strong> Descriptive URLs increase likelihood of clicks in search results</li>
                  <li><strong>Social Sharing:</strong> Clean URLs look better when shared on social media</li>
                  <li><strong>Accessibility:</strong> Screen readers can pronounce readable URLs</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Best Practices for URL Slugs</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">✅ Do This</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Use lowercase letters only</li>
                      <li>• Use hyphens (-) as separators</li>
                      <li>• Keep slugs short (3-5 words)</li>
                      <li>• Include target keywords</li>
                      <li>• Make them descriptive</li>
                      <li>• Use only alphanumeric characters</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-2">❌ Avoid This</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Don't use uppercase letters</li>
                      <li>• Don't use underscores or spaces</li>
                      <li>• Avoid special characters (!@#$%)</li>
                      <li>• Don't include stop words (a, the)</li>
                      <li>• Avoid numbers unless necessary</li>
                      <li>• Don't make slugs too long</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Common Use Cases</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">📝</span>
                    <div>
                      <h4 className="font-semibold mb-1">Blog Posts & Articles</h4>
                      <p className="text-sm">Create SEO-friendly URLs for your content that include target keywords</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">🛍️</span>
                    <div>
                      <h4 className="font-semibold mb-1">E-commerce Products</h4>
                      <p className="text-sm">Generate clean product URLs that describe items and improve search rankings</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">📄</span>
                    <div>
                      <h4 className="font-semibold mb-1">Landing Pages</h4>
                      <p className="text-sm">Create memorable URLs for marketing campaigns and landing pages</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">🐙</span>
                    <div>
                      <h4 className="font-semibold mb-1">GitHub Repositories</h4>
                      <p className="text-sm">Generate consistent, readable repository names for version control</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <h4 className="font-semibold text-yellow-800 mb-2">Pro Tips</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Front-load important keywords in your slug</li>
                  <li>• Keep slugs under 60 characters for best results</li>
                  <li>• Use target keywords but avoid keyword stuffing</li>
                  <li>• Match your slug to your page title when possible</li>
                  <li>• Once published, avoid changing slugs (breaks links)</li>
                  <li>• Test slugs for readability before publishing</li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Should I use hyphens or underscores in slugs?
                </h3>
                <p className="text-gray-700">
                  Always use hyphens (-). Google treats hyphens as word separators but treats underscores as word joiners. 
                  "best-seo-tips" is read as three words, but "best_seo_tips" is read as one word.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How long should a URL slug be?
                </h3>
                <p className="text-gray-700">
                  Aim for 3-5 words or 50-60 characters. Shorter slugs are easier to read and remember. 
                  Remove unnecessary words like "a", "the", "and" to keep slugs concise while maintaining meaning.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I change a URL slug after publishing?
                </h3>
                <p className="text-gray-700">
                  You can, but it's not recommended. Changing slugs breaks existing links and can hurt SEO. 
                  If you must change it, set up a 301 redirect from the old URL to the new one to preserve link equity.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Should I include dates in slugs?
                </h3>
                <p className="text-gray-700">
                  Generally no, unless the date is essential to the content (like news articles or annual reports). 
                  Dates make content appear outdated and limit evergreen potential. Use "best-seo-tips" instead of "best-seo-tips-2024".
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Do slugs affect page ranking?
                </h3>
                <p className="text-gray-700">
                  Yes, but as a minor ranking factor. Slugs with relevant keywords help Google understand your content. 
                  However, quality content, backlinks, and user experience are much more important for rankings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
