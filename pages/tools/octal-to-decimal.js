import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function OctalToDecimal() {
  const [octalInput, setOctalInput] = useState('');
  const [decimalResult, setDecimalResult] = useState('');
  const [binaryResult, setBinaryResult] = useState('');
  const [hexResult, setHexResult] = useState('');
  const [error, setError] = useState('');

  const validateOctal = (value) => {
    return /^[0-7]+$/.test(value);
  };

  const handleConvert = () => {
    setError('');
    setDecimalResult('');
    setBinaryResult('');
    setHexResult('');

    if (!octalInput.trim()) {
      setError('Please enter an octal number');
      return;
    }

    if (!validateOctal(octalInput)) {
      setError('Please enter a valid octal number (only 0-7)');
      return;
    }

    // Convert octal to decimal
    const decimal = parseInt(octalInput, 8);
    
    setDecimalResult(decimal.toString());
    setBinaryResult(decimal.toString(2));
    setHexResult(decimal.toString(16).toUpperCase());
  };

  const handleReset = () => {
    setOctalInput('');
    setDecimalResult('');
    setBinaryResult('');
    setHexResult('');
    setError('');
  };

  return (
    <Layout>
      <Head>
        <title>Octal to Decimal Converter - Free Online Tool | ProURLMonitor</title>
        <meta name="description" content="Convert octal numbers to decimal instantly with our free online octal to decimal converter. Get results in decimal, binary, and hexadecimal formats with step-by-step conversion guide." />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/octal-to-decimal" />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4 text-center">Octal to Decimal Converter</h1>
        <p className="text-gray-600 mb-8 text-center">
          Convert octal numbers to decimal format instantly. Enter any octal number and get decimal, binary, and hexadecimal results.
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
                <p className="text-sm text-gray-600 mt-2">Octal {octalInput} = Decimal {decimalResult}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <h3 className="text-sm font-semibold text-emerald-800 mb-2">Binary:</h3>
                  <p className="text-2xl font-mono font-bold text-emerald-700 break-all">{binaryResult}</p>
                  <p className="text-xs text-gray-600 mt-1">Base 2</p>
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
                  Octal {octalInput} converts to decimal using positional notation (powers of 8):
                </p>
                <div className="text-sm bg-white p-4 rounded border border-gray-300 space-y-2">
                  <div className="font-mono text-xs">
                    {(() => {
                      const digits = octalInput.split('').reverse();
                      const calculations = digits.map((digit, index) => {
                        const power = index;
                        const value = parseInt(digit, 10);
                        const result = value * Math.pow(8, power);
                        return `${digit} × 8^${power} = ${digit} × ${Math.pow(8, power)} = ${result}`;
                      }).reverse();
                      
                      const sum = calculations.map((calc, idx) => {
                        const parts = calc.split(' = ');
                        return parseInt(parts[parts.length - 1]);
                      });
                      
                      return (
                        <div className="space-y-1">
                          <div className="font-semibold mb-2">Position values (right to left):</div>
                          {calculations.map((calc, idx) => (
                            <div key={idx}>{calc}</div>
                          ))}
                          <div className="mt-3 pt-3 border-t border-gray-300">
                            <div className="font-semibold">Sum: {sum.join(' + ')} = {decimalResult}</div>
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
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">What is Octal to Decimal Conversion?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Octal to decimal conversion</strong> is the process of converting base-8 numbers (octal) to base-10 numbers (decimal). Octal uses digits 0-7, while decimal uses digits 0-9. This conversion involves multiplying each octal digit by increasing powers of 8 (from right to left) and summing the results.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              For example, octal 755 equals decimal 493. The conversion works as: (7 × 8²) + (5 × 8¹) + (5 × 8⁰) = (7 × 64) + (5 × 8) + (5 × 1) = 448 + 40 + 5 = 493. This is particularly useful when working with Unix file permissions, where octal notation (like chmod 755) needs to be understood in decimal terms.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our free <strong>octal to decimal converter</strong> makes this conversion instant and accurate. Simply enter any octal number (like Unix file permissions 755, 644, or 777) and get the decimal equivalent immediately, along with binary and hexadecimal representations. For the reverse operation, use our Decimal to Octal Converter tool.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">How to Convert Octal to Decimal Manually</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Understanding the <strong>manual conversion process</strong> using positional notation:
            </p>
            <div className="bg-blue-50 p-6 rounded-lg mb-4">
              <h3 className="font-semibold text-blue-800 mb-3">Positional Notation Method:</h3>
              <ol className="space-y-2 text-gray-700">
                <li><strong>Step 1:</strong> Write down the octal number</li>
                <li><strong>Step 2:</strong> Assign position numbers from right to left, starting with 0</li>
                <li><strong>Step 3:</strong> Multiply each digit by 8 raised to its position</li>
                <li><strong>Step 4:</strong> Sum all the results to get the decimal value</li>
              </ol>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Example: Convert 755 to Decimal</strong>
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4 font-mono text-sm">
              <pre className="text-gray-800">
{`Step 1: Octal number
755

Step 2: Assign positions (right to left)
Position:  2   1   0
Digit:     7   5   5

Step 3: Calculate each position
7 × 8² = 7 × 64 = 448
5 × 8¹ = 5 × 8  = 40
5 × 8⁰ = 5 × 1  = 5

Step 4: Sum all values
448 + 40 + 5 = 493

Therefore, 755₈ = 493₁₀

Real-world meaning:
755 = rwxr-xr-x (Unix file permissions)
493 is the decimal representation`}
              </pre>
            </div>
            <p className="text-gray-700 leading-relaxed">
              The key is understanding that each position represents a power of 8, starting from 8⁰ = 1 on the right. For other conversions, check our <a href="/tools/octal-to-binary" className="text-emerald-600 hover:text-emerald-700 font-medium">Octal to Binary Converter</a> or <a href="/tools/decimal-to-binary" className="text-emerald-600 hover:text-emerald-700 font-medium">Decimal to Binary Converter</a>.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Octal to Decimal Conversion Table</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              This reference table shows common octal values and their decimal equivalents:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Octal</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Decimal</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Common Use</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-blue-700">0</td><td className="border border-gray-300 px-4 py-2 font-mono">0</td><td className="border border-gray-300 px-4 py-2 text-sm">--- (no permissions)</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-blue-700">1</td><td className="border border-gray-300 px-4 py-2 font-mono">1</td><td className="border border-gray-300 px-4 py-2 text-sm">--x (execute only)</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-blue-700">4</td><td className="border border-gray-300 px-4 py-2 font-mono">4</td><td className="border border-gray-300 px-4 py-2 text-sm">r-- (read only)</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-blue-700">5</td><td className="border border-gray-300 px-4 py-2 font-mono">5</td><td className="border border-gray-300 px-4 py-2 text-sm">r-x (read + execute)</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-blue-700">6</td><td className="border border-gray-300 px-4 py-2 font-mono">6</td><td className="border border-gray-300 px-4 py-2 text-sm">rw- (read + write)</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-blue-700">7</td><td className="border border-gray-300 px-4 py-2 font-mono">7</td><td className="border border-gray-300 px-4 py-2 text-sm">rwx (full permissions)</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-blue-700">10</td><td className="border border-gray-300 px-4 py-2 font-mono">8</td><td className="border border-gray-300 px-4 py-2 text-sm">1 × 8¹ + 0 × 8⁰</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-blue-700">100</td><td className="border border-gray-300 px-4 py-2 font-mono">64</td><td className="border border-gray-300 px-4 py-2 text-sm">8² = 64</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-blue-700">644</td><td className="border border-gray-300 px-4 py-2 font-mono">420</td><td className="border border-gray-300 px-4 py-2 text-sm">rw-r--r-- (common file)</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-blue-700">755</td><td className="border border-gray-300 px-4 py-2 font-mono">493</td><td className="border border-gray-300 px-4 py-2 text-sm">rwxr-xr-x (executable)</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono text-lg font-bold text-blue-700">777</td><td className="border border-gray-300 px-4 py-2 font-mono">511</td><td className="border border-gray-300 px-4 py-2 text-sm">rwxrwxrwx (full access)</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Pro Tip:</strong> Unix file permissions use 3 octal digits representing owner, group, and others. Each digit (0-7) corresponds to different permission combinations.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Why Convert Octal to Decimal?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Octal to decimal conversion</strong> is essential in various computing scenarios:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">🔐 Understanding Permissions</h3>
                <p className="text-sm text-gray-700">Convert Unix chmod values (755, 644) to decimal to understand the numeric representation of file permissions.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">💻 System Programming</h3>
                <p className="text-sm text-gray-700">Many system calls and APIs expect decimal values even when documentation uses octal notation.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">📊 Data Analysis</h3>
                <p className="text-sm text-gray-700">Convert octal data from legacy systems to decimal for mathematical operations and reporting.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">📖 Educational Learning</h3>
                <p className="text-sm text-gray-700">Understanding number system conversions is fundamental in computer science education.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">🔧 Configuration Files</h3>
                <p className="text-sm text-gray-700">Some configuration files use octal notation that needs decimal interpretation for validation.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">🐛 Debugging</h3>
                <p className="text-sm text-gray-700">Convert octal debug output to decimal for easier understanding and comparison with expected values.</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              For performing calculations after conversion, use our <a href="/tools/binary-calculator" className="text-emerald-600 hover:text-emerald-700 font-medium">Binary Calculator</a> tool.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Common Octal to Decimal Examples</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Here are practical <strong>octal to decimal conversion examples</strong> from real-world scenarios:
            </p>
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">📁 chmod 755 (rwxr-xr-x)</h3>
                <p className="text-sm text-gray-700 font-mono">Octal 755 = (7×64) + (5×8) + (5×1) = 448 + 40 + 5 = Decimal 493</p>
                <p className="text-xs text-gray-600 mt-1">Most common permission for executable files and directories</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">📄 chmod 644 (rw-r--r--)</h3>
                <p className="text-sm text-gray-700 font-mono">Octal 644 = (6×64) + (4×8) + (4×1) = 384 + 32 + 4 = Decimal 420</p>
                <p className="text-xs text-gray-600 mt-1">Standard permission for regular files</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">🔒 chmod 600 (rw-------)</h3>
                <p className="text-sm text-gray-700 font-mono">Octal 600 = (6×64) + (0×8) + (0×1) = 384 + 0 + 0 = Decimal 384</p>
                <p className="text-xs text-gray-600 mt-1">Private files accessible only by owner</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">🔐 chmod 777 (rwxrwxrwx)</h3>
                <p className="text-sm text-gray-700 font-mono">Octal 777 = (7×64) + (7×8) + (7×1) = 448 + 56 + 7 = Decimal 511</p>
                <p className="text-xs text-gray-600 mt-1">Full permissions for everyone (security risk!)</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">🎯 Simple Octal 12</h3>
                <p className="text-sm text-gray-700 font-mono">Octal 12 = (1×8) + (2×1) = 8 + 2 = Decimal 10</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Benefits of Using Our Online Converter</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              ProURLMonitor's <strong>free octal to decimal converter</strong> offers multiple advantages:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Instant Conversion:</strong> Convert any octal number to decimal in milliseconds without manual calculation.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Multiple Formats:</strong> Get decimal, binary, and hexadecimal results simultaneously.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Step-by-Step Breakdown:</strong> See the positional calculation showing how each digit contributes to the final result.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Input Validation:</strong> Automatically checks for valid octal digits (0-7 only).</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Perfect for chmod:</strong> Understand Unix file permission values in decimal format.</span>
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
                <span><strong>Educational Value:</strong> Learn the conversion process with detailed examples and power calculations.</span>
              </li>
            </ul>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Understanding Octal Number System</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The <strong>octal number system</strong> is a base-8 positional numeral system that uses eight distinct digits: 0, 1, 2, 3, 4, 5, 6, and 7. Each position represents a power of 8, making it useful for representing binary data in a more compact form.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-blue-800 mb-2">Octal Position Values:</h3>
              <div className="font-mono text-sm text-gray-700 space-y-1">
                <div>8⁴ = 4096 (fifth position from right)</div>
                <div>8³ = 512 (fourth position from right)</div>
                <div>8² = 64 (third position from right)</div>
                <div>8¹ = 8 (second position from right)</div>
                <div>8⁰ = 1 (first position from right)</div>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Example:</strong> To understand octal 755 in decimal:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4 font-mono text-sm">
              <div className="space-y-1 text-gray-700">
                <div>Position 2: 7 × 8² = 7 × 64 = 448</div>
                <div>Position 1: 5 × 8¹ = 5 × 8 = 40</div>
                <div>Position 0: 5 × 8⁰ = 5 × 1 = 5</div>
                <div className="pt-2 border-t border-gray-300 font-semibold">
                  Total: 448 + 40 + 5 = 493 (decimal)
                </div>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Octal was historically popular in computing because early computers used 12-bit, 24-bit, or 36-bit words (divisible by 3). Modern systems use 8-bit bytes, making hexadecimal more common, but octal remains essential for Unix file permissions.
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
                  <a href="/tools/octal-to-binary" className="hover:text-emerald-600">🔄 Octal to Binary Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert octal numbers to binary format—see the bit-level representation.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/binary-to-octal" className="hover:text-emerald-600">🔢 Binary to Octal Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert binary numbers to octal format—essential for Unix file permissions.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/decimal-to-binary" className="hover:text-emerald-600">📊 Decimal to Binary Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert decimal numbers to binary format for computer operations.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/binary-to-decimal" className="hover:text-emerald-600">🔢 Binary to Decimal Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert binary numbers to decimal format for human-readable values.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/hex-to-binary" className="hover:text-emerald-600">🔷 Hex to Binary Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert hexadecimal numbers to binary format—perfect for analyzing hex codes.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/binary-to-hex" className="hover:text-emerald-600">🔷 Binary to Hex Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert binary numbers to hexadecimal format used in modern programming.</p>
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
            </div>
          </div>

          <div className="card bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">📚 Frequently Asked Questions (FAQs)</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: How do I convert octal 755 to decimal?</h3>
                <p className="text-gray-700 text-sm">A: Calculate (7×64) + (5×8) + (5×1) = 448 + 40 + 5 = 493 in decimal.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What is octal 7 in decimal?</h3>
                <p className="text-gray-700 text-sm">A: Octal 7 equals decimal 7. Single-digit octal numbers 0-7 have the same decimal value.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Why multiply by powers of 8?</h3>
                <p className="text-gray-700 text-sm">A: Octal is base-8, so each position represents 8⁰, 8¹, 8², etc., from right to left. This is how positional number systems work.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What does chmod 644 mean in decimal?</h3>
                <p className="text-gray-700 text-sm">A: Octal 644 = Decimal 420. This represents rw-r--r-- permissions (owner: read+write, group: read, others: read).</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Can I enter octal numbers with a leading 0?</h3>
                <p className="text-gray-700 text-sm">A: Yes, you can enter 0755 or just 755—both work. Leading zeros don't change the value but indicate octal notation in programming.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What happens if I accidentally enter 8 or 9?</h3>
                <p className="text-gray-700 text-sm">A: The converter will show an error because octal only uses digits 0-7. Numbers 8 and 9 don't exist in the octal system.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Is this converter accurate for large octal numbers?</h3>
                <p className="text-gray-700 text-sm">A: Yes, 100% accurate! It uses JavaScript's built-in parseInt() with base-8, supporting octal numbers up to JavaScript's safe integer limit.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Why is octal still used if hexadecimal is more common?</h3>
                <p className="text-gray-700 text-sm">A: Octal remains essential for Unix/Linux file permissions (chmod). It's also easier to convert between octal and binary (3:1 bit ratio) for certain applications.</p>
              </div>
            </div>
          </div>

          <div className="card bg-blue-700 text-white">
            <h2 className="text-2xl font-bold mb-4">🚀 Start Converting Octal to Decimal Now!</h2>
            <p className="mb-4">
              Use our <strong>free octal to decimal converter</strong> to convert any octal number instantly. Perfect for Unix administrators understanding chmod permissions, programmers working with system programming, students learning number systems, and anyone needing to convert octal notation. Get results in decimal, binary, and hexadecimal formats with detailed positional calculation breakdown.
            </p>
            <p className="mb-4">
              No registration required. Unlimited conversions. Completely free forever!
            </p>
            <p className="font-semibold">
              Explore more tools: <a href="/tools/octal-to-binary" className="text-blue-100 hover:text-white underline">Octal to Binary</a> • <a href="/tools/binary-to-octal" className="text-blue-100 hover:text-white underline">Binary to Octal</a> • <a href="/tools/binary-calculator" className="text-blue-100 hover:text-white underline">Binary Calculator</a> 🎯
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
