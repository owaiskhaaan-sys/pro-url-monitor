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
