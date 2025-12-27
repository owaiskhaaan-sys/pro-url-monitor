import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function JavaScriptBeautifierMinifier() {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [mode, setMode] = useState('beautify');
  const [indentSize, setIndentSize] = useState(2);
  const [stats, setStats] = useState(null);

  const beautifyJS = (js, indent = 2) => {
    const indentStr = ' '.repeat(indent);
    let formatted = '';
    let indentLevel = 0;
    let inString = false;
    let stringChar = '';
    let buffer = '';
    
    for (let i = 0; i < js.length; i++) {
      const char = js[i];
      const nextChar = js[i + 1];
      const prevChar = js[i - 1];
      
      // Handle strings
      if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
          stringChar = '';
        }
      }
      
      if (inString) {
        buffer += char;
        continue;
      }
      
      // Handle comments
      if (char === '/' && nextChar === '/') {
        // Single line comment
        let comment = '';
        while (i < js.length && js[i] !== '\n') {
          comment += js[i];
          i++;
        }
        formatted += indentStr.repeat(indentLevel) + comment.trim() + '\n';
        continue;
      }
      
      if (char === '/' && nextChar === '*') {
        // Multi-line comment
        let comment = '';
        while (i < js.length && !(js[i] === '*' && js[i + 1] === '/')) {
          comment += js[i];
          i++;
        }
        comment += '*/';
        i++;
        formatted += indentStr.repeat(indentLevel) + comment.trim() + '\n';
        continue;
      }
      
      if (char === '{') {
        if (buffer.trim()) {
          formatted += indentStr.repeat(indentLevel) + buffer.trim() + ' {\n';
        } else {
          formatted += indentStr.repeat(indentLevel) + '{\n';
        }
        buffer = '';
        indentLevel++;
      } else if (char === '}') {
        if (buffer.trim()) {
          formatted += indentStr.repeat(indentLevel) + buffer.trim() + '\n';
        }
        indentLevel--;
        formatted += indentStr.repeat(indentLevel) + '}';
        
        // Check if next is semicolon or comma
        if (nextChar === ';' || nextChar === ',') {
          formatted += nextChar;
          i++;
        }
        formatted += '\n';
        if (nextChar && nextChar !== '}' && nextChar !== ';') {
          formatted += '\n';
        }
        buffer = '';
      } else if (char === ';') {
        formatted += indentStr.repeat(indentLevel) + buffer.trim() + ';\n';
        buffer = '';
      } else if (char === '\n' || char === '\r') {
        if (buffer.trim()) {
          formatted += indentStr.repeat(indentLevel) + buffer.trim() + '\n';
          buffer = '';
        }
      } else {
        buffer += char;
      }
    }
    
    if (buffer.trim()) {
      formatted += indentStr.repeat(indentLevel) + buffer.trim();
    }
    
    return formatted.trim();
  };

  const minifyJS = (js) => {
    let minified = js;
    
    // Remove single-line comments
    minified = minified.replace(/\/\/.*$/gm, '');
    
    // Remove multi-line comments
    minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Remove unnecessary whitespace
    minified = minified.replace(/\s+/g, ' ');
    
    // Remove spaces around operators and brackets
    minified = minified.replace(/\s*([{}()\[\];,:<>+\-*/%=!&|?])\s*/g, '$1');
    
    // Add necessary space after keywords
    minified = minified.replace(/(if|for|while|function|return|var|let|const|else|switch|case|break|continue|try|catch|throw|new|typeof|instanceof)\(/g, '$1 (');
    
    return minified.trim();
  };

  const processCode = () => {
    if (!inputCode.trim()) {
      alert('Please enter JavaScript code to process');
      return;
    }

    try {
      let result;
      const originalSize = new Blob([inputCode]).size;
      
      if (mode === 'beautify') {
        result = beautifyJS(inputCode, indentSize);
      } else {
        result = minifyJS(inputCode);
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
        functions: (result.match(/function\s+\w+/g) || []).length,
        variables: (result.match(/(var|let|const)\s+\w+/g) || []).length
      });
    } catch (err) {
      alert('Error processing JavaScript: ' + err.message);
    }
  };

  const loadExample = () => {
    const example = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity;
  }
  return total;
}

class ShoppingCart {
  constructor() {
    this.items = [];
    this.discount = 0;
  }

