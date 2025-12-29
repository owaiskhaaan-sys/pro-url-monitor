import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false, u: false });
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');
  const [explanation, setExplanation] = useState('');

  const examplePatterns = {
    email: {
      pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
      test: 'Contact us at support@example.com or sales@company.org for more information.',
      description: 'Email Address Validation'
    },
    url: {
      pattern: 'https?:\\/\\/[^\\s]+',
      test: 'Visit https://www.example.com or http://test.org for details.',
      description: 'URL Pattern'
    },
    phone: {
      pattern: '\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}',
      test: 'Call (123) 456-7890 or 555-123-4567 or 800.555.1234',
      description: 'US Phone Number'
    },
    date: {
      pattern: '\\d{4}-\\d{2}-\\d{2}',
      test: 'Important dates: 2024-01-15, 2024-12-25, and 2025-06-30',
      description: 'ISO Date Format (YYYY-MM-DD)'
    },
    ipv4: {
      pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b',
      test: 'Server IPs: 192.168.1.1, 10.0.0.1, and 172.16.0.1',
      description: 'IPv4 Address'
    },
    hexColor: {
      pattern: '#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}',
      test: 'Colors: #FF5733, #00F, #123456, and #ABC',
      description: 'Hex Color Code'
    }
  };

  const explainPattern = (regex) => {
    const explanations = [];
    
    if (regex.includes('[a-zA-Z]')) explanations.push('Matches any letter (uppercase or lowercase)');
    if (regex.includes('[0-9]') || regex.includes('\\d')) explanations.push('Matches any digit (0-9)');
    if (regex.includes('^')) explanations.push('^ = Matches the start of the string');
    if (regex.includes('$')) explanations.push('$ = Matches the end of the string');
    if (regex.includes('+')) explanations.push('+ = Matches one or more of the preceding element');
    if (regex.includes('*')) explanations.push('* = Matches zero or more of the preceding element');
    if (regex.includes('?')) explanations.push('? = Matches zero or one of the preceding element');
    if (regex.includes('\\s')) explanations.push('\\s = Matches any whitespace character');
    if (regex.includes('\\w')) explanations.push('\\w = Matches any word character (letter, digit, underscore)');
    if (regex.includes('.')) explanations.push('. = Matches any character except newline');
    if (regex.includes('|')) explanations.push('| = OR operator (matches either pattern)');
    if (regex.includes('{')) explanations.push('{n,m} = Matches between n and m repetitions');
    if (regex.includes('(')) explanations.push('() = Capturing group');
    if (regex.includes('[')) explanations.push('[] = Character class (matches any character inside)');
    if (regex.includes('\\b')) explanations.push('\\b = Word boundary');
    
    return explanations.length > 0 ? explanations.join('\n') : 'Enter a pattern to see explanation';
  };

  const testRegex = () => {
    if (!pattern) {
      setError('Please enter a regex pattern');
      setMatches([]);
      return;
    }

    if (!testString) {
      setError('Please enter a test string');
      setMatches([]);
      return;
    }

    try {
      const flagStr = Object.keys(flags).filter(f => flags[f]).join('');
      const regex = new RegExp(pattern, flagStr);
      
      setError('');
      
      if (flags.g) {
        // Global flag - find all matches
        const allMatches = [];
        let match;
        while ((match = regex.exec(testString)) !== null) {
          allMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          // Prevent infinite loop on zero-width matches
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
        setMatches(allMatches);
      } else {
        // Non-global - find first match only
        const match = regex.exec(testString);
        if (match) {
          setMatches([{
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          }]);
        } else {
          setMatches([]);
        }
      }
      
      setExplanation(explainPattern(pattern));
    } catch (err) {
      setError('Invalid regex pattern: ' + err.message);
      setMatches([]);
      setExplanation('');
    }
  };

  const loadExample = (exampleKey) => {
    const example = examplePatterns[exampleKey];
    setPattern(example.pattern);
    setTestString(example.test);
    setFlags({ g: true, i: false, m: false, s: false, u: false });
  };

  const highlightMatches = () => {
    if (matches.length === 0) return testString;
    
    let highlighted = testString;
    let offset = 0;
    
    matches.forEach((match) => {
      const start = match.index + offset;
      const end = start + match.match.length;
      const before = highlighted.slice(0, start);
      const matchText = highlighted.slice(start, end);
      const after = highlighted.slice(end);
      
      highlighted = before + `<mark class="highlight">${matchText}</mark>` + after;
      offset += '<mark class="highlight">'.length + '</mark>'.length;
    });
    
    return highlighted;
  };

  const copyPattern = async () => {
    if (!pattern) {
      alert('No pattern to copy');
      return;
    }
    try {
      const flagStr = Object.keys(flags).filter(f => flags[f]).join('');
      const regexString = `/${pattern}/${flagStr}`;
      await navigator.clipboard.writeText(regexString);
      alert('Regex pattern copied!');
    } catch (err) {
      alert('Failed to copy');
    }
  };

  return (
    <Layout
      title="Regex Tester - Test Regular Expressions Online"
      description="Free online regex tester and debugger. Test regular expressions with real-time highlighting, match details, and pattern explanations. Supports JavaScript regex syntax."
    >
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Regex Tester
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Test and debug regular expressions with real-time highlighting. Perfect for developers working with pattern matching and text processing.
            </p>
          </div>

          {/* Tool Interface */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            {/* Pattern Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Regular Expression Pattern
              </label>
              <div className="flex gap-2">
                <span className="text-2xl text-gray-600 self-center">/</span>
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="Enter your regex pattern... e.g., \d{3}-\d{3}-\d{4}"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-base"
                />
                <span className="text-2xl text-gray-600 self-center">/</span>
              </div>
            </div>

            {/* Flags */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Flags
              </label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={flags.g}
                    onChange={(e) => setFlags({...flags, g: e.target.checked})}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm">
                    <span className="font-mono font-semibold">g</span> - Global (find all matches)
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={flags.i}
                    onChange={(e) => setFlags({...flags, i: e.target.checked})}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm">
                    <span className="font-mono font-semibold">i</span> - Case insensitive
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={flags.m}
                    onChange={(e) => setFlags({...flags, m: e.target.checked})}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm">
                    <span className="font-mono font-semibold">m</span> - Multiline
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={flags.s}
                    onChange={(e) => setFlags({...flags, s: e.target.checked})}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm">
                    <span className="font-mono font-semibold">s</span> - Dot matches newline
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={flags.u}
                    onChange={(e) => setFlags({...flags, u: e.target.checked})}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm">
                    <span className="font-mono font-semibold">u</span> - Unicode
                  </span>
                </label>
              </div>
            </div>

            {/* Test String */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Test String
              </label>
              <textarea
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                placeholder="Enter text to test against your regex pattern..."
                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm"
              />
            </div>

            {/* Example Patterns */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Load Example Pattern
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(examplePatterns).map(([key, example]) => (
                  <button
                    key={key}
                    onClick={() => loadExample(key)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                  >
                    {example.description}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={testRegex}
                className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium shadow-lg"
              >
                Test Regex
              </button>
              <button
                onClick={copyPattern}
                className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
              >
                Copy Pattern
              </button>
              <button
                onClick={() => {
                  setPattern('');
                  setTestString('');
                  setMatches([]);
                  setError('');
                  setExplanation('');
                }}
                className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Clear All
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="font-semibold text-red-800 mb-1">Error</div>
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            {/* Results */}
            {!error && matches.length > 0 && (
              <div className="space-y-6">
                {/* Match Summary */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="font-semibold text-green-800 mb-1">
                    {matches.length} Match{matches.length !== 1 ? 'es' : ''} Found
                  </div>
                  <div className="text-sm text-green-700">
                    Pattern successfully matched in the test string
                  </div>
                </div>

                {/* Highlighted Text */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Highlighted Matches
                  </label>
                  <div 
                    className="p-4 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: highlightMatches() }}
                  />
                </div>

                {/* Match Details */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Match Details
                  </label>
                  <div className="space-y-3">
                    {matches.map((match, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <div className="text-xs text-gray-600">Match #{index + 1}</div>
                            <div className="font-mono font-semibold text-gray-900">{match.match}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600">Position</div>
                            <div className="font-semibold text-gray-900">
                              Index {match.index} (Length: {match.match.length})
                            </div>
                          </div>
                          {match.groups.length > 0 && (
                            <div>
                              <div className="text-xs text-gray-600">Captured Groups</div>
                              <div className="font-mono text-sm text-gray-900">
                                {match.groups.map((group, i) => (
                                  <div key={i}>Group {i + 1}: {group || '(empty)'}</div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pattern Explanation */}
                {explanation && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Pattern Explanation
                    </label>
                    <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                      <div className="text-sm text-blue-900 whitespace-pre-line">{explanation}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* No Matches */}
            {!error && matches.length === 0 && pattern && testString && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="font-semibold text-yellow-800 mb-1">No Matches Found</div>
                <div className="text-sm text-yellow-700">
                  The pattern did not match any part of the test string
                </div>
              </div>
            )}
          </div>

          {/* Information Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              About Regex Tester
            </h2>
            
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">
                Regular expressions (regex) are powerful patterns used for matching text. Our Regex Tester helps you 
                test, debug, and understand regular expressions by showing real-time matches, explanations, and capturing groups.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Key Features
              </h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✓</span>
                  <span><strong>Real-Time Testing:</strong> See matches highlighted as you type</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✓</span>
                  <span><strong>All Flags Supported:</strong> Global, case-insensitive, multiline, dotall, unicode</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✓</span>
                  <span><strong>Match Details:</strong> View position, length, and captured groups</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✓</span>
                  <span><strong>Pattern Explanation:</strong> Understand what each part of your regex does</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✓</span>
                  <span><strong>Example Patterns:</strong> Load common regex patterns for emails, URLs, phone numbers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✓</span>
                  <span><strong>JavaScript Syntax:</strong> Uses JavaScript regex engine for accurate results</span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Common Regex Patterns
              </h3>
              
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border border-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Pattern</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Description</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Example</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono text-xs">\\d+</td>
                      <td className="border border-gray-200 px-4 py-2">One or more digits</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono text-xs">123, 4567</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono text-xs">\\w+</td>
                      <td className="border border-gray-200 px-4 py-2">One or more word characters</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono text-xs">hello, test_123</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono text-xs">\\s+</td>
                      <td className="border border-gray-200 px-4 py-2">One or more whitespace</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono text-xs">spaces, tabs</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono text-xs">^start</td>
                      <td className="border border-gray-200 px-4 py-2">Match at start of string</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono text-xs">start of line</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono text-xs">end$</td>
                      <td className="border border-gray-200 px-4 py-2">Match at end of string</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono text-xs">line end</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono text-xs">[abc]</td>
                      <td className="border border-gray-200 px-4 py-2">Match any of a, b, or c</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono text-xs">a, b, c</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono text-xs">[^abc]</td>
                      <td className="border border-gray-200 px-4 py-2">Match anything except a, b, c</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono text-xs">d, e, f</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono text-xs">a|b</td>
                      <td className="border border-gray-200 px-4 py-2">Match a OR b</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono text-xs">a, b</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Regex Quantifiers
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="font-mono font-semibold text-gray-900 mb-2">*</div>
                  <p className="text-sm">Zero or more times</p>
                  <p className="text-xs text-gray-600 mt-1">Example: <span className="font-mono">a*</span> matches "", "a", "aa"</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="font-mono font-semibold text-gray-900 mb-2">+</div>
                  <p className="text-sm">One or more times</p>
                  <p className="text-xs text-gray-600 mt-1">Example: <span className="font-mono">a+</span> matches "a", "aa", but not ""</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="font-mono font-semibold text-gray-900 mb-2">?</div>
                  <p className="text-sm">Zero or one time (optional)</p>
                  <p className="text-xs text-gray-600 mt-1">Example: <span className="font-mono">a?</span> matches "" or "a"</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="font-mono font-semibold text-gray-900 mb-2">{'{n}'}</div>
                  <p className="text-sm">Exactly n times</p>
                  <p className="text-xs text-gray-600 mt-1">Example: <span className="font-mono">a{'{3}'}</span> matches "aaa"</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="font-mono font-semibold text-gray-900 mb-2">{'{n,}'}</div>
                  <p className="text-sm">n or more times</p>
                  <p className="text-xs text-gray-600 mt-1">Example: <span className="font-mono">a{'{2,}'}</span> matches "aa", "aaa"</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="font-mono font-semibold text-gray-900 mb-2">{'{n,m}'}</div>
                  <p className="text-sm">Between n and m times</p>
                  <p className="text-xs text-gray-600 mt-1">Example: <span className="font-mono">a{'{2,4}'}</span> matches "aa", "aaa", "aaaa"</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Use Cases
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Form Validation</h4>
                  <p className="text-sm">
                    Validate email addresses, phone numbers, zip codes, and other user input
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Text Processing</h4>
                  <p className="text-sm">
                    Extract data, find and replace text, parse log files and documents
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Data Extraction</h4>
                  <p className="text-sm">
                    Pull specific information from text: URLs, dates, prices, identifiers
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Code Search</h4>
                  <p className="text-sm">
                    Find patterns in source code, identify function calls, variable names
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Regex Flags Explained
              </h3>
              <ul className="space-y-2 mb-6">
                <li><strong>g (global):</strong> Find all matches instead of stopping after the first match</li>
                <li><strong>i (case insensitive):</strong> Match both uppercase and lowercase letters</li>
                <li><strong>m (multiline):</strong> ^ and $ match start/end of each line, not just the string</li>
                <li><strong>s (dotall):</strong> Dot (.) matches newline characters too</li>
                <li><strong>u (unicode):</strong> Enable full unicode support for matching</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Frequently Asked Questions
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">How do I escape special characters?</h4>
                  <p>
                    Use a backslash before special characters: . ^ $ * + ? ( ) [ ] { '{'} { '}'} | \
                    Example: To match a literal dot, use <span className="font-mono">\\.</span>
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What are capturing groups?</h4>
                  <p>
                    Parentheses () create groups that capture matched text. Example: <span className="font-mono">(\d{'{3}'})-(\d{'{3}'})-(\d{'{4}'})</span> 
                    captures three separate groups from a phone number like 123-456-7890.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Why isn't my pattern matching?</h4>
                  <p>
                    Common issues: forgetting to escape special characters, incorrect quantifiers, wrong flags. 
                    Try testing with simpler patterns first and gradually add complexity.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Can I test regex for other languages?</h4>
                  <p>
                    This tool uses JavaScript regex syntax. Most regex features are similar across languages, but 
                    some advanced features may differ. Always test in your target language's environment.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">How do I match Unicode characters?</h4>
                  <p>
                    Enable the 'u' (unicode) flag and use Unicode property escapes like <span className="font-mono">\p{'{Letter}'}</span> 
                    or specific ranges. The unicode flag is required for emoji and many international characters.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .highlight {
          background-color: #fef3c7;
          color: #92400e;
          padding: 2px 4px;
          border-radius: 3px;
          font-weight: 600;
        }
      `}</style>
    </Layout>
  );
}
