import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function SHA256Generator() {
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('');
  const [format, setFormat] = useState('hex'); // hex, base64

  // SHA-256 implementation
  const sha256 = (message) => {
    // Helper functions
    const rightRotate = (value, amount) => {
      return (value >>> amount) | (value << (32 - amount));
    };

    // Initialize hash values (first 32 bits of the fractional parts of the square roots of the first 8 primes)
    const h = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];

    // Initialize array of round constants (first 32 bits of the fractional parts of the cube roots of the first 64 primes)
    const k = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    // Convert string to UTF-8 bytes
    const utf8Encode = (str) => {
      return unescape(encodeURIComponent(str));
    };

    message = utf8Encode(message);

    // Convert message to array of bytes
    const msgBytes = [];
    for (let i = 0; i < message.length; i++) {
      msgBytes.push(message.charCodeAt(i));
    }

    // Pre-processing: add padding bits
    const msgLen = msgBytes.length;
    const bitLen = msgLen * 8;

    // Append the '1' bit (plus zero padding)
    msgBytes.push(0x80);

    // Append 0 ≤ k < 512 bits '0', such that the resulting message length in bits is congruent to 448 (mod 512)
    while ((msgBytes.length % 64) !== 56) {
      msgBytes.push(0x00);
    }

    // Append length of message (before pre-processing), in bits, as 64-bit big-endian integer
    for (let i = 7; i >= 0; i--) {
      msgBytes.push((bitLen >>> (i * 8)) & 0xff);
    }

    // Process the message in successive 512-bit chunks
    const chunks = [];
    for (let i = 0; i < msgBytes.length; i += 64) {
      chunks.push(msgBytes.slice(i, i + 64));
    }

    // Process each chunk
    for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
      const chunk = chunks[chunkIndex];

      // Create a 64-entry message schedule array w[0..63] of 32-bit words
      const w = new Array(64);

      // Copy chunk into first 16 words of the message schedule array
      for (let i = 0; i < 16; i++) {
        w[i] = (chunk[i * 4] << 24) |
               (chunk[i * 4 + 1] << 16) |
               (chunk[i * 4 + 2] << 8) |
               (chunk[i * 4 + 3]);
      }

      // Extend the first 16 words into the remaining 48 words of the message schedule array
      for (let i = 16; i < 64; i++) {
        const s0 = rightRotate(w[i - 15], 7) ^ rightRotate(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        const s1 = rightRotate(w[i - 2], 17) ^ rightRotate(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
      }

      // Initialize working variables
      let a = h[0];
      let b = h[1];
      let c = h[2];
      let d = h[3];
      let e = h[4];
      let f = h[5];
      let g = h[6];
      let hh = h[7];

      // Compression function main loop
      for (let i = 0; i < 64; i++) {
        const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
        const ch = (e & f) ^ ((~e) & g);
        const temp1 = (hh + S1 + ch + k[i] + w[i]) >>> 0;
        const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const temp2 = (S0 + maj) >>> 0;

        hh = g;
        g = f;
        f = e;
        e = (d + temp1) >>> 0;
        d = c;
        c = b;
        b = a;
        a = (temp1 + temp2) >>> 0;
      }

      // Add the compressed chunk to the current hash value
      h[0] = (h[0] + a) >>> 0;
      h[1] = (h[1] + b) >>> 0;
      h[2] = (h[2] + c) >>> 0;
      h[3] = (h[3] + d) >>> 0;
      h[4] = (h[4] + e) >>> 0;
      h[5] = (h[5] + f) >>> 0;
      h[6] = (h[6] + g) >>> 0;
      h[7] = (h[7] + hh) >>> 0;
    }

    // Produce the final hash value (big-endian)
    const hashArray = [];
    for (let i = 0; i < h.length; i++) {
      hashArray.push((h[i] >>> 24) & 0xff);
      hashArray.push((h[i] >>> 16) & 0xff);
      hashArray.push((h[i] >>> 8) & 0xff);
      hashArray.push(h[i] & 0xff);
    }

    // Convert to hex string
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const hexToBase64 = (hex) => {
    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) {
      bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    return btoa(String.fromCharCode.apply(null, bytes));
  };

  const generateHash = () => {
    if (!input.trim()) {
      setHash('');
      return;
    }

    const hexHash = sha256(input);
    
    if (format === 'hex') {
      setHash(hexHash);
    } else {
      setHash(hexToBase64(hexHash));
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
    setHash('');
  };

  const loadExample = (type) => {
    const examples = {
      text: 'Hello, World!',
      password: 'MySecurePassword123',
      email: 'user@example.com',
      url: 'https://www.example.com/page'
    };
    setInput(examples[type]);
  };

  return (
    <Layout>
      <Head>
        <title>SHA256 Hash Generator - Generate SHA256 Checksums</title>
        <meta name="description" content="Generate SHA256 hash checksums for secure encryption. Free SHA256 generator tool to create cryptographic hashes for passwords, files, and data verification." />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/sha256-generator" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              SHA-256 Hash Generator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Generate cryptographically secure SHA-256 hashes from any text. Ideal for digital signatures, SSL certificates, and blockchain applications.
            </p>
          </div>

          {/* Tool Interface */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            {/* Input Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Text to Hash
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to generate SHA-256 hash..."
                className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-mono text-sm resize-none"
              />
              <div className="mt-2 text-sm text-gray-600">
                {input.length} characters
              </div>
            </div>

            {/* Format Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Output Format
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={format === 'hex'}
                    onChange={() => setFormat('hex')}
                    className="w-4 h-4 text-cyan-600"
                  />
                  <span className="ml-2">
                    <span className="font-semibold">Hexadecimal</span>
                    <span className="text-sm text-gray-600 block">64 character hex string (default)</span>
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={format === 'base64'}
                    onChange={() => setFormat('base64')}
                    className="w-4 h-4 text-cyan-600"
                  />
                  <span className="ml-2">
                    <span className="font-semibold">Base64</span>
                    <span className="text-sm text-gray-600 block">44 character base64 string</span>
                  </span>
                </label>
              </div>
            </div>

            {/* Example Buttons */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Load Example
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <button
                  onClick={() => loadExample('text')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                >
                  Simple Text
                </button>
                <button
                  onClick={() => loadExample('password')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                >
                  Password
                </button>
                <button
                  onClick={() => loadExample('email')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                >
                  Email
                </button>
                <button
                  onClick={() => loadExample('url')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                >
                  URL
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={generateHash}
                className="px-8 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition font-medium shadow-lg"
              >
                Generate SHA-256 Hash
              </button>
              <button
                onClick={clearAll}
                className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Clear All
              </button>
            </div>

            {/* Output Section */}
            {hash && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    SHA-256 Hash ({format === 'hex' ? 'Hexadecimal' : 'Base64'})
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={hash}
                      readOnly
                      className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm pr-24"
                    />
                    <button
                      onClick={() => copyToClipboard(hash)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition text-sm font-medium"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    {hash.length} characters
                  </div>
                </div>

                {/* Hash Info */}
                <div className="p-6 bg-cyan-50 border border-cyan-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hash Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Algorithm</div>
                      <div className="text-xl font-bold text-gray-900">SHA-256</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Output Length</div>
                      <div className="text-xl font-bold text-gray-900">256 bits</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Format</div>
                      <div className="text-xl font-bold text-gray-900">{format === 'hex' ? 'Hex (64 chars)' : 'Base64 (44 chars)'}</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Information Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              About SHA-256 Hash Algorithm
            </h2>
            
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">
                SHA-256 (Secure Hash Algorithm 256-bit) is a cryptographic hash function that produces a 
                256-bit (32-byte) hash value. It's part of the SHA-2 family and is widely used for security 
                applications including SSL/TLS, digital signatures, and blockchain technology.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Key Features
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🔒 Cryptographically Secure</h4>
                  <p className="text-sm">
                    Widely trusted for security-critical applications, no known practical attacks
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🔢 256-bit Output</h4>
                  <p className="text-sm">
                    Produces 256-bit hash, twice the length of SHA-1 for enhanced security
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">⚡ Collision Resistant</h4>
                  <p className="text-sm">
                    Extremely difficult to find two inputs that produce the same hash
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🎯 Deterministic</h4>
                  <p className="text-sm">
                    Same input always produces identical hash output
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Common Use Cases
              </h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-2">✓</span>
                  <span><strong>Digital Signatures:</strong> Sign documents and verify authenticity in PKI systems</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-2">✓</span>
                  <span><strong>SSL/TLS Certificates:</strong> Secure HTTPS connections and website authentication</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-2">✓</span>
                  <span><strong>Blockchain:</strong> Bitcoin and other cryptocurrencies use SHA-256 for mining</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-2">✓</span>
                  <span><strong>Password Storage:</strong> Hash passwords with salt (though bcrypt/Argon2 preferred)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-2">✓</span>
                  <span><strong>Data Integrity:</strong> Verify files haven't been tampered with during transfer</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-2">✓</span>
                  <span><strong>Git Commits:</strong> Git uses SHA-256 (in newer versions) for commit hashes</span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                SHA-256 Properties
              </h3>
              
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border border-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Property</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Value</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2">Hash Length</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">256 bits</td>
                      <td className="border border-gray-200 px-4 py-2">32 bytes or 64 hex characters</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2">Output Format</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">Hex/Base64</td>
                      <td className="border border-gray-200 px-4 py-2">Typically shown as hexadecimal</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2">Block Size</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">512 bits</td>
                      <td className="border border-gray-200 px-4 py-2">Internal processing block size</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2">Rounds</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">64 rounds</td>
                      <td className="border border-gray-200 px-4 py-2">More rounds than SHA-1 for security</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2">Security</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">Strong</td>
                      <td className="border border-gray-200 px-4 py-2">No known practical attacks</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2">Standard</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">FIPS 180-4</td>
                      <td className="border border-gray-200 px-4 py-2">Federal standard, widely adopted</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Example SHA-256 Hashes
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Input: <span className="font-mono font-semibold">Hello, World!</span></div>
                  <div className="text-xs font-mono text-gray-900 break-all">dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Input: <span className="font-mono font-semibold">hello, world!</span></div>
                  <div className="text-xs font-mono text-gray-900 break-all">7509e5bda0c762d2bac7f90d758b5b2263fa01ccbc542ab5e3df163be08e6ca9</div>
                  <div className="text-xs text-gray-600 mt-1">Notice: Different case produces completely different hash</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Input: <span className="font-mono font-semibold">(empty string)</span></div>
                  <div className="text-xs font-mono text-gray-900 break-all">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Security & Advantages
              </h3>
              
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-semibold text-green-800 mb-2">Cryptographically Secure</h4>
                    <p className="text-sm text-green-700 mb-2">
                      SHA-256 is <strong>recommended</strong> for security-critical applications. It's trusted 
                      by governments, financial institutions, and security experts worldwide.
                    </p>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• ✓ Use for digital signatures and certificates</li>
                      <li>• ✓ Use for blockchain and cryptocurrency</li>
                      <li>• ✓ Use for SSL/TLS and HTTPS</li>
                      <li>• ✓ Use for secure data integrity checks</li>
                      <li>• ✓ No known collision attacks</li>
                      <li>• ✓ Resistant to pre-image attacks</li>
                    </ul>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                SHA-256 vs Other Hash Functions
              </h3>
              
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border border-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Algorithm</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Hash Size</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Speed</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Security</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Use Case</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono">MD5</td>
                      <td className="border border-gray-200 px-4 py-2">128 bit</td>
                      <td className="border border-gray-200 px-4 py-2">Very Fast</td>
                      <td className="border border-gray-200 px-4 py-2 text-red-600">Broken</td>
                      <td className="border border-gray-200 px-4 py-2">Checksums only</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono">SHA-1</td>
                      <td className="border border-gray-200 px-4 py-2">160 bit</td>
                      <td className="border border-gray-200 px-4 py-2">Fast</td>
                      <td className="border border-gray-200 px-4 py-2 text-orange-600">Deprecated</td>
                      <td className="border border-gray-200 px-4 py-2">Legacy only</td>
                    </tr>
                    <tr className="bg-cyan-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono font-bold">SHA-256</td>
                      <td className="border border-gray-200 px-4 py-2 font-bold">256 bit</td>
                      <td className="border border-gray-200 px-4 py-2 font-bold">Fast</td>
                      <td className="border border-gray-200 px-4 py-2 text-green-600 font-bold">Secure ✓</td>
                      <td className="border border-gray-200 px-4 py-2 font-bold">Security applications</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono">SHA-512</td>
                      <td className="border border-gray-200 px-4 py-2">512 bit</td>
                      <td className="border border-gray-200 px-4 py-2">Moderate</td>
                      <td className="border border-gray-200 px-4 py-2 text-green-600">Very Secure</td>
                      <td className="border border-gray-200 px-4 py-2">High security</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono">SHA-3</td>
                      <td className="border border-gray-200 px-4 py-2">Variable</td>
                      <td className="border border-gray-200 px-4 py-2">Moderate</td>
                      <td className="border border-gray-200 px-4 py-2 text-green-600">Secure</td>
                      <td className="border border-gray-200 px-4 py-2">Future standard</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Real-World Applications
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="border border-cyan-200 bg-cyan-50 rounded-lg p-4">
                  <h4 className="font-semibold text-cyan-900 mb-2">🔗 Bitcoin Mining</h4>
                  <p className="text-sm text-cyan-800">
                    Bitcoin uses SHA-256 twice (double SHA-256) for proof-of-work mining and transaction hashing
                  </p>
                </div>
                <div className="border border-cyan-200 bg-cyan-50 rounded-lg p-4">
                  <h4 className="font-semibold text-cyan-900 mb-2">🔐 SSL/TLS</h4>
                  <p className="text-sm text-cyan-800">
                    HTTPS connections use SHA-256 for certificate signatures and secure handshake verification
                  </p>
                </div>
                <div className="border border-cyan-200 bg-cyan-50 rounded-lg p-4">
                  <h4 className="font-semibold text-cyan-900 mb-2">📝 Git Commits</h4>
                  <p className="text-sm text-cyan-800">
                    Git version control uses SHA-256 (in Git 2.29+) for commit identification and integrity
                  </p>
                </div>
                <div className="border border-cyan-200 bg-cyan-50 rounded-lg p-4">
                  <h4 className="font-semibold text-cyan-900 mb-2">✍️ Digital Signatures</h4>
                  <p className="text-sm text-cyan-800">
                    RSA and ECDSA signatures use SHA-256 for document signing and authentication systems
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Frequently Asked Questions
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Is SHA-256 reversible?</h4>
                  <p>
                    No, SHA-256 is a one-way cryptographic hash function and cannot be reversed or decrypted. 
                    The only way to find the original input is through brute-force, which is computationally 
                    infeasible for strong inputs.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">How secure is SHA-256?</h4>
                  <p>
                    SHA-256 is considered cryptographically secure. There are no known practical attacks that 
                    can break it. To brute-force a SHA-256 hash would require 2^256 operations, which is 
                    astronomically large and infeasible with current technology.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Should I use SHA-256 for passwords?</h4>
                  <p>
                    SHA-256 alone is not ideal for passwords because it's too fast. Use specialized password 
                    hashing algorithms like bcrypt, Argon2, or scrypt that include salting and adjustable 
                    work factors. However, SHA-256 with proper salting is better than MD5 or no hashing.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What's the difference between SHA-256 and SHA-512?</h4>
                  <p>
                    SHA-512 produces a 512-bit (64-byte) hash, twice the size of SHA-256. Both are secure, 
                    but SHA-512 is slightly slower and provides a larger hash space. SHA-256 is more commonly 
                    used due to its good balance of security and performance.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Can two different inputs produce the same SHA-256 hash?</h4>
                  <p>
                    Theoretically yes (collision), but finding such a collision is practically impossible. 
                    The probability is so infinitesimally small (1 in 2^256) that it's considered computationally 
                    infeasible. No SHA-256 collisions have been found to date.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Is SHA-256 quantum resistant?</h4>
                  <p>
                    SHA-256 provides some resistance to quantum computers. While Grover's algorithm could 
                    theoretically reduce the search space to 2^128 (still very large), SHA-256 is expected to 
                    remain secure for the foreseeable future. SHA-512 offers even more quantum resistance.
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
