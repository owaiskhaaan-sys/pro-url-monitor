import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function XMLBeautifierValidator() {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [mode, setMode] = useState('beautify'); // beautify or validate
  const [indentSize, setIndentSize] = useState(2);
  const [validationResult, setValidationResult] = useState(null);
  const [statistics, setStatistics] = useState(null);

  const exampleXML = `<?xml version="1.0" encoding="UTF-8"?><catalog><book id="bk101"><author>Gambardella, Matthew</author><title>XML Developer's Guide</title><genre>Computer</genre><price>44.95</price><publish_date>2000-10-01</publish_date><description>An in-depth look at creating applications with XML.</description></book><book id="bk102"><author>Ralls, Kim</author><title>Midnight Rain</title><genre>Fantasy</genre><price>5.95</price><publish_date>2000-12-16</publish_date><description>A former architect battles corporate zombies.</description></book><book id="bk103"><author>Corets, Eva</author><title>Maeve Ascendant</title><genre>Fantasy</genre><price>5.95</price><publish_date>2000-11-17</publish_date><description>After the collapse of a nanotechnology society, the survivors must rebuild.</description></book></catalog>`;

  const beautifyXML = (xml, indent) => {
    try {
      // Remove extra whitespace
      xml = xml.replace(/>\s+</g, '><').trim();
      
      let formatted = '';
      let indentLevel = 0;
      const indentStr = ' '.repeat(indent);
      
      // Split by tags
      const parts = xml.split(/(<[^>]+>)/g).filter(part => part.trim());
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i].trim();
        
        if (!part) continue;
        
        // Check if it's a tag
        if (part.startsWith('<')) {
          // Closing tag
          if (part.startsWith('</')) {
            indentLevel--;
            formatted += indentStr.repeat(indentLevel) + part + '\n';
          }
          // Self-closing tag or declaration
          else if (part.endsWith('/>') || part.startsWith('<?') || part.startsWith('<!')) {
            formatted += indentStr.repeat(indentLevel) + part + '\n';
          }
          // Opening tag
          else {
            formatted += indentStr.repeat(indentLevel) + part + '\n';
            indentLevel++;
          }
        }
        // Text content
        else {
          formatted += indentStr.repeat(indentLevel) + part + '\n';
        }
      }
      
      return formatted.trim();
    } catch (error) {
      throw new Error('Failed to beautify XML: ' + error.message);
    }
  };

  const minifyXML = (xml) => {
    try {
      // Remove whitespace between tags
      return xml.replace(/>\s+</g, '><').trim();
    } catch (error) {
      throw new Error('Failed to minify XML: ' + error.message);
    }
  };

  const validateXML = (xml) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, 'text/xml');
      
      // Check for parsing errors
      const parserError = xmlDoc.getElementsByTagName('parsererror');
      
      if (parserError.length > 0) {
        const errorText = parserError[0].textContent || 'Unknown XML parsing error';
        return {
          valid: false,
          message: 'Invalid XML',
          error: errorText
        };
      }
      
      // Additional validation checks
      const errors = [];
      
      // Check for matching tags
      const openTags = (xml.match(/<[^/!?][^>]*[^/]>/g) || []).map(tag => 
        tag.replace(/^<([^\s>]+).*/, '$1')
      );
      const closeTags = (xml.match(/<\/[^>]+>/g) || []).map(tag => 
        tag.replace(/<\/([^>]+)>/, '$1')
      );
      
      if (openTags.length !== closeTags.length) {
        errors.push('Mismatched opening and closing tags');
      }
      
      if (errors.length > 0) {
        return {
          valid: false,
          message: 'XML Validation Errors',
          error: errors.join(', ')
        };
      }
      
      return {
        valid: true,
        message: 'Valid XML! ✓',
        error: null
      };
    } catch (error) {
      return {
        valid: false,
        message: 'Invalid XML',
        error: error.message
      };
    }
  };

  const countElements = (xml) => {
    const matches = xml.match(/<[^/!?][^>]*>/g);
    return matches ? matches.length : 0;
  };

  const countAttributes = (xml) => {
    const matches = xml.match(/\s+\w+\s*=\s*["'][^"']*["']/g);
    return matches ? matches.length : 0;
  };

  const calculateDepth = (xml) => {
    let maxDepth = 0;
    let currentDepth = 0;
    
    const parts = xml.split(/(<[^>]+>)/g).filter(part => part.trim());
    
    for (const part of parts) {
      if (part.startsWith('<')) {
        if (part.startsWith('</')) {
          currentDepth--;
        } else if (!part.endsWith('/>') && !part.startsWith('<?') && !part.startsWith('<!')) {
          currentDepth++;
          maxDepth = Math.max(maxDepth, currentDepth);
        }
      }
    }
    
    return maxDepth;
  };

  const processCode = () => {
    if (!inputCode.trim()) {
      alert('Please enter XML code');
      return;
    }

    try {
      if (mode === 'beautify') {
        const beautified = beautifyXML(inputCode, indentSize);
        setOutputCode(beautified);
        
        const validation = validateXML(inputCode);
        setValidationResult(validation);
        
        if (validation.valid) {
          setStatistics({
            originalSize: new Blob([inputCode]).size,
            processedSize: new Blob([beautified]).size,
            elements: countElements(inputCode),
            attributes: countAttributes(inputCode),
            depth: calculateDepth(inputCode),
            originalLines: inputCode.split('\n').length,
            processedLines: beautified.split('\n').length
          });
        } else {
          setStatistics(null);
        }
      } else if (mode === 'minify') {
        const minified = minifyXML(inputCode);
        setOutputCode(minified);
        
        const validation = validateXML(inputCode);
        setValidationResult(validation);
        
        if (validation.valid) {
          const reduction = ((1 - minified.length / inputCode.length) * 100).toFixed(2);
          
          setStatistics({
            originalSize: new Blob([inputCode]).size,
            processedSize: new Blob([minified]).size,
            elements: countElements(inputCode),
            reduction: reduction,
            originalLines: inputCode.split('\n').length,
            processedLines: 1
          });
        } else {
          setStatistics(null);
        }
      } else {
        // validate mode
        const result = validateXML(inputCode);
        setValidationResult(result);
        
        if (result.valid) {
          setStatistics({
            size: new Blob([inputCode]).size,
            elements: countElements(inputCode),
            attributes: countAttributes(inputCode),
            depth: calculateDepth(inputCode),
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
        message: 'Error Processing XML',
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
    const blob = new Blob([outputCode], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'beautify' ? 'beautified.xml' : 'minified.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadExample = () => {
    setInputCode(exampleXML);
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
      title="XML Beautifier & Validator - Format, Minify & Validate XML Online"
      description="Free online XML beautifier, minifier, and validator. Format XML with proper indentation, minify for production, validate well-formedness, and identify errors instantly."
    >
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              XML Beautifier & Validator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Format, minify, and validate XML documents instantly. Perfect for developers working with XML data, configuration files, and web services.
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
                      ? 'bg-orange-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Beautify
                </button>
                <button
                  onClick={() => setMode('minify')}
                  className={`px-6 py-3 rounded-lg font-medium transition ${
                    mode === 'minify'
                      ? 'bg-orange-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Minify
                </button>
                <button
                  onClick={() => setMode('validate')}
                  className={`px-6 py-3 rounded-lg font-medium transition ${
                    mode === 'validate'
                      ? 'bg-orange-600 text-white shadow-lg'
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
                          ? 'bg-orange-600 text-white'
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
                  Input XML
                </label>
                <button
                  onClick={loadExample}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Load Example
                </button>
              </div>
              <textarea
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder='Enter your XML here... e.g., <?xml version="1.0"?><root><item>value</item></root>'
                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
                style={{ tabSize: indentSize }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={processCode}
                className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium shadow-lg"
              >
                {mode === 'beautify' ? 'Beautify XML' : mode === 'minify' ? 'Minify XML' : 'Validate XML'}
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
                  <div className="text-sm text-red-700 font-mono whitespace-pre-wrap">
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
                        <div className="text-sm text-gray-600">Elements</div>
                        <div className="font-semibold text-gray-900">{statistics.elements}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Attributes</div>
                        <div className="font-semibold text-gray-900">{statistics.attributes}</div>
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
                      {statistics.elements && (
                        <div>
                          <div className="text-sm text-gray-600">Elements</div>
                          <div className="font-semibold text-gray-900">{statistics.elements}</div>
                        </div>
                      )}
                      {statistics.attributes !== undefined && (
                        <div>
                          <div className="text-sm text-gray-600">Attributes</div>
                          <div className="font-semibold text-gray-900">{statistics.attributes}</div>
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
                      className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Copy
                    </button>
                    <button
                      onClick={downloadFile}
                      className="text-sm text-orange-600 hover:text-orange-700 font-medium"
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
              About XML Beautifier & Validator
            </h2>
            
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">
                XML (Extensible Markup Language) is a markup language widely used for storing and transporting data. 
                Our XML Beautifier & Validator helps developers work with XML documents by providing formatting, 
                minification, and validation capabilities in one convenient tool.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Key Features
              </h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span><strong>Beautify XML:</strong> Format XML with proper indentation (2, 4, or 8 spaces) for readability</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span><strong>Minify XML:</strong> Remove unnecessary whitespace to reduce file size by 40-60%</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span><strong>Validate Well-Formedness:</strong> Check for XML syntax errors and tag matching</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span><strong>Statistics Display:</strong> View elements count, attributes, nesting depth, and file size</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span><strong>Export Options:</strong> Copy to clipboard or download as .xml file</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span><strong>Browser-Based:</strong> All processing happens locally for privacy and security</span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Understanding XML
              </h3>
              <p className="mb-4">
                XML is a flexible, self-descriptive markup language that defines rules for encoding documents in a format 
                that is both human-readable and machine-readable. Unlike HTML which focuses on displaying data, XML 
                is designed to store and transport data.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                When to Use Each Mode
              </h3>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-orange-900 mb-2">Beautify Mode</h4>
                <p className="text-orange-800 mb-2">
                  Use beautify mode when you need to read, understand, or edit XML documents. This mode adds proper 
                  indentation and line breaks, making the structure clear and easy to navigate.
                </p>
                <p className="text-orange-800 text-sm">
                  <strong>Best for:</strong> Debugging, configuration file editing, documentation, code reviews
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-green-900 mb-2">Minify Mode</h4>
                <p className="text-green-800 mb-2">
                  Use minify mode to reduce file size for data transmission or storage. This removes all unnecessary 
                  whitespace while preserving the XML structure and data.
                </p>
                <p className="text-green-800 text-sm">
                  <strong>Best for:</strong> Web services, API responses, reducing bandwidth, storage optimization
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-purple-900 mb-2">Validate Mode</h4>
                <p className="text-purple-800 mb-2">
                  Use validate mode to check if your XML is well-formed. This identifies syntax errors like unclosed 
                  tags, invalid characters, or improper nesting.
                </p>
                <p className="text-purple-800 text-sm">
                  <strong>Best for:</strong> Syntax checking, pre-deployment validation, error debugging, quality assurance
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                XML Well-Formedness Rules
              </h3>
              <ul className="space-y-2 mb-6">
                <li><strong>XML Declaration:</strong> Optional but recommended: <code>&lt;?xml version="1.0"?&gt;</code></li>
                <li><strong>Single Root Element:</strong> Every XML document must have exactly one root element</li>
                <li><strong>Proper Nesting:</strong> All tags must be properly nested and closed in the correct order</li>
                <li><strong>Case Sensitive:</strong> XML tags are case-sensitive (&lt;Book&gt; ≠ &lt;book&gt;)</li>
                <li><strong>Attribute Quotes:</strong> All attribute values must be enclosed in quotes</li>
                <li><strong>Special Characters:</strong> Use entities for special characters (&amp;lt; &amp;gt; &amp;amp; &amp;quot; &amp;apos;)</li>
                <li><strong>Self-Closing Tags:</strong> Empty elements can use self-closing syntax: &lt;tag/&gt;</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Common XML Errors
              </h3>
              <ul className="space-y-2 mb-6">
                <li><strong>Unclosed Tags:</strong> Every opening tag must have a matching closing tag</li>
                <li><strong>Improper Nesting:</strong> Tags must be closed in the reverse order they were opened</li>
                <li><strong>Missing Quotes:</strong> Attribute values must be in single or double quotes</li>
                <li><strong>Invalid Characters:</strong> Special characters must be escaped using entities</li>
                <li><strong>Multiple Root Elements:</strong> Only one root element is allowed per document</li>
                <li><strong>Case Mismatch:</strong> Opening and closing tags must have identical case</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Use Cases
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Configuration Files</h4>
                  <p className="text-sm">
                    Format and validate XML configuration files for applications and web services
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">SOAP Web Services</h4>
                  <p className="text-sm">
                    Debug and format SOAP request/response messages for API testing
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">RSS/Atom Feeds</h4>
                  <p className="text-sm">
                    Create and validate RSS or Atom feed XML for content syndication
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Data Exchange</h4>
                  <p className="text-sm">
                    Format XML data for import/export between different systems
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                XML vs JSON
              </h3>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-200 px-4 py-2 text-left">Feature</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">XML</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">JSON</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2">Data Format</td>
                      <td className="border border-gray-200 px-4 py-2">Markup language</td>
                      <td className="border border-gray-200 px-4 py-2">Data notation</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2">Verbosity</td>
                      <td className="border border-gray-200 px-4 py-2">More verbose</td>
                      <td className="border border-gray-200 px-4 py-2">More concise</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2">Attributes</td>
                      <td className="border border-gray-200 px-4 py-2">Supports attributes</td>
                      <td className="border border-gray-200 px-4 py-2">No attributes</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2">Namespaces</td>
                      <td className="border border-gray-200 px-4 py-2">Built-in support</td>
                      <td className="border border-gray-200 px-4 py-2">No namespace support</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2">Comments</td>
                      <td className="border border-gray-200 px-4 py-2">Supported</td>
                      <td className="border border-gray-200 px-4 py-2">Not supported</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Frequently Asked Questions
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What makes XML well-formed vs valid?</h4>
                  <p>
                    Well-formed XML follows basic syntax rules (proper nesting, closed tags, etc.). Valid XML goes 
                    further by conforming to a specific DTD or XML Schema. This tool checks well-formedness.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Does beautifying XML change the data?</h4>
                  <p>
                    No, beautifying only adds whitespace for readability. The element structure, data, and attributes 
                    remain identical. The same applies to minification - only whitespace is affected.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Can this tool validate against a schema?</h4>
                  <p>
                    This tool checks well-formedness (syntax correctness) but doesn't validate against DTD or XSD schemas. 
                    It ensures your XML follows basic structural rules.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Is my XML data secure?</h4>
                  <p>
                    Yes, all processing happens entirely in your browser. Your XML data is never uploaded to any server, 
                    ensuring complete privacy and security.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Why use XML instead of JSON?</h4>
                  <p>
                    XML is better for documents with complex metadata, supports attributes and namespaces, allows comments, 
                    and has extensive validation tools. JSON is better for simple data structures and web APIs.
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
