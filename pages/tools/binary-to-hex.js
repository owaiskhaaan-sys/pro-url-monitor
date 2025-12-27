import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function BinaryToHex() {
  const [binaryInput, setBinaryInput] = useState('');
  const [hexResult, setHexResult] = useState('');
  const [decimalResult, setDecimalResult] = useState('');
  const [octalResult, setOctalResult] = useState('');
  const [error, setError] = useState('');

  const validateBinary = (value) => {
    return /^[01]+$/.test(value);
  };

  const handleConvert = () => {
    setError('');
    setHexResult('');
    setDecimalResult('');
    setOctalResult('');

    if (!binaryInput.trim()) {
      setError('Please enter a binary number');
      return;
    }

    if (!validateBinary(binaryInput)) {
      setError('Please enter a valid binary number (only 0 and 1)');
      return;
    }

    // Convert binary to decimal first, then to hex
    const decimal = parseInt(binaryInput, 2);
    
    setHexResult(decimal.toString(16).toUpperCase());
    setDecimalResult(decimal.toString());
    setOctalResult(decimal.toString(8));
  };

  const handleReset = () => {
    setBinaryInput('');
    setHexResult('');
    setDecimalResult('');
    setOctalResult('');
    setError('');
  };

  return (
    <Layout>
      <Head>
        <title>Binary to Hex Converter - Free Online Tool | ProURLMonitor</title>
        <meta name="description" content="Convert binary numbers to hexadecimal instantly with our free online binary to hex converter. Get results in hexadecimal, decimal, and octal formats with step-by-step conversion guide." />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4 text-center">Binary to Hex Converter</h1>
        <p className="text-gray-600 mb-8 text-center">
          Convert binary numbers to hexadecimal format instantly. Enter any binary number and get hex, decimal, and octal results.
        </p>

        <div className="card mb-8">
          {/* Input Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter Binary Number:</label>
            <input
              type="text"
              value={binaryInput}
              onChange={(e) => setBinaryInput(e.target.value)}
              placeholder="e.g., 11111111"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-lg font-mono"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleConvert();
                }
              }}
            />
            <p className="text-xs text-gray-500 mt-1">Only 0 and 1 are allowed</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 justify-center mb-6">
            <button
              onClick={handleConvert}
              className="btn btn-primary px-12 py-3 text-lg"
            >
              Convert to Hex
            </button>
            <button
              onClick={handleReset}
              className="btn bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-3 text-lg"
            >
              Reset
            </button>
          </div>

          {/* Results */}
          {hexResult && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border-2 border-purple-200">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">Hexadecimal Result:</h3>
                <p className="text-3xl font-mono font-bold text-purple-700 break-all">{hexResult}</p>
                <p className="text-sm text-gray-600 mt-2">Binary {binaryInput} = Hex {hexResult}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <h3 className="text-sm font-semibold text-emerald-800 mb-2">Decimal:</h3>
                  <p className="text-2xl font-mono font-bold text-emerald-700">{decimalResult}</p>
                  <p className="text-xs text-gray-600 mt-1">Base 10</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-sm font-semibold text-blue-800 mb-2">Octal:</h3>
                  <p className="text-2xl font-mono font-bold text-blue-700">{octalResult}</p>
                  <p className="text-xs text-gray-600 mt-1">Base 8</p>
                </div>
              </div>

              {/* Conversion Steps */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">📝 How the Conversion Works:</h3>
                <p className="text-sm text-gray-700 mb-2">
                  Binary {binaryInput} converts to hexadecimal through decimal:
                </p>
                <div className="text-sm bg-white p-4 rounded border border-gray-300 space-y-2">
                  <div className="font-semibold text-gray-800">Step 1: Binary to Decimal</div>
                  <div className="font-mono text-xs">
                    {(() => {
                      const bits = binaryInput.split('').reverse();
                      const steps = bits.map((bit, index) => {
                        const power = Math.pow(2, index);
                        const value = bit === '1' ? power : 0;
                        return `(${bit} × 2^${index}) = ${value}`;
                      }).reverse();
                      
                      return (
                        <div>
                          <div>{steps.join(' + ')}</div>
                          <div className="mt-1 font-semibold">= {decimalResult} (decimal)</div>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="font-semibold text-gray-800 mt-3">Step 2: Decimal to Hexadecimal</div>
                  <div className="font-mono text-xs">
                    {decimalResult} in decimal = {hexResult} in hexadecimal
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SEO Content */}
        <div className="prose prose-emerald max-w-none mt-12 space-y-8">
          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">What is Binary to Hex Conversion?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Binary to hexadecimal (hex) conversion</strong> is the process of converting base-2 numbers (binary) to base-16 numbers (hexadecimal). While binary uses only 0 and 1, hexadecimal uses 16 symbols: 0-9 for values 0-9, and A-F for values 10-15. This conversion is extremely common in programming, web development, and computer systems because hex provides a compact way to represent binary data.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Hexadecimal is particularly useful because each hex digit represents exactly 4 binary digits (bits). For example, binary 1111 equals hex F, and binary 11111111 equals hex FF. This 4:1 ratio makes hex much more readable than long strings of binary digits. A color code like #FF5733 in web development is actually hexadecimal representing RGB values: Red=255 (FF), Green=87 (57), Blue=51 (33).
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our free <strong>binary to hex converter</strong> makes this conversion instant and accurate. Simply enter any binary number and get the hexadecimal equivalent immediately, along with decimal and octal representations for comprehensive understanding. For performing calculations on binary numbers, check out our <a href="/tools/binary-calculator" className="text-emerald-600 hover:text-emerald-700 font-medium">Binary Calculator</a> tool.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">How to Convert Binary to Hex Manually</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Understanding the <strong>manual conversion process</strong> helps you grasp the relationship between binary and hexadecimal. Here are two methods:
            </p>
            <div className="bg-emerald-50 p-6 rounded-lg mb-4">
              <h3 className="font-semibold text-emerald-800 mb-3">Method 1: Grouping (Direct Conversion)</h3>
              <ol className="space-y-2 text-gray-700">
                <li><strong>Step 1:</strong> Group binary digits into sets of 4, starting from the right</li>
                <li><strong>Step 2:</strong> If needed, add leading zeros to complete the leftmost group</li>
                <li><strong>Step 3:</strong> Convert each group of 4 bits to its hex equivalent</li>
                <li><strong>Step 4:</strong> Combine all hex digits to get the final result</li>
              </ol>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Example: Convert 11010110 to Hex</strong>
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4 font-mono text-sm">
              <pre className="text-gray-800">
{`Step 1: Group into 4-bit chunks
1101  0110

Step 2: Convert each group
1101 = (8+4+0+1) = 13 = D in hex
0110 = (0+4+2+0) = 6  = 6 in hex

Step 3: Combine
Therefore, 11010110 in binary = D6 in hexadecimal`}
              </pre>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg mb-4">
              <h3 className="font-semibold text-purple-800 mb-3">Method 2: Via Decimal (Alternative)</h3>
              <ol className="space-y-2 text-gray-700">
                <li><strong>Step 1:</strong> Convert binary to decimal first</li>
                <li><strong>Step 2:</strong> Convert the decimal result to hexadecimal</li>
              </ol>
            </div>
            <p className="text-gray-700 leading-relaxed">
              While manual conversion is educational, our online converter saves time and eliminates errors. For the reverse operation, use our <a href="/tools/decimal-to-binary" className="text-emerald-600 hover:text-emerald-700 font-medium">Decimal to Binary Converter</a> or <a href="/tools/binary-to-decimal" className="text-emerald-600 hover:text-emerald-700 font-medium">Binary to Decimal Converter</a> tools.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Binary to Hexadecimal Conversion Table</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              This reference table shows 4-bit binary patterns and their hex equivalents:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-purple-100">
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Binary (4 bits)</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Hexadecimal</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Decimal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono">0000</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">0</td><td className="border border-gray-300 px-4 py-2">0</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono">0001</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">1</td><td className="border border-gray-300 px-4 py-2">1</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono">0010</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">2</td><td className="border border-gray-300 px-4 py-2">2</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono">0011</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">3</td><td className="border border-gray-300 px-4 py-2">3</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono">0100</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">4</td><td className="border border-gray-300 px-4 py-2">4</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono">0101</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">5</td><td className="border border-gray-300 px-4 py-2">5</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono">0110</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">6</td><td className="border border-gray-300 px-4 py-2">6</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono">0111</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">7</td><td className="border border-gray-300 px-4 py-2">7</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono">1000</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">8</td><td className="border border-gray-300 px-4 py-2">8</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono">1001</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">9</td><td className="border border-gray-300 px-4 py-2">9</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono">1010</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">A</td><td className="border border-gray-300 px-4 py-2">10</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono">1011</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">B</td><td className="border border-gray-300 px-4 py-2">11</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono">1100</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">C</td><td className="border border-gray-300 px-4 py-2">12</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono">1101</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">D</td><td className="border border-gray-300 px-4 py-2">13</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono">1110</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">E</td><td className="border border-gray-300 px-4 py-2">14</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono">1111</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">F</td><td className="border border-gray-300 px-4 py-2">15</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Tip:</strong> Memorize this table! Each hex digit (0-F) represents exactly 4 binary bits. This makes converting between binary and hex much faster than going through decimal.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Why Convert Binary to Hexadecimal?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Binary to hex conversion</strong> is essential in many technical fields:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🎨 Web Development</h3>
                <p className="text-sm text-gray-700">HTML color codes use hex (#FF5733). Each pair represents RGB values, which are ultimately binary in computer memory.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">💻 Programming</h3>
                <p className="text-sm text-gray-700">Memory addresses, pointers, and low-level operations often use hex notation for compact representation of binary data.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🔐 Cryptography</h3>
                <p className="text-sm text-gray-700">Encryption keys, hashes (MD5, SHA), and security tokens are displayed in hexadecimal for readability.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🖥️ System Administration</h3>
                <p className="text-sm text-gray-700">MAC addresses, IPv6 addresses, and hardware identifiers use hex format for compact representation.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🐛 Debugging</h3>
                <p className="text-sm text-gray-700">Memory dumps, assembly code, and binary file analysis use hex to make raw data human-readable.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">📱 IoT & Embedded Systems</h3>
                <p className="text-sm text-gray-700">Device IDs, sensor data, and firmware updates often use hex for efficient data transmission.</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Hexadecimal provides the perfect balance between binary's machine-readability and decimal's human-readability. For text encoding, try our <a href="/tools/binary-translator" className="text-emerald-600 hover:text-emerald-700 font-medium">Binary Translator</a> tool.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Common Use Cases for Binary to Hex Conversion</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Here are practical scenarios where <strong>binary to hex conversion</strong> is frequently needed:
            </p>
            <div className="space-y-3">
              <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">🎨 Color Code Generation</h3>
                <p className="text-sm text-gray-700">Convert RGB binary values to hex color codes for CSS, HTML, and graphic design software.</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">🔑 Reading Hash Values</h3>
                <p className="text-sm text-gray-700">Convert binary hash outputs (SHA-256, MD5) to hex strings for comparison and verification.</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">📡 Network Configuration</h3>
                <p className="text-sm text-gray-700">Convert binary MAC addresses and IPv6 addresses to standard hex notation.</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">💾 File Format Analysis</h3>
                <p className="text-sm text-gray-700">Read file headers and magic numbers in hex editors when analyzing binary file structures.</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">🔧 Embedded Programming</h3>
                <p className="text-sm text-gray-700">Convert binary register values to hex for Arduino, Raspberry Pi, and microcontroller programming.</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Understanding Hexadecimal Number System</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The <strong>hexadecimal number system</strong> (base-16) uses 16 distinct symbols:
            </p>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg mb-4">
              <h3 className="font-semibold text-purple-800 mb-3">Hex Digit Values:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="bg-white p-2 rounded border border-purple-200">
                  <strong>0-9:</strong> Same as decimal (0-9)
                </div>
                <div className="bg-white p-2 rounded border border-purple-200">
                  <strong>A:</strong> Represents 10
                </div>
                <div className="bg-white p-2 rounded border border-purple-200">
                  <strong>B:</strong> Represents 11
                </div>
                <div className="bg-white p-2 rounded border border-purple-200">
                  <strong>C:</strong> Represents 12
                </div>
                <div className="bg-white p-2 rounded border border-purple-200">
                  <strong>D:</strong> Represents 13
                </div>
                <div className="bg-white p-2 rounded border border-purple-200">
                  <strong>E:</strong> Represents 14
                </div>
                <div className="bg-white p-2 rounded border border-purple-200">
                  <strong>F:</strong> Represents 15
                </div>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Why Hexadecimal is Perfect for Binary:</strong>
            </p>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li><strong>• Compact Representation:</strong> One hex digit = 4 binary bits (1 nibble)</li>
              <li><strong>• Easy Conversion:</strong> Direct mapping between 4-bit groups and hex digits</li>
              <li><strong>• Human-Readable:</strong> Much shorter than binary (FF vs 11111111)</li>
              <li><strong>• Industry Standard:</strong> Universally used in computing for memory, colors, and data</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Example: 8-bit binary 11010110 becomes 2-digit hex D6, which is much easier to read and remember.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Hex Color Codes Explained</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              One of the most common uses of <strong>binary to hex conversion</strong> is in web color codes:
            </p>
            <div className="bg-gradient-to-r from-red-50 via-green-50 to-blue-50 p-6 rounded-lg mb-4">
              <h3 className="font-semibold text-gray-800 mb-3">How Hex Color Codes Work:</h3>
              <p className="text-sm text-gray-700 mb-3">
                A hex color code like <strong>#FF5733</strong> consists of three pairs:
              </p>
              <div className="space-y-2 text-sm font-mono">
                <div className="bg-red-100 p-2 rounded border-l-4 border-red-500">
                  <strong>FF</strong> = Red channel (255 in decimal, 11111111 in binary)
                </div>
                <div className="bg-green-100 p-2 rounded border-l-4 border-green-500">
                  <strong>57</strong> = Green channel (87 in decimal, 01010111 in binary)
                </div>
                <div className="bg-blue-100 p-2 rounded border-l-4 border-blue-500">
                  <strong>33</strong> = Blue channel (51 in decimal, 00110011 in binary)
                </div>
              </div>
              <p className="text-sm text-gray-700 mt-3">
                Each channel ranges from 00 (minimum) to FF (maximum), giving 256 levels per color and 16.7 million total colors!
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Use our converter to understand how binary RGB values translate to the hex color codes you use in web design and CSS.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Benefits of Using Our Online Converter</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              ProURLMonitor's <strong>free binary to hex converter</strong> offers multiple advantages:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Instant Conversion:</strong> Convert any binary number to hex in milliseconds without manual calculations.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Multiple Formats:</strong> Get hex, decimal, and octal results simultaneously for comprehensive conversion.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Step-by-Step Breakdown:</strong> See exactly how the conversion works with detailed calculation steps.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Input Validation:</strong> Automatically checks that your input contains only valid binary digits (0 and 1).</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>No Length Restrictions:</strong> Convert binary numbers of any length within JavaScript's safe integer range.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>100% Free:</strong> No registration, downloads, or hidden costs. Use unlimited times completely free.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Mobile Responsive:</strong> Works perfectly on desktop, laptop, tablet, and smartphone devices.</span>
              </li>
            </ul>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Related Number System Conversion Tools</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Explore our complete suite of number system converters for all your conversion needs:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/binary-to-decimal" className="hover:text-emerald-600">🔄 Binary to Decimal Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert binary numbers to decimal format for human-readable values.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/decimal-to-binary" className="hover:text-emerald-600">🔢 Decimal to Binary Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert decimal numbers to binary format for computer operations.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/binary-calculator" className="hover:text-emerald-600">🧮 Binary Calculator</a>
                </h3>
                <p className="text-sm text-gray-700">Perform addition, subtraction, multiplication, and division on binary numbers.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/binary-translator" className="hover:text-emerald-600">🔤 Binary Translator</a>
                </h3>
                <p className="text-sm text-gray-700">Convert text to binary code and decode binary back to readable text.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/hex-to-binary" className="hover:text-emerald-600">🔄 Hex to Binary Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert hexadecimal numbers to binary format—perfect for analyzing hex color codes and memory addresses.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/binary-to-octal" className="hover:text-emerald-600">🔢 Binary to Octal Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert binary numbers to octal format—essential for Unix file permissions.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/octal-to-binary" className="hover:text-emerald-600">🔄 Octal to Binary Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert octal numbers to binary—perfect for understanding chmod file permissions.</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">📚 Frequently Asked Questions (FAQs)</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: How do I convert 11111111 to hex?</h3>
                <p className="text-gray-700 text-sm">A: Binary 11111111 equals hex FF. Split it into two 4-bit groups: 1111 = F and 1111 = F, giving FF (255 in decimal).</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What is the hex value of binary 1010?</h3>
                <p className="text-gray-700 text-sm">A: Binary 1010 equals hex A. The 4-bit pattern 1010 represents 10 in decimal, which is A in hexadecimal.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Why do programmers use hexadecimal instead of binary?</h3>
                <p className="text-gray-700 text-sm">A: Hex is much more compact and readable than binary. For example, 11111111 in binary is simply FF in hex—easier to read, write, and remember.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: How many binary bits does one hex digit represent?</h3>
                <p className="text-gray-700 text-sm">A: One hex digit represents exactly 4 binary bits (a nibble). This perfect 4:1 ratio makes conversion between binary and hex straightforward.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What if my binary number isn't divisible by 4?</h3>
                <p className="text-gray-700 text-sm">A: Add leading zeros to the left until you have a multiple of 4 bits. For example, 101 becomes 0101, which converts to hex 5.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Can I convert large binary numbers to hex?</h3>
                <p className="text-gray-700 text-sm">A: Yes! You can convert binary numbers up to JavaScript's safe integer limit (53 bits), which is more than enough for most applications.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Is hexadecimal case-sensitive?</h3>
                <p className="text-gray-700 text-sm">A: No, hex values are not case-sensitive. FF, ff, Ff, and fF all represent the same value. Our converter displays results in uppercase for consistency.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: How do I use hex in web colors?</h3>
                <p className="text-gray-700 text-sm">A: Web colors use #RRGGBB format. Each pair is a hex value (00-FF) representing Red, Green, and Blue intensity. For example, #FF0000 is pure red.</p>
              </div>
            </div>
          </div>

          <div className="card bg-purple-700 text-white">
            <h2 className="text-2xl font-bold mb-4">🚀 Start Converting Binary to Hex Now!</h2>
            <p className="mb-4">
              Use our <strong>free binary to hex converter</strong> to convert any binary number instantly. Perfect for web developers, programmers, students, and anyone working with hexadecimal data. Get results in hex, decimal, and octal formats with detailed conversion steps.
            </p>
            <p className="mb-4">
              No registration required. Unlimited conversions. Completely free forever!
            </p>
            <p className="font-semibold">
              Explore more conversion tools: <a href="/tools/binary-to-decimal" className="text-purple-100 hover:text-white underline">Binary to Decimal</a> • <a href="/tools/decimal-to-binary" className="text-purple-100 hover:text-white underline">Decimal to Binary</a> • <a href="/tools/binary-calculator" className="text-purple-100 hover:text-white underline">Binary Calculator</a> 🎯
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
