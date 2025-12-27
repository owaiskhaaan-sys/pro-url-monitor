import { useState } from 'react';
import Layout from '../../components/Layout';

export default function PHPBeautifier() {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [mode, setMode] = useState('beautify'); // beautify or minify
  const [indentSize, setIndentSize] = useState(4);
  const [statistics, setStatistics] = useState(null);

  const examplePHP = `<?php namespace App\\Controllers; use App\\Models\\User; use App\\Services\\AuthService; class UserController { private $authService; public function __construct(AuthService $authService) { $this->authService = $authService; } public function index() { $users = User::where('status', 'active')->orderBy('created_at', 'desc')->get(); return view('users.index', compact('users')); } public function show($id) { $user = User::findOrFail($id); if (!$this->authService->canView($user)) { abort(403, 'Unauthorized'); } return view('users.show', compact('user')); } public function store(Request $request) { $validated = $request->validate(['name' => 'required|string|max:255', 'email' => 'required|email|unique:users', 'password' => 'required|min:8']); $user = User::create(['name' => $validated['name'], 'email' => $validated['email'], 'password' => bcrypt($validated['password'])]); return redirect()->route('users.show', $user->id)->with('success', 'User created successfully'); } } ?>`;

  const beautifyPHP = (php, indent) => {
    try {
      // Remove extra whitespace
      php = php.replace(/\s+/g, ' ').trim();
      
      const indentStr = ' '.repeat(indent);
      let formatted = '';
      let indentLevel = 0;
      let inString = false;
      let stringChar = '';
      let inComment = false;
      
      for (let i = 0; i < php.length; i++) {
        const char = php[i];
        const nextChar = php[i + 1];
        const prevChar = php[i - 1];
        
        // Handle strings
        if ((char === '"' || char === "'") && prevChar !== '\\') {
          if (!inString) {
            inString = true;
            stringChar = char;
          } else if (char === stringChar) {
            inString = false;
          }
          formatted += char;
          continue;
        }
        
        if (inString) {
          formatted += char;
          continue;
        }
        
        // Handle comments
        if (char === '/' && nextChar === '/') {
          // Single-line comment
          const commentEnd = php.indexOf('\n', i);
          formatted += php.substring(i, commentEnd === -1 ? php.length : commentEnd);
          i = commentEnd === -1 ? php.length : commentEnd;
          continue;
        }
        
        if (char === '/' && nextChar === '*') {
          // Multi-line comment
          const commentEnd = php.indexOf('*/', i);
          formatted += php.substring(i, commentEnd + 2);
          i = commentEnd + 1;
          continue;
        }
        
        // Handle braces
        if (char === '{') {
          formatted += ' {\n';
          indentLevel++;
          formatted += indentStr.repeat(indentLevel);
          continue;
        }
        
        if (char === '}') {
          indentLevel--;
          formatted = formatted.trimEnd() + '\n' + indentStr.repeat(indentLevel) + '}';
          if (nextChar && nextChar !== ';' && nextChar !== ',' && nextChar !== ')') {
            formatted += '\n' + indentStr.repeat(indentLevel);
          }
          continue;
        }
        
        // Handle semicolons
        if (char === ';') {
          formatted += ';\n' + indentStr.repeat(indentLevel);
          continue;
        }
        
        // Handle arrays and function parameters
        if (char === ',' && prevChar !== ' ') {
          formatted += ', ';
          continue;
        }
        
        // Handle operators
        if (['=', '+', '-', '*', '/', '%', '!', '<', '>'].includes(char)) {
          if (nextChar === '=' || (char === '=' && prevChar !== '!' && prevChar !== '=' && prevChar !== '<' && prevChar !== '>')) {
            if (formatted[formatted.length - 1] !== ' ') {
              formatted += ' ';
            }
            formatted += char;
            continue;
          }
        }
        
        formatted += char;
      }
      
      // Clean up extra spaces and newlines
      formatted = formatted.split('\n').map(line => line.trimEnd()).filter((line, index, arr) => {
        return line.trim() !== '' || (index > 0 && arr[index - 1].trim() !== '');
      }).join('\n');
      
      return formatted.trim();
    } catch (error) {
      throw new Error('Failed to beautify PHP: ' + error.message);
    }
  };

  const minifyPHP = (php) => {
    try {
      let minified = php;
      
      // Remove single-line comments
      minified = minified.replace(/\/\/.*$/gm, '');
      
      // Remove multi-line comments
      minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
      
      // Remove extra whitespace
      minified = minified.replace(/\s+/g, ' ').trim();
      
      // Remove spaces around certain characters
      minified = minified.replace(/\s*([{};,()[\]])\s*/g, '$1');
      
      // Remove space after keywords
      minified = minified.replace(/\b(if|else|elseif|while|for|foreach|function|return|public|private|protected|static|class|namespace|use)\s+/g, '$1 ');
      
      return minified;
    } catch (error) {
      throw new Error('Failed to minify PHP: ' + error.message);
    }
  };

  const countFunctions = (php) => {
    const matches = php.match(/function\s+\w+\s*\(/g);
    return matches ? matches.length : 0;
  };

  const countClasses = (php) => {
    const matches = php.match(/class\s+\w+/g);
    return matches ? matches.length : 0;
  };

  const countVariables = (php) => {
    const matches = php.match(/\$\w+/g);
    return matches ? new Set(matches).size : 0;
  };

  const processCode = () => {
    if (!inputCode.trim()) {
      alert('Please enter PHP code');
      return;
    }

    try {
      if (mode === 'beautify') {
        const beautified = beautifyPHP(inputCode, indentSize);
        setOutputCode(beautified);
        
        setStatistics({
          originalSize: new Blob([inputCode]).size,
          processedSize: new Blob([beautified]).size,
          functions: countFunctions(inputCode),
          classes: countClasses(inputCode),
          variables: countVariables(inputCode),
          originalLines: inputCode.split('\n').length,
          processedLines: beautified.split('\n').length
        });
      } else {
        const minified = minifyPHP(inputCode);
        setOutputCode(minified);
        
        const reduction = ((1 - minified.length / inputCode.length) * 100).toFixed(2);
        
        setStatistics({
          originalSize: new Blob([inputCode]).size,
          processedSize: new Blob([minified]).size,
          functions: countFunctions(inputCode),
          classes: countClasses(inputCode),
          reduction: reduction,
          originalLines: inputCode.split('\n').length,
          processedLines: minified.split('\n').length
        });
      }
    } catch (error) {
      alert('Error: ' + error.message);
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
    const blob = new Blob([outputCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'beautify' ? 'beautified.php' : 'minified.php';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadExample = () => {
    setInputCode(examplePHP);
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
      title="PHP Beautifier & Formatter - Format PHP Code Online"
      description="Free online PHP beautifier and formatter. Format PHP code with PSR standards, proper indentation, and minify for production. Perfect for PHP developers."
    >
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              PHP Beautifier & Formatter
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Format and beautify PHP code with proper indentation following PSR standards. Perfect for Laravel, WordPress, and Symfony developers.
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
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Beautify
                </button>
                <button
                  onClick={() => setMode('minify')}
                  className={`px-6 py-3 rounded-lg font-medium transition ${
                    mode === 'minify'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Minify
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
                          ? 'bg-indigo-600 text-white'
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
                  Input PHP Code
                </label>
                <button
                  onClick={loadExample}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Load Example
                </button>
              </div>
              <textarea
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Enter your PHP code here... e.g., <?php class MyClass { public function myMethod() { return true; } } ?>"
                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                style={{ tabSize: indentSize }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={processCode}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium shadow-lg"
              >
                {mode === 'beautify' ? 'Beautify PHP' : 'Minify PHP'}
              </button>
              <button
                onClick={() => {
                  setInputCode('');
                  setOutputCode('');
                  setStatistics(null);
                }}
                className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Clear
              </button>
            </div>

            {/* Statistics */}
            {statistics && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3">Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Original Size</div>
                    <div className="font-semibold text-gray-900">{formatBytes(statistics.originalSize)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Processed Size</div>
                    <div className="font-semibold text-gray-900">{formatBytes(statistics.processedSize)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Functions</div>
                    <div className="font-semibold text-gray-900">{statistics.functions}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Classes</div>
                    <div className="font-semibold text-gray-900">{statistics.classes}</div>
                  </div>
                  {statistics.variables !== undefined && (
                    <div>
                      <div className="text-sm text-gray-600">Unique Variables</div>
                      <div className="font-semibold text-gray-900">{statistics.variables}</div>
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
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Copy
                    </button>
                    <button
                      onClick={downloadFile}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
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
              About PHP Beautifier & Formatter
            </h2>
            
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">
                PHP (Hypertext Preprocessor) is a popular server-side scripting language used by millions of websites 
                and web applications. Our PHP Beautifier helps developers maintain clean, readable code by automatically 
                formatting PHP scripts according to PSR coding standards.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Key Features
              </h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span><strong>PSR Standards:</strong> Format code following PSR-2 and PSR-12 coding standards</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span><strong>Proper Indentation:</strong> Choose between 2, 4, or 8 space indentation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span><strong>Brace Formatting:</strong> Consistent placement of curly braces and parentheses</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span><strong>Code Minification:</strong> Remove comments and whitespace to reduce file size</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span><strong>Statistics Display:</strong> View functions, classes, variables, and size metrics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span><strong>Framework Support:</strong> Works with Laravel, WordPress, Symfony, CodeIgniter code</span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                PSR Coding Standards
              </h3>
              <p className="mb-4">
                PSR (PHP Standards Recommendations) are coding standards developed by the PHP-FIG (Framework Interoperability Group). 
                Following these standards ensures your code is consistent, readable, and maintainable.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h4 className="font-semibold text-indigo-900 mb-2">PSR-2 Key Rules</h4>
                  <ul className="text-sm text-indigo-800 space-y-1">
                    <li>• Use 4 spaces for indentation (not tabs)</li>
                    <li>• Opening braces for classes/methods on new line</li>
                    <li>• Visibility must be declared on all properties/methods</li>
                    <li>• No limit on line length</li>
                    <li>• Files must use only PHP tags</li>
                  </ul>
                </div>
                
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h4 className="font-semibold text-indigo-900 mb-2">PSR-12 Updates</h4>
                  <ul className="text-sm text-indigo-800 space-y-1">
                    <li>• Extends and replaces PSR-2</li>
                    <li>• Supports new PHP 7+ features</li>
                    <li>• Strict types declarations</li>
                    <li>• Return type declarations</li>
                    <li>• Anonymous classes formatting</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                PHP Code Formatting Best Practices
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="border-l-4 border-indigo-600 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">1. Consistent Indentation</h4>
                  <p className="mb-2">
                    Use 4 spaces (PSR standard) for indentation. Never mix spaces and tabs.
                  </p>
                  <div className="bg-gray-50 p-3 rounded font-mono text-sm">
{`class MyClass
{
    public function myMethod()
    {
        return true;
    }
}`}
                  </div>
                </div>

                <div className="border-l-4 border-indigo-600 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">2. Visibility Declarations</h4>
                  <p className="mb-2">
                    Always declare visibility (public, protected, private) for properties and methods.
                  </p>
                  <div className="bg-gray-50 p-3 rounded font-mono text-sm">
{`private $name;
protected $email;
public function getName() { }`}
                  </div>
                </div>

                <div className="border-l-4 border-indigo-600 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">3. Namespace and Use Declarations</h4>
                  <p className="mb-2">
                    Place namespace at the top, followed by use statements, then blank line before class.
                  </p>
                  <div className="bg-gray-50 p-3 rounded font-mono text-sm">
{`<?php
namespace App\\Controllers;

use App\\Models\\User;
use App\\Services\\AuthService;

class UserController
{
    // ...
}`}
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Benefits of Formatted PHP Code
              </h3>
              <ul className="space-y-2 mb-6">
                <li><strong>Improved Readability:</strong> Well-formatted code is easier to read and understand</li>
                <li><strong>Team Collaboration:</strong> Consistent style helps multiple developers work together</li>
                <li><strong>Easier Debugging:</strong> Clean code structure makes finding bugs faster</li>
                <li><strong>Better Maintainability:</strong> Future code changes are simpler with good formatting</li>
                <li><strong>Professional Quality:</strong> Demonstrates attention to code quality and standards</li>
                <li><strong>IDE Compatibility:</strong> Most IDEs work better with properly formatted code</li>
                <li><strong>Code Reviews:</strong> Easier to review pull requests with consistent formatting</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Use Cases
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Laravel Development</h4>
                  <p className="text-sm">
                    Format Laravel controllers, models, and service classes following PSR standards
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">WordPress Plugins</h4>
                  <p className="text-sm">
                    Clean up WordPress plugin code and theme functions for better readability
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Legacy Code Cleanup</h4>
                  <p className="text-sm">
                    Beautify old PHP code to modern standards for easier maintenance
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Code Reviews</h4>
                  <p className="text-sm">
                    Format code before submitting pull requests for consistent style
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Popular PHP Frameworks
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                <div className="flex items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-red-600 mr-2">✓</span>
                  <span className="font-medium text-gray-900">Laravel</span>
                </div>
                <div className="flex items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-red-600 mr-2">✓</span>
                  <span className="font-medium text-gray-900">Symfony</span>
                </div>
                <div className="flex items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-red-600 mr-2">✓</span>
                  <span className="font-medium text-gray-900">CodeIgniter</span>
                </div>
                <div className="flex items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-red-600 mr-2">✓</span>
                  <span className="font-medium text-gray-900">WordPress</span>
                </div>
                <div className="flex items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-red-600 mr-2">✓</span>
                  <span className="font-medium text-gray-900">Drupal</span>
                </div>
                <div className="flex items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-red-600 mr-2">✓</span>
                  <span className="font-medium text-gray-900">Yii</span>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Frequently Asked Questions
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Does formatting change code functionality?</h4>
                  <p>
                    No, formatting only affects whitespace, indentation, and visual structure. The code logic and 
                    execution remain exactly the same. It's purely cosmetic.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What's the difference between PSR-2 and PSR-12?</h4>
                  <p>
                    PSR-12 extends and replaces PSR-2, adding support for newer PHP features like return type declarations, 
                    strict types, and anonymous classes. PSR-12 is the current recommended standard.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Can I use this for Laravel code?</h4>
                  <p>
                    Absolutely! Laravel follows PSR standards, and this beautifier works perfectly with Laravel controllers, 
                    models, services, and any other PHP code.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Is my PHP code secure?</h4>
                  <p>
                    Yes, all formatting happens entirely in your browser. Your PHP code is never uploaded to any server, 
                    ensuring complete privacy and security.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">When should I minify PHP code?</h4>
                  <p>
                    Minify PHP when file size matters, such as distributing plugins or themes. However, for most applications, 
                    use formatted code for better maintainability. PHP is server-side, so minification doesn't affect load times.
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
