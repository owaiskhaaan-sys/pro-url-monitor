import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function HTMLBeautifierMinifier() {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [mode, setMode] = useState('beautify');
  const [indentSize, setIndentSize] = useState(2);
  const [stats, setStats] = useState(null);

  const beautifyHTML = (html, indent = 2) => {
    let formatted = '';
    let indentLevel = 0;
    const indentStr = ' '.repeat(indent);
    
    // Remove extra whitespace
    html = html.replace(/>\s+</g, '><').trim();
    
    // Split by tags
    const tokens = html.split(/(<[^>]+>)/g).filter(t => t.trim());
    
    tokens.forEach(token => {
      if (token.startsWith('</')) {
        // Closing tag
        indentLevel--;
        formatted += indentStr.repeat(Math.max(0, indentLevel)) + token + '\n';
      } else if (token.startsWith('<')) {
        // Opening tag
        const isSelfClosing = token.endsWith('/>') || 
          /^<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)/.test(token);
        const isComment = token.startsWith('<!--');
        const isDoctype = token.toLowerCase().startsWith('<!doctype');
        
        formatted += indentStr.repeat(indentLevel) + token + '\n';
        
        if (!isSelfClosing && !isComment && !isDoctype) {
          indentLevel++;
        }
      } else {
        // Text content
        if (token.trim()) {
          formatted += indentStr.repeat(indentLevel) + token.trim() + '\n';
        }
      }
    });
    
    return formatted.trim();
  };

  const minifyHTML = (html) => {
    return html
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .replace(/<!--.*?-->/g, '')
      .trim();
  };

  const processCode = () => {
    if (!inputCode.trim()) {
      alert('Please enter HTML code to process');
      return;
    }

    try {
      let result;
      const originalSize = new Blob([inputCode]).size;
      
      if (mode === 'beautify') {
        result = beautifyHTML(inputCode, indentSize);
      } else {
        result = minifyHTML(inputCode);
      }
      
      const processedSize = new Blob([result]).size;
      const lines = result.split('\n').length;
      const reduction = ((originalSize - processedSize) / originalSize * 100).toFixed(2);
      
      setOutputCode(result);
      setStats({
        originalSize: originalSize,
        processedSize: processedSize,
        reduction: mode === 'minify' ? reduction : 0,
        lines: lines,
        characters: result.length
      });
    } catch (err) {
      alert('Error processing HTML: ' + err.message);
    }
  };

  const loadExample = () => {
    const example = `<!DOCTYPE html><html><head><title>Example Page</title><meta charset="UTF-8"><link rel="stylesheet" href="styles.css"></head><body><header><nav><ul><li><a href="#">Home</a></li><li><a href="#">About</a></li></ul></nav></header><main><section class="hero"><h1>Welcome to My Website</h1><p>This is an example paragraph with some <strong>bold text</strong> and <em>italic text</em>.</p><button onclick="handleClick()">Click Me</button></section><section class="content"><article><h2>Article Title</h2><p>Article content goes here...</p></article></section></main><footer><p>&copy; 2025 My Website</p></footer></body></html>`;
    setInputCode(example);
  };

  const copyToClipboard = () => {
    if (!outputCode) return;
    navigator.clipboard.writeText(outputCode);
    alert('Code copied to clipboard!');
  };

  const downloadFile = () => {
    if (!outputCode) return;
    const blob = new Blob([outputCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'beautify' ? 'beautified.html' : 'minified.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInputCode('');
    setOutputCode('');
    setStats(null);
  };

  const formatBytes = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <Layout>
      <Head>
        <title>HTML Beautifier & Minifier - Format & Compress HTML Code Online | ProURLMonitor</title>
        <meta name="description" content="Free HTML Beautifier and Minifier Tool. Format messy HTML code with proper indentation or minify to reduce file size. Online HTML formatter with instant results." />
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4 text-center">HTML Beautifier & Minifier</h1>
        <p className="text-gray-600 mb-8 text-center">
          Format messy HTML code or minify to reduce file size!
        </p>

        <div className="card mb-8">
          {/* Mode Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Select Mode:</label>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setMode('beautify')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  mode === 'beautify'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🎨 Beautify (Format)
              </button>
              <button
                onClick={() => setMode('minify')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  mode === 'minify'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ⚡ Minify (Compress)
              </button>
            </div>
          </div>

          {mode === 'beautify' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Indent Size:</label>
              <div className="flex gap-2">
                {[2, 4, 8].map(size => (
                  <button
                    key={size}
                    onClick={() => setIndentSize(size)}
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      indentSize === size
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {size} spaces
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Input HTML Code:</label>
              <button
                onClick={loadExample}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Load Example
              </button>
            </div>
            <textarea
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Paste your HTML code here..."
              className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-emerald-500"
            />
            <div className="text-xs text-gray-500 mt-1">
              {inputCode.length} characters • {new Blob([inputCode]).size} bytes
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={processCode}
              className="btn btn-primary px-8 py-3"
            >
              {mode === 'beautify' ? '🎨 Beautify HTML' : '⚡ Minify HTML'}
            </button>
            <button
              onClick={clearAll}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold"
            >
              🗑️ Clear
            </button>
          </div>

          {/* Statistics */}
          {stats && (
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Original Size</div>
                  <div className="text-xl font-bold text-blue-600">{formatBytes(stats.originalSize)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Processed Size</div>
                  <div className="text-xl font-bold text-green-600">{formatBytes(stats.processedSize)}</div>
                </div>
                {mode === 'minify' && (
                  <div>
                    <div className="text-sm text-gray-600">Size Reduction</div>
                    <div className="text-xl font-bold text-emerald-600">{stats.reduction}%</div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-gray-600">Lines</div>
                  <div className="text-xl font-bold text-purple-600">{stats.lines}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Characters</div>
                  <div className="text-xl font-bold text-pink-600">{stats.characters}</div>
                </div>
              </div>
            </div>
          )}

          {/* Output Area */}
          {outputCode && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Output HTML Code:</label>
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    📋 Copy
                  </button>
                  <button
                    onClick={downloadFile}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    💾 Download
                  </button>
                </div>
              </div>
              <textarea
                value={outputCode}
                readOnly
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50"
              />
            </div>
          )}
        </div>

        {/* SEO Content */}
        <div className="prose prose-emerald max-w-none mt-12 space-y-8">
          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">What is HTML Beautifier & Minifier?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>HTML Beautifier</strong> formats messy, compressed HTML code with proper indentation and line breaks for better readability. <strong>HTML Minifier</strong> removes unnecessary whitespace and comments to reduce file size and improve page load speed.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our tool provides instant HTML formatting and compression. Perfect for developers cleaning up code or optimizing websites for production.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Beautify vs Minify - When to Use?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-3">🎨 Beautify HTML</h3>
                <p className="text-sm text-gray-700 mb-3">Use when you need to:</p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>✅ Debug or review HTML code</li>
                  <li>✅ Understand minified code structure</li>
                  <li>✅ Learn from others' code</li>
                  <li>✅ Prepare code for editing</li>
                  <li>✅ Improve code readability</li>
                </ul>
              </div>
              <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
                <h3 className="text-xl font-bold text-green-800 mb-3">⚡ Minify HTML</h3>
                <p className="text-sm text-gray-700 mb-3">Use when you need to:</p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>✅ Reduce file size for production</li>
                  <li>✅ Improve page load speed</li>
                  <li>✅ Optimize bandwidth usage</li>
                  <li>✅ Enhance website performance</li>
                  <li>✅ Meet Core Web Vitals</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">HTML Beautifier Features</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">📏 Proper Indentation</h3>
                <p className="text-sm text-gray-700">Adds consistent spacing (2, 4, or 8 spaces) for nested elements.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🔄 Line Breaks</h3>
                <p className="text-sm text-gray-700">Splits code into logical lines for better readability.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🎯 Tag Alignment</h3>
                <p className="text-sm text-gray-700">Aligns opening and closing tags properly.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">📝 Whitespace Cleanup</h3>
                <p className="text-sm text-gray-700">Removes excessive spaces and blank lines.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🔍 Self-Closing Tags</h3>
                <p className="text-sm text-gray-700">Properly handles void elements like img, br, hr.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">💬 Comment Preservation</h3>
                <p className="text-sm text-gray-700">Maintains HTML comments in beautified code.</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">HTML Minifier Features</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-green-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Optimization</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Impact</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">Whitespace Removal</td><td className="border border-gray-300 px-4 py-2 text-sm">Removes spaces, tabs, newlines</td><td className="border border-gray-300 px-4 py-2 text-sm text-green-600 font-semibold">30-40% smaller</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">Comment Removal</td><td className="border border-gray-300 px-4 py-2 text-sm">Strips HTML comments</td><td className="border border-gray-300 px-4 py-2 text-sm text-green-600 font-semibold">5-10% smaller</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">Line Break Removal</td><td className="border border-gray-300 px-4 py-2 text-sm">Converts to single line</td><td className="border border-gray-300 px-4 py-2 text-sm text-green-600 font-semibold">10-15% smaller</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">Multiple Spaces</td><td className="border border-gray-300 px-4 py-2 text-sm">Collapses to single space</td><td className="border border-gray-300 px-4 py-2 text-sm text-green-600 font-semibold">5-8% smaller</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Benefits of HTML Minification</h2>
            <div className="space-y-3">
              <div className="flex gap-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div className="text-2xl">⚡</div>
                <div className="flex-1">
                  <div className="font-semibold text-green-800">Faster Page Load</div>
                  <div className="text-sm text-gray-700">Smaller files transfer faster over the network, reducing Time to First Byte (TTFB).</div>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div className="text-2xl">📊</div>
                <div className="flex-1">
                  <div className="font-semibold text-green-800">Better Core Web Vitals</div>
                  <div className="text-sm text-gray-700">Improved LCP (Largest Contentful Paint) and FCP (First Contentful Paint) scores.</div>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div className="text-2xl">💰</div>
                <div className="flex-1">
                  <div className="font-semibold text-green-800">Reduced Bandwidth</div>
                  <div className="text-sm text-gray-700">Lower hosting costs and bandwidth usage for high-traffic websites.</div>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div className="text-2xl">🔍</div>
                <div className="flex-1">
                  <div className="font-semibold text-green-800">Better SEO</div>
                  <div className="text-sm text-gray-700">Google rewards faster websites with better rankings.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Related Code Tools</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/css-beautifier-minifier" className="hover:text-emerald-600">🎨 CSS Beautifier & Minifier</a>
                </h3>
                <p className="text-sm text-gray-700">Format and compress CSS code.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/javascript-beautifier-minifier" className="hover:text-emerald-600">⚡ JavaScript Beautifier & Minifier</a>
                </h3>
                <p className="text-sm text-gray-700">Format and compress JavaScript.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/json-beautifier" className="hover:text-emerald-600">📋 JSON Beautifier & Validator</a>
                </h3>
                <p className="text-sm text-gray-700">Format and validate JSON data.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/xml-beautifier" className="hover:text-emerald-600">📄 XML Beautifier & Validator</a>
                </h3>
                <p className="text-sm text-gray-700">Format and validate XML code.</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">📚 Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Does minification affect HTML functionality?</h3>
                <p className="text-gray-700 text-sm">A: No! Minification only removes whitespace and comments, preserving all HTML tags, attributes, and structure. Your page will render exactly the same.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: How much smaller will my HTML file be?</h3>
                <p className="text-gray-700 text-sm">A: Typically 30-60% reduction depending on original formatting. Files with heavy indentation and comments see the most savings.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Should I minify HTML for production?</h3>
                <p className="text-gray-700 text-sm">A: Yes! Minified HTML loads faster, uses less bandwidth, and improves Core Web Vitals scores. Always minify for production environments.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Can I beautify minified HTML?</h3>
                <p className="text-gray-700 text-sm">A: Absolutely! Our beautifier adds proper indentation and line breaks to compressed code, making it readable and editable again.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What indent size should I use?</h3>
                <p className="text-gray-700 text-sm">A: 2 spaces is most common for web development. 4 spaces offers better readability for complex nested structures. Choose based on your team's coding standards.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Is this HTML formatter free?</h3>
                <p className="text-gray-700 text-sm">A: Yes! Completely free with unlimited use. Beautify and minify HTML instantly without registration or limits.</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
            <h2 className="text-2xl font-bold mb-4">🎨 Format HTML Code Now!</h2>
            <p className="mb-4">
              Use our <strong>free HTML Beautifier & Minifier</strong> to format messy code or optimize for production. Instant results with proper indentation and compression.
            </p>
            <p className="font-semibold">
              More tools: <a href="/tools/css-beautifier-minifier" className="text-emerald-100 hover:text-white underline">CSS Formatter</a> • <a href="/tools/javascript-beautifier-minifier" className="text-emerald-100 hover:text-white underline">JS Formatter</a> • <a href="/tools/json-beautifier" className="text-emerald-100 hover:text-white underline">JSON Validator</a> 🚀
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
