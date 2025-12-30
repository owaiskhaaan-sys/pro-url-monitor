import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function ASCIIConverter() {
  const [mode, setMode] = useState('toAscii');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [format, setFormat] = useState('decimal');
  const [separator, setSeparator] = useState('space');
  const [stats, setStats] = useState(null);

  const textToAscii = (text, formatType, separatorType) => {
    let result = [];
    
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      
      if (formatType === 'decimal') {
        result.push(code.toString());
      } else if (formatType === 'hex') {
        result.push(code.toString(16).toUpperCase());
      } else if (formatType === 'binary') {
        result.push(code.toString(2).padStart(8, '0'));
      } else if (formatType === 'octal') {
        result.push(code.toString(8));
      }
    }
    
    const sep = separatorType === 'space' ? ' ' : 
                separatorType === 'comma' ? ', ' : 
                separatorType === 'newline' ? '\n' : '';
    
    return result.join(sep);
  };

  const asciiToText = (ascii) => {
    try {
      // Remove extra whitespace and split by common separators
      const cleaned = ascii.trim();
      let codes = [];
      
      // Try to detect format
      if (/^[01\s]+$/.test(cleaned)) {
        // Binary format
        codes = cleaned.split(/\s+/).map(code => parseInt(code, 2));
      } else if (/^[0-7\s,]+$/.test(cleaned)) {
        // Octal format
        codes = cleaned.split(/[\s,]+/).map(code => parseInt(code, 8));
      } else if (/^[0-9A-Fa-f\s,]+$/.test(cleaned)) {
        // Hex format (if contains A-F) or decimal
        const hasHex = /[A-Fa-f]/.test(cleaned);
        codes = cleaned.split(/[\s,]+/).map(code => parseInt(code, hasHex ? 16 : 10));
      } else {
        // Default to decimal
        codes = cleaned.split(/[\s,]+/).map(code => parseInt(code, 10));
      }
      
      // Filter out invalid codes
      codes = codes.filter(code => !isNaN(code) && code >= 0 && code <= 1114111);
      
      if (codes.length === 0) {
        throw new Error('No valid ASCII/Unicode codes found');
      }
      
      return codes.map(code => String.fromCharCode(code)).join('');
    } catch (err) {
      throw new Error('Invalid ASCII format. Use space or comma separated numbers.');
    }
  };

  const processConversion = () => {
    if (!input.trim()) {
      setOutput('');
      setStats(null);
      return;
    }

    try {
      if (mode === 'toAscii') {
        const result = textToAscii(input, format, separator);
        setOutput(result);
        
        const codes = result.split(/[\s,\n]+/).filter(c => c);
        setStats({
          inputLength: input.length,
          outputCodes: codes.length,
          avgCode: (codes.reduce((sum, c) => sum + parseInt(c, format === 'hex' ? 16 : format === 'binary' ? 2 : format === 'octal' ? 8 : 10), 0) / codes.length).toFixed(1),
          format: format
        });
      } else {
        const result = asciiToText(input);
        setOutput(result);
        
        const inputCodes = input.split(/[\s,\n]+/).filter(c => c);
        setStats({
          inputCodes: inputCodes.length,
          outputLength: result.length,
          detectedFormat: /[01]{8}/.test(input) ? 'Binary' : /[A-Fa-f]/.test(input) ? 'Hex' : /^[0-7\s,]+$/.test(input) ? 'Octal' : 'Decimal'
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
    a.download = mode === 'toAscii' ? 'ascii-codes.txt' : 'decoded-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadExample = (exampleNum) => {
    const examples = {
      1: { text: 'Hello', mode: 'toAscii', format: 'decimal' },
      2: { text: 'ABC123', mode: 'toAscii', format: 'hex' },
      3: { text: 'Binary', mode: 'toAscii', format: 'binary' },
      4: { text: '!@#$%', mode: 'toAscii', format: 'decimal' }
    };
    
    const example = examples[exampleNum];
    setInput(example.text);
    setMode(example.mode);
    setFormat(example.format);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setStats(null);
  };

  const swapInputOutput = () => {
    setInput(output);
    setOutput('');
    setMode(mode === 'toAscii' ? 'toText' : 'toAscii');
    setStats(null);
  };

  const showAsciiTable = () => {
    let table = 'ASCII Table (Printable Characters 32-126)\n\n';
    table += 'Dec  Hex  Char | Dec  Hex  Char | Dec  Hex  Char | Dec  Hex  Char\n';
    table += '─────────────────────────────────────────────────────────────────\n';
    
    for (let i = 32; i < 127; i += 4) {
      const line = [];
      for (let j = 0; j < 4; j++) {
        const code = i + j;
        if (code < 127) {
          const dec = code.toString().padStart(3, ' ');
          const hex = code.toString(16).toUpperCase().padStart(2, '0');
          const char = String.fromCharCode(code).padEnd(4, ' ');
          line.push(`${dec}  ${hex}  ${char}`);
        }
      }
      table += line.join(' | ') + '\n';
    }
    
    setOutput(table);
  };

  return (
    <Layout>
      <Head>
        <title>ASCII Converter - Text to ASCII Code Converter</title>
        <meta name="description" content="Convert text to ASCII code and vice versa. Free ASCII converter tool to encode/decode characters, get ASCII values, and work with ASCII art." />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/ascii-converter" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              ASCII Converter
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Convert text to ASCII codes and back. Supports multiple formats: decimal, hexadecimal, binary, and octal. Essential for programming and data analysis.
            </p>
          </div>

          {/* Tool Interface */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            {/* Mode Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Conversion Mode
              </label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="toAscii"
                    checked={mode === 'toAscii'}
                    onChange={(e) => setMode(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Text to ASCII Codes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="toText"
                    checked={mode === 'toText'}
                    onChange={(e) => setMode(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-gray-700">ASCII Codes to Text</span>
                </label>
              </div>
            </div>

            {/* Format Selection (for toAscii mode) */}
            {mode === 'toAscii' && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Output Format
                  </label>
                  <div className="flex gap-4 flex-wrap">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value="decimal"
                        checked={format === 'decimal'}
                        onChange={(e) => setFormat(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-gray-700">Decimal (65, 66, 67)</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value="hex"
                        checked={format === 'hex'}
                        onChange={(e) => setFormat(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-gray-700">Hexadecimal (41, 42, 43)</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value="binary"
                        checked={format === 'binary'}
                        onChange={(e) => setFormat(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-gray-700">Binary (01000001)</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value="octal"
                        checked={format === 'octal'}
                        onChange={(e) => setFormat(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-gray-700">Octal (101, 102, 103)</span>
                    </label>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Separator
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value="space"
                        checked={separator === 'space'}
                        onChange={(e) => setSeparator(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-gray-700">Space</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value="comma"
                        checked={separator === 'comma'}
                        onChange={(e) => setSeparator(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-gray-700">Comma</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value="newline"
                        checked={separator === 'newline'}
                        onChange={(e) => setSeparator(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-gray-700">New Line</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value="none"
                        checked={separator === 'none'}
                        onChange={(e) => setSeparator(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-gray-700">None</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* Input Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {mode === 'toAscii' ? 'Input Text' : 'Input ASCII Codes'}
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'toAscii' 
                  ? 'Enter text to convert to ASCII codes...'
                  : 'Enter ASCII codes (e.g., 72 101 108 108 111 or 48 65 6C 6C 6F)...'}
                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-mono text-sm resize-none"
              />
              <div className="mt-2 text-sm text-gray-600">
                {mode === 'toAscii' 
                  ? `${input.length} characters` 
                  : `${input.split(/[\s,\n]+/).filter(c => c).length} codes`}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={processConversion}
                className="px-8 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition font-medium shadow-lg"
              >
                {mode === 'toAscii' ? 'Convert to ASCII' : 'Convert to Text'}
              </button>
              {output && !output.startsWith('ASCII Table') && (
                <button
                  onClick={swapInputOutput}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  ⇄ Swap & Reverse
                </button>
              )}
              <button
                onClick={showAsciiTable}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                📋 Show ASCII Table
              </button>
              <button
                onClick={clearAll}
                className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Clear All
              </button>
            </div>

            {/* Example Buttons */}
            {mode === 'toAscii' && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Quick Examples
                </label>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => loadExample(1)} className="px-4 py-2 bg-cyan-100 text-cyan-700 rounded-lg hover:bg-cyan-200 transition text-sm font-medium">
                    Simple Text
                  </button>
                  <button onClick={() => loadExample(2)} className="px-4 py-2 bg-cyan-100 text-cyan-700 rounded-lg hover:bg-cyan-200 transition text-sm font-medium">
                    Alphanumeric
                  </button>
                  <button onClick={() => loadExample(3)} className="px-4 py-2 bg-cyan-100 text-cyan-700 rounded-lg hover:bg-cyan-200 transition text-sm font-medium">
                    Binary Format
                  </button>
                  <button onClick={() => loadExample(4)} className="px-4 py-2 bg-cyan-100 text-cyan-700 rounded-lg hover:bg-cyan-200 transition text-sm font-medium">
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
                    {output.startsWith('ASCII Table') ? 'ASCII Reference Table' : mode === 'toAscii' ? 'ASCII Codes' : 'Text Output'}
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="text-sm px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition font-medium"
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
              <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
                <h3 className="font-semibold text-cyan-900 mb-3">Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  {mode === 'toAscii' ? (
                    <>
                      <div>
                        <div className="text-cyan-600 font-semibold">Input Characters</div>
                        <div className="text-gray-900">{stats.inputLength}</div>
                      </div>
                      <div>
                        <div className="text-cyan-600 font-semibold">ASCII Codes</div>
                        <div className="text-gray-900">{stats.outputCodes}</div>
                      </div>
                      <div>
                        <div className="text-cyan-600 font-semibold">Average Code</div>
                        <div className="text-gray-900">{stats.avgCode}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <div className="text-cyan-600 font-semibold">Input Codes</div>
                        <div className="text-gray-900">{stats.inputCodes}</div>
                      </div>
                      <div>
                        <div className="text-cyan-600 font-semibold">Output Characters</div>
                        <div className="text-gray-900">{stats.outputLength}</div>
                      </div>
                      <div>
                        <div className="text-cyan-600 font-semibold">Detected Format</div>
                        <div className="text-gray-900">{stats.detectedFormat}</div>
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
              About ASCII
            </h2>
            
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">
                ASCII (American Standard Code for Information Interchange) is a character encoding standard that 
                assigns numerical codes to letters, numbers, symbols, and control characters. It's the foundation 
                of text representation in computers.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                ASCII Character Sets
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="border border-cyan-200 bg-cyan-50 rounded-lg p-4">
                  <h4 className="font-semibold text-cyan-900 mb-2">Control Characters (0-31)</h4>
                  <ul className="text-sm text-cyan-800 space-y-1">
                    <li>• 0: NULL (null character)</li>
                    <li>• 7: BEL (bell/alert)</li>
                    <li>• 8: BS (backspace)</li>
                    <li>• 9: TAB (horizontal tab)</li>
                    <li>• 10: LF (line feed/newline)</li>
                    <li>• 13: CR (carriage return)</li>
                    <li>• 27: ESC (escape)</li>
                  </ul>
                </div>
                <div className="border border-cyan-200 bg-cyan-50 rounded-lg p-4">
                  <h4 className="font-semibold text-cyan-900 mb-2">Printable Characters (32-126)</h4>
                  <ul className="text-sm text-cyan-800 space-y-1">
                    <li>• 32: Space</li>
                    <li>• 33-47: Punctuation (!@#$%)</li>
                    <li>• 48-57: Digits (0-9)</li>
                    <li>• 65-90: Uppercase (A-Z)</li>
                    <li>• 97-122: Lowercase (a-z)</li>
                    <li>• 123-126: Symbols ({`{|}~`})</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Common ASCII Codes
              </h3>
              
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border border-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Character</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Decimal</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Hex</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Binary</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono">Space</td>
                      <td className="border border-gray-200 px-4 py-2">32</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">20</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">00100000</td>
                      <td className="border border-gray-200 px-4 py-2">Whitespace</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono font-bold">0</td>
                      <td className="border border-gray-200 px-4 py-2">48</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">30</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">00110000</td>
                      <td className="border border-gray-200 px-4 py-2">Digit zero</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono font-bold">A</td>
                      <td className="border border-gray-200 px-4 py-2">65</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">41</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">01000001</td>
                      <td className="border border-gray-200 px-4 py-2">Uppercase A</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono font-bold">a</td>
                      <td className="border border-gray-200 px-4 py-2">97</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">61</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">01100001</td>
                      <td className="border border-gray-200 px-4 py-2">Lowercase a</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono font-bold">!</td>
                      <td className="border border-gray-200 px-4 py-2">33</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">21</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">00100001</td>
                      <td className="border border-gray-200 px-4 py-2">Exclamation</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                ASCII vs Unicode
              </h3>
              
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border border-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Feature</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">ASCII</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Unicode (UTF-8)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-semibold">Character Count</td>
                      <td className="border border-gray-200 px-4 py-2">128 (7-bit) or 256 (8-bit)</td>
                      <td className="border border-gray-200 px-4 py-2">Over 149,000 characters</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-semibold">Language Support</td>
                      <td className="border border-gray-200 px-4 py-2">English only</td>
                      <td className="border border-gray-200 px-4 py-2">All world languages</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-semibold">Emoji Support</td>
                      <td className="border border-gray-200 px-4 py-2">❌ No</td>
                      <td className="border border-gray-200 px-4 py-2">✓ Yes</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-semibold">Size</td>
                      <td className="border border-gray-200 px-4 py-2">1 byte per character</td>
                      <td className="border border-gray-200 px-4 py-2">1-4 bytes per character</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-semibold">Compatibility</td>
                      <td className="border border-gray-200 px-4 py-2">Universal legacy support</td>
                      <td className="border border-gray-200 px-4 py-2">Backward compatible with ASCII</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Common Use Cases
              </h3>
              
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-2">✓</span>
                  <span><strong>Data Transmission:</strong> Sending text data between systems</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-2">✓</span>
                  <span><strong>File Formats:</strong> CSV, TXT, and plain text files</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-2">✓</span>
                  <span><strong>Programming:</strong> Character manipulation and string processing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-2">✓</span>
                  <span><strong>Debugging:</strong> Inspect character codes in data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-2">✓</span>
                  <span><strong>Protocols:</strong> HTTP, SMTP, FTP use ASCII</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-2">✓</span>
                  <span><strong>Sorting:</strong> Alphabetical ordering based on ASCII values</span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Interesting ASCII Facts
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                  <h4 className="font-semibold text-cyan-900 mb-2">Case Conversion Trick</h4>
                  <p className="text-sm text-cyan-800">
                    To convert between uppercase and lowercase, just flip the 6th bit (add or subtract 32). 
                    For example: 'A' (65) + 32 = 'a' (97). This works because the designers intentionally 
                    placed uppercase and lowercase letters 32 positions apart.
                  </p>
                </div>

                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                  <h4 className="font-semibold text-cyan-900 mb-2">Digit to Number Conversion</h4>
                  <p className="text-sm text-cyan-800">
                    To convert the character '5' to the number 5, subtract 48 (ASCII code of '0'). 
                    This is why '0' starts at 48: '5' (53) - 48 = 5. This pattern works for all digits 0-9.
                  </p>
                </div>

                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                  <h4 className="font-semibold text-cyan-900 mb-2">Historical Origin</h4>
                  <p className="text-sm text-cyan-800">
                    ASCII was developed in the 1960s for teletype machines. The code 127 (DEL) was designed 
                    to erase mistakes on paper tape by punching all holes, allowing the tape to be physically 
                    cut and spliced.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Frequently Asked Questions
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What's the difference between ASCII and UTF-8?</h4>
                  <p>
                    ASCII is a 7-bit encoding supporting 128 characters (0-127). UTF-8 is backward compatible 
                    with ASCII for the first 128 characters, but extends to support over 1 million characters 
                    using 1-4 bytes per character. For English text, ASCII and UTF-8 are identical.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Why does 'A' start at 65, not 1?</h4>
                  <p>
                    The first 32 codes (0-31) are reserved for control characters like newline, tab, and backspace. 
                    Code 32 is space. Printable characters start at 33. The designers placed digits before letters, 
                    so 'A' ended up at 65 (after digits 48-57 and punctuation).
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Can ASCII represent emojis?</h4>
                  <p>
                    No, ASCII cannot represent emojis. Emojis are part of Unicode (typically in the U+1F600 range). 
                    You need UTF-8, UTF-16, or UTF-32 encoding to display emojis. ASCII is limited to basic English 
                    characters, digits, and symbols.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What is extended ASCII?</h4>
                  <p>
                    Extended ASCII uses 8 bits instead of 7, supporting 256 characters (0-255). Characters 128-255 
                    vary by encoding (ISO-8859-1, Windows-1252, etc.) and include accented letters and symbols. 
                    However, extended ASCII is largely obsolete, replaced by Unicode.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">How do I type ASCII characters by code?</h4>
                  <p>
                    On Windows, hold Alt and type the decimal code on the numpad (e.g., Alt+65 = A). On Mac, 
                    it's more complex and varies by character. On Linux, use Ctrl+Shift+U followed by the hex 
                    code. Most modern systems use Unicode input methods instead.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Why is the space character code 32?</h4>
                  <p>
                    Code 32 is perfectly positioned: it's 2^5, making it easy to remember and calculate. It's 
                    also exactly 32 positions before uppercase letters, enabling the uppercase/lowercase 
                    conversion trick. This placement was intentional in ASCII's design.
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
