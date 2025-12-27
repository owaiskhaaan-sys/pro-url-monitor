import { useState } from 'react';
import Layout from '../../components/Layout';

export default function JSONBeautifierValidator() {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [mode, setMode] = useState('beautify'); // beautify or validate
  const [indentSize, setIndentSize] = useState(2);
  const [validationResult, setValidationResult] = useState(null);
  const [statistics, setStatistics] = useState(null);

  const exampleJSON = `{"name":"John Doe","age":30,"email":"john.doe@example.com","address":{"street":"123 Main St","city":"New York","state":"NY","zipCode":"10001","country":"USA"},"phoneNumbers":[{"type":"home","number":"555-1234"},{"type":"work","number":"555-5678"}],"employment":{"company":"Tech Corp","position":"Senior Developer","salary":95000,"startDate":"2020-01-15","skills":["JavaScript","React","Node.js","MongoDB","Docker"],"projects":[{"name":"E-commerce Platform","status":"completed","duration":"6 months"},{"name":"Mobile App","status":"in-progress","duration":"3 months"}]},"preferences":{"theme":"dark","notifications":true,"language":"en","timezone":"America/New_York"},"metadata":{"createdAt":"2024-01-01T00:00:00Z","updatedAt":"2024-12-28T00:00:00Z","version":"2.1.0","isActive":true}}`;

  const beautifyJSON = (json, indent) => {
    try {
      const parsed = JSON.parse(json);
      return JSON.stringify(parsed, null, indent);
    } catch (error) {
      throw error;
    }
  };

  const minifyJSON = (json) => {
    try {
      const parsed = JSON.parse(json);
      return JSON.stringify(parsed);
    } catch (error) {
      throw error;
    }
  };

  const validateJSON = (json) => {
    try {
      JSON.parse(json);
      return {
        valid: true,
        message: 'Valid JSON! ✓',
        error: null
      };
    } catch (error) {
      return {
        valid: false,
        message: 'Invalid JSON',
        error: error.message
      };
    }
  };

  const countKeys = (obj, count = 0) => {
    for (let key in obj) {
      count++;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        count = countKeys(obj[key], count);
      }
    }
    return count;
  };

  const calculateDepth = (obj) => {
    if (typeof obj !== 'object' || obj === null) return 0;
    let maxDepth = 0;
    for (let key in obj) {
      maxDepth = Math.max(maxDepth, calculateDepth(obj[key]));
    }
    return maxDepth + 1;
  };

  const processCode = () => {
    if (!inputCode.trim()) {
      alert('Please enter JSON code');
      return;
    }

    try {
      if (mode === 'beautify') {
        const beautified = beautifyJSON(inputCode, indentSize);
        setOutputCode(beautified);
        
        const parsed = JSON.parse(inputCode);
        const keys = countKeys(parsed);
        const depth = calculateDepth(parsed);
        
        setStatistics({
          originalSize: new Blob([inputCode]).size,
          processedSize: new Blob([beautified]).size,
          keys: keys,
          depth: depth,
          originalLines: inputCode.split('\n').length,
          processedLines: beautified.split('\n').length
        });
        setValidationResult({ valid: true, message: 'Valid JSON! ✓', error: null });
      } else if (mode === 'minify') {
        const minified = minifyJSON(inputCode);
        setOutputCode(minified);
        
        const parsed = JSON.parse(inputCode);
        const keys = countKeys(parsed);
        
        const reduction = ((1 - minified.length / inputCode.length) * 100).toFixed(2);
        
        setStatistics({
          originalSize: new Blob([inputCode]).size,
          processedSize: new Blob([minified]).size,
          keys: keys,
          reduction: reduction,
          originalLines: inputCode.split('\n').length,
          processedLines: 1
        });
        setValidationResult({ valid: true, message: 'Valid JSON! ✓', error: null });
      } else {
        // validate mode
        const result = validateJSON(inputCode);
        setValidationResult(result);
        
        if (result.valid) {
          const parsed = JSON.parse(inputCode);
          const keys = countKeys(parsed);
          const depth = calculateDepth(parsed);
          
          setStatistics({
            size: new Blob([inputCode]).size,
            keys: keys,
            depth: depth,
            lines: inputCode.split('\n').length
          });
        } else {
          setStatistics(null);
        }
        setOutputCode('');
      }
    } catch (error) {
      setValidationResult({
        valid: false,
        message: 'Invalid JSON',
        error: error.message
      });
      setOutputCode('');
      setStatistics(null);
    }
  };

  const copyToClipboard = async () => {
    if (!outputCode) {
      alert('No output to copy');
      return;
    }
    try {
      await navigator.clipboard.writeText(outputCode);
      alert('Copied to clipboard!');
    } catch (err) {
      alert('Failed to copy');
    }
  };

  const downloadFile = () => {
    if (!outputCode) {
      alert('No output to download');
      return;
    }
    const blob = new Blob([outputCode], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'beautify' ? 'beautified.json' : 'minified.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadExample = () => {
    setInputCode(exampleJSON);
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Layout
      title="JSON Beautifier & Validator - Format, Minify & Validate JSON Online"
      description="Free online JSON beautifier, minifier, and validator. Format JSON with proper indentation, minify for production, validate syntax, and identify errors instantly."
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              JSON Beautifier & Validator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Format, minify, and validate JSON data instantly. Perfect for developers working with APIs, configuration files, and data structures.
            </p>
          </div>

          {/* Tool Interface */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            {/* Mode Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Mode
              </label>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setMode('beautify')}
                  className={`px-6 py-3 rounded-lg font-medium transition ${
                    mode === 'beautify'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Beautify
                </button>
                <button
                  onClick={() => setMode('minify')}
                  className={`px-6 py-3 rounded-lg font-medium transition ${
                    mode === 'minify'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Minify
                </button>
                <button
                  onClick={() => setMode('validate')}
                  className={`px-6 py-3 rounded-lg font-medium transition ${
                    mode === 'validate'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Validate Only
                </button>
              </div>
            </div>

            {/* Indent Size (only for beautify mode) */}
            {mode === 'beautify' && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Indent Size
                </label>
                <div className="flex gap-3">
                  {[2, 4, 8].map((size) => (
                    <button
                      key={size}
                      onClick={() => setIndentSize(size)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        indentSize === size
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {size} spaces
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Input JSON
                </label>
                <button
                  onClick={loadExample}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Load Example
                </button>
              </div>
              <textarea
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder='Enter your JSON here... e.g., {"name": "John", "age": 30}'
                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                style={{ tabSize: indentSize }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={processCode}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-lg"
              >
                {mode === 'beautify' ? 'Beautify JSON' : mode === 'minify' ? 'Minify JSON' : 'Validate JSON'}
              </button>
              <button
                onClick={() => {
                  setInputCode('');
                  setOutputCode('');
                  setValidationResult(null);
                  setStatistics(null);
                }}
                className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Clear
              </button>
            </div>

            {/* Validation Result */}
            {validationResult && (
              <div className={`mb-6 p-4 rounded-lg ${
                validationResult.valid 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className={`font-semibold mb-2 ${
                  validationResult.valid ? 'text-green-800' : 'text-red-800'
                }`}>
                  {validationResult.message}
                </div>
                {validationResult.error && (
                  <div className="text-sm text-red-700 font-mono">
                    {validationResult.error}
                  </div>
                )}
              </div>
            )}

            {/* Statistics */}
            {statistics && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3">Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {mode === 'validate' ? (
                    <>
                      <div>
                        <div className="text-sm text-gray-600">File Size</div>
                        <div className="font-semibold text-gray-900">{formatBytes(statistics.size)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Total Keys</div>
                        <div className="font-semibold text-gray-900">{statistics.keys}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Nesting Depth</div>
                        <div className="font-semibold text-gray-900">{statistics.depth}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Lines</div>
                        <div className="font-semibold text-gray-900">{statistics.lines}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <div className="text-sm text-gray-600">Original Size</div>
                        <div className="font-semibold text-gray-900">{formatBytes(statistics.originalSize)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Processed Size</div>
                        <div className="font-semibold text-gray-900">{formatBytes(statistics.processedSize)}</div>
                      </div>
                      {statistics.keys && (
                        <div>
                          <div className="text-sm text-gray-600">Total Keys</div>
                          <div className="font-semibold text-gray-900">{statistics.keys}</div>
                        </div>
                      )}
                      {statistics.depth && (
                        <div>
                          <div className="text-sm text-gray-600">Nesting Depth</div>
                          <div className="font-semibold text-gray-900">{statistics.depth}</div>
                        </div>
                      )}
                      {statistics.reduction && (
                        <div>
                          <div className="text-sm text-gray-600">Size Reduction</div>
                          <div className="font-semibold text-green-600">{statistics.reduction}%</div>
                        </div>
                      )}
                      <div>
                        <div className="text-sm text-gray-600">Lines (Before → After)</div>
                        <div className="font-semibold text-gray-900">
                          {statistics.originalLines} → {statistics.processedLines}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Output */}
            {outputCode && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Output
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Copy
                    </button>
                    <button
                      onClick={downloadFile}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Download
                    </button>
                  </div>
                </div>
                <textarea
                  value={outputCode}
                  readOnly
                  className="w-full h-64 p-4 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                  style={{ tabSize: indentSize }}
                />
              </div>
            )}
          </div>

          {/* Information Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              About JSON Beautifier & Validator
            </h2>
            
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">
                JSON (JavaScript Object Notation) is the most widely used data interchange format in modern web development. 
                Our JSON Beautifier & Validator helps developers work with JSON data more efficiently by providing three 
                essential functions: beautification, minification, and validation.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Key Features
              </h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span><strong>Beautify JSON:</strong> Format JSON with proper indentation (2, 4, or 8 spaces) for better readability</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span><strong>Minify JSON:</strong> Remove all whitespace to reduce file size by 30-50%</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span><strong>Validate Syntax:</strong> Check for JSON syntax errors with detailed error messages</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span><strong>Statistics Display:</strong> View file size, key count, nesting depth, and size reduction</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span><strong>Export Options:</strong> Copy to clipboard or download as .json file</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span><strong>Instant Processing:</strong> Client-side processing for privacy and speed</span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                When to Use Each Mode
              </h3>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-blue-900 mb-2">Beautify Mode</h4>
                <p className="text-blue-800 mb-2">
                  Use beautify mode when you need to read or edit JSON data. This mode formats JSON with proper 
                  indentation, making nested structures easy to understand.
                </p>
                <p className="text-blue-800 text-sm">
                  <strong>Best for:</strong> API response debugging, configuration file editing, code reviews, documentation
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-green-900 mb-2">Minify Mode</h4>
                <p className="text-green-800 mb-2">
                  Use minify mode to reduce file size for production. This removes all unnecessary whitespace and 
                  line breaks, optimizing the JSON for transmission and storage.
                </p>
                <p className="text-green-800 text-sm">
                  <strong>Best for:</strong> API responses, data transmission, reducing bandwidth, storage optimization
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-purple-900 mb-2">Validate Mode</h4>
                <p className="text-purple-800 mb-2">
                  Use validate mode to check if your JSON is syntactically correct. This mode identifies errors like 
                  missing commas, unclosed brackets, or invalid characters.
                </p>
                <p className="text-purple-800 text-sm">
                  <strong>Best for:</strong> Error debugging, syntax checking, pre-deployment validation, testing
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Common JSON Errors
              </h3>
              <ul className="space-y-2 mb-6">
                <li><strong>Trailing Commas:</strong> JSON doesn't allow commas after the last item in arrays or objects</li>
                <li><strong>Single Quotes:</strong> JSON requires double quotes for strings, single quotes are invalid</li>
                <li><strong>Unquoted Keys:</strong> All object keys must be wrapped in double quotes</li>
                <li><strong>Missing Brackets:</strong> Every opening bracket must have a corresponding closing bracket</li>
                <li><strong>Invalid Characters:</strong> Special characters must be properly escaped</li>
                <li><strong>Comments:</strong> JSON doesn't support comments (unlike JavaScript)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Best Practices for JSON
              </h3>
              <ul className="space-y-2 mb-6">
                <li>Use consistent indentation (2 or 4 spaces) for readability</li>
                <li>Minify JSON for production to reduce bandwidth usage</li>
                <li>Validate JSON before deployment to catch syntax errors</li>
                <li>Use meaningful key names that describe the data</li>
                <li>Keep nesting depth reasonable (3-4 levels maximum)</li>
                <li>Use arrays for lists of similar items</li>
                <li>Avoid storing functions or undefined values</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Use Cases
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">API Development</h4>
                  <p className="text-sm">
                    Format API responses for debugging and minify for production deployment
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Configuration Files</h4>
                  <p className="text-sm">
                    Beautify config files for easy editing and validate before use
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Data Processing</h4>
                  <p className="text-sm">
                    Clean and validate JSON data from external sources
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Testing</h4>
                  <p className="text-sm">
                    Create and validate test data for unit and integration tests
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Frequently Asked Questions
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What's the difference between JSON and JavaScript objects?</h4>
                  <p>
                    While JSON syntax is similar to JavaScript object notation, JSON is more strict. All keys must be 
                    in double quotes, values can only be strings, numbers, booleans, arrays, objects, or null (no functions 
                    or undefined), and comments are not allowed.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Does beautifying JSON change the data?</h4>
                  <p>
                    No, beautifying only adds whitespace and line breaks for readability. The data structure and values 
                    remain exactly the same. Similarly, minifying removes whitespace but preserves all data.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Is my JSON data secure when using this tool?</h4>
                  <p>
                    Yes, all processing happens entirely in your browser. Your JSON data is never sent to any server, 
                    ensuring complete privacy and security.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What's the maximum JSON file size I can process?</h4>
                  <p>
                    Since processing happens in your browser, the limit depends on your device's memory. Most browsers 
                    can handle JSON files up to several megabytes without issues.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Can I use this for JSON arrays?</h4>
                  <p>
                    Absolutely! This tool works with both JSON objects and JSON arrays. It will properly format and 
                    validate any valid JSON structure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
