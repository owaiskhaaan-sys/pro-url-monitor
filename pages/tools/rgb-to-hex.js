import Head from 'next/head';
import { useState } from 'react';
import Layout from '../../components/Layout';

export default function RgbToHexConverter() {
  const [red, setRed] = useState(59);
  const [green, setGreen] = useState(130);
  const [blue, setBlue] = useState(246);
  const [alpha, setAlpha] = useState(100);
  const [outputFormat, setOutputFormat] = useState('6-digit'); // '3-digit', '6-digit', '8-digit', 'css'
  const [error, setError] = useState('');

  const validateRgbValue = (value, setter) => {
    const num = parseInt(value);
    if (isNaN(num) || num < 0 || num > 255) {
      setError('RGB values must be between 0 and 255');
      return false;
    }
    setter(num);
    setError('');
    return true;
  };

  const componentToHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  const rgbToHex = (r, g, b, includeAlpha = false) => {
    const hexR = componentToHex(r);
    const hexG = componentToHex(g);
    const hexB = componentToHex(b);
    
    let hex = '#' + hexR + hexG + hexB;
    
    if (includeAlpha) {
      const alphaValue = Math.round((alpha / 100) * 255);
      const hexA = componentToHex(alphaValue);
      hex += hexA;
    }
    
    return hex.toUpperCase();
  };

  const canUseShorthand = (r, g, b) => {
    const hexR = componentToHex(r);
    const hexG = componentToHex(g);
    const hexB = componentToHex(b);
    
    return hexR[0] === hexR[1] && hexG[0] === hexG[1] && hexB[0] === hexB[1];
  };

  const getShorthandHex = (r, g, b) => {
    const hexR = componentToHex(r);
    const hexG = componentToHex(g);
    const hexB = componentToHex(b);
    
    return '#' + hexR[0] + hexG[0] + hexB[0];
  };

  const getFormattedOutput = () => {
    switch (outputFormat) {
      case '3-digit':
        if (canUseShorthand(red, green, blue)) {
          return getShorthandHex(red, green, blue).toUpperCase();
        }
        return rgbToHex(red, green, blue) + ' (Cannot be shortened)';
      case '6-digit':
        return rgbToHex(red, green, blue);
      case '8-digit':
        return rgbToHex(red, green, blue, true);
      case 'css':
        return `background-color: ${rgbToHex(red, green, blue)};`;
      default:
        return rgbToHex(red, green, blue);
    }
  };

  const copyToClipboard = (text) => {
    const cleanText = text.replace(' (Cannot be shortened)', '');
    navigator.clipboard.writeText(cleanText);
  };

  const loadExample = () => {
    const examples = [
      { r: 255, g: 87, b: 51 },
      { r: 52, g: 152, b: 219 },
      { r: 46, g: 204, b: 113 },
      { r: 155, g: 89, b: 182 },
      { r: 243, g: 156, b: 18 },
      { r: 231, g: 76, b: 60 }
    ];
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    setRed(randomExample.r);
    setGreen(randomExample.g);
    setBlue(randomExample.b);
    setError('');
  };

  const loadShorthandExample = () => {
    const examples = [
      { r: 255, g: 255, b: 255 }, // #FFF
      { r: 0, g: 0, b: 0 },       // #000
      { r: 255, g: 85, b: 170 },  // #F5A
      { r: 51, g: 102, b: 153 }   // #369
    ];
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    setRed(randomExample.r);
    setGreen(randomExample.g);
    setBlue(randomExample.b);
    setError('');
  };

  return (
    <Layout>
      <Head>
        <title>RGB to HEX Converter - Convert RGB Color to HEX Online | ProURLMonitor</title>
        <meta name="description" content="Free RGB to HEX converter. Convert RGB color values to hexadecimal color codes instantly. Supports alpha channel, shorthand notation, and CSS format output." />
        <meta name="keywords" content="rgb to hex, color converter, rgb color, hex color, color code converter, css color, hex generator" />
        <link rel="canonical" href="https://prourlmonitor.com/tools/rgb-to-hex" />
        
        <meta property="og:title" content="RGB to HEX Converter - Convert RGB Color to HEX Online" />
        <meta property="og:description" content="Free RGB to HEX converter. Convert RGB color values to hexadecimal color codes instantly. Supports alpha channel, shorthand notation, and CSS format." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://prourlmonitor.com/tools/rgb-to-hex" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="RGB to HEX Converter - Convert RGB Color to HEX Online" />
        <meta name="twitter:description" content="Free RGB to HEX converter. Convert RGB color values to hexadecimal color codes instantly. Supports alpha channel and shorthand notation." />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">RGB to HEX Converter</h1>
          <p className="text-lg text-gray-600">
            Convert RGB color values to hexadecimal color codes instantly
          </p>
        </div>

        {/* Converter Tool */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* RGB Input Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              RGB Values (0-255)
            </label>
            <div className="grid grid-cols-3 gap-4">
              {/* Red */}
              <div>
                <label className="block text-xs text-red-600 mb-1 font-semibold">Red (R)</label>
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={red}
                  onChange={(e) => validateRgbValue(e.target.value, setRed)}
                  className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={red}
                  onChange={(e) => setRed(parseInt(e.target.value))}
                  className="w-full mt-2"
                  style={{ accentColor: '#ef4444' }}
                />
              </div>

              {/* Green */}
              <div>
                <label className="block text-xs text-green-600 mb-1 font-semibold">Green (G)</label>
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={green}
                  onChange={(e) => validateRgbValue(e.target.value, setGreen)}
                  className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={green}
                  onChange={(e) => setGreen(parseInt(e.target.value))}
                  className="w-full mt-2"
                  style={{ accentColor: '#10b981' }}
                />
              </div>

              {/* Blue */}
              <div>
                <label className="block text-xs text-blue-600 mb-1 font-semibold">Blue (B)</label>
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={blue}
                  onChange={(e) => validateRgbValue(e.target.value, setBlue)}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={blue}
                  onChange={(e) => setBlue(parseInt(e.target.value))}
                  className="w-full mt-2"
                  style={{ accentColor: '#3b82f6' }}
                />
              </div>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* Alpha Channel */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alpha (Opacity): {alpha}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={alpha}
              onChange={(e) => setAlpha(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Color Preview */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Preview
            </label>
            <div className="flex gap-4">
              <div 
                className="flex-1 h-32 rounded-lg border-2 border-gray-300 shadow-inner"
                style={{ backgroundColor: `rgb(${red}, ${green}, ${blue})` }}
              />
              <div 
                className="flex-1 h-32 rounded-lg border-2 border-gray-300 shadow-inner relative overflow-hidden"
                style={{ backgroundColor: `rgba(${red}, ${green}, ${blue}, ${alpha / 100})` }}
              >
                <div className="absolute inset-0" style={{
                  backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                  zIndex: -1
                }}></div>
              </div>
            </div>
          </div>

          {/* HEX Value Display */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              HEX Value
            </label>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-3xl font-bold text-white text-center font-mono">
                {rgbToHex(red, green, blue)}
              </div>
            </div>
          </div>

          {/* Shorthand Check */}
          {canUseShorthand(red, green, blue) && (
            <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">
                  This color can use shorthand: {getShorthandHex(red, green, blue).toUpperCase()}
                </span>
              </div>
            </div>
          )}

          {/* Output Format */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Output Format
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <button
                onClick={() => setOutputFormat('3-digit')}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  outputFormat === '3-digit' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                3-digit
              </button>
              <button
                onClick={() => setOutputFormat('6-digit')}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  outputFormat === '6-digit' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                6-digit
              </button>
              <button
                onClick={() => setOutputFormat('8-digit')}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  outputFormat === '8-digit' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                8-digit
              </button>
              <button
                onClick={() => setOutputFormat('css')}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  outputFormat === 'css' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                CSS
              </button>
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={getFormattedOutput()}
                readOnly
                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm"
              />
              <button
                onClick={() => copyToClipboard(getFormattedOutput())}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={loadExample}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Load Example
            </button>
            <button
              onClick={loadShorthandExample}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Shorthand Example
            </button>
            <button
              onClick={() => {
                setRed(59);
                setGreen(130);
                setBlue(246);
                setAlpha(100);
                setOutputFormat('6-digit');
                setError('');
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Color Information */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-xs text-gray-600 mb-1">HEX (6-digit)</div>
            <div className="text-lg font-bold text-gray-800 font-mono">{rgbToHex(red, green, blue)}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-xs text-gray-600 mb-1">RGB</div>
            <div className="text-lg font-bold text-gray-800">{red}, {green}, {blue}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-xs text-gray-600 mb-1">RGBA</div>
            <div className="text-lg font-bold text-gray-800">{red}, {green}, {blue}, {(alpha / 100).toFixed(2)}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-xs text-gray-600 mb-1">HEX (8-digit)</div>
            <div className="text-sm font-bold text-gray-800 font-mono">{rgbToHex(red, green, blue, true)}</div>
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About RGB to HEX Conversion</h2>
          
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">
              The RGB to HEX converter transforms RGB (Red, Green, Blue) color values into hexadecimal color codes. This conversion is essential for web development, as HEX notation is the most widely used color format in CSS, HTML, and web design. Understanding this conversion helps developers and designers work efficiently across different platforms and tools.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Understanding RGB Color Model</h3>
            <p className="text-gray-700 mb-4">
              RGB is an additive color model where colors are created by combining different intensities of red, green, and blue light. Each channel accepts values from 0 to 255, where:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li>0 represents no intensity (darkest)</li>
              <li>255 represents maximum intensity (brightest)</li>
              <li>rgb(0, 0, 0) produces black</li>
              <li>rgb(255, 255, 255) produces white</li>
              <li>rgb(255, 0, 0) produces pure red</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">HEX Color Notation Explained</h3>
            <p className="text-gray-700 mb-4">
              HEX (hexadecimal) notation represents colors using base-16 numbering system. A standard HEX color consists of six characters (0-9, A-F) preceded by a hash symbol. Each pair of characters represents one color channel:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li><strong>First pair (RR):</strong> Red channel intensity</li>
              <li><strong>Second pair (GG):</strong> Green channel intensity</li>
              <li><strong>Third pair (BB):</strong> Blue channel intensity</li>
            </ul>
            <p className="text-gray-700 mb-4">
              For example, RGB(255, 87, 51) converts to #FF5733, where FF=255, 57=87, and 33=51 in decimal.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Conversion Process Step-by-Step</h3>
            <p className="text-gray-700 mb-4">
              Converting RGB to HEX involves converting each decimal RGB value (0-255) to its hexadecimal equivalent (00-FF):
            </p>
            <ol className="list-decimal list-inside text-gray-700 mb-4 ml-4">
              <li>Take each RGB component value (R, G, B)</li>
              <li>Convert each decimal value to hexadecimal (base 16)</li>
              <li>Ensure each hex value has two digits (add leading 0 if needed)</li>
              <li>Combine in order: # + RR + GG + BB</li>
              <li>Optionally add alpha channel for 8-digit format</li>
            </ol>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">HEX Shorthand Notation</h3>
            <p className="text-gray-700 mb-4">
              When both digits of each color channel are identical, you can use 3-digit shorthand notation. This provides a more concise way to write common colors:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li>#FFFFFF → #FFF (white)</li>
              <li>#000000 → #000 (black)</li>
              <li>#FF5500 → #F50 (orange)</li>
              <li>#336699 → #369 (blue)</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Our converter automatically detects when shorthand notation is possible and notifies you with the shortened version.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8-Digit HEX with Alpha Channel</h3>
            <p className="text-gray-700 mb-4">
              Modern web standards support 8-digit HEX notation that includes transparency. The additional two digits (AA) represent the alpha channel, controlling opacity from 00 (fully transparent) to FF (fully opaque). This format is particularly useful for:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li>Semi-transparent overlays and backgrounds</li>
              <li>Shadow effects and gradients</li>
              <li>Modern UI design with layered elements</li>
              <li>Cross-browser compatible transparency</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Common Use Cases</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li><strong>Web Development:</strong> Converting JavaScript color values to CSS HEX codes</li>
              <li><strong>Design Handoff:</strong> Translating design tool colors to web-ready formats</li>
              <li><strong>Color Branding:</strong> Creating consistent brand colors across platforms</li>
              <li><strong>Image Processing:</strong> Defining colors for pixel manipulation</li>
              <li><strong>UI Frameworks:</strong> Converting theme colors to HEX format</li>
              <li><strong>SVG Graphics:</strong> Setting fill and stroke colors</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Hexadecimal Number System</h3>
            <p className="text-gray-700 mb-4">
              Hexadecimal is a base-16 numbering system using digits 0-9 and letters A-F. Each hex digit represents four binary bits, making it compact for representing large numbers. The conversion chart:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4 font-mono text-sm">
              <div className="grid grid-cols-4 gap-2">
                <div>0=0, 1=1, 2=2, 3=3</div>
                <div>4=4, 5=5, 6=6, 7=7</div>
                <div>8=8, 9=9, A=10, B=11</div>
                <div>C=12, D=13, E=14, F=15</div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Browser and CSS Support</h3>
            <p className="text-gray-700 mb-4">
              HEX color notation is universally supported across all web browsers and has been part of CSS since its inception. Both 3-digit and 6-digit formats work in all browsers, while 8-digit HEX with alpha is supported in modern browsers (Chrome 62+, Firefox 49+, Safari 10+, Edge 79+). For maximum compatibility, consider using RGBA notation for transparency in older browsers.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Tips for Accurate Conversion</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li>Ensure RGB values are integers between 0 and 255</li>
              <li>Use sliders for quick color adjustments and experimentation</li>
              <li>Check the shorthand notification to use compact notation when possible</li>
              <li>Preview colors with transparency using the alpha slider</li>
              <li>Copy the appropriate format for your specific use case (CSS, 6-digit, etc.)</li>
              <li>Verify colors in your target application to ensure correct rendering</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">HEX Notation Best Practices</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li>Always include the # symbol in HEX codes for proper CSS parsing</li>
              <li>Use uppercase letters for consistency and readability</li>
              <li>Prefer 6-digit format for better clarity and universal support</li>
              <li>Document color values with comments in your stylesheets</li>
              <li>Consider using CSS custom properties for maintainable color systems</li>
              <li>Test colors for accessibility and contrast ratios</li>
            </ul>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                How do I convert RGB to HEX manually?
              </h3>
              <p className="text-gray-700">
                To convert manually, divide each RGB value by 16 to get the first hex digit (quotient) and the second hex digit (remainder). For example, RGB 255 = 255÷16 = 15 remainder 15, which equals FF in hex (F=15). For RGB 87: 87÷16 = 5 remainder 7 = 57 in hex. Combine all three: #FF5737. However, using our converter is much faster and eliminates calculation errors.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                What is the difference between 6-digit and 8-digit HEX?
              </h3>
              <p className="text-gray-700">
                6-digit HEX codes (like #FF5733) represent opaque colors with no transparency, containing only red, green, and blue channels. 8-digit HEX codes (like #FF5733FF) include an additional alpha channel (last two digits) that controls opacity, where 00 is fully transparent and FF is fully opaque. The 8-digit format is equivalent to RGBA in functionality.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                When should I use HEX shorthand notation?
              </h3>
              <p className="text-gray-700">
                Use 3-digit shorthand when both digits of each color channel are identical. For example, #FF00CC can be written as #F0C. Shorthand notation makes CSS more concise and is particularly useful for common colors like white (#FFF), black (#000), or grays. However, not all colors can be shortened - our converter will notify you when shorthand is possible for your selected color.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Can RGB and HEX represent the same colors exactly?
              </h3>
              <p className="text-gray-700">
                Yes, RGB and HEX represent exactly the same color space with the same precision. Both systems use 8 bits per channel (256 levels) for red, green, and blue, providing 16.7 million possible colors. The only difference is the notation system - RGB uses decimal (base 10) while HEX uses hexadecimal (base 16). The conversion is mathematically exact with no loss of color information.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Why is HEX notation more popular in CSS than RGB?
              </h3>
              <p className="text-gray-700">
                HEX notation is more compact and has been part of CSS since the beginning, making it the traditional standard for web colors. A 6-digit HEX code is shorter and often easier to read than rgb(255, 87, 51). However, RGB and RGBA have gained popularity because they're more intuitive for humans to understand and easier to adjust individual channels. Modern CSS allows both formats, so you can choose based on your preference.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                How do I handle RGB values outside the 0-255 range?
              </h3>
              <p className="text-gray-700">
                Valid RGB values must be integers between 0 and 255. Values outside this range are invalid and should be clamped - values below 0 become 0, and values above 255 become 255. Our converter automatically validates input and displays an error message if you enter invalid values. When working with percentages or floating-point values, multiply by 255 and round to the nearest integer before conversion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
