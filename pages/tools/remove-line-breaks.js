import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function RemoveLineBreaks() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [removeMode, setRemoveMode] = useState('all');
  const [separator, setSeparator] = useState(' ');
  const [customSeparator, setCustomSeparator] = useState('');

  const processText = () => {
    if (!inputText.trim()) {
      alert('Please enter text to process');
      return;
    }

    let result = inputText;

    if (removeMode === 'all') {
      // Remove all line breaks and join with separator
      const sep = separator === 'custom' ? customSeparator : separator;
      const lines = result.split('\n');
      result = lines.join(sep);
    } else if (removeMode === 'empty') {
      // Remove only empty lines
      const lines = result.split('\n');
      const nonEmptyLines = lines.filter(line => line.trim() !== '');
      result = nonEmptyLines.join('\n');
    } else if (removeMode === 'extra') {
      // Remove extra line breaks (multiple consecutive line breaks)
      result = result.replace(/\n{2,}/g, '\n');
    } else if (removeMode === 'trailing') {
      // Remove trailing line breaks from each line
      const lines = result.split('\n');
      result = lines.map(line => line.trimEnd()).join('\n');
    } else if (removeMode === 'leading') {
      // Remove leading line breaks from each line
      const lines = result.split('\n');
      result = lines.map(line => line.trimStart()).join('\n');
    }

    setOutputText(result);
  };

  const getStats = (text) => {
    if (!text) return { chars: 0, lines: 0, words: 0, lineBreaks: 0 };
    const lines = text.split('\n');
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lineBreaks = (text.match(/\n/g) || []).length;
    return {
      chars: text.length,
      lines: lines.length,
      words: words,
      lineBreaks: lineBreaks
    };
  };

  const inputStats = getStats(inputText);
  const outputStats = getStats(outputText);

  const copyToClipboard = () => {
    if (!outputText) {
      alert('No output to copy');
      return;
    }
    navigator.clipboard.writeText(outputText);
    alert('Output copied to clipboard!');
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
  };

  const loadExample = () => {
    setInputText(`This is line one.
This is line two.

This is line three after an empty line.
This is line four.


This is line five after multiple empty lines.`);
  };

  return (
    <Layout>
      <Head>
        <title>Remove Line Breaks Online - Join Text Lines & Remove Extra Spaces</title>
        <meta name="description" content="Free online tool to remove line breaks from text. Join multiple lines into one, remove empty lines, clean up formatting, and replace line breaks with custom separators. Perfect for text cleanup and formatting." />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/remove-line-breaks" />
        <meta name="keywords" content="remove line breaks, join lines, remove empty lines, text formatting, line break remover, clean text, join text, remove newlines" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Remove Line Breaks</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Remove line breaks from text and join lines together. Perfect for cleaning up copied text, 
            formatting content, removing empty lines, and preparing text for different uses.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* Mode Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remove Mode
            </label>
            <select
              value={removeMode}
              onChange={(e) => setRemoveMode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            >
              <option value="all">Remove All Line Breaks (Join into One Line)</option>
              <option value="empty">Remove Empty Lines Only</option>
              <option value="extra">Remove Extra Line Breaks (Keep Single)</option>
              <option value="trailing">Remove Trailing Spaces from Lines</option>
              <option value="leading">Remove Leading Spaces from Lines</option>
            </select>

            {/* Separator Options (only for "all" mode) */}
            {removeMode === 'all' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Line Separator (What to Join Lines With)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value=" "
                      checked={separator === ' '}
                      onChange={(e) => setSeparator(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Space</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value=""
                      checked={separator === ''}
                      onChange={(e) => setSeparator(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Nothing (No Space)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value=", "
                      checked={separator === ', '}
                      onChange={(e) => setSeparator(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Comma + Space</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value=" | "
                      checked={separator === ' | '}
                      onChange={(e) => setSeparator(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Pipe (|)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value=" / "
                      checked={separator === ' / '}
                      onChange={(e) => setSeparator(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Slash (/)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="custom"
                      checked={separator === 'custom'}
                      onChange={(e) => setSeparator(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Custom</span>
                  </label>
                </div>

                {separator === 'custom' && (
                  <input
                    type="text"
                    value={customSeparator}
                    onChange={(e) => setCustomSeparator(e.target.value)}
                    placeholder="Enter custom separator..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Input Text
                </label>
                <span className="text-xs text-gray-500">
                  Lines: {inputStats.lines} | Breaks: {inputStats.lineBreaks} | Chars: {inputStats.chars}
                </span>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter your text with line breaks..."
                className="w-full h-80 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
            </div>

            {/* Output Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Output Text
                </label>
                <span className="text-xs text-gray-500">
                  Lines: {outputStats.lines} | Breaks: {outputStats.lineBreaks} | Chars: {outputStats.chars}
                </span>
              </div>
              <textarea
                value={outputText}
                readOnly
                placeholder="Processed text will appear here..."
                className="w-full h-80 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={processText}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150"
            >
              Process Text
            </button>
            <button
              onClick={copyToClipboard}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-150"
            >
              Copy Output
            </button>
            <button
              onClick={loadExample}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition duration-150"
            >
              Load Example
            </button>
            <button
              onClick={clearAll}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition duration-150"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Examples Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Examples</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Remove All Line Breaks (Join with Space)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Input:</p>
                  <pre className="bg-gray-50 p-3 rounded border text-sm">Hello{'\n'}World{'\n'}Test</pre>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Output:</p>
                  <pre className="bg-gray-50 p-3 rounded border text-sm">Hello World Test</pre>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Remove Empty Lines Only</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Input:</p>
                  <pre className="bg-gray-50 p-3 rounded border text-sm">Line 1{'\n\n'}Line 2{'\n\n\n'}Line 3</pre>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Output:</p>
                  <pre className="bg-gray-50 p-3 rounded border text-sm">Line 1{'\n'}Line 2{'\n'}Line 3</pre>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Join with Comma</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Input:</p>
                  <pre className="bg-gray-50 p-3 rounded border text-sm">Apple{'\n'}Banana{'\n'}Cherry</pre>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Output:</p>
                  <pre className="bg-gray-50 p-3 rounded border text-sm">Apple, Banana, Cherry</pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About Remove Line Breaks Tool</h2>
          
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              The Remove Line Breaks tool is a versatile text formatting utility that helps you clean up text by 
              removing unwanted line breaks, joining lines together, and reformatting content for different purposes. 
              Whether you're preparing text for a single-line input field, cleaning up copied content, or reformatting 
              documents, this tool offers multiple modes to handle various line break scenarios.
            </p>

            <p className="mb-4">
              Line breaks are essential for readability in documents, but they can cause issues when text needs to be 
              used in certain contexts. This tool gives you complete control over how line breaks are handled, from 
              removing them entirely to selectively cleaning up empty or extra lines.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Processing Modes</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800">1. Remove All Line Breaks (Join into One Line)</h4>
                <p>Removes every line break from your text and joins all lines into a single continuous line. You can 
                choose what to insert between the joined lines - space, comma, or any custom separator. This is the 
                most common use case when you need single-line text.</p>
                <div className="bg-blue-50 p-3 rounded mt-2">
                  <p className="text-sm"><strong>Use case:</strong> Converting multi-line addresses into single-line format, preparing text for single-line input fields, creating comma-separated lists from line-separated data.</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">2. Remove Empty Lines Only</h4>
                <p>Keeps all your content intact but removes only the blank/empty lines. This cleans up your text by 
                eliminating unnecessary spacing while preserving the line structure of your actual content. Perfect 
                for documents with excessive blank lines.</p>
                <div className="bg-blue-50 p-3 rounded mt-2">
                  <p className="text-sm"><strong>Use case:</strong> Cleaning up copied text from PDFs, removing spacing from formatted documents, compacting text while keeping structure.</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">3. Remove Extra Line Breaks (Keep Single)</h4>
                <p>Reduces multiple consecutive line breaks down to single line breaks. If you have 2, 3, or more 
                empty lines in a row, this mode will replace them all with just one line break. Great for standardizing 
                spacing in documents.</p>
                <div className="bg-blue-50 p-3 rounded mt-2">
                  <p className="text-sm"><strong>Use case:</strong> Standardizing document formatting, cleaning up inconsistent spacing, preparing text for publishing.</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">4. Remove Trailing Spaces from Lines</h4>
                <p>Removes spaces at the end of each line while keeping the lines separate. This cleans up invisible 
                whitespace that can cause issues in code, data files, or when text is processed by other systems.</p>
                <div className="bg-blue-50 p-3 rounded mt-2">
                  <p className="text-sm"><strong>Use case:</strong> Cleaning up code files, preparing CSV data, removing invisible formatting characters.</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">5. Remove Leading Spaces from Lines</h4>
                <p>Removes spaces at the beginning of each line, effectively removing indentation. Useful when you 
                want to left-align all text or remove formatting that includes indentation.</p>
                <div className="bg-blue-50 p-3 rounded mt-2">
                  <p className="text-sm"><strong>Use case:</strong> Removing indentation from code, left-aligning quoted text, cleaning up copied content.</p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Separator Options</h3>
            
            <p className="mb-4">
              When using "Remove All Line Breaks" mode, you can choose what to insert between joined lines:
            </p>

            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm"><strong>Space:</strong> The default and most common choice. Joins lines with a single space between them, creating natural-reading text.</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm"><strong>Nothing (No Space):</strong> Joins lines directly with no separator. Use this when lines should connect without any spacing, like combining code or joining path segments.</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm"><strong>Comma + Space:</strong> Creates a comma-separated list. Perfect for converting line-separated items into CSV format or creating lists.</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm"><strong>Pipe (|):</strong> Joins with vertical bar separator, commonly used in table data or as an alternative delimiter.</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm"><strong>Slash (/):</strong> Joins with forward slash, useful for paths or alternative separation styles.</p>
              </div>

              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm"><strong>Custom:</strong> Enter any text as separator - could be semicolon, tab, dash, or any custom string you need.</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Common Use Cases</h3>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">📝 Form Fields</h4>
                <ul className="text-sm space-y-1">
                  <li>• Convert addresses to single line</li>
                  <li>• Prepare text for input fields</li>
                  <li>• Format data for submission</li>
                  <li>• Clean up copied content</li>
                  <li>• Remove formatting from forms</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">📊 Data Processing</h4>
                <ul className="text-sm space-y-1">
                  <li>• Create CSV from line data</li>
                  <li>• Convert lists to comma-separated</li>
                  <li>• Clean up exported data</li>
                  <li>• Format data for import</li>
                  <li>• Prepare batch processing input</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">💻 Code Cleanup</h4>
                <ul className="text-sm space-y-1">
                  <li>• Remove trailing whitespace</li>
                  <li>• Clean up code formatting</li>
                  <li>• Join multi-line strings</li>
                  <li>• Remove extra blank lines</li>
                  <li>• Standardize line endings</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">📄 Document Formatting</h4>
                <ul className="text-sm space-y-1">
                  <li>• Clean up PDF text</li>
                  <li>• Remove extra spacing</li>
                  <li>• Reformat paragraphs</li>
                  <li>• Standardize documents</li>
                  <li>• Prepare text for publishing</li>
                </ul>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">✉️ Email & Messaging</h4>
                <ul className="text-sm space-y-1">
                  <li>• Format text for chat messages</li>
                  <li>• Clean up email signatures</li>
                  <li>• Remove formatting from quotes</li>
                  <li>• Prepare SMS text content</li>
                  <li>• Join message lines</li>
                </ul>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">🌐 Web Content</h4>
                <ul className="text-sm space-y-1">
                  <li>• Format meta descriptions</li>
                  <li>• Clean up HTML content</li>
                  <li>• Prepare alt text</li>
                  <li>• Create single-line titles</li>
                  <li>• Format URL parameters</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Best Practices</h3>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">✅ Before Processing</h4>
              <ul className="space-y-2">
                <li>• <strong>Choose the right mode:</strong> Consider whether you need all breaks removed or just cleanup</li>
                <li>• <strong>Preview your text:</strong> Check the input statistics to understand current formatting</li>
                <li>• <strong>Select separator carefully:</strong> Think about how the joined text will be used</li>
                <li>• <strong>Keep a backup:</strong> Copy original text if you might need it later</li>
                <li>• <strong>Consider the context:</strong> Where will the processed text be used?</li>
              </ul>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">✅ After Processing</h4>
              <ul className="space-y-2">
                <li>• <strong>Review the output:</strong> Check that the result looks as expected</li>
                <li>• <strong>Check line count:</strong> Compare input and output statistics</li>
                <li>• <strong>Verify separators:</strong> If using custom separators, ensure they appeared correctly</li>
                <li>• <strong>Test in target system:</strong> Paste result where it will be used to confirm it works</li>
                <li>• <strong>Adjust if needed:</strong> Try different modes or separators if result isn't perfect</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Pro Tips</h3>
            
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>💡 Tip 1:</strong> For addresses, use "Remove All Line Breaks" with comma separator to convert from multi-line to single-line format suitable for form fields.</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>💡 Tip 2:</strong> When cleaning up PDF text, use "Remove Empty Lines" first, then if needed, "Remove Extra Line Breaks" to standardize spacing.</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>💡 Tip 3:</strong> For code cleanup, use "Remove Trailing Spaces" to eliminate invisible whitespace that can cause issues with version control.</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>💡 Tip 4:</strong> Create custom separators like " - " or " :: " for unique formatting needs when joining lines.</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>💡 Tip 5:</strong> Use "Nothing" separator to join lines of code or paths where no space should exist between joined parts.</p>
              </div>

              <div className="bg-gray-50 p-3 rounded">
                <p><strong>💡 Tip 6:</strong> The statistics show line breaks count - use this to verify how many breaks were removed.</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Understanding Line Breaks</h3>
            
            <p className="mb-4">
              Line breaks are special characters that tell computers and text editors to start a new line. 
              Different systems use different line break characters:
            </p>

            <ul className="list-disc ml-6 space-y-2 mb-4">
              <li><strong>Windows:</strong> Uses CRLF (Carriage Return + Line Feed, or \r\n)</li>
              <li><strong>Unix/Linux/Mac:</strong> Uses LF (Line Feed, or \n)</li>
              <li><strong>Old Mac:</strong> Used CR (Carriage Return, or \r)</li>
            </ul>

            <p className="mb-4">
              This tool handles all these line break types automatically, so you don't need to worry about 
              which system your text came from.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Privacy and Security</h3>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
              <p className="mb-2">
                <strong>🔒 Your text stays private:</strong> All processing happens entirely in your browser using 
                JavaScript. Your text is never sent to any server or stored anywhere. This ensures complete privacy 
                for sensitive documents, personal information, or confidential content.
              </p>
              <p>
                You can safely process addresses, personal data, code, or any sensitive text without security concerns. 
                The tool works offline once the page loads.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Frequently Asked Questions</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Q: What's the difference between removing all breaks and removing empty lines?</h4>
                <p>"Remove All Line Breaks" joins everything into one or more lines with your chosen separator, completely restructuring the text. "Remove Empty Lines Only" keeps all your content on separate lines but removes the blank lines between them, maintaining the original line structure for non-empty content.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Q: Can I convert a multi-line address to single line?</h4>
                <p>Yes! Use "Remove All Line Breaks" mode with comma separator. For example, "123 Main St\nApt 4\nNew York, NY 10001" becomes "123 Main St, Apt 4, New York, NY 10001". This is perfect for form fields that only accept single-line addresses.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Q: What separator should I use for creating lists?</h4>
                <p>For comma-separated lists (like CSV), use "Comma + Space". For pipe-delimited data, use "Pipe". For space-separated tags or keywords, use "Space". For custom needs like semicolon-separated lists, use the Custom option and enter "; " as your separator.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Q: Will this tool remove tabs and spaces too?</h4>
                <p>The basic modes preserve tabs and spaces within lines - they only affect line breaks. However, "Remove Trailing Spaces" removes spaces at line ends, and "Remove Leading Spaces" removes spaces at line starts. Regular spaces within text are always preserved.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Q: How do I clean up text copied from a PDF?</h4>
                <p>PDF text often has unwanted line breaks and spacing. Start with "Remove Empty Lines" to clear out blank lines, then check if you need "Remove Extra Line Breaks" to standardize spacing. If the text should be continuous, use "Remove All Line Breaks" with space separator.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Q: Can I undo the processing if I make a mistake?</h4>
                <p>The tool doesn't have built-in undo, but your original text stays in the input field. You can always refer back to it or copy it again. For safety with important text, copy your original to a separate location before processing.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
