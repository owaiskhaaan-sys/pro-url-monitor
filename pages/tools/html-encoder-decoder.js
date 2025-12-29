import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function HTMLEncoderDecoder() {
  const [mode, setMode] = useState('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [encodeType, setEncodeType] = useState('entities'); // entities, numeric
  const [stats, setStats] = useState(null);

  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
    '©': '&copy;',
    '®': '&reg;',
    '™': '&trade;',
    '€': '&euro;',
    '£': '&pound;',
    '¥': '&yen;',
    '¢': '&cent;',
    '°': '&deg;',
    '±': '&plusmn;',
    '×': '&times;',
    '÷': '&divide;',
    'á': '&aacute;',
    'é': '&eacute;',
    'í': '&iacute;',
    'ó': '&oacute;',
    'ú': '&uacute;',
    'à': '&agrave;',
    'è': '&egrave;',
    'ì': '&igrave;',
    'ò': '&ograve;',
    'ù': '&ugrave;',
    'ñ': '&ntilde;',
    'ü': '&uuml;',
    ' ': '&nbsp;'
  };

  const encodeHTML = (text, type) => {
    let encoded = '';
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const code = text.charCodeAt(i);
      
      if (type === 'entities' && htmlEntities[char]) {
        // Use named entity if available
        encoded += htmlEntities[char];
      } else if (code > 127 || ['&', '<', '>', '"', "'"].includes(char)) {
        // Use numeric entity for non-ASCII or special chars
        encoded += `&#${code};`;
      } else {
        // Keep as-is for normal ASCII
        encoded += char;
      }
    }
    
    return encoded;
  };

  const decodeHTML = (text) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };

  const processHTML = () => {
    if (!input.trim()) {
      setOutput('');
      setStats(null);
      return;
    }

    try {
      let result = '';
      
      if (mode === 'encode') {
        result = encodeHTML(input, encodeType);
        
        const entityCount = (result.match(/&[^;]+;/g) || []).length;
        const specialChars = input.split('').filter(c => {
          const code = c.charCodeAt(0);
          return code > 127 || ['&', '<', '>', '"', "'"].includes(c);
        }).length;
        
        setStats({
          originalLength: input.length,
          encodedLength: result.length,
          specialChars: specialChars,
          entitiesCreated: entityCount,
          sizeIncrease: input.length > 0 ? ((result.length - input.length) / input.length * 100).toFixed(2) : 0
        });
      } else {
        result = decodeHTML(input);
        
        const entityCount = (input.match(/&[^;]+;/g) || []).length;
        
        setStats({
          encodedLength: input.length,
          decodedLength: result.length,
          entitiesDecoded: entityCount,
          sizeDecrease: input.length > 0 ? ((input.length - result.length) / input.length * 100).toFixed(2) : 0
        });
      }
      
      setOutput(result);
    } catch (err) {
      setOutput('Error processing HTML');
      setStats(null);
    }
  };

  const copyToClipboard = async (text) => {
    if (!text) {
      alert('Nothing to copy');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (err) {
      alert('Failed to copy');
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setStats(null);
  };

  const loadExample = (type) => {
    if (mode === 'encode') {
      const examples = {
        html: '<div class="container">\n  <h1>Hello, World!</h1>\n  <p>This is a <strong>test</strong> & example.</p>\n</div>',
        special: 'Price: $29.99, Discount: 20%, Total: $23.99 - "Great Deal!"',
        unicode: 'Español: ñ, á, é, í, ó, ú | Symbols: © ® ™ € £ ¥',
        mixed: '<script>alert("XSS");</script> & <img src="test.jpg" alt=\'image\'>'
      };
      setInput(examples[type]);
    } else {
      const examples = {
        html: '&lt;div class=&quot;container&quot;&gt;\n  &lt;h1&gt;Hello, World!&lt;/h1&gt;\n  &lt;p&gt;This is a &lt;strong&gt;test&lt;/strong&gt; &amp; example.&lt;/p&gt;\n&lt;/div&gt;',
        special: 'Price: $29.99, Discount: 20%, Total: $23.99 - &quot;Great Deal!&quot;',
        unicode: 'Espa&ntilde;ol: &ntilde;, &aacute;, &eacute;, &iacute;, &oacute;, &uacute; | Symbols: &copy; &reg; &trade; &euro; &pound; &yen;',
        mixed: '&lt;script&gt;alert(&quot;XSS&quot;);&lt;/script&gt; &amp; &lt;img src=&quot;test.jpg&quot; alt=&apos;image&apos;&gt;'
      };
      setInput(examples[type]);
    }
  };

  return (
    <Layout
      title="HTML Encoder/Decoder - Encode & Decode HTML Entities Online"
      description="Free online HTML encoder and decoder. Convert special characters to HTML entities or decode HTML entities back to text. Prevent XSS attacks and display HTML safely."
    >
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              HTML Encoder/Decoder
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Encode special characters to HTML entities or decode HTML entities back to text. Essential for preventing XSS attacks and displaying HTML safely.
            </p>
          </div>

          {/* Tool Interface */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            {/* Mode Selection */}
            <div className="mb-6">
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setMode('encode');
                    setInput('');
                    setOutput('');
                    setStats(null);
                  }}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
                    mode === 'encode'
                      ? 'bg-orange-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Encode HTML
                </button>
                <button
                  onClick={() => {
                    setMode('decode');
                    setInput('');
                    setOutput('');
                    setStats(null);
                  }}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
                    mode === 'decode'
                      ? 'bg-orange-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Decode HTML
                </button>
              </div>
            </div>

            {/* Encoding Type (only for encode mode) */}
            {mode === 'encode' && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Encoding Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={encodeType === 'entities'}
                      onChange={() => setEncodeType('entities')}
                      className="w-4 h-4 text-orange-600"
                    />
                    <span className="ml-2">
                      <span className="font-semibold">Named Entities</span>
                      <span className="text-sm text-gray-600 block">Use &amp;lt;, &amp;gt;, &amp;copy;, etc. (more readable)</span>
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={encodeType === 'numeric'}
                      onChange={() => setEncodeType('numeric')}
                      className="w-4 h-4 text-orange-600"
                    />
                    <span className="ml-2">
                      <span className="font-semibold">Numeric Entities</span>
                      <span className="text-sm text-gray-600 block">Use &amp;#60;, &amp;#62;, &amp;#169;, etc. (universal)</span>
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Input Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {mode === 'encode' ? 'Text/HTML to Encode' : 'HTML Entities to Decode'}
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'encode' 
                  ? 'Enter text or HTML to encode...\nExample: <div>Hello & Welcome!</div>' 
                  : 'Enter HTML entities to decode...\nExample: &lt;div&gt;Hello &amp; Welcome!&lt;/div&gt;'}
                className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm resize-none"
              />
              <div className="mt-2 text-sm text-gray-600">
                {input.length} characters
              </div>
            </div>

            {/* Example Buttons */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Load Example
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <button
                  onClick={() => loadExample('html')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                >
                  HTML Code
                </button>
                <button
                  onClick={() => loadExample('special')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                >
                  Special Chars
                </button>
                <button
                  onClick={() => loadExample('unicode')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                >
                  Unicode
                </button>
                <button
                  onClick={() => loadExample('mixed')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                >
                  XSS Example
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={processHTML}
                className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium shadow-lg"
              >
                {mode === 'encode' ? 'Encode' : 'Decode'}
              </button>
              <button
                onClick={clearAll}
                className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Clear All
              </button>
            </div>

            {/* Output Section */}
            {output && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {mode === 'encode' ? 'Encoded HTML' : 'Decoded Text'}
                  </label>
                  <textarea
                    value={output}
                    readOnly
                    className="w-full h-48 p-4 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm resize-none"
                  />
                  <div className="mt-2 text-sm text-gray-600">
                    {output.length} characters
                  </div>
                </div>

                {/* Output Actions */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <button
                    onClick={() => copyToClipboard(output)}
                    className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium"
                  >
                    Copy Output
                  </button>
                  <button
                    onClick={() => {
                      setInput(output);
                      setOutput('');
                      setMode(mode === 'encode' ? 'decode' : 'encode');
                    }}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                  >
                    Use as Input
                  </button>
                </div>

                {/* Statistics */}
                {stats && (
                  <div className="p-6 bg-orange-50 border border-orange-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {mode === 'encode' ? (
                        <>
                          <div>
                            <div className="text-sm text-gray-600">Original Length</div>
                            <div className="text-xl font-bold text-gray-900">{stats.originalLength}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Encoded Length</div>
                            <div className="text-xl font-bold text-gray-900">{stats.encodedLength}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Special Characters</div>
                            <div className="text-xl font-bold text-gray-900">{stats.specialChars}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Entities Created</div>
                            <div className="text-xl font-bold text-gray-900">{stats.entitiesCreated}</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <div className="text-sm text-gray-600">Encoded Length</div>
                            <div className="text-xl font-bold text-gray-900">{stats.encodedLength}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Decoded Length</div>
                            <div className="text-xl font-bold text-gray-900">{stats.decodedLength}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Entities Decoded</div>
                            <div className="text-xl font-bold text-gray-900">{stats.entitiesDecoded}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Size Decrease</div>
                            <div className="text-xl font-bold text-gray-900">{stats.sizeDecrease}%</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Information Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              About HTML Encoding
            </h2>
            
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">
                HTML encoding converts special characters into HTML entities to prevent them from being 
                interpreted as HTML code. This is crucial for security (XSS prevention), data display, 
                and preserving special characters in web content.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Why HTML Encoding is Essential
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🛡️ XSS Prevention</h4>
                  <p className="text-sm">
                    Prevents Cross-Site Scripting attacks by encoding malicious scripts before display
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">📝 Display HTML Code</h4>
                  <p className="text-sm">
                    Shows HTML tags as text instead of rendering them in browsers
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🌐 Special Characters</h4>
                  <p className="text-sm">
                    Preserves copyright symbols, accents, currency signs, and other special characters
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">📊 Data Integrity</h4>
                  <p className="text-sm">
                    Safely stores and transmits user-generated content with special characters
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Common HTML Entities
              </h3>
              
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border border-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Character</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Named Entity</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Numeric</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono">&lt;</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">&amp;lt;</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">&amp;#60;</td>
                      <td className="border border-gray-200 px-4 py-2">Less than sign</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono">&gt;</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">&amp;gt;</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">&amp;#62;</td>
                      <td className="border border-gray-200 px-4 py-2">Greater than sign</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono">&amp;</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">&amp;amp;</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">&amp;#38;</td>
                      <td className="border border-gray-200 px-4 py-2">Ampersand</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono">"</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">&amp;quot;</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">&amp;#34;</td>
                      <td className="border border-gray-200 px-4 py-2">Double quote</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono">'</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">&amp;apos;</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">&amp;#39;</td>
                      <td className="border border-gray-200 px-4 py-2">Single quote (apostrophe)</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono">©</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">&amp;copy;</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">&amp;#169;</td>
                      <td className="border border-gray-200 px-4 py-2">Copyright symbol</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono">®</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">&amp;reg;</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">&amp;#174;</td>
                      <td className="border border-gray-200 px-4 py-2">Registered trademark</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono">™</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">&amp;trade;</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">&amp;#8482;</td>
                      <td className="border border-gray-200 px-4 py-2">Trademark symbol</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono">€</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">&amp;euro;</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">&amp;#8364;</td>
                      <td className="border border-gray-200 px-4 py-2">Euro currency</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono">(space)</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">&amp;nbsp;</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">&amp;#160;</td>
                      <td className="border border-gray-200 px-4 py-2">Non-breaking space</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Named vs Numeric Entities
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Named Entities (&amp;name;)</h4>
                  <p className="text-sm mb-3">
                    <strong>Pros:</strong> More readable, easier to remember, shorter
                  </p>
                  <p className="text-sm mb-3">
                    <strong>Cons:</strong> Limited set, not all characters have names
                  </p>
                  <div className="bg-gray-50 p-2 rounded text-xs font-mono">
                    &amp;lt;div&amp;gt; &amp;copy; 2024 &amp;amp; &amp;trade;
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Numeric Entities (&amp;#num;)</h4>
                  <p className="text-sm mb-3">
                    <strong>Pros:</strong> Universal, works for any Unicode character
                  </p>
                  <p className="text-sm mb-3">
                    <strong>Cons:</strong> Less readable, longer, harder to edit
                  </p>
                  <div className="bg-gray-50 p-2 rounded text-xs font-mono">
                    &amp;#60;div&amp;#62; &amp;#169; 2024 &amp;#38; &amp;#8482;
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Common Use Cases
              </h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span><strong>XSS Protection:</strong> Encode user input before displaying to prevent script injection</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span><strong>Code Display:</strong> Show HTML/XML code snippets in documentation or tutorials</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span><strong>Blog Comments:</strong> Safely display user comments with special characters</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span><strong>Email Content:</strong> Ensure special characters display correctly in HTML emails</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span><strong>Form Data:</strong> Store and transmit form submissions with special characters</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span><strong>Meta Tags:</strong> Properly encode meta descriptions and social media tags</span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                XSS Attack Prevention
              </h3>
              
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-semibold text-red-800 mb-2">Security Critical</h4>
                    <p className="text-sm text-red-700 mb-2">
                      <strong>Always encode user input</strong> before displaying it in HTML to prevent 
                      Cross-Site Scripting (XSS) attacks. This is one of the most common web vulnerabilities.
                    </p>
                    <div className="bg-white p-3 rounded text-sm mb-2">
                      <div className="text-red-900 font-semibold mb-1">❌ Dangerous (unencoded):</div>
                      <code className="text-xs">&lt;div&gt;{'{user_input}'}&lt;/div&gt;</code>
                      <div className="text-xs text-red-700 mt-1">Can execute: &lt;script&gt;alert('XSS')&lt;/script&gt;</div>
                    </div>
                    <div className="bg-white p-3 rounded text-sm">
                      <div className="text-green-900 font-semibold mb-1">✓ Safe (encoded):</div>
                      <code className="text-xs">&lt;div&gt;{'{htmlEncode(user_input)}'}&lt;/div&gt;</code>
                      <div className="text-xs text-green-700 mt-1">Displays: &amp;lt;script&amp;gt;alert('XSS')&amp;lt;/script&amp;gt;</div>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                When to Use HTML Encoding
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">✓ Always Encode</h4>
                  <ul className="text-sm space-y-1 text-green-800">
                    <li>• User-generated content</li>
                    <li>• Form submissions</li>
                    <li>• URL parameters in HTML</li>
                    <li>• Database content display</li>
                    <li>• API response data</li>
                    <li>• Search results</li>
                  </ul>
                </div>
                <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Sometimes Encode</h4>
                  <ul className="text-sm space-y-1 text-blue-800">
                    <li>• Trusted admin content</li>
                    <li>• Pre-sanitized HTML</li>
                    <li>• WYSIWYG editor output</li>
                    <li>• Template engine output</li>
                    <li>• CMS content (with sanitization)</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Frequently Asked Questions
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What's the difference between HTML encoding and URL encoding?</h4>
                  <p>
                    HTML encoding uses entities like &amp;lt; for display in HTML. URL encoding uses %20 for 
                    safe transmission in URLs. They serve different purposes and use different formats. 
                    Use HTML encoding for content, URL encoding for URLs.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Should I encode everything in HTML?</h4>
                  <p>
                    No, only encode when displaying untrusted content or special characters. Normal text 
                    (A-Z, a-z, 0-9) doesn't need encoding. Always encode user input, special characters 
                    (&lt;&gt;&amp;"'), and content from external sources.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Can HTML encoding break my layout?</h4>
                  <p>
                    No, HTML entities render as their original characters. &amp;lt; displays as &lt;, 
                    &amp;copy; as ©. The encoding is only visible in source code, not to users. 
                    It actually prevents layout breaking from malformed HTML.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Does double-encoding cause problems?</h4>
                  <p>
                    Yes! Encoding already-encoded text turns &amp;lt; into &amp;amp;lt; which displays 
                    as "&amp;lt;" instead of "&lt;". Always check if content is already encoded before 
                    encoding again.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Is HTML encoding enough for security?</h4>
                  <p>
                    HTML encoding prevents XSS in HTML content, but use appropriate encoding for each 
                    context: JavaScript encoding for JS, URL encoding for URLs, CSS encoding for styles. 
                    Also use Content Security Policy (CSP) headers for defense in depth.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Do I need to encode in JSON responses?</h4>
                  <p>
                    JSON escaping is different from HTML encoding. For JSON, use JSON.stringify() which 
                    handles escaping. Only HTML-encode when inserting JSON content into HTML. Don't 
                    HTML-encode JSON API responses.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
