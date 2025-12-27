import { useState } from 'react';
import Layout from '../../components/Layout';

export default function BinaryConverter() {
  const [mode, setMode] = useState('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [encoding, setEncoding] = useState('utf8');
  const [stats, setStats] = useState(null);

  const textToBinary = (text, encodingType) => {
    let binary = '';
    
    if (encodingType === 'utf8') {
      // UTF-8 encoding
      const utf8Bytes = new TextEncoder().encode(text);
      binary = Array.from(utf8Bytes)
        .map(byte => byte.toString(2).padStart(8, '0'))
        .join(' ');
    } else if (encodingType === 'ascii') {
      // ASCII encoding (only works for ASCII characters)
      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        if (charCode > 127) {
          throw new Error(`Non-ASCII character found: "${text[i]}" (use UTF-8 encoding instead)`);
        }
        binary += charCode.toString(2).padStart(8, '0') + ' ';
      }
      binary = binary.trim();
    } else if (encodingType === 'unicode') {
      // Unicode (UTF-16) encoding
      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        binary += charCode.toString(2).padStart(16, '0') + ' ';
      }
      binary = binary.trim();
    }
    
    return binary;
  };

  const binaryToText = (binary, encodingType) => {
    // Remove extra spaces and clean input
    const cleanBinary = binary.replace(/[^01\s]/g, '').trim();
    const binaryGroups = cleanBinary.split(/\s+/);
    
    let text = '';
    
    if (encodingType === 'utf8') {
      // UTF-8 decoding
      const bytes = binaryGroups.map(group => {
        if (group.length !== 8) {
          throw new Error(`Invalid binary group: "${group}" (expected 8 bits for UTF-8)`);
        }
        return parseInt(group, 2);
      });
      const uint8Array = new Uint8Array(bytes);
      text = new TextDecoder('utf-8').decode(uint8Array);
    } else if (encodingType === 'ascii') {
      // ASCII decoding
      for (const group of binaryGroups) {
        if (group.length !== 8) {
          throw new Error(`Invalid binary group: "${group}" (expected 8 bits)`);
        }
        const charCode = parseInt(group, 2);
        if (charCode > 127) {
          throw new Error(`Non-ASCII code: ${charCode} (use UTF-8 encoding instead)`);
        }
        text += String.fromCharCode(charCode);
      }
    } else if (encodingType === 'unicode') {
      // Unicode (UTF-16) decoding
      for (const group of binaryGroups) {
        if (group.length !== 16) {
          throw new Error(`Invalid binary group: "${group}" (expected 16 bits for Unicode)`);
        }
        const charCode = parseInt(group, 2);
        text += String.fromCharCode(charCode);
      }
    }
    
    return text;
  };

  const processBinary = () => {
    if (!input.trim()) {
      setOutput('');
      setStats(null);
      return;
    }

    try {
      if (mode === 'encode') {
        const binary = textToBinary(input, encoding);
        setOutput(binary);
        
        const bits = binary.replace(/\s/g, '').length;
        const bytes = bits / 8;
        const groups = binary.split(' ').length;
        
        setStats({
          inputLength: input.length,
          outputBits: bits,
          outputBytes: bytes,
          groups: groups,
          bitsPerChar: (bits / input.length).toFixed(2)
        });
      } else {
        const text = binaryToText(input, encoding);
        setOutput(text);
        
        const inputBits = input.replace(/\s/g, '').length;
        const inputBytes = inputBits / 8;
        
        setStats({
          inputBits: inputBits,
          inputBytes: inputBytes,
          outputLength: text.length,
          groups: input.split(/\s+/).length
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
    a.download = mode === 'encode' ? 'binary-output.txt' : 'decoded-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadExample = (exampleNum) => {
    const examples = {
      1: { text: 'Hello', encoding: 'utf8' },
      2: { text: 'Binary 101', encoding: 'ascii' },
      3: { text: '你好世界', encoding: 'utf8' },
      4: { text: 'Emoji 😀🚀', encoding: 'utf8' }
    };
    
    const example = examples[exampleNum];
    setInput(example.text);
    setEncoding(example.encoding);
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
    <Layout
      title="Binary Encoder/Decoder - Text to Binary Converter"
      description="Free online binary converter. Convert text to binary and binary to text. Supports UTF-8, ASCII, and Unicode encoding. Perfect for programming and data analysis."
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Binary Encoder/Decoder
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Convert text to binary code (0s and 1s) and back. Supports multiple encoding formats including UTF-8, ASCII, and Unicode.
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
                  <span className="text-gray-700">Text to Binary (Encode)</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="decode"
                    checked={mode === 'decode'}
                    onChange={(e) => setMode(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Binary to Text (Decode)</span>
                </label>
              </div>
            </div>

            {/* Encoding Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Encoding Format
              </label>
              <div className="flex gap-4 flex-wrap">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="utf8"
                    checked={encoding === 'utf8'}
                    onChange={(e) => setEncoding(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-gray-700">UTF-8 (8-bit, Unicode support)</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="ascii"
                    checked={encoding === 'ascii'}
                    onChange={(e) => setEncoding(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-gray-700">ASCII (8-bit, 0-127 only)</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="unicode"
                    checked={encoding === 'unicode'}
                    onChange={(e) => setEncoding(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Unicode (16-bit, UTF-16)</span>
                </label>
              </div>
            </div>

            {/* Input Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {mode === 'encode' ? 'Input Text' : 'Input Binary'}
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'encode' 
                  ? 'Enter text to convert to binary...'
                  : 'Enter binary code (e.g., 01001000 01100101 01101100 01101100 01101111)...'}
                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
              />
              <div className="mt-2 text-sm text-gray-600">
                {mode === 'encode' ? `${input.length} characters` : `${input.replace(/\s/g, '').length} bits`}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={processBinary}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-lg"
              >
                {mode === 'encode' ? 'Convert to Binary' : 'Convert to Text'}
              </button>
              {output && (
                <button
                  onClick={swapInputOutput}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
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
                  <button onClick={() => loadExample(1)} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-medium">
                    Simple Text
                  </button>
                  <button onClick={() => loadExample(2)} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-medium">
                    ASCII Text
                  </button>
                  <button onClick={() => loadExample(3)} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-medium">
                    Unicode (Chinese)
                  </button>
                  <button onClick={() => loadExample(4)} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-medium">
                    Emoji
                  </button>
                </div>
              </div>
            )}

            {/* Output Section */}
            {output && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-700">
                    {mode === 'encode' ? 'Binary Output' : 'Text Output'}
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
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
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3">Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {mode === 'encode' ? (
                    <>
                      <div>
                        <div className="text-blue-600 font-semibold">Input Characters</div>
                        <div className="text-gray-900">{stats.inputLength}</div>
                      </div>
                      <div>
                        <div className="text-blue-600 font-semibold">Output Bits</div>
                        <div className="text-gray-900">{stats.outputBits}</div>
                      </div>
                      <div>
                        <div className="text-blue-600 font-semibold">Output Bytes</div>
                        <div className="text-gray-900">{stats.outputBytes}</div>
                      </div>
                      <div>
                        <div className="text-blue-600 font-semibold">Bits/Character</div>
                        <div className="text-gray-900">{stats.bitsPerChar}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <div className="text-blue-600 font-semibold">Input Bits</div>
                        <div className="text-gray-900">{stats.inputBits}</div>
                      </div>
                      <div>
                        <div className="text-blue-600 font-semibold">Input Bytes</div>
                        <div className="text-gray-900">{stats.inputBytes}</div>
                      </div>
                      <div>
                        <div className="text-blue-600 font-semibold">Output Characters</div>
                        <div className="text-gray-900">{stats.outputLength}</div>
                      </div>
                      <div>
                        <div className="text-blue-600 font-semibold">Binary Groups</div>
                        <div className="text-gray-900">{stats.groups}</div>
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
              About Binary Encoding
            </h2>
            
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">
                Binary is the fundamental language of computers, using only two digits (0 and 1) to represent all data. 
                Every character, number, image, and program is ultimately stored and processed as binary code.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Encoding Formats
              </h3>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">UTF-8 (8-bit)</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Variable length (1-4 bytes)</li>
                    <li>• Supports all Unicode characters</li>
                    <li>• Web standard encoding</li>
                    <li>• Backward compatible with ASCII</li>
                    <li>• Best for: Modern applications</li>
                  </ul>
                </div>
                <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">ASCII (8-bit)</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Fixed 8 bits per character</li>
                    <li>• Supports 0-127 characters only</li>
                    <li>• A-Z, a-z, 0-9, punctuation</li>
                    <li>• Simple and fast</li>
                    <li>• Best for: English text only</li>
                  </ul>
                </div>
                <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Unicode (16-bit)</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Fixed 16 bits per character</li>
                    <li>• UTF-16 encoding</li>
                    <li>• Supports 65,536 characters</li>
                    <li>• Less efficient than UTF-8</li>
                    <li>• Best for: Windows internals</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Binary Examples
              </h3>
              
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border border-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Character</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">ASCII (Decimal)</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Binary (8-bit)</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Hexadecimal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono font-bold">A</td>
                      <td className="border border-gray-200 px-4 py-2">65</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">01000001</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">0x41</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono font-bold">a</td>
                      <td className="border border-gray-200 px-4 py-2">97</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">01100001</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">0x61</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono font-bold">0</td>
                      <td className="border border-gray-200 px-4 py-2">48</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">00110000</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">0x30</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono font-bold">!</td>
                      <td className="border border-gray-200 px-4 py-2">33</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">00100001</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">0x21</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono font-bold">Space</td>
                      <td className="border border-gray-200 px-4 py-2">32</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">00100000</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">0x20</td>
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
                  <span><strong>Programming Education:</strong> Learn how computers store data at the bit level</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span><strong>Data Analysis:</strong> Inspect binary data formats and file structures</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span><strong>Network Protocols:</strong> Debug packet data and transmission issues</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span><strong>Cryptography:</strong> Understand encryption at the binary level</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span><strong>Hardware Development:</strong> Work with embedded systems and microcontrollers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span><strong>File Formats:</strong> Reverse engineer proprietary or binary file formats</span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Binary Basics
              </h3>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-900 mb-2">Understanding Binary Numbers</h4>
                <div className="text-sm text-blue-800 space-y-2">
                  <p>Binary uses base-2 (only 0 and 1), while decimal uses base-10 (0-9).</p>
                  <div className="font-mono bg-white p-3 rounded">
                    <div>Binary: 1011 = (1×2³) + (0×2²) + (1×2¹) + (1×2⁰)</div>
                    <div className="mt-1">      = 8 + 0 + 2 + 1 = 11 (decimal)</div>
                  </div>
                  <p className="mt-2">Each binary digit (bit) represents a power of 2, with the rightmost bit being 2⁰ = 1.</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Bits, Bytes, and Data Units
              </h3>
              
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border border-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Unit</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Size</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Example</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-semibold">Bit</td>
                      <td className="border border-gray-200 px-4 py-2">1 bit</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">0 or 1</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-semibold">Nibble</td>
                      <td className="border border-gray-200 px-4 py-2">4 bits</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">1010 (decimal 10)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-semibold">Byte</td>
                      <td className="border border-gray-200 px-4 py-2">8 bits</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">01000001 (letter 'A')</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-semibold">Word</td>
                      <td className="border border-gray-200 px-4 py-2">16 bits (2 bytes)</td>
                      <td className="border border-gray-200 px-4 py-2">Two characters</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-semibold">Double Word</td>
                      <td className="border border-gray-200 px-4 py-2">32 bits (4 bytes)</td>
                      <td className="border border-gray-200 px-4 py-2">Integer value</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-semibold">Quad Word</td>
                      <td className="border border-gray-200 px-4 py-2">64 bits (8 bytes)</td>
                      <td className="border border-gray-200 px-4 py-2">Long integer</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Frequently Asked Questions
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Why do computers use binary?</h4>
                  <p>
                    Computers use binary because electronic circuits have two stable states: on (1) and off (0). 
                    This makes binary the most reliable and efficient way to represent data electronically. It's 
                    much easier to distinguish between two states than multiple voltage levels.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What's the difference between bits and bytes?</h4>
                  <p>
                    A <strong>bit</strong> is the smallest unit of data (0 or 1). A <strong>byte</strong> is 8 bits 
                    grouped together. Bytes are the standard unit for measuring file sizes and memory. One byte can 
                    represent 256 different values (2⁸ = 256).
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">How many characters can binary represent?</h4>
                  <p>
                    With 8 bits (1 byte), binary can represent 256 different values (2⁸). ASCII uses this to encode 
                    128 characters. UTF-8 can use 1-4 bytes per character, supporting over 1 million characters including 
                    all world languages and emojis.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Why is UTF-8 better than ASCII?</h4>
                  <p>
                    UTF-8 supports all Unicode characters (140,000+ including emojis, Chinese, Arabic, etc.) while 
                    ASCII only supports 128 characters (English letters, numbers, basic symbols). UTF-8 is also 
                    backward compatible with ASCII, meaning ASCII text is valid UTF-8.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Can I convert binary to hexadecimal?</h4>
                  <p>
                    Yes! Binary and hexadecimal (base-16) are closely related. Each hex digit represents exactly 4 bits. 
                    For example, binary <code>1010 1100</code> = hex <code>AC</code>. Hex is often used as a more 
                    compact way to represent binary data.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What's endianness in binary?</h4>
                  <p>
                    Endianness refers to the order of bytes in memory. <strong>Big-endian</strong> stores the most 
                    significant byte first (like writing numbers left-to-right). <strong>Little-endian</strong> stores 
                    the least significant byte first. This matters when sharing binary data between different systems.
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
