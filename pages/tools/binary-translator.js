import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function BinaryTranslator() {
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');
  const [inputType, setInputType] = useState('binary');
  const [outputType, setOutputType] = useState('text');

  const convertBinary = () => {
    if (!inputValue.trim()) {
      setOutputValue('');
      return;
    }

    try {
      let result = '';

      // Binary to other conversions
      if (inputType === 'binary') {
        const binaryStrings = inputValue.trim().split(/\s+/);
        
        if (outputType === 'text') {
          result = binaryStrings.map(bin => {
            const decimal = parseInt(bin, 2);
            return String.fromCharCode(decimal);
          }).join('');
        } else if (outputType === 'decimal') {
          result = binaryStrings.map(bin => parseInt(bin, 2).toString()).join(' ');
        } else if (outputType === 'hexadecimal') {
          result = binaryStrings.map(bin => {
            const decimal = parseInt(bin, 2);
            return '0x' + decimal.toString(16).toUpperCase();
          }).join(' ');
        } else if (outputType === 'octal') {
          result = binaryStrings.map(bin => {
            const decimal = parseInt(bin, 2);
            return '0o' + decimal.toString(8);
          }).join(' ');
        }
      }

      // Text to binary conversion
      if (inputType === 'text') {
        result = inputValue.split('').map(char => {
          const binary = char.charCodeAt(0).toString(2).padStart(8, '0');
          if (outputType === 'binary') return binary;
          if (outputType === 'decimal') return char.charCodeAt(0).toString();
          if (outputType === 'hexadecimal') return '0x' + char.charCodeAt(0).toString(16).toUpperCase();
          if (outputType === 'octal') return '0o' + char.charCodeAt(0).toString(8);
        }).join(' ');
      }

      // Decimal to other conversions
      if (inputType === 'decimal') {
        const decimals = inputValue.trim().split(/\s+/).map(d => parseInt(d));
        
        if (outputType === 'binary') {
          result = decimals.map(d => d.toString(2).padStart(8, '0')).join(' ');
        } else if (outputType === 'text') {
          result = decimals.map(d => String.fromCharCode(d)).join('');
        } else if (outputType === 'hexadecimal') {
          result = decimals.map(d => '0x' + d.toString(16).toUpperCase()).join(' ');
        } else if (outputType === 'octal') {
          result = decimals.map(d => '0o' + d.toString(8)).join(' ');
        }
      }

      setOutputValue(result);
    } catch (error) {
      setOutputValue('Error in conversion. Please check your input.');
    }
  };

  const swapValues = () => {
    setInputValue(outputValue);
    setOutputValue(inputValue);
    const tempInput = inputType;
    setInputType(outputType);
    setOutputType(tempInput);
  };

  const reset = () => {
    setInputValue('');
    setOutputValue('');
    setInputType('binary');
    setOutputType('text');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputValue);
    alert('Copied to clipboard!');
  };

  const downloadResult = () => {
    const element = document.createElement('a');
    const file = new Blob([outputValue], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'binary_translation.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Layout>
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-emerald-800 mb-2">Binary Translator</h1>
        <p className="text-gray-600 mb-8">Convert between binary, text, decimal, hexadecimal, and octal formats instantly. 100% accurate conversion with instant results.</p>

        {/* Tool Interface */}
        <div className="bg-white border border-emerald-200 rounded-lg p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Input Side */}
            <div>
              <label className="block text-sm font-bold text-emerald-700 mb-2">Input Type</label>
              <select 
                value={inputType}
                onChange={(e) => setInputType(e.target.value)}
                className="w-full p-3 border border-emerald-300 rounded-lg mb-4 focus:outline-none focus:border-emerald-500"
              >
                <option value="binary">Binary</option>
                <option value="text">Text</option>
                <option value="decimal">Decimal</option>
                <option value="hexadecimal">Hexadecimal</option>
              </select>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter your binary code, text, or decimal numbers here..."
                className="w-full p-4 border border-emerald-300 rounded-lg font-mono text-sm focus:outline-none focus:border-emerald-500 min-h-40"
              />
            </div>

            {/* Output Side */}
            <div>
              <label className="block text-sm font-bold text-emerald-700 mb-2">Output Type</label>
              <select 
                value={outputType}
                onChange={(e) => setOutputType(e.target.value)}
                className="w-full p-3 border border-emerald-300 rounded-lg mb-4 focus:outline-none focus:border-emerald-500"
              >
                <option value="binary">Binary</option>
                <option value="text">Text</option>
                <option value="decimal">Decimal</option>
                <option value="hexadecimal">Hexadecimal</option>
                <option value="octal">Octal</option>
              </select>
              <textarea
                value={outputValue}
                readOnly
                placeholder="Your converted result will appear here..."
                className="w-full p-4 border border-emerald-300 rounded-lg font-mono text-sm bg-gray-50 min-h-40"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button 
              onClick={convertBinary}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-700 transition"
            >
              Convert
            </button>
            <button 
              onClick={swapValues}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
            >
              ⇅ Swap
            </button>
            <button 
              onClick={copyToClipboard}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-700 transition"
            >
              Copy
            </button>
            <button 
              onClick={downloadResult}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-700 transition"
            >
              Download
            </button>
            <button 
              onClick={reset}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-700 transition"
            >
              Reset
            </button>
          </div>
        </div>

        {/* What is Binary Translator */}
        <div className="mb-16 bg-emerald-50 border border-emerald-200 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-emerald-900 mb-6">What is Binary Translator?</h2>
          <p className="text-gray-800 mb-4">
            A <strong>Binary Translator</strong> is a tool to translate binary code into text for reading or printing purposes. You can translate binary to English by using multiple methods including ASCII and Unicode encoding. This tool converts between binary, decimal, hexadecimal, octal, and text formats with 100% accuracy.
          </p>
          <p className="text-gray-800">
            Binary is the fundamental language of computers, using only two digits (0 and 1) to represent all data. Our binary translator makes it easy to convert between different number systems and character encodings without needing to understand complex mathematical conversions.
          </p>
        </div>

        {/* How to Use */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-emerald-900 mb-6">How to Use Binary to Text Converter?</h2>
          <p className="text-gray-800 mb-6">Our binary translator has a very simple and user-friendly interface. Follow these steps to convert binary or other formats:</p>
          <ol className="space-y-3 text-gray-800 list-decimal list-inside">
            <li><strong>Select the input type</strong> from the dropdown menu (Binary, Text, Decimal, Hexadecimal)</li>
            <li><strong>Paste or enter your code</strong> in the Input box (e.g., binary code, text, or numbers)</li>
            <li><strong>Select the output type</strong> from the second dropdown (Binary, Text, Decimal, Hexadecimal, Octal)</li>
            <li><strong>Hit the Convert Button</strong> to translate instantly</li>
            <li><strong>Copy or Download</strong> your result for later use</li>
            <li><strong>Use the Swap button</strong> to reverse input and output</li>
            <li><strong>Click Reset</strong> to enter new values and start fresh</li>
          </ol>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-emerald-900 mb-6">Key Features of Binary Translator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-emerald-100 rounded-lg p-6">
              <h3 className="text-lg font-bold text-emerald-700 mb-2">✓ Multiple Conversions</h3>
              <p className="text-gray-700">Convert binary to decimal, binary to hexadecimal, binary to octal, text to binary, and vice versa instantly.</p>
            </div>
            <div className="bg-white border border-emerald-100 rounded-lg p-6">
              <h3 className="text-lg font-bold text-emerald-700 mb-2">✓ 100% Accurate</h3>
              <p className="text-gray-700">Precision conversion using standard ASCII and Unicode encoding. Get exact results every time without errors.</p>
            </div>
            <div className="bg-white border border-emerald-100 rounded-lg p-6">
              <h3 className="text-lg font-bold text-emerald-700 mb-2">✓ Instant Processing</h3>
              <p className="text-gray-700">Get results immediately without waiting. Real-time conversion as you enter your data.</p>
            </div>
            <div className="bg-white border border-emerald-100 rounded-lg p-6">
              <h3 className="text-lg font-bold text-emerald-700 mb-2">✓ Copy & Download</h3>
              <p className="text-gray-700">Copy results to clipboard or download as text file for use in other applications.</p>
            </div>
            <div className="bg-white border border-emerald-100 rounded-lg p-6">
              <h3 className="text-lg font-bold text-emerald-700 mb-2">✓ Swap Function</h3>
              <p className="text-gray-700">Reverse input and output instantly with the swap button for bidirectional conversion.</p>
            </div>
            <div className="bg-white border border-emerald-100 rounded-lg p-6">
              <h3 className="text-lg font-bold text-emerald-700 mb-2">✓ User-Friendly Interface</h3>
              <p className="text-gray-700">Simple design with clear labels and intuitive controls. No technical expertise needed.</p>
            </div>
          </div>
        </div>

        {/* Applications */}
        <div className="mb-16 bg-blue-50 border border-blue-200 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-blue-900 mb-6">Applications of Binary Code Translator</h2>
          <p className="text-gray-800 mb-4">
            The binary number system is fundamental to computing. The most common application for this number system can be seen in <strong>computer technology</strong>. After all, the basis for all computer language and programming is a two-digit number system used in digital encoding.
          </p>
          <ul className="space-y-3 text-gray-800 list-disc list-inside mb-4">
            <li><strong>Computer Programming:</strong> Understanding binary is essential for low-level programming and debugging</li>
            <li><strong>Digital Encoding:</strong> Binary represents all data in computers using restricted bits of 0s and 1s</li>
            <li><strong>Image Processing:</strong> Each pixel in digital images is encoded as a binary line with multiple bits</li>
            <li><strong>Color Representation:</strong> 16-bit codes give 65,000+ colors using binary combinations</li>
            <li><strong>Boolean Algebra:</strong> Logic statements are assigned 0 (false) or 1 (true) in mathematical logic</li>
            <li><strong>Network Data:</strong> Data transmission over networks uses binary encoding and conversion</li>
            <li><strong>Cryptography:</strong> Binary conversion is essential for encryption and security applications</li>
          </ul>
        </div>

        {/* Binary Numeral System */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-emerald-900 mb-6">What is Binary Numeral System?</h2>
          <p className="text-gray-800 mb-4">
            The <strong>binary decoder system</strong> is based on the number 2 (radix). It consists of only two numbers as a base-2 numeral system: <strong>0 and 1</strong>.
          </p>
          <p className="text-gray-800 mb-4">
            While it was applied for various purposes in ancient Egypt, China, and India, the binary system has become the modern world's language of electronics and computers. This is the most efficient system for detecting the <strong>OFF (0) and ON (1)</strong> state of an electrical signal.
          </p>
          <p className="text-gray-800">
            The Binary numeral system uses the combination of 0's and 1's to represent a number between 0 to 9. This combination is easily readable by the computer. Each digit of that combination is known as a <strong>bit</strong>.
          </p>
        </div>

        {/* Bit vs Byte */}
        <div className="mb-16 bg-white border border-emerald-200 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-emerald-900 mb-6">Difference between Bit and Byte</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-emerald-700 mb-3">Bit</h3>
              <p className="text-gray-800">
                <strong>1 Bit</strong> represents the <strong>single digit</strong> of a binary number. It's the smallest unit of data in computing, containing either 0 or 1.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-emerald-700 mb-3">Byte</h3>
              <p className="text-gray-800">
                <strong>1 Byte</strong> is equal to <strong>8 bits</strong>. A byte can represent 256 different values (0-255) and is the standard unit for storing characters and data.
              </p>
            </div>
          </div>
          <p className="text-gray-800 mt-6 bg-emerald-50 p-4 rounded">
            <strong>Crazy fact:</strong> It's easier to read a binary number than it looks! This is a positional system; therefore, every digit in a binary number is raised to the powers of 2, starting with 2⁰ from the right.
          </p>
        </div>

        {/* ASCII Section */}
        <div className="mb-16 bg-purple-50 border border-purple-200 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-purple-900 mb-6">What's ASCII?</h2>
          <p className="text-gray-800 mb-4">
            <strong>ASCII</strong> stands for American Standard Code for Information Interchange. It's an international standard used for encoding characters in electronic communication. In computers, telecommunications equipment, and other devices, ASCII codes represent text.
          </p>
          <p className="text-gray-800 mb-4">
            While many additional characters are supported, most modern character encoding schemes are based on ASCII. Originally based on the English alphabet, ASCII encodes 128 specified seven-bit integer characters.
          </p>
          <div className="bg-white p-4 rounded mb-4 border-l-4 border-purple-600">
            <h3 className="font-bold text-purple-900 mb-2">Binary to ASCII Encoding</h3>
            <p className="text-gray-800 mb-2">
              Ninety-five encoded characters are printable, including digits 0-9, lowercase letters a-z, uppercase letters A-Z, and punctuation symbols.
            </p>
            <p className="text-gray-800">
              For example: <strong>01101001 = 105 (decimal) = 69 (hexadecimal) = lowercase 'i'</strong> in ASCII encoding.
            </p>
          </div>
          <h3 className="font-bold text-purple-900 mb-3">Uses of ASCII</h3>
          <ul className="space-y-2 text-gray-800 list-disc list-inside">
            <li>Translate computer text into human-readable text (binary to English translator)</li>
            <li>Allow all computers to share documents and files in the same language</li>
            <li>Create a common standard for text communication across different systems</li>
            <li>Established in 1963 for the TWX (Teletype Writer eXchange) network</li>
            <li>Was the most common character encoding on the Web until UTF-8 replaced it in 2007</li>
          </ul>
        </div>

        {/* UTF-8 Unicode */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-emerald-900 mb-6">UTF-8 (Unicode)</h2>
          <p className="text-gray-800 mb-4">
            <strong>UTF-8</strong> is a character encoding that can be as compact as ASCII, but can also contain any unicode characters (with some file size increase). UTF stands for Unicode Transformation Format. The '8' means representing a character using 8-bit blocks.
          </p>
          <p className="text-gray-800 mb-4">
            The number of blocks that a character needs to represent varies from 1 to 4. One of UTF-8's really nice features is that it is compatible with null-terminated strings. When encoded, no character will have a byte null (0).
          </p>
          <p className="text-gray-800">
            Unicode and the Universal Character Set (UCS) have a much wider range of characters and have started to quickly replace ISO 8859 and ASCII in many situations. While ASCII is limited to 128 characters, Unicode and UCS support more than 140,000 characters.
          </p>
        </div>

        {/* ASCII vs UTF-8 */}
        <div className="mb-16 overflow-x-auto">
          <h2 className="text-3xl font-bold text-emerald-900 mb-6">Difference between ASCII & UTF-8</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-emerald-700 text-white">
                <th className="border border-emerald-600 p-3 text-left">Feature</th>
                <th className="border border-emerald-600 p-3 text-left">ASCII</th>
                <th className="border border-emerald-600 p-3 text-left">UTF-8</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white hover:bg-emerald-50">
                <td className="border border-emerald-200 p-3 font-bold">Type</td>
                <td className="border border-emerald-200 p-3">Character encoding standard</td>
                <td className="border border-emerald-200 p-3">Provides unique way to represent characters worldwide</td>
              </tr>
              <tr className="bg-emerald-50">
                <td className="border border-emerald-200 p-3 font-bold">Characters</td>
                <td className="border border-emerald-200 p-3">128 characters</td>
                <td className="border border-emerald-200 p-3">140,000+ characters</td>
              </tr>
              <tr className="bg-white hover:bg-emerald-50">
                <td className="border border-emerald-200 p-3 font-bold">Language Support</td>
                <td className="border border-emerald-200 p-3">English only</td>
                <td className="border border-emerald-200 p-3">All languages and special characters</td>
              </tr>
              <tr className="bg-emerald-50">
                <td className="border border-emerald-200 p-3 font-bold">Emojis</td>
                <td className="border border-emerald-200 p-3">Not supported</td>
                <td className="border border-emerald-200 p-3">Fully supported</td>
              </tr>
              <tr className="bg-white hover:bg-emerald-50">
                <td className="border border-emerald-200 p-3 font-bold">Compatibility</td>
                <td className="border border-emerald-200 p-3">Subset of UTF-8</td>
                <td className="border border-emerald-200 p-3">Superset (backward compatible)</td>
              </tr>
              <tr className="bg-emerald-50">
                <td className="border border-emerald-200 p-3 font-bold">Range</td>
                <td className="border border-emerald-200 p-3">Smaller range</td>
                <td className="border border-emerald-200 p-3">Wide range of characters</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Related Tools */}
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Related Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/tools/word-counter" className="text-emerald-600 hover:text-emerald-700 font-semibold">→ Word Counter</Link>
            <Link href="/tools/text-cleaner" className="text-emerald-600 hover:text-emerald-700 font-semibold">→ Text Cleaner</Link>
            <Link href="/tools/meta-generator" className="text-emerald-600 hover:text-emerald-700 font-semibold">→ Meta Generator</Link>
            <Link href="/tools/paraphraser" className="text-emerald-600 hover:text-emerald-700 font-semibold">→ Paraphraser</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
