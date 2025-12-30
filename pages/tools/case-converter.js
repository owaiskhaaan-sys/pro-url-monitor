import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function CaseConverter() {
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');

  const convertToSentenceCase = () => {
    const converted = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    setOutput(converted);
  };

  const convertToLowerCase = () => {
    setOutput(text.toLowerCase());
  };

  const convertToUpperCase = () => {
    setOutput(text.toUpperCase());
  };

  const convertToTitleCase = () => {
    const smallWords = /^(a|an|and|as|at|but|by|for|if|in|nor|of|on|or|so|the|to|up|yet)$/i;
    const converted = text.toLowerCase().replace(/\w\S*/g, (word, index) => {
      if (index !== 0 && smallWords.test(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.substr(1);
    });
    setOutput(converted);
  };

  const convertToCapitalizedCase = () => {
    const converted = text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    setOutput(converted);
  };

  const convertToAlternatingCase = () => {
    let converted = '';
    for (let i = 0; i < text.length; i++) {
      converted += i % 2 === 0 ? text[i].toLowerCase() : text[i].toUpperCase();
    }
    setOutput(converted);
  };

  const convertToInverseCase = () => {
    let converted = '';
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      converted += char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase();
    }
    setOutput(converted);
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
    setText('the quick brown fox jumps over the lazy dog. this is an example of case conversion!');
  };

  const getStats = (str) => {
    const chars = str.length;
    const charsNoSpaces = str.replace(/\s/g, '').length;
    const words = str.trim() ? str.trim().split(/\s+/).length : 0;
    const lines = str.split('\n').length;
    const sentences = str.split(/[.!?]+/).filter(s => s.trim()).length;
    return { chars, charsNoSpaces, words, lines, sentences };
  };

  const inputStats = getStats(text);
  const outputStats = getStats(output);

  return (
    <Layout>
      <Head>
        <title>Case Converter - Change Text Case Online Free</title>
        <meta name="description" content="Convert text to uppercase, lowercase, title case, sentence case, and more. Free online case converter tool for text formatting instantly." />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/case-converter" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Case Converter
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Convert text between different letter cases instantly. Transform uppercase, lowercase, title case, sentence case, and more.
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
                className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                <span>Characters: {inputStats.chars}</span>
                <span>Words: {inputStats.words}</span>
                <span>Lines: {inputStats.lines}</span>
                <span>Sentences: {inputStats.sentences}</span>
              </div>
            </div>

            {/* Conversion Buttons */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Convert To
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={convertToSentenceCase}
                  className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium text-sm"
                >
                  Sentence case
                </button>
                <button
                  onClick={convertToLowerCase}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                >
                  lowercase
                </button>
                <button
                  onClick={convertToUpperCase}
                  className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm"
                >
                  UPPERCASE
                </button>
                <button
                  onClick={convertToTitleCase}
                  className="px-4 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-medium text-sm"
                >
                  Title Case
                </button>
                <button
                  onClick={convertToCapitalizedCase}
                  className="px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium text-sm"
                >
                  Capitalized Case
                </button>
                <button
                  onClick={convertToAlternatingCase}
                  className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium text-sm"
                >
                  aLtErNaTiNg cAsE
                </button>
                <button
                  onClick={convertToInverseCase}
                  className="px-4 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition font-medium text-sm"
                >
                  InVeRsE CaSe
                </button>
                <button
                  onClick={loadExample}
                  className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium text-sm"
                >
                  Load Example
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
                  <span>Sentences: {outputStats.sentences}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
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
                  <h4 className="font-semibold text-blue-800 mb-1">Quick Tip</h4>
                  <p className="text-sm text-blue-700">
                    All conversions happen instantly in your browser. No data is sent to any server, ensuring complete privacy.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Information Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              About Case Converter
            </h2>

            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">What is Case Conversion?</h3>
                <p>
                  Case conversion is the process of transforming text between different capitalization styles. 
                  This tool provides seven different case conversion options to format your text exactly how you need it 
                  for content creation, programming, or document formatting.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Available Case Styles</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-1">Sentence case</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Capitalizes the first letter of each sentence. Rest of the text is lowercase.
                    </p>
                    <p className="text-sm font-mono bg-gray-50 p-2 rounded">
                      Example: "This is a sentence. This is another sentence."
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-1">lowercase</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Converts all letters to lowercase. Useful for URLs, email addresses, and usernames.
                    </p>
                    <p className="text-sm font-mono bg-gray-50 p-2 rounded">
                      Example: "the quick brown fox jumps over the lazy dog"
                    </p>
                  </div>

                  <div className="border-l-4 border-indigo-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-1">UPPERCASE</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Converts all letters to uppercase. Perfect for headers, acronyms, and emphasis.
                    </p>
                    <p className="text-sm font-mono bg-gray-50 p-2 rounded">
                      Example: "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG"
                    </p>
                  </div>

                  <div className="border-l-4 border-pink-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-1">Title Case</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Capitalizes the first letter of major words. Small words (a, an, the, etc.) remain lowercase.
                    </p>
                    <p className="text-sm font-mono bg-gray-50 p-2 rounded">
                      Example: "The Quick Brown Fox Jumps over the Lazy Dog"
                    </p>
                  </div>

                  <div className="border-l-4 border-teal-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-1">Capitalized Case</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Capitalizes the first letter of every word. All other letters are lowercase.
                    </p>
                    <p className="text-sm font-mono bg-gray-50 p-2 rounded">
                      Example: "The Quick Brown Fox Jumps Over The Lazy Dog"
                    </p>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-1">aLtErNaTiNg cAsE</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Alternates between lowercase and uppercase for each character. Used for stylistic effect.
                    </p>
                    <p className="text-sm font-mono bg-gray-50 p-2 rounded">
                      Example: "tHe qUiCk bRoWn fOx jUmPs oVeR ThE LaZy dOg"
                    </p>
                  </div>

                  <div className="border-l-4 border-rose-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-1">InVeRsE CaSe</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Inverts the case of each letter. Uppercase becomes lowercase and vice versa.
                    </p>
                    <p className="text-sm font-mono bg-gray-50 p-2 rounded">
                      Example: "tHE QUICK BROWN FOX JUMPS OVER THE LAZY DOG"
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Common Use Cases</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Content Writing:</strong> Format article titles, headings, and body text properly</li>
                  <li><strong>Email Composition:</strong> Fix accidentally typed text in wrong case</li>
                  <li><strong>Programming:</strong> Convert variable names and function names to proper conventions</li>
                  <li><strong>Social Media:</strong> Create attention-grabbing posts with various case styles</li>
                  <li><strong>Document Formatting:</strong> Standardize text formatting across documents</li>
                  <li><strong>SEO Optimization:</strong> Create properly formatted meta titles and descriptions</li>
                  <li><strong>Data Processing:</strong> Normalize text data for databases and spreadsheets</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Benefits of Using Case Converter</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-2">⚡ Instant Results</h4>
                    <p className="text-sm text-gray-700">
                      Convert text in milliseconds with one click. No waiting, no page reloads.
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">🔒 Private & Secure</h4>
                    <p className="text-sm text-gray-700">
                      All processing happens locally in your browser. Your text never leaves your device.
                    </p>
                  </div>
                  <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                    <h4 className="font-semibold text-pink-800 mb-2">📊 Text Statistics</h4>
                    <p className="text-sm text-gray-700">
                      View character count, word count, line count, and sentence count automatically.
                    </p>
                  </div>
                  <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                    <h4 className="font-semibold text-teal-800 mb-2">💾 Easy Export</h4>
                    <p className="text-sm text-gray-700">
                      Copy converted text to clipboard with one click for immediate use.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <h4 className="font-semibold text-yellow-800 mb-2">Pro Tips</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Use Title Case for article headlines and blog post titles</li>
                  <li>• Use Sentence case for natural, readable content</li>
                  <li>• Use lowercase for URLs, email addresses, and usernames</li>
                  <li>• Use UPPERCASE sparingly for emphasis or important notices</li>
                  <li>• Capitalized Case works well for names and proper nouns</li>
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
                  What's the difference between Title Case and Capitalized Case?
                </h3>
                <p className="text-gray-700">
                  Title Case follows proper English grammar rules by keeping small words (a, an, the, of, in) lowercase 
                  unless they're the first word. Capitalized Case simply capitalizes every word regardless of grammar rules.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I convert text in languages other than English?
                </h3>
                <p className="text-gray-700">
                  Yes! This tool works with Unicode characters and supports most languages including Spanish, French, 
                  German, and other Latin-based alphabets. Character-based languages may have limited support.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Is there a limit to how much text I can convert?
                </h3>
                <p className="text-gray-700">
                  No hard limit! You can convert large amounts of text. However, extremely large texts (100,000+ characters) 
                  may take a moment to process depending on your device's performance.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Does case conversion affect numbers and punctuation?
                </h3>
                <p className="text-gray-700">
                  No, case conversion only affects alphabetic characters (A-Z, a-z). Numbers (0-9), punctuation marks, 
                  and special characters remain unchanged during conversion.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Why should I use Sentence case instead of Title Case?
                </h3>
                <p className="text-gray-700">
                  Use Sentence case for natural, paragraph-style content and body text. Use Title Case for headlines, 
                  article titles, and headings where every major word should be emphasized.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
