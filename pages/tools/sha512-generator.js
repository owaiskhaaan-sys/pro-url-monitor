import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function SHA512Generator() {
  const [text, setText] = useState('');
  const [hash, setHash] = useState('');
  const [format, setFormat] = useState('hex');

  // SHA-512 implementation
  const sha512 = (str) => {
    // Convert string to UTF-8 bytes
    const utf8Encode = (s) => {
      return unescape(encodeURIComponent(s));
    };

    const message = utf8Encode(str);
    const messageLength = message.length;

    // Initialize hash values (first 64 bits of the fractional parts of the square roots of the first 8 primes 2..19)
    let H = [
      0x6a09e667f3bcc908n, 0xbb67ae8584caa73bn, 0x3c6ef372fe94f82bn, 0xa54ff53a5f1d36f1n,
      0x510e527fade682d1n, 0x9b05688c2b3e6c1fn, 0x1f83d9abfb41bd6bn, 0x5be0cd19137e2179n
    ];

    // Round constants (first 64 bits of the fractional parts of the cube roots of the first 80 primes 2..409)
    const K = [
      0x428a2f98d728ae22n, 0x7137449123ef65cdn, 0xb5c0fbcfec4d3b2fn, 0xe9b5dba58189dbbcn,
      0x3956c25bf348b538n, 0x59f111f1b605d019n, 0x923f82a4af194f9bn, 0xab1c5ed5da6d8118n,
      0xd807aa98a3030242n, 0x12835b0145706fben, 0x243185be4ee4b28cn, 0x550c7dc3d5ffb4e2n,
      0x72be5d74f27b896fn, 0x80deb1fe3b1696b1n, 0x9bdc06a725c71235n, 0xc19bf174cf692694n,
      0xe49b69c19ef14ad2n, 0xefbe4786384f25e3n, 0x0fc19dc68b8cd5b5n, 0x240ca1cc77ac9c65n,
      0x2de92c6f592b0275n, 0x4a7484aa6ea6e483n, 0x5cb0a9dcbd41fbd4n, 0x76f988da831153b5n,
      0x983e5152ee66dfabn, 0xa831c66d2db43210n, 0xb00327c898fb213fn, 0xbf597fc7beef0ee4n,
      0xc6e00bf33da88fc2n, 0xd5a79147930aa725n, 0x06ca6351e003826fn, 0x142929670a0e6e70n,
      0x27b70a8546d22ffcn, 0x2e1b21385c26c926n, 0x4d2c6dfc5ac42aedn, 0x53380d139d95b3dfn,
      0x650a73548baf63den, 0x766a0abb3c77b2a8n, 0x81c2c92e47edaee6n, 0x92722c851482353bn,
      0xa2bfe8a14cf10364n, 0xa81a664bbc423001n, 0xc24b8b70d0f89791n, 0xc76c51a30654be30n,
      0xd192e819d6ef5218n, 0xd69906245565a910n, 0xf40e35855771202an, 0x106aa07032bbd1b8n,
      0x19a4c116b8d2d0c8n, 0x1e376c085141ab53n, 0x2748774cdf8eeb99n, 0x34b0bcb5e19b48a8n,
      0x391c0cb3c5c95a63n, 0x4ed8aa4ae3418acbn, 0x5b9cca4f7763e373n, 0x682e6ff3d6b2b8a3n,
      0x748f82ee5defb2fcn, 0x78a5636f43172f60n, 0x84c87814a1f0ab72n, 0x8cc702081a6439ecn,
      0x90befffa23631e28n, 0xa4506cebde82bde9n, 0xbef9a3f7b2c67915n, 0xc67178f2e372532bn,
      0xca273eceea26619cn, 0xd186b8c721c0c207n, 0xeada7dd6cde0eb1en, 0xf57d4f7fee6ed178n,
      0x06f067aa72176fban, 0x0a637dc5a2c898a6n, 0x113f9804bef90daen, 0x1b710b35131c471bn,
      0x28db77f523047d84n, 0x32caab7b40c72493n, 0x3c9ebe0a15c9bebcn, 0x431d67c49c100d4cn,
      0x4cc5d4becb3e42b6n, 0x597f299cfc657e2an, 0x5fcb6fab3ad6faecn, 0x6c44198c4a475817n
    ];

    // Pre-processing: adding padding bits
    const msgBytes = [];
    for (let i = 0; i < messageLength; i++) {
      msgBytes.push(message.charCodeAt(i));
    }

    // Append the '1' bit (plus zero padding)
    msgBytes.push(0x80);

    // Append zeros until message length ≡ 896 (mod 1024)
    const targetLength = Math.ceil((messageLength + 17) / 128) * 128;
    while (msgBytes.length < targetLength - 16) {
      msgBytes.push(0x00);
    }

    // Append length of message (before pre-processing), in bits, as 128-bit big-endian integer
    const bitLength = BigInt(messageLength * 8);
    // High 64 bits (will be 0 for reasonable message sizes)
    for (let i = 56; i >= 0; i -= 8) {
      msgBytes.push(0);
    }
    // Low 64 bits
    for (let i = 56; i >= 0; i -= 8) {
      msgBytes.push(Number((bitLength >> BigInt(i)) & 0xFFn));
    }

    // Process the message in successive 1024-bit chunks
    for (let chunk = 0; chunk < msgBytes.length; chunk += 128) {
      // Break chunk into sixteen 64-bit big-endian words
      const w = new Array(80);
      for (let i = 0; i < 16; i++) {
        w[i] = 0n;
        for (let j = 0; j < 8; j++) {
          w[i] = (w[i] << 8n) | BigInt(msgBytes[chunk + i * 8 + j]);
        }
      }

      // Extend the sixteen 64-bit words into eighty 64-bit words
      for (let i = 16; i < 80; i++) {
        const s0 = rightRotate(w[i - 15], 1n) ^ rightRotate(w[i - 15], 8n) ^ (w[i - 15] >> 7n);
        const s1 = rightRotate(w[i - 2], 19n) ^ rightRotate(w[i - 2], 61n) ^ (w[i - 2] >> 6n);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) & 0xFFFFFFFFFFFFFFFFn;
      }

      // Initialize working variables
      let a = H[0], b = H[1], c = H[2], d = H[3];
      let e = H[4], f = H[5], g = H[6], h = H[7];

      // Compression function main loop
      for (let i = 0; i < 80; i++) {
        const S1 = rightRotate(e, 14n) ^ rightRotate(e, 18n) ^ rightRotate(e, 41n);
        const ch = (e & f) ^ (~e & g);
        const temp1 = (h + S1 + ch + K[i] + w[i]) & 0xFFFFFFFFFFFFFFFFn;
        const S0 = rightRotate(a, 28n) ^ rightRotate(a, 34n) ^ rightRotate(a, 39n);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const temp2 = (S0 + maj) & 0xFFFFFFFFFFFFFFFFn;

        h = g;
        g = f;
        f = e;
        e = (d + temp1) & 0xFFFFFFFFFFFFFFFFn;
        d = c;
        c = b;
        b = a;
        a = (temp1 + temp2) & 0xFFFFFFFFFFFFFFFFn;
      }

      // Add the compressed chunk to the current hash value
      H[0] = (H[0] + a) & 0xFFFFFFFFFFFFFFFFn;
      H[1] = (H[1] + b) & 0xFFFFFFFFFFFFFFFFn;
      H[2] = (H[2] + c) & 0xFFFFFFFFFFFFFFFFn;
      H[3] = (H[3] + d) & 0xFFFFFFFFFFFFFFFFn;
      H[4] = (H[4] + e) & 0xFFFFFFFFFFFFFFFFn;
      H[5] = (H[5] + f) & 0xFFFFFFFFFFFFFFFFn;
      H[6] = (H[6] + g) & 0xFFFFFFFFFFFFFFFFn;
      H[7] = (H[7] + h) & 0xFFFFFFFFFFFFFFFFn;
    }

    // Produce the final hash value
    return H.map(h => {
      const hex = h.toString(16).padStart(16, '0');
      return hex;
    }).join('');
  };

  const rightRotate = (value, shift) => {
    return ((value >> shift) | (value << (64n - shift))) & 0xFFFFFFFFFFFFFFFFn;
  };

  const hexToBase64 = (hexString) => {
    const bytes = [];
    for (let i = 0; i < hexString.length; i += 2) {
      bytes.push(parseInt(hexString.substr(i, 2), 16));
    }
    return btoa(String.fromCharCode.apply(null, bytes));
  };

  const generateHash = () => {
    if (!text.trim()) {
      setHash('');
      return;
    }

    try {
      const hexHash = sha512(text);
      
      if (format === 'base64') {
        setHash(hexToBase64(hexHash));
      } else {
        setHash(hexHash);
      }
    } catch (err) {
      setHash('Error generating hash');
    }
  };

  const copyToClipboard = async () => {
    if (!hash) return;
    
    try {
      await navigator.clipboard.writeText(hash);
      alert('Hash copied to clipboard!');
    } catch (err) {
      alert('Failed to copy');
    }
  };

  const loadExample = (exampleText) => {
    setText(exampleText);
  };

  const clearAll = () => {
    setText('');
    setHash('');
  };

  const examples = [
    { label: 'Simple Text', text: 'Hello, World!' },
    { label: 'Password', text: 'MySecureP@ssw0rd!' },
    { label: 'Email', text: 'user@example.com' },
    { label: 'Unicode', text: '你好世界 🌍' }
  ];

  return (
    <Layout>
      <Head>
        <title>SHA512 Hash Generator - Generate SHA512 Checksums</title>
        <meta name="description" content="Generate SHA512 hash checksums for maximum security. Free SHA512 generator tool to create strong cryptographic hashes for sensitive data." />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              SHA-512 Hash Generator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Generate secure 512-bit SHA-512 cryptographic hashes. Perfect for high-security applications, digital signatures, and data integrity verification.
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
                placeholder="Enter text to generate SHA-512 hash..."
                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
              <div className="mt-2 text-sm text-gray-600">
                {text.length} characters
              </div>
            </div>

            {/* Format Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Output Format
              </label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="hex"
                    checked={format === 'hex'}
                    onChange={(e) => setFormat(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Hexadecimal (128 chars)</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="base64"
                    checked={format === 'base64'}
                    onChange={(e) => setFormat(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Base64 (88 chars)</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={generateHash}
                className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium shadow-lg"
              >
                Generate SHA-512
              </button>
              <button
                onClick={clearAll}
                className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Clear All
              </button>
            </div>

            {/* Example Buttons */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Quick Examples
              </label>
              <div className="flex flex-wrap gap-2">
                {examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => loadExample(example.text)}
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition text-sm font-medium"
                  >
                    {example.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hash Output */}
            {hash && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-700">
                    SHA-512 Hash ({format === 'hex' ? '128 hex characters' : '88 base64 characters'})
                  </label>
                  <button
                    onClick={copyToClipboard}
                    className="text-sm px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
                  >
                    Copy Hash
                  </button>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <code className="text-sm font-mono text-gray-900 break-all">{hash}</code>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Length: {hash.length} characters | 512 bits | 64 bytes
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="p-4 bg-green-50 border-l-4 border-green-400">
              <div className="flex">
                <span className="text-green-400 mr-3">✓</span>
                <div>
                  <h4 className="font-semibold text-green-800 mb-1">Cryptographically Secure</h4>
                  <p className="text-sm text-green-700">
                    SHA-512 is a secure cryptographic hash function suitable for security-critical applications. 
                    All processing happens in your browser - no data is sent to any server.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Information Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              About SHA-512
            </h2>
            
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">
                SHA-512 (Secure Hash Algorithm 512-bit) is a cryptographic hash function that produces a 512-bit 
                (64-byte) hash value. It's part of the SHA-2 family designed by the NSA and published by NIST 
                as a Federal Information Processing Standard (FIPS).
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Key Properties
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="border border-purple-200 bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">Hash Size</h4>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• Output: 512 bits (64 bytes)</li>
                    <li>• Hex: 128 characters</li>
                    <li>• Base64: 88 characters</li>
                    <li>• Double SHA-256 output size</li>
                  </ul>
                </div>
                <div className="border border-purple-200 bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">Performance</h4>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• Block size: 1024 bits</li>
                    <li>• 80 rounds (vs 64 in SHA-256)</li>
                    <li>• Slower than SHA-256</li>
                    <li>• Faster on 64-bit systems</li>
                  </ul>
                </div>
                <div className="border border-purple-200 bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">Security</h4>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• No known practical attacks</li>
                    <li>• Collision resistant</li>
                    <li>• Pre-image resistant</li>
                    <li>• FIPS 180-4 approved</li>
                  </ul>
                </div>
                <div className="border border-purple-200 bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">Use Cases</h4>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• High-security applications</li>
                    <li>• Digital signatures</li>
                    <li>• Certificate generation</li>
                    <li>• Blockchain systems</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                When to Use SHA-512
              </h3>
              
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                <h4 className="font-semibold text-green-800 mb-2">✓ Recommended For</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• High-security requirements (government, financial, military)</li>
                  <li>• Digital signatures and certificates</li>
                  <li>• Password hashing with proper salt (e.g., PBKDF2-SHA512)</li>
                  <li>• Blockchain and cryptocurrency applications</li>
                  <li>• Code signing and software integrity</li>
                  <li>• HMAC-SHA512 for message authentication</li>
                  <li>• 64-bit systems (performs better than SHA-256)</li>
                  <li>• Long-term security needs (future-proof)</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Consider Alternatives For</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• 32-bit systems (SHA-256 may be faster)</li>
                  <li>• Space-constrained applications (larger hash output)</li>
                  <li>• Password storage (use bcrypt, Argon2, or scrypt instead)</li>
                  <li>• High-performance needs with less security requirements</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                SHA-512 vs Other Algorithms
              </h3>
              
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border border-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Algorithm</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Hash Size</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Block Size</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Security</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Speed</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Best For</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-semibold">MD5</td>
                      <td className="border border-gray-200 px-4 py-2">128 bits</td>
                      <td className="border border-gray-200 px-4 py-2">512 bits</td>
                      <td className="border border-gray-200 px-4 py-2">❌ Broken</td>
                      <td className="border border-gray-200 px-4 py-2">Very Fast</td>
                      <td className="border border-gray-200 px-4 py-2">Checksums only</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-semibold">SHA-1</td>
                      <td className="border border-gray-200 px-4 py-2">160 bits</td>
                      <td className="border border-gray-200 px-4 py-2">512 bits</td>
                      <td className="border border-gray-200 px-4 py-2">⚠️ Deprecated</td>
                      <td className="border border-gray-200 px-4 py-2">Fast</td>
                      <td className="border border-gray-200 px-4 py-2">Legacy systems</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-semibold">SHA-256</td>
                      <td className="border border-gray-200 px-4 py-2">256 bits</td>
                      <td className="border border-gray-200 px-4 py-2">512 bits</td>
                      <td className="border border-gray-200 px-4 py-2">✓ Secure</td>
                      <td className="border border-gray-200 px-4 py-2">Fast (32-bit)</td>
                      <td className="border border-gray-200 px-4 py-2">General purpose</td>
                    </tr>
                    <tr className="bg-purple-50">
                      <td className="border border-gray-200 px-4 py-2 font-semibold">SHA-512</td>
                      <td className="border border-gray-200 px-4 py-2">512 bits</td>
                      <td className="border border-gray-200 px-4 py-2">1024 bits</td>
                      <td className="border border-gray-200 px-4 py-2">✓ Very Secure</td>
                      <td className="border border-gray-200 px-4 py-2">Fast (64-bit)</td>
                      <td className="border border-gray-200 px-4 py-2">High security</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-semibold">SHA-3</td>
                      <td className="border border-gray-200 px-4 py-2">Variable</td>
                      <td className="border border-gray-200 px-4 py-2">Variable</td>
                      <td className="border border-gray-200 px-4 py-2">✓ Secure</td>
                      <td className="border border-gray-200 px-4 py-2">Moderate</td>
                      <td className="border border-gray-200 px-4 py-2">Alternative to SHA-2</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Real-World Applications
              </h3>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2 font-bold">1.</span>
                  <div>
                    <strong className="text-gray-900">Bitcoin & Cryptocurrencies:</strong>
                    <p className="text-sm">Bitcoin uses SHA-512 in its address generation (Base58Check) and for certain cryptographic operations alongside SHA-256.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2 font-bold">2.</span>
                  <div>
                    <strong className="text-gray-900">SSL/TLS Certificates:</strong>
                    <p className="text-sm">Used in certificate generation and digital signatures for secure HTTPS connections.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2 font-bold">3.</span>
                  <div>
                    <strong className="text-gray-900">Password Storage:</strong>
                    <p className="text-sm">When combined with PBKDF2, bcrypt, or Argon2, SHA-512 provides strong password hashing.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2 font-bold">4.</span>
                  <div>
                    <strong className="text-gray-900">Code Signing:</strong>
                    <p className="text-sm">Software publishers use SHA-512 to sign applications, ensuring authenticity and integrity.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2 font-bold">5.</span>
                  <div>
                    <strong className="text-gray-900">Government & Military:</strong>
                    <p className="text-sm">Used in classified systems and high-security applications requiring long-term protection.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2 font-bold">6.</span>
                  <div>
                    <strong className="text-gray-900">HMAC Authentication:</strong>
                    <p className="text-sm">HMAC-SHA512 provides message authentication in APIs, webhooks, and secure communications.</p>
                  </div>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Security Considerations
              </h3>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <h4 className="font-semibold text-blue-800 mb-2">Quantum Computing Resistance</h4>
                <p className="text-sm text-blue-700">
                  SHA-512 offers approximately <strong>2^256 security bits</strong> against quantum computer attacks 
                  (using Grover's algorithm). This provides stronger long-term protection than SHA-256's 2^128 effective security.
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-purple-900 mb-2">SHA-512/256 Variant</h4>
                <p className="text-sm text-purple-800">
                  SHA-512/256 is a truncated version that produces 256-bit output while using SHA-512's internal structure. 
                  It provides better performance on 64-bit systems than SHA-256 while maintaining the same output size.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Frequently Asked Questions
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Is SHA-512 better than SHA-256?</h4>
                  <p>
                    SHA-512 provides stronger security (512 bits vs 256 bits) and is faster on 64-bit systems. However, 
                    both are secure for current applications. Choose SHA-512 for high-security needs or 64-bit environments, 
                    SHA-256 for general purpose or 32-bit systems.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Can SHA-512 be reversed?</h4>
                  <p>
                    No, SHA-512 is a one-way cryptographic hash function. It's computationally infeasible to reverse the 
                    hash back to the original input. The only way to find a matching input is through brute force, which 
                    would take longer than the age of the universe for strong passwords.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Should I use SHA-512 for passwords?</h4>
                  <p>
                    SHA-512 alone is too fast for password hashing. Use purpose-built password hashing algorithms like 
                    <strong> bcrypt</strong>, <strong>Argon2</strong>, or <strong>scrypt</strong>. These algorithms are 
                    intentionally slow and include built-in salting. If you must use SHA-512, combine it with PBKDF2 and 
                    a strong salt.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">How long does a SHA-512 hash take?</h4>
                  <p>
                    SHA-512 is extremely fast - typically nanoseconds to milliseconds depending on input size and hardware. 
                    On modern 64-bit processors, it can process hundreds of megabytes per second. This speed is why it's 
                    not recommended alone for password hashing (too easy to brute force).
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Are there any known vulnerabilities in SHA-512?</h4>
                  <p>
                    As of 2025, there are no known practical attacks against SHA-512. It remains a NIST-approved algorithm 
                    with no collision, pre-image, or second pre-image attacks. SHA-512 is considered secure for all current 
                    and foreseeable cryptographic applications.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What's the difference between SHA-512 and SHA-512/256?</h4>
                  <p>
                    SHA-512 outputs 512 bits, while SHA-512/256 truncates the output to 256 bits. SHA-512/256 uses different 
                    initial hash values (IV) and provides 256-bit security with SHA-512's performance on 64-bit systems. 
                    It's essentially a faster SHA-256 alternative for 64-bit platforms.
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
