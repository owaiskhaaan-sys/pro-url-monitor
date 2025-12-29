import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function HexConverter() {
  const [mode, setMode] = useState('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [format, setFormat] = useState('nospace');
  const [stats, setStats] = useState(null);

  const textToHex = (text, formatType) => {
    let hex = '';
    
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const hexValue = charCode.toString(16).padStart(4, '0');
      
      if (formatType === 'space') {
        hex += hexValue + ' ';
      } else if (formatType === 'colon') {
        hex += hexValue + ':';
      } else if (formatType === '0x') {
        hex += '0x' + hexValue + ' ';
      } else {
        hex += hexValue;
      }
    }
    
    return hex.trim();
  };

  const hexToText = (hex) => {
    // Remove common separators and prefixes
    const cleanHex = hex
      .replace(/0x/gi, '')
      .replace(/[^0-9A-Fa-f]/g, '');
    
    if (cleanHex.length % 2 !== 0 && cleanHex.length % 4 !== 0) {
      throw new Error('Invalid hex string length. Must be even number of characters.');
    }
    
    let text = '';
    
    // Try 4-character groups first (UTF-16)
    if (cleanHex.length % 4 === 0) {
      for (let i = 0; i < cleanHex.length; i += 4) {
        const hexGroup = cleanHex.substr(i, 4);
        const charCode = parseInt(hexGroup, 16);
        text += String.fromCharCode(charCode);
      }
    } else {
      // Fall back to 2-character groups (bytes)
      for (let i = 0; i < cleanHex.length; i += 2) {
        const hexGroup = cleanHex.substr(i, 2);
        const charCode = parseInt(hexGroup, 16);
        text += String.fromCharCode(charCode);
      }
    }
    
    return text;
  };

  const processHex = () => {
    if (!input.trim()) {
      setOutput('');
      setStats(null);
      return;
    }

    try {
      if (mode === 'encode') {
        const hex = textToHex(input, format);
        setOutput(hex);
        
        const hexChars = hex.replace(/[^0-9A-Fa-f]/g, '').length;
        const bytes = hexChars / 2;
        
        setStats({
          inputLength: input.length,
          outputHexChars: hexChars,
          outputBytes: bytes,
          expansion: ((hex.length / input.length) * 100).toFixed(1)
        });
      } else {
        const text = hexToText(input);
        setOutput(text);
        
        const inputHexChars = input.replace(/[^0-9A-Fa-f]/g, '').length;
        const inputBytes = inputHexChars / 2;
        
        setStats({
          inputHexChars: inputHexChars,
          inputBytes: inputBytes,
          outputLength: text.length,
          compression: ((text.length / input.length) * 100).toFixed(1)
        });
      }
    } catch (err) {
      setOutput(`Error: ${err.message}`);
      setStats(null);
    }
  };

  const copyToClipboard = async () => {
    if (!output) return;
    
    try {
      await navigator.clipboard.writeText(output);
      alert('Copied to clipboard!');
    } catch (err) {
      alert('Failed to copy');
    }
  };

  const downloadOutput = () => {
    if (!output) return;
    
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'encode' ? 'hex-output.txt' : 'decoded-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadExample = (exampleNum) => {
    const examples = {
      1: { text: 'Hello World', format: 'space' },
      2: { text: 'Hex123', format: 'colon' },
      3: { text: 'UTF-8 Text 你好', format: 'nospace' },
      4: { text: 'Special: @#$%', format: '0x' }
    };
    
    const example = examples[exampleNum];
    setInput(example.text);
    setFormat(example.format);
    setMode('encode');
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setStats(null);
  };

  const swapInputOutput = () => {
    setInput(output);
    setOutput('');
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setStats(null);
  };

  return (
    <Layout>
      <Head>
        <title>Hex Converter - Convert Hexadecimal to Decimal</title>
        <meta name="description" content="Convert hexadecimal numbers to decimal, binary, and octal. Free hex converter tool for number system conversions and color codes." />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Hex Encoder/Decoder
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Convert text to hexadecimal (base-16) and back. Essential tool for developers, debuggers, and anyone working with low-level data.
            </p>
          </div>

          {/* Tool Interface */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            {/* Mode Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Mode
              </label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="encode"
                    checked={mode === 'encode'}
                    onChange={(e) => setMode(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Text to Hex (Encode)</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="decode"
                    checked={mode === 'decode'}
                    onChange={(e) => setMode(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Hex to Text (Decode)</span>
                </label>
              </div>
            </div>

            {/* Format Selection (for encoding) */}
            {mode === 'encode' && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Output Format
                </label>
                <div className="flex gap-4 flex-wrap">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="nospace"
                      checked={format === 'nospace'}
                      onChange={(e) => setFormat(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-gray-700">No spaces (48656c6c6f)</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="space"
                      checked={format === 'space'}
                      onChange={(e) => setFormat(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-gray-700">Spaces (48 65 6c 6c 6f)</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="colon"
                      checked={format === 'colon'}
                      onChange={(e) => setFormat(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-gray-700">Colons (48:65:6c:6c:6f)</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="0x"
                      checked={format === '0x'}
                      onChange={(e) => setFormat(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-gray-700">0x prefix (0x48 0x65 0x6c)</span>
                  </label>
                </div>
              </div>
            )}

            {/* Input Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {mode === 'encode' ? 'Input Text' : 'Input Hexadecimal'}
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'encode' 
                  ? 'Enter text to convert to hexadecimal...'
                  : 'Enter hex code (e.g., 48656c6c6f or 48 65 6c 6c 6f)...'}
                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm resize-none"
              />
              <div className="mt-2 text-sm text-gray-600">
                {mode === 'encode' 
                  ? `${input.length} characters` 
                  : `${input.replace(/[^0-9A-Fa-f]/g, '').length} hex digits`}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={processHex}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-lg"
              >
                {mode === 'encode' ? 'Convert to Hex' : 'Convert to Text'}
              </button>
              {output && (
                <button
                  onClick={swapInputOutput}
                  className="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
                >
                  ⇄ Swap & Reverse
                </button>
              )}
              <button
                onClick={clearAll}
                className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Clear All
              </button>
            </div>

            {/* Example Buttons */}
            {mode === 'encode' && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Quick Examples
                </label>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => loadExample(1)} className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-sm font-medium">
                    Simple Text
                  </button>
                  <button onClick={() => loadExample(2)} className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-sm font-medium">
                    Alphanumeric
                  </button>
                  <button onClick={() => loadExample(3)} className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-sm font-medium">
                    Unicode
                  </button>
                  <button onClick={() => loadExample(4)} className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-sm font-medium">
                    Special Chars
                  </button>
                </div>
              </div>
            )}

            {/* Output Section */}
            {output && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-700">
                    {mode === 'encode' ? 'Hexadecimal Output' : 'Text Output'}
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="text-sm px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                    >
                      Copy
                    </button>
                    <button
                      onClick={downloadOutput}
                      className="text-sm px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                    >
                      Download
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <pre className="whitespace-pre-wrap break-all font-mono text-sm text-gray-900">{output}</pre>
                </div>
              </div>
            )}

            {/* Statistics */}
            {stats && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-3">Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {mode === 'encode' ? (
                    <>
                      <div>
                        <div className="text-green-600 font-semibold">Input Characters</div>
                        <div className="text-gray-900">{stats.inputLength}</div>
                      </div>
                      <div>
                        <div className="text-green-600 font-semibold">Hex Digits</div>
                        <div className="text-gray-900">{stats.outputHexChars}</div>
                      </div>
                      <div>
                        <div className="text-green-600 font-semibold">Output Bytes</div>
                        <div className="text-gray-900">{stats.outputBytes}</div>
                      </div>
                      <div>
                        <div className="text-green-600 font-semibold">Size Increase</div>
                        <div className="text-gray-900">{stats.expansion}%</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <div className="text-green-600 font-semibold">Hex Digits</div>
                        <div className="text-gray-900">{stats.inputHexChars}</div>
                      </div>
                      <div>
                        <div className="text-green-600 font-semibold">Input Bytes</div>
                        <div className="text-gray-900">{stats.inputBytes}</div>
                      </div>
                      <div>
                        <div className="text-green-600 font-semibold">Output Characters</div>
                        <div className="text-gray-900">{stats.outputLength}</div>
                      </div>
                      <div>
                        <div className="text-green-600 font-semibold">Efficiency</div>
                        <div className="text-gray-900">{stats.compression}%</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Information Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              About Hexadecimal Encoding
            </h2>
            
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">
                Hexadecimal (hex) is a base-16 number system using digits 0-9 and letters A-F. It's widely used in 
                computing because it provides a human-readable representation of binary data, with each hex digit 
                representing exactly 4 bits.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Hexadecimal Chart
              </h3>
              
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border border-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Decimal</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Hexadecimal</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Binary</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Decimal</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Hexadecimal</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Binary</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2">0</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">0</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">0000</td>
                      <td className="border border-gray-200 px-4 py-2">8</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">8</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">1000</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2">1</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">1</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">0001</td>
                      <td className="border border-gray-200 px-4 py-2">9</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">9</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">1001</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2">2</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">2</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">0010</td>
                      <td className="border border-gray-200 px-4 py-2">10</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">A</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">1010</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2">3</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">3</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">0011</td>
                      <td className="border border-gray-200 px-4 py-2">11</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">B</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">1011</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2">4</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">4</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">0100</td>
                      <td className="border border-gray-200 px-4 py-2">12</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">C</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">1100</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2">5</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">5</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">0101</td>
                      <td className="border border-gray-200 px-4 py-2">13</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">D</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">1101</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2">6</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">6</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">0110</td>
                      <td className="border border-gray-200 px-4 py-2">14</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">E</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">1110</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2">7</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">7</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">0111</td>
                      <td className="border border-gray-200 px-4 py-2">15</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">F</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">1111</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                ASCII to Hex Examples
              </h3>
              
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border border-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Character</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">ASCII Decimal</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Hexadecimal</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Binary</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono font-bold">A</td>
                      <td className="border border-gray-200 px-4 py-2">65</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">0x41</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">01000001</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono font-bold">a</td>
                      <td className="border border-gray-200 px-4 py-2">97</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">0x61</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">01100001</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono font-bold">0</td>
                      <td className="border border-gray-200 px-4 py-2">48</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">0x30</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">00110000</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono font-bold">Space</td>
                      <td className="border border-gray-200 px-4 py-2">32</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">0x20</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">00100000</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono font-bold">!</td>
                      <td className="border border-gray-200 px-4 py-2">33</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">0x21</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">00100001</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Common Use Cases
              </h3>
              
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>Memory Addresses:</strong> Display RAM addresses (0x7FFF0000)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>Color Codes:</strong> Web colors (#FF5733 = RGB red, green, blue)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>MAC Addresses:</strong> Network hardware (00:1A:2B:3C:4D:5E)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>File Signatures:</strong> Magic numbers (PNG = 89 50 4E 47)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>Debugging:</strong> View raw data in memory dumps</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>Cryptography:</strong> Display hash outputs and keys</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>Unicode:</strong> Character codes (U+1F600 = 😀)</span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Why Use Hexadecimal?
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">✓ Advantages</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• More compact than binary (4 bits = 1 hex digit)</li>
                    <li>• Human-readable compared to raw binary</li>
                    <li>• Easy conversion between hex and binary</li>
                    <li>• Aligns with byte boundaries (2 hex = 1 byte)</li>
                    <li>• Standard for memory addresses and dumps</li>
                    <li>• Used in color codes, MAC addresses, etc.</li>
                  </ul>
                </div>
                <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Conversion Examples</h4>
                  <div className="text-sm text-green-800 space-y-2 font-mono">
                    <div>Binary: 11111111</div>
                    <div>Hex:    FF</div>
                    <div>Decimal: 255</div>
                    <div className="pt-2">Binary: 10101100</div>
                    <div>Hex:    AC</div>
                    <div>Decimal: 172</div>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Hex in Programming Languages
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">JavaScript/TypeScript</h4>
                  <pre className="text-sm font-mono text-gray-800">
{`// Hex literal
const hex = 0xFF; // 255

// Convert to hex
const num = 255;
num.toString(16); // "ff"

// Parse hex string
parseInt("FF", 16); // 255`}
                  </pre>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Python</h4>
                  <pre className="text-sm font-mono text-gray-800">
{`# Hex literal
hex_val = 0xFF  # 255

# Convert to hex
hex(255)  # '0xff'

# Parse hex string
int('FF', 16)  # 255`}
                  </pre>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">C/C++</h4>
                  <pre className="text-sm font-mono text-gray-800">
{`// Hex literal
int hex = 0xFF; // 255

// Print as hex
printf("%X", 255); // FF

// Parse hex string
int val = strtol("FF", NULL, 16);`}
                  </pre>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Frequently Asked Questions
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Why is hex used instead of decimal?</h4>
                  <p>
                    Hexadecimal maps perfectly to binary - each hex digit represents exactly 4 bits. This makes it 
                    much easier to read and write binary data. For example, the byte <code>11111111</code> is simply 
                    <code>FF</code> in hex, but <code>255</code> in decimal (no clear relationship to binary).
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Are hex letters case-sensitive?</h4>
                  <p>
                    No, hexadecimal letters (A-F) are not case-sensitive. <code>0xFF</code>, <code>0xff</code>, 
                    and <code>0xFf</code> all represent the same value (255). Most programming languages and tools 
                    accept both uppercase and lowercase.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What does the 0x prefix mean?</h4>
                  <p>
                    The <code>0x</code> prefix indicates a hexadecimal number in most programming languages. 
                    For example, <code>0x10</code> means hex 10 (decimal 16), not decimal 10. Without the prefix, 
                    <code>10</code> would be interpreted as decimal.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">How do I convert hex color codes?</h4>
                  <p>
                    Hex color codes like <code>#FF5733</code> consist of three parts: Red (<code>FF</code> = 255), 
                    Green (<code>57</code> = 87), and Blue (<code>33</code> = 51). Each color channel uses 2 hex 
                    digits, representing values 0-255.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What's the maximum hex value?</h4>
                  <p>
                    For a single byte (8 bits), the maximum hex value is <code>FF</code> (decimal 255). For two bytes 
                    (16 bits), it's <code>FFFF</code> (decimal 65,535). For four bytes (32 bits), it's 
                    <code>FFFFFFFF</code> (decimal 4,294,967,295).
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Can hex represent negative numbers?</h4>
                  <p>
                    Hex itself doesn't have signs, but it can represent negative numbers using two's complement. 
                    For example, in an 8-bit signed system, <code>0xFF</code> represents -1, <code>0xFE</code> is -2, 
                    and <code>0x80</code> is -128. The interpretation depends on whether you're treating it as signed 
                    or unsigned.
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
