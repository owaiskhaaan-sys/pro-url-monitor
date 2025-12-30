import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function TextReverser() {
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');

  const reverseText = () => {
    setOutput(text.split('').reverse().join(''));
  };

  const reverseWords = () => {
    setOutput(text.split(' ').reverse().join(' '));
  };

  const reverseLines = () => {
    setOutput(text.split('\n').reverse().join('\n'));
  };

  const reverseEachWord = () => {
    const reversed = text.split(' ').map(word => word.split('').reverse().join('')).join(' ');
    setOutput(reversed);
  };

  const flipText = () => {
    const flipped = text.split('').reverse().map(char => {
      const flips = {
        'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ',
        'h': 'ɥ', 'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u',
        'o': 'o', 'p': 'd', 'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n',
        'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z',
        'A': '∀', 'B': 'q', 'C': 'Ɔ', 'D': 'p', 'E': 'Ǝ', 'F': 'Ⅎ', 'G': 'פ',
        'H': 'H', 'I': 'I', 'J': 'ſ', 'K': 'ʞ', 'L': '˥', 'M': 'W', 'N': 'N',
        'O': 'O', 'P': 'Ԁ', 'Q': 'Ò', 'R': 'ɹ', 'S': 'S', 'T': '┴', 'U': '∩',
        'V': 'Λ', 'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z',
        '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ',
        '8': '8', '9': '6', '0': '0',
        '.': '˙', ',': '\'', '?': '¿', '!': '¡', '(': ')', ')': '(',
        '[': ']', ']': '[', '{': '}', '}': '{', '<': '>', '>': '<',
        '&': '⅋', '_': '‾', ';': '؛', '"': '„', '\'': ','
      };
      return flips[char] || char;
    }).join('');
    setOutput(flipped);
  };

  const reverseAndPreserveCase = () => {
    const reversed = text.split('').reverse();
    const result = text.split('').map((char, index) => {
      const revChar = reversed[index];
      if (char === char.toUpperCase() && char !== char.toLowerCase()) {
        return revChar.toUpperCase();
      } else if (char === char.toLowerCase() && char !== char.toUpperCase()) {
        return revChar.toLowerCase();
      }
      return revChar;
    }).join('');
    setOutput(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    alert('Copied to clipboard!');
  };

  const clearAll = () => {
    setText('');
    setOutput('');
  };

  const loadExample = () => {
    setText('The quick brown fox jumps over the lazy dog');
  };

  const getStats = (str) => {
    const chars = str.length;
    const charsNoSpaces = str.replace(/\s/g, '').length;
    const words = str.trim() ? str.trim().split(/\s+/).length : 0;
    const lines = str.split('\n').length;
    return { chars, charsNoSpaces, words, lines };
  };

  const inputStats = getStats(text);
  const outputStats = getStats(output);

  return (
    <Layout>
      <Head>
        <title>Text Reverser - Reverse Words and Letters Online</title>
        <meta name="description" content="Reverse text, words, or letters instantly. Free online text reverser tool to flip text backwards, create mirror text, and reverse strings." />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/text-reverser" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Text Reverser
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Reverse your text in multiple ways. Perfect for fun messages, social media posts, and text manipulation.
            </p>
          </div>

          {/* Tool Interface */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            {/* Input Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Input Text
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter or paste your text here..."
                className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                <span>Characters: {inputStats.chars}</span>
                <span>Words: {inputStats.words}</span>
                <span>Lines: {inputStats.lines}</span>
              </div>
            </div>

            {/* Reverse Options */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Reverse Options
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <button
                  onClick={reverseText}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                >
                  🔄 Reverse Text
                </button>
                <button
                  onClick={reverseWords}
                  className="px-4 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition font-medium text-sm"
                >
                  🔃 Reverse Words
                </button>
                <button
                  onClick={reverseLines}
                  className="px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium text-sm"
                >
                  ↕️ Reverse Lines
                </button>
                <button
                  onClick={reverseEachWord}
                  className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm"
                >
                  🔀 Reverse Each Word
                </button>
                <button
                  onClick={flipText}
                  className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium text-sm"
                >
                  ↻ Flip Upside Down
                </button>
                <button
                  onClick={reverseAndPreserveCase}
                  className="px-4 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-medium text-sm"
                >
                  🔠 Reverse (Keep Case)
                </button>
              </div>
            </div>

            {/* Output Section */}
            {output && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Output
                </label>
                <textarea
                  value={output}
                  readOnly
                  className="w-full h-48 p-4 border border-gray-300 rounded-lg bg-gray-50 resize-none font-mono text-sm"
                />
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>Characters: {outputStats.chars}</span>
                  <span>Words: {outputStats.words}</span>
                  <span>Lines: {outputStats.lines}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={loadExample}
                className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
              >
                Load Example
              </button>
              {output && (
                <button
                  onClick={copyToClipboard}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-lg"
                >
                  📋 Copy Output
                </button>
              )}
              <button
                onClick={clearAll}
                className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Clear All
              </button>
            </div>

            {/* Info Notice */}
            <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400">
              <div className="flex">
                <span className="text-blue-400 mr-3">ℹ️</span>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">Privacy First</h4>
                  <p className="text-sm text-blue-700">
                    All text reversing happens locally in your browser. Your text is never sent to any server.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Examples Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Reverse Examples
            </h2>

            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Reverse Text (Character by Character)</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <span className="text-gray-600 w-20">Input:</span>
                    <span className="font-mono bg-gray-50 px-2 py-1 rounded flex-1">Hello World</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-600 w-20">Output:</span>
                    <span className="font-mono bg-blue-50 px-2 py-1 rounded flex-1">dlroW olleH</span>
                  </div>
                  <p className="text-gray-600 pl-20">Reverses every character including spaces</p>
                </div>
              </div>

              <div className="border-l-4 border-cyan-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Reverse Words (Word Order)</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <span className="text-gray-600 w-20">Input:</span>
                    <span className="font-mono bg-gray-50 px-2 py-1 rounded flex-1">Hello World</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-600 w-20">Output:</span>
                    <span className="font-mono bg-cyan-50 px-2 py-1 rounded flex-1">World Hello</span>
                  </div>
                  <p className="text-gray-600 pl-20">Reverses word order, keeps words intact</p>
                </div>
              </div>

              <div className="border-l-4 border-teal-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Reverse Lines</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <span className="text-gray-600 w-20">Input:</span>
                    <span className="font-mono bg-gray-50 px-2 py-1 rounded flex-1">Line 1<br/>Line 2<br/>Line 3</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-600 w-20">Output:</span>
                    <span className="font-mono bg-teal-50 px-2 py-1 rounded flex-1">Line 3<br/>Line 2<br/>Line 1</span>
                  </div>
                  <p className="text-gray-600 pl-20">Reverses line order in multi-line text</p>
                </div>
              </div>

              <div className="border-l-4 border-indigo-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Reverse Each Word</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <span className="text-gray-600 w-20">Input:</span>
                    <span className="font-mono bg-gray-50 px-2 py-1 rounded flex-1">Hello World</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-600 w-20">Output:</span>
                    <span className="font-mono bg-indigo-50 px-2 py-1 rounded flex-1">olleH dlroW</span>
                  </div>
                  <p className="text-gray-600 pl-20">Reverses characters within each word</p>
                </div>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Flip Upside Down</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <span className="text-gray-600 w-20">Input:</span>
                    <span className="font-mono bg-gray-50 px-2 py-1 rounded flex-1">Hello World</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-600 w-20">Output:</span>
                    <span className="font-mono bg-purple-50 px-2 py-1 rounded flex-1">plɹoM ollǝH</span>
                  </div>
                  <p className="text-gray-600 pl-20">Uses special Unicode characters to flip text</p>
                </div>
              </div>

              <div className="border-l-4 border-pink-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Reverse and Preserve Case</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <span className="text-gray-600 w-20">Input:</span>
                    <span className="font-mono bg-gray-50 px-2 py-1 rounded flex-1">Hello World</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-600 w-20">Output:</span>
                    <span className="font-mono bg-pink-50 px-2 py-1 rounded flex-1">Dlrow Olleh</span>
                  </div>
                  <p className="text-gray-600 pl-20">Maintains original capitalization pattern</p>
                </div>
              </div>
            </div>
          </div>

          {/* Information Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              About Text Reverser
            </h2>

            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">What is Text Reversing?</h3>
                <p>
                  Text reversing is the process of changing the order of characters, words, or lines in a string of text. 
                  This tool offers multiple reversal methods to create different effects for various purposes including 
                  entertainment, puzzles, cryptography practice, and creative text formatting.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Use Cases</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Social Media Posts:</strong> Create attention-grabbing posts with reversed or flipped text</li>
                  <li><strong>Secret Messages:</strong> Send hidden messages that need to be reversed to read</li>
                  <li><strong>Puzzles & Games:</strong> Create word puzzles and text-based challenges</li>
                  <li><strong>Username Generation:</strong> Generate unique usernames by reversing words</li>
                  <li><strong>Palindrome Testing:</strong> Check if text reads the same forwards and backwards</li>
                  <li><strong>Fun Messages:</strong> Send playful messages to friends and family</li>
                  <li><strong>Text Art:</strong> Create interesting visual effects with flipped characters</li>
                  <li><strong>Programming Practice:</strong> Learn string manipulation and algorithms</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Reversal Methods Explained</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">🔄 Reverse Text</h4>
                    <p className="text-sm">
                      Reverses the entire string character by character. "ABC" becomes "CBA". 
                      This is the most common reversal method and affects every character including spaces and punctuation.
                    </p>
                  </div>

                  <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                    <h4 className="font-semibold text-cyan-800 mb-2">🔃 Reverse Words</h4>
                    <p className="text-sm">
                      Changes only the order of words, keeping each word intact. "Hello World" becomes "World Hello". 
                      Useful for creating word puzzles or reordering sentence elements.
                    </p>
                  </div>

                  <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                    <h4 className="font-semibold text-teal-800 mb-2">↕️ Reverse Lines</h4>
                    <p className="text-sm">
                      Reverses the order of lines in multi-line text. The last line becomes first, second-to-last becomes second, etc. 
                      Perfect for reordering lists or paragraphs.
                    </p>
                  </div>

                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <h4 className="font-semibold text-indigo-800 mb-2">🔀 Reverse Each Word</h4>
                    <p className="text-sm">
                      Reverses characters within each word individually while maintaining word positions. 
                      "Hello World" becomes "olleH dlroW". Creates a unique scrambled effect.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-2">↻ Flip Upside Down</h4>
                    <p className="text-sm">
                      Uses special Unicode characters to create an upside-down effect. 
                      Great for social media posts and attention-grabbing messages. Note: Not all characters have flipped equivalents.
                    </p>
                  </div>

                  <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                    <h4 className="font-semibold text-pink-800 mb-2">🔠 Reverse (Keep Case)</h4>
                    <p className="text-sm">
                      Reverses text while preserving the original capitalization pattern. 
                      Uppercase positions stay uppercase, lowercase stay lowercase. Useful for maintaining proper noun formatting.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <h4 className="font-semibold text-yellow-800 mb-2">Pro Tips</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Combine multiple reversals for more complex effects</li>
                  <li>• Use upside-down text sparingly - it can be hard to read</li>
                  <li>• Test palindromes by reversing text and comparing with original</li>
                  <li>• Create simple ciphers by reversing words or characters</li>
                  <li>• Some fonts may not display flipped characters correctly</li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What's the difference between reversing text and reversing words?
                </h3>
                <p className="text-gray-700">
                  Reversing text reverses every character including spaces ("Hello World" → "dlroW olleH"), 
                  while reversing words only changes word order ("Hello World" → "World Hello"). 
                  Words themselves remain readable when you reverse word order.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I use flipped text on all social media platforms?
                </h3>
                <p className="text-gray-700">
                  Flipped text uses Unicode characters which are supported by most platforms (Facebook, Twitter, Instagram, WhatsApp). 
                  However, some older systems or specific apps might not display them correctly. Always test before posting.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Is reversing text the same as encryption?
                </h3>
                <p className="text-gray-700">
                  No, reversing text is not secure encryption. It's trivial to reverse back and provides no real security. 
                  For actual encryption, use proper cryptographic methods like AES or RSA.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Why doesn't "Reverse and Preserve Case" work with all characters?
                </h3>
                <p className="text-gray-700">
                  This feature only works with letters that have distinct upper and lowercase forms. 
                  Numbers, punctuation, and special characters don't have case, so they're reversed normally without case preservation.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I reverse text in languages other than English?
                </h3>
                <p className="text-gray-700">
                  Yes! The reversal functions work with any Unicode text including Arabic, Chinese, Hindi, Russian, etc. 
                  However, flipped characters are primarily available for Latin alphabets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