  addItem(product, quantity = 1) {
    const existingItem = this.items.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.product.id !== productId);
  }

  getTotal() {
    const subtotal = calculateTotal(this.items);
    return subtotal - (subtotal * this.discount / 100);
  }

  applyDiscount(percentage) {
    if (percentage >= 0 && percentage <= 100) {
      this.discount = percentage;
    }
  }
}

const cart = new ShoppingCart();
cart.addItem({ id: 1, name: 'Laptop', price: 999 }, 1);
cart.addItem({ id: 2, name: 'Mouse', price: 29 }, 2);
cart.applyDiscount(10);
console.log('Total:', cart.getTotal());`;
    setInputCode(example);
  };

  const copyToClipboard = () => {
    if (!outputCode) return;
    navigator.clipboard.writeText(outputCode);
    alert('JavaScript code copied to clipboard!');
  };

  const downloadFile = () => {
    if (!outputCode) return;
    const blob = new Blob([outputCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'beautify' ? 'beautified.js' : 'minified.js';
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
        <title>JavaScript Beautifier & Minifier - Format & Compress JS Code Online | ProURLMonitor</title>
        <meta name="description" content="Free JavaScript Beautifier and Minifier Tool. Format messy JS code with proper indentation or minify to reduce file size. Optimize JavaScript for production." />
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4 text-center">JavaScript Beautifier & Minifier</h1>
        <p className="text-gray-600 mb-8 text-center">
          Format messy JavaScript code or minify to optimize file size and performance!
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
              <label className="block text-sm font-medium text-gray-700">Input JavaScript Code:</label>
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
              placeholder="Paste your JavaScript code here..."
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
              {mode === 'beautify' ? '🎨 Beautify JavaScript' : '⚡ Minify JavaScript'}
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
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border-2 border-blue-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
                  <div className="text-sm text-gray-600">Functions</div>
                  <div className="text-xl font-bold text-indigo-600">{stats.functions}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Variables</div>
                  <div className="text-xl font-bold text-pink-600">{stats.variables}</div>
                </div>
              </div>
            </div>
          )}

          {/* Output Area */}
          {outputCode && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Output JavaScript Code:</label>
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
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">What is JavaScript Beautifier & Minifier?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>JavaScript Beautifier</strong> formats compressed or messy JS code with proper indentation, line breaks, and spacing for better readability. <strong>JavaScript Minifier</strong> removes whitespace, comments, and unnecessary characters to reduce file size and improve page load speed.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our tool helps developers optimize JavaScript for production (minify) or make it readable for debugging (beautify). Essential for faster websites and better user experience.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Why Minify JavaScript?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-lg border-2 border-emerald-200">
                <h3 className="text-xl font-bold text-emerald-800 mb-3">⚡ Performance Impact</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>✅ 50-70% smaller file size</li>
                  <li>✅ Faster download times</li>
                  <li>✅ Quicker parse & execution</li>
                  <li>✅ Reduced bandwidth costs</li>
                  <li>✅ Better mobile experience</li>
                  <li>✅ Improved Time to Interactive</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-3">🎯 Business Benefits</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>✅ Higher conversion rates</li>
                  <li>✅ Better SEO rankings</li>
                  <li>✅ Lower hosting costs</li>
                  <li>✅ Enhanced Core Web Vitals</li>
                  <li>✅ Improved user retention</li>
                  <li>✅ Faster mobile sites</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">JavaScript Minification Techniques</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Technique</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Size Savings</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">Whitespace Removal</td><td className="border border-gray-300 px-4 py-2 text-sm">Remove spaces, tabs, newlines</td><td className="border border-gray-300 px-4 py-2 text-sm text-green-600 font-semibold">40-50%</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">Comment Removal</td><td className="border border-gray-300 px-4 py-2 text-sm">Strip JS comments</td><td className="border border-gray-300 px-4 py-2 text-sm text-green-600 font-semibold">10-20%</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">Variable Shortening</td><td className="border border-gray-300 px-4 py-2 text-sm">Rename vars to a, b, c (advanced)</td><td className="border border-gray-300 px-4 py-2 text-sm text-green-600 font-semibold">5-15%</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">Dead Code Removal</td><td className="border border-gray-300 px-4 py-2 text-sm">Remove unused code (tree-shaking)</td><td className="border border-gray-300 px-4 py-2 text-sm text-green-600 font-semibold">10-30%</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">Function Inlining</td><td className="border border-gray-300 px-4 py-2 text-sm">Replace small functions inline</td><td className="border border-gray-300 px-4 py-2 text-sm text-green-600 font-semibold">3-8%</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">JavaScript Beautifier Features</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">📏 Proper Indentation</h3>
                <p className="text-sm text-gray-700">Adds consistent spacing (2, 4, or 8 spaces) for nested code blocks and functions.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🔄 Line Breaks</h3>
                <p className="text-sm text-gray-700">Splits statements across lines for better readability and debugging.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🎯 Code Structure</h3>
                <p className="text-sm text-gray-700">Maintains proper structure for functions, loops, and conditionals.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">📦 Block Formatting</h3>
                <p className="text-sm text-gray-700">Aligns curly braces and parentheses consistently.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">💬 Comment Preservation</h3>
                <p className="text-sm text-gray-700">Maintains both single-line and multi-line comments.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🔍 String Handling</h3>
                <p className="text-sm text-gray-700">Properly handles strings with quotes, backticks, and escape sequences.</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Best Practices for JavaScript Optimization</h2>
            <div className="space-y-3">
              <div className="flex gap-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div className="text-2xl">📦</div>
                <div className="flex-1">
                  <div className="font-semibold text-green-800">Use Build Tools</div>
                  <div className="text-sm text-gray-700">Use Webpack, Rollup, or Vite to automate minification. These tools offer advanced optimizations like tree-shaking and code-splitting.</div>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div className="text-2xl">🔒</div>
                <div className="flex-1">
                  <div className="font-semibold text-blue-800">Source Maps</div>
                  <div className="text-sm text-gray-700">Generate source maps for production to debug minified code. Keep .map files on server, don't serve to users.</div>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <div className="text-2xl">⚡</div>
                <div className="flex-1">
                  <div className="font-semibold text-yellow-800">Gzip Compression</div>
                  <div className="text-sm text-gray-700">Enable gzip or brotli compression on server. Minified + compressed JS can be 80-90% smaller than original.</div>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <div className="text-2xl">🧪</div>
                <div className="flex-1">
                  <div className="font-semibold text-purple-800">Test Thoroughly</div>
                  <div className="text-sm text-gray-700">Always test minified code in all target browsers. Some edge cases may break after aggressive minification.</div>
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
                  <a href="/tools/css-beautifier-minifier" className="hover:text-emerald-600">💅 CSS Beautifier & Minifier</a>
                </h3>
                <p className="text-sm text-gray-700">Format and compress CSS stylesheets.</p>
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
                <p className="text-sm text-gray-700">Format and validate XML documents.</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">📚 Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Will minification break my JavaScript?</h3>
                <p className="text-gray-700 text-sm">A: Basic minification (whitespace/comment removal) is safe. Advanced minification (variable renaming) may break code if not done carefully. Always test after minification.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: How much can I reduce JavaScript file size?</h3>
                <p className="text-gray-700 text-sm">A: Typically 50-70% reduction with minification. Combined with gzip compression, total reduction can reach 80-90% compared to original.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Should I minify JavaScript for production?</h3>
                <p className="text-gray-700 text-sm">A: Absolutely! Minified JavaScript loads faster, reduces bandwidth costs, and improves Core Web Vitals. Always minify for production environments.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Can I debug minified JavaScript?</h3>
                <p className="text-gray-700 text-sm">A: Use source maps to debug minified code. Source maps link minified code back to original source for easier debugging in browser DevTools.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What's the difference between minify and uglify?</h3>
                <p className="text-gray-700 text-sm">A: Minify removes whitespace and comments. Uglify (advanced minification) also renames variables, shortens function names, and performs more aggressive optimizations.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Is this JavaScript formatter free?</h3>
                <p className="text-gray-700 text-sm">A: Yes! Completely free with unlimited formatting. Beautify and minify JavaScript instantly without registration or payment.</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
            <h2 className="text-2xl font-bold mb-4">⚡ Optimize JavaScript Now!</h2>
            <p className="mb-4">
              Use our <strong>free JavaScript Beautifier & Minifier</strong> to format messy code or optimize for production. Achieve 50-70% size reduction instantly.
            </p>
            <p className="font-semibold">
              More tools: <a href="/tools/html-beautifier-minifier" className="text-blue-100 hover:text-white underline">HTML Formatter</a> • <a href="/tools/css-beautifier-minifier" className="text-blue-100 hover:text-white underline">CSS Formatter</a> • <a href="/tools/json-beautifier" className="text-blue-100 hover:text-white underline">JSON Validator</a> 🚀
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
