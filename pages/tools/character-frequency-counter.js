import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function CharacterFrequencyCounter() {
  const [inputText, setInputText] = useState('');
  const [frequencies, setFrequencies] = useState([]);
  const [sortBy, setSortBy] = useState('frequency-desc');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [includeSpaces, setIncludeSpaces] = useState(false);
  const [includeSpecialChars, setIncludeSpecialChars] = useState(true);

  const analyzeText = () => {
    if (!inputText.trim()) {
      alert('Please enter text to analyze');
      return;
    }

    let processedText = inputText;
    
    // Apply case sensitivity
    if (!caseSensitive) {
      processedText = processedText.toLowerCase();
    }

    // Count character frequencies
    const charMap = new Map();
    
    for (let char of processedText) {
      // Skip spaces if not included
      if (!includeSpaces && char === ' ') continue;
      
      // Skip special characters if not included
      if (!includeSpecialChars && !char.match(/[a-zA-Z0-9]/)) continue;
      
      charMap.set(char, (charMap.get(char) || 0) + 1);
    }

    // Convert to array and calculate percentages
    const totalChars = Array.from(charMap.values()).reduce((a, b) => a + b, 0);
    const freqArray = Array.from(charMap.entries()).map(([char, count]) => ({
      char: char,
      count: count,
      percentage: ((count / totalChars) * 100).toFixed(2)
    }));

    // Sort based on selected option
    let sortedArray = [...freqArray];
    if (sortBy === 'frequency-desc') {
      sortedArray.sort((a, b) => b.count - a.count);
    } else if (sortBy === 'frequency-asc') {
      sortedArray.sort((a, b) => a.count - b.count);
    } else if (sortBy === 'alphabetical-asc') {
      sortedArray.sort((a, b) => a.char.localeCompare(b.char));
    } else if (sortBy === 'alphabetical-desc') {
      sortedArray.sort((a, b) => b.char.localeCompare(a.char));
    }

    setFrequencies(sortedArray);
  };

  const getStats = () => {
    if (!inputText) return { total: 0, unique: 0, letters: 0, digits: 0, spaces: 0, special: 0 };
    
    let text = caseSensitive ? inputText : inputText.toLowerCase();
    const chars = text.split('');
    const uniqueChars = new Set(chars).size;
    
    return {
      total: inputText.length,
      unique: uniqueChars,
      letters: (inputText.match(/[a-zA-Z]/g) || []).length,
      digits: (inputText.match(/[0-9]/g) || []).length,
      spaces: (inputText.match(/ /g) || []).length,
      special: inputText.length - (inputText.match(/[a-zA-Z0-9 ]/g) || []).length
    };
  };

  const stats = getStats();

  const copyResults = () => {
    if (frequencies.length === 0) {
      alert('No analysis results to copy');
      return;
    }

    const text = frequencies.map(item => 
      `${item.char === ' ' ? '(space)' : item.char}: ${item.count} (${item.percentage}%)`
    ).join('\n');

    navigator.clipboard.writeText(text);
    alert('Results copied to clipboard!');
  };

  const clearAll = () => {
    setInputText('');
    setFrequencies([]);
  };

  const loadExample = () => {
    setInputText('Hello World! This is a sample text to analyze character frequency. The quick brown fox jumps over the lazy dog.');
  };

  const getCharacterDisplay = (char) => {
    if (char === ' ') return '(space)';
    if (char === '\n') return '(newline)';
    if (char === '\t') return '(tab)';
    return char;
  };

  return (
    <Layout>
      <Head>
        <title>Character Frequency Counter - Analyze | ProURLMonitor</title>
        <meta name="description" content="Free online character frequency analyzer. Count character occurrences, calculate percentages, and analyze text character distribution. Perfect for..." />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/character-frequency-counter" />
        <meta name="keywords" content="character frequency, character counter, frequency analysis, text analysis, character distribution, letter frequency, cryptography analysis" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Character Frequency Counter</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Analyze character frequency and distribution in your text. Perfect for cryptography, text analysis, 
            data science, and understanding character patterns with detailed statistics and visualizations.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* Options */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            >
              <option value="frequency-desc">Frequency (Highest First)</option>
              <option value="frequency-asc">Frequency (Lowest First)</option>
              <option value="alphabetical-asc">Alphabetical (A → Z)</option>
              <option value="alphabetical-desc">Alphabetical (Z → A)</option>
            </select>

            <div className="grid md:grid-cols-3 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={caseSensitive}
                  onChange={(e) => setCaseSensitive(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Case Sensitive (A ≠ a)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeSpaces}
                  onChange={(e) => setIncludeSpaces(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Include Spaces</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeSpecialChars}
                  onChange={(e) => setIncludeSpecialChars(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Include Special Characters</span>
              </label>
            </div>
          </div>

          {/* Input Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Input Text
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to analyze character frequency..."
              className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>

          {/* Statistics */}
          {inputText && (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-blue-700">{stats.total}</div>
                <div className="text-xs text-blue-600">Total</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-purple-700">{stats.unique}</div>
                <div className="text-xs text-purple-600">Unique</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-green-700">{stats.letters}</div>
                <div className="text-xs text-green-600">Letters</div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-yellow-700">{stats.digits}</div>
                <div className="text-xs text-yellow-600">Digits</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-gray-700">{stats.spaces}</div>
                <div className="text-xs text-gray-600">Spaces</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-red-700">{stats.special}</div>
                <div className="text-xs text-red-600">Special</div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={analyzeText}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150"
            >
              Analyze Frequency
            </button>
            <button
              onClick={copyResults}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-150"
            >
              Copy Results
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

          {/* Results */}
          {frequencies.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Character Frequency Analysis ({frequencies.length} unique characters)
              </label>
              <div className="border border-gray-300 rounded-md bg-gray-50 max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Character</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Count</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Percentage</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Bar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {frequencies.map((item, index) => (
                      <tr key={index} className="border-t border-gray-200 hover:bg-gray-100">
                        <td className="px-4 py-2 font-mono font-semibold">{getCharacterDisplay(item.char)}</td>
                        <td className="px-4 py-2">{item.count}</td>
                        <td className="px-4 py-2">{item.percentage}%</td>
                        <td className="px-4 py-2">
                          <div className="w-full bg-gray-200 rounded-full h-4">
                            <div 
                              className="bg-blue-600 h-4 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Examples Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Analysis Examples</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Simple Text Analysis</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm mb-2"><strong>Input:</strong> "hello world"</p>
                <p className="text-sm mb-2"><strong>Result:</strong></p>
                <ul className="text-sm space-y-1">
                  <li>• l: 3 occurrences (27.27%)</li>
                  <li>• o: 2 occurrences (18.18%)</li>
                  <li>• h: 1 occurrence (9.09%)</li>
                  <li>• e: 1 occurrence (9.09%)</li>
                  <li>• w: 1 occurrence (9.09%)</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Case Sensitive vs Case Insensitive</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm mb-2"><strong>Input:</strong> "Hello HELLO"</p>
                <p className="text-sm mb-2"><strong>Case Sensitive:</strong> H:1, e:1, l:2, o:1, E:1, L:2, O:1 (treats H and h differently)</p>
                <p className="text-sm"><strong>Case Insensitive:</strong> h:2, e:2, l:4, o:2 (combines H with h)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About Character Frequency Counter</h2>
          
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              The Character Frequency Counter is a powerful text analysis tool that examines how often each character 
              appears in your text. It provides detailed statistics, percentages, and visual bars to help you 
              understand character distribution patterns. This tool is essential for cryptography analysis, linguistic 
              studies, data science, and anyone interested in understanding the composition of text.
            </p>

            <p className="mb-4">
              Character frequency analysis has many applications, from breaking simple substitution ciphers to 
              optimizing data compression algorithms. By understanding which characters appear most frequently, 
              you can gain insights into language patterns, coding efficiency, and text characteristics.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Key Features</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800">1. Detailed Character Counting</h4>
                <p>Counts every character in your text and displays the exact number of occurrences for each unique 
                character. The tool handles all types of characters including letters, digits, punctuation, and 
                special symbols.</p>
                <div className="bg-blue-50 p-3 rounded mt-2">
                  <p className="text-sm"><strong>Benefit:</strong> Get precise counts for every character, making it easy to identify the most and least common characters in your text.</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">2. Percentage Calculation</h4>
                <p>Automatically calculates what percentage each character represents of the total analyzed characters. 
                This normalized view makes it easy to compare frequency across texts of different lengths.</p>
                <div className="bg-blue-50 p-3 rounded mt-2">
                  <p className="text-sm"><strong>Use case:</strong> Compare character distribution across different languages, writing styles, or documents regardless of their length.</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">3. Visual Frequency Bars</h4>
                <p>Each character gets a visual bar showing its relative frequency compared to other characters. 
                Longer bars indicate more frequent characters, making patterns instantly visible.</p>
                <div className="bg-blue-50 p-3 rounded mt-2">
                  <p className="text-sm"><strong>Benefit:</strong> Quickly identify the most common characters at a glance without reading through numbers.</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">4. Case Sensitivity Options</h4>
                <p>Choose whether uppercase and lowercase letters should be counted separately or combined. Case 
                sensitive mode treats "A" and "a" as different characters, while case insensitive combines them.</p>
                <div className="bg-blue-50 p-3 rounded mt-2">
                  <p className="text-sm"><strong>Use case:</strong> Enable for cryptography analysis (case matters), disable for general linguistic analysis (focus on letter frequency regardless of case).</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">5. Flexible Filtering</h4>
                <p>Control what gets counted with options to include or exclude spaces and special characters. This 
                lets you focus on just the characters that matter for your analysis.</p>
                <div className="bg-blue-50 p-3 rounded mt-2">
                  <p className="text-sm"><strong>Example:</strong> Exclude spaces and special characters to analyze only letter and digit frequency in mixed content.</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">6. Multiple Sorting Options</h4>
                <p>Sort results by frequency (highest or lowest first) or alphabetically. This flexibility helps you 
                find patterns, identify outliers, or present data in the most useful order.</p>
                <div className="bg-blue-50 p-3 rounded mt-2">
                  <p className="text-sm"><strong>Tip:</strong> Sort by frequency descending to see most common characters first, or alphabetically to find specific characters quickly.</p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Character Statistics Explained</h3>
            
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm"><strong>Total Characters:</strong> The complete count of all characters in your text, including letters, numbers, spaces, and special characters.</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm"><strong>Unique Characters:</strong> How many different characters appear in your text. If you have "aaa", that's 3 total characters but only 1 unique character.</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm"><strong>Letters:</strong> Count of alphabetic characters only (A-Z, a-z). Useful for analyzing text content without counting numbers or symbols.</p>
              </div>

              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm"><strong>Digits:</strong> Count of numeric characters (0-9). Helps identify how many numbers are present in mixed content.</p>
              </div>

              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm"><strong>Spaces:</strong> Count of space characters. High space count relative to total characters indicates well-spaced readable text.</p>
              </div>

              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm"><strong>Special Characters:</strong> All characters that aren't letters, digits, or spaces - includes punctuation, symbols, and special Unicode characters.</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Common Use Cases</h3>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">🔐 Cryptography</h4>
                <ul className="text-sm space-y-1">
                  <li>• Breaking substitution ciphers</li>
                  <li>• Analyzing encrypted messages</li>
                  <li>• Identifying cipher patterns</li>
                  <li>• Frequency analysis attacks</li>
                  <li>• Studying encryption strength</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">📚 Linguistics</h4>
                <ul className="text-sm space-y-1">
                  <li>• Language pattern analysis</li>
                  <li>• Studying letter frequency</li>
                  <li>• Comparing text styles</li>
                  <li>• Analyzing authorship</li>
                  <li>• Research character usage</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">💻 Data Science</h4>
                <ul className="text-sm space-y-1">
                  <li>• Text data exploration</li>
                  <li>• Feature engineering</li>
                  <li>• Data profiling</li>
                  <li>• Anomaly detection</li>
                  <li>• Pattern recognition</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">📝 Content Analysis</h4>
                <ul className="text-sm space-y-1">
                  <li>• Writing style analysis</li>
                  <li>• Readability studies</li>
                  <li>• Content optimization</li>
                  <li>• SEO keyword density</li>
                  <li>• Text complexity metrics</li>
                </ul>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">🎓 Education</h4>
                <ul className="text-sm space-y-1">
                  <li>• Teaching statistics concepts</li>
                  <li>• Language learning tools</li>
                  <li>• Cryptography education</li>
                  <li>• Data analysis training</li>
                  <li>• Probability demonstrations</li>
                </ul>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">⚙️ Development</h4>
                <ul className="text-sm space-y-1">
                  <li>• Compression algorithm design</li>
                  <li>• Encoding optimization</li>
                  <li>• Text processing efficiency</li>
                  <li>• Data structure selection</li>
                  <li>• Performance optimization</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">English Letter Frequency</h3>
            
            <p className="mb-4">
              For reference, here are the approximate frequencies of letters in typical English text (case insensitive):
            </p>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                <div><strong>Most common:</strong> E (12.7%), T (9.1%), A (8.2%), O (7.5%), I (7.0%)</div>
                <div><strong>Common:</strong> N (6.7%), S (6.3%), H (6.1%), R (6.0%), D (4.3%)</div>
                <div><strong>Less common:</strong> L (4.0%), C (2.8%), U (2.8%), M (2.4%), W (2.4%)</div>
                <div><strong>Rare:</strong> F (2.2%), G (2.0%), Y (2.0%), P (1.9%), B (1.5%)</div>
                <div><strong>Very rare:</strong> V (1.0%), K (0.8%), J (0.2%), X (0.2%), Q (0.1%), Z (0.1%)</div>
              </div>
            </div>

            <p className="mb-4">
              These frequencies are useful for cryptography, language learning, and comparing your text against 
              typical English patterns.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Best Practices</h3>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">✅ For Accurate Analysis</h4>
              <ul className="space-y-2">
                <li>• <strong>Use sufficient text:</strong> Larger text samples give more accurate frequency patterns</li>
                <li>• <strong>Choose appropriate options:</strong> Case sensitivity matters for cipher analysis, not for general patterns</li>
                <li>• <strong>Consider context:</strong> Technical text has different patterns than prose</li>
                <li>• <strong>Filter appropriately:</strong> Exclude what doesn't matter for your analysis</li>
                <li>• <strong>Compare apples to apples:</strong> Use same settings when comparing different texts</li>
              </ul>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">✅ Interpreting Results</h4>
              <ul className="space-y-2">
                <li>• <strong>Look for patterns:</strong> Unusually high or low frequencies can indicate specific characteristics</li>
                <li>• <strong>Compare to benchmarks:</strong> Check against known letter frequencies for your language</li>
                <li>• <strong>Consider text type:</strong> Code has different patterns than natural language</li>
                <li>• <strong>Check unique count:</strong> Low unique character count might indicate repetitive or encoded text</li>
                <li>• <strong>Use percentages:</strong> They normalize for text length, making comparisons meaningful</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Pro Tips</h3>
            
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>💡 Tip 1:</strong> For cipher breaking, enable case sensitivity and include all characters - any character could be part of the cipher.</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>💡 Tip 2:</strong> Disable case sensitivity for general language analysis to focus on letter usage patterns regardless of capitalization.</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>💡 Tip 3:</strong> Sort by frequency descending to quickly identify the most overused characters in your text.</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>💡 Tip 4:</strong> Exclude spaces and special characters when analyzing pure letter frequency for linguistic studies.</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>💡 Tip 5:</strong> Compare your text's frequency to standard English frequency to detect unusual patterns or non-English text.</p>
              </div>

              <div className="bg-gray-50 p-3 rounded">
                <p><strong>💡 Tip 6:</strong> Use alphabetical sorting to quickly check if specific characters appear in your text and how often.</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Privacy and Security</h3>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
              <p className="mb-2">
                <strong>🔒 Your text is completely private:</strong> All character frequency analysis happens entirely 
                in your browser using JavaScript. Your text is never sent to any server or stored anywhere. This 
                ensures complete privacy for sensitive documents, encrypted messages, or confidential content.
              </p>
              <p>
                You can safely analyze classified text, personal messages, encrypted data, or any sensitive content 
                without any security concerns. The tool works offline once the page loads.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Frequently Asked Questions</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Q: Why is character frequency analysis useful for cryptography?</h4>
                <p>In many simple ciphers (like substitution ciphers), the frequency of encrypted characters matches the frequency of the original letters. By comparing the cipher text frequency to known language frequencies, cryptographers can make educated guesses about which encrypted character represents which letter, helping to break the cipher.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Q: Should I enable or disable case sensitivity?</h4>
                <p>Enable case sensitivity when case matters for your analysis (cryptography, programming, precise text analysis). Disable it when you want to analyze general letter frequency regardless of capitalization (linguistic studies, comparing writing styles, general language patterns).</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Q: What's the difference between total and unique characters?</h4>
                <p>Total characters is every character in your text counted individually. Unique characters is how many different characters appear at least once. For "hello", total = 5 characters, unique = 4 characters (h, e, l, o), because 'l' appears twice but only counts as one unique character.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Q: How much text do I need for accurate frequency analysis?</h4>
                <p>More text gives more accurate results. For casual analysis, 100+ characters is fine. For linguistic or cryptographic analysis, 500-1000+ characters gives much more reliable patterns. Professional frequency analysis often uses thousands or millions of characters for statistical significance.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Q: Why don't my frequencies match standard English frequencies?</h4>
                <p>Your text might be too short (small samples have more variation), be technical/specialized content (code, legal text), be in a different language, or have unusual characteristics. English frequency charts represent averages across large amounts of typical English prose.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Q: Can I analyze text in languages other than English?</h4>
                <p>Yes! The tool works with any language and character set, including Unicode characters. However, the expected frequency patterns will be different for each language. French, Spanish, German, etc. all have their own characteristic letter frequencies.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
