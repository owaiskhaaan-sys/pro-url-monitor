import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function BitwiseOperations() {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [operation, setOperation] = useState('AND');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const validateBinary = (value) => {
    return /^[01]+$/.test(value);
  };

  const handleCalculate = () => {
    setError('');
    setResult('');

    if (!input1.trim() || !input2.trim()) {
      setError('Please enter both binary numbers');
      return;
    }

    if (!validateBinary(input1) || !validateBinary(input2)) {
      setError('Please enter valid binary numbers (0s and 1s only)');
      return;
    }

    const num1 = parseInt(input1, 2);
    const num2 = parseInt(input2, 2);
    const maxLength = Math.max(input1.length, input2.length);

    let resultValue;
    let operationSymbol;

    switch (operation) {
      case 'AND':
        resultValue = num1 & num2;
        operationSymbol = '&';
        break;
      case 'OR':
        resultValue = num1 | num2;
        operationSymbol = '|';
        break;
      case 'XOR':
        resultValue = num1 ^ num2;
        operationSymbol = '^';
        break;
      case 'NAND':
        resultValue = ~(num1 & num2);
        operationSymbol = '⊼';
        break;
      case 'NOR':
        resultValue = ~(num1 | num2);
        operationSymbol = '⊽';
        break;
      case 'XNOR':
        resultValue = ~(num1 ^ num2);
        operationSymbol = '⊙';
        break;
      default:
        resultValue = num1 & num2;
        operationSymbol = '&';
    }

    // For bitwise NOT operations on result, we need to mask based on bit length
    if (['NAND', 'NOR', 'XNOR'].includes(operation)) {
      const mask = (1 << maxLength) - 1;
      resultValue = resultValue & mask;
    }

    const binaryResult = resultValue.toString(2).padStart(maxLength, '0');
    
    setResult({
      binary: binaryResult,
      decimal: resultValue,
      hex: resultValue.toString(16).toUpperCase(),
      operation: operationSymbol,
      input1Padded: input1.padStart(maxLength, '0'),
      input2Padded: input2.padStart(maxLength, '0')
    });
  };

  const handleNOT = (inputNumber) => {
    const value = inputNumber === 1 ? input1 : input2;
    
    if (!value.trim()) {
      setError(`Please enter binary number ${inputNumber}`);
      return;
    }

    if (!validateBinary(value)) {
      setError('Please enter valid binary number (0s and 1s only)');
      return;
    }

    const num = parseInt(value, 2);
    const bitLength = value.length;
    const mask = (1 << bitLength) - 1;
    const notResult = (~num) & mask;
    const binaryResult = notResult.toString(2).padStart(bitLength, '0');

    setError('');
    setResult({
      binary: binaryResult,
      decimal: notResult,
      hex: notResult.toString(16).toUpperCase(),
      operation: '~',
      input1Padded: value,
      input2Padded: '',
      isNOT: true
    });
  };

  const handleReset = () => {
    setInput1('');
    setInput2('');
    setOperation('AND');
    setResult('');
    setError('');
  };

  return (
    <Layout>
      <Head>
        <title>Bitwise Operations Calculator - AND, OR, | ProURLMonitor</title>
        <meta name="description" content="Free online bitwise operations calculator. Perform AND, OR, XOR, NOT, NAND, NOR, XNOR operations on binary numbers with step-by-step bit-by-bit..." />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/bitwise-operations" />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4 text-center">Bitwise Operations Calculator</h1>
        <p className="text-gray-600 mb-8 text-center">
          Perform bitwise AND, OR, XOR, NOT, NAND, NOR, and XNOR operations on binary numbers with detailed bit-by-bit analysis.
        </p>

        <div className="card mb-8">
          {/* Input Fields */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Binary Number 1:</label>
              <input
                type="text"
                value={input1}
                onChange={(e) => setInput1(e.target.value.replace(/[^01]/g, ''))}
                placeholder="e.g., 1010"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Binary Number 2:</label>
              <input
                type="text"
                value={input2}
                onChange={(e) => setInput2(e.target.value.replace(/[^01]/g, ''))}
                placeholder="e.g., 1100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-lg font-mono"
              />
            </div>
          </div>

          {/* Operation Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Operation:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['AND', 'OR', 'XOR', 'NAND', 'NOR', 'XNOR'].map((op) => (
                <button
                  key={op}
                  onClick={() => setOperation(op)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    operation === op
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {op}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            <button
              onClick={handleCalculate}
              className="btn btn-primary px-8 py-3"
            >
              Calculate {operation}
            </button>
            <button
              onClick={() => handleNOT(1)}
              className="btn bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
            >
              NOT Input 1
            </button>
            <button
              onClick={() => handleNOT(2)}
              className="btn bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
            >
              NOT Input 2
            </button>
            <button
              onClick={handleReset}
              className="btn bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3"
            >
              Reset
            </button>
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-lg border-2 border-emerald-200">
                <h3 className="text-lg font-semibold text-emerald-800 mb-3">Result:</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-20">Binary:</span>
                    <span className="text-2xl font-mono font-bold text-emerald-700">{result.binary}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-20">Decimal:</span>
                    <span className="text-xl font-mono font-bold text-gray-700">{result.decimal}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-20">Hex:</span>
                    <span className="text-xl font-mono font-bold text-purple-700">{result.hex}</span>
                  </div>
                </div>
              </div>

              {/* Bit-by-Bit Breakdown */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">📊 Bit-by-Bit Operation:</h3>
                {result.isNOT ? (
                  <div className="font-mono text-sm bg-white p-4 rounded border border-gray-300">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-gray-600">Input:</span>
                        <span className="text-xl font-bold tracking-wider">{result.input1Padded}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">NOT (~):</span>
                        <span className="text-xl font-bold text-emerald-700 tracking-wider">{result.binary}</span>
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-600">
                      Each bit is flipped: 0 → 1, 1 → 0
                    </div>
                  </div>
                ) : (
                  <div className="font-mono text-sm bg-white p-4 rounded border border-gray-300">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Input 1:</span>
                        <span className="text-xl tracking-wider">{result.input1Padded}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Input 2:</span>
                        <span className="text-xl tracking-wider">{result.input2Padded}</span>
                      </div>
                      <div className="flex justify-between items-center border-t-2 border-gray-400 pt-2">
                        <span className="text-gray-600">{operation} ({result.operation}):</span>
                        <span className="text-xl font-bold text-emerald-700 tracking-wider">{result.binary}</span>
                      </div>
                    </div>

                    {/* Truth Table for Operation */}
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <div className="text-xs text-gray-700 mb-2 font-semibold">Bit-by-bit calculation:</div>
                      <div className="grid grid-cols-4 gap-1 text-center text-xs">
                        <div className="font-semibold">A</div>
                        <div className="font-semibold">B</div>
                        <div className="font-semibold">{operation}</div>
                        <div></div>
                        {result.input1Padded.split('').map((bit1, idx) => {
                          const bit2 = result.input2Padded[idx];
                          const resultBit = result.binary[idx];
                          return (
                            <div key={idx} className="contents">
                              <div className="bg-blue-100 py-1">{bit1}</div>
                              <div className="bg-blue-100 py-1">{bit2}</div>
                              <div className="bg-emerald-100 py-1 font-bold">{resultBit}</div>
                              <div></div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* SEO Content */}
        <div className="prose prose-emerald max-w-none mt-12 space-y-8">
          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">What are Bitwise Operations?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Bitwise operations</strong> are logical operations that work directly on individual bits of binary numbers. These operations manipulate data at the bit level, making them extremely efficient for low-level programming, cryptography, graphics processing, and embedded systems. The main bitwise operations are AND (&), OR (|), XOR (^), NOT (~), NAND (⊼), NOR (⊽), and XNOR (⊙).
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              For example, performing AND operation on 1010 and 1100 gives 1000. This works by comparing each bit position: if both bits are 1, the result is 1; otherwise, it's 0. Bitwise operations are fundamental in computer science because computers process data as binary numbers internally. These operations are significantly faster than arithmetic operations because they work directly with the CPU's native binary representation.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our free <strong>bitwise operations calculator</strong> performs all seven major bitwise operations with detailed bit-by-bit breakdown. Perfect for programmers, students, and engineers working with binary logic. For other binary conversions, try our <a href="/tools/binary-calculator" className="text-emerald-600 hover:text-emerald-700 font-medium">Binary Calculator</a> or <a href="/tools/binary-to-decimal" className="text-emerald-600 hover:text-emerald-700 font-medium">Binary to Decimal Converter</a>.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Bitwise Operations Explained</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Understanding each <strong>bitwise operation</strong> with truth tables and examples:
            </p>

            <div className="space-y-4">
              {/* AND Operation */}
              <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">1. AND (&) Operation</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Returns 1 only if <strong>both</strong> bits are 1. Used for masking bits and checking flags.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-semibold mb-2">Truth Table:</div>
                    <table className="w-full text-xs border-collapse">
                      <thead><tr className="bg-blue-100"><th className="border p-1">A</th><th className="border p-1">B</th><th className="border p-1">A & B</th></tr></thead>
                      <tbody>
                        <tr><td className="border p-1 text-center">0</td><td className="border p-1 text-center">0</td><td className="border p-1 text-center font-bold">0</td></tr>
                        <tr><td className="border p-1 text-center">0</td><td className="border p-1 text-center">1</td><td className="border p-1 text-center font-bold">0</td></tr>
                        <tr><td className="border p-1 text-center">1</td><td className="border p-1 text-center">0</td><td className="border p-1 text-center font-bold">0</td></tr>
                        <tr><td className="border p-1 text-center">1</td><td className="border p-1 text-center">1</td><td className="border p-1 text-center font-bold text-emerald-700">1</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <div className="text-xs font-semibold mb-2">Example:</div>
                    <div className="font-mono text-xs bg-white p-3 rounded border">
                      <div>  1010 (10)</div>
                      <div>& 1100 (12)</div>
                      <div className="border-t mt-1 pt-1 font-bold">  1000 (8)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* OR Operation */}
              <div className="bg-purple-50 p-5 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">2. OR (|) Operation</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Returns 1 if <strong>at least one</strong> bit is 1. Used for setting bits and combining flags.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-semibold mb-2">Truth Table:</div>
                    <table className="w-full text-xs border-collapse">
                      <thead><tr className="bg-purple-100"><th className="border p-1">A</th><th className="border p-1">B</th><th className="border p-1">A | B</th></tr></thead>
                      <tbody>
                        <tr><td className="border p-1 text-center">0</td><td className="border p-1 text-center">0</td><td className="border p-1 text-center font-bold">0</td></tr>
                        <tr><td className="border p-1 text-center">0</td><td className="border p-1 text-center">1</td><td className="border p-1 text-center font-bold text-emerald-700">1</td></tr>
                        <tr><td className="border p-1 text-center">1</td><td className="border p-1 text-center">0</td><td className="border p-1 text-center font-bold text-emerald-700">1</td></tr>
                        <tr><td className="border p-1 text-center">1</td><td className="border p-1 text-center">1</td><td className="border p-1 text-center font-bold text-emerald-700">1</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <div className="text-xs font-semibold mb-2">Example:</div>
                    <div className="font-mono text-xs bg-white p-3 rounded border">
                      <div>  1010 (10)</div>
                      <div>| 1100 (12)</div>
                      <div className="border-t mt-1 pt-1 font-bold">  1110 (14)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* XOR Operation */}
              <div className="bg-emerald-50 p-5 rounded-lg border border-emerald-200">
                <h3 className="text-lg font-semibold text-emerald-800 mb-3">3. XOR (^) Operation</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Returns 1 if bits are <strong>different</strong>. Used for toggling bits and encryption.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-semibold mb-2">Truth Table:</div>
                    <table className="w-full text-xs border-collapse">
                      <thead><tr className="bg-emerald-100"><th className="border p-1">A</th><th className="border p-1">B</th><th className="border p-1">A ^ B</th></tr></thead>
                      <tbody>
                        <tr><td className="border p-1 text-center">0</td><td className="border p-1 text-center">0</td><td className="border p-1 text-center font-bold">0</td></tr>
                        <tr><td className="border p-1 text-center">0</td><td className="border p-1 text-center">1</td><td className="border p-1 text-center font-bold text-emerald-700">1</td></tr>
                        <tr><td className="border p-1 text-center">1</td><td className="border p-1 text-center">0</td><td className="border p-1 text-center font-bold text-emerald-700">1</td></tr>
                        <tr><td className="border p-1 text-center">1</td><td className="border p-1 text-center">1</td><td className="border p-1 text-center font-bold">0</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <div className="text-xs font-semibold mb-2">Example:</div>
                    <div className="font-mono text-xs bg-white p-3 rounded border">
                      <div>  1010 (10)</div>
                      <div>^ 1100 (12)</div>
                      <div className="border-t mt-1 pt-1 font-bold">  0110 (6)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* NOT Operation */}
              <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-200">
                <h3 className="text-lg font-semibold text-indigo-800 mb-3">4. NOT (~) Operation</h3>
                <p className="text-sm text-gray-700 mb-3">
                  <strong>Inverts</strong> all bits (0→1, 1→0). Used for bit flipping and complement operations.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-semibold mb-2">Truth Table:</div>
                    <table className="w-full text-xs border-collapse">
                      <thead><tr className="bg-indigo-100"><th className="border p-1">A</th><th className="border p-1">~A</th></tr></thead>
                      <tbody>
                        <tr><td className="border p-1 text-center">0</td><td className="border p-1 text-center font-bold text-emerald-700">1</td></tr>
                        <tr><td className="border p-1 text-center">1</td><td className="border p-1 text-center font-bold">0</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <div className="text-xs font-semibold mb-2">Example:</div>
                    <div className="font-mono text-xs bg-white p-3 rounded border">
                      <div>~ 1010 (10)</div>
                      <div className="border-t mt-1 pt-1 font-bold">  0101 (5)</div>
                      <div className="text-gray-600 text-xs mt-1">4-bit result</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Real-World Applications of Bitwise Operations</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Bitwise operations</strong> are used extensively in computer science and programming:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">🔐 Cryptography</h3>
                <p className="text-sm text-gray-700">XOR operations are fundamental in encryption algorithms like AES and stream ciphers.</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">🎮 Graphics Programming</h3>
                <p className="text-sm text-gray-700">AND/OR operations for pixel manipulation, color blending, and alpha compositing.</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">🚀 Performance Optimization</h3>
                <p className="text-sm text-gray-700">Bitwise operations are 2-10x faster than arithmetic for division/multiplication by powers of 2.</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">🏁 Flags & Permissions</h3>
                <p className="text-sm text-gray-700">File permissions (chmod), feature flags, and state management using bit masks.</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">🌐 Network Protocols</h3>
                <p className="text-sm text-gray-700">IP address masking, subnet calculations, and packet header manipulation.</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">💾 Data Compression</h3>
                <p className="text-sm text-gray-700">Bit-packing for efficient storage and compression algorithms like Huffman coding.</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              For file permission analysis, check our <a href="/tools/octal-to-binary" className="text-emerald-600 hover:text-emerald-700 font-medium">Octal to Binary Converter</a> tool.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Bitwise Operations Cheat Sheet</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Quick reference for all <strong>bitwise operations</strong>:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-emerald-100">
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Operation</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Symbol</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Description</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">AND</td><td className="border border-gray-300 px-4 py-2 font-mono">&</td><td className="border border-gray-300 px-4 py-2 text-sm">Both bits must be 1</td><td className="border border-gray-300 px-4 py-2 font-mono text-sm">1010 & 1100 = 1000</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">OR</td><td className="border border-gray-300 px-4 py-2 font-mono">|</td><td className="border border-gray-300 px-4 py-2 text-sm">At least one bit is 1</td><td className="border border-gray-300 px-4 py-2 font-mono text-sm">1010 | 1100 = 1110</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">XOR</td><td className="border border-gray-300 px-4 py-2 font-mono">^</td><td className="border border-gray-300 px-4 py-2 text-sm">Bits are different</td><td className="border border-gray-300 px-4 py-2 font-mono text-sm">1010 ^ 1100 = 0110</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">NOT</td><td className="border border-gray-300 px-4 py-2 font-mono">~</td><td className="border border-gray-300 px-4 py-2 text-sm">Inverts all bits</td><td className="border border-gray-300 px-4 py-2 font-mono text-sm">~1010 = 0101</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">NAND</td><td className="border border-gray-300 px-4 py-2 font-mono">⊼</td><td className="border border-gray-300 px-4 py-2 text-sm">NOT of AND</td><td className="border border-gray-300 px-4 py-2 font-mono text-sm">1010 ⊼ 1100 = 0111</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">NOR</td><td className="border border-gray-300 px-4 py-2 font-mono">⊽</td><td className="border border-gray-300 px-4 py-2 text-sm">NOT of OR</td><td className="border border-gray-300 px-4 py-2 font-mono text-sm">1010 ⊽ 1100 = 0001</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">XNOR</td><td className="border border-gray-300 px-4 py-2 font-mono">⊙</td><td className="border border-gray-300 px-4 py-2 text-sm">NOT of XOR (equality)</td><td className="border border-gray-300 px-4 py-2 font-mono text-sm">1010 ⊙ 1100 = 1001</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Benefits of Using Our Calculator</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              ProURLMonitor's <strong>free bitwise operations calculator</strong> offers:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>All 7 Operations:</strong> AND, OR, XOR, NOT, NAND, NOR, XNOR in one tool.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Bit-by-Bit Breakdown:</strong> See exactly how each bit position is calculated.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Multiple Formats:</strong> Get results in binary, decimal, and hexadecimal instantly.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Input Validation:</strong> Automatically filters invalid binary input.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>Educational:</strong> Perfect for learning logic gates and digital circuits.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span><strong>100% Free:</strong> No registration or downloads required.</span>
              </li>
            </ul>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Related Binary Conversion Tools</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Explore our complete suite of binary and number system tools:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/binary-calculator" className="hover:text-emerald-600">🧮 Binary Calculator</a>
                </h3>
                <p className="text-sm text-gray-700">Perform addition, subtraction, multiplication, and division on binary numbers.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/binary-to-decimal" className="hover:text-emerald-600">🔢 Binary to Decimal Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert binary numbers to decimal format instantly.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/binary-to-hex" className="hover:text-emerald-600">🔷 Binary to Hex Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert binary to hexadecimal using 4-bit grouping.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/twos-complement-calculator" className="hover:text-emerald-600">➖ Two's Complement Calculator</a>
                </h3>
                <p className="text-sm text-gray-700">Calculate two's complement for negative binary representation.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/decimal-to-hex" className="hover:text-emerald-600">🎨 Decimal to Hex Converter</a>
                </h3>
                <p className="text-sm text-gray-700">Convert decimal numbers to hex color codes.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/binary-translator" className="hover:text-emerald-600">🔤 Binary Translator</a>
                </h3>
                <p className="text-sm text-gray-700">Convert text to binary and decode binary to text.</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">📚 Frequently Asked Questions (FAQs)</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What is the difference between AND and OR?</h3>
                <p className="text-gray-700 text-sm">A: AND returns 1 only if both bits are 1. OR returns 1 if at least one bit is 1. Example: 1010 & 1100 = 1000, but 1010 | 1100 = 1110.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: When should I use XOR?</h3>
                <p className="text-gray-700 text-sm">A: XOR is perfect for toggling bits, swapping values without temp variables, simple encryption, and checking if bits are different. Property: A ^ B ^ B = A.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What is NAND and why is it special?</h3>
                <p className="text-gray-700 text-sm">A: NAND is NOT of AND (opposite of AND). It's universal—you can build all other logic gates using only NAND gates. Used extensively in digital circuit design.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: How is NOT different from NAND?</h3>
                <p className="text-gray-700 text-sm">A: NOT inverts a single input (~A), while NAND performs AND on two inputs then inverts the result (~(A & B)).</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Why use bitwise operations instead of regular operators?</h3>
                <p className="text-gray-700 text-sm">A: Bitwise operations are 2-10x faster because they work directly with CPU's native binary. Use for: flags, permissions, masks, fast multiplication/division by powers of 2.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What does XOR with itself return?</h3>
                <p className="text-gray-700 text-sm">A: A ^ A always equals 0. This property is used for swapping variables: A = A ^ B; B = A ^ B; A = A ^ B.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Can I use bitwise operations on hexadecimal?</h3>
                <p className="text-gray-700 text-sm">A: Yes! Convert hex to binary first, perform the operation, then convert back. Example: 0xF & 0xC = 0x8 (1111 & 1100 = 1000).</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What are bitwise shifts?</h3>
                <p className="text-gray-700 text-sm">A: Left shift (&lt;&lt;) multiplies by 2, right shift (&gt;&gt;) divides by 2. Example: 1010 &lt;&lt; 1 = 10100 (10 → 20), 1010 &gt;&gt; 1 = 0101 (10 → 5).</p>
              </div>
            </div>
          </div>

          <div className="card bg-emerald-700 text-white">
            <h2 className="text-2xl font-bold mb-4">🚀 Start Using Bitwise Operations Calculator Now!</h2>
            <p className="mb-4">
              Use our <strong>free bitwise operations calculator</strong> to perform AND, OR, XOR, NOT, NAND, NOR, and XNOR operations instantly. Perfect for programmers debugging bit-level code, students learning digital logic, embedded systems engineers working with registers, and anyone dealing with binary data manipulation. Get bit-by-bit breakdown with results in binary, decimal, and hex formats.
            </p>
            <p className="mb-4">
              No registration required. Unlimited calculations. Completely free forever!
            </p>
            <p className="font-semibold">
              Explore more tools: <a href="/tools/binary-calculator" className="text-emerald-100 hover:text-white underline">Binary Calculator</a> • <a href="/tools/twos-complement-calculator" className="text-emerald-100 hover:text-white underline">Two's Complement</a> • <a href="/tools/decimal-to-hex" className="text-emerald-100 hover:text-white underline">Decimal to Hex</a> 🎯
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
