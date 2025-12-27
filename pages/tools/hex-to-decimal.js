import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function HexToDecimal() {
  const [hexInput, setHexInput] = useState('');
  const [decimalResult, setDecimalResult] = useState('');
  const [binaryResult, setBinaryResult] = useState('');
  const [octalResult, setOctalResult] = useState('');
  const [error, setError] = useState('');

  const validateHex = (value) => {
    return /^[0-9A-Fa-f]+$/.test(value);
  };

  const handleConvert = () => {
    setError('');
    setDecimalResult('');
    setBinaryResult('');
    setOctalResult('');

    if (!hexInput.trim()) {
      setError('Please enter a hexadecimal number');
      return;
    }

    if (!validateHex(hexInput)) {
      setError('Please enter a valid hex number (0-9, A-F)');
      return;
    }

    const decimal = parseInt(hexInput, 16);
    setDecimalResult(decimal.toString());
    setBinaryResult(decimal.toString(2));
    setOctalResult(decimal.toString(8));
  };

  const handleReset = () => {
    setHexInput('');
    setDecimalResult('');
    setBinaryResult('');
    setOctalResult('');
    setError('');
  };

  return (
    <Layout>
      <Head>
        <title>Hex to Decimal Converter - Free Online Tool | ProURLMonitor</title>
        <meta name="description" content="Convert hexadecimal to decimal instantly with our free online hex to decimal converter. Get results in decimal, binary, and octal formats with step-by-step conversion guide." />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4 text-center">Hex to Decimal Converter</h1>
        <p className="text-gray-600 mb-8 text-center">
          Convert hexadecimal numbers to decimal format instantly. Enter any hex number and get decimal, binary, and octal results.
        </p>

        <div className="card mb-8">
          {/* Input Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter Hexadecimal Number:</label>
            <input
              type="text"
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value.toUpperCase())}
              placeholder="e.g., FF or 1A3B"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-lg font-mono uppercase"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleConvert();
                }
              }}
            />
            <p className="text-xs text-gray-500 mt-1">Enter hex digits 0-9, A-F (without 0x prefix)</p>
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
              Convert to Decimal
            </button>
            <button
              onClick={handleReset}
              className="btn bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-3 text-lg"
            >
              Reset
            </button>
          </div>

          {/* Results */}
          {decimalResult && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Decimal Result:</h3>
                <p className="text-3xl font-mono font-bold text-blue-700 break-all">{decimalResult}</p>
                <p className="text-sm text-gray-600 mt-2">Hex {hexInput} = Decimal {decimalResult}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <h3 className="text-sm font-semibold text-emerald-800 mb-2">Binary:</h3>
                  <p className="text-2xl font-mono font-bold text-emerald-700 break-all">{binaryResult}</p>
                  <p className="text-xs text-gray-600 mt-1">Base 2</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="text-sm font-semibold text-purple-800 mb-2">Octal:</h3>
                  <p className="text-2xl font-mono font-bold text-purple-700">{octalResult}</p>
                  <p className="text-xs text-gray-600 mt-1">Base 8</p>
                </div>
              </div>

              {/* Conversion Steps */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">📝 How the Conversion Works:</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Hexadecimal {hexInput} converts to decimal using positional notation:
                </p>
                <div className="text-sm bg-white p-4 rounded border border-gray-300 space-y-2">
                  <div className="font-mono text-xs">
                    {(() => {
                      const hexChars = hexInput.split('');
                      const positions = hexChars.map((char, idx) => {
                        const position = hexChars.length - 1 - idx;
                        const value = parseInt(char, 16);
                        const power = Math.pow(16, position);
                        const contribution = value * power;
                        return { char, position, value, power, contribution };
                      });

                      return (
                        <div className="space-y-2">
                          <div className="font-semibold mb-3">Positional value calculation (right to left):</div>
                          {positions.reverse().map((pos, idx) => (
                            <div key={idx} className="border-b pb-2">
                              <div>Position {pos.position}: {pos.char} × 16^{pos.position}</div>
                              <div className="text-gray-600 ml-4">= {pos.value} × {pos.power}</div>
                              <div className="text-blue-700 font-semibold ml-4">= {pos.contribution}</div>
                            </div>
                          ))}
                          <div className="mt-4 pt-3 border-t-2 border-gray-400 font-semibold text-base">
                            Total: {positions.map(p => p.contribution).join(' + ')} = {decimalResult}
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
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">What is Hex to Decimal Conversion?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Hex to decimal conversion</strong> is the process of converting base-16 numbers (hexadecimal) to base-10 numbers (decimal). Hexadecimal uses digits 0-9 and A-F (where A=10, B=11, C=12, D=13, E=14, F=15), while decimal uses only 0-9. This conversion is crucial when working with color codes, memory addresses, and computer data representation.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              For example, hexadecimal FF equals decimal 255. The conversion works by multiplying each hex digit by its positional value (powers of 16): F×16¹ + F×16⁰ = 15×16 + 15×1 = 240 + 15 = 255. Hexadecimal is widely used in programming because it provides a compact way to represent binary data—each hex digit represents exactly 4 binary bits.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our free <strong>hex to decimal converter</strong> makes this conversion instant and accurate. Simply enter any hexadecimal number and get the decimal equivalent immediately, along with binary and octal representations. For the reverse operation, use our <a href="/tools/decimal-to-hex" className="text-emerald-600 hover:text-emerald-700 font-medium">Decimal to Hex Converter</a> tool.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">How to Convert Hex to Decimal Manually</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Understanding the <strong>manual conversion process</strong> using positional notation:
            </p>
            <div className="bg-blue-50 p-6 rounded-lg mb-4">
              <h3 className="font-semibold text-blue-800 mb-3">Positional Notation Method:</h3>
              <ol className="space-y-2 text-gray-700">
                <li><strong>Step 1:</strong> Write down the hex number</li>
                <li><strong>Step 2:</strong> Assign positions from right to left (starting at 0)</li>
                <li><strong>Step 3:</strong> Convert hex digits to decimal (A=10, B=11, C=12, D=13, E=14, F=15)</li>
                <li><strong>Step 4:</strong> Multiply each digit by 16^position</li>
                <li><strong>Step 5:</strong> Add all the results together</li>
              </ol>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Example: Convert 1A3 to Decimal</strong>
            </p>
            <div className="bg-indigo-50 p-4 rounded-lg mb-4 font-mono text-sm">
              <pre className="text-gray-800">
{`Step 1: Identify positions (right to left)
Position:  2   1   0
Hex digit: 1   A   3

Step 2: Convert hex to decimal
1 = 1 (decimal)
A = 10 (decimal)
3 = 3 (decimal)

Step 3: Calculate positional values
Position 2: 1 × 16² = 1 × 256 = 256
Position 1: A × 16¹ = 10 × 16 = 160
Position 0: 3 × 16⁰ = 3 × 1 = 3

Step 4: Add all values
256 + 160 + 3 = 419

Result: 1A3₁₆ = 419₁₀ ✓`}
              </pre>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Remember that each position represents a power of 16, starting from 16⁰ on the right. For other conversions, check our <a href="/tools/hex-to-binary" className="text-emerald-600 hover:text-emerald-700 font-medium">Hex to Binary Converter</a> or <a href="/tools/binary-to-decimal" className="text-emerald-600 hover:text-emerald-700 font-medium">Binary to Decimal Converter</a>.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Hex to Decimal Conversion Table</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              This reference table shows common hexadecimal values and their decimal equivalents:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Hexadecimal</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Decimal</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Common Use</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-blue-700">0</td><td className="border border-gray-300 px-4 py-2 font-mono">0</td><td className="border border-gray-300 px-4 py-2 text-sm">Minimum value</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-blue-700">F</td><td className="border border-gray-300 px-4 py-2 font-mono">15</td><td className="border border-gray-300 px-4 py-2 text-sm">Single digit max</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-blue-700">10</td><td className="border border-gray-300 px-4 py-2 font-mono">16</td><td className="border border-gray-300 px-4 py-2 text-sm">Base value</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-blue-700">FF</td><td className="border border-gray-300 px-4 py-2 font-mono">255</td><td className="border border-gray-300 px-4 py-2 text-sm">Max byte (8-bit)</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-blue-700">100</td><td className="border border-gray-300 px-4 py-2 font-mono">256</td><td className="border border-gray-300 px-4 py-2 text-sm">1 byte + 1</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-blue-700">FFF</td><td className="border border-gray-300 px-4 py-2 font-mono">4095</td><td className="border border-gray-300 px-4 py-2 text-sm">12-bit color max</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-blue-700">FFFF</td><td className="border border-gray-300 px-4 py-2 font-mono">65535</td><td className="border border-gray-300 px-4 py-2 text-sm">Max 16-bit value</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-blue-700">FFFFFF</td><td className="border border-gray-300 px-4 py-2 font-mono">16777215</td><td className="border border-gray-300 px-4 py-2 text-sm">White color</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-blue-700">FF0000</td><td className="border border-gray-300 px-4 py-2 font-mono">16711680</td><td className="border border-gray-300 px-4 py-2 text-sm">Pure red</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-blue-700">00FF00</td><td className="border border-gray-300 px-4 py-2 font-mono">65280</td><td className="border border-gray-300 px-4 py-2 text-sm">Pure green</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Pro Tip:</strong> Hex color codes like #FF5733 can be converted to RGB by converting each 2-digit hex pair: FF=255, 57=87, 33=51.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Why Convert Hex to Decimal?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Hex to decimal conversion</strong> is essential in various computing and development scenarios:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">🎨 Color Code Conversion</h3>
                <p className="text-sm text-gray-700">Convert hex color codes (#FF5733) to RGB decimal values (255, 87, 51) for CSS, graphics software, and design tools.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">💾 Memory Analysis</h3>
                <p className="text-sm text-gray-700">Convert memory addresses from hex (0x400) to decimal (1024) for size calculations and debugging.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">🔐 Data Decoding</h3>
                <p className="text-sm text-gray-700">Decode hexadecimal data dumps, hash values, and encrypted data into readable decimal numbers.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">📊 Network Analysis</h3>
                <p className="text-sm text-gray-700">Convert MAC addresses, IPv6 addresses, and packet data from hex to decimal format.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">🖥️ Programming</h3>
                <p className="text-sm text-gray-700">Understanding hex literals (0xFF) in code by converting to decimal (255) for calculations.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">🐛 Debugging</h3>
                <p className="text-sm text-gray-700">Convert hex error codes, register values, and memory dumps to decimal for analysis.</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              For working with other number systems, try our <a href="/tools/octal-to-decimal" className="text-emerald-600 hover:text-emerald-700 font-medium">Octal to Decimal Converter</a> tool.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Common Hex to Decimal Examples</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Here are practical <strong>hex to decimal conversion examples</strong>:
            </p>
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">🎨 Color Code: #FF5733</h3>
                <p className="text-sm text-gray-700 font-mono">FF = 255, 57 = 87, 33 = 51 → rgb(255, 87, 51)</p>
                <p className="text-xs text-gray-600 mt-1">Vibrant orange-red color</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">💾 Memory Address: 0x400</h3>
                <p className="text-sm text-gray-700 font-mono">400₁₆ = 1024₁₀ (1 KB)</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">📡 MAC Address Part: C0</h3>
                <p className="text-sm text-gray-700 font-mono">C0₁₆ = 192₁₀ (common in networking)</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">🔐 Hash Digest: 7E9</h3>
                <p className="text-sm text-gray-700 font-mono">7E9₁₆ = 2025₁₀</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">⚪ White: #FFFFFF</h3>
                <p className="text-sm text-gray-700 font-mono">FFFFFF₁₆ = 16777215₁₀ → rgb(255, 255, 255)</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Benefits of Using Our Online Converter</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              ProURLMonitor's <strong>free hex to decimal converter</strong> offers multiple advantages:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Instant Conversion:</strong> Convert any hexadecimal number to decimal in milliseconds.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Multiple Formats:</strong> Get decimal, binary, and octal results simultaneously.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Step-by-Step Breakdown:</strong> See the positional notation calculation in detail.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Input Validation:</strong> Automatically checks for valid hex digits (0-9, A-F).</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Perfect for Colors:</strong> Quickly convert hex color codes to RGB decimal values.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>100% Free:</strong> No registration, downloads, or hidden costs.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Mobile Friendly:</strong> Works seamlessly on all devices.</span>
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
                  <a href="/tools/decimal-to-hex" className="hover:text-emerald-600">🔄 Decimal to Hex Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert decimal numbers to hexadecimal format—the reverse of this tool.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/hex-to-binary" className="hover:text-emerald-600">🔷 Hex to Binary Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert hexadecimal to binary format for low-level operations.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/binary-to-hex" className="hover:text-emerald-600">📊 Binary to Hex Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert binary numbers to hexadecimal format.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/binary-to-decimal" className="hover:text-emerald-600">🔢 Binary to Decimal Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert binary to decimal—essential for understanding binary numbers.</p>
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
                <h3 className="font-semibold text-gray-800 mb-2">Q: How do I convert FF to decimal?</h3>
                <p className="text-gray-700 text-sm">A: F×16¹ + F×16⁰ = 15×16 + 15×1 = 240 + 15 = 255. Each F equals 15 in decimal.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What is hex A in decimal?</h3>
                <p className="text-gray-700 text-sm">A: Hex A equals decimal 10. The hex digits A-F represent decimal values 10-15 respectively.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: How to convert hex color codes to RGB?</h3>
                <p className="text-gray-700 text-sm">A: Split the 6-digit code into three 2-digit pairs. Convert each pair separately: #FF5733 → FF=255, 57=87, 33=51 → rgb(255,87,51).</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Is hex 100 equal to decimal 100?</h3>
                <p className="text-gray-700 text-sm">A: No, hex 100 equals decimal 256. Calculate: 1×16² + 0×16¹ + 0×16⁰ = 256 + 0 + 0 = 256.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What's the decimal value of FFFF?</h3>
                <p className="text-gray-700 text-sm">A: Hex FFFF equals decimal 65535, which is the maximum value for a 16-bit unsigned integer.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Do I need to include 0x prefix?</h3>
                <p className="text-gray-700 text-sm">A: No, our converter works without the 0x prefix. Just enter the hex digits directly (e.g., FF instead of 0xFF).</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Are lowercase hex letters valid?</h3>
                <p className="text-gray-700 text-sm">A: Yes, hex is case-insensitive. Our converter automatically converts to uppercase for consistency. FF and ff both equal 255.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What's the largest hex value I can convert?</h3>
                <p className="text-gray-700 text-sm">A: You can convert hex numbers up to JavaScript's safe integer limit. This is more than sufficient for all practical applications including color codes and memory addresses.</p>
              </div>
            </div>
          </div>

          <div className="card bg-blue-700 text-white">
            <h2 className="text-2xl font-bold mb-4">🚀 Start Converting Hex to Decimal Now!</h2>
            <p className="mb-4">
              Use our <strong>free hex to decimal converter</strong> to convert any hexadecimal number instantly. Perfect for web developers working with color codes, programmers analyzing memory dumps, network engineers decoding MAC addresses, and students learning number systems. Get results in decimal, binary, and octal formats with detailed positional notation breakdown.
            </p>
            <p className="mb-4">
              No registration required. Unlimited conversions. Completely free forever!
            </p>
            <p className="font-semibold">
              Explore more tools: <a href="/tools/decimal-to-hex" className="text-blue-100 hover:text-white underline">Decimal to Hex</a> • <a href="/tools/binary-calculator" className="text-blue-100 hover:text-white underline">Binary Calculator</a> • <a href="/tools/hex-to-binary" className="text-blue-100 hover:text-white underline">Hex to Binary</a> 🎯
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
