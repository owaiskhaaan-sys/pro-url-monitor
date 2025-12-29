import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function Base64EncoderDecoder() {
  const [mode, setMode] = useState('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);

  const processBase64 = () => {
    if (!input.trim()) {
      setError('Please enter some text to process');
      setOutput('');
      setStats(null);
      return;
    }

    try {
      setError('');
      let result = '';
      
      if (mode === 'encode') {
        // Encode to Base64
        result = btoa(unescape(encodeURIComponent(input)));
        
        setStats({
          originalLength: input.length,
          encodedLength: result.length,
          sizeIncrease: ((result.length - input.length) / input.length * 100).toFixed(2),
          originalBytes: new Blob([input]).size,
          encodedBytes: new Blob([result]).size
        });
      } else {
        // Decode from Base64
        result = decodeURIComponent(escape(atob(input)));
        
        setStats({
          encodedLength: input.length,
          decodedLength: result.length,
          sizeDecrease: ((input.length - result.length) / input.length * 100).toFixed(2),
          encodedBytes: new Blob([input]).size,
          decodedBytes: new Blob([result]).size
        });
      }
      
      setOutput(result);
    } catch (err) {
      setError(mode === 'encode' 
        ? 'Failed to encode: Invalid input characters' 
        : 'Failed to decode: Invalid Base64 string');
      setOutput('');
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

  const downloadFile = (content, filename) => {
    if (!content) {
      alert('Nothing to download');
      return;
    }
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setInput(event.target.result);
    };
    reader.readAsText(file);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
    setStats(null);
  };

  const loadExample = () => {
    if (mode === 'encode') {
      setInput('Hello, World! This is a Base64 encoding example with special characters: @#$%^&*()');
    } else {
      setInput('SGVsbG8sIFdvcmxkISBUaGlzIGlzIGEgQmFzZTY0IGVuY29kaW5nIGV4YW1wbGUgd2l0aCBzcGVjaWFsIGNoYXJhY3RlcnM6IEAjJCVeJiooKQ==');
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Layout
      title="Base64 Encoder/Decoder - Convert Text to Base64 Online"
      description="Free online Base64 encoder and decoder. Convert text to Base64 encoding or decode Base64 strings back to text. Supports UTF-8, Unicode, and special characters."
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Base64 Encoder/Decoder
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Convert text to Base64 encoding or decode Base64 strings. Perfect for data transmission, embedding images, and API authentication.
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
                    setError('');
                    setStats(null);
                  }}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
                    mode === 'encode'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Encode to Base64
                </button>
                <button
                  onClick={() => {
                    setMode('decode');
                    setInput('');
                    setOutput('');
                    setError('');
                    setStats(null);
                  }}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
                    mode === 'decode'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Decode from Base64
                </button>
              </div>
            </div>

            {/* Input Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {mode === 'encode' ? 'Text to Encode' : 'Base64 String to Decode'}
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'encode' 
                  ? 'Enter text to encode to Base64...' 
                  : 'Enter Base64 string to decode...'}
                className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
              />
              <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                <span>{input.length} characters</span>
                <div className="flex gap-2">
                  <label className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
                    📁 Upload File
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept=".txt"
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={processBase64}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-lg"
              >
                {mode === 'encode' ? 'Encode' : 'Decode'}
              </button>
              <button
                onClick={loadExample}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
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

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="font-semibold text-red-800 mb-1">Error</div>
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            {/* Output Section */}
            {output && !error && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {mode === 'encode' ? 'Encoded Base64' : 'Decoded Text'}
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
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    Copy Output
                  </button>
                  <button
                    onClick={() => downloadFile(output, mode === 'encode' ? 'encoded.txt' : 'decoded.txt')}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
                  >
                    Download Output
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
                  <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
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
                            <div className="text-sm text-gray-600">Size Increase</div>
                            <div className="text-xl font-bold text-gray-900">{stats.sizeIncrease}%</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Encoded Size</div>
                            <div className="text-xl font-bold text-gray-900">{formatBytes(stats.encodedBytes)}</div>
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
                            <div className="text-sm text-gray-600">Size Decrease</div>
                            <div className="text-xl font-bold text-gray-900">{stats.sizeDecrease}%</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Decoded Size</div>
                            <div className="text-xl font-bold text-gray-900">{formatBytes(stats.decodedBytes)}</div>
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
              About Base64 Encoding
            </h2>
            
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">
                Base64 is a binary-to-text encoding scheme that converts binary data into ASCII text format. 
                It uses 64 different ASCII characters (A-Z, a-z, 0-9, +, /) to represent data, making it safe 
                for transmission over text-based protocols and storage in text-based formats.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Why Use Base64?
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">📧 Email Attachments</h4>
                  <p className="text-sm">
                    Encode binary files for safe transmission through SMTP and other email protocols
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🖼️ Data URIs</h4>
                  <p className="text-sm">
                    Embed images directly in HTML/CSS using data:image/png;base64,... format
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🔐 API Authentication</h4>
                  <p className="text-sm">
                    Encode credentials for HTTP Basic Authentication headers
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">📝 JSON Data</h4>
                  <p className="text-sm">
                    Store binary data in JSON format without special character issues
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                How Base64 Works
              </h3>
              <p className="mb-4">
                Base64 encoding works by taking binary data and converting it into groups of 6 bits. 
                Each 6-bit group is then mapped to one of 64 ASCII characters. Three bytes (24 bits) 
                of binary data are converted into four Base64 characters.
              </p>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Encoding Example</h4>
                <div className="font-mono text-sm space-y-2">
                  <div><span className="text-gray-600">Text:</span> <span className="font-bold">Hello</span></div>
                  <div><span className="text-gray-600">Binary:</span> 01001000 01100101 01101100 01101100 01101111</div>
                  <div><span className="text-gray-600">Base64:</span> <span className="font-bold">SGVsbG8=</span></div>
                  <div className="text-xs text-gray-600 mt-2">
                    Each Base64 character represents 6 bits of data. Padding (=) is added when needed.
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Base64 Character Set
              </h3>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border border-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Range</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Characters</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono">0-25</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">A-Z</td>
                      <td className="border border-gray-200 px-4 py-2">Uppercase letters</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono">26-51</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">a-z</td>
                      <td className="border border-gray-200 px-4 py-2">Lowercase letters</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono">52-61</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">0-9</td>
                      <td className="border border-gray-200 px-4 py-2">Digits</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono">62</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">+</td>
                      <td className="border border-gray-200 px-4 py-2">Plus sign</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono">63</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">/</td>
                      <td className="border border-gray-200 px-4 py-2">Forward slash</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono">Padding</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">=</td>
                      <td className="border border-gray-200 px-4 py-2">Used for padding when needed</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Common Use Cases
              </h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span><strong>Image Embedding:</strong> Convert images to Base64 for inline HTML/CSS usage</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span><strong>HTTP Headers:</strong> Encode credentials for Basic Authentication</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span><strong>JWT Tokens:</strong> JSON Web Tokens use Base64 URL encoding</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span><strong>File Uploads:</strong> Send files through JSON APIs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span><strong>URL Parameters:</strong> Encode complex data in query strings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span><strong>Email MIME:</strong> Encode attachments in MIME format</span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Advantages & Disadvantages
              </h3>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-green-700 mb-3">✓ Advantages</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Safe for text protocols (HTTP, SMTP, JSON)</li>
                    <li>• Reversible encoding/decoding</li>
                    <li>• Wide browser and language support</li>
                    <li>• Handles binary data reliably</li>
                    <li>• No special character issues</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-700 mb-3">✗ Disadvantages</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Increases data size by ~33%</li>
                    <li>• Not encryption (data is visible)</li>
                    <li>• Slightly slower processing</li>
                    <li>• Not suitable for large files</li>
                    <li>• Can't be indexed/searched</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Frequently Asked Questions
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Is Base64 encryption?</h4>
                  <p>
                    No, Base64 is encoding, not encryption. It's easily reversible and provides no security. 
                    Use encryption algorithms (AES, RSA) for security, not Base64.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Why does Base64 increase file size?</h4>
                  <p>
                    Base64 converts 3 bytes (24 bits) into 4 characters, increasing size by approximately 33%. 
                    This overhead is the cost of representing binary data as safe ASCII text.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What is the = padding for?</h4>
                  <p>
                    The = character is used for padding when the input length isn't divisible by 3. It ensures 
                    the encoded string length is always divisible by 4.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Can I encode images to Base64?</h4>
                  <p>
                    Yes, but this tool is for text. For images, use image-to-Base64 converters that read 
                    binary files. The output can be used in data URIs: data:image/png;base64,...
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Is Base64 safe for URLs?</h4>
                  <p>
                    Standard Base64 uses + and / which aren't URL-safe. Base64 URL encoding replaces + with - 
                    and / with _ for safe use in URLs. Remove padding = when using in URLs.
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
