import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function TwosComplementCalculator() {
  const [binaryInput, setBinaryInput] = useState('');
  const [bitWidth, setBitWidth] = useState('8');
  const [onesComplement, setOnesComplement] = useState('');
  const [twosComplement, setTwosComplement] = useState('');
  const [decimalValue, setDecimalValue] = useState('');
  const [signedDecimal, setSignedDecimal] = useState('');
  const [error, setError] = useState('');

  const validateBinary = (value) => {
    return /^[01]+$/.test(value);
  };

  const handleCalculate = () => {
    setError('');
    setOnesComplement('');
    setTwosComplement('');
    setDecimalValue('');
    setSignedDecimal('');

    if (!binaryInput.trim()) {
      setError('Please enter a binary number');
      return;
    }

    if (!validateBinary(binaryInput)) {
      setError('Please enter a valid binary number (only 0 and 1)');
      return;
    }

    const bits = parseInt(bitWidth);
    
    if (binaryInput.length > bits) {
      setError(`Binary number is too long for ${bits}-bit representation. Maximum ${bits} digits allowed.`);
      return;
    }

    // Pad the binary to the specified bit width
    const paddedBinary = binaryInput.padStart(bits, '0');

    // Calculate one's complement (flip all bits)
    const onesComp = paddedBinary.split('').map(bit => bit === '0' ? '1' : '0').join('');
    
    // Calculate two's complement (one's complement + 1)
    let twosComp = '';
    let carry = 1;
    for (let i = onesComp.length - 1; i >= 0; i--) {
      const bit = parseInt(onesComp[i]);
      const sum = bit + carry;
      twosComp = (sum % 2) + twosComp;
      carry = Math.floor(sum / 2);
    }

    // Calculate decimal values
    const unsignedDecimal = parseInt(paddedBinary, 2);
    
    // Calculate signed decimal (two's complement interpretation)
    let signedDec;
    if (paddedBinary[0] === '1') {
      // Negative number
      signedDec = -(parseInt(twosComp, 2));
    } else {
      // Positive number
      signedDec = unsignedDecimal;
    }

    setOnesComplement(onesComp);
    setTwosComplement(twosComp);
    setDecimalValue(unsignedDecimal.toString());
    setSignedDecimal(signedDec.toString());
  };

  const handleReset = () => {
    setBinaryInput('');
    setBitWidth('8');
    setOnesComplement('');
    setTwosComplement('');
    setDecimalValue('');
    setSignedDecimal('');
    setError('');
  };

  return (
    <Layout>
      <Head>
        <title>Two's Complement Calculator - Free Online Tool | ProURLMonitor</title>
        <meta name="description" content="Calculate two's complement of binary numbers instantly with our free online calculator. Convert positive and negative binary numbers with step-by-step explanation for 8-bit, 16-bit, and 32-bit systems." />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/twos-complement-calculator" />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4 text-center">Two's Complement Calculator</h1>
        <p className="text-gray-600 mb-8 text-center">
          Calculate one's complement and two's complement of binary numbers. Understand negative number representation in binary.
        </p>

        <div className="card mb-8">
          {/* Input Fields */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter Binary Number:</label>
              <input
                type="text"
                value={binaryInput}
                onChange={(e) => setBinaryInput(e.target.value)}
                placeholder="e.g., 1010 or 11111111"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-lg font-mono"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCalculate();
                  }
                }}
              />
              <p className="text-xs text-gray-500 mt-1">Valid characters: 0 and 1 only</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bit Width:</label>
              <select
                value={bitWidth}
                onChange={(e) => setBitWidth(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-lg"
              >
                <option value="4">4-bit</option>
                <option value="8">8-bit</option>
                <option value="16">16-bit</option>
                <option value="32">32-bit</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Select the bit width for representation</p>
            </div>
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
              onClick={handleCalculate}
              className="btn btn-primary px-12 py-3 text-lg"
            >
              Calculate
            </button>
            <button
              onClick={handleReset}
              className="btn bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-3 text-lg"
            >
              Reset
            </button>
          </div>

          {/* Results */}
          {onesComplement && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Original Binary ({bitWidth}-bit):</h3>
                <p className="text-2xl font-mono font-bold text-gray-700 break-all">{binaryInput.padStart(parseInt(bitWidth), '0')}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">One's Complement:</h3>
                <p className="text-2xl font-mono font-bold text-blue-700 break-all">{onesComplement}</p>
                <p className="text-xs text-gray-600 mt-1">All bits flipped (0→1, 1→0)</p>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-lg border-2 border-emerald-200">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">Two's Complement:</h3>
                <p className="text-3xl font-mono font-bold text-emerald-700 break-all">{twosComplement}</p>
                <p className="text-sm text-gray-600 mt-2">One's complement + 1</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="text-sm font-semibold text-purple-800 mb-2">Unsigned Decimal:</h3>
                  <p className="text-2xl font-mono font-bold text-purple-700">{decimalValue}</p>
                  <p className="text-xs text-gray-600 mt-1">Treating as positive number</p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h3 className="text-sm font-semibold text-orange-800 mb-2">Signed Decimal (Two's Complement):</h3>
                  <p className="text-2xl font-mono font-bold text-orange-700">{signedDecimal}</p>
                  <p className="text-xs text-gray-600 mt-1">Considering sign bit</p>
                </div>
              </div>

              {/* Process Explanation */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">📝 Step-by-Step Process:</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="bg-white p-3 rounded border border-gray-300">
                    <strong>Step 1: Original Binary</strong>
                    <p className="font-mono mt-1">{binaryInput.padStart(parseInt(bitWidth), '0')}</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-300">
                    <strong>Step 2: One's Complement (Flip all bits)</strong>
                    <p className="font-mono mt-1">{onesComplement}</p>
                    <p className="text-xs text-gray-600 mt-1">Change 0→1 and 1→0</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-300">
                    <strong>Step 3: Two's Complement (Add 1)</strong>
                    <p className="font-mono mt-1">{onesComplement} + 1 = {twosComplement}</p>
                    <p className="text-xs text-gray-600 mt-1">Add 1 to one's complement</p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded border border-emerald-300">
                    <strong>Result:</strong>
                    <p className="mt-1">
                      {binaryInput.padStart(parseInt(bitWidth), '0')[0] === '1' 
                        ? `Negative number: ${signedDecimal} (decimal)` 
                        : `Positive number: ${signedDecimal} (decimal)`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SEO Content */}
        <div className="prose prose-emerald max-w-none mt-12 space-y-8">
          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">What is Two's Complement?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Two's complement</strong> is a mathematical operation on binary numbers and the most common method of representing signed (positive and negative) integers in computers. In this system, positive numbers are represented normally in binary, while negative numbers are represented by taking the two's complement of their positive counterpart.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              The two's complement is calculated by inverting all the bits (one's complement) and then adding 1 to the result. For example, to represent -5 in 8-bit two's complement: Start with +5 (00000101), invert to get 11111010, add 1 to get 11111011. This elegant system eliminates the need for separate addition and subtraction circuits in computer processors.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our free <strong>two's complement calculator</strong> makes these conversions instant and accurate. Choose your bit width (4-bit, 8-bit, 16-bit, or 32-bit), enter any binary number, and get the one's complement, two's complement, and both signed and unsigned decimal representations. Perfect for computer science students, programmers, and anyone working with low-level binary operations.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">How to Calculate Two's Complement</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Understanding the <strong>two's complement calculation process</strong>:
            </p>
            <div className="bg-emerald-50 p-6 rounded-lg mb-4">
              <h3 className="font-semibold text-emerald-800 mb-3">Two-Step Method:</h3>
              <ol className="space-y-2 text-gray-700">
                <li><strong>Step 1: One's Complement</strong> - Invert all bits (change 0 to 1 and 1 to 0)</li>
                <li><strong>Step 2: Add One</strong> - Add 1 to the one's complement result</li>
              </ol>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Example: Calculate Two's Complement of 00001010 (8-bit)</strong>
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4 font-mono text-sm">
              <pre className="text-gray-800">
{`Original Binary: 00001010 (decimal 10)

Step 1: One's Complement (flip all bits)
0 → 1, 0 → 1, 0 → 1, 0 → 1, 1 → 0, 0 → 1, 1 → 0, 0 → 1
Result: 11110101

Step 2: Add 1
  11110101
+        1
----------
  11110110

Two's Complement: 11110110

Interpretation:
- As unsigned: 246 (decimal)
- As signed (two's complement): -10 (decimal)

This represents -10 in 8-bit two's complement notation.`}
              </pre>
            </div>
            <p className="text-gray-700 leading-relaxed">
              The MSB (Most Significant Bit) serves as the sign bit: 0 = positive, 1 = negative. For other binary operations, check our <a href="/tools/binary-calculator" className="text-emerald-600 hover:text-emerald-700 font-medium">Binary Calculator</a> tool.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Two's Complement Range Table</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The range of numbers that can be represented in two's complement varies by bit width:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-emerald-100">
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Bit Width</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Minimum Value</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Maximum Value</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Total Values</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-gray-300 px-4 py-2 font-bold">4-bit</td><td className="border border-gray-300 px-4 py-2 font-mono">-8</td><td className="border border-gray-300 px-4 py-2 font-mono">+7</td><td className="border border-gray-300 px-4 py-2">16</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-bold">8-bit</td><td className="border border-gray-300 px-4 py-2 font-mono">-128</td><td className="border border-gray-300 px-4 py-2 font-mono">+127</td><td className="border border-gray-300 px-4 py-2">256</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-bold">16-bit</td><td className="border border-gray-300 px-4 py-2 font-mono">-32,768</td><td className="border border-gray-300 px-4 py-2 font-mono">+32,767</td><td className="border border-gray-300 px-4 py-2">65,536</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-bold">32-bit</td><td className="border border-gray-300 px-4 py-2 font-mono">-2,147,483,648</td><td className="border border-gray-300 px-4 py-2 font-mono">+2,147,483,647</td><td className="border border-gray-300 px-4 py-2">4,294,967,296</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-bold">64-bit</td><td className="border border-gray-300 px-4 py-2 font-mono">-9,223,372,036,854,775,808</td><td className="border border-gray-300 px-4 py-2 font-mono">+9,223,372,036,854,775,807</td><td className="border border-gray-300 px-4 py-2">18,446,744,073,709,551,616</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Formula:</strong> For n-bit two's complement, range is from -2<sup>(n-1)</sup> to 2<sup>(n-1)</sup> - 1
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Why Use Two's Complement?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Two's complement</strong> is the standard for representing signed integers because of these advantages:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">➕ Single Addition Circuit</h3>
                <p className="text-sm text-gray-700">Computers can use the same circuitry for both addition and subtraction (just add the negative number).</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">🔢 Unique Zero</h3>
                <p className="text-sm text-gray-700">Only one representation of zero (unlike one's complement which has +0 and -0).</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">⚡ Fast Operations</h3>
                <p className="text-sm text-gray-700">Arithmetic operations are efficient without special case handling for signs.</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">🖥️ Universal Standard</h3>
                <p className="text-sm text-gray-700">All modern CPUs use two's complement for integer representation.</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">📊 Range Efficiency</h3>
                <p className="text-sm text-gray-700">Uses all available bit patterns efficiently (no wasted combinations).</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">🔧 Simple Negation</h3>
                <p className="text-sm text-gray-700">To negate a number, just take its two's complement—no complex logic needed.</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Common Two's Complement Examples</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Here are practical <strong>two's complement examples</strong> in 8-bit representation:
            </p>
            <div className="space-y-3">
              <div className="border-l-4 border-emerald-500 pl-4 bg-emerald-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">Decimal -1</h3>
                <p className="text-sm text-gray-700 font-mono">Binary: 11111111 (all bits set)</p>
                <p className="text-xs text-gray-600 mt-1">Process: +1 (00000001) → flip (11111110) → +1 = 11111111</p>
              </div>
              <div className="border-l-4 border-emerald-500 pl-4 bg-emerald-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">Decimal -128 (8-bit minimum)</h3>
                <p className="text-sm text-gray-700 font-mono">Binary: 10000000</p>
                <p className="text-xs text-gray-600 mt-1">Most negative number in 8-bit two's complement</p>
              </div>
              <div className="border-l-4 border-emerald-500 pl-4 bg-emerald-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">Decimal +127 (8-bit maximum)</h3>
                <p className="text-sm text-gray-700 font-mono">Binary: 01111111</p>
                <p className="text-xs text-gray-600 mt-1">Most positive number in 8-bit two's complement</p>
              </div>
              <div className="border-l-4 border-emerald-500 pl-4 bg-emerald-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">Decimal -10</h3>
                <p className="text-sm text-gray-700 font-mono">Binary: 11110110</p>
                <p className="text-xs text-gray-600 mt-1">Process: +10 (00001010) → flip (11110101) → +1 = 11110110</p>
              </div>
              <div className="border-l-4 border-emerald-500 pl-4 bg-emerald-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">Decimal 0</h3>
                <p className="text-sm text-gray-700 font-mono">Binary: 00000000</p>
                <p className="text-xs text-gray-600 mt-1">Only one representation of zero (unique property)</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Benefits of Using Our Calculator</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              ProURLMonitor's <strong>free two's complement calculator</strong> offers multiple advantages:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Instant Calculation:</strong> Calculate one's and two's complement in milliseconds.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Multiple Bit Widths:</strong> Support for 4-bit, 8-bit, 16-bit, and 32-bit representations.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Step-by-Step Process:</strong> See exactly how one's and two's complement are calculated.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Dual Interpretation:</strong> View both unsigned and signed (two's complement) decimal values.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Input Validation:</strong> Automatically checks for valid binary input and bit width constraints.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Educational Tool:</strong> Perfect for learning computer architecture and digital systems.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>100% Free:</strong> No registration, downloads, or hidden costs. Use unlimited times.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Mobile Friendly:</strong> Works on all devices—desktop, tablet, and smartphone.</span>
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
                  <a href="/tools/binary-calculator" className="hover:text-emerald-600">🧮 Binary Calculator</a>
                </h3>
                <p className="text-sm text-gray-700">Perform arithmetic operations on binary numbers (add, subtract, multiply, divide).</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/binary-to-decimal" className="hover:text-emerald-600">🔢 Binary to Decimal Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert binary numbers to decimal format for human-readable values.</p>
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
                <p className="text-sm text-gray-700">Convert binary numbers to hexadecimal format used in programming.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/hex-to-binary" className="hover:text-emerald-600">🔄 Hex to Binary Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert hexadecimal numbers to binary format—perfect for analyzing hex codes.</p>
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
                <p className="text-sm text-gray-700">Convert octal numbers to binary—perfect for understanding chmod permissions.</p>
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
                <h3 className="font-semibold text-gray-800 mb-2">Q: What is the two's complement of 00001010?</h3>
                <p className="text-gray-700 text-sm">A: Flip bits to get 11110101, then add 1 to get 11110110. This represents -10 in signed notation.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: How do I know if a binary number is negative in two's complement?</h3>
                <p className="text-gray-700 text-sm">A: Check the most significant bit (MSB). If it's 1, the number is negative. If it's 0, the number is positive.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Why does two's complement need to add 1 after flipping bits?</h3>
                <p className="text-gray-700 text-sm">A: Adding 1 ensures that a number plus its two's complement equals zero, which is essential for subtraction to work as addition of negative numbers.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What's the difference between one's and two's complement?</h3>
                <p className="text-gray-700 text-sm">A: One's complement just flips all bits. Two's complement flips all bits AND adds 1. Two's complement is preferred because it has only one zero and simplifies arithmetic.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Can I represent -128 in 8-bit two's complement?</h3>
                <p className="text-gray-700 text-sm">A: Yes! -128 is represented as 10000000. Interestingly, you cannot represent +128 in 8-bit two's complement (range is -128 to +127).</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Why is the range asymmetric (e.g., -128 to +127)?</h3>
                <p className="text-gray-700 text-sm">A: Because zero uses a positive bit pattern (00000000), leaving one extra negative value. This is why minimum is -2^(n-1) and maximum is 2^(n-1) - 1.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: How do computers perform subtraction using two's complement?</h3>
                <p className="text-gray-700 text-sm">A: To compute A - B, computers calculate A + (-B), where -B is the two's complement of B. This allows using the same addition circuit for both operations.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What happens if I overflow in two's complement?</h3>
                <p className="text-gray-700 text-sm">A: Overflow occurs when the result exceeds the representable range. For example, in 8-bit: 127 + 1 wraps to -128. Most systems have overflow flags to detect this.</p>
              </div>
            </div>
          </div>

          <div className="card bg-emerald-700 text-white">
            <h2 className="text-2xl font-bold mb-4">🚀 Start Calculating Two's Complement Now!</h2>
            <p className="mb-4">
              Use our <strong>free two's complement calculator</strong> to understand negative binary number representation. Perfect for computer science students, embedded systems programmers, digital logic designers, and anyone learning computer architecture. Calculate one's complement, two's complement, and see both signed and unsigned interpretations instantly.
            </p>
            <p className="mb-4">
              No registration required. Unlimited calculations. Completely free forever!
            </p>
            <p className="font-semibold">
              Explore more tools: <a href="/tools/binary-calculator" className="text-emerald-100 hover:text-white underline">Binary Calculator</a> • <a href="/tools/binary-to-decimal" className="text-emerald-100 hover:text-white underline">Binary to Decimal</a> • <a href="/tools/decimal-to-binary" className="text-emerald-100 hover:text-white underline">Decimal to Binary</a> 🎯
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
