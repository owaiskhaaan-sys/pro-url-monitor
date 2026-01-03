import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function BinaryToOctal() {
  const [binaryInput, setBinaryInput] = useState('');
  const [octalResult, setOctalResult] = useState('');
  const [decimalResult, setDecimalResult] = useState('');
  const [hexResult, setHexResult] = useState('');
  const [error, setError] = useState('');

  const validateBinary = (value) => {
    return /^[01]+$/.test(value);
  };

  const handleConvert = () => {
    setError('');
    setOctalResult('');
    setDecimalResult('');
    setHexResult('');

    if (!binaryInput.trim()) {
      setError('Please enter a binary number');
      return;
    }

    if (!validateBinary(binaryInput)) {
      setError('Please enter a valid binary number (only 0 and 1)');
      return;
    }

    // Convert binary to decimal first, then to other bases
    const decimal = parseInt(binaryInput, 2);
    
    setOctalResult(decimal.toString(8));
    setDecimalResult(decimal.toString());
    setHexResult(decimal.toString(16).toUpperCase());
  };

  const handleReset = () => {
    setBinaryInput('');
    setOctalResult('');
    setDecimalResult('');
    setHexResult('');
    setError('');
  };

  return (
    <Layout>
      <Head>
        <title>Binary to Octal Converter - Free Online Tool | ProURLMonitor</title>
        <meta name="description" content="Convert binary numbers to octal instantly with our free online binary to octal converter. Get results in octal, decimal, and hexadecimal formats with..." />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/binary-to-octal" />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4 text-center">Binary to Octal Converter</h1>
        <p className="text-gray-600 mb-8 text-center">
          Convert binary numbers to octal format instantly. Enter any binary number and get octal, decimal, and hexadecimal results.
        </p>

        <div className="card mb-8">
          {/* Input Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter Binary Number:</label>
            <input
              type="text"
              value={binaryInput}
              onChange={(e) => setBinaryInput(e.target.value)}
              placeholder="e.g., 1010 or 11111111"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-lg font-mono"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleConvert();
                }
              }}
            />
            <p className="text-xs text-gray-500 mt-1">Valid characters: 0 and 1 only</p>
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
              Convert to Octal
            </button>
            <button
              onClick={handleReset}
              className="btn bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-3 text-lg"
            >
              Reset
            </button>
          </div>

          {/* Results */}
          {octalResult && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border-2 border-purple-200">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">Octal Result:</h3>
                <p className="text-3xl font-mono font-bold text-purple-700 break-all">{octalResult}</p>
                <p className="text-sm text-gray-600 mt-2">Binary {binaryInput} = Octal {octalResult}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-sm font-semibold text-blue-800 mb-2">Decimal:</h3>
                  <p className="text-2xl font-mono font-bold text-blue-700">{decimalResult}</p>
                  <p className="text-xs text-gray-600 mt-1">Base 10</p>
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <h3 className="text-sm font-semibold text-emerald-800 mb-2">Hexadecimal:</h3>
                  <p className="text-2xl font-mono font-bold text-emerald-700">{hexResult}</p>
                  <p className="text-xs text-gray-600 mt-1">Base 16</p>
                </div>
              </div>

              {/* Conversion Steps */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">📝 How the Conversion Works:</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Binary {binaryInput} converts to octal by grouping from right to left in sets of 3 bits:
                </p>
                <div className="text-sm bg-white p-4 rounded border border-gray-300 space-y-2">
                  <div className="font-mono text-xs">
                    {(() => {
                      // Pad to make it divisible by 3
                      const paddedBinary = binaryInput.padStart(Math.ceil(binaryInput.length / 3) * 3, '0');
                      const groups = [];
                      
                      for (let i = 0; i < paddedBinary.length; i += 3) {
                        groups.push(paddedBinary.substring(i, i + 3));
                      }
                      
                      const conversions = groups.map(group => {
                        const decimal = parseInt(group, 2);
                        return `${group} (binary) = ${decimal} (octal)`;
                      });
                      
                      return (
                        <div className="space-y-1">
                          <div className="font-semibold mb-2">Step 1: Group into 3-bit chunks:</div>
                          <div className="mb-3">{groups.join(' | ')}</div>
                          <div className="font-semibold mb-2">Step 2: Convert each group:</div>
                          {conversions.map((conv, idx) => (
                            <div key={idx}>{conv}</div>
                          ))}
                          <div className="mt-3 pt-3 border-t border-gray-300 font-semibold">
                            Combined Octal: {octalResult}
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
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">What is Binary to Octal Conversion?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Binary to octal conversion</strong> is the process of converting base-2 numbers (binary) to base-8 numbers (octal). Binary uses only 0 and 1, while octal uses digits 0-7. This conversion is straightforward because each octal digit represents exactly 3 binary bits, making it easier than converting through decimal.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              For example, binary 1010 equals octal 12 (10 in decimal). The conversion works by grouping binary digits into sets of three from right to left: 001 010 → 1 2 → 12 in octal. Octal was historically popular in computing before hexadecimal became standard, and it's still used in Unix file permissions (chmod 755) and certain programming contexts.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our free <strong>binary to octal converter</strong> makes this conversion instant and accurate. Simply enter any binary number and get the octal equivalent immediately, along with decimal and hexadecimal representations. For the reverse operation, use our Octal to Binary Converter tool.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">How to Convert Binary to Octal Manually</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Understanding the <strong>manual conversion process</strong> is simple once you know the 3-bit grouping method:
            </p>
            <div className="bg-purple-50 p-6 rounded-lg mb-4">
              <h3 className="font-semibold text-purple-800 mb-3">Direct Conversion Method:</h3>
              <ol className="space-y-2 text-gray-700">
                <li><strong>Step 1:</strong> Write down the binary number</li>
                <li><strong>Step 2:</strong> Group binary digits in sets of 3 from right to left</li>
                <li><strong>Step 3:</strong> Add leading zeros to the leftmost group if needed</li>
                <li><strong>Step 4:</strong> Convert each 3-bit group to its octal equivalent (0-7)</li>
                <li><strong>Step 5:</strong> Combine all octal digits from left to right</li>
              </ol>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Example: Convert 101110 to Octal</strong>
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4 font-mono text-sm">
              <pre className="text-gray-800">
{`Step 1: Original binary number
101110

Step 2: Group into 3-bit chunks from right
101 | 110

Step 3: Convert each group to octal
101 (binary) = 5 (octal)
110 (binary) = 6 (octal)

Step 4: Combine the octal digits
Therefore, 101110 in binary = 56 in octal

Verification (via decimal):
101110₂ = 46₁₀ = 56₈ ✓`}
              </pre>
            </div>
            <p className="text-gray-700 leading-relaxed">
              The key is remembering that 3 binary bits = 1 octal digit. This makes conversion much faster than going through decimal. For other conversions, check our <a href="/tools/binary-to-decimal" className="text-emerald-600 hover:text-emerald-700 font-medium">Binary to Decimal Converter</a> or <a href="/tools/binary-to-hex" className="text-emerald-600 hover:text-emerald-700 font-medium">Binary to Hex Converter</a>.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Binary to Octal Conversion Table</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              This reference table shows all 8 octal digits and their 3-bit binary equivalents:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-purple-100">
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Binary (3 bits)</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Octal</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Decimal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono">000</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">0</td><td className="border border-gray-300 px-4 py-2">0</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono">001</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">1</td><td className="border border-gray-300 px-4 py-2">1</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono">010</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">2</td><td className="border border-gray-300 px-4 py-2">2</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono">011</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">3</td><td className="border border-gray-300 px-4 py-2">3</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono">100</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">4</td><td className="border border-gray-300 px-4 py-2">4</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono">101</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">5</td><td className="border border-gray-300 px-4 py-2">5</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono">110</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">6</td><td className="border border-gray-300 px-4 py-2">6</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono">111</td><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">7</td><td className="border border-gray-300 px-4 py-2">7</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Pro Tip:</strong> Memorize this table! It's essential for quick binary-to-octal conversion and understanding Unix file permissions, which use octal notation (e.g., chmod 755).
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Why Convert Binary to Octal?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Binary to octal conversion</strong> is useful in various computing scenarios:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🔐 Unix File Permissions</h3>
                <p className="text-sm text-gray-700">Setting file permissions with chmod uses octal notation (755, 644) which maps directly to binary permission bits.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">💻 Legacy Computing</h3>
                <p className="text-sm text-gray-700">Older computer systems and assembly language documentation often used octal for representing binary data.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">📊 Data Compression</h3>
                <p className="text-sm text-gray-700">Octal provides a more compact representation than binary (3:1 ratio) while being simpler than hexadecimal.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🔧 Debugging</h3>
                <p className="text-sm text-gray-700">Some debugging tools and memory dumps display data in octal format for easier reading than raw binary.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">📖 Computer Science Education</h3>
                <p className="text-sm text-gray-700">Learning octal helps understand different number systems and their relationships in computing.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🖥️ Embedded Systems</h3>
                <p className="text-sm text-gray-700">Some embedded systems and microcontrollers use octal for configuration and addressing.</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              For performing calculations on binary numbers before conversion, use our <a href="/tools/binary-calculator" className="text-emerald-600 hover:text-emerald-700 font-medium">Binary Calculator</a> tool.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Common Binary to Octal Examples</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Here are practical <strong>binary to octal conversion examples</strong> you'll encounter frequently:
            </p>
            <div className="space-y-3">
              <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">📁 File Permission: rwxr-xr-x</h3>
                <p className="text-sm text-gray-700 font-mono">Binary: 111 101 101 → Octal: 755 (owner: rwx, group: r-x, others: r-x)</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">📄 File Permission: rw-r--r--</h3>
                <p className="text-sm text-gray-700 font-mono">Binary: 110 100 100 → Octal: 644 (owner: rw-, group: r--, others: r--)</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">🔢 Binary Byte</h3>
                <p className="text-sm text-gray-700 font-mono">Binary: 11111111 → Groups: 011 111 111 → Octal: 377 (255 decimal)</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">💾 Memory Address</h3>
                <p className="text-sm text-gray-700 font-mono">Binary: 1010101010 → Groups: 001 010 101 010 → Octal: 1252</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">🎯 Simple Conversion</h3>
                <p className="text-sm text-gray-700 font-mono">Binary: 101 → Octal: 5 | Binary: 1000 → Groups: 001 000 → Octal: 10</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Benefits of Using Our Online Converter</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              ProURLMonitor's <strong>free binary to octal converter</strong> offers multiple advantages:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Instant Conversion:</strong> Convert any binary number to octal in milliseconds without manual grouping.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Multiple Formats:</strong> Get octal, decimal, and hexadecimal results simultaneously for comprehensive conversion.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>3-Bit Grouping Display:</strong> See how binary groups convert to individual octal digits step by step.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Input Validation:</strong> Automatically checks for valid binary input (only 0 and 1 accepted).</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>No Length Limit:</strong> Convert binary numbers of any practical length—from single bits to large values.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>100% Free:</strong> No registration, downloads, or hidden costs. Use unlimited times.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Mobile Friendly:</strong> Works on all devices—desktop, tablet, and smartphone.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Educational Value:</strong> Learn the conversion process with detailed breakdown and examples.</span>
              </li>
            </ul>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Understanding Octal Number System</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The <strong>octal number system</strong> is a base-8 positional numeral system that uses eight distinct digits: 0, 1, 2, 3, 4, 5, 6, and 7. Each position represents a power of 8, making it a convenient shorthand for binary representation.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-blue-800 mb-2">Octal Position Values:</h3>
              <div className="font-mono text-sm text-gray-700 space-y-1">
                <div>8³ = 512 (fourth position from right)</div>
                <div>8² = 64 (third position from right)</div>
                <div>8¹ = 8 (second position from right)</div>
                <div>8⁰ = 1 (first position from right)</div>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Example:</strong> Octal 755 = (7 × 64) + (5 × 8) + (5 × 1) = 448 + 40 + 5 = 493 in decimal
            </p>
            <p className="text-gray-700 leading-relaxed">
              Octal was popular in early computing (1950s-1970s) because computers used 12-bit, 24-bit, or 36-bit words, which are evenly divisible by 3. Modern computers use 8-bit, 16-bit, 32-bit, or 64-bit words, making hexadecimal (groups of 4 bits) more convenient. However, octal remains important for Unix permissions and certain legacy systems.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Related Binary Conversion Tools</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Explore our complete suite of binary and number system converters:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/binary-to-decimal" className="hover:text-emerald-600">🔢 Binary to Decimal Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert binary numbers to decimal format for human-readable values.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/binary-to-hex" className="hover:text-emerald-600">🔷 Binary to Hex Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert binary numbers to hexadecimal format used in modern programming.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/hex-to-binary" className="hover:text-emerald-600">🔄 Hex to Binary Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert hexadecimal numbers to binary format—perfect for analyzing hex color codes.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/decimal-to-binary" className="hover:text-emerald-600">📊 Decimal to Binary Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert decimal numbers to binary format for computer operations.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/binary-calculator" className="hover:text-emerald-600">🧮 Binary Calculator</a>
                </h3>
                <p className="text-sm text-gray-700">Perform arithmetic operations on binary numbers (add, subtract, multiply, divide).</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/binary-translator" className="hover:text-emerald-600">🔤 Binary Translator</a>
                </h3>
                <p className="text-sm text-gray-700">Convert text to binary code and decode binary back to readable text.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/octal-to-binary" className="hover:text-emerald-600">🔄 Octal to Binary Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert octal numbers to binary—perfect for understanding chmod file permissions.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/octal-to-decimal" className="hover:text-emerald-600">📊 Octal to Decimal Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert octal numbers to decimal format—understand chmod values numerically.</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">📚 Frequently Asked Questions (FAQs)</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: How do I convert 111 to octal?</h3>
                <p className="text-gray-700 text-sm">A: Binary 111 equals octal 7. Since it's already a 3-bit group (111 = 7), the octal value is directly 7.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What is binary 1010 in octal?</h3>
                <p className="text-gray-700 text-sm">A: Binary 1010 = Octal 12. Group it as 001 010 → 1 and 2 → 12 in octal (10 in decimal).</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Why group from right to left instead of left to right?</h3>
                <p className="text-gray-700 text-sm">A: Grouping from right ensures proper place values. The rightmost bits represent the least significant values, and grouping from right to left maintains correct mathematical representation.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What happens if my binary number isn't divisible by 3?</h3>
                <p className="text-gray-700 text-sm">A: Simply add leading zeros to the leftmost group. For example, 11011 becomes 011 011 → 33 in octal. The leading zeros don't change the value.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What does chmod 755 mean in binary?</h3>
                <p className="text-gray-700 text-sm">A: Octal 755 = Binary 111 101 101. This represents rwxr-xr-x permissions: owner has full access (7=111=rwx), group and others have read+execute (5=101=r-x).</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Is octal still used in modern computing?</h3>
                <p className="text-gray-700 text-sm">A: Yes, primarily in Unix/Linux file permissions (chmod commands) and some legacy systems. However, hexadecimal is more common in modern programming because of 8-bit bytes.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Can I convert negative binary numbers to octal?</h3>
                <p className="text-gray-700 text-sm">A: Our converter works with positive binary numbers. Negative numbers require two's complement representation, which needs a different conversion approach.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What's the maximum binary value I can convert?</h3>
                <p className="text-gray-700 text-sm">A: You can convert binary numbers up to JavaScript's safe integer limit (2⁵³ - 1). This is more than sufficient for all practical applications including large memory addresses and data values.</p>
              </div>
            </div>
          </div>

          <div className="card bg-purple-700 text-white">
            <h2 className="text-2xl font-bold mb-4">🚀 Start Converting Binary to Octal Now!</h2>
            <p className="mb-4">
              Use our <strong>free binary to octal converter</strong> to convert any binary number instantly. Perfect for Unix administrators, programmers, students, and anyone working with file permissions or legacy systems. Get results in octal, decimal, and hexadecimal formats with detailed conversion breakdown.
            </p>
            <p className="mb-4">
              No registration required. Unlimited conversions. Completely free forever!
            </p>
            <p className="font-semibold">
              Explore more tools: <a href="/tools/binary-to-hex" className="text-purple-100 hover:text-white underline">Binary to Hex</a> • <a href="/tools/binary-calculator" className="text-purple-100 hover:text-white underline">Binary Calculator</a> • <a href="/tools/hex-to-binary" className="text-purple-100 hover:text-white underline">Hex to Binary</a> 🎯
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
