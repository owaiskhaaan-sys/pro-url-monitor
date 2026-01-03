import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function OctalToBinary() {
  const [octalInput, setOctalInput] = useState('');
  const [binaryResult, setBinaryResult] = useState('');
  const [decimalResult, setDecimalResult] = useState('');
  const [hexResult, setHexResult] = useState('');
  const [error, setError] = useState('');

  const validateOctal = (value) => {
    return /^[0-7]+$/.test(value);
  };

  const handleConvert = () => {
    setError('');
    setBinaryResult('');
    setDecimalResult('');
    setHexResult('');

    if (!octalInput.trim()) {
      setError('Please enter an octal number');
      return;
    }

    if (!validateOctal(octalInput)) {
      setError('Please enter a valid octal number (only 0-7)');
      return;
    }

    // Convert octal to decimal first, then to other bases
    const decimal = parseInt(octalInput, 8);
    
    setBinaryResult(decimal.toString(2));
    setDecimalResult(decimal.toString());
    setHexResult(decimal.toString(16).toUpperCase());
  };

  const handleReset = () => {
    setOctalInput('');
    setBinaryResult('');
    setDecimalResult('');
    setHexResult('');
    setError('');
  };

  return (
    <Layout>
      <Head>
        <title>Octal to Binary Converter - Free Online Tool | ProURLMonitor</title>
        <meta name="description" content="Convert octal numbers to binary instantly with our free online octal to binary converter. Get results in binary, decimal, and hexadecimal formats with..." />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/octal-to-binary" />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4 text-center">Octal to Binary Converter</h1>
        <p className="text-gray-600 mb-8 text-center">
          Convert octal numbers to binary format instantly. Enter any octal number and get binary, decimal, and hexadecimal results.
        </p>

        <div className="card mb-8">
          {/* Input Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter Octal Number:</label>
            <input
              type="text"
              value={octalInput}
              onChange={(e) => setOctalInput(e.target.value)}
              placeholder="e.g., 755 or 12"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-lg font-mono"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleConvert();
                }
              }}
            />
            <p className="text-xs text-gray-500 mt-1">Valid characters: 0-7 only</p>
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
              Convert to Binary
            </button>
            <button
              onClick={handleReset}
              className="btn bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-3 text-lg"
            >
              Reset
            </button>
          </div>

          {/* Results */}
          {binaryResult && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-lg border-2 border-emerald-200">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">Binary Result:</h3>
                <p className="text-3xl font-mono font-bold text-emerald-700 break-all">{binaryResult}</p>
                <p className="text-sm text-gray-600 mt-2">Octal {octalInput} = Binary {binaryResult}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-sm font-semibold text-blue-800 mb-2">Decimal:</h3>
                  <p className="text-2xl font-mono font-bold text-blue-700">{decimalResult}</p>
                  <p className="text-xs text-gray-600 mt-1">Base 10</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="text-sm font-semibold text-purple-800 mb-2">Hexadecimal:</h3>
                  <p className="text-2xl font-mono font-bold text-purple-700">{hexResult}</p>
                  <p className="text-xs text-gray-600 mt-1">Base 16</p>
                </div>
              </div>

              {/* Conversion Steps */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">📝 How the Conversion Works:</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Octal {octalInput} converts to binary by converting each octal digit to 3 binary bits:
                </p>
                <div className="text-sm bg-white p-4 rounded border border-gray-300 space-y-2">
                  <div className="font-mono text-xs">
                    {(() => {
                      const octalDigits = octalInput.split('');
                      const conversions = octalDigits.map(digit => {
                        const decimal = parseInt(digit, 10);
                        const binary = decimal.toString(2).padStart(3, '0');
                        return `${digit} (octal) = ${binary} (binary)`;
                      });
                      
                      return (
                        <div className="space-y-1">
                          <div className="font-semibold mb-2">Convert each octal digit to 3-bit binary:</div>
                          {conversions.map((conv, idx) => (
                            <div key={idx}>{conv}</div>
                          ))}
                          <div className="mt-3 pt-3 border-t border-gray-300 font-semibold">
                            Combined Binary: {binaryResult}
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
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">What is Octal to Binary Conversion?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Octal to binary conversion</strong> is the process of converting base-8 numbers (octal) to base-2 numbers (binary). Octal uses digits 0-7, while binary uses only 0 and 1. This conversion is extremely straightforward because each octal digit represents exactly 3 binary bits, making it one of the simplest number system conversions.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              For example, octal 755 equals binary 111101101 (493 in decimal). The conversion works by converting each octal digit independently: 7 = 111, 5 = 101, 5 = 101, giving 111101101. This direct mapping makes octal an ideal shorthand for binary in systems where data is grouped in multiples of 3 bits.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our free <strong>octal to binary converter</strong> makes this conversion instant and accurate. Simply enter any octal number (like Unix file permissions 755 or 644) and get the binary equivalent immediately, along with decimal and hexadecimal representations. For the reverse operation, use our <a href="/tools/binary-to-octal" className="text-emerald-600 hover:text-emerald-700 font-medium">Binary to Octal Converter</a> tool.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">How to Convert Octal to Binary Manually</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Understanding the <strong>manual conversion process</strong> is incredibly simple with the direct substitution method:
            </p>
            <div className="bg-purple-50 p-6 rounded-lg mb-4">
              <h3 className="font-semibold text-purple-800 mb-3">Direct Conversion Method:</h3>
              <ol className="space-y-2 text-gray-700">
                <li><strong>Step 1:</strong> Write down the octal number</li>
                <li><strong>Step 2:</strong> Convert each octal digit to its 3-bit binary equivalent</li>
                <li><strong>Step 3:</strong> Combine all 3-bit groups from left to right</li>
                <li><strong>Step 4:</strong> Remove leading zeros if desired (optional)</li>
              </ol>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Example: Convert 755 to Binary</strong>
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4 font-mono text-sm">
              <pre className="text-gray-800">
{`Step 1: Separate octal digits
7    5    5

Step 2: Convert each digit to 3-bit binary
7 (octal) = 111 (binary)
5 (octal) = 101 (binary)
5 (octal) = 101 (binary)

Step 3: Combine all groups
111 101 101

Step 4: Result
Therefore, 755 in octal = 111101101 in binary

Verification (via decimal):
755₈ = 493₁₀ = 111101101₂ ✓

Real-world meaning:
755 = rwxr-xr-x (Unix file permissions)`}
              </pre>
            </div>
            <p className="text-gray-700 leading-relaxed">
              The key is memorizing that each octal digit = exactly 3 binary bits. This makes conversion instantaneous! For other conversions, check our <a href="/tools/decimal-to-binary" className="text-emerald-600 hover:text-emerald-700 font-medium">Decimal to Binary Converter</a> or <a href="/tools/hex-to-binary" className="text-emerald-600 hover:text-emerald-700 font-medium">Hex to Binary Converter</a>.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Octal to Binary Conversion Table</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              This reference table shows all 8 octal digits and their 3-bit binary equivalents:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-purple-100">
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Octal</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Binary (3 bits)</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Decimal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">0</td><td className="border border-gray-300 px-4 py-2 font-mono">000</td><td className="border border-gray-300 px-4 py-2">0</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">1</td><td className="border border-gray-300 px-4 py-2 font-mono">001</td><td className="border border-gray-300 px-4 py-2">1</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">2</td><td className="border border-gray-300 px-4 py-2 font-mono">010</td><td className="border border-gray-300 px-4 py-2">2</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">3</td><td className="border border-gray-300 px-4 py-2 font-mono">011</td><td className="border border-gray-300 px-4 py-2">3</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">4</td><td className="border border-gray-300 px-4 py-2 font-mono">100</td><td className="border border-gray-300 px-4 py-2">4</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">5</td><td className="border border-gray-300 px-4 py-2 font-mono">101</td><td className="border border-gray-300 px-4 py-2">5</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">6</td><td className="border border-gray-300 px-4 py-2 font-mono">110</td><td className="border border-gray-300 px-4 py-2">6</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-purple-700">7</td><td className="border border-gray-300 px-4 py-2 font-mono">111</td><td className="border border-gray-300 px-4 py-2">7</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Pro Tip:</strong> Memorize this table! It's essential for understanding Unix file permissions and converting octal notation to binary for bit-level analysis.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Why Convert Octal to Binary?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Octal to binary conversion</strong> is essential in various computing scenarios:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🔐 Understanding File Permissions</h3>
                <p className="text-sm text-gray-700">Convert chmod values (755, 644) to binary to see actual read/write/execute permission bits.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">💻 Legacy Code Analysis</h3>
                <p className="text-sm text-gray-700">Older systems and documentation use octal—converting to binary reveals the actual bit patterns.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🔧 Bit Manipulation</h3>
                <p className="text-sm text-gray-700">See the exact binary representation to understand which bits are set for bitwise operations.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">📖 Educational Learning</h3>
                <p className="text-sm text-gray-700">Understanding octal-to-binary conversion helps grasp number system relationships in computer science.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🖥️ Embedded Systems</h3>
                <p className="text-sm text-gray-700">Some embedded systems use octal configuration values that need binary interpretation.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🐛 Debugging</h3>
                <p className="text-sm text-gray-700">Convert octal debug output to binary for detailed bit-level analysis and troubleshooting.</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              For performing calculations on binary numbers after conversion, use our <a href="/tools/binary-calculator" className="text-emerald-600 hover:text-emerald-700 font-medium">Binary Calculator</a> tool.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Common Octal to Binary Examples</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Here are practical <strong>octal to binary conversion examples</strong> from real-world scenarios:
            </p>
            <div className="space-y-3">
              <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">📁 chmod 755 (rwxr-xr-x)</h3>
                <p className="text-sm text-gray-700 font-mono">Octal: 7 5 5 → Binary: 111 101 101 → Full: 111101101</p>
                <p className="text-xs text-gray-600 mt-1">Owner: rwx (111), Group: r-x (101), Others: r-x (101)</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">📄 chmod 644 (rw-r--r--)</h3>
                <p className="text-sm text-gray-700 font-mono">Octal: 6 4 4 → Binary: 110 100 100 → Full: 110100100</p>
                <p className="text-xs text-gray-600 mt-1">Owner: rw- (110), Group: r-- (100), Others: r-- (100)</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">🔒 chmod 777 (rwxrwxrwx)</h3>
                <p className="text-sm text-gray-700 font-mono">Octal: 7 7 7 → Binary: 111 111 111 → Full: 111111111</p>
                <p className="text-xs text-gray-600 mt-1">Full permissions for everyone (not recommended for security!)</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">🔐 chmod 600 (rw-------)</h3>
                <p className="text-sm text-gray-700 font-mono">Octal: 6 0 0 → Binary: 110 000 000 → Full: 110000000</p>
                <p className="text-xs text-gray-600 mt-1">Owner only (rw-), secure private files</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">🎯 Simple Octal 12</h3>
                <p className="text-sm text-gray-700 font-mono">Octal: 1 2 → Binary: 001 010 → Full: 1010 (decimal 10)</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Benefits of Using Our Online Converter</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              ProURLMonitor's <strong>free octal to binary converter</strong> offers multiple advantages:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Instant Conversion:</strong> Convert any octal number to binary in milliseconds without manual lookup.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Multiple Formats:</strong> Get binary, decimal, and hexadecimal results simultaneously for comprehensive conversion.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Digit-by-Digit Breakdown:</strong> See how each octal digit converts to its 3-bit binary equivalent.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Input Validation:</strong> Automatically checks for valid octal digits (0-7 only).</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Perfect for chmod:</strong> Convert Unix file permission values (755, 644) to binary instantly.</span>
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
                <span><strong>Educational Value:</strong> Learn the conversion process with detailed examples and explanations.</span>
              </li>
            </ul>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Understanding Unix File Permissions</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The most common use of <strong>octal numbers in computing</strong> is Unix/Linux file permissions. Each of the three octal digits represents permissions for owner, group, and others:
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-blue-800 mb-2">Permission Bit Values:</h3>
              <div className="font-mono text-sm text-gray-700 space-y-1">
                <div><strong>4</strong> = Read (r) = Binary 100</div>
                <div><strong>2</strong> = Write (w) = Binary 010</div>
                <div><strong>1</strong> = Execute (x) = Binary 001</div>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Example Breakdown of chmod 755:</strong>
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4 font-mono text-sm">
              <div className="space-y-2 text-gray-700">
                <div><strong>7</strong> (owner) = 4+2+1 = rwx = Binary 111</div>
                <div><strong>5</strong> (group) = 4+0+1 = r-x = Binary 101</div>
                <div><strong>5</strong> (others) = 4+0+1 = r-x = Binary 101</div>
                <div className="pt-2 border-t border-gray-300">
                  <strong>Result:</strong> 755₈ = 111101101₂ = rwxr-xr-x
                </div>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Converting octal permissions to binary helps you understand exactly which permission bits are set. This is valuable for security audits, troubleshooting access issues, and understanding system configurations.
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
                  <a href="/tools/binary-to-octal" className="hover:text-emerald-600">🔢 Binary to Octal Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert binary numbers to octal format—the reverse of this tool.</p>
              </div>
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
                <h3 className="font-semibold text-gray-800 mb-2">Q: How do I convert octal 7 to binary?</h3>
                <p className="text-gray-700 text-sm">A: Octal 7 equals binary 111. Each octal digit from 0-7 converts directly to a 3-bit binary pattern.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What is octal 755 in binary?</h3>
                <p className="text-gray-700 text-sm">A: Octal 755 = Binary 111101101. Break it down: 7=111, 5=101, 5=101, giving 111101101 (rwxr-xr-x permissions).</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Why does each octal digit become 3 binary bits?</h3>
                <p className="text-gray-700 text-sm">A: Octal is base-8, and 8 = 2³. This means one octal digit represents 8 values (0-7), which perfectly maps to 3 binary bits (000-111).</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: How do I understand chmod 644 in binary?</h3>
                <p className="text-gray-700 text-sm">A: Convert 644 → 110 100 100. This shows: owner has rw- (110), group has r-- (100), others have r-- (100).</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Can I enter octal numbers with a leading 0?</h3>
                <p className="text-gray-700 text-sm">A: Yes, you can enter 0755 or just 755—both work. Leading zeros don't change the value but are sometimes used in programming to indicate octal notation.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What if I accidentally enter 8 or 9?</h3>
                <p className="text-gray-700 text-sm">A: The converter will show an error because octal only uses digits 0-7. Numbers 8 and 9 don't exist in the octal system.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Is octal still relevant in modern computing?</h3>
                <p className="text-gray-700 text-sm">A: Yes, primarily for Unix/Linux file permissions (chmod) and some legacy systems. Hexadecimal is more common for general programming, but octal remains essential for system administration.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What's the maximum octal value I can convert?</h3>
                <p className="text-gray-700 text-sm">A: You can convert octal numbers up to JavaScript's safe integer limit. This is more than sufficient for all practical applications including large file permissions and system values.</p>
              </div>
            </div>
          </div>

          <div className="card bg-purple-700 text-white">
            <h2 className="text-2xl font-bold mb-4">🚀 Start Converting Octal to Binary Now!</h2>
            <p className="mb-4">
              Use our <strong>free octal to binary converter</strong> to convert any octal number instantly. Perfect for Unix administrators understanding chmod permissions, programmers working with legacy systems, students, and anyone needing to convert octal notation. Get results in binary, decimal, and hexadecimal formats with detailed conversion breakdown.
            </p>
            <p className="mb-4">
              No registration required. Unlimited conversions. Completely free forever!
            </p>
            <p className="font-semibold">
              Explore more tools: <a href="/tools/binary-to-octal" className="text-purple-100 hover:text-white underline">Binary to Octal</a> • <a href="/tools/binary-calculator" className="text-purple-100 hover:text-white underline">Binary Calculator</a> • <a href="/tools/hex-to-binary" className="text-purple-100 hover:text-white underline">Hex to Binary</a> 🎯
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
