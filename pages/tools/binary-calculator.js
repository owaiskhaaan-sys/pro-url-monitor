import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function BinaryCalculator() {
  const [firstNumber, setFirstNumber] = useState('');
  const [secondNumber, setSecondNumber] = useState('');
  const [operation, setOperation] = useState('add');
  const [binaryResult, setBinaryResult] = useState('');
  const [decimalResult, setDecimalResult] = useState('');
  const [hexResult, setHexResult] = useState('');
  const [error, setError] = useState('');

  const validateBinary = (value) => {
    return /^[01]+$/.test(value);
  };

  const binaryToDecimal = (binary) => {
    return parseInt(binary, 2);
  };

  const decimalToBinary = (decimal) => {
    return decimal.toString(2);
  };

  const decimalToHex = (decimal) => {
    return decimal.toString(16).toUpperCase();
  };

  const handleCalculate = () => {
    setError('');
    setBinaryResult('');
    setDecimalResult('');
    setHexResult('');

    if (!firstNumber || !secondNumber) {
      setError('Please enter both numbers');
      return;
    }

    if (!validateBinary(firstNumber)) {
      setError('First number must contain only 0 and 1');
      return;
    }

    if (!validateBinary(secondNumber)) {
      setError('Second number must contain only 0 and 1');
      return;
    }

    const num1 = binaryToDecimal(firstNumber);
    const num2 = binaryToDecimal(secondNumber);
    let result;

    switch (operation) {
      case 'add':
        result = num1 + num2;
        break;
      case 'subtract':
        result = num1 - num2;
        break;
      case 'multiply':
        result = num1 * num2;
        break;
      case 'divide':
        if (num2 === 0) {
          setError('Cannot divide by zero');
          return;
        }
        result = Math.floor(num1 / num2);
        break;
      default:
        result = 0;
    }

    setBinaryResult(decimalToBinary(result));
    setDecimalResult(result.toString());
    setHexResult(decimalToHex(result));
  };

  const handleReset = () => {
    setFirstNumber('');
    setSecondNumber('');
    setOperation('add');
    setBinaryResult('');
    setDecimalResult('');
    setHexResult('');
    setError('');
  };

  return (
    <Layout>
      <Head>
        <title>Binary Calculator - Add, Subtract, | ProURLMonitor</title>
        <meta name="description" content="Free online binary calculator for adding, subtracting, multiplying, and dividing binary numbers. Get instant results in binary, decimal, and..." />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/binary-calculator" />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4 text-center">Binary Calculator</h1>
        <p className="text-gray-600 mb-8 text-center">
          To use ProURLMonitor <strong>Binary Calculator</strong>, enter the values in the input boxes below and click on <strong>Calculate</strong> button.
        </p>

        <div className="card mb-8">
          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Number:</label>
              <input
                type="text"
                value={firstNumber}
                onChange={(e) => setFirstNumber(e.target.value)}
                placeholder="Enter binary number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Operation:</label>
              <select
                value={operation}
                onChange={(e) => setOperation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="add">add (+)</option>
                <option value="subtract">subtract (-)</option>
                <option value="multiply">multiply (×)</option>
                <option value="divide">divide (÷)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Second Number:</label>
              <input
                type="text"
                value={secondNumber}
                onChange={(e) => setSecondNumber(e.target.value)}
                placeholder="Enter binary number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono"
              />
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
          {binaryResult && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Binary number result:</label>
                <textarea
                  value={binaryResult}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-lg"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Decimal number result:</label>
                <textarea
                  value={decimalResult}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-lg"
                  rows="3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Hex number result:</label>
                <textarea
                  value={hexResult}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-lg"
                  rows="3"
                />
              </div>
            </div>
          )}
        </div>

        {/* SEO Content */}
        <div className="prose prose-emerald max-w-none mt-12 space-y-8">
          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">What is a Binary System?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The <strong>binary number system</strong> is a system of numbers which operates similar to the decimal system. In the decimal number system, the digit 10 is used as its base. However, in the binary system, the number 2 is used as a base. Additionally, in the decimal system, the numbers 0 to 9 are used. In the binary system, only two numbers are used which includes 0 and 1—every number is referred to as a <strong>bit</strong>. All other computations are done the same way as in the decimal system.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              The latest computer technology is based entirely on the binary number system. Binary can be easily executed in the internal wiring and mechanism of computer systems. The designing of hardware is not difficult at all because they only need to take into consideration two scenarios: either switched on or switched off (same as true or false, 1 or 0, positive or negative). This makes binary ideal for digital electronics and computing.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our free <strong>binary calculator</strong> makes it easy to perform addition, subtraction, multiplication, and division operations on binary numbers without manual calculations. Simply enter your binary values, select an operation, and get instant results in binary, decimal, and hexadecimal formats.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Binary Conversion Table</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Understanding how binary numbers correspond to decimal numbers is fundamental to working with binary calculations. Here's a quick reference table:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-emerald-100">
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Decimal Numbers</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Binary Numbers</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-gray-300 px-4 py-2">0</td><td className="border border-gray-300 px-4 py-2 font-mono">0</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2">1</td><td className="border border-gray-300 px-4 py-2 font-mono">1</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2">2</td><td className="border border-gray-300 px-4 py-2 font-mono">10</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2">3</td><td className="border border-gray-300 px-4 py-2 font-mono">11</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2">4</td><td className="border border-gray-300 px-4 py-2 font-mono">100</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2">5</td><td className="border border-gray-300 px-4 py-2 font-mono">101</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2">6</td><td className="border border-gray-300 px-4 py-2 font-mono">110</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2">7</td><td className="border border-gray-300 px-4 py-2 font-mono">111</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2">8</td><td className="border border-gray-300 px-4 py-2 font-mono">1000</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2">9</td><td className="border border-gray-300 px-4 py-2 font-mono">1001</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2">10</td><td className="border border-gray-300 px-4 py-2 font-mono">1010</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2">16</td><td className="border border-gray-300 px-4 py-2 font-mono">10000</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2">20</td><td className="border border-gray-300 px-4 py-2 font-mono">10100</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2">32</td><td className="border border-gray-300 px-4 py-2 font-mono">100000</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2">64</td><td className="border border-gray-300 px-4 py-2 font-mono">1000000</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              For easy conversions between different number systems, check out our other tools like <a href="/tools/binary-translator" className="text-emerald-600 hover:text-emerald-700 font-medium">Binary Translator</a> for text-to-binary conversion.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Binary Addition Calculator</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              There is a similarity between the addition process used in the binary system and the process of addition used in the decimal system. When there is a need to carry more than 1, then the values added become equal to 10 (in binary), which happens when the addition equals 2 in decimal. The binary addition rules are simple:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mb-4">
              <h3 className="font-semibold text-gray-800 mb-3">Binary Addition Rules:</h3>
              <ul className="space-y-2 text-gray-700 font-mono">
                <li><strong>0 + 0 = 0</strong></li>
                <li><strong>0 + 1 = 1</strong></li>
                <li><strong>1 + 0 = 1</strong></li>
                <li><strong>1 + 1 = 10</strong> (0 with a carry of 1)</li>
                <li><strong>1 + 1 + 1 = 11</strong> (1 with a carry of 1)</li>
              </ul>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Example:</strong> Let's add 1011 (11 in decimal) + 1101 (13 in decimal)
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4 font-mono text-sm">
              <pre className="text-gray-800">
{`    1 1 1    (carries)
    1 0 1 1
  + 1 1 0 1
  ---------
  1 1 0 0 0  = 24 in decimal`}
              </pre>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Our <strong>binary addition calculator</strong> handles all carrying automatically, making it simple to add binary values without manual methods. Just enter your binary numbers and click Calculate!
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Binary Subtraction Calculator</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Binary subtraction is similar to decimal subtraction, but it uses only 0 and 1. The concept of <strong>borrowing</strong> happens when the number being subtracted is greater than the number from which it is being subtracted. In the binary system, borrowing becomes necessary when subtracting 1 from 0.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mb-4">
              <h3 className="font-semibold text-gray-800 mb-3">Binary Subtraction Rules:</h3>
              <ul className="space-y-2 text-gray-700 font-mono">
                <li><strong>0 - 0 = 0</strong></li>
                <li><strong>1 - 0 = 1</strong></li>
                <li><strong>1 - 1 = 0</strong></li>
                <li><strong>0 - 1 = 1</strong> (with a borrow from the next column)</li>
              </ul>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Example:</strong> Let's subtract 1010 (10 in decimal) - 0110 (6 in decimal)
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4 font-mono text-sm">
              <pre className="text-gray-800">
{`    1 0 1 0
  - 0 1 1 0
  ---------
    0 1 0 0  = 4 in decimal`}
              </pre>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Use our <strong>binary subtraction calculator</strong> to perform subtractions instantly without worrying about borrowing rules—we handle all the complexity for you.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Binary Multiplication Calculator</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The process of binary multiplication is actually easier than decimal multiplication because only the digits 0 and 1 are used. The multiplication rules are straightforward: anything multiplied by 0 equals 0, and anything multiplied by 1 equals itself. The challenge comes from aligning and adding the partial products.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mb-4">
              <h3 className="font-semibold text-gray-800 mb-3">Binary Multiplication Rules:</h3>
              <ul className="space-y-2 text-gray-700 font-mono">
                <li><strong>0 × 0 = 0</strong></li>
                <li><strong>0 × 1 = 0</strong></li>
                <li><strong>1 × 0 = 0</strong></li>
                <li><strong>1 × 1 = 1</strong></li>
              </ul>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Example:</strong> Let's multiply 101 (5 in decimal) × 11 (3 in decimal)
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4 font-mono text-sm">
              <pre className="text-gray-800">
{`      1 0 1
    ×     1 1
    ---------
      1 0 1    (101 × 1)
    1 0 1      (101 × 1, shifted left)
    ---------
    1 1 1 1    = 15 in decimal`}
              </pre>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Our <strong>binary multiplication calculator</strong> handles all shifting and addition of partial products automatically, giving you accurate results in seconds.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Binary Division Calculator</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The concept of division in the binary system is the same as in the decimal system. The divisor divides the dividend, but instead of decimal subtraction, we use binary subtraction. Binary division requires skill in binary subtraction to perform accurately.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Example:</strong> Let's divide 1100 (12 in decimal) ÷ 11 (3 in decimal)
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4 font-mono text-sm">
              <pre className="text-gray-800">
{`        1 0 0  (quotient)
      --------
  11 | 1 1 0 0
       1 1
       -----
         0 0 0
           0 0
         -----
           0 0  (remainder)
           
Result: 100 (4 in decimal)`}
              </pre>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Use our <strong>binary division calculator</strong> to divide binary numbers effortlessly. The tool performs all subtraction steps and provides the quotient in binary, decimal, and hexadecimal formats.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">How to Use Our Binary Calculator</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Using ProURLMonitor's <strong>free binary calculator</strong> is incredibly simple. Follow these steps to perform binary calculations:
            </p>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 mb-4">
              <li><strong>Enter First Number:</strong> Type your first binary number in the "First Number" field. Only use digits 0 and 1.</li>
              <li><strong>Select Operation:</strong> Choose your desired operation from the dropdown menu:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>Add (+) for addition</li>
                  <li>Subtract (-) for subtraction</li>
                  <li>Multiply (×) for multiplication</li>
                  <li>Divide (÷) for division</li>
                </ul>
              </li>
              <li><strong>Enter Second Number:</strong> Type your second binary number in the "Second Number" field.</li>
              <li><strong>Calculate:</strong> Click the green "Calculate" button to perform the operation.</li>
              <li><strong>View Results:</strong> See your results displayed in three formats:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li><strong>Binary result</strong> - Answer in binary format</li>
                  <li><strong>Decimal result</strong> - Answer converted to decimal</li>
                  <li><strong>Hex result</strong> - Answer converted to hexadecimal</li>
                </ul>
              </li>
              <li><strong>Reset:</strong> Click "Reset" to clear all fields and start a new calculation.</li>
            </ol>
            <p className="text-gray-700 leading-relaxed">
              The calculator automatically validates your input to ensure only valid binary numbers (containing only 0 and 1) are processed. If you enter invalid characters, you'll receive an error message prompting you to correct your input.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Benefits of Using an Online Binary Calculator</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our <strong>online binary calculator</strong> offers numerous advantages for students, programmers, and digital electronics enthusiasts:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">⚡ Instant Results</h3>
                <p className="text-sm text-gray-700">Get immediate calculations without manual work. No need to perform long binary arithmetic by hand.</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">✓ Multiple Formats</h3>
                <p className="text-sm text-gray-700">View results in binary, decimal, and hexadecimal formats simultaneously for easy comparison and conversion.</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">🎓 Educational Tool</h3>
                <p className="text-sm text-gray-700">Perfect for learning binary arithmetic, computer science concepts, and digital logic design.</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">💯 Error-Free</h3>
                <p className="text-sm text-gray-700">Eliminate calculation mistakes. The tool performs accurate binary operations every time.</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">🆓 Completely Free</h3>
                <p className="text-sm text-gray-700">No registration, no downloads, no payments. Use our calculator as many times as you need.</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">📱 Works Anywhere</h3>
                <p className="text-sm text-gray-700">Access from any device—desktop, laptop, tablet, or smartphone. Works in your browser.</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              For text-based binary operations, you can also try our <a href="/tools/binary-translator" className="text-emerald-600 hover:text-emerald-700 font-medium">Binary Translator</a> tool to convert text to binary and vice versa.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Related Binary Conversion Tools</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              ProURLMonitor offers a complete suite of number system conversion tools to complement our binary calculator:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/binary-translator" className="hover:text-emerald-600">🔤 Binary Translator</a>
                </h3>
                <p className="text-sm text-gray-700">Convert text to binary code and binary to text instantly. Perfect for encoding and decoding messages.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/decimal-to-binary" className="hover:text-emerald-600">📊 Decimal to Binary Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert decimal numbers to binary format quickly and accurately.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/binary-to-decimal" className="hover:text-emerald-600">🔢 Binary to Decimal Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert binary numbers back to decimal format for easy understanding.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/binary-to-hex" className="hover:text-emerald-600">🔷 Binary to Hex Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert binary numbers to hexadecimal format used in programming and computer systems.</p>
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
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/twos-complement-calculator" className="hover:text-emerald-600">➮ Two's Complement Calculator</a>
                </h3>
                <p className="text-sm text-gray-700">Calculate one's and two's complement for negative binary number representation.</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">📚 Frequently Asked Questions (FAQs)</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What is binary and why is it used in computers?</h3>
                <p className="text-gray-700 text-sm">A: Binary is a base-2 number system using only 0 and 1. Computers use binary because it represents the two states of electronic circuits: on (1) and off (0). This makes binary ideal for digital electronics and data processing.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: How do I convert decimal to binary manually?</h3>
                <p className="text-gray-700 text-sm">A: Divide the decimal number by 2 repeatedly and write down the remainders. Read the remainders from bottom to top to get the binary representation. For example: 13 ÷ 2 = 6 R1, 6 ÷ 2 = 3 R0, 3 ÷ 2 = 1 R1, 1 ÷ 2 = 0 R1, giving 1101 in binary.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Can your binary calculator handle negative numbers?</h3>
                <p className="text-gray-700 text-sm">A: Currently, our calculator works with positive binary numbers. For operations that result in negative numbers (like 5 - 10), the result will show 0 or may not display correctly. We recommend keeping the first number larger for subtraction.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What happens if I enter numbers other than 0 and 1?</h3>
                <p className="text-gray-700 text-sm">A: The calculator validates your input and will show an error message if you enter invalid characters. Only 0 and 1 are accepted for binary calculations.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Is this binary calculator accurate?</h3>
                <p className="text-gray-700 text-sm">A: Yes! Our calculator uses JavaScript's built-in number conversion functions (parseInt, toString) which provide mathematically accurate results for all binary operations.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What's the maximum number size I can calculate?</h3>
                <p className="text-gray-700 text-sm">A: JavaScript can safely handle integers up to 2^53 - 1. This means you can work with binary numbers up to 53 bits long without losing precision.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Why does the hexadecimal result use letters?</h3>
                <p className="text-gray-700 text-sm">A: Hexadecimal is base-16 and uses 0-9 for values 0-9 and A-F for values 10-15. Letters A-F represent 10, 11, 12, 13, 14, and 15 respectively, allowing compact representation of large binary numbers.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Do I need to download or install anything?</h3>
                <p className="text-gray-700 text-sm">A: No! Our binary calculator runs entirely in your web browser. No downloads, installations, or registrations required. Just open the page and start calculating.</p>
              </div>
            </div>
          </div>

          <div className="card bg-emerald-700 text-white">
            <h2 className="text-2xl font-bold mb-4">🧮 Start Calculating Binary Numbers Now!</h2>
            <p className="mb-4">
              Use our <strong>free binary calculator</strong> to perform addition, subtraction, multiplication, and division on binary numbers instantly. Whether you're a student learning computer science, a programmer debugging code, or an engineer working with digital circuits, our tool makes binary arithmetic effortless.
            </p>
            <p className="mb-4">
              Get results in three formats simultaneously—binary, decimal, and hexadecimal—for maximum flexibility. No registration, no limits, completely free!
            </p>
            <p className="font-semibold">
              Explore more ProURLMonitor tools: <a href="/tools" className="text-emerald-100 hover:text-white underline">View All Tools</a> 🚀
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
