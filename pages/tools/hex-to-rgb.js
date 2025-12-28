import Head from 'next/head';
import { useState } from 'react';
import Layout from '../../components/Layout';

export default function HexToRgbConverter() {
  const [hexInput, setHexInput] = useState('#3B82F6');
  const [rgbOutput, setRgbOutput] = useState({ r: 59, g: 130, b: 246 });
  const [alpha, setAlpha] = useState(100);
  const [outputFormat, setOutputFormat] = useState('rgb'); // 'rgb', 'rgba', 'css'
  const [error, setError] = useState('');

  const hexToRgb = (hex) => {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Validate hex
    if (!/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$|^[0-9A-Fa-f]{8}$/.test(hex)) {
      return null;
    }
    
    // Expand shorthand (e.g., #FFF to #FFFFFF)
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    
    // Parse RGB values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Parse alpha if present (8-digit hex)
    let a = 1;
    if (hex.length === 8) {
      a = parseInt(hex.substring(6, 8), 16) / 255;
    }
    
    return { r, g, b, a };
  };

  const handleConvert = () => {
    const result = hexToRgb(hexInput);
    
    if (result) {
      setRgbOutput(result);
      setError('');
      if (result.a !== undefined) {
        setAlpha(Math.round(result.a * 100));
      }
    } else {
      setError('Invalid HEX color format. Use #RGB, #RRGGBB, or #RRGGBBAA');
    }
  };

  const handleHexChange = (e) => {
    setHexInput(e.target.value);
    setError('');
  };

  const getFormattedOutput = () => {
    const a = alpha / 100;
    
    switch (outputFormat) {
      case 'rgb':
        return `rgb(${rgbOutput.r}, ${rgbOutput.g}, ${rgbOutput.b})`;
      case 'rgba':
        return `rgba(${rgbOutput.r}, ${rgbOutput.g}, ${rgbOutput.b}, ${a.toFixed(2)})`;
      case 'css':
        return `color: rgba(${rgbOutput.r}, ${rgbOutput.g}, ${rgbOutput.b}, ${a.toFixed(2)});`;
      default:
        return `${rgbOutput.r}, ${rgbOutput.g}, ${rgbOutput.b}`;
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const loadExample = () => {
    const examples = ['#FF5733', '#3498DB', '#2ECC71', '#9B59B6', '#F39C12', '#E74C3C'];
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    setHexInput(randomExample);
    const result = hexToRgb(randomExample);
    if (result) {
      setRgbOutput(result);
      setError('');
    }
  };

  return (
    <Layout>
      <Head>
        <title>HEX to RGB Converter - Convert HEX Color to RGB Online | ProURLMonitor</title>
        <meta name="description" content="Free HEX to RGB converter. Convert hexadecimal color codes to RGB values instantly. Supports 3, 6, and 8-digit HEX codes with alpha channel. Copy RGB, RGBA, or CSS format." />
        <meta name="keywords" content="hex to rgb, color converter, hex color, rgb color, color code converter, css color, rgba converter" />
        <link rel="canonical" href="https://prourlmonitor.com/tools/hex-to-rgb" />
        
        <meta property="og:title" content="HEX to RGB Converter - Convert HEX Color to RGB Online" />
        <meta property="og:description" content="Free HEX to RGB converter. Convert hexadecimal color codes to RGB values instantly. Supports 3, 6, and 8-digit HEX codes with alpha channel." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://prourlmonitor.com/tools/hex-to-rgb" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HEX to RGB Converter - Convert HEX Color to RGB Online" />
        <meta name="twitter:description" content="Free HEX to RGB converter. Convert hexadecimal color codes to RGB values instantly. Supports 3, 6, and 8-digit HEX codes with alpha channel." />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">HEX to RGB Converter</h1>
          <p className="text-lg text-gray-600">
            Convert hexadecimal color codes to RGB values instantly
          </p>
        </div>

        {/* Converter Tool */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* Input Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              HEX Color Code
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={hexInput}
                onChange={handleHexChange}
                placeholder="#3B82F6"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <button
                onClick={handleConvert}
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Convert
              </button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* Color Preview */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Preview
            </label>
            <div className="flex gap-4">
              <div 
                className="w-32 h-32 rounded-lg border-2 border-gray-300 shadow-inner"
                style={{ backgroundColor: hexInput }}
              />
              <div 
                className="w-32 h-32 rounded-lg border-2 border-gray-300 shadow-inner"
                style={{ backgroundColor: `rgba(${rgbOutput.r}, ${rgbOutput.g}, ${rgbOutput.b}, ${alpha / 100})` }}
              />
            </div>
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

          {/* RGB Values */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RGB Values
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <div className="text-xs text-gray-600 mb-1">Red</div>
                <div className="text-2xl font-bold text-red-600">{rgbOutput.r}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-xs text-gray-600 mb-1">Green</div>
                <div className="text-2xl font-bold text-green-600">{rgbOutput.g}</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-xs text-gray-600 mb-1">Blue</div>
                <div className="text-2xl font-bold text-blue-600">{rgbOutput.b}</div>
              </div>
            </div>
          </div>

          {/* Output Format */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Output Format
            </label>
            <div className="flex gap-3 mb-3">
              <button
                onClick={() => setOutputFormat('rgb')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  outputFormat === 'rgb' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                RGB
              </button>
              <button
                onClick={() => setOutputFormat('rgba')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  outputFormat === 'rgba' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                RGBA
              </button>
              <button
                onClick={() => setOutputFormat('css')}
                className={`px-4 py-2 rounded-lg transition-colors ${
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
              onClick={() => {
                setHexInput('#3B82F6');
                setRgbOutput({ r: 59, g: 130, b: 246 });
                setAlpha(100);
                setOutputFormat('rgb');
                setError('');
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About HEX to RGB Conversion</h2>
          
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">
              The HEX to RGB converter is an essential tool for web developers, designers, and digital artists who need to convert hexadecimal color codes to RGB (Red, Green, Blue) values. This conversion is crucial for working across different design platforms and programming languages that use different color format standards.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">What is HEX Color Format?</h3>
            <p className="text-gray-700 mb-4">
              HEX (hexadecimal) is a color notation system used primarily in web design and CSS. A HEX color code consists of a hash symbol (#) followed by six hexadecimal digits. The first two digits represent the red channel, the middle two represent green, and the last two represent blue. Each pair can range from 00 (0 in decimal) to FF (255 in decimal).
            </p>
            <p className="text-gray-700 mb-4">
              For example, <code className="bg-gray-100 px-2 py-1 rounded">#FF5733</code> breaks down to:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li>Red: FF (255)</li>
              <li>Green: 57 (87)</li>
              <li>Blue: 33 (51)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Understanding RGB Color Model</h3>
            <p className="text-gray-700 mb-4">
              RGB (Red, Green, Blue) is an additive color model where colors are created by combining different intensities of red, green, and blue light. Each channel is represented by a value from 0 to 255, where 0 means no intensity and 255 means maximum intensity. This model is used extensively in digital displays, graphics software, and programming.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Conversion Process</h3>
            <p className="text-gray-700 mb-4">
              Converting HEX to RGB involves parsing the hexadecimal string and converting each two-digit pair to its decimal equivalent:
            </p>
            <ol className="list-decimal list-inside text-gray-700 mb-4 ml-4">
              <li>Remove the # symbol from the HEX code</li>
              <li>Split the code into three pairs (RR, GG, BB)</li>
              <li>Convert each hexadecimal pair to decimal (base 16 to base 10)</li>
              <li>The result is your RGB value</li>
            </ol>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Supported Formats</h3>
            <p className="text-gray-700 mb-4">
              Our converter supports multiple HEX color formats:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li><strong>3-digit HEX:</strong> Shorthand notation (e.g., #FFF = #FFFFFF)</li>
              <li><strong>6-digit HEX:</strong> Standard format (e.g., #3B82F6)</li>
              <li><strong>8-digit HEX:</strong> Includes alpha channel for transparency (e.g., #3B82F680)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Common Use Cases</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li><strong>Web Development:</strong> Converting CSS color codes to RGB for JavaScript manipulation</li>
              <li><strong>Graphic Design:</strong> Working with different software that requires RGB input</li>
              <li><strong>Image Processing:</strong> Programming image filters and color adjustments</li>
              <li><strong>UI/UX Design:</strong> Creating consistent color schemes across platforms</li>
              <li><strong>Digital Art:</strong> Translating colors between different digital mediums</li>
              <li><strong>Game Development:</strong> Defining colors in game engines and shaders</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Alpha Channel (Transparency)</h3>
            <p className="text-gray-700 mb-4">
              The alpha channel controls the transparency of a color, ranging from 0 (fully transparent) to 1 (fully opaque) in RGBA format, or 0% to 100% in percentage. Our converter includes an alpha slider that allows you to adjust transparency and see the result in real-time. This is particularly useful for creating semi-transparent overlays, shadows, and modern UI effects.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Output Formats</h3>
            <p className="text-gray-700 mb-4">
              Choose from different output formats based on your needs:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li><strong>RGB:</strong> Standard format for opaque colors - rgb(255, 87, 51)</li>
              <li><strong>RGBA:</strong> Includes alpha channel - rgba(255, 87, 51, 0.8)</li>
              <li><strong>CSS:</strong> Ready-to-use CSS property - color: rgba(255, 87, 51, 0.8);</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Tips for Color Conversion</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li>Always include the # symbol when entering HEX codes</li>
              <li>Use uppercase or lowercase letters - both work (e.g., #FF5733 or #ff5733)</li>
              <li>3-digit shorthand is automatically expanded (e.g., #F5A becomes #FF55AA)</li>
              <li>Preview colors before copying to ensure accuracy</li>
              <li>Use the alpha slider for RGBA values to control transparency</li>
              <li>Test colors in your target application to verify appearance</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Browser Compatibility</h3>
            <p className="text-gray-700 mb-4">
              RGB and RGBA color formats are supported by all modern web browsers including Chrome, Firefox, Safari, Edge, and Opera. RGB has been supported since CSS1, while RGBA was introduced in CSS3 and is now universally supported. This makes RGB/RGBA a reliable choice for cross-browser color definition.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                What is the difference between HEX and RGB?
              </h3>
              <p className="text-gray-700">
                HEX and RGB are two different ways to represent the same colors. HEX uses hexadecimal notation (base 16) with values from 00-FF, while RGB uses decimal notation (base 10) with values from 0-255. Both systems define colors using red, green, and blue channels, just with different numerical representations. HEX is more compact and commonly used in CSS, while RGB is more intuitive and used in many programming contexts.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Can I convert HEX colors with transparency?
              </h3>
              <p className="text-gray-700">
                Yes! Our converter supports 8-digit HEX codes that include an alpha channel for transparency. The last two digits of an 8-digit HEX code represent the alpha value (00 = transparent, FF = opaque). You can also manually adjust transparency using the alpha slider, which will generate the appropriate RGBA output.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                What does the 3-digit HEX shorthand mean?
              </h3>
              <p className="text-gray-700">
                3-digit HEX codes are a shorthand notation where each digit is doubled to create the full 6-digit code. For example, #FFF becomes #FFFFFF (white), #F5A becomes #FF55AA, and #369 becomes #336699. This shorthand is commonly used in CSS for convenience when both digits of each color channel are the same.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Why do we need to convert HEX to RGB?
              </h3>
              <p className="text-gray-700">
                Different platforms and programming languages have different color format preferences. While CSS primarily uses HEX, many JavaScript libraries, canvas operations, and graphics programming APIs require RGB values. Converting between formats ensures you can use colors consistently across different technologies and maintain accurate color reproduction in your projects.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Is there any color loss during HEX to RGB conversion?
              </h3>
              <p className="text-gray-700">
                No, there is no color loss when converting from HEX to RGB. Both formats represent the exact same color space and have the same precision (256 levels per channel). The conversion is a straightforward mathematical transformation from hexadecimal to decimal notation - you're simply changing how the same color values are represented, not the colors themselves.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Can I use RGB values in CSS?
              </h3>
              <p className="text-gray-700">
                Absolutely! CSS fully supports RGB and RGBA color values. You can use them anywhere you would use a HEX code, such as in color, background-color, border-color, and other color-accepting properties. The syntax is rgb(red, green, blue) for opaque colors or rgba(red, green, blue, alpha) for colors with transparency. Our CSS output format provides ready-to-use CSS property declarations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
