import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function FindAndReplace() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [replaceAll, setReplaceAll] = useState(true);
  const [matchCount, setMatchCount] = useState(0);

  const performReplace = () => {
    if (!inputText) {
      alert('Please enter text to search in');
      return;
    }
    if (!findText) {
      alert('Please enter text to find');
      return;
    }

    try {
      let result = inputText;
      let count = 0;

      if (useRegex) {
        // Use regex mode
        const flags = caseSensitive ? 'g' : 'gi';
        const regex = new RegExp(findText, replaceAll ? flags : (caseSensitive ? '' : 'i'));
        
        // Count matches first
        const matches = inputText.match(new RegExp(findText, 'g' + (caseSensitive ? '' : 'i')));
        count = matches ? matches.length : 0;
        
        // Perform replacement
        if (replaceAll) {
          result = inputText.replace(regex, replaceText);
        } else {
          result = inputText.replace(regex, replaceText);
        }
      } else {
        // Use simple string mode
        if (caseSensitive) {
          // Case sensitive
          if (replaceAll) {
            result = inputText.split(findText).join(replaceText);
            count = inputText.split(findText).length - 1;
          } else {
            const index = inputText.indexOf(findText);
            if (index !== -1) {
              result = inputText.substring(0, index) + replaceText + inputText.substring(index + findText.length);
              count = 1;
            } else {
              count = 0;
            }
          }
        } else {
          // Case insensitive
          const regex = new RegExp(escapeRegex(findText), replaceAll ? 'gi' : 'i');
          const matches = inputText.match(new RegExp(escapeRegex(findText), 'gi'));
          count = matches ? matches.length : 0;
          result = inputText.replace(regex, replaceText);
        }
      }

      setOutputText(result);
      setMatchCount(count);
    } catch (error) {
      alert('Invalid regex pattern: ' + error.message);
    }
  };

  const escapeRegex = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const findMatches = () => {
    if (!inputText || !findText) {
      setMatchCount(0);
      return;
    }

    try {
      if (useRegex) {
        const regex = new RegExp(findText, 'g' + (caseSensitive ? '' : 'i'));
        const matches = inputText.match(regex);
        setMatchCount(matches ? matches.length : 0);
      } else {
        if (caseSensitive) {
          const count = inputText.split(findText).length - 1;
          setMatchCount(count);
        } else {
          const regex = new RegExp(escapeRegex(findText), 'gi');
          const matches = inputText.match(regex);
          setMatchCount(matches ? matches.length : 0);
        }
      }
    } catch (error) {
      setMatchCount(0);
    }
  };

  const getStats = (text) => {
    if (!text) return { chars: 0, words: 0, lines: 0 };
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text.split('\n').length;
    return {
      chars: text.length,
      words: words,
      lines: lines
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
    setFindText('');
    setReplaceText('');
    setMatchCount(0);
  };

  const loadExample = () => {
    setInputText(`The quick brown fox jumps over the lazy dog.
The quick brown fox is very quick and agile.
Quick movements are essential for the fox.
The dog is not as quick as the fox.`);
    setFindText('quick');
    setReplaceText('fast');
  };

  return (
    <Layout>
      <Head>
        <title>Find and Replace Text Online - Free Text Search & Replace Tool</title>
        <meta name="description" content="Free online find and replace tool. Search and replace text with support for regex patterns, case-sensitive matching, and batch replacements. Perfect for text editing and data processing." />
        <meta name="keywords" content="find and replace, text search, replace text, regex replace, bulk replace, text editor, search and replace, find replace online" />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/find-and-replace" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find and Replace Text</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Search and replace text instantly with support for simple text matching and powerful regex patterns. 
            Perfect for editing documents, cleaning data, and batch text transformations.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* Find and Replace Controls */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Find Text
              </label>
              <input
                type="text"
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                onKeyUp={findMatches}
                placeholder="Enter text or regex pattern to find..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Replace With
              </label>
              <input
                type="text"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                placeholder="Enter replacement text..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Options */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={caseSensitive}
                onChange={(e) => {
                  setCaseSensitive(e.target.checked);
                  if (findText) findMatches();
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Case Sensitive</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={useRegex}
                onChange={(e) => {
                  setUseRegex(e.target.checked);
                  if (findText) findMatches();
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Use Regular Expression (Regex)</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={replaceAll}
                onChange={(e) => setReplaceAll(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Replace All Occurrences</span>
            </label>
          </div>

          {/* Match Count Display */}
          {findText && (
            <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>{matchCount}</strong> match{matchCount !== 1 ? 'es' : ''} found
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Input Text
                </label>
                <span className="text-xs text-gray-500">
                  Chars: {inputStats.chars} | Words: {inputStats.words} | Lines: {inputStats.lines}
                </span>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  if (findText) findMatches();
                }}
                placeholder="Enter your text here..."
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
                  Chars: {outputStats.chars} | Words: {outputStats.words} | Lines: {outputStats.lines}
                </span>
              </div>
              <textarea
                value={outputText}
                readOnly
                placeholder="Replaced text will appear here..."
                className="w-full h-80 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={performReplace}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150"
            >
              Replace
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Find and Replace Examples</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Simple Text Replacement</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm mb-2"><strong>Input:</strong> "The cat sat on the mat."</p>
                <p className="text-sm mb-2"><strong>Find:</strong> cat</p>
                <p className="text-sm mb-2"><strong>Replace:</strong> dog</p>
                <p className="text-sm"><strong>Output:</strong> "The dog sat on the mat."</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Case Insensitive Replacement</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm mb-2"><strong>Input:</strong> "HTML, html, Html, HtMl"</p>
                <p className="text-sm mb-2"><strong>Find:</strong> html (case insensitive)</p>
                <p className="text-sm mb-2"><strong>Replace:</strong> CSS</p>
                <p className="text-sm"><strong>Output:</strong> "CSS, CSS, CSS, CSS"</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Regex Pattern: Remove Extra Spaces</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm mb-2"><strong>Input:</strong> "Hello    world    test"</p>
                <p className="text-sm mb-2"><strong>Find (Regex):</strong> \s+</p>
                <p className="text-sm mb-2"><strong>Replace:</strong> (single space)</p>
                <p className="text-sm"><strong>Output:</strong> "Hello world test"</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Regex Pattern: Format Phone Numbers</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm mb-2"><strong>Input:</strong> "1234567890"</p>
                <p className="text-sm mb-2"><strong>Find (Regex):</strong> (\d{3})(\d{3})(\d{4})</p>
                <p className="text-sm mb-2"><strong>Replace:</strong> ($1) $2-$3</p>
                <p className="text-sm"><strong>Output:</strong> "(123) 456-7890"</p>
              </div>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About Find and Replace Tool</h2>
          
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              The Find and Replace tool is an essential text editing utility that allows you to search for specific 
              text patterns and replace them with new content. Whether you're editing documents, cleaning data, 
              updating code, or performing bulk text transformations, this tool provides both simple and advanced 
              options to handle any text replacement task efficiently.
            </p>

            <p className="mb-4">
              With support for simple text matching and powerful regular expressions (regex), this tool can handle 
              everything from basic word replacements to complex pattern-based transformations. The real-time match 
              counter helps you see exactly how many instances will be replaced before you commit to the change.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Key Features</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800">1. Simple Text Matching</h4>
                <p>The default mode searches for exact text strings and replaces them with your specified replacement. 
                Perfect for straightforward text substitutions like changing names, updating terminology, or correcting 
                typos throughout a document.</p>
                <div className="bg-blue-50 p-3 rounded mt-2">
                  <p className="text-sm"><strong>Example:</strong> Replace all instances of "color" with "colour" for British English conversion.</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">2. Case Sensitive Matching</h4>
                <p>Control whether the search should distinguish between uppercase and lowercase letters. When disabled, 
                "hello", "Hello", and "HELLO" are treated as the same word. When enabled, each variation is treated 
                separately, giving you precise control over what gets replaced.</p>
                <div className="bg-blue-50 p-3 rounded mt-2">
                  <p className="text-sm"><strong>Use case:</strong> Replace only lowercase "apple" while preserving "Apple" (the company name).</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">3. Regular Expression (Regex) Support</h4>
                <p>Enable powerful pattern-based matching using regular expressions. Regex allows you to search for 
                complex patterns like email addresses, phone numbers, URLs, or any custom pattern you can define. 
                This is essential for advanced text processing and data cleaning tasks.</p>
                <div className="bg-blue-50 p-3 rounded mt-2">
                  <p className="text-sm"><strong>Example:</strong> Find all email addresses using regex pattern for email matching</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">4. Replace All or Replace First</h4>
                <p>Choose whether to replace all occurrences of the search term or just the first match. Replace All 
                is perfect for batch operations, while Replace First is useful when you want to update only the initial 
                occurrence, such as changing the first heading in a document.</p>
                <div className="bg-blue-50 p-3 rounded mt-2">
                  <p className="text-sm"><strong>Use case:</strong> Replace only the first "Introduction" heading with "Overview" while keeping others unchanged.</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">5. Real-time Match Counter</h4>
                <p>As you type your search term, the tool instantly shows you how many matches were found in your text. 
                This preview helps you verify your search pattern is working correctly before performing the replacement, 
                preventing accidental changes.</p>
                <div className="bg-blue-50 p-3 rounded mt-2">
                  <p className="text-sm"><strong>Benefit:</strong> See "25 matches found" before replacing, ensuring you're targeting the right text.</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">6. Statistics Tracking</h4>
                <p>View character, word, and line counts for both input and output text. This helps you understand how 
                your replacements affect the overall text length and structure, which is particularly useful for SEO 
                content or documents with length requirements.</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Common Use Cases</h3>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">📝 Document Editing</h4>
                <ul className="text-sm space-y-1">
                  <li>• Update company names throughout documents</li>
                  <li>• Correct spelling mistakes in bulk</li>
                  <li>• Change terminology consistently</li>
                  <li>• Update dates or version numbers</li>
                  <li>• Replace outdated information</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">💻 Code Refactoring</h4>
                <ul className="text-sm space-y-1">
                  <li>• Rename variables or functions</li>
                  <li>• Update API endpoints</li>
                  <li>• Change class names</li>
                  <li>• Replace deprecated methods</li>
                  <li>• Update import paths</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">📊 Data Cleaning</h4>
                <ul className="text-sm space-y-1">
                  <li>• Remove extra whitespace</li>
                  <li>• Standardize date formats</li>
                  <li>• Clean CSV data</li>
                  <li>• Format phone numbers</li>
                  <li>• Normalize text entries</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">🌐 Web Content</h4>
                <ul className="text-sm space-y-1">
                  <li>• Update URLs in bulk</li>
                  <li>• Change HTML tags</li>
                  <li>• Modify meta descriptions</li>
                  <li>• Replace image paths</li>
                  <li>• Update anchor text</li>
                </ul>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">✉️ Email Management</h4>
                <ul className="text-sm space-y-1">
                  <li>• Update email signatures</li>
                  <li>• Change contact information</li>
                  <li>• Modify template variables</li>
                  <li>• Replace placeholder text</li>
                  <li>• Standardize formatting</li>
                </ul>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">📄 Content Migration</h4>
                <ul className="text-sm space-y-1">
                  <li>• Update old URLs to new ones</li>
                  <li>• Change image CDN paths</li>
                  <li>• Replace shortcodes</li>
                  <li>• Update internal links</li>
                  <li>• Modify markdown syntax</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Useful Regex Patterns</h3>
            
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm"><strong>Email addresses:</strong> Standard email pattern matching</p>
                <p className="text-xs text-gray-600 mt-1">Matches standard email format like name@domain.com</p>
              </div>

              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm"><strong>Phone numbers:</strong> Pattern for various phone formats</p>
                <p className="text-xs text-gray-600 mt-1">Matches formats like (123) 456-7890 or 123-456-7890</p>
              </div>

              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm"><strong>URLs:</strong> Match http and https URLs</p>
                <p className="text-xs text-gray-600 mt-1">Matches http:// or https:// URLs</p>
              </div>

              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm"><strong>Multiple spaces:</strong> Match consecutive whitespace</p>
                <p className="text-xs text-gray-600 mt-1">Matches two or more consecutive whitespace characters</p>
              </div>

              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm"><strong>Numbers only:</strong> Match digit sequences</p>
                <p className="text-xs text-gray-600 mt-1">Matches one or more consecutive digits</p>
              </div>

              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm"><strong>Word boundaries:</strong> Match complete words</p>
                <p className="text-xs text-gray-600 mt-1">Matches complete words, not as part of another word</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Best Practices</h3>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">✅ Before Replacing</h4>
              <ul className="space-y-2">
                <li>• <strong>Test your pattern:</strong> Check the match count to ensure you're targeting the right text</li>
                <li>• <strong>Use Replace First for testing:</strong> Try replacing just the first occurrence to verify results</li>
                <li>• <strong>Enable case sensitivity carefully:</strong> Consider whether "Hello" and "hello" should be treated differently</li>
                <li>• <strong>Validate regex patterns:</strong> Test complex regex patterns on sample text first</li>
                <li>• <strong>Keep a backup:</strong> Copy your original text before performing large replacements</li>
              </ul>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">✅ After Replacing</h4>
              <ul className="space-y-2">
                <li>• <strong>Review the output:</strong> Scan through results to ensure replacements are correct</li>
                <li>• <strong>Check edge cases:</strong> Look for unintended replacements at the beginning or end of lines</li>
                <li>• <strong>Verify count matches:</strong> Compare the number of replacements with your expectations</li>
                <li>• <strong>Test with variations:</strong> Try different search terms if the first attempt doesn't work</li>
                <li>• <strong>Save immediately:</strong> Copy your results right away to avoid losing work</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Pro Tips</h3>
            
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>💡 Tip 1:</strong> Use word boundaries (\b) in regex to avoid partial matches. For example, \bcat\b matches "cat" but not "category".</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>💡 Tip 2:</strong> When replacing with nothing (empty string), you can effectively delete text. Useful for removing unwanted characters or patterns.</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>💡 Tip 3:</strong> Use capturing groups in regex with $1, $2, etc. in replacement to reorder or reformat matched text.</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>💡 Tip 4:</strong> For multiline replacements, test with a small sample first, then apply to the full text.</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>💡 Tip 5:</strong> Disable "Replace All" when making sensitive changes - review each occurrence manually.</p>
              </div>

              <div className="bg-gray-50 p-3 rounded">
                <p><strong>💡 Tip 6:</strong> Chain multiple find-and-replace operations by copying output back to input for sequential transformations.</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Understanding Regex Basics</h3>
            
            <p className="mb-4">
              Regular expressions (regex) are powerful patterns for matching text. Here are essential regex concepts:
            </p>

            <ul className="list-disc ml-6 space-y-2 mb-4">
              <li><strong>. (dot):</strong> Matches any single character except newline</li>
              <li><strong>* (asterisk):</strong> Matches 0 or more of the preceding character</li>
              <li><strong>+ (plus):</strong> Matches 1 or more of the preceding character</li>
              <li><strong>? (question mark):</strong> Matches 0 or 1 of the preceding character</li>
              <li><strong>\d:</strong> Matches any digit (0-9)</li>
              <li><strong>\w:</strong> Matches any word character (letters, digits, underscore)</li>
              <li><strong>\s:</strong> Matches any whitespace character (space, tab, newline)</li>
              <li><strong>[]:</strong> Character class - matches any character inside brackets</li>
              <li><strong>^:</strong> Matches the start of a line</li>
              <li><strong>$:</strong> Matches the end of a line</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Privacy and Security</h3>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
              <p className="mb-2">
                <strong>🔒 Your data stays private:</strong> All find and replace operations happen entirely in your 
                browser using JavaScript. No text is ever sent to any server or stored anywhere. This ensures complete 
                privacy for sensitive documents, personal information, or confidential data.
              </p>
              <p>
                The tool works offline once loaded, making it safe for processing classified or sensitive content 
                without any security concerns.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Frequently Asked Questions</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Q: What's the difference between simple mode and regex mode?</h4>
                <p>Simple mode searches for exact text strings - what you type is what it looks for. Regex mode interprets your search as a pattern with special characters like \d for digits or .* for any characters. Use simple mode for straightforward replacements and regex mode for pattern-based matching.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Q: How do I replace text with nothing to delete it?</h4>
                <p>Leave the "Replace With" field empty. When you perform the replacement, all matches will be deleted from the text. This is useful for removing unwanted characters, cleaning up formatting, or deleting specific patterns.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Q: Why does my regex pattern show an error?</h4>
                <p>Regex syntax errors occur when the pattern is invalid. Common mistakes include unmatched parentheses, invalid escape sequences, or incorrect quantifiers. Try simplifying your pattern or testing it piece by piece. The tool will display specific error messages to help you identify the issue.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Q: Can I undo a replacement if I make a mistake?</h4>
                <p>The tool doesn't have a built-in undo feature, but your original text remains in the input field. You can always refer back to it or copy it again. For safety, consider copying your original text to a separate location before performing major replacements.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Q: How do I replace only whole words, not partial matches?</h4>
                <p>Enable regex mode and use word boundaries \b around your search term. For example, \bcat\b will match "cat" as a complete word but won't match the "cat" in "category". This ensures precise replacements without affecting similar words.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Q: Can I perform multiple different replacements at once?</h4>
                <p>Not in a single operation, but you can chain replacements. After your first replacement, copy the output back to the input field, change your find/replace terms, and run it again. Repeat this process for each replacement you need to make.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
