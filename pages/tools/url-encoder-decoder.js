import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function URLEncoderDecoder() {
  const [mode, setMode] = useState('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState(null);
  const [encodeType, setEncodeType] = useState('component'); // component, full

  const processURL = () => {
    if (!input.trim()) {
      setOutput('');
      setStats(null);
      return;
    }

    try {
      let result = '';
      
      if (mode === 'encode') {
        if (encodeType === 'component') {
          // Encode URL component (most common - encodes special characters)
          result = encodeURIComponent(input);
        } else {
          // Encode full URI (preserves :, /, ?, #, etc.)
          result = encodeURI(input);
        }
        
        const specialChars = (input.match(/[^a-zA-Z0-9.-_~]/g) || []).length;
        
        setStats({
          originalLength: input.length,
          encodedLength: result.length,
          specialChars: specialChars,
          encodedChars: result.split('%').length - 1,
          sizeIncrease: input.length > 0 ? ((result.length - input.length) / input.length * 100).toFixed(2) : 0
        });
      } else {
        // Decode
        result = decodeURIComponent(input.replace(/\+/g, ' '));
        
        const encodedChars = (input.match(/%[0-9A-Fa-f]{2}/g) || []).length;
        
        setStats({
          encodedLength: input.length,
          decodedLength: result.length,
          encodedChars: encodedChars,
          sizeDecrease: input.length > 0 ? ((input.length - result.length) / input.length * 100).toFixed(2) : 0
        });
      }
      
      setOutput(result);
    } catch (err) {
      setOutput('Error: Invalid input for decoding');
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
        url: 'https://example.com/search?q=hello world&category=books',
        special: 'Email: user@example.com, Price: $29.99, Date: 2024-01-15',
        unicode: 'Hello 世界! Привет мир! مرحبا بالعالم',
        query: 'name=John Doe&email=john@example.com&message=Hello, how are you?'
      };
      setInput(examples[type]);
    } else {
      const examples = {
        url: 'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world%26category%3Dbooks',
        special: 'Email%3A%20user%40example.com%2C%20Price%3A%20%2429.99%2C%20Date%3A%202024-01-15',
        unicode: 'Hello%20%E4%B8%96%E7%95%8C!%20%D0%9F%D1%80%D0%B8%D0%B2%D0%B5%D1%82%20%D0%BC%D0%B8%D1%80!',
        query: 'name%3DJohn%20Doe%26email%3Djohn%40example.com%26message%3DHello%2C%20how%20are%20you%3F'
      };
      setInput(examples[type]);
    }
  };

  return (
    <Layout
      title="URL Encoder/Decoder - Encode & Decode URLs Online"
      description="Free online URL encoder and decoder. Convert URLs and text to percent-encoded format or decode encoded URLs. Perfect for web development and API work."
    >
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              URL Encoder/Decoder
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Encode text for safe URL transmission or decode percent-encoded URLs. Essential tool for web developers working with URLs and query strings.
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
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Encode URL
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
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Decode URL
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
                      checked={encodeType === 'component'}
                      onChange={() => setEncodeType('component')}
                      className="w-4 h-4 text-green-600"
                    />
                    <span className="ml-2">
                      <span className="font-semibold">Component</span>
                      <span className="text-sm text-gray-600 block">Encode all special characters (recommended for query parameters)</span>
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={encodeType === 'full'}
                      onChange={() => setEncodeType('full')}
                      className="w-4 h-4 text-green-600"
                    />
                    <span className="ml-2">
                      <span className="font-semibold">Full URI</span>
                      <span className="text-sm text-gray-600 block">Preserve URL structure (:, /, ?, #)</span>
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Input Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {mode === 'encode' ? 'Text/URL to Encode' : 'Encoded URL to Decode'}
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'encode' 
                  ? 'Enter text or URL to encode...\nExample: https://example.com/search?q=hello world' 
                  : 'Enter percent-encoded URL to decode...\nExample: https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world'}
                className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm resize-none"
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
                  onClick={() => loadExample('url')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                >
                  Full URL
                </button>
                <button
                  onClick={() => loadExample('query')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                >
                  Query String
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
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={processURL}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-lg"
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
                    {mode === 'encode' ? 'Encoded URL' : 'Decoded Text'}
                  </label>
                  <textarea
                    value={output}
                    readOnly
                    className="w-full h-40 p-4 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm resize-none"
                  />
                  <div className="mt-2 text-sm text-gray-600">
                    {output.length} characters
                  </div>
                </div>

                {/* Output Actions */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <button
                    onClick={() => copyToClipboard(output)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
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
                  <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
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
                            <div className="text-sm text-gray-600">Encoded Characters</div>
                            <div className="text-xl font-bold text-gray-900">{stats.encodedChars}</div>
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
                            <div className="text-sm text-gray-600">Encoded Characters</div>
                            <div className="text-xl font-bold text-gray-900">{stats.encodedChars}</div>
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
              About URL Encoding
            </h2>
            
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">
                URL encoding (also called percent-encoding) converts characters into a format that can be safely 
                transmitted over the internet. Special characters are replaced with a percent sign (%) followed 
                by two hexadecimal digits representing the character's ASCII code.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Why URL Encoding is Necessary
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🌐 Safe Transmission</h4>
                  <p className="text-sm">
                    URLs can only contain ASCII characters. Special characters must be encoded for safe transmission
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🔗 Reserved Characters</h4>
                  <p className="text-sm">
                    Characters like ?, &, =, # have special meanings in URLs and must be encoded in data
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🌍 Unicode Support</h4>
                  <p className="text-sm">
                    Enables use of international characters and emojis in URLs through UTF-8 encoding
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">📝 Query Parameters</h4>
                  <p className="text-sm">
                    Safely pass complex data, spaces, and special characters in query strings
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Common Encoded Characters
              </h3>
              
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border border-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Character</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Encoded</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Usage</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono">Space</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">%20 or +</td>
                      <td className="border border-gray-200 px-4 py-2">Most commonly encoded character</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono">!</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">%21</td>
                      <td className="border border-gray-200 px-4 py-2">Exclamation mark</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono">#</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">%23</td>
                      <td className="border border-gray-200 px-4 py-2">Hash (fragment identifier)</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono">$</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">%24</td>
                      <td className="border border-gray-200 px-4 py-2">Dollar sign</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono">%</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">%25</td>
                      <td className="border border-gray-200 px-4 py-2">Percent (encoding prefix)</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono">&</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">%26</td>
                      <td className="border border-gray-200 px-4 py-2">Ampersand (parameter separator)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono">+</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">%2B</td>
                      <td className="border border-gray-200 px-4 py-2">Plus sign</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono">=</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">%3D</td>
                      <td className="border border-gray-200 px-4 py-2">Equals (key-value separator)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono">?</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">%3F</td>
                      <td className="border border-gray-200 px-4 py-2">Question mark (query start)</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono">@</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">%40</td>
                      <td className="border border-gray-200 px-4 py-2">At symbol</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                encodeURIComponent vs encodeURI
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">encodeURIComponent</h4>
                  <p className="text-sm mb-3">
                    <strong>Use for:</strong> Query parameters, form data, individual URL parts
                  </p>
                  <p className="text-sm mb-3">
                    <strong>Encodes:</strong> All special characters including :, /, ?, #, &, =
                  </p>
                  <div className="bg-gray-50 p-2 rounded text-xs font-mono">
                    encodeURIComponent('a=b&c=d')<br/>
                    → a%3Db%26c%3Dd
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">encodeURI</h4>
                  <p className="text-sm mb-3">
                    <strong>Use for:</strong> Complete URLs that should remain valid
                  </p>
                  <p className="text-sm mb-3">
                    <strong>Preserves:</strong> URL structure characters :, /, ?, #, &
                  </p>
                  <div className="bg-gray-50 p-2 rounded text-xs font-mono">
                    encodeURI('https://example.com/a b')<br/>
                    → https://example.com/a%20b
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Common Use Cases
              </h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>Search Queries:</strong> Encode user input in search parameters (e.g., ?q=hello%20world)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>Form Submissions:</strong> Safely transmit form data with special characters</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>API Requests:</strong> Pass parameters to REST APIs correctly</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>Email Links:</strong> Create mailto: links with encoded subjects and bodies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>Social Sharing:</strong> Encode URLs for social media share buttons</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>Redirect URLs:</strong> Pass destination URLs as parameters</span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Reserved vs Unreserved Characters
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">✓ Unreserved (Safe)</h4>
                  <p className="text-sm mb-2">Never need encoding:</p>
                  <ul className="text-sm space-y-1">
                    <li>• Letters: A-Z, a-z</li>
                    <li>• Digits: 0-9</li>
                    <li>• Special: - _ . ~</li>
                  </ul>
                </div>
                <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-2">✗ Reserved (Must Encode)</h4>
                  <p className="text-sm mb-2">Need encoding in data:</p>
                  <ul className="text-sm space-y-1">
                    <li>• Delimiters: : / ? # [ ] @</li>
                    <li>• Sub-delimiters: ! $ & ' ( ) * + , ; =</li>
                    <li>• Others: % space " &lt; &gt;</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Frequently Asked Questions
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What's the difference between %20 and + for spaces?</h4>
                  <p>
                    Both represent spaces, but %20 is the standard URL encoding. The + is specific to 
                    application/x-www-form-urlencoded format (HTML forms). Use %20 for general URLs.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Do I need to encode the entire URL?</h4>
                  <p>
                    No, only encode the parts that contain user data or special characters. Don't encode 
                    the protocol (https://), domain, or URL structure. Use encodeURIComponent for parameters 
                    and encodeURI for complete URLs.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Can I encode emojis and international characters?</h4>
                  <p>
                    Yes! URL encoding supports UTF-8, so any Unicode character can be encoded. Each character 
                    may result in multiple %XX sequences. Example: 😀 becomes %F0%9F%98%80
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Is URL encoding the same as HTML encoding?</h4>
                  <p>
                    No, they're different. URL encoding uses %XX format for URLs. HTML encoding uses &amp;name; 
                    or &amp;#number; for HTML content. Use the right encoding for the right context.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Should I encode already-encoded URLs?</h4>
                  <p>
                    Be careful with double-encoding! Check if a URL is already encoded before encoding it again. 
                    Double-encoding turns %20 into %2520, which won't decode correctly.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Are hyphens and underscores safe in URLs?</h4>
                  <p>
                    Yes, hyphens (-), underscores (_), periods (.), and tildes (~) are unreserved characters 
                    that never need encoding. They're safe to use anywhere in URLs.
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
