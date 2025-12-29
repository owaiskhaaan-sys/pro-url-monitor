import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function CodeSyntaxHighlighter() {
  const [inputCode, setInputCode] = useState('');
  const [highlightedCode, setHighlightedCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('dark');
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [statistics, setStatistics] = useState(null);

  const exampleCodes = {
    javascript: `function calculateFactorial(n) {
  if (n <= 1) return 1;
  return n * calculateFactorial(n - 1);
}

const result = calculateFactorial(5);
console.log('Factorial:', result);`,
    
    python: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

for i in range(10):
    print(f"Fibonacci({i}) = {fibonacci(i)}")`,
    
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Website</title>
</head>
<body>
    <h1>Hello World</h1>
    <p class="intro">Welcome to my website!</p>
</body>
</html>`,
    
    css: `.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
}`,
    
    sql: `SELECT u.user_id, u.username, COUNT(o.order_id) AS total_orders
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
WHERE u.status = 'active'
GROUP BY u.user_id, u.username
HAVING COUNT(o.order_id) > 5
ORDER BY total_orders DESC;`,
    
    json: `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York"
  },
  "hobbies": ["reading", "coding", "gaming"]
}`
  };

  const highlightSyntax = (code, lang) => {
    // Simple regex-based syntax highlighting
    let highlighted = code;
    
    // Escape HTML
    highlighted = highlighted
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    if (lang === 'javascript') {
      // Keywords
      highlighted = highlighted.replace(/\b(function|const|let|var|if|else|return|for|while|class|new|async|await|import|export|from|default)\b/g, '<span class="keyword">$1</span>');
      // Strings
      highlighted = highlighted.replace(/(['"`])(?:(?=(\\?))\2.)*?\1/g, '<span class="string">$&</span>');
      // Numbers
      highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="number">$1</span>');
      // Comments
      highlighted = highlighted.replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>');
      // Functions
      highlighted = highlighted.replace(/\b(\w+)(?=\()/g, '<span class="function">$1</span>');
    }
    
    else if (lang === 'python') {
      // Keywords
      highlighted = highlighted.replace(/\b(def|class|if|elif|else|for|while|return|import|from|as|try|except|finally|with|lambda|yield|pass|break|continue)\b/g, '<span class="keyword">$1</span>');
      // Strings
      highlighted = highlighted.replace(/(['"])(?:(?=(\\?))\2.)*?\1/g, '<span class="string">$&</span>');
      highlighted = highlighted.replace(/(f['"])(?:(?=(\\?))\2.)*?\1/g, '<span class="string">$&</span>');
      // Numbers
      highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="number">$1</span>');
      // Comments
      highlighted = highlighted.replace(/(#.*$)/gm, '<span class="comment">$1</span>');
      // Functions
      highlighted = highlighted.replace(/\b(\w+)(?=\()/g, '<span class="function">$1</span>');
    }
    
    else if (lang === 'html') {
      // Tags
      highlighted = highlighted.replace(/(&lt;\/?)([\w-]+)([^&]*?)(&gt;)/g, '<span class="tag">$1</span><span class="tag-name">$2</span><span class="attr">$3</span><span class="tag">$4</span>');
      // Attributes
      highlighted = highlighted.replace(/(\w+)(?==)/g, '<span class="attr-name">$1</span>');
      // Strings
      highlighted = highlighted.replace(/=(['"])([^'"]*)\1/g, '=<span class="string">$1$2$1</span>');
    }
    
    else if (lang === 'css') {
      // Selectors
      highlighted = highlighted.replace(/^([\w.-]+|[\w.-]+\s*[\w.-]*)\s*\{/gm, '<span class="selector">$1</span> {');
      // Properties
      highlighted = highlighted.replace(/(\w[\w-]*)\s*:/g, '<span class="property">$1</span>:');
      // Values
      highlighted = highlighted.replace(/:\s*([^;{}\n]+)/g, ': <span class="value">$1</span>');
      // Comments
      highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>');
    }
    
    else if (lang === 'sql') {
      // Keywords
      highlighted = highlighted.replace(/\b(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP BY|HAVING|ORDER BY|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TABLE|INDEX|AS|AND|OR|NOT|IN|EXISTS|LIKE|BETWEEN|NULL|COUNT|SUM|AVG|MAX|MIN)\b/gi, '<span class="keyword">$&</span>');
      // Strings
      highlighted = highlighted.replace(/(['"])(?:(?=(\\?))\2.)*?\1/g, '<span class="string">$&</span>');
      // Numbers
      highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="number">$1</span>');
      // Comments
      highlighted = highlighted.replace(/(--.*$)/gm, '<span class="comment">$1</span>');
    }
    
    else if (lang === 'json') {
      // Keys
      highlighted = highlighted.replace(/("[\w]+")(\s*:)/g, '<span class="json-key">$1</span>$2');
      // Strings (values)
      highlighted = highlighted.replace(/:\s*(".*?")/g, ': <span class="string">$1</span>');
      // Numbers
      highlighted = highlighted.replace(/:\s*(\d+)/g, ': <span class="number">$1</span>');
      // Booleans
      highlighted = highlighted.replace(/:\s*(true|false|null)/g, ': <span class="boolean">$1</span>');
    }
    
    return highlighted;
  };

  const processCode = () => {
    if (!inputCode.trim()) {
      alert('Please enter code');
      return;
    }

    const highlighted = highlightSyntax(inputCode, language);
    setHighlightedCode(highlighted);
    
    setStatistics({
      language: language.toUpperCase(),
      characters: inputCode.length,
      lines: inputCode.split('\n').length,
      words: inputCode.split(/\s+/).filter(w => w).length,
      size: new Blob([inputCode]).size
    });
  };

  const copyHTML = async () => {
    if (!highlightedCode) {
      alert('No highlighted code to copy');
      return;
    }
    
    const html = `<pre class="code-block ${theme}${showLineNumbers ? ' line-numbers' : ''}"><code>${highlightedCode}</code></pre>`;
    
    try {
      await navigator.clipboard.writeText(html);
      alert('HTML copied to clipboard!');
    } catch (err) {
      alert('Failed to copy');
    }
  };

  const copyCSS = async () => {
    const css = `.code-block {
  background: ${theme === 'dark' ? '#1e1e1e' : '#f5f5f5'};
  color: ${theme === 'dark' ? '#d4d4d4' : '#333'};
  padding: 20px;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  overflow-x: auto;
  line-height: 1.5;
}

.code-block .keyword { color: ${theme === 'dark' ? '#569cd6' : '#0000ff'}; font-weight: bold; }
.code-block .string { color: ${theme === 'dark' ? '#ce9178' : '#a31515'}; }
.code-block .number { color: ${theme === 'dark' ? '#b5cea8' : '#098658'}; }
.code-block .comment { color: ${theme === 'dark' ? '#6a9955' : '#008000'}; font-style: italic; }
.code-block .function { color: ${theme === 'dark' ? '#dcdcaa' : '#795e26'}; }
.code-block .tag { color: ${theme === 'dark' ? '#808080' : '#800000'}; }
.code-block .tag-name { color: ${theme === 'dark' ? '#569cd6' : '#800000'}; font-weight: bold; }
.code-block .attr-name { color: ${theme === 'dark' ? '#9cdcfe' : '#ff0000'}; }
.code-block .selector { color: ${theme === 'dark' ? '#d7ba7d' : '#800000'}; }
.code-block .property { color: ${theme === 'dark' ? '#9cdcfe' : '#ff0000'}; }
.code-block .value { color: ${theme === 'dark' ? '#ce9178' : '#0451a5'}; }
.code-block .json-key { color: ${theme === 'dark' ? '#9cdcfe' : '#0451a5'}; }
.code-block .boolean { color: ${theme === 'dark' ? '#569cd6' : '#0000ff'}; font-weight: bold; }`;
    
    try {
      await navigator.clipboard.writeText(css);
      alert('CSS copied to clipboard!');
    } catch (err) {
      alert('Failed to copy');
    }
  };

  const loadExample = () => {
    setInputCode(exampleCodes[language]);
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
      title="Code Syntax Highlighter - Add Syntax Highlighting to Code Blocks"
      description="Free online code syntax highlighter. Add beautiful syntax highlighting to your code snippets for blogs, documentation, and websites. Supports JavaScript, Python, HTML, CSS, SQL."
    >
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Code Syntax Highlighter
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Add beautiful syntax highlighting to your code snippets. Perfect for blogs, documentation, tutorials, and technical websites.
            </p>
          </div>

          {/* Tool Interface */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            {/* Language Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Programming Language
              </label>
              <div className="flex flex-wrap gap-2">
                {['javascript', 'python', 'html', 'css', 'sql', 'json'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      language === lang
                        ? 'bg-yellow-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Color Theme
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setTheme('dark')}
                  className={`px-6 py-2 rounded-lg font-medium transition ${
                    theme === 'dark'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Dark Theme
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className={`px-6 py-2 rounded-lg font-medium transition ${
                    theme === 'light'
                      ? 'bg-white text-gray-900 border-2 border-gray-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Light Theme
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showLineNumbers}
                  onChange={(e) => setShowLineNumbers(e.target.checked)}
                  className="w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Show Line Numbers</span>
              </label>
            </div>

            {/* Input */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Input Code
                </label>
                <button
                  onClick={loadExample}
                  className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                >
                  Load Example
                </button>
              </div>
              <textarea
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder={`Enter your ${language} code here...`}
                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-mono text-sm"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={processCode}
                className="px-8 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-medium shadow-lg"
              >
                Generate Highlighted Code
              </button>
              <button
                onClick={() => {
                  setInputCode('');
                  setHighlightedCode('');
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
                <h3 className="font-semibold text-gray-800 mb-3">Code Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Language</div>
                    <div className="font-semibold text-gray-900">{statistics.language}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Lines</div>
                    <div className="font-semibold text-gray-900">{statistics.lines}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Words</div>
                    <div className="font-semibold text-gray-900">{statistics.words}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Characters</div>
                    <div className="font-semibold text-gray-900">{statistics.characters}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">File Size</div>
                    <div className="font-semibold text-gray-900">{formatBytes(statistics.size)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Preview */}
            {highlightedCode && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Preview
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={copyHTML}
                      className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                    >
                      Copy HTML
                    </button>
                    <button
                      onClick={copyCSS}
                      className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                    >
                      Copy CSS
                    </button>
                  </div>
                </div>
                <div className={`rounded-lg overflow-hidden border ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-300'}`}>
                  <pre className={`p-4 overflow-x-auto ${theme === 'dark' ? 'bg-[#1e1e1e] text-[#d4d4d4]' : 'bg-[#f5f5f5] text-[#333]'}`} style={{ fontFamily: '"Courier New", monospace', fontSize: '14px', lineHeight: '1.5' }}>
                    <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Information Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              About Code Syntax Highlighter
            </h2>
            
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">
                Syntax highlighting makes code more readable by applying different colors to different parts of the code 
                (keywords, strings, numbers, comments, etc.). Our Code Syntax Highlighter generates ready-to-use HTML and 
                CSS that you can embed in your website, blog, or documentation.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Key Features
              </h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">✓</span>
                  <span><strong>Multiple Languages:</strong> JavaScript, Python, HTML, CSS, SQL, JSON</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">✓</span>
                  <span><strong>Dark & Light Themes:</strong> Choose between professional color schemes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">✓</span>
                  <span><strong>Line Numbers:</strong> Optional line numbering for code blocks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">✓</span>
                  <span><strong>Copy HTML/CSS:</strong> Get ready-to-use code for your website</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">✓</span>
                  <span><strong>Live Preview:</strong> See how your code will look instantly</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">✓</span>
                  <span><strong>No Dependencies:</strong> Pure HTML/CSS solution, no JavaScript libraries needed</span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                How to Use
              </h3>
              <ol className="space-y-3 mb-6 list-decimal list-inside">
                <li><strong>Select Language:</strong> Choose the programming language of your code</li>
                <li><strong>Choose Theme:</strong> Pick between dark or light color scheme</li>
                <li><strong>Paste Code:</strong> Enter or paste your code in the input box</li>
                <li><strong>Generate:</strong> Click "Generate Highlighted Code" to see preview</li>
                <li><strong>Copy HTML:</strong> Copy the generated HTML code</li>
                <li><strong>Copy CSS:</strong> Copy the CSS styles for colors</li>
                <li><strong>Add to Website:</strong> Paste both HTML and CSS into your webpage</li>
              </ol>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Supported Languages
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">JavaScript</h4>
                  <p className="text-sm mb-2">
                    Highlights keywords (function, const, let), strings, numbers, comments, and function names
                  </p>
                  <div className="text-xs text-gray-600">
                    Perfect for web development tutorials and documentation
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Python</h4>
                  <p className="text-sm mb-2">
                    Highlights def, class, if/else, for/while, strings (including f-strings), and comments
                  </p>
                  <div className="text-xs text-gray-600">
                    Ideal for data science and AI tutorials
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">HTML</h4>
                  <p className="text-sm mb-2">
                    Highlights tags, attributes, and attribute values with distinct colors
                  </p>
                  <div className="text-xs text-gray-600">
                    Great for web design tutorials and guides
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">CSS</h4>
                  <p className="text-sm mb-2">
                    Highlights selectors, properties, values, and comments separately
                  </p>
                  <div className="text-xs text-gray-600">
                    Perfect for styling examples and CSS documentation
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">SQL</h4>
                  <p className="text-sm mb-2">
                    Highlights SELECT, FROM, WHERE, JOIN and other SQL keywords
                  </p>
                  <div className="text-xs text-gray-600">
                    Useful for database tutorials and query examples
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">JSON</h4>
                  <p className="text-sm mb-2">
                    Highlights keys, string values, numbers, booleans, and null
                  </p>
                  <div className="text-xs text-gray-600">
                    Great for API documentation and data examples
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Benefits of Syntax Highlighting
              </h3>
              <ul className="space-y-2 mb-6">
                <li><strong>Improved Readability:</strong> Colors make code structure immediately visible</li>
                <li><strong>Easier Learning:</strong> Beginners can identify code elements quickly</li>
                <li><strong>Professional Look:</strong> Makes technical content look polished and credible</li>
                <li><strong>Error Spotting:</strong> Mistakes become more obvious with highlighting</li>
                <li><strong>Better Documentation:</strong> Makes API docs and tutorials more user-friendly</li>
                <li><strong>Increased Engagement:</strong> Readers stay longer on well-formatted content</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Use Cases
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Technical Blogs</h4>
                  <p className="text-sm">
                    Add professional syntax highlighting to programming tutorials and articles
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Documentation Sites</h4>
                  <p className="text-sm">
                    Make API documentation and code examples more readable
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Online Courses</h4>
                  <p className="text-sm">
                    Create clear code examples for educational platforms
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Portfolio Websites</h4>
                  <p className="text-sm">
                    Showcase your code projects with beautiful syntax highlighting
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Frequently Asked Questions
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Do I need JavaScript libraries?</h4>
                  <p>
                    No! This tool generates pure HTML and CSS. There's no need for JavaScript libraries like Prism.js 
                    or Highlight.js. The code is lightweight and fast-loading.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Can I customize the colors?</h4>
                  <p>
                    Yes! After copying the CSS, you can modify the color values to match your website's design. 
                    Each syntax element has its own CSS class for easy customization.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Will this work in WordPress?</h4>
                  <p>
                    Absolutely! Copy the HTML and paste it into a Custom HTML block. Add the CSS to your theme's 
                    Additional CSS section in the customizer.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Is the highlighting accurate?</h4>
                  <p>
                    The highlighting covers the most common syntax elements and works well for most code examples. 
                    For complex edge cases, you may want to use a full syntax highlighting library.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Can I add more languages?</h4>
                  <p>
                    The tool currently supports 6 popular languages. You can modify the CSS and add your own 
                    highlighting rules for additional languages if needed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CSS Reference */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              CSS Classes Reference
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Class</th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Description</th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 font-mono">.keyword</td>
                    <td className="border border-gray-200 px-4 py-2">Reserved keywords</td>
                    <td className="border border-gray-200 px-4 py-2 font-mono">function, class, if, def</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2 font-mono">.string</td>
                    <td className="border border-gray-200 px-4 py-2">String literals</td>
                    <td className="border border-gray-200 px-4 py-2 font-mono">"Hello World"</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 font-mono">.number</td>
                    <td className="border border-gray-200 px-4 py-2">Numeric values</td>
                    <td className="border border-gray-200 px-4 py-2 font-mono">42, 3.14</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2 font-mono">.comment</td>
                    <td className="border border-gray-200 px-4 py-2">Comments</td>
                    <td className="border border-gray-200 px-4 py-2 font-mono">// comment, # comment</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 font-mono">.function</td>
                    <td className="border border-gray-200 px-4 py-2">Function names</td>
                    <td className="border border-gray-200 px-4 py-2 font-mono">myFunction()</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .keyword { color: #569cd6; font-weight: bold; }
        .string { color: #ce9178; }
        .number { color: #b5cea8; }
        .comment { color: #6a9955; font-style: italic; }
        .function { color: #dcdcaa; }
        .tag { color: #808080; }
        .tag-name { color: #569cd6; font-weight: bold; }
        .attr-name { color: #9cdcfe; }
        .attr { color: #9cdcfe; }
        .selector { color: #d7ba7d; }
        .property { color: #9cdcfe; }
        .value { color: #ce9178; }
        .json-key { color: #9cdcfe; }
        .boolean { color: #569cd6; font-weight: bold; }
      `}</style>
    </Layout>
  );
}
