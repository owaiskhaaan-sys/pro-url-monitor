import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function SortTextLines() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sortType, setSortType] = useState('alphabetical-asc');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [removeDuplicates, setRemoveDuplicates] = useState(false);
  const [removeEmpty, setRemoveEmpty] = useState(false);

  const sortLines = () => {
    if (!inputText.trim()) {
      alert('Please enter text to sort');
      return;
    }

    let lines = inputText.split('\n');

    // Remove empty lines if option is checked
    if (removeEmpty) {
      lines = lines.filter(line => line.trim() !== '');
    }

    // Remove duplicates if option is checked
    if (removeDuplicates) {
      if (caseSensitive) {
        lines = [...new Set(lines)];
      } else {
        const seen = new Map();
        lines = lines.filter(line => {
          const key = line.toLowerCase();
          if (seen.has(key)) {
            return false;
          }
          seen.set(key, true);
          return true;
        });
      }
    }

    // Sort based on selected type
    switch (sortType) {
      case 'alphabetical-asc':
        lines.sort((a, b) => {
          const aLine = caseSensitive ? a : a.toLowerCase();
          const bLine = caseSensitive ? b : b.toLowerCase();
          return aLine.localeCompare(bLine);
        });
        break;

      case 'alphabetical-desc':
        lines.sort((a, b) => {
          const aLine = caseSensitive ? a : a.toLowerCase();
          const bLine = caseSensitive ? b : b.toLowerCase();
          return bLine.localeCompare(aLine);
        });
        break;

      case 'length-asc':
        lines.sort((a, b) => a.length - b.length);
        break;

      case 'length-desc':
        lines.sort((a, b) => b.length - a.length);
        break;

      case 'numerical-asc':
        lines.sort((a, b) => {
          const numA = parseFloat(a.match(/-?\d+\.?\d*/)?.[0] || Infinity);
          const numB = parseFloat(b.match(/-?\d+\.?\d*/)?.[0] || Infinity);
          return numA - numB;
        });
        break;

      case 'numerical-desc':
        lines.sort((a, b) => {
          const numA = parseFloat(a.match(/-?\d+\.?\d*/)?.[0] || Infinity);
          const numB = parseFloat(b.match(/-?\d+\.?\d*/)?.[0] || Infinity);
          return numB - numA;
        });
        break;

      case 'random':
        // Fisher-Yates shuffle algorithm
        for (let i = lines.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [lines[i], lines[j]] = [lines[j], lines[i]];
        }
        break;

      case 'reverse':
        lines.reverse();
        break;

      default:
        break;
    }

    setOutputText(lines.join('\n'));
  };

  const getStats = (text) => {
    if (!text) return { lines: 0, nonEmpty: 0, chars: 0 };
    const lines = text.split('\n');
    const nonEmpty = lines.filter(line => line.trim() !== '').length;
    return {
      lines: lines.length,
      nonEmpty: nonEmpty,
      chars: text.length
    };
  };

  const inputStats = getStats(inputText);
  const outputStats = getStats(outputText);

  const copyToClipboard = () => {
    if (!outputText) {
      alert('No sorted text to copy');
      return;
    }
    navigator.clipboard.writeText(outputText);
    alert('Sorted text copied to clipboard!');
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
  };

  const loadExample = () => {
    setInputText(`Banana
apple
Cherry
date
Elderberry
fig
Grape
honeydew
kiwi
Lemon`);
  };

  return (
    <Layout>
      <Head>
        <title>Sort Text Lines Online - Alphabetical, Numerical & Custom Sorting Tool</title>
        <meta name="description" content="Free online tool to sort text lines alphabetically, numerically, by length, or randomly. Sort A-Z, Z-A, shuffle lines, and remove duplicates with advanced sorting options." />
        <meta name="keywords" content="sort text lines, alphabetical sort, line sorter, text organizer, sort alphabetically, numerical sort, random shuffle, sort by length" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sort Text Lines</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Sort lines of text alphabetically, numerically, by length, or randomly. Perfect for organizing lists, 
            sorting data, and managing text content efficiently.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Input Text
                </label>
                <span className="text-xs text-gray-500">
                  Lines: {inputStats.lines} | Non-empty: {inputStats.nonEmpty} | Chars: {inputStats.chars}
                </span>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text lines to sort (one per line)..."
                className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
            </div>

            {/* Output Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Sorted Output
                </label>
                <span className="text-xs text-gray-500">
                  Lines: {outputStats.lines} | Non-empty: {outputStats.nonEmpty} | Chars: {outputStats.chars}
                </span>
              </div>
              <textarea
                value={outputText}
                readOnly
                placeholder="Sorted text will appear here..."
                className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm"
              />
            </div>
          </div>

          {/* Sort Type Selection */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort Type
            </label>
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="alphabetical-asc">Alphabetical (A → Z)</option>
              <option value="alphabetical-desc">Alphabetical (Z → A)</option>
              <option value="length-asc">By Length (Shortest → Longest)</option>
              <option value="length-desc">By Length (Longest → Shortest)</option>
              <option value="numerical-asc">Numerical (Ascending)</option>
              <option value="numerical-desc">Numerical (Descending)</option>
              <option value="random">Random Shuffle</option>
              <option value="reverse">Reverse Order</option>
            </select>
          </div>

          {/* Options */}
          <div className="mt-4 space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={caseSensitive}
                onChange={(e) => setCaseSensitive(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Case Sensitive (affects alphabetical sorting)</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={removeDuplicates}
                onChange={(e) => setRemoveDuplicates(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Remove Duplicate Lines</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={removeEmpty}
                onChange={(e) => setRemoveEmpty(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Remove Empty Lines</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={sortLines}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150"
            >
              Sort Lines
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sorting Examples</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Alphabetical Sorting (A → Z)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Input:</p>
                  <pre className="bg-gray-50 p-3 rounded border text-sm">Zebra{'\n'}Apple{'\n'}Mango{'\n'}Banana</pre>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Output:</p>
                  <pre className="bg-gray-50 p-3 rounded border text-sm">Apple{'\n'}Banana{'\n'}Mango{'\n'}Zebra</pre>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Sort by Length</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Input:</p>
                  <pre className="bg-gray-50 p-3 rounded border text-sm">Programming{'\n'}Code{'\n'}Development{'\n'}AI</pre>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Output (Shortest → Longest):</p>
                  <pre className="bg-gray-50 p-3 rounded border text-sm">AI{'\n'}Code{'\n'}Programming{'\n'}Development</pre>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Numerical Sorting</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Input:</p>
                  <pre className="bg-gray-50 p-3 rounded border text-sm">Item 100{'\n'}Item 5{'\n'}Item 50{'\n'}Item 10</pre>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Output (Ascending):</p>
                  <pre className="bg-gray-50 p-3 rounded border text-sm">Item 5{'\n'}Item 10{'\n'}Item 50{'\n'}Item 100</pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About Sort Text Lines Tool</h2>
          
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              The Sort Text Lines tool is a powerful online utility that helps you organize and arrange text lines 
              in various orders. Whether you need to sort a list alphabetically, organize data numerically, or 
              randomly shuffle content, this tool provides multiple sorting options to meet your needs.
            </p>

            <p className="mb-4">
              Sorting text is a common task in data processing, content management, and document organization. 
              Our tool makes it easy to sort lists, organize information, and prepare data for further processing 
              without requiring any programming knowledge or complex software.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Available Sorting Methods</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800">1. Alphabetical Sorting (A → Z)</h4>
                <p>Sorts lines in ascending alphabetical order from A to Z. Perfect for organizing names, words, or any text-based lists. Case sensitivity can be toggled to respect uppercase and lowercase differences.</p>
                <div className="bg-blue-50 p-3 rounded mt-2">
                  <p className="text-sm"><strong>Use case:</strong> Sorting contact lists, organizing vocabulary words, arranging product names alphabetically for catalogs.</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">2. Alphabetical Sorting (Z → A)</h4>
                <p>Sorts lines in descending alphabetical order from Z to A. Useful when you need reverse alphabetical organization or want to see items at the end of the alphabet first.</p>
                <div className="bg-blue-50 p-3 rounded mt-2">
                  <p className="text-sm"><strong>Use case:</strong> Creating reverse directories, organizing data in descending alphabetical order, finding last items quickly.</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">3. Sort by Length (Shortest → Longest)</h4>
                <p>Arranges lines based on character count, placing shorter lines first. Ideal for organizing content by size or finding the briefest entries.</p>
                <div className="bg-blue-50 p-3 rounded mt-2">
                  <p className="text-sm"><strong>Use case:</strong> Organizing meta descriptions by length, sorting tweets or social media posts, finding shortest file names.</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">4. Sort by Length (Longest → Shortest)</h4>
                <p>Arranges lines with longest content first. Useful when you want to prioritize or analyze longer entries before shorter ones.</p>
                <div className="bg-blue-50 p-3 rounded mt-2">
                  <p className="text-sm"><strong>Use case:</strong> Finding longest descriptions, identifying verbose entries, analyzing content length distribution.</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">5. Numerical Sorting (Ascending)</h4>
                <p>Sorts lines based on the first number found in each line, from lowest to highest. Perfect for organizing numbered lists, invoices, or any data containing numerical values.</p>
                <div className="bg-blue-50 p-3 rounded mt-2">
                  <p className="text-sm"><strong>Use case:</strong> Sorting invoice numbers, organizing ID lists, arranging version numbers, ordering page numbers.</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">6. Numerical Sorting (Descending)</h4>
                <p>Sorts lines with highest numbers first. Useful for prioritizing larger values or viewing data in reverse numerical order.</p>
                <div className="bg-blue-50 p-3 rounded mt-2">
                  <p className="text-sm"><strong>Use case:</strong> Finding highest prices, sorting by largest quantities, identifying top-ranked items.</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">7. Random Shuffle</h4>
                <p>Randomly reorders all lines using the Fisher-Yates shuffle algorithm. Perfect for randomizing lists, creating shuffled data sets, or generating random orders.</p>
                <div className="bg-blue-50 p-3 rounded mt-2">
                  <p className="text-sm"><strong>Use case:</strong> Randomizing quiz questions, shuffling playlist orders, creating random sample sets, randomizing participant lists.</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">8. Reverse Order</h4>
                <p>Simply reverses the current order of lines. The first line becomes last, and the last line becomes first.</p>
                <div className="bg-blue-50 p-3 rounded mt-2">
                  <p className="text-sm"><strong>Use case:</strong> Reversing chronological lists, flipping data order, inverting sequences, creating countdown lists.</p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Sorting Options Explained</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">Case Sensitive Sorting</h4>
              <p className="mb-2">When enabled, uppercase and lowercase letters are treated as different characters:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li><strong>Case Sensitive ON:</strong> "Apple", "apple", "APPLE" are all different and sorted separately</li>
                <li><strong>Case Sensitive OFF:</strong> All variations of "apple" are treated the same way</li>
                <li>Affects: Alphabetical sorting and duplicate detection</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">Remove Duplicate Lines</h4>
              <p className="mb-2">Automatically removes duplicate entries while sorting:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Keeps only the first occurrence of each unique line</li>
                <li>Works with case sensitivity setting (when ON, "Apple" and "apple" are different)</li>
                <li>Perfect for cleaning data sets and removing redundant entries</li>
                <li>Useful for email lists, URL lists, and any data with potential duplicates</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">Remove Empty Lines</h4>
              <p className="mb-2">Filters out blank lines from your text:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Removes lines that are completely empty or contain only whitespace</li>
                <li>Cleans up formatting issues and unnecessary blank spaces</li>
                <li>Creates compact, space-efficient output</li>
                <li>Useful for cleaning up copied text or exported data</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Common Use Cases</h3>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">📝 Content Management</h4>
                <ul className="text-sm space-y-1">
                  <li>• Sort blog post titles alphabetically</li>
                  <li>• Organize category lists for websites</li>
                  <li>• Arrange menu items in order</li>
                  <li>• Sort meta descriptions by length</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">📊 Data Processing</h4>
                <ul className="text-sm space-y-1">
                  <li>• Sort CSV data columns</li>
                  <li>• Organize log file entries</li>
                  <li>• Arrange database exports</li>
                  <li>• Sort JSON array values</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">👥 Contact Management</h4>
                <ul className="text-sm space-y-1">
                  <li>• Sort email lists alphabetically</li>
                  <li>• Organize contact names</li>
                  <li>• Remove duplicate email addresses</li>
                  <li>• Arrange phone number lists</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">💼 Business Applications</h4>
                <ul className="text-sm space-y-1">
                  <li>• Sort invoice numbers</li>
                  <li>• Organize product SKUs</li>
                  <li>• Arrange customer lists</li>
                  <li>• Sort order IDs numerically</li>
                </ul>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">🎓 Education</h4>
                <ul className="text-sm space-y-1">
                  <li>• Sort student names for attendance</li>
                  <li>• Randomize test question order</li>
                  <li>• Organize vocabulary words</li>
                  <li>• Arrange bibliography entries</li>
                </ul>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">💻 Development</h4>
                <ul className="text-sm space-y-1">
                  <li>• Sort import statements</li>
                  <li>• Organize CSS property names</li>
                  <li>• Arrange file lists alphabetically</li>
                  <li>• Sort package dependencies</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Best Practices for Sorting Text</h3>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">✅ Before Sorting</h4>
              <ul className="space-y-2">
                <li>• <strong>Review your data:</strong> Check for formatting issues or special characters that might affect sorting</li>
                <li>• <strong>Choose the right method:</strong> Select alphabetical for text, numerical for numbers, length for content analysis</li>
                <li>• <strong>Consider case sensitivity:</strong> Decide if uppercase and lowercase should be treated differently</li>
                <li>• <strong>Check for duplicates:</strong> Enable duplicate removal if you need unique entries only</li>
                <li>• <strong>Clean empty lines:</strong> Remove blank lines for cleaner output if they're not needed</li>
              </ul>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">✅ After Sorting</h4>
              <ul className="space-y-2">
                <li>• <strong>Verify results:</strong> Check the first and last few lines to ensure sorting is correct</li>
                <li>• <strong>Check line count:</strong> Compare input and output line counts to ensure no data loss</li>
                <li>• <strong>Review duplicates:</strong> If removed, verify the correct entries were kept</li>
                <li>• <strong>Save your work:</strong> Copy the sorted output immediately to avoid losing your work</li>
                <li>• <strong>Test with samples:</strong> For large datasets, test with a small sample first</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Pro Tips for Effective Sorting</h3>
            
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>💡 Tip 1:</strong> For mixed-case text, disable case sensitivity for more intuitive alphabetical sorting where "Apple" and "apple" appear together.</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>💡 Tip 2:</strong> When sorting numerical data, ensure numbers are at the beginning of each line for accurate numerical sorting.</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>💡 Tip 3:</strong> Use "Sort by Length" to identify outliers in your data - very short or very long entries that might need attention.</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>💡 Tip 4:</strong> Combine "Remove Duplicates" with alphabetical sorting to create clean, organized, unique lists in one operation.</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>💡 Tip 5:</strong> Use "Random Shuffle" multiple times to get different random orders - each shuffle produces a completely new arrangement.</p>
              </div>

              <div className="bg-gray-50 p-3 rounded">
                <p><strong>💡 Tip 6:</strong> For email lists or contact data, use alphabetical sorting with duplicate removal and empty line removal enabled for maximum cleanliness.</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Sorting Algorithms Explained</h3>
            
            <p className="mb-4">
              Our tool uses efficient sorting algorithms to handle your text quickly and accurately:
            </p>

            <ul className="list-disc ml-6 space-y-2 mb-4">
              <li><strong>JavaScript Sort:</strong> For alphabetical and numerical sorting, we use JavaScript's native sort method with custom comparators for optimal performance</li>
              <li><strong>Fisher-Yates Shuffle:</strong> Random shuffling uses the proven Fisher-Yates algorithm, ensuring truly random and unbiased results</li>
              <li><strong>Set-based Deduplication:</strong> Duplicate removal uses Set data structures for O(n) time complexity, making it fast even with large lists</li>
              <li><strong>Locale-aware Comparison:</strong> Alphabetical sorting respects language-specific sorting rules using localeCompare</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Data Privacy and Security</h3>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
              <p className="mb-2">
                <strong>🔒 Your data is safe:</strong> All sorting operations happen entirely in your browser. 
                Your text is never uploaded to any server or stored anywhere. This ensures complete privacy 
                and security for your sensitive data.
              </p>
              <p>
                You can use this tool offline (after the page loads) and sort confidential information 
                without any security concerns.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Frequently Asked Questions</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Q: How does case sensitivity affect sorting?</h4>
                <p>Case sensitivity determines whether uppercase and lowercase letters are treated as different characters. When enabled, "Apple" comes before "apple" in sorting. When disabled, they're treated as the same word and sorted together. For most general purposes, case-insensitive sorting (disabled) provides more intuitive results.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Q: How does numerical sorting work with text?</h4>
                <p>Numerical sorting extracts the first number found in each line and sorts based on that number. For example, "Item 100" will be sorted by the number 100. If a line contains no numbers, it will be placed at the end. This is perfect for sorting numbered lists where the number might not be at the start.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Q: Can I sort really large lists?</h4>
                <p>Yes! The tool can handle very large lists efficiently. However, for extremely large datasets (100,000+ lines), you might experience some delay. The tool processes everything in your browser, so performance depends on your device's capabilities. For best results with large lists, close other browser tabs to free up memory.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Q: What happens to empty lines when sorting?</h4>
                <p>By default, empty lines are kept and sorted along with other content (they typically appear first or last depending on the sort method). However, you can enable "Remove Empty Lines" to automatically filter them out. This is useful for cleaning up data that has unnecessary blank lines.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Q: How do I sort by multiple criteria?</h4>
                <p>For multi-level sorting, you'll need to sort in reverse order of priority. For example, to sort alphabetically and then by length, first sort by length, copy the output, then sort that result alphabetically. This way, items with the same alphabetical value will maintain their length-based order.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Q: Is the random shuffle truly random?</h4>
                <p>Yes! We use the Fisher-Yates shuffle algorithm, which is a proven method for generating truly random permutations. Every possible arrangement of your lines has an equal probability of being selected. This makes it perfect for fair randomization in games, quizzes, or sampling.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
