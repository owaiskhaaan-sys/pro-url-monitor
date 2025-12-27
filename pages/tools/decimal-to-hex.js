import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function DecimalToHex() {
  const [decimalInput, setDecimalInput] = useState('');
  const [hexResult, setHexResult] = useState('');
  const [binaryResult, setBinaryResult] = useState('');
  const [octalResult, setOctalResult] = useState('');
  const [error, setError] = useState('');

  const validateDecimal = (value) => {
    return /^-?\d+$/.test(value);
  };

  const handleConvert = () => {
    setError('');
    setHexResult('');
    setBinaryResult('');
    setOctalResult('');

    if (!decimalInput.trim()) {
      setError('Please enter a decimal number');
      return;
    }

    if (!validateDecimal(decimalInput)) {
      setError('Please enter a valid decimal number');
      return;
    }

    const decimal = parseInt(decimalInput, 10);

    if (decimal < 0) {
      setError('Please enter a positive decimal number');
      return;
    }

    setHexResult(decimal.toString(16).toUpperCase());
    setBinaryResult(decimal.toString(2));
    setOctalResult(decimal.toString(8));
  };

  const handleReset = () => {
    setDecimalInput('');
    setHexResult('');
    setBinaryResult('');
    setOctalResult('');
    setError('');
  };

  return (
    <Layout>
      <Head>
        <title>Decimal to Hex Converter - Free Online Tool | ProURLMonitor</title>
        <meta name="description" content="Convert decimal numbers to hexadecimal instantly with our free online decimal to hex converter. Get results in hex, binary, and octal formats with step-by-step conversion guide." />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4 text-center">Decimal to Hex Converter</h1>
        <p className="text-gray-600 mb-8 text-center">
          Convert decimal numbers to hexadecimal format instantly. Enter any decimal number and get hex, binary, and octal results.
        </p>

        <div className="card mb-8">
          {/* Input Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter Decimal Number:</label>
            <input
              type="text"
              value={decimalInput}
              onChange={(e) => setDecimalInput(e.target.value)}
              placeholder="e.g., 255 or 1024"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-lg font-mono"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleConvert();
                }
              }}
            />
            <p className="text-xs text-gray-500 mt-1">Enter any positive decimal number</p>
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
                <p className="text-sm text-gray-600 mt-2">Decimal {decimalInput} = Hex {hexResult}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <h3 className="text-sm font-semibold text-emerald-800 mb-2">Binary:</h3>
                  <p className="text-2xl font-mono font-bold text-emerald-700 break-all">{binaryResult}</p>
                  <p className="text-xs text-gray-600 mt-1">Base 2</p>
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
                <p className="text-sm text-gray-700 mb-3">
                  Decimal {decimalInput} converts to hexadecimal by repeatedly dividing by 16:
                </p>
                <div className="text-sm bg-white p-4 rounded border border-gray-300 space-y-2">
                  <div className="font-mono text-xs">
                    {(() => {
                      const decimal = parseInt(decimalInput, 10);
                      const steps = [];
                      let num = decimal;
                      
                      if (num === 0) {
                        return <div>0 in decimal = 0 in hexadecimal</div>;
                      }
                      
                      while (num > 0) {
                        const remainder = num % 16;
                        const hexDigit = remainder.toString(16).toUpperCase();
                        steps.push(`${num} ÷ 16 = ${Math.floor(num / 16)} remainder ${remainder} (${hexDigit})`);
                        num = Math.floor(num / 16);
                      }
                      
                      return (
                        <div className="space-y-1">
                          <div className="font-semibold mb-2">Division steps (read remainders bottom to top):</div>
                          {steps.map((step, idx) => (
                            <div key={idx}>{step}</div>
                          ))}
                          <div className="mt-3 pt-3 border-t border-gray-300 font-semibold">
                            Read remainders from bottom to top: {hexResult}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SEO Content */}
        <div className="prose prose-emerald max-w-none mt-12 space-y-8">
          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">What is Decimal to Hex Conversion?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Decimal to hexadecimal conversion</strong> is the process of converting base-10 numbers (decimal) to base-16 numbers (hexadecimal). Decimal uses digits 0-9, while hexadecimal uses 0-9 and A-F (where A=10, B=11, C=12, D=13, E=14, F=15). This conversion is essential in programming, web design, and computer systems.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              For example, decimal 255 equals hexadecimal FF. The conversion works by repeatedly dividing the decimal number by 16 and recording the remainders: 255 ÷ 16 = 15 remainder 15 (F), 15 ÷ 16 = 0 remainder 15 (F), giving FF. Hexadecimal is widely used for color codes (#FF5733), memory addresses, and representing binary data compactly.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our free <strong>decimal to hex converter</strong> makes this conversion instant and accurate. Simply enter any decimal number and get the hexadecimal equivalent immediately, along with binary and octal representations. For the reverse operation, use our <a href="/tools/hex-to-decimal" className="text-emerald-600 hover:text-emerald-700 font-medium">Hex to Decimal Converter</a> tool.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">How to Convert Decimal to Hex Manually</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Understanding the <strong>manual conversion process</strong> using the division method:
            </p>
            <div className="bg-purple-50 p-6 rounded-lg mb-4">
              <h3 className="font-semibold text-purple-800 mb-3">Division Method:</h3>
              <ol className="space-y-2 text-gray-700">
                <li><strong>Step 1:</strong> Divide the decimal number by 16</li>
                <li><strong>Step 2:</strong> Record the remainder (convert to hex if ≥10: A=10, B=11, C=12, D=13, E=14, F=15)</li>
                <li><strong>Step 3:</strong> Divide the quotient by 16 and repeat</li>
                <li><strong>Step 4:</strong> Continue until quotient is 0</li>
                <li><strong>Step 5:</strong> Read all remainders from bottom to top</li>
              </ol>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Example: Convert 254 to Hexadecimal</strong>
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4 font-mono text-sm">
              <pre className="text-gray-800">
{`Step 1: Divide by 16
254 ÷ 16 = 15 remainder 14 (E)

Step 2: Continue with quotient
15 ÷ 16 = 0 remainder 15 (F)

Step 3: Read remainders bottom to top
F E

Result: 254₁₀ = FE₁₆

Verification:
(F × 16¹) + (E × 16⁰)
= (15 × 16) + (14 × 1)
= 240 + 14
= 254 ✓`}
              </pre>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Remember to convert remainders 10-15 to A-F. For other conversions, check our <a href="/tools/decimal-to-binary" className="text-emerald-600 hover:text-emerald-700 font-medium">Decimal to Binary Converter</a> or <a href="/tools/binary-to-hex" className="text-emerald-600 hover:text-emerald-700 font-medium">Binary to Hex Converter</a>.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Decimal to Hex Conversion Table</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              This reference table shows common decimal values and their hexadecimal equivalents:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-purple-100">
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Decimal</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Hexadecimal</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Common Use</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono">0</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">0</td><td className="border border-gray-300 px-4 py-2 text-sm">Black color</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono">15</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">F</td><td className="border border-gray-300 px-4 py-2 text-sm">Single hex digit max</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono">16</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">10</td><td className="border border-gray-300 px-4 py-2 text-sm">Base value</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono">255</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">FF</td><td className="border border-gray-300 px-4 py-2 text-sm">Max byte value</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono">256</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">100</td><td className="border border-gray-300 px-4 py-2 text-sm">1 byte + 1</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono">4095</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">FFF</td><td className="border border-gray-300 px-4 py-2 text-sm">12-bit max</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono">16777215</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">FFFFFF</td><td className="border border-gray-300 px-4 py-2 text-sm">White color (RGB)</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono">16711680</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">FF0000</td><td className="border border-gray-300 px-4 py-2 text-sm">Pure red</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono">65280</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">00FF00</td><td className="border border-gray-300 px-4 py-2 text-sm">Pure green</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono">255</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">0000FF</td><td className="border border-gray-300 px-4 py-2 text-sm">Pure blue</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Pro Tip:</strong> Hex color codes combine three hex values (RR GG BB) for red, green, and blue channels.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Why Convert Decimal to Hex?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Decimal to hex conversion</strong> is essential in various computing scenarios:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🎨 Web Design Colors</h3>
                <p className="text-sm text-gray-700">Convert RGB decimal values (255, 128, 64) to hex color codes (#FF8040) for CSS and HTML.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">💻 Memory Addresses</h3>
                <p className="text-sm text-gray-700">Computer memory addresses are displayed in hexadecimal for compact representation.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🔧 Programming</h3>
                <p className="text-sm text-gray-700">Hex notation (0xFF) is used in code for clarity when working with bytes and bit masks.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">📡 Network Protocols</h3>
                <p className="text-sm text-gray-700">MAC addresses, IP addresses, and packet data use hexadecimal representation.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🔐 Cryptography</h3>
                <p className="text-sm text-gray-700">Hash values, keys, and encrypted data are typically displayed in hexadecimal.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🐛 Debugging</h3>
                <p className="text-sm text-gray-700">Memory dumps and low-level debugging use hex for easier reading than binary.</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              For performing calculations on hex numbers, use our <a href="/tools/binary-calculator" className="text-emerald-600 hover:text-emerald-700 font-medium">Binary Calculator</a> tool.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Common Decimal to Hex Examples</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Here are practical <strong>decimal to hex conversion examples</strong>:
            </p>
            <div className="space-y-3">
              <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">🎨 RGB Color: rgb(255, 87, 51)</h3>
                <p className="text-sm text-gray-700 font-mono">255 = FF, 87 = 57, 51 = 33 → #FF5733</p>
                <p className="text-xs text-gray-600 mt-1">Vibrant orange-red color</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">💾 Memory Size: 1024 bytes</h3>
                <p className="text-sm text-gray-700 font-mono">1024₁₀ = 400₁₆ (1 KB in hex)</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">🔢 Year 2025</h3>
                <p className="text-sm text-gray-700 font-mono">2025₁₀ = 7E9₁₆</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">📱 IPv4 Address Component: 192</h3>
                <p className="text-sm text-gray-700 font-mono">192₁₀ = C0₁₆ (common in 192.168.x.x)</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">⚪ White Color</h3>
                <p className="text-sm text-gray-700 font-mono">16777215₁₀ = FFFFFF₁₆ (rgb(255,255,255))</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Benefits of Using Our Online Converter</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              ProURLMonitor's <strong>free decimal to hex converter</strong> offers multiple advantages:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Instant Conversion:</strong> Convert any decimal number to hex in milliseconds.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Multiple Formats:</strong> Get hex, binary, and octal results simultaneously.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Step-by-Step Process:</strong> See the division method with remainders.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Input Validation:</strong> Automatically checks for valid decimal numbers.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Perfect for Colors:</strong> Convert RGB values to hex color codes instantly.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>100% Free:</strong> No registration, downloads, or hidden costs.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Mobile Friendly:</strong> Works on all devices.</span>
              </li>
            </ul>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Related Binary Conversion Tools</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Explore our complete suite of binary and number system converters:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/hex-to-decimal" className="hover:text-emerald-600">🔄 Hex to Decimal Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert hexadecimal numbers to decimal format—the reverse of this tool.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/decimal-to-binary" className="hover:text-emerald-600">📊 Decimal to Binary Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert decimal numbers to binary format for computer operations.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/binary-to-hex" className="hover:text-emerald-600">🔷 Binary to Hex Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert binary numbers to hexadecimal format.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/hex-to-binary" className="hover:text-emerald-600">🔄 Hex to Binary Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert hexadecimal to binary—perfect for analyzing hex codes.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/binary-calculator" className="hover:text-emerald-600">🧮 Binary Calculator</a>
                </h3>
                <p className="text-sm text-gray-700">Perform arithmetic operations on binary numbers.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/binary-translator" className="hover:text-emerald-600">🔤 Binary Translator</a>
                </h3>
                <p className="text-sm text-gray-700">Convert text to binary code and decode binary back to text.</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">📚 Frequently Asked Questions (FAQs)</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: How do I convert 255 to hex?</h3>
                <p className="text-gray-700 text-sm">A: 255 ÷ 16 = 15 remainder 15 (F), 15 ÷ 16 = 0 remainder 15 (F). Read bottom to top: FF.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What hex value represents decimal 10?</h3>
                <p className="text-gray-700 text-sm">A: Decimal 10 equals hex A. In hexadecimal: A=10, B=11, C=12, D=13, E=14, F=15.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: How to convert RGB colors to hex?</h3>
                <p className="text-gray-700 text-sm">A: Convert each RGB value (0-255) to hex separately. Example: rgb(255,87,51) → FF, 57, 33 → #FF5733.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Why use hex instead of decimal?</h3>
                <p className="text-gray-700 text-sm">A: Hex is more compact than binary and aligns perfectly with bytes (2 hex digits = 1 byte = 8 bits). It's easier for humans to read than binary.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What's the hex value for 1024?</h3>
                <p className="text-gray-700 text-sm">A: Decimal 1024 = Hex 400. This is commonly seen in memory addressing (1 KB = 0x400 bytes).</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Can I convert negative numbers?</h3>
                <p className="text-gray-700 text-sm">A: Our converter works with positive numbers. For negative numbers, use two's complement representation with a specified bit width.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Is hex case-sensitive?</h3>
                <p className="text-gray-700 text-sm">A: No, hex is not case-sensitive. FF, ff, Ff, and fF all represent 255. Our converter outputs uppercase for consistency.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What's the maximum decimal value I can convert?</h3>
                <p className="text-gray-700 text-sm">A: You can convert decimal numbers up to JavaScript's safe integer limit (2⁵³ - 1), which is more than sufficient for all practical applications.</p>
              </div>
            </div>
          </div>

          <div className="card bg-purple-700 text-white">
            <h2 className="text-2xl font-bold mb-4">🚀 Start Converting Decimal to Hex Now!</h2>
            <p className="mb-4">
              Use our <strong>free decimal to hex converter</strong> to convert any decimal number instantly. Perfect for web developers creating color codes, programmers working with memory addresses, students learning number systems, and anyone needing hexadecimal conversion. Get results in hex, binary, and octal formats with detailed step-by-step breakdown.
            </p>
            <p className="mb-4">
              No registration required. Unlimited conversions. Completely free forever!
            </p>
            <p className="font-semibold">
              Explore more tools: <a href="/tools/hex-to-decimal" className="text-purple-100 hover:text-white underline">Hex to Decimal</a> • <a href="/tools/binary-calculator" className="text-purple-100 hover:text-white underline">Binary Calculator</a> • <a href="/tools/decimal-to-binary" className="text-purple-100 hover:text-white underline">Decimal to Binary</a> 🎯
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
