import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function BinaryTranslator() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState('textToBinary'); // textToBinary or binaryToText

  const textToBinary = (text) => {
    return text.split('').map(char => {
      return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join(' ');
  };

  const binaryToText = (binary) => {
    return binary.split(' ').map(bin => {
      return String.fromCharCode(parseInt(bin, 2));
    }).join('');
  };

  const handleConvert = () => {
    if (!inputText.trim()) {
      alert('Please enter some text');
      return;
    }

    try {
      if (mode === 'textToBinary') {
        setOutputText(textToBinary(inputText));
      } else {
        setOutputText(binaryToText(inputText));
      }
    } catch (error) {
      alert('Invalid input for conversion');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    alert('Copied to clipboard!');
  };

  return (
    <Layout>
      <Head>
        <title>Binary Translator - Text to Binary Converter | ProURLMonitor</title>
        <meta name="description" content="Free binary translator tool. Convert text to binary code and binary to text instantly." />
      </Head>


      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4">Binary Translator</h1>
        <p className="text-gray-600 mb-8">Convert text to binary code and vice versa</p>

        {/* Tool UI Section - stays at the top */}
        <div className="card mb-6">
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setMode('textToBinary')}
              className={`px-4 py-2 rounded-lg ${mode === 'textToBinary' ? 'bg-emerald-600 text-white' : 'bg-gray-200'}`}
            >
              Text → Binary
            </button>
            <button
              onClick={() => setMode('binaryToText')}
              className={`px-4 py-2 rounded-lg ${mode === 'binaryToText' ? 'bg-emerald-600 text-white' : 'bg-gray-200'}`}
            >
              Binary → Text
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {mode === 'textToBinary' ? 'Enter Text' : 'Enter Binary (space-separated)'}
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows="6"
              placeholder={mode === 'textToBinary' ? 'Hello World' : '01001000 01100101 01101100 01101100 01101111'}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button onClick={handleConvert} className="btn btn-primary w-full mb-4">
            🔄 Convert
          </button>

          {outputText && (
            <>
              <label className="block text-sm font-medium text-gray-700 mb-2">Result:</label>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <pre className="whitespace-pre-wrap break-all font-mono text-sm">{outputText}</pre>
              </div>
              <button onClick={copyToClipboard} className="btn btn-secondary w-full">
                📋 Copy to Clipboard
              </button>
            </>
          )}
        </div>

        {/* Content Section - now below the tool */}
        <div className="card mb-6">
          <p className="text-gray-600 mb-8">
            Binary translator is a tool to translate binary code into text for reading or printing purposes. You can translate binary to English by using two methods; ASCII and Unicode.
          </p>
          <h2 className="text-xl font-bold text-emerald-700 mb-2">How to use Binary to Text converter?</h2>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Select the input type from the drop-down menu</li>
            <li>You can upload a .txt file or, Paste your relevant code in the Input box.</li>
            <li>Select the output type</li>
            <li>Hit the Convert Button</li>
            <li>You can “copy or download” your result</li>
            <li>You can swap the input boxes by clicking on the “Swap” button</li>
            <li>Click on the “reset” button to enter new values</li>
          </ul>
          <h2 className="text-xl font-bold text-emerald-700 mb-2">Key Features of Binary Translator:</h2>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Upload a file or document from local storage.</li>
            <li>Multiple conversions: binary to hexadecimal, octal, decimal, and vice versa.</li>
            <li>100% accurate and instant conversions.</li>
            <li>Copy or download the report easily.</li>
          </ul>
          <h2 className="text-xl font-bold text-emerald-700 mb-2">Applications of Binary Code Translator:</h2>
          <p className="mb-4">The most common application for this number system can be seen in computer technology. All computer language and programming is based on a two-digit number system used in digital encoding. For example, images on your computer screen are encoded using binary for each pixel. In mathematics, especially Boolean algebra, binary is used to assign logic and truth values (0 or 1).</p>
          <h2 className="text-xl font-bold text-emerald-700 mb-2">What is Binary Numeral System?</h2>
          <p className="mb-4">The binary decoder system is based on the number 2 (radix). It consists of only two numbers as a base-2 numeral system: 0 and 1. This is the most efficient system for detecting the OFF (0) and ON (1) state of an electrical signal. Each digit is called a bit, and 8 bits make a byte.</p>
          <h2 className="text-xl font-bold text-emerald-700 mb-2">Difference between Bit and Byte:</h2>
          <p className="mb-4">Bit and Byte are two significant units in the binary number system. “One-bit” represents a single digit of a binary number, whereas “one-byte” is equal to “8-bits”.</p>
          <h2 className="text-xl font-bold text-emerald-700 mb-2">What’s ASCII?</h2>
          <p className="mb-4">ASCII is an international standard used for encoding characters in electronic communication. It encodes 128 specified seven-bit integer characters, including digits, letters, and symbols. ASCII is the basis for most modern character encoding schemes.</p>
          <h2 className="text-xl font-bold text-emerald-700 mb-2">Binary to ASCII</h2>
          <p className="mb-4">ASCII encodes 128 characters, including printable and non-printable control codes. For example, binary 1101001 = hexadecimal 69 = decimal 105 represents lowercase 'i' in ASCII.</p>
          <h2 className="text-xl font-bold text-emerald-700 mb-2">UTF-8 (Unicode)</h2>
          <p className="mb-4">UTF-8 is a character encoding that can be as compact as ASCII but can also contain any unicode characters. It is compatible with ASCII and supports special characters and emojis.</p>
          <h2 className="text-xl font-bold text-emerald-700 mb-2">Key Advantages of the Binary Number System:</h2>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Reliable safety range for computer operations</li>
            <li>Minimizes necessary circuitry, saving space and energy</li>
          </ul>
          <h2 className="text-xl font-bold text-emerald-700 mb-2">Fun Fact</h2>
          <p className="mb-4">You can encode or translate binary messages written in binary numerals. For example, (01101001)(01101100011011110111011001100101)(011110010110111101110101) = I Love You</p>
        </div>

        <div className="card mb-6">
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setMode('textToBinary')}
              className={`px-4 py-2 rounded-lg ${mode === 'textToBinary' ? 'bg-emerald-600 text-white' : 'bg-gray-200'}`}
            >
              Text → Binary
            </button>
            <button
              onClick={() => setMode('binaryToText')}
              className={`px-4 py-2 rounded-lg ${mode === 'binaryToText' ? 'bg-emerald-600 text-white' : 'bg-gray-200'}`}
            >
              Binary → Text
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {mode === 'textToBinary' ? 'Enter Text' : 'Enter Binary (space-separated)'}
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows="6"
              placeholder={mode === 'textToBinary' ? 'Hello World' : '01001000 01100101 01101100 01101100 01101111'}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button onClick={handleConvert} className="btn btn-primary w-full mb-4">
            🔄 Convert
          </button>

          {outputText && (
            <>
              <label className="block text-sm font-medium text-gray-700 mb-2">Result:</label>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <pre className="whitespace-pre-wrap break-all font-mono text-sm">{outputText}</pre>
              </div>
              <button onClick={copyToClipboard} className="btn btn-secondary w-full">
                📋 Copy to Clipboard
              </button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
