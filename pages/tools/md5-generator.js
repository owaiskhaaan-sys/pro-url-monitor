import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function MD5Generator() {
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('');
  const [format, setFormat] = useState('hex'); // hex, base64

  // MD5 implementation
  const md5 = (string) => {
    const rotateLeft = (value, shift) => {
      return (value << shift) | (value >>> (32 - shift));
    };

    const addUnsigned = (x, y) => {
      const x8 = (x & 0x80000000);
      const y8 = (y & 0x80000000);
      const x4 = (x & 0x40000000);
      const y4 = (y & 0x40000000);
      const result = (x & 0x3FFFFFFF) + (y & 0x3FFFFFFF);
      if (x4 & y4) return (result ^ 0x80000000 ^ x8 ^ y8);
      if (x4 | y4) {
        if (result & 0x40000000) return (result ^ 0xC0000000 ^ x8 ^ y8);
        else return (result ^ 0x40000000 ^ x8 ^ y8);
      }
      return (result ^ x8 ^ y8);
    };

    const F = (x, y, z) => { return (x & y) | ((~x) & z); };
    const G = (x, y, z) => { return (x & z) | (y & (~z)); };
    const H = (x, y, z) => { return (x ^ y ^ z); };
    const I = (x, y, z) => { return (y ^ (x | (~z))); };

    const FF = (a, b, c, d, x, s, ac) => {
      a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };

    const GG = (a, b, c, d, x, s, ac) => {
      a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };

    const HH = (a, b, c, d, x, s, ac) => {
      a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };

    const II = (a, b, c, d, x, s, ac) => {
      a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };

    const convertToWordArray = (string) => {
      let lWordCount;
      const lMessageLength = string.length;
      const lNumberOfWords_temp1 = lMessageLength + 8;
      const lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
      const lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
      const lWordArray = Array(lNumberOfWords - 1);
      let lBytePosition = 0;
      let lByteCount = 0;
      while (lByteCount < lMessageLength) {
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
        lByteCount++;
      }
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
      lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
      lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
      return lWordArray;
    };

    const wordToHex = (lValue) => {
      let wordToHexValue = '', wordToHexValue_temp = '', lByte, lCount;
      for (lCount = 0; lCount <= 3; lCount++) {
        lByte = (lValue >>> (lCount * 8)) & 255;
        wordToHexValue_temp = '0' + lByte.toString(16);
        wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
      }
      return wordToHexValue;
    };

    const utf8Encode = (string) => {
      string = string.replace(/\r\n/g, '\n');
      let utftext = '';
      for (let n = 0; n < string.length; n++) {
        const c = string.charCodeAt(n);
        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        } else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
      }
      return utftext;
    };

    let x = [];
    let k, AA, BB, CC, DD, a, b, c, d;
    const S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    const S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    const S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    const S41 = 6, S42 = 10, S43 = 15, S44 = 21;

    string = utf8Encode(string);
    x = convertToWordArray(string);
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

    for (k = 0; k < x.length; k += 16) {
      AA = a; BB = b; CC = c; DD = d;
      a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
      d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
      c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
      b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
      a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
      d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
      c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
      b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
      a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
      d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
      c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
      b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
      a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
      d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
      c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
      b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
      a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
      d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
      c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
      b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
      a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
      d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
      c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
      b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
      a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
      d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
      c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
      b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
      a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
      d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
      c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
      b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
      a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
      d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
      c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
      b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
      a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
      d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
      c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
      b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
      a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
      d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
      c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
      b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
      a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
      d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
      c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
      b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
      a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
      d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
      c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
      b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
      a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
      d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
      c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
      b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
      a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
      d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
      c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
      b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
      a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
      d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
      c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
      b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
      a = addUnsigned(a, AA);
      b = addUnsigned(b, BB);
      c = addUnsigned(c, CC);
      d = addUnsigned(d, DD);
    }

    const temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
    return temp.toLowerCase();
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

    const hexHash = md5(input);
    
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
        <title>MD5 Hash Generator - Generate MD5 Checksums</title>
        <meta name="description" content="Generate MD5 hash checksums for text and files. Free MD5 generator tool to create cryptographic hashes for password encryption and verification." />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              MD5 Hash Generator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Generate MD5 hashes from any text. Useful for checksums, file verification, and data integrity checks. Fast, secure, and client-side processing.
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
                placeholder="Enter text to generate MD5 hash..."
                className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm resize-none"
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
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="ml-2">
                    <span className="font-semibold">Hexadecimal</span>
                    <span className="text-sm text-gray-600 block">32 character hex string (default)</span>
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={format === 'base64'}
                    onChange={() => setFormat('base64')}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="ml-2">
                    <span className="font-semibold">Base64</span>
                    <span className="text-sm text-gray-600 block">24 character base64 string</span>
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
                className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium shadow-lg"
              >
                Generate MD5 Hash
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
                    MD5 Hash ({format === 'hex' ? 'Hexadecimal' : 'Base64'})
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
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    {hash.length} characters
                  </div>
                </div>

                {/* Hash Info */}
                <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hash Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Algorithm</div>
                      <div className="text-xl font-bold text-gray-900">MD5</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Output Length</div>
                      <div className="text-xl font-bold text-gray-900">128 bits</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Format</div>
                      <div className="text-xl font-bold text-gray-900">{format === 'hex' ? 'Hex (32 chars)' : 'Base64 (24 chars)'}</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Information Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              About MD5 Hash Algorithm
            </h2>
            
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">
                MD5 (Message Digest Algorithm 5) is a widely used cryptographic hash function that produces 
                a 128-bit hash value. It's commonly used for checksums, file verification, and data integrity 
                checks, though not recommended for cryptographic security.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Key Features
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🔢 Fixed Length Output</h4>
                  <p className="text-sm">
                    Always produces 128-bit (16 bytes) hash, regardless of input size
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">⚡ Fast Computation</h4>
                  <p className="text-sm">
                    Very quick to compute, making it ideal for checksums and data verification
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🎯 Deterministic</h4>
                  <p className="text-sm">
                    Same input always produces the same hash output
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🔄 Avalanche Effect</h4>
                  <p className="text-sm">
                    Small change in input creates completely different hash
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Common Use Cases
              </h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span><strong>File Verification:</strong> Check if downloaded files are intact and unmodified</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span><strong>Data Integrity:</strong> Verify data hasn't been corrupted during transfer</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span><strong>Checksums:</strong> Quick file identification and duplicate detection</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span><strong>Database Keys:</strong> Generate unique identifiers from data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span><strong>Cache Keys:</strong> Create cache identifiers for web applications</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span><strong>ETags:</strong> HTTP cache validation headers</span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                MD5 Properties
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
                      <td className="border border-gray-200 px-4 py-2 font-mono">128 bits</td>
                      <td className="border border-gray-200 px-4 py-2">16 bytes or 32 hex characters</td>
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
                      <td className="border border-gray-200 px-4 py-2 font-mono">4 rounds</td>
                      <td className="border border-gray-200 px-4 py-2">64 operations total (16 per round)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2">Speed</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">Very Fast</td>
                      <td className="border border-gray-200 px-4 py-2">Optimized for performance</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Example MD5 Hashes
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Input: <span className="font-mono font-semibold">Hello, World!</span></div>
                  <div className="text-xs font-mono text-gray-900 break-all">65a8e27d8879283831b664bd8b7f0ad4</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Input: <span className="font-mono font-semibold">hello, world!</span></div>
                  <div className="text-xs font-mono text-gray-900 break-all">3adbbad1791fbae3ec908894c4963870</div>
                  <div className="text-xs text-gray-600 mt-1">Notice: Different case produces different hash</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Input: <span className="font-mono font-semibold">(empty string)</span></div>
                  <div className="text-xs font-mono text-gray-900 break-all">d41d8cd98f00b204e9800998ecf8427e</div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Security Considerations
              </h3>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-semibold text-yellow-800 mb-2">Not Cryptographically Secure</h4>
                    <p className="text-sm text-yellow-700 mb-2">
                      MD5 is <strong>NOT recommended</strong> for security-critical applications like password storage 
                      or digital signatures due to known collision vulnerabilities.
                    </p>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• ❌ Don't use for password hashing (use bcrypt, Argon2, or scrypt instead)</li>
                      <li>• ❌ Don't use for digital signatures (use SHA-256 or SHA-3 instead)</li>
                      <li>• ❌ Don't use for SSL/TLS certificates</li>
                      <li>• ✓ OK for checksums and non-security data integrity</li>
                      <li>• ✓ OK for cache keys and ETags</li>
                      <li>• ✓ OK for file deduplication</li>
                    </ul>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                MD5 vs Other Hash Functions
              </h3>
              
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border border-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Algorithm</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Hash Size</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Speed</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Security</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Best For</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono">MD5</td>
                      <td className="border border-gray-200 px-4 py-2">128 bit</td>
                      <td className="border border-gray-200 px-4 py-2">Very Fast</td>
                      <td className="border border-gray-200 px-4 py-2 text-red-600">Broken</td>
                      <td className="border border-gray-200 px-4 py-2">Checksums, cache keys</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono">SHA-1</td>
                      <td className="border border-gray-200 px-4 py-2">160 bit</td>
                      <td className="border border-gray-200 px-4 py-2">Fast</td>
                      <td className="border border-gray-200 px-4 py-2 text-orange-600">Deprecated</td>
                      <td className="border border-gray-200 px-4 py-2">Legacy systems only</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono">SHA-256</td>
                      <td className="border border-gray-200 px-4 py-2">256 bit</td>
                      <td className="border border-gray-200 px-4 py-2">Fast</td>
                      <td className="border border-gray-200 px-4 py-2 text-green-600">Secure</td>
                      <td className="border border-gray-200 px-4 py-2">Security, signatures</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono">SHA-512</td>
                      <td className="border border-gray-200 px-4 py-2">512 bit</td>
                      <td className="border border-gray-200 px-4 py-2">Moderate</td>
                      <td className="border border-gray-200 px-4 py-2 text-green-600">Very Secure</td>
                      <td className="border border-gray-200 px-4 py-2">High security needs</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono">bcrypt</td>
                      <td className="border border-gray-200 px-4 py-2">Variable</td>
                      <td className="border border-gray-200 px-4 py-2">Slow (by design)</td>
                      <td className="border border-gray-200 px-4 py-2 text-green-600">Very Secure</td>
                      <td className="border border-gray-200 px-4 py-2">Password hashing</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Frequently Asked Questions
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Can MD5 be reversed or decrypted?</h4>
                  <p>
                    No, MD5 is a one-way hash function and cannot be reversed. However, for common inputs 
                    (like weak passwords), the hash can be looked up in rainbow tables. This is why MD5 
                    shouldn't be used for passwords.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What are MD5 collisions?</h4>
                  <p>
                    Collisions occur when two different inputs produce the same MD5 hash. Researchers have 
                    demonstrated practical collision attacks, making MD5 unsuitable for security applications 
                    where collision resistance is critical.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Is MD5 still useful?</h4>
                  <p>
                    Yes, for non-security purposes! MD5 is still widely used for checksums, file verification, 
                    cache keys, ETags, and duplicate detection where cryptographic security isn't required.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What should I use instead of MD5 for passwords?</h4>
                  <p>
                    Use bcrypt, Argon2, scrypt, or PBKDF2 for password hashing. These are specifically designed 
                    for passwords with features like salting and adjustable work factors.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Why are some MD5 hashes different for the same input?</h4>
                  <p>
                    They shouldn't be! MD5 is deterministic - same input always produces the same hash. 
                    If you see different hashes, the inputs are different (even by one character, whitespace, 
                    or encoding).
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
