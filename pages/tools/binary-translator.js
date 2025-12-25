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

        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4">Binary Translator</h1>
          <p className="text-gray-600 mb-8">Convert text to binary code and vice versa</p>

          {/* Tool UI Section - only at the top */}
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

          {/* Content Section - in the middle */}
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

          {/* Table Section - at the bottom */}
          <div className="card mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Some Common Values Table of Binary Code Translation</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 border-b font-semibold">Binary</th>
                    <th className="px-3 py-2 border-b font-semibold">Hexadecimal</th>
                    <th className="px-3 py-2 border-b font-semibold">ASCII</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="px-3 py-1 border-b">00000000</td><td className="px-3 py-1 border-b">00</td><td className="px-3 py-1 border-b">NUL</td></tr>
                  <tr><td className="px-3 py-1 border-b">00000001</td><td className="px-3 py-1 border-b">01</td><td className="px-3 py-1 border-b">SOH</td></tr>
                  <tr><td className="px-3 py-1 border-b">00000010</td><td className="px-3 py-1 border-b">02</td><td className="px-3 py-1 border-b">STX</td></tr>
                  <tr><td className="px-3 py-1 border-b">00000011</td><td className="px-3 py-1 border-b">03</td><td className="px-3 py-1 border-b">ETX</td></tr>
                  <tr><td className="px-3 py-1 border-b">00000100</td><td className="px-3 py-1 border-b">04</td><td className="px-3 py-1 border-b">EOT</td></tr>
                  <tr><td className="px-3 py-1 border-b">00000101</td><td className="px-3 py-1 border-b">05</td><td className="px-3 py-1 border-b">ENQ</td></tr>
                  <tr><td className="px-3 py-1 border-b">00000110</td><td className="px-3 py-1 border-b">06</td><td className="px-3 py-1 border-b">ACK</td></tr>
                  <tr><td className="px-3 py-1 border-b">00000111</td><td className="px-3 py-1 border-b">07</td><td className="px-3 py-1 border-b">BEL</td></tr>
                  <tr><td className="px-3 py-1 border-b">00001000</td><td className="px-3 py-1 border-b">08</td><td className="px-3 py-1 border-b">BS</td></tr>
                  <tr><td className="px-3 py-1 border-b">00001001</td><td className="px-3 py-1 border-b">09</td><td className="px-3 py-1 border-b">HT</td></tr>
                  <tr><td className="px-3 py-1 border-b">00001010</td><td className="px-3 py-1 border-b">0A</td><td className="px-3 py-1 border-b">LF</td></tr>
                  <tr><td className="px-3 py-1 border-b">00001011</td><td className="px-3 py-1 border-b">0B</td><td className="px-3 py-1 border-b">VT</td></tr>
                  <tr><td className="px-3 py-1 border-b">00001100</td><td className="px-3 py-1 border-b">0C</td><td className="px-3 py-1 border-b">FF</td></tr>
                  <tr><td className="px-3 py-1 border-b">00001101</td><td className="px-3 py-1 border-b">0D</td><td className="px-3 py-1 border-b">CR</td></tr>
                  <tr><td className="px-3 py-1 border-b">00001110</td><td className="px-3 py-1 border-b">0E</td><td className="px-3 py-1 border-b">SO</td></tr>
                  <tr><td className="px-3 py-1 border-b">00001111</td><td className="px-3 py-1 border-b">0F</td><td className="px-3 py-1 border-b">SI</td></tr>
                  <tr><td className="px-3 py-1 border-b">00010000</td><td className="px-3 py-1 border-b">10</td><td className="px-3 py-1 border-b">DLE</td></tr>
                  <tr><td className="px-3 py-1 border-b">00010001</td><td className="px-3 py-1 border-b">11</td><td className="px-3 py-1 border-b">DC1</td></tr>
                  <tr><td className="px-3 py-1 border-b">00010010</td><td className="px-3 py-1 border-b">12</td><td className="px-3 py-1 border-b">DC2</td></tr>
                  <tr><td className="px-3 py-1 border-b">00010011</td><td className="px-3 py-1 border-b">13</td><td className="px-3 py-1 border-b">DC3</td></tr>
                  <tr><td className="px-3 py-1 border-b">00010100</td><td className="px-3 py-1 border-b">14</td><td className="px-3 py-1 border-b">DC4</td></tr>
                  <tr><td className="px-3 py-1 border-b">00010101</td><td className="px-3 py-1 border-b">15</td><td className="px-3 py-1 border-b">NAK</td></tr>
                  <tr><td className="px-3 py-1 border-b">00010110</td><td className="px-3 py-1 border-b">16</td><td className="px-3 py-1 border-b">SYN</td></tr>
                  <tr><td className="px-3 py-1 border-b">00010111</td><td className="px-3 py-1 border-b">17</td><td className="px-3 py-1 border-b">ETB</td></tr>
                  <tr><td className="px-3 py-1 border-b">00011000</td><td className="px-3 py-1 border-b">18</td><td className="px-3 py-1 border-b">CAN</td></tr>
                  <tr><td className="px-3 py-1 border-b">00011001</td><td className="px-3 py-1 border-b">19</td><td className="px-3 py-1 border-b">EM</td></tr>
                  <tr><td className="px-3 py-1 border-b">00011010</td><td className="px-3 py-1 border-b">1A</td><td className="px-3 py-1 border-b">SUB</td></tr>
                  <tr><td className="px-3 py-1 border-b">00011011</td><td className="px-3 py-1 border-b">1B</td><td className="px-3 py-1 border-b">ESC</td></tr>
                  <tr><td className="px-3 py-1 border-b">00011100</td><td className="px-3 py-1 border-b">1C</td><td className="px-3 py-1 border-b">FS</td></tr>
                  <tr><td className="px-3 py-1 border-b">00011101</td><td className="px-3 py-1 border-b">1D</td><td className="px-3 py-1 border-b">GS</td></tr>
                  <tr><td className="px-3 py-1 border-b">00011110</td><td className="px-3 py-1 border-b">1E</td><td className="px-3 py-1 border-b">RS</td></tr>
                  <tr><td className="px-3 py-1 border-b">00011111</td><td className="px-3 py-1 border-b">1F</td><td className="px-3 py-1 border-b">US</td></tr>
                  <tr><td className="px-3 py-1 border-b">00100000</td><td className="px-3 py-1 border-b">20</td><td className="px-3 py-1 border-b">Space</td></tr>
                  <tr><td className="px-3 py-1 border-b">00100001</td><td className="px-3 py-1 border-b">21</td><td className="px-3 py-1 border-b">!</td></tr>
                  <tr><td className="px-3 py-1 border-b">00100010</td><td className="px-3 py-1 border-b">22</td><td className="px-3 py-1 border-b">"</td></tr>
                  <tr><td className="px-3 py-1 border-b">00100011</td><td className="px-3 py-1 border-b">23</td><td className="px-3 py-1 border-b">#</td></tr>
                  <tr><td className="px-3 py-1 border-b">00100100</td><td className="px-3 py-1 border-b">24</td><td className="px-3 py-1 border-b">$</td></tr>
                  <tr><td className="px-3 py-1 border-b">00100101</td><td className="px-3 py-1 border-b">25</td><td className="px-3 py-1 border-b">%</td></tr>
                  <tr><td className="px-3 py-1 border-b">00100110</td><td className="px-3 py-1 border-b">26</td><td className="px-3 py-1 border-b">&</td></tr>
                  <tr><td className="px-3 py-1 border-b">00100111</td><td className="px-3 py-1 border-b">27</td><td className="px-3 py-1 border-b">'</td></tr>
                  <tr><td className="px-3 py-1 border-b">00101000</td><td className="px-3 py-1 border-b">28</td><td className="px-3 py-1 border-b">(</td></tr>
                  <tr><td className="px-3 py-1 border-b">00101001</td><td className="px-3 py-1 border-b">29</td><td className="px-3 py-1 border-b">)</td></tr>
                  <tr><td className="px-3 py-1 border-b">00101010</td><td className="px-3 py-1 border-b">2A</td><td className="px-3 py-1 border-b">*</td></tr>
                  <tr><td className="px-3 py-1 border-b">00101011</td><td className="px-3 py-1 border-b">2B</td><td className="px-3 py-1 border-b">+</td></tr>
                  <tr><td className="px-3 py-1 border-b">00101100</td><td className="px-3 py-1 border-b">2C</td><td className="px-3 py-1 border-b">,</td></tr>
                  <tr><td className="px-3 py-1 border-b">00101101</td><td className="px-3 py-1 border-b">2D</td><td className="px-3 py-1 border-b">-</td></tr>
                  <tr><td className="px-3 py-1 border-b">00101110</td><td className="px-3 py-1 border-b">2E</td><td className="px-3 py-1 border-b">.</td></tr>
                  <tr><td className="px-3 py-1 border-b">00101111</td><td className="px-3 py-1 border-b">2F</td><td className="px-3 py-1 border-b">/</td></tr>
                  <tr><td className="px-3 py-1 border-b">00110000</td><td className="px-3 py-1 border-b">30</td><td className="px-3 py-1 border-b">0</td></tr>
                  <tr><td className="px-3 py-1 border-b">00110001</td><td className="px-3 py-1 border-b">31</td><td className="px-3 py-1 border-b">1</td></tr>
                  <tr><td className="px-3 py-1 border-b">00110010</td><td className="px-3 py-1 border-b">32</td><td className="px-3 py-1 border-b">2</td></tr>
                  <tr><td className="px-3 py-1 border-b">00110011</td><td className="px-3 py-1 border-b">33</td><td className="px-3 py-1 border-b">3</td></tr>
                  <tr><td className="px-3 py-1 border-b">00110100</td><td className="px-3 py-1 border-b">34</td><td className="px-3 py-1 border-b">4</td></tr>
                  <tr><td className="px-3 py-1 border-b">00110101</td><td className="px-3 py-1 border-b">35</td><td className="px-3 py-1 border-b">5</td></tr>
                  <tr><td className="px-3 py-1 border-b">00110110</td><td className="px-3 py-1 border-b">36</td><td className="px-3 py-1 border-b">6</td></tr>
                  <tr><td className="px-3 py-1 border-b">00110111</td><td className="px-3 py-1 border-b">37</td><td className="px-3 py-1 border-b">7</td></tr>
                  <tr><td className="px-3 py-1 border-b">00111000</td><td className="px-3 py-1 border-b">38</td><td className="px-3 py-1 border-b">8</td></tr>
                  <tr><td className="px-3 py-1 border-b">00111001</td><td className="px-3 py-1 border-b">39</td><td className="px-3 py-1 border-b">9</td></tr>
                  <tr><td className="px-3 py-1 border-b">00111010</td><td className="px-3 py-1 border-b">3A</td><td className="px-3 py-1 border-b">:</td></tr>
                  <tr><td className="px-3 py-1 border-b">00111011</td><td className="px-3 py-1 border-b">3B</td><td className="px-3 py-1 border-b">;</td></tr>
                  <tr><td className="px-3 py-1 border-b">00111100</td><td className="px-3 py-1 border-b">3C</td><td className="px-3 py-1 border-b">&lt;</td></tr>
                  <tr><td className="px-3 py-1 border-b">00111101</td><td className="px-3 py-1 border-b">3D</td><td className="px-3 py-1 border-b">=</td></tr>
                  <tr><td className="px-3 py-1 border-b">00111110</td><td className="px-3 py-1 border-b">3E</td><td className="px-3 py-1 border-b">&gt;</td></tr>
                  <tr><td className="px-3 py-1 border-b">00111111</td><td className="px-3 py-1 border-b">3F</td><td className="px-3 py-1 border-b">?</td></tr>
                  <tr><td className="px-3 py-1 border-b">01000000</td><td className="px-3 py-1 border-b">40</td><td className="px-3 py-1 border-b">@</td></tr>
                  <tr><td className="px-3 py-1 border-b">01000001</td><td className="px-3 py-1 border-b">41</td><td className="px-3 py-1 border-b">A</td></tr>
                  <tr><td className="px-3 py-1 border-b">01000010</td><td className="px-3 py-1 border-b">42</td><td className="px-3 py-1 border-b">B</td></tr>
                  <tr><td className="px-3 py-1 border-b">01000011</td><td className="px-3 py-1 border-b">43</td><td className="px-3 py-1 border-b">C</td></tr>
                  <tr><td className="px-3 py-1 border-b">01000100</td><td className="px-3 py-1 border-b">44</td><td className="px-3 py-1 border-b">D</td></tr>
                  <tr><td className="px-3 py-1 border-b">01000101</td><td className="px-3 py-1 border-b">45</td><td className="px-3 py-1 border-b">E</td></tr>
                  <tr><td className="px-3 py-1 border-b">01000110</td><td className="px-3 py-1 border-b">46</td><td className="px-3 py-1 border-b">F</td></tr>
                  <tr><td className="px-3 py-1 border-b">01000111</td><td className="px-3 py-1 border-b">47</td><td className="px-3 py-1 border-b">G</td></tr>
                  <tr><td className="px-3 py-1 border-b">01001000</td><td className="px-3 py-1 border-b">48</td><td className="px-3 py-1 border-b">H</td></tr>
                  <tr><td className="px-3 py-1 border-b">01001001</td><td className="px-3 py-1 border-b">49</td><td className="px-3 py-1 border-b">I</td></tr>
                  <tr><td className="px-3 py-1 border-b">01001010</td><td className="px-3 py-1 border-b">4A</td><td className="px-3 py-1 border-b">J</td></tr>
                  <tr><td className="px-3 py-1 border-b">01001011</td><td className="px-3 py-1 border-b">4B</td><td className="px-3 py-1 border-b">K</td></tr>
                  <tr><td className="px-3 py-1 border-b">01001100</td><td className="px-3 py-1 border-b">4C</td><td className="px-3 py-1 border-b">L</td></tr>
                  <tr><td className="px-3 py-1 border-b">01001101</td><td className="px-3 py-1 border-b">4D</td><td className="px-3 py-1 border-b">M</td></tr>
                  <tr><td className="px-3 py-1 border-b">01001110</td><td className="px-3 py-1 border-b">4E</td><td className="px-3 py-1 border-b">N</td></tr>
                  <tr><td className="px-3 py-1 border-b">01001111</td><td className="px-3 py-1 border-b">4F</td><td className="px-3 py-1 border-b">O</td></tr>
                  <tr><td className="px-3 py-1 border-b">01010000</td><td className="px-3 py-1 border-b">50</td><td className="px-3 py-1 border-b">P</td></tr>
                  <tr><td className="px-3 py-1 border-b">01010001</td><td className="px-3 py-1 border-b">51</td><td className="px-3 py-1 border-b">Q</td></tr>
                  <tr><td className="px-3 py-1 border-b">01010010</td><td className="px-3 py-1 border-b">52</td><td className="px-3 py-1 border-b">R</td></tr>
                  <tr><td className="px-3 py-1 border-b">01010011</td><td className="px-3 py-1 border-b">53</td><td className="px-3 py-1 border-b">S</td></tr>
                  <tr><td className="px-3 py-1 border-b">01010100</td><td className="px-3 py-1 border-b">54</td><td className="px-3 py-1 border-b">T</td></tr>
                  <tr><td className="px-3 py-1 border-b">01010101</td><td className="px-3 py-1 border-b">55</td><td className="px-3 py-1 border-b">U</td></tr>
                  <tr><td className="px-3 py-1 border-b">01010110</td><td className="px-3 py-1 border-b">56</td><td className="px-3 py-1 border-b">V</td></tr>
                  <tr><td className="px-3 py-1 border-b">01010111</td><td className="px-3 py-1 border-b">57</td><td className="px-3 py-1 border-b">W</td></tr>
                  <tr><td className="px-3 py-1 border-b">01011000</td><td className="px-3 py-1 border-b">58</td><td className="px-3 py-1 border-b">X</td></tr>
                  <tr><td className="px-3 py-1 border-b">01011001</td><td className="px-3 py-1 border-b">59</td><td className="px-3 py-1 border-b">Y</td></tr>
                  <tr><td className="px-3 py-1 border-b">01011010</td><td className="px-3 py-1 border-b">5A</td><td className="px-3 py-1 border-b">Z</td></tr>
                  <tr><td className="px-3 py-1 border-b">01011011</td><td className="px-3 py-1 border-b">5B</td><td className="px-3 py-1 border-b">[</td></tr>
                  <tr><td className="px-3 py-1 border-b">01011100</td><td className="px-3 py-1 border-b">5C</td><td className="px-3 py-1 border-b">\</td></tr>
                  <tr><td className="px-3 py-1 border-b">01011101</td><td className="px-3 py-1 border-b">5D</td><td className="px-3 py-1 border-b">]</td></tr>
                  <tr><td className="px-3 py-1 border-b">01011110</td><td className="px-3 py-1 border-b">5E</td><td className="px-3 py-1 border-b">^</td></tr>
                  <tr><td className="px-3 py-1 border-b">01011111</td><td className="px-3 py-1 border-b">5F</td><td className="px-3 py-1 border-b">_</td></tr>
                  <tr><td className="px-3 py-1 border-b">01100000</td><td className="px-3 py-1 border-b">60</td><td className="px-3 py-1 border-b">`</td></tr>
                  <tr><td className="px-3 py-1 border-b">01100001</td><td className="px-3 py-1 border-b">61</td><td className="px-3 py-1 border-b">a</td></tr>
                  <tr><td className="px-3 py-1 border-b">01100010</td><td className="px-3 py-1 border-b">62</td><td className="px-3 py-1 border-b">b</td></tr>
                  <tr><td className="px-3 py-1 border-b">01100011</td><td className="px-3 py-1 border-b">63</td><td className="px-3 py-1 border-b">c</td></tr>
                  <tr><td className="px-3 py-1 border-b">01100100</td><td className="px-3 py-1 border-b">64</td><td className="px-3 py-1 border-b">d</td></tr>
                  <tr><td className="px-3 py-1 border-b">01100101</td><td className="px-3 py-1 border-b">65</td><td className="px-3 py-1 border-b">e</td></tr>
                  <tr><td className="px-3 py-1 border-b">01100110</td><td className="px-3 py-1 border-b">66</td><td className="px-3 py-1 border-b">f</td></tr>
                  <tr><td className="px-3 py-1 border-b">01100111</td><td className="px-3 py-1 border-b">67</td><td className="px-3 py-1 border-b">g</td></tr>
                  <tr><td className="px-3 py-1 border-b">01101000</td><td className="px-3 py-1 border-b">68</td><td className="px-3 py-1 border-b">h</td></tr>
                  <tr><td className="px-3 py-1 border-b">01101001</td><td className="px-3 py-1 border-b">69</td><td className="px-3 py-1 border-b">i</td></tr>
                  <tr><td className="px-3 py-1 border-b">01101010</td><td className="px-3 py-1 border-b">6A</td><td className="px-3 py-1 border-b">j</td></tr>
                  <tr><td className="px-3 py-1 border-b">01101011</td><td className="px-3 py-1 border-b">6B</td><td className="px-3 py-1 border-b">k</td></tr>
                  <tr><td className="px-3 py-1 border-b">01101100</td><td className="px-3 py-1 border-b">6C</td><td className="px-3 py-1 border-b">l</td></tr>
                  <tr><td className="px-3 py-1 border-b">01101101</td><td className="px-3 py-1 border-b">6D</td><td className="px-3 py-1 border-b">m</td></tr>
                  <tr><td className="px-3 py-1 border-b">01101110</td><td className="px-3 py-1 border-b">6E</td><td className="px-3 py-1 border-b">n</td></tr>
                  <tr><td className="px-3 py-1 border-b">01101111</td><td className="px-3 py-1 border-b">6F</td><td className="px-3 py-1 border-b">o</td></tr>
                  <tr><td className="px-3 py-1 border-b">01110000</td><td className="px-3 py-1 border-b">70</td><td className="px-3 py-1 border-b">p</td></tr>
                  <tr><td className="px-3 py-1 border-b">01110001</td><td className="px-3 py-1 border-b">71</td><td className="px-3 py-1 border-b">q</td></tr>
                  <tr><td className="px-3 py-1 border-b">01110010</td><td className="px-3 py-1 border-b">72</td><td className="px-3 py-1 border-b">r</td></tr>
                  <tr><td className="px-3 py-1 border-b">01110011</td><td className="px-3 py-1 border-b">73</td><td className="px-3 py-1 border-b">s</td></tr>
                  <tr><td className="px-3 py-1 border-b">01110100</td><td className="px-3 py-1 border-b">74</td><td className="px-3 py-1 border-b">t</td></tr>
                  <tr><td className="px-3 py-1 border-b">01110101</td><td className="px-3 py-1 border-b">75</td><td className="px-3 py-1 border-b">u</td></tr>
                  <tr><td className="px-3 py-1 border-b">01110110</td><td className="px-3 py-1 border-b">76</td><td className="px-3 py-1 border-b">v</td></tr>
                  <tr><td className="px-3 py-1 border-b">01110111</td><td className="px-3 py-1 border-b">77</td><td className="px-3 py-1 border-b">w</td></tr>
                  <tr><td className="px-3 py-1 border-b">01111000</td><td className="px-3 py-1 border-b">78</td><td className="px-3 py-1 border-b">x</td></tr>
                  <tr><td className="px-3 py-1 border-b">01111001</td><td className="px-3 py-1 border-b">79</td><td className="px-3 py-1 border-b">y</td></tr>
                  <tr><td className="px-3 py-1 border-b">01111010</td><td className="px-3 py-1 border-b">7A</td><td className="px-3 py-1 border-b">z</td></tr>
                  <tr><td className="px-3 py-1 border-b">01111011</td><td className="px-3 py-1 border-b">7B</td><td className="px-3 py-1 border-b">{</td></tr>
                  <tr><td className="px-3 py-1 border-b">01111100</td><td className="px-3 py-1 border-b">7C</td><td className="px-3 py-1 border-b">|</td></tr>
                  <tr><td className="px-3 py-1 border-b">01111101</td><td className="px-3 py-1 border-b">7D</td><td className="px-3 py-1 border-b">}</td></tr>
                  <tr><td className="px-3 py-1 border-b">01111110</td><td className="px-3 py-1 border-b">7E</td><td className="px-3 py-1 border-b">~</td></tr>
                  <tr><td className="px-3 py-1 border-b">01111111</td><td className="px-3 py-1 border-b">7F</td><td className="px-3 py-1 border-b">DEL</td></tr>
                </tbody>
              </table>
            </div>
          </div>
                          <tr><td className="px-3 py-1 border-b">00111000</td><td className="px-3 py-1 border-b">38</td><td className="px-3 py-1 border-b">8</td></tr>
                          <tr><td className="px-3 py-1 border-b">00111001</td><td className="px-3 py-1 border-b">39</td><td className="px-3 py-1 border-b">9</td></tr>
                          <tr><td className="px-3 py-1 border-b">00111010</td><td className="px-3 py-1 border-b">3A</td><td className="px-3 py-1 border-b">:</td></tr>
                          <tr><td className="px-3 py-1 border-b">00111011</td><td className="px-3 py-1 border-b">3B</td><td className="px-3 py-1 border-b">;</td></tr>
                          <tr><td className="px-3 py-1 border-b">00111100</td><td className="px-3 py-1 border-b">3C</td><td className="px-3 py-1 border-b">&lt;</td></tr>
                          <tr><td className="px-3 py-1 border-b">00111101</td><td className="px-3 py-1 border-b">3D</td><td className="px-3 py-1 border-b">=</td></tr>
                          <tr><td className="px-3 py-1 border-b">00111110</td><td className="px-3 py-1 border-b">3E</td><td className="px-3 py-1 border-b">&gt;</td></tr>
                          <tr><td className="px-3 py-1 border-b">00111111</td><td className="px-3 py-1 border-b">3F</td><td className="px-3 py-1 border-b">?</td></tr>
                          <tr><td className="px-3 py-1 border-b">01000000</td><td className="px-3 py-1 border-b">40</td><td className="px-3 py-1 border-b">@</td></tr>
                          <tr><td className="px-3 py-1 border-b">01000001</td><td className="px-3 py-1 border-b">41</td><td className="px-3 py-1 border-b">A</td></tr>
                          <tr><td className="px-3 py-1 border-b">01000010</td><td className="px-3 py-1 border-b">42</td><td className="px-3 py-1 border-b">B</td></tr>
                          <tr><td className="px-3 py-1 border-b">01000011</td><td className="px-3 py-1 border-b">43</td><td className="px-3 py-1 border-b">C</td></tr>
                          <tr><td className="px-3 py-1 border-b">01000100</td><td className="px-3 py-1 border-b">44</td><td className="px-3 py-1 border-b">D</td></tr>
                          <tr><td className="px-3 py-1 border-b">01000101</td><td className="px-3 py-1 border-b">45</td><td className="px-3 py-1 border-b">E</td></tr>
                          <tr><td className="px-3 py-1 border-b">01000110</td><td className="px-3 py-1 border-b">46</td><td className="px-3 py-1 border-b">F</td></tr>
                          <tr><td className="px-3 py-1 border-b">01000111</td><td className="px-3 py-1 border-b">47</td><td className="px-3 py-1 border-b">G</td></tr>
                          <tr><td className="px-3 py-1 border-b">01001000</td><td className="px-3 py-1 border-b">48</td><td className="px-3 py-1 border-b">H</td></tr>
                          <tr><td className="px-3 py-1 border-b">01001001</td><td className="px-3 py-1 border-b">49</td><td className="px-3 py-1 border-b">I</td></tr>
                          <tr><td className="px-3 py-1 border-b">01001010</td><td className="px-3 py-1 border-b">4A</td><td className="px-3 py-1 border-b">J</td></tr>
                          <tr><td className="px-3 py-1 border-b">01001011</td><td className="px-3 py-1 border-b">4B</td><td className="px-3 py-1 border-b">K</td></tr>
                          <tr><td className="px-3 py-1 border-b">01001100</td><td className="px-3 py-1 border-b">4C</td><td className="px-3 py-1 border-b">L</td></tr>
                          <tr><td className="px-3 py-1 border-b">01001101</td><td className="px-3 py-1 border-b">4D</td><td className="px-3 py-1 border-b">M</td></tr>
                          <tr><td className="px-3 py-1 border-b">01001110</td><td className="px-3 py-1 border-b">4E</td><td className="px-3 py-1 border-b">N</td></tr>
                          <tr><td className="px-3 py-1 border-b">01001111</td><td className="px-3 py-1 border-b">4F</td><td className="px-3 py-1 border-b">O</td></tr>
                          <tr><td className="px-3 py-1 border-b">01010000</td><td className="px-3 py-1 border-b">50</td><td className="px-3 py-1 border-b">P</td></tr>
                          <tr><td className="px-3 py-1 border-b">01010001</td><td className="px-3 py-1 border-b">51</td><td className="px-3 py-1 border-b">Q</td></tr>
                          <tr><td className="px-3 py-1 border-b">01010010</td><td className="px-3 py-1 border-b">52</td><td className="px-3 py-1 border-b">R</td></tr>
                          <tr><td className="px-3 py-1 border-b">01010011</td><td className="px-3 py-1 border-b">53</td><td className="px-3 py-1 border-b">S</td></tr>
                          <tr><td className="px-3 py-1 border-b">01010100</td><td className="px-3 py-1 border-b">54</td><td className="px-3 py-1 border-b">T</td></tr>
                          <tr><td className="px-3 py-1 border-b">01010101</td><td className="px-3 py-1 border-b">55</td><td className="px-3 py-1 border-b">U</td></tr>
                          <tr><td className="px-3 py-1 border-b">01010110</td><td className="px-3 py-1 border-b">56</td><td className="px-3 py-1 border-b">V</td></tr>
                          <tr><td className="px-3 py-1 border-b">01010111</td><td className="px-3 py-1 border-b">57</td><td className="px-3 py-1 border-b">W</td></tr>
                          <tr><td className="px-3 py-1 border-b">01011000</td><td className="px-3 py-1 border-b">58</td><td className="px-3 py-1 border-b">X</td></tr>
                          <tr><td className="px-3 py-1 border-b">01011001</td><td className="px-3 py-1 border-b">59</td><td className="px-3 py-1 border-b">Y</td></tr>
                          <tr><td className="px-3 py-1 border-b">01011010</td><td className="px-3 py-1 border-b">5A</td><td className="px-3 py-1 border-b">Z</td></tr>
                          <tr><td className="px-3 py-1 border-b">01011011</td><td className="px-3 py-1 border-b">5B</td><td className="px-3 py-1 border-b">[</td></tr>
                          <tr><td className="px-3 py-1 border-b">01011100</td><td className="px-3 py-1 border-b">5C</td><td className="px-3 py-1 border-b">\</td></tr>
                          <tr><td className="px-3 py-1 border-b">01011101</td><td className="px-3 py-1 border-b">5D</td><td className="px-3 py-1 border-b">]</td></tr>
                          <tr><td className="px-3 py-1 border-b">01011110</td><td className="px-3 py-1 border-b">5E</td><td className="px-3 py-1 border-b">^</td></tr>
                          <tr><td className="px-3 py-1 border-b">01011111</td><td className="px-3 py-1 border-b">5F</td><td className="px-3 py-1 border-b">_</td></tr>
                          <tr><td className="px-3 py-1 border-b">01100000</td><td className="px-3 py-1 border-b">60</td><td className="px-3 py-1 border-b">`</td></tr>
                          <tr><td className="px-3 py-1 border-b">01100001</td><td className="px-3 py-1 border-b">61</td><td className="px-3 py-1 border-b">a</td></tr>
                          <tr><td className="px-3 py-1 border-b">01100010</td><td className="px-3 py-1 border-b">62</td><td className="px-3 py-1 border-b">b</td></tr>
                          <tr><td className="px-3 py-1 border-b">01100011</td><td className="px-3 py-1 border-b">63</td><td className="px-3 py-1 border-b">c</td></tr>
                          <tr><td className="px-3 py-1 border-b">01100100</td><td className="px-3 py-1 border-b">64</td><td className="px-3 py-1 border-b">d</td></tr>
                          <tr><td className="px-3 py-1 border-b">01100101</td><td className="px-3 py-1 border-b">65</td><td className="px-3 py-1 border-b">e</td></tr>
                          <tr><td className="px-3 py-1 border-b">01100110</td><td className="px-3 py-1 border-b">66</td><td className="px-3 py-1 border-b">f</td></tr>
                          <tr><td className="px-3 py-1 border-b">01100111</td><td className="px-3 py-1 border-b">67</td><td className="px-3 py-1 border-b">g</td></tr>
                          <tr><td className="px-3 py-1 border-b">01101000</td><td className="px-3 py-1 border-b">68</td><td className="px-3 py-1 border-b">h</td></tr>
                          <tr><td className="px-3 py-1 border-b">01101001</td><td className="px-3 py-1 border-b">69</td><td className="px-3 py-1 border-b">i</td></tr>
                          <tr><td className="px-3 py-1 border-b">01101010</td><td className="px-3 py-1 border-b">6A</td><td className="px-3 py-1 border-b">j</td></tr>
                          <tr><td className="px-3 py-1 border-b">01101011</td><td className="px-3 py-1 border-b">6B</td><td className="px-3 py-1 border-b">k</td></tr>
                          <tr><td className="px-3 py-1 border-b">01101100</td><td className="px-3 py-1 border-b">6C</td><td className="px-3 py-1 border-b">l</td></tr>
                          <tr><td className="px-3 py-1 border-b">01101101</td><td className="px-3 py-1 border-b">6D</td><td className="px-3 py-1 border-b">m</td></tr>
                          <tr><td className="px-3 py-1 border-b">01101110</td><td className="px-3 py-1 border-b">6E</td><td className="px-3 py-1 border-b">n</td></tr>
                          <tr><td className="px-3 py-1 border-b">01101111</td><td className="px-3 py-1 border-b">6F</td><td className="px-3 py-1 border-b">o</td></tr>
                          <tr><td className="px-3 py-1 border-b">01110000</td><td className="px-3 py-1 border-b">70</td><td className="px-3 py-1 border-b">p</td></tr>
                          <tr><td className="px-3 py-1 border-b">01110001</td><td className="px-3 py-1 border-b">71</td><td className="px-3 py-1 border-b">q</td></tr>
                          <tr><td className="px-3 py-1 border-b">01110010</td><td className="px-3 py-1 border-b">72</td><td className="px-3 py-1 border-b">r</td></tr>
                          <tr><td className="px-3 py-1 border-b">01110011</td><td className="px-3 py-1 border-b">73</td><td className="px-3 py-1 border-b">s</td></tr>
                          <tr><td className="px-3 py-1 border-b">01110100</td><td className="px-3 py-1 border-b">74</td><td className="px-3 py-1 border-b">t</td></tr>
                          <tr><td className="px-3 py-1 border-b">01110101</td><td className="px-3 py-1 border-b">75</td><td className="px-3 py-1 border-b">u</td></tr>
                          <tr><td className="px-3 py-1 border-b">01110110</td><td className="px-3 py-1 border-b">76</td><td className="px-3 py-1 border-b">v</td></tr>
                          <tr><td className="px-3 py-1 border-b">01110111</td><td className="px-3 py-1 border-b">77</td><td className="px-3 py-1 border-b">w</td></tr>
                          <tr><td className="px-3 py-1 border-b">01111000</td><td className="px-3 py-1 border-b">78</td><td className="px-3 py-1 border-b">x</td></tr>
                          <tr><td className="px-3 py-1 border-b">01111001</td><td className="px-3 py-1 border-b">79</td><td className="px-3 py-1 border-b">y</td></tr>
                          <tr><td className="px-3 py-1 border-b">01111010</td><td className="px-3 py-1 border-b">7A</td><td className="px-3 py-1 border-b">z</td></tr>
                          <tr><td className="px-3 py-1 border-b">01111011</td><td className="px-3 py-1 border-b">7B</td><td className="px-3 py-1 border-b">{</td></tr>
                          <tr><td className="px-3 py-1 border-b">01111100</td><td className="px-3 py-1 border-b">7C</td><td className="px-3 py-1 border-b">|</td></tr>
                          <tr><td className="px-3 py-1 border-b">01111101</td><td className="px-3 py-1 border-b">7D</td><td className="px-3 py-1 border-b">}</td></tr>
                          <tr><td className="px-3 py-1 border-b">01111110</td><td className="px-3 py-1 border-b">7E</td><td className="px-3 py-1 border-b">~</td></tr>
                          <tr><td className="px-3 py-1 border-b">01111111</td><td className="px-3 py-1 border-b">7F</td><td className="px-3 py-1 border-b">DEL</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
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
