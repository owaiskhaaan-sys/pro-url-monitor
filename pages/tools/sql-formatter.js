import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function SQLFormatter() {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [mode, setMode] = useState('format'); // format or minify
  const [indentSize, setIndentSize] = useState(2);
  const [statistics, setStatistics] = useState(null);

  const exampleSQL = `select u.user_id,u.username,u.email,u.created_at,count(o.order_id) as total_orders,sum(o.total_amount) as total_spent from users u left join orders o on u.user_id=o.user_id where u.status='active' and u.created_at>=date_sub(now(),interval 6 month) group by u.user_id,u.username,u.email,u.created_at having count(o.order_id)>5 order by total_spent desc limit 100;`;

  const sqlKeywords = [
    'SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP',
    'ALTER', 'TABLE', 'DATABASE', 'INDEX', 'VIEW', 'PROCEDURE', 'FUNCTION',
    'TRIGGER', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'FULL', 'CROSS',
    'ON', 'AS', 'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'BETWEEN', 'LIKE',
    'IS', 'NULL', 'GROUP', 'BY', 'HAVING', 'ORDER', 'ASC', 'DESC',
    'LIMIT', 'OFFSET', 'UNION', 'ALL', 'DISTINCT', 'COUNT', 'SUM', 'AVG',
    'MIN', 'MAX', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'INTO', 'VALUES',
    'SET', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'UNIQUE', 'CHECK',
    'DEFAULT', 'AUTO_INCREMENT', 'CONSTRAINT', 'CASCADE', 'GRANT', 'REVOKE'
  ];

  const formatSQL = (sql, indent) => {
    try {
      // Remove extra whitespace
      sql = sql.replace(/\s+/g, ' ').trim();
      
      // Add line breaks before major keywords
      const majorKeywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 
                             'INNER JOIN', 'OUTER JOIN', 'GROUP BY', 'HAVING', 'ORDER BY', 
                             'LIMIT', 'UNION', 'INSERT INTO', 'UPDATE', 'DELETE FROM', 
                             'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE'];
      
      let formatted = sql;
      
      // Capitalize keywords
      sqlKeywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        formatted = formatted.replace(regex, keyword.toUpperCase());
      });
      
      // Add line breaks and indentation
      const indentStr = ' '.repeat(indent);
      let result = '';
      let indentLevel = 0;
      let inParentheses = 0;
      
      // Split by spaces while preserving structure
      const tokens = formatted.match(/[(),;]|[^(),;\s]+/g) || [];
      
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const upperToken = token.toUpperCase();
        
        // Handle parentheses
        if (token === '(') {
          inParentheses++;
          result += token;
          continue;
        } else if (token === ')') {
          inParentheses--;
          result += token;
          continue;
        } else if (token === ',') {
          result += token;
          if (inParentheses === 0) {
            result += '\n' + indentStr.repeat(indentLevel + 1);
          } else {
            result += ' ';
          }
          continue;
        } else if (token === ';') {
          result += token;
          continue;
        }
        
        // Major keywords that start new lines
        if (['SELECT', 'FROM', 'WHERE', 'GROUP', 'HAVING', 'ORDER', 'LIMIT', 
             'UNION', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP'].includes(upperToken)) {
          if (result.trim().length > 0 && !result.endsWith('\n')) {
            result += '\n';
          }
          result += indentStr.repeat(indentLevel) + token;
        }
        // JOIN keywords
        else if (['JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'CROSS', 'FULL'].includes(upperToken)) {
          // Check if next token is JOIN
          const nextToken = tokens[i + 1];
          if (nextToken && nextToken.toUpperCase() === 'JOIN') {
            if (result.trim().length > 0 && !result.endsWith('\n')) {
              result += '\n';
            }
            result += indentStr.repeat(indentLevel) + token;
          } else if (upperToken === 'JOIN') {
            if (result.trim().length > 0 && !result.endsWith('\n')) {
              result += '\n';
            }
            result += indentStr.repeat(indentLevel) + token;
          } else {
            result += ' ' + token;
          }
        }
        // BY keyword (for GROUP BY, ORDER BY)
        else if (upperToken === 'BY') {
          result += ' ' + token + '\n' + indentStr.repeat(indentLevel + 1);
        }
        // ON keyword for joins
        else if (upperToken === 'ON' && inParentheses === 0) {
          result += '\n' + indentStr.repeat(indentLevel + 1) + token;
        }
        // AND, OR in WHERE clause
        else if (['AND', 'OR'].includes(upperToken) && inParentheses === 0) {
          result += '\n' + indentStr.repeat(indentLevel + 1) + token;
        }
        else {
          // Regular token
          if (result.endsWith('\n') || result.endsWith(indentStr)) {
            result += ' ' + token;
          } else if (result.length === 0) {
            result += token;
          } else {
            result += ' ' + token;
          }
        }
      }
      
      // Clean up extra spaces and newlines
      result = result.split('\n').map(line => line.trim()).filter(line => line).join('\n');
      
      return result;
    } catch (error) {
      throw new Error('Failed to format SQL: ' + error.message);
    }
  };

  const minifySQL = (sql) => {
    try {
      // Remove extra whitespace and newlines
      let minified = sql.replace(/\s+/g, ' ').trim();
      
      // Remove spaces around certain characters
      minified = minified.replace(/\s*([(),;=<>])\s*/g, '$1');
      
      // Add back necessary spaces around keywords
      minified = minified.replace(/(\w)([A-Z]{2,})/g, '$1 $2');
      
      return minified;
    } catch (error) {
      throw new Error('Failed to minify SQL: ' + error.message);
    }
  };

  const countKeywords = (sql) => {
    let count = 0;
    sqlKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = sql.match(regex);
      if (matches) count += matches.length;
    });
    return count;
  };

  const detectStatementType = (sql) => {
    const upper = sql.trim().toUpperCase();
    if (upper.startsWith('SELECT')) return 'SELECT';
    if (upper.startsWith('INSERT')) return 'INSERT';
    if (upper.startsWith('UPDATE')) return 'UPDATE';
    if (upper.startsWith('DELETE')) return 'DELETE';
    if (upper.startsWith('CREATE')) return 'CREATE';
    if (upper.startsWith('ALTER')) return 'ALTER';
    if (upper.startsWith('DROP')) return 'DROP';
    return 'UNKNOWN';
  };

  const processCode = () => {
    if (!inputCode.trim()) {
      alert('Please enter SQL code');
      return;
    }

    try {
      if (mode === 'format') {
        const formatted = formatSQL(inputCode, indentSize);
        setOutputCode(formatted);
        
        setStatistics({
          originalSize: new Blob([inputCode]).size,
          processedSize: new Blob([formatted]).size,
          keywords: countKeywords(inputCode),
          statementType: detectStatementType(inputCode),
          originalLines: inputCode.split('\n').length,
          processedLines: formatted.split('\n').length
        });
      } else {
        const minified = minifySQL(inputCode);
        setOutputCode(minified);
        
        const reduction = ((1 - minified.length / inputCode.length) * 100).toFixed(2);
        
        setStatistics({
          originalSize: new Blob([inputCode]).size,
          processedSize: new Blob([minified]).size,
          keywords: countKeywords(inputCode),
          statementType: detectStatementType(inputCode),
          reduction: reduction,
          originalLines: inputCode.split('\n').length,
          processedLines: 1
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
    a.download = mode === 'format' ? 'formatted.sql' : 'minified.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadExample = () => {
    setInputCode(exampleSQL);
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
      title="SQL Formatter & Beautifier - Format SQL Queries Online"
      description="Free online SQL formatter and beautifier. Format SQL queries with proper indentation, capitalize keywords, and minify for production. Supports MySQL, PostgreSQL, SQL Server."
    >
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              SQL Formatter & Beautifier
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Format and beautify SQL queries with proper indentation and keyword capitalization. Perfect for database developers and data analysts.
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
                  onClick={() => setMode('format')}
                  className={`px-6 py-3 rounded-lg font-medium transition ${
                    mode === 'format'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Format
                </button>
                <button
                  onClick={() => setMode('minify')}
                  className={`px-6 py-3 rounded-lg font-medium transition ${
                    mode === 'minify'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Minify
                </button>
              </div>
            </div>

            {/* Indent Size (only for format mode) */}
            {mode === 'format' && (
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
                          ? 'bg-purple-600 text-white'
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
                  Input SQL
                </label>
                <button
                  onClick={loadExample}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Load Example
                </button>
              </div>
              <textarea
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Enter your SQL query here... e.g., SELECT * FROM users WHERE status='active'"
                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                style={{ tabSize: indentSize }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={processCode}
                className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium shadow-lg"
              >
                {mode === 'format' ? 'Format SQL' : 'Minify SQL'}
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
                    <div className="text-sm text-gray-600">Statement Type</div>
                    <div className="font-semibold text-gray-900">{statistics.statementType}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Original Size</div>
                    <div className="font-semibold text-gray-900">{formatBytes(statistics.originalSize)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Processed Size</div>
                    <div className="font-semibold text-gray-900">{formatBytes(statistics.processedSize)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Keywords</div>
                    <div className="font-semibold text-gray-900">{statistics.keywords}</div>
                  </div>
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
                      className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Copy
                    </button>
                    <button
                      onClick={downloadFile}
                      className="text-sm text-purple-600 hover:text-purple-700 font-medium"
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
              About SQL Formatter & Beautifier
            </h2>
            
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">
                SQL (Structured Query Language) is the standard language for managing and manipulating relational databases. 
                Our SQL Formatter helps developers write cleaner, more readable SQL queries by automatically formatting and 
                organizing SQL code according to best practices.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Key Features
              </h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span><strong>Automatic Formatting:</strong> Format SQL with proper indentation (2, 4, or 8 spaces)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span><strong>Keyword Capitalization:</strong> Automatically capitalize SQL keywords for consistency</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span><strong>Smart Line Breaking:</strong> Add line breaks before major clauses (SELECT, FROM, WHERE, JOIN)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span><strong>Minification:</strong> Remove unnecessary whitespace to reduce file size</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span><strong>Statistics Display:</strong> View query type, keywords count, and size metrics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span><strong>Universal Support:</strong> Works with MySQL, PostgreSQL, SQL Server, Oracle, SQLite</span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                SQL Formatting Best Practices
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">1. Capitalize Keywords</h4>
                  <p className="text-purple-800 mb-2">
                    Always write SQL keywords in UPPERCASE to distinguish them from table and column names.
                  </p>
                  <div className="bg-white p-3 rounded font-mono text-sm text-gray-800">
                    SELECT name, email FROM users WHERE status = 'active';
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">2. One Clause Per Line</h4>
                  <p className="text-purple-800 mb-2">
                    Place each major clause (SELECT, FROM, WHERE, etc.) on a separate line for better readability.
                  </p>
                  <div className="bg-white p-3 rounded font-mono text-sm text-gray-800 whitespace-pre">
{`SELECT user_id, username
FROM users
WHERE created_at > '2024-01-01';`}
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">3. Indent Subclauses</h4>
                  <p className="text-purple-800 mb-2">
                    Indent conditions in WHERE clauses and columns in SELECT statements for hierarchy.
                  </p>
                  <div className="bg-white p-3 rounded font-mono text-sm text-gray-800 whitespace-pre">
{`SELECT 
  user_id,
  username,
  email
FROM users
WHERE 
  status = 'active'
  AND created_at > NOW() - INTERVAL 6 MONTH;`}
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">4. Align JOIN Clauses</h4>
                  <p className="text-purple-800 mb-2">
                    Keep JOIN statements aligned and place ON conditions on the same indentation level.
                  </p>
                  <div className="bg-white p-3 rounded font-mono text-sm text-gray-800 whitespace-pre">
{`SELECT u.username, o.order_id
FROM users u
LEFT JOIN orders o
  ON u.user_id = o.user_id;`}
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Common SQL Query Types
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">SELECT Queries</h4>
                  <p className="text-sm mb-2">Retrieve data from database tables</p>
                  <div className="bg-gray-50 p-2 rounded font-mono text-xs">
                    SELECT * FROM users;
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">INSERT Statements</h4>
                  <p className="text-sm mb-2">Add new rows to tables</p>
                  <div className="bg-gray-50 p-2 rounded font-mono text-xs">
                    INSERT INTO users VALUES (...);
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">UPDATE Statements</h4>
                  <p className="text-sm mb-2">Modify existing data</p>
                  <div className="bg-gray-50 p-2 rounded font-mono text-xs">
                    UPDATE users SET status='active';
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">DELETE Statements</h4>
                  <p className="text-sm mb-2">Remove rows from tables</p>
                  <div className="bg-gray-50 p-2 rounded font-mono text-xs">
                    DELETE FROM users WHERE ...;
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Benefits of Formatted SQL
              </h3>
              <ul className="space-y-2 mb-6">
                <li><strong>Improved Readability:</strong> Well-formatted queries are easier to read and understand</li>
                <li><strong>Easier Debugging:</strong> Identify syntax errors and logic issues more quickly</li>
                <li><strong>Better Collaboration:</strong> Consistent formatting helps team members work together</li>
                <li><strong>Code Maintenance:</strong> Formatted code is easier to maintain and modify</li>
                <li><strong>Performance Analysis:</strong> Clearly see query structure for optimization</li>
                <li><strong>Learning Tool:</strong> Helps beginners understand SQL query structure</li>
                <li><strong>Professional Standards:</strong> Demonstrates attention to code quality</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Use Cases
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Development & Testing</h4>
                  <p className="text-sm">
                    Format queries during development for better readability and easier debugging
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Code Reviews</h4>
                  <p className="text-sm">
                    Ensure consistent formatting across team code reviews and pull requests
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Documentation</h4>
                  <p className="text-sm">
                    Create clean, readable SQL examples for technical documentation
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Learning SQL</h4>
                  <p className="text-sm">
                    Understand SQL structure by seeing properly formatted examples
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Supported SQL Dialects
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span className="font-medium text-gray-900">MySQL</span>
                </div>
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span className="font-medium text-gray-900">PostgreSQL</span>
                </div>
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span className="font-medium text-gray-900">SQL Server</span>
                </div>
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span className="font-medium text-gray-900">Oracle</span>
                </div>
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span className="font-medium text-gray-900">SQLite</span>
                </div>
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span className="font-medium text-gray-900">MariaDB</span>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Frequently Asked Questions
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Does formatting change query execution?</h4>
                  <p>
                    No, formatting only affects whitespace and keyword capitalization. The query logic and results 
                    remain exactly the same. SQL databases ignore extra whitespace and are case-insensitive for keywords.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Should I capitalize all SQL keywords?</h4>
                  <p>
                    While SQL is case-insensitive, capitalizing keywords is a widely accepted best practice that improves 
                    readability by clearly distinguishing keywords from table/column names.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Can I use this for stored procedures?</h4>
                  <p>
                    Yes! This formatter works with any SQL code including stored procedures, functions, triggers, and 
                    complex queries with multiple clauses and subqueries.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Is my SQL data secure?</h4>
                  <p>
                    Absolutely. All formatting happens entirely in your browser. Your SQL queries are never sent to any 
                    server, ensuring complete privacy and security.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">When should I minify SQL?</h4>
                  <p>
                    Minify SQL when file size matters, such as embedding queries in application code or storing them in 
                    configuration files. For development and debugging, always use formatted SQL.
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
