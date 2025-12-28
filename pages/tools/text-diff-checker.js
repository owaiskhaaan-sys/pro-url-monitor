import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function TextDiffChecker() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diffOutput, setDiffOutput] = useState([]);
  const [comparisonMode, setComparisonMode] = useState('line');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);

  const compareTexts = () => {
    if (!text1 && !text2) {
      alert('Please enter text in both fields to compare');
      return;
    }

    let processedText1 = text1;
    let processedText2 = text2;

    if (ignoreCase) {
      processedText1 = text1.toLowerCase();
      processedText2 = text2.toLowerCase();
    }

    if (comparisonMode === 'line') {
      const lines1 = processedText1.split('\n');
      const lines2 = processedText2.split('\n');
      const result = compareLines(lines1, lines2, text1.split('\n'), text2.split('\n'));
      setDiffOutput(result);
    } else if (comparisonMode === 'word') {
      const words1 = processedText1.split(/\s+/);
      const words2 = processedText2.split(/\s+/);
      const result = compareWords(words1, words2, text1.split(/\s+/), text2.split(/\s+/));
      setDiffOutput(result);
    } else if (comparisonMode === 'character') {
      const result = compareCharacters(processedText1, processedText2, text1, text2);
      setDiffOutput(result);
    }
  };

  const compareLines = (lines1, lines2, originalLines1, originalLines2) => {
    const result = [];
    const maxLength = Math.max(lines1.length, lines2.length);

    for (let i = 0; i < maxLength; i++) {
      const line1 = lines1[i] !== undefined ? (ignoreWhitespace ? lines1[i].trim() : lines1[i]) : null;
      const line2 = lines2[i] !== undefined ? (ignoreWhitespace ? lines2[i].trim() : lines2[i]) : null;
      const originalLine1 = originalLines1[i] !== undefined ? originalLines1[i] : null;
      const originalLine2 = originalLines2[i] !== undefined ? originalLines2[i] : null;

      if (line1 === null && line2 !== null) {
        result.push({ type: 'added', text: originalLine2, lineNum: i + 1 });
      } else if (line1 !== null && line2 === null) {
        result.push({ type: 'deleted', text: originalLine1, lineNum: i + 1 });
      } else if (line1 !== line2) {
        result.push({ type: 'modified', text1: originalLine1, text2: originalLine2, lineNum: i + 1 });
      } else {
        result.push({ type: 'unchanged', text: originalLine1, lineNum: i + 1 });
      }
    }

    return result;
  };

  const compareWords = (words1, words2, originalWords1, originalWords2) => {
    const result = [];
    const maxLength = Math.max(words1.length, words2.length);

    for (let i = 0; i < maxLength; i++) {
      const word1 = words1[i] !== undefined ? (ignoreWhitespace ? words1[i].trim() : words1[i]) : null;
      const word2 = words2[i] !== undefined ? (ignoreWhitespace ? words2[i].trim() : words2[i]) : null;
      const originalWord1 = originalWords1[i] !== undefined ? originalWords1[i] : null;
      const originalWord2 = originalWords2[i] !== undefined ? originalWords2[i] : null;

      if (word1 === null && word2 !== null) {
        result.push({ type: 'added', text: originalWord2 });
      } else if (word1 !== null && word2 === null) {
        result.push({ type: 'deleted', text: originalWord1 });
      } else if (word1 !== word2) {
        result.push({ type: 'modified', text1: originalWord1, text2: originalWord2 });
      } else {
        result.push({ type: 'unchanged', text: originalWord1 });
      }
    }

    return result;
  };

  const compareCharacters = (str1, str2, originalStr1, originalStr2) => {
    const result = [];
    const maxLength = Math.max(str1.length, str2.length);

    for (let i = 0; i < maxLength; i++) {
      const char1 = str1[i];
      const char2 = str2[i];
      const originalChar1 = originalStr1[i];
      const originalChar2 = originalStr2[i];

      if (!char1 && char2) {
        result.push({ type: 'added', text: originalChar2 });
      } else if (char1 && !char2) {
        result.push({ type: 'deleted', text: originalChar1 });
      } else if (char1 !== char2) {
        result.push({ type: 'modified', text1: originalChar1, text2: originalChar2 });
      } else {
        result.push({ type: 'unchanged', text: originalChar1 });
      }
    }

    return result;
  };

  const getStats = () => {
    const stats = {
      added: 0,
      deleted: 0,
      modified: 0,
      unchanged: 0
    };

    diffOutput.forEach(item => {
      stats[item.type]++;
    });

    return stats;
  };

  const stats = getStats();

  const copyOutput = () => {
    if (diffOutput.length === 0) {
      alert('No comparison result to copy');
      return;
    }

    const text = diffOutput.map(item => {
      if (item.type === 'added') return `+ ${item.text}`;
      if (item.type === 'deleted') return `- ${item.text}`;
      if (item.type === 'modified') return `~ ${item.text1} → ${item.text2}`;
      return `  ${item.text}`;
    }).join('\n');

    navigator.clipboard.writeText(text);
    alert('Comparison result copied to clipboard!');
  };

  const clearAll = () => {
    setText1('');
    setText2('');
    setDiffOutput([]);
  };

  const loadExample = () => {
    setText1(`The quick brown fox jumps over the lazy dog.
This is the original text.
Nothing has changed here.`);
    setText2(`The quick red fox jumps over the lazy cat.
This is the modified text.
Nothing has changed here.`);
  };

  return (
    <Layout>
      <Head>
        <title>Text Diff Checker - Compare Two Texts Online & Find Differences</title>
        <meta name="description" content="Free online text comparison tool. Compare two texts side-by-side and highlight differences. Perfect for finding changes, comparing documents, and reviewing edits with line, word, and character-level comparison." />
        <meta name="keywords" content="text diff, compare text, text comparison, diff checker, find differences, text compare online, diff tool, compare documents" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Text Diff Checker</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Compare two texts and instantly see the differences. Perfect for comparing versions, finding changes, 
            reviewing edits, and analyzing text modifications with detailed highlighting.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* Comparison Mode and Options */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comparison Mode
            </label>
            <select
              value={comparisonMode}
              onChange={(e) => setComparisonMode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            >
              <option value="line">Line-by-Line Comparison</option>
              <option value="word">Word-by-Word Comparison</option>
              <option value="character">Character-by-Character Comparison</option>
            </select>

            <div className="grid md:grid-cols-2 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={ignoreWhitespace}
                  onChange={(e) => setIgnoreWhitespace(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Ignore Whitespace Differences</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={ignoreCase}
                  onChange={(e) => setIgnoreCase(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Ignore Case (Uppercase/Lowercase)</span>
              </label>
            </div>
          </div>

          {/* Input Text Areas */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Text (Text 1)
              </label>
              <textarea
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                placeholder="Enter original text..."
                className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modified Text (Text 2)
              </label>
              <textarea
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                placeholder="Enter modified text..."
                className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={compareTexts}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150"
            >
              Compare Texts
            </button>
            <button
              onClick={copyOutput}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-150"
            >
              Copy Result
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

          {/* Statistics */}
          {diffOutput.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-700">{stats.added}</div>
                <div className="text-sm text-green-600">Added</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-red-700">{stats.deleted}</div>
                <div className="text-sm text-red-600">Deleted</div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-yellow-700">{stats.modified}</div>
                <div className="text-sm text-yellow-600">Modified</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-gray-700">{stats.unchanged}</div>
                <div className="text-sm text-gray-600">Unchanged</div>
              </div>
            </div>
          )}

          {/* Diff Output */}
          {diffOutput.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comparison Result
              </label>
              <div className="border border-gray-300 rounded-md bg-gray-50 p-4 max-h-96 overflow-y-auto font-mono text-sm">
                {diffOutput.map((item, index) => (
                  <div key={index} className="mb-1">
                    {item.type === 'added' && (
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded">
                        <span className="font-bold">+ </span>{item.text}
                      </div>
                    )}
                    {item.type === 'deleted' && (
                      <div className="bg-red-100 text-red-800 px-2 py-1 rounded">
                        <span className="font-bold">- </span>{item.text}
                      </div>
                    )}
                    {item.type === 'modified' && (
                      <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        <span className="font-bold">~ </span>
                        <span className="line-through">{item.text1}</span>
                        <span className="mx-2">→</span>
                        <span className="font-semibold">{item.text2}</span>
                      </div>
                    )}
                    {item.type === 'unchanged' && (
                      <div className="text-gray-600 px-2 py-1">
                        <span className="font-bold">  </span>{item.text}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Examples Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Comparison Examples</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Line-by-Line Comparison</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm mb-2"><strong>Original:</strong></p>
                <pre className="bg-white p-2 rounded border text-xs mb-3">Line 1: Hello{'\n'}Line 2: World{'\n'}Line 3: Test</pre>
                <p className="text-sm mb-2"><strong>Modified:</strong></p>
                <pre className="bg-white p-2 rounded border text-xs mb-3">Line 1: Hello{'\n'}Line 2: Universe{'\n'}Line 3: Test</pre>
                <p className="text-sm"><strong>Result:</strong> Shows "World" changed to "Universe" on Line 2</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Word-by-Word Comparison</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm mb-2"><strong>Original:</strong> "The quick brown fox"</p>
                <p className="text-sm mb-2"><strong>Modified:</strong> "The slow brown fox"</p>
                <p className="text-sm"><strong>Result:</strong> Highlights "quick" changed to "slow"</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Character-by-Character Comparison</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm mb-2"><strong>Original:</strong> "Hello"</p>
                <p className="text-sm mb-2"><strong>Modified:</strong> "Hallo"</p>
                <p className="text-sm"><strong>Result:</strong> Shows 'e' changed to 'a' at character position 2</p>
              </div>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About Text Diff Checker</h2>
          
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              The Text Diff Checker is a powerful comparison tool that helps you identify differences between two 
              versions of text. Whether you're comparing document revisions, reviewing code changes, checking edits, 
              or analyzing text modifications, this tool provides clear, color-coded visualization of additions, 
              deletions, and modifications.
            </p>

            <p className="mb-4">
              Understanding what changed between two versions of text is crucial in many scenarios - from reviewing 
              edited documents to tracking code modifications. Our diff checker makes it easy to spot even the smallest 
              changes with multiple comparison modes and customizable options.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Comparison Modes</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800">1. Line-by-Line Comparison</h4>
                <p>Compares texts line by line, perfect for documents, code files, and structured content. Each line 
                is compared independently, making it easy to see which lines were added, removed, or modified. This 
                mode is ideal when line breaks are meaningful in your content.</p>
                <div className="bg-blue-50 p-3 rounded mt-2">
                  <p className="text-sm"><strong>Best for:</strong> Code reviews, document comparisons, configuration files, CSV data, scripts, and any text where line structure matters.</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">2. Word-by-Word Comparison</h4>
                <p>Analyzes text word by word, highlighting individual word changes. This mode treats whitespace as 
                word separators and compares each word independently. Perfect for proofreading, content editing, and 
                finding specific word changes without being distracted by line structure.</p>
                <div className="bg-blue-50 p-3 rounded mt-2">
                  <p className="text-sm"><strong>Best for:</strong> Content editing, proofreading, article revisions, marketing copy changes, and when you care about specific word modifications.</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">3. Character-by-Character Comparison</h4>
                <p>Provides the most detailed comparison by analyzing every single character. This mode catches even 
                the smallest changes like punctuation modifications, typo fixes, or single character edits. Essential 
                for precise text analysis where every character matters.</p>
                <div className="bg-blue-50 p-3 rounded mt-2">
                  <p className="text-sm"><strong>Best for:</strong> Precise text analysis, catching typos, punctuation changes, finding subtle differences, data validation, and forensic text analysis.</p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Comparison Options</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">Ignore Whitespace Differences</h4>
              <p className="mb-2">When enabled, differences in spaces, tabs, and other whitespace characters are ignored:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Leading and trailing spaces are trimmed before comparison</li>
                <li>"Hello  World" (two spaces) is treated the same as "Hello World" (one space)</li>
                <li>Useful when formatting doesn't matter, only content does</li>
                <li>Perfect for comparing texts that may have been reformatted</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">Ignore Case</h4>
              <p className="mb-2">When enabled, uppercase and lowercase differences are ignored:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>"Hello" and "hello" are treated as identical</li>
                <li>"WORLD" and "world" are considered the same</li>
                <li>Useful when capitalization changes don't matter</li>
                <li>Great for comparing texts where case sensitivity isn't important</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Color Coding Legend</h3>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                <div className="font-semibold text-green-800 mb-1">🟢 Green (Added)</div>
                <p className="text-sm text-gray-700">Content that exists in Text 2 but not in Text 1. New additions or insertions.</p>
              </div>

              <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                <div className="font-semibold text-red-800 mb-1">🔴 Red (Deleted)</div>
                <p className="text-sm text-gray-700">Content that exists in Text 1 but not in Text 2. Removed or deleted content.</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                <div className="font-semibold text-yellow-800 mb-1">🟡 Yellow (Modified)</div>
                <p className="text-sm text-gray-700">Content that changed between versions. Shows original → modified.</p>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                <div className="font-semibold text-gray-800 mb-1">⚪ Gray (Unchanged)</div>
                <p className="text-sm text-gray-700">Content that is identical in both texts. No changes detected.</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Common Use Cases</h3>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">📝 Document Review</h4>
                <ul className="text-sm space-y-1">
                  <li>• Compare draft versions</li>
                  <li>• Review editor's changes</li>
                  <li>• Track document revisions</li>
                  <li>• Verify corrections made</li>
                  <li>• See content evolution</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">💻 Code Review</h4>
                <ul className="text-sm space-y-1">
                  <li>• Compare code versions</li>
                  <li>• Review pull request changes</li>
                  <li>• Track bug fixes</li>
                  <li>• Verify refactoring</li>
                  <li>• Analyze commits</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">✍️ Content Editing</h4>
                <ul className="text-sm space-y-1">
                  <li>• Compare article versions</li>
                  <li>• Review copy edits</li>
                  <li>• Track SEO changes</li>
                  <li>• Verify proofreading</li>
                  <li>• Compare translations</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">📄 Legal Documents</h4>
                <ul className="text-sm space-y-1">
                  <li>• Compare contract versions</li>
                  <li>• Review amendments</li>
                  <li>• Track clause changes</li>
                  <li>• Verify revisions</li>
                  <li>• Audit modifications</li>
                </ul>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">🔧 Configuration Files</h4>
                <ul className="text-sm space-y-1">
                  <li>• Compare config versions</li>
                  <li>• Track setting changes</li>
                  <li>• Review updates</li>
                  <li>• Verify deployments</li>
                  <li>• Debug configurations</li>
                </ul>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">📊 Data Comparison</h4>
                <ul className="text-sm space-y-1">
                  <li>• Compare CSV files</li>
                  <li>• Track data changes</li>
                  <li>• Verify imports/exports</li>
                  <li>• Find data discrepancies</li>
                  <li>• Audit data updates</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Best Practices for Text Comparison</h3>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">✅ Before Comparing</h4>
              <ul className="space-y-2">
                <li>• <strong>Choose the right mode:</strong> Line mode for documents, word mode for content, character mode for precision</li>
                <li>• <strong>Consider options:</strong> Decide if whitespace and case differences matter for your comparison</li>
                <li>• <strong>Label your texts:</strong> Keep track of which is original and which is modified</li>
                <li>• <strong>Format consistently:</strong> If possible, use the same formatting for both texts</li>
                <li>• <strong>Use clean text:</strong> Remove unnecessary formatting that might cause false differences</li>
              </ul>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">✅ Interpreting Results</h4>
              <ul className="space-y-2">
                <li>• <strong>Focus on colored items:</strong> Green (added), red (deleted), and yellow (modified) items are the changes</li>
                <li>• <strong>Check statistics:</strong> The summary shows total counts of each change type</li>
                <li>• <strong>Verify context:</strong> Look at unchanged (gray) lines around changes for context</li>
                <li>• <strong>Review systematically:</strong> Go through changes one by one rather than scanning randomly</li>
                <li>• <strong>Note patterns:</strong> Multiple similar changes might indicate systematic updates</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Pro Tips</h3>
            
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>💡 Tip 1:</strong> For comparing similar texts with minor formatting differences, enable both "Ignore Whitespace" and "Ignore Case" options to focus only on content changes.</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>💡 Tip 2:</strong> Use line-by-line mode for structured text (code, configs) and word-by-word mode for prose (articles, documents) to get the most meaningful comparison.</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>💡 Tip 3:</strong> When comparing large texts, start with line mode to see major changes, then use word or character mode to examine specific sections in detail.</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>💡 Tip 4:</strong> Copy the comparison result and save it for documentation or review purposes - it includes clear markers for each type of change.</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>💡 Tip 5:</strong> The statistics (added, deleted, modified, unchanged) give you a quick overview of how much changed - useful for estimating review effort.</p>
              </div>

              <div className="bg-gray-50 p-3 rounded">
                <p><strong>💡 Tip 6:</strong> For version control workflows, this tool complements Git diffs by providing a simpler, more visual comparison without needing a repository.</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Understanding Diff Output</h3>
            
            <p className="mb-4">
              The comparison output uses standard diff notation that is widely recognized:
            </p>

            <ul className="list-disc ml-6 space-y-2 mb-4">
              <li><strong>+ (Plus sign):</strong> Indicates added content - appears in green highlighting</li>
              <li><strong>- (Minus sign):</strong> Indicates deleted content - appears in red highlighting</li>
              <li><strong>~ (Tilde sign):</strong> Indicates modified content - shows original → modified in yellow</li>
              <li><strong>(Space):</strong> Indicates unchanged content - appears in gray for context</li>
            </ul>

            <p className="mb-4">
              This notation is similar to Unix diff output and Git diffs, making it familiar to developers 
              and useful for documentation.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Privacy and Security</h3>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
              <p className="mb-2">
                <strong>🔒 Your data is completely safe:</strong> All text comparison happens entirely in your browser 
                using JavaScript. Neither text is ever sent to any server or stored anywhere. This ensures complete 
                privacy and security for sensitive documents, confidential data, or proprietary content.
              </p>
              <p>
                You can safely compare classified documents, trade secrets, personal information, or any sensitive 
                content without any security concerns. The tool works offline once the page loads.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Frequently Asked Questions</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Q: Which comparison mode should I use?</h4>
                <p>It depends on your needs. Use line-by-line for structured text like code or documents where lines matter. Use word-by-word for prose and content where you want to see specific word changes. Use character-by-character when you need to catch every tiny difference including punctuation and single character changes.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Q: What does "Ignore Whitespace" do exactly?</h4>
                <p>When enabled, it trims leading and trailing whitespace from each unit being compared (lines, words, or characters depending on mode). This means differences in spacing, indentation, or extra spaces won't be flagged as changes. It's useful when comparing texts that may have been reformatted or copied from different sources.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Q: Can I compare really large texts?</h4>
                <p>Yes, the tool can handle large texts. However, for extremely large documents (100,000+ characters), the comparison might take a moment and the visual display could become lengthy. For best results with very large texts, consider comparing them in sections or using line mode which is more efficient.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Q: How is this different from Git diff?</h4>
                <p>This tool provides a simpler, visual comparison without needing a Git repository or command line. It's perfect for quick comparisons, comparing texts from any source, and for non-developers. Git diff is more powerful for version control workflows and handles file history, but this tool is easier and faster for simple text comparisons.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Q: Can I save the comparison results?</h4>
                <p>Yes! Use the "Copy Result" button to copy the comparison output to your clipboard. The output includes clear markers (+ for additions, - for deletions, ~ for modifications) that make it easy to see what changed. You can paste this into any document or email for reference.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Q: Why are some changes showing as modified instead of added/deleted?</h4>
                <p>In line and word modes, when content exists at the same position in both texts but differs, it's marked as modified (yellow). If content only exists in one text, it's marked as added (green) or deleted (red). The mode you choose affects how the tool aligns and compares content.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
