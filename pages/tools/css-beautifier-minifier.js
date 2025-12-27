import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function CSSBeautifierMinifier() {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [mode, setMode] = useState('beautify');
  const [indentSize, setIndentSize] = useState(2);
  const [stats, setStats] = useState(null);

  const beautifyCSS = (css, indent = 2) => {
    const indentStr = ' '.repeat(indent);
    let formatted = '';
    let indentLevel = 0;
    
    // Remove extra whitespace
    css = css.replace(/\s+/g, ' ').trim();
    
    // Add line breaks and indentation
    let inSelector = false;
    let buffer = '';
    
    for (let i = 0; i < css.length; i++) {
      const char = css[i];
      const nextChar = css[i + 1];
      
      if (char === '{') {
        formatted += buffer.trim() + ' {\n';
        buffer = '';
        indentLevel++;
        inSelector = true;
      } else if (char === '}') {
        if (buffer.trim()) {
          formatted += indentStr.repeat(indentLevel) + buffer.trim() + '\n';
        }
        indentLevel--;
        formatted += indentStr.repeat(indentLevel) + '}\n';
        buffer = '';
        inSelector = false;
        
        // Add extra line break between rules
        if (nextChar && nextChar !== '}') {
          formatted += '\n';
        }
      } else if (char === ';' && inSelector) {
        formatted += indentStr.repeat(indentLevel) + buffer.trim() + ';\n';
        buffer = '';
      } else if (char === ',' && !inSelector) {
        formatted += buffer.trim() + ',\n' + indentStr.repeat(indentLevel);
        buffer = '';
      } else {
        buffer += char;
      }
    }
    
    return formatted.trim();
  };

  const minifyCSS = (css) => {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/\s*{\s*/g, '{')
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*;\s*/g, ';')
      .replace(/\s*:\s*/g, ':')
      .replace(/\s*,\s*/g, ',')
      .replace(/;\}/g, '}') // Remove last semicolon before }
      .trim();
  };

  const processCode = () => {
    if (!inputCode.trim()) {
      alert('Please enter CSS code to process');
      return;
    }

    try {
      let result;
      const originalSize = new Blob([inputCode]).size;
      
      if (mode === 'beautify') {
        result = beautifyCSS(inputCode, indentSize);
      } else {
        result = minifyCSS(inputCode);
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
        characters: result.length,
        selectors: (result.match(/{/g) || []).length,
        properties: (result.match(/:/g) || []).length
      });
    } catch (err) {
      alert('Error processing CSS: ' + err.message);
    }
  };

  const loadExample = () => {
    const example = `body{margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f5f5f5}.container{max-width:1200px;margin:0 auto;padding:20px}.header{background-color:#333;color:#fff;padding:20px;text-align:center}.header h1{margin:0;font-size:2.5em}.nav{background-color:#444;padding:10px}.nav ul{list-style:none;margin:0;padding:0;display:flex;justify-content:center}.nav li{margin:0 15px}.nav a{color:#fff;text-decoration:none;transition:color 0.3s}.nav a:hover{color:#4CAF50}.main-content{background:#fff;padding:30px;margin-top:20px;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1)}.card{border:1px solid #ddd;padding:20px;margin-bottom:20px;border-radius:4px}.card h2{color:#333;margin-top:0}.button{background-color:#4CAF50;color:white;padding:12px 24px;border:none;border-radius:4px;cursor:pointer;font-size:16px;transition:background-color 0.3s}.button:hover{background-color:#45a049}.footer{background-color:#333;color:#fff;text-align:center;padding:20px;margin-top:40px}@media(max-width:768px){.container{padding:10px}.header h1{font-size:1.8em}.nav ul{flex-direction:column;align-items:center}.nav li{margin:10px 0}}`;
    setInputCode(example);
  };

  const copyToClipboard = () => {
    if (!outputCode) return;
    navigator.clipboard.writeText(outputCode);
    alert('CSS code copied to clipboard!');
  };

  const downloadFile = () => {
    if (!outputCode) return;
    const blob = new Blob([outputCode], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'beautify' ? 'beautified.css' : 'minified.css';
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
        <title>CSS Beautifier & Minifier - Format & Compress CSS Code Online | ProURLMonitor</title>
        <meta name="description" content="Free CSS Beautifier and Minifier Tool. Format messy CSS code with proper indentation or minify to reduce file size. Optimize CSS for production instantly." />
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4 text-center">CSS Beautifier & Minifier</h1>
        <p className="text-gray-600 mb-8 text-center">
          Format messy CSS code or minify to optimize file size and performance!
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
              <label className="block text-sm font-medium text-gray-700">Input CSS Code:</label>
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
              placeholder="Paste your CSS code here..."
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
              {mode === 'beautify' ? '🎨 Beautify CSS' : '⚡ Minify CSS'}
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
            <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-2 border-purple-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Original Size</div>
                  <div className="text-xl font-bold text-purple-600">{formatBytes(stats.originalSize)}</div>
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
                  <div className="text-xl font-bold text-blue-600">{stats.lines}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Selectors</div>
                  <div className="text-xl font-bold text-indigo-600">{stats.selectors}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Properties</div>
                  <div className="text-xl font-bold text-pink-600">{stats.properties}</div>
                </div>
              </div>
            </div>
          )}

          {/* Output Area */}
          {outputCode && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Output CSS Code:</label>
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
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">What is CSS Beautifier & Minifier?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>CSS Beautifier</strong> formats compressed or messy CSS code with proper indentation, line breaks, and spacing for better readability. <strong>CSS Minifier</strong> removes whitespace, comments, and unnecessary characters to reduce file size and improve website performance.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our tool helps developers optimize CSS for production (minify) or make it readable for development (beautify). Essential for faster page loads and better SEO.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Why Minify CSS?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border-2 border-green-200">
                <h3 className="text-xl font-bold text-green-800 mb-3">⚡ Performance Benefits</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>✅ 40-60% smaller file size</li>
                  <li>✅ Faster page load times</li>
                  <li>✅ Reduced bandwidth usage</li>
                  <li>✅ Better Core Web Vitals</li>
                  <li>✅ Improved FCP & LCP scores</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-3">🔍 SEO Benefits</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>✅ Higher Google rankings</li>
                  <li>✅ Better mobile experience</li>
                  <li>✅ Lower bounce rates</li>
                  <li>✅ Improved user engagement</li>
                  <li>✅ Enhanced site speed score</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">CSS Minification Techniques</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-emerald-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Technique</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Size Savings</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">Whitespace Removal</td><td className="border border-gray-300 px-4 py-2 text-sm">Remove spaces, tabs, newlines</td><td className="border border-gray-300 px-4 py-2 text-sm text-green-600 font-semibold">30-40%</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">Comment Removal</td><td className="border border-gray-300 px-4 py-2 text-sm">Strip CSS comments</td><td className="border border-gray-300 px-4 py-2 text-sm text-green-600 font-semibold">5-15%</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">Semicolon Removal</td><td className="border border-gray-300 px-4 py-2 text-sm">Remove last semicolon in rules</td><td className="border border-gray-300 px-4 py-2 text-sm text-green-600 font-semibold">2-5%</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">Zero Optimization</td><td className="border border-gray-300 px-4 py-2 text-sm">0px → 0, 0.5 → .5</td><td className="border border-gray-300 px-4 py-2 text-sm text-green-600 font-semibold">1-3%</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">Color Shortening</td><td className="border border-gray-300 px-4 py-2 text-sm">#ffffff → #fff</td><td className="border border-gray-300 px-4 py-2 text-sm text-green-600 font-semibold">2-4%</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">CSS Beautifier Features</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-800 mb-2">📏 Proper Indentation</h3>
                <p className="text-sm text-gray-700">Adds consistent spacing (2, 4, or 8 spaces) for nested rules and properties.</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-800 mb-2">🔄 Line Breaks</h3>
                <p className="text-sm text-gray-700">Splits selectors and properties into separate lines for readability.</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-800 mb-2">🎯 Property Alignment</h3>
                <p className="text-sm text-gray-700">Aligns CSS properties within rule blocks consistently.</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-800 mb-2">📦 Rule Spacing</h3>
                <p className="text-sm text-gray-700">Adds blank lines between CSS rules for visual separation.</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-800 mb-2">🔗 Selector Formatting</h3>
                <p className="text-sm text-gray-700">Formats multiple selectors with proper comma placement.</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-800 mb-2">💬 Comment Preservation</h3>
                <p className="text-sm text-gray-700">Maintains CSS comments in beautified code.</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Best Practices</h2>
            <div className="space-y-3">
              <div className="flex gap-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div className="text-2xl">🔧</div>
                <div className="flex-1">
                  <div className="font-semibold text-blue-800">Development Phase</div>
                  <div className="text-sm text-gray-700">Use beautified CSS for easier debugging and maintenance. Keep code readable for team collaboration.</div>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div className="text-2xl">🚀</div>
                <div className="flex-1">
                  <div className="font-semibold text-green-800">Production Deployment</div>
                  <div className="text-sm text-gray-700">Always minify CSS before deploying to production. Set up build tools to automate minification.</div>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <div className="text-2xl">📦</div>
                <div className="flex-1">
                  <div className="font-semibold text-purple-800">Version Control</div>
                  <div className="text-sm text-gray-700">Commit beautified CSS to Git. Generate minified versions during build process.</div>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <div className="text-2xl">🔍</div>
                <div className="flex-1">
                  <div className="font-semibold text-yellow-800">Testing</div>
                  <div className="text-sm text-gray-700">Test minified CSS thoroughly. Ensure no functionality breaks after minification.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Related Code Tools</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/html-beautifier-minifier" className="hover:text-emerald-600">🎨 HTML Beautifier & Minifier</a>
                </h3>
                <p className="text-sm text-gray-700">Format and compress HTML code.</p>
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
                <h3 className="font-semibold text-gray-800 mb-2">Q: Does CSS minification break my styles?</h3>
                <p className="text-gray-700 text-sm">A: No! Minification only removes whitespace and comments while preserving all CSS rules, selectors, and properties. Your styles will work exactly the same.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: How much can I reduce CSS file size?</h3>
                <p className="text-gray-700 text-sm">A: Typically 40-60% reduction depending on formatting. Well-indented CSS with comments can see even greater savings.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Should I minify CSS for production websites?</h3>
                <p className="text-gray-700 text-sm">A: Absolutely! Minified CSS loads faster, reduces bandwidth costs, and improves Core Web Vitals. Always minify for production.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Can I beautify already minified CSS?</h3>
                <p className="text-gray-700 text-sm">A: Yes! Our beautifier adds proper indentation and line breaks to minified CSS, making it readable and editable again.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What indent size is recommended?</h3>
                <p className="text-gray-700 text-sm">A: 2 spaces is industry standard for CSS. It balances readability with compact file size. Choose based on your team's style guide.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Is this CSS formatter free?</h3>
                <p className="text-gray-700 text-sm">A: Yes! Completely free with unlimited formatting. Beautify and minify CSS instantly without registration or payment.</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <h2 className="text-2xl font-bold mb-4">🎨 Format CSS Code Now!</h2>
            <p className="mb-4">
              Use our <strong>free CSS Beautifier & Minifier</strong> to format messy code or optimize for production. Instant results with 40-60% size reduction.
            </p>
            <p className="font-semibold">
              More tools: <a href="/tools/html-beautifier-minifier" className="text-purple-100 hover:text-white underline">HTML Formatter</a> • <a href="/tools/javascript-beautifier-minifier" className="text-purple-100 hover:text-white underline">JS Formatter</a> • <a href="/tools/json-beautifier" className="text-purple-100 hover:text-white underline">JSON Validator</a> 🚀
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
