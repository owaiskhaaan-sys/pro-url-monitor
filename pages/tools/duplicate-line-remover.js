import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function DuplicateLineRemover() {
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [keepFirstOccurrence, setKeepFirstOccurrence] = useState(true);
  const [removedCount, setRemovedCount] = useState(0);

  const removeDuplicates = () => {
    if (!text.trim()) {
      alert('Please enter some text first');
      return;
    }

    const lines = text.split('\n');
    const seen = new Set();
    const result = [];
    let removed = 0;

    lines.forEach((line) => {
      let processedLine = line;
      
      if (trimWhitespace) {
        processedLine = line.trim();
      }
      
      const compareLine = caseSensitive ? processedLine : processedLine.toLowerCase();
      
      if (!seen.has(compareLine)) {
        seen.add(compareLine);
        result.push(keepFirstOccurrence ? line : null);
      } else {
        removed++;
        if (!keepFirstOccurrence) {
          const index = result.findIndex((l) => {
            const processedResult = trimWhitespace ? (l || '').trim() : (l || '');
            const compareResult = caseSensitive ? processedResult : processedResult.toLowerCase();
            return compareResult === compareLine;
          });
          if (index !== -1) {
            result[index] = line;
          }
        }
      }
    });

    const finalResult = result.filter(line => line !== null).join('\n');
    setOutput(finalResult);
    setRemovedCount(removed);
  };

  const removeEmptyLines = () => {
    const lines = text.split('\n');
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);
    setOutput(nonEmptyLines.join('\n'));
    setRemovedCount(lines.length - nonEmptyLines.length);
  };

  const removeConsecutiveDuplicates = () => {
    const lines = text.split('\n');
    const result = [];
    let previousLine = null;
    let removed = 0;

    lines.forEach((line) => {
      const processedLine = trimWhitespace ? line.trim() : line;
      const compareLine = caseSensitive ? processedLine : processedLine.toLowerCase();
      const prevCompareLine = previousLine ? (caseSensitive ? previousLine : previousLine.toLowerCase()) : null;

      if (compareLine !== prevCompareLine) {
        result.push(line);
        previousLine = processedLine;
      } else {
        removed++;
      }
    });

    setOutput(result.join('\n'));
    setRemovedCount(removed);
  };

  const keepOnlyDuplicates = () => {
    const lines = text.split('\n');
    const lineCount = new Map();
    
    // Count occurrences
    lines.forEach((line) => {
      const processedLine = trimWhitespace ? line.trim() : line;
      const compareLine = caseSensitive ? processedLine : processedLine.toLowerCase();
      lineCount.set(compareLine, (lineCount.get(compareLine) || 0) + 1);
    });

    // Keep only lines that appear more than once
    const result = lines.filter((line) => {
      const processedLine = trimWhitespace ? line.trim() : line;
      const compareLine = caseSensitive ? processedLine : processedLine.toLowerCase();
      return lineCount.get(compareLine) > 1;
    });

    setOutput(result.join('\n'));
    setRemovedCount(lines.length - result.length);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    alert('Copied to clipboard!');
  };

  const clearAll = () => {
    setText('');
    setOutput('');
    setRemovedCount(0);
  };

  const loadExample = () => {
    setText(`apple
banana
apple
cherry
banana
date
apple
cherry
fig
banana`);
  };

  const getStats = (str) => {
    const lines = str.split('\n');
    const nonEmptyLines = lines.filter(l => l.trim().length > 0);
    return {
      totalLines: lines.length,
      nonEmptyLines: nonEmptyLines.length,
      emptyLines: lines.length - nonEmptyLines.length,
      uniqueLines: new Set(nonEmptyLines.map(l => trimWhitespace ? l.trim() : l)).size
    };
  };

  const inputStats = getStats(text);
  const outputStats = output ? getStats(output) : null;

  return (
    <Layout>
      <Head>
        <title>Duplicate Line Remover - Remove Duplicate Text</title>
        <meta name="description" content="Remove duplicate lines from text instantly. Free duplicate line remover tool to clean text, eliminate repeated lines, and organize content." />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/duplicate-line-remover" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Duplicate Line Remover
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Remove duplicate lines from text instantly. Clean up lists, logs, and data files with ease.
            </p>
          </div>

          {/* Tool Interface */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            {/* Input Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Input Text (One Item Per Line)
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your text here, one line per item..."
                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none font-mono text-sm"
              />
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                <span>Total Lines: {inputStats.totalLines}</span>
                <span>Non-Empty: {inputStats.nonEmptyLines}</span>
                <span>Unique: {inputStats.uniqueLines}</span>
                <span>Empty: {inputStats.emptyLines}</span>
              </div>
            </div>

            {/* Settings */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Options
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={caseSensitive}
                    onChange={(e) => setCaseSensitive(e.target.checked)}
                    className="w-4 h-4 text-red-600 focus:ring-red-500 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Case sensitive</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={trimWhitespace}
                    onChange={(e) => setTrimWhitespace(e.target.checked)}
                    className="w-4 h-4 text-red-600 focus:ring-red-500 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Trim whitespace</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={keepFirstOccurrence}
                    onChange={(e) => setKeepFirstOccurrence(e.target.checked)}
                    className="w-4 h-4 text-red-600 focus:ring-red-500 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Keep first occurrence</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Remove Duplicates
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={removeDuplicates}
                  className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm"
                >
                  🗑️ Remove All Duplicates
                </button>
                <button
                  onClick={removeConsecutiveDuplicates}
                  className="px-4 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition font-medium text-sm"
                >
                  📋 Consecutive Only
                </button>
                <button
                  onClick={removeEmptyLines}
                  className="px-4 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-medium text-sm"
                >
                  📄 Remove Empty Lines
                </button>
                <button
                  onClick={keepOnlyDuplicates}
                  className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium text-sm"
                >
                  🔍 Keep Only Duplicates
                </button>
              </div>
            </div>

            {/* Output Section */}
            {output && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">
                    Output ({removedCount} duplicates removed)
                  </label>
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm"
                  >
                    📋 Copy
                  </button>
                </div>
                <textarea
                  value={output}
                  readOnly
                  className="w-full h-64 p-4 border border-gray-300 rounded-lg bg-gray-50 resize-none font-mono text-sm"
                />
                {outputStats && (
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>Total Lines: {outputStats.totalLines}</span>
                    <span>Non-Empty: {outputStats.nonEmptyLines}</span>
                    <span>Unique: {outputStats.uniqueLines}</span>
                    <span>Empty: {outputStats.emptyLines}</span>
                  </div>
                )}
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={loadExample}
                className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
              >
                Load Example
              </button>
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
                <span className="text-blue-400 mr-3">💡</span>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">Quick Tip</h4>
                  <p className="text-sm text-blue-700">
                    Enable "Trim whitespace" to ignore leading/trailing spaces when comparing lines. 
                    Disable "Case sensitive" to treat "Apple" and "apple" as duplicates.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Information Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              About Duplicate Line Remover
            </h2>

            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">What is Duplicate Line Removal?</h3>
                <p>
                  Duplicate line removal is the process of identifying and eliminating repeated lines in text data. 
                  This tool helps you clean up lists, remove redundant entries, and organize data by keeping only 
                  unique lines. It's essential for data processing, list management, and text file cleanup.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Removal Modes</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">🗑️ Remove All Duplicates</h4>
                    <p className="text-sm mb-2">
                      Removes all duplicate lines throughout the entire text, keeping only one instance of each unique line. 
                      This is the most common mode for general list cleanup.
                    </p>
                    <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                      <div className="mb-2">Input: apple, banana, apple, cherry, banana</div>
                      <div className="text-red-600">Output: apple, banana, cherry</div>
                    </div>
                  </div>

                  <div className="border-l-4 border-rose-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">📋 Consecutive Duplicates Only</h4>
                    <p className="text-sm mb-2">
                      Removes only consecutive duplicate lines (lines that repeat immediately after each other). 
                      Non-consecutive duplicates are preserved.
                    </p>
                    <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                      <div className="mb-2">Input: apple, apple, banana, apple</div>
                      <div className="text-rose-600">Output: apple, banana, apple</div>
                    </div>
                  </div>

                  <div className="border-l-4 border-pink-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">📄 Remove Empty Lines</h4>
                    <p className="text-sm mb-2">
                      Removes all blank lines from the text, keeping only lines with content. 
                      Useful for cleaning up formatted text files.
                    </p>
                    <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                      <div className="mb-2">Input: apple, [blank], banana, [blank]</div>
                      <div className="text-pink-600">Output: apple, banana</div>
                    </div>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">🔍 Keep Only Duplicates</h4>
                    <p className="text-sm mb-2">
                      Shows only lines that appear more than once in the text. 
                      Useful for finding repeated entries in data.
                    </p>
                    <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                      <div className="mb-2">Input: apple, banana, apple, cherry</div>
                      <div className="text-orange-600">Output: apple, apple</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Options Explained</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-2">Case Sensitive</h4>
                    <p className="text-sm">
                      When enabled, "Apple" and "apple" are treated as different lines. 
                      When disabled, they're considered duplicates.
                    </p>
                  </div>
                  <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
                    <h4 className="font-semibold text-rose-800 mb-2">Trim Whitespace</h4>
                    <p className="text-sm">
                      Removes leading/trailing spaces before comparing. "apple " and " apple" are treated as same.
                    </p>
                  </div>
                  <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                    <h4 className="font-semibold text-pink-800 mb-2">Keep First Occurrence</h4>
                    <p className="text-sm">
                      Keeps the first instance of duplicates. When disabled, keeps the last instance instead.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Common Use Cases</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Email Lists:</strong> Remove duplicate email addresses from mailing lists</li>
                  <li><strong>Contact Lists:</strong> Clean up phone numbers or names with duplicate entries</li>
                  <li><strong>Data Cleanup:</strong> Remove redundant records from CSV exports or database dumps</li>
                  <li><strong>Log Files:</strong> Filter repeated error messages or warnings from logs</li>
                  <li><strong>URL Lists:</strong> Remove duplicate URLs from crawl results or sitemaps</li>
                  <li><strong>Keyword Lists:</strong> Clean up SEO keyword lists with duplicates</li>
                  <li><strong>Code Cleanup:</strong> Remove duplicate import statements or dependencies</li>
                  <li><strong>Shopping Lists:</strong> Consolidate repeated items in lists</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Best Practices</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">✅ Before Processing</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Back up original data before removing duplicates</li>
                      <li>• Review settings (case sensitivity, whitespace)</li>
                      <li>• Test with a small sample first</li>
                      <li>• Ensure one item per line format</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Consider</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Some duplicates may be intentional</li>
                      <li>• Case sensitivity matters for names</li>
                      <li>• Whitespace can cause false duplicates</li>
                      <li>• Review output before using in production</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <h4 className="font-semibold text-yellow-800 mb-2">Pro Tips</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Use "Keep Only Duplicates" to find what needs review</li>
                  <li>• Enable "Trim whitespace" when importing from spreadsheets</li>
                  <li>• For names, keep case sensitive enabled to preserve capitalization</li>
                  <li>• For URLs, disable case sensitive (URLs are case-insensitive)</li>
                  <li>• Check line count before/after to verify results</li>
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
                  What's the difference between "All Duplicates" and "Consecutive Duplicates"?
                </h3>
                <p className="text-gray-700">
                  "All Duplicates" removes every repeated line regardless of position. "Consecutive Duplicates" only 
                  removes lines that repeat immediately after each other. For example, in "A, A, B, A", all duplicates 
                  gives "A, B" while consecutive gives "A, B, A".
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Does this tool preserve the original line order?
                </h3>
                <p className="text-gray-700">
                  Yes! The tool maintains the original order of lines. It simply removes duplicates while keeping 
                  the first (or last, depending on settings) occurrence in its original position.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Should I enable or disable case sensitivity?
                </h3>
                <p className="text-gray-700">
                  Enable case sensitivity when capitalization matters (names, brand names, code). Disable it for 
                  data where case doesn't matter (URLs, email addresses, generic lists). Test both to see which 
                  gives better results for your data.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I process very large files with this tool?
                </h3>
                <p className="text-gray-700">
                  Yes, the tool can handle large amounts of text (tens of thousands of lines). However, extremely 
                  large files (100,000+ lines) may slow down your browser. For massive files, consider using 
                  command-line tools or programming scripts.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What does "Keep first occurrence" vs "Keep last occurrence" do?
                </h3>
                <p className="text-gray-700">
                  When duplicates are found, you can choose to keep either the first appearance or the last appearance 
                  of that line. Most users keep the first occurrence (default), but keeping the last can be useful 
                  for timestamped data where the newest entry should be preserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
