import Head from 'next/head';
import { useState } from 'react';
import Layout from '../../components/Layout';

export default function RgbToCmykConverter() {
  const [red, setRed] = useState(59);
  const [green, setGreen] = useState(130);
  const [blue, setBlue] = useState(246);
  const [alpha, setAlpha] = useState(100);
  const [outputFormat, setOutputFormat] = useState('percentage'); // 'percentage', 'decimal', 'css'
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

  const rgbToCmyk = (r, g, b) => {
    // Normalize RGB values to 0-1 range
    r = r / 255;
    g = g / 255;
    b = b / 255;

    // Calculate K (black)
    let k = 1 - Math.max(r, g, b);

    // If k is 1 (pure black), C, M, Y are 0
    if (k === 1) {
      return { c: 0, m: 0, y: 0, k: 100 };
    }

    // Calculate C, M, Y
    let c = (1 - r - k) / (1 - k);
    let m = (1 - g - k) / (1 - k);
    let y = (1 - b - k) / (1 - k);

    // Convert to percentages
    c = Math.round(c * 100);
    m = Math.round(m * 100);
    y = Math.round(y * 100);
    k = Math.round(k * 100);

    return { c, m, y, k };
  };

  const getTotalInkCoverage = (c, m, y, k) => {
    return c + m + y + k;
  };

  const getFormattedOutput = () => {
    const cmyk = rgbToCmyk(red, green, blue);

    switch (outputFormat) {
      case 'percentage':
        return `C:${cmyk.c}% M:${cmyk.m}% Y:${cmyk.y}% K:${cmyk.k}%`;
      case 'decimal':
        return `C:${(cmyk.c / 100).toFixed(2)} M:${(cmyk.m / 100).toFixed(2)} Y:${(cmyk.y / 100).toFixed(2)} K:${(cmyk.k / 100).toFixed(2)}`;
      case 'css':
        return `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
      default:
        return `${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k}`;
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const loadExample = () => {
    const examples = [
      { r: 255, g: 0, b: 0 },     // Red
      { r: 0, g: 255, b: 0 },     // Green
      { r: 0, g: 0, b: 255 },     // Blue
      { r: 255, g: 255, b: 0 },   // Yellow
      { r: 255, g: 0, b: 255 },   // Magenta
      { r: 0, g: 255, b: 255 }    // Cyan
    ];
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    setRed(randomExample.r);
    setGreen(randomExample.g);
    setBlue(randomExample.b);
    setError('');
  };

  const loadWebExample = () => {
    const examples = [
      { r: 52, g: 152, b: 219 },   // Twitter blue
      { r: 221, g: 75, b: 57 },    // Pinterest red
      { r: 0, g: 119, b: 181 },    // LinkedIn blue
      { r: 37, g: 211, b: 102 }    // WhatsApp green
    ];
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    setRed(randomExample.r);
    setGreen(randomExample.g);
    setBlue(randomExample.b);
    setError('');
  };

  const cmyk = rgbToCmyk(red, green, blue);
  const tic = getTotalInkCoverage(cmyk.c, cmyk.m, cmyk.y, cmyk.k);

  const getTICWarning = () => {
    if (tic > 400) return { level: 'error', message: 'Registration marks only - not for design' };
    if (tic > 340) return { level: 'error', message: 'Exceeds most printer limits!' };
    if (tic > 300) return { level: 'warning', message: 'Check with your printer' };
    if (tic > 240) return { level: 'caution', message: 'High coverage - may be acceptable' };
    return { level: 'safe', message: 'Safe for most printing' };
  };

  const ticWarning = getTICWarning();

  return (
    <Layout>
      <Head>
        <title>RGB to CMYK Converter - Convert RGB Color to CMYK Online | ProURLMonitor</title>
        <meta name="description" content="Free RGB to CMYK converter. Convert RGB (Red, Green, Blue) screen colors to CMYK (Cyan, Magenta, Yellow, Black) print colors instantly. Check Total Ink Coverage." />
        <meta name="keywords" content="rgb to cmyk, color converter, rgb color, cmyk color, digital to print, color conversion, print preparation" />
        <link rel="canonical" href="https://prourlmonitor.com/tools/rgb-to-cmyk" />
        
        <meta property="og:title" content="RGB to CMYK Converter - Convert RGB Color to CMYK Online" />
        <meta property="og:description" content="Free RGB to CMYK converter. Convert digital screen colors to print colors instantly with TIC warning." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://prourlmonitor.com/tools/rgb-to-cmyk" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="RGB to CMYK Converter - Convert RGB Color to CMYK Online" />
        <meta name="twitter:description" content="Free RGB to CMYK converter. Convert digital colors to print colors with Total Ink Coverage check." />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">RGB to CMYK Converter</h1>
          <p className="text-lg text-gray-600">
            Convert RGB (Red, Green, Blue) screen colors to CMYK (Cyan, Magenta, Yellow, Black) print colors
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
              Color Preview (Screen Display)
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
            <p className="text-xs text-gray-500 mt-2">
              ⚠️ Note: Printed color may appear different due to paper type, ink quality, and CMYK gamut limitations
            </p>
          </div>

          {/* CMYK Values Display */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CMYK Print Values
            </label>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-cyan-50 p-4 rounded-lg text-center border border-cyan-200">
                <div className="text-xs text-cyan-700 mb-1 font-semibold">Cyan</div>
                <div className="text-2xl font-bold text-cyan-900">{cmyk.c}%</div>
              </div>
              <div className="bg-pink-50 p-4 rounded-lg text-center border border-pink-200">
                <div className="text-xs text-pink-700 mb-1 font-semibold">Magenta</div>
                <div className="text-2xl font-bold text-pink-900">{cmyk.m}%</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center border border-yellow-200">
                <div className="text-xs text-yellow-700 mb-1 font-semibold">Yellow</div>
                <div className="text-2xl font-bold text-yellow-900">{cmyk.y}%</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-300">
                <div className="text-xs text-gray-700 mb-1 font-semibold">Black (K)</div>
                <div className="text-2xl font-bold text-gray-900">{cmyk.k}%</div>
              </div>
            </div>
          </div>

          {/* Total Ink Coverage */}
          <div className={`mb-6 p-4 rounded-lg border-2 ${
            ticWarning.level === 'error' ? 'bg-red-50 border-red-300' :
            ticWarning.level === 'warning' ? 'bg-orange-50 border-orange-300' :
            ticWarning.level === 'caution' ? 'bg-yellow-50 border-yellow-300' :
            'bg-green-50 border-green-300'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-sm font-semibold text-gray-700">Total Ink Coverage (TIC)</div>
                <div className={`text-3xl font-bold ${
                  ticWarning.level === 'error' ? 'text-red-700' :
                  ticWarning.level === 'warning' ? 'text-orange-700' :
                  ticWarning.level === 'caution' ? 'text-yellow-700' :
                  'text-green-700'
                }`}>
                  {tic}%
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-bold ${
                  ticWarning.level === 'error' ? 'text-red-700' :
                  ticWarning.level === 'warning' ? 'text-orange-700' :
                  ticWarning.level === 'caution' ? 'text-yellow-700' :
                  'text-green-700'
                }`}>
                  {ticWarning.message}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Typical limit: 300-340%
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-3 transition-all ${
                  ticWarning.level === 'error' ? 'bg-red-500' :
                  ticWarning.level === 'warning' ? 'bg-orange-500' :
                  ticWarning.level === 'caution' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min((tic / 400) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Output Format */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CMYK Output Format
            </label>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <button
                onClick={() => setOutputFormat('percentage')}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  outputFormat === 'percentage' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Percentage
              </button>
              <button
                onClick={() => setOutputFormat('decimal')}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  outputFormat === 'decimal' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Decimal
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
              onClick={loadWebExample}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Brand Colors
            </button>
            <button
              onClick={() => {
                setRed(59);
                setGreen(130);
                setBlue(246);
                setAlpha(100);
                setOutputFormat('percentage');
                setError('');
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Color Information */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-xs text-gray-600 mb-1">RGB (Screen)</div>
            <div className="text-sm font-bold text-gray-800">{red}, {green}, {blue}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-xs text-gray-600 mb-1">CMYK (Print)</div>
            <div className="text-sm font-bold text-gray-800">{cmyk.c}%, {cmyk.m}%, {cmyk.y}%, {cmyk.k}%</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-xs text-gray-600 mb-1">Ink Coverage</div>
            <div className={`text-sm font-bold ${
              ticWarning.level === 'error' ? 'text-red-600' :
              ticWarning.level === 'warning' ? 'text-orange-600' :
              ticWarning.level === 'caution' ? 'text-yellow-600' :
              'text-green-600'
            }`}>
              {tic}%
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About RGB to CMYK Conversion</h2>
          
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">
              The RGB to CMYK converter transforms RGB (Red, Green, Blue) screen colors into CMYK (Cyan, Magenta, Yellow, Black/Key) print colors. This conversion is essential when preparing digital designs for professional printing, as it helps predict how colors will appear in print and ensures your design stays within printable color ranges. Understanding this conversion prevents costly reprints and color disappointments.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Why Convert RGB to CMYK?</h3>
            <p className="text-gray-700 mb-4">
              Digital displays use RGB (additive color) while printers use CMYK (subtractive color). These are fundamentally different color models:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li><strong>RGB starts with black:</strong> Colors are created by adding light</li>
              <li><strong>CMYK starts with white:</strong> Colors are created by subtracting light from white paper</li>
              <li><strong>Different gamuts:</strong> RGB can display colors that CMYK cannot print</li>
              <li><strong>Preparation:</strong> Convert to CMYK before sending files to printers</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Conversion Formula</h3>
            <p className="text-gray-700 mb-4">
              The RGB to CMYK conversion follows this mathematical process:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4 font-mono text-sm">
              <div>K = 1 - max(R, G, B)</div>
              <div>C = (1 - R - K) / (1 - K)</div>
              <div>M = (1 - G - K) / (1 - K)</div>
              <div>Y = (1 - B - K) / (1 - K)</div>
              <div className="mt-2 text-xs text-gray-600">Where R, G, B are normalized to 0-1 range</div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Understanding Total Ink Coverage (TIC)</h3>
            <p className="text-gray-700 mb-4">
              Total Ink Coverage is the sum of all four CMYK percentages. This is crucial for print quality:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li><strong>0-240%:</strong> Safe for all printing processes</li>
              <li><strong>240-300%:</strong> Generally acceptable, may need adjustment</li>
              <li><strong>300-340%:</strong> Maximum for most offset printing (check with printer)</li>
              <li><strong>340-400%:</strong> Exceeds most printer capabilities, will cause problems</li>
              <li><strong>400%:</strong> Registration black only, never for actual design elements</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Color Gamut Limitations</h3>
            <p className="text-gray-700 mb-4">
              Not all RGB colors can be accurately reproduced in CMYK print:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li><strong>Bright neons:</strong> Cannot be printed in CMYK (require special inks)</li>
              <li><strong>Electric blues:</strong> Often appear duller in print</li>
              <li><strong>Bright oranges:</strong> May shift toward red or yellow</li>
              <li><strong>Vivid greens:</strong> Can appear more muted</li>
            </ul>
            <p className="text-gray-700 mb-4">
              These colors are "out of gamut" - they exist in RGB but not in CMYK. Our converter will provide the closest CMYK equivalent, but the printed result may differ from your screen.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Black Generation in CMYK</h3>
            <p className="text-gray-700 mb-4">
              When converting RGB to CMYK, black (K) is calculated first. This affects how other colors are generated:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li><strong>Maximum Black:</strong> Uses more K, less CMY (lower TIC, less expensive)</li>
              <li><strong>Minimum Black:</strong> Uses less K, more CMY (higher TIC, richer colors)</li>
              <li><strong>Our converter:</strong> Uses standard black generation for balanced results</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Common Use Cases</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li><strong>Print Preparation:</strong> Converting web designs for brochures, posters, business cards</li>
              <li><strong>Brand Guidelines:</strong> Creating print versions of digital brand colors</li>
              <li><strong>Prepress Work:</strong> Preparing files for commercial printing</li>
              <li><strong>Color Proofing:</strong> Checking if colors are within printable range</li>
              <li><strong>Design Adaptation:</strong> Repurposing digital graphics for print media</li>
              <li><strong>TIC Validation:</strong> Ensuring ink coverage is within printer limits</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Best Practices for Print Preparation</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li>Convert to CMYK early in the design process, not at the last minute</li>
              <li>Always request physical print proofs for color-critical projects</li>
              <li>Keep TIC below 300% for standard printing (check printer specifications)</li>
              <li>Use calibrated monitors for more accurate on-screen preview</li>
              <li>Avoid pure RGB colors like RGB(0, 255, 0) which don't print well</li>
              <li>Communicate with your printer about their color profile and TIC limits</li>
              <li>Consider paper type - coated vs uncoated affects color appearance</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Common Conversion Issues</h3>
            <p className="text-gray-700 mb-4">
              Watch out for these common problems:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li><strong>Color shift:</strong> Bright colors become duller in CMYK</li>
              <li><strong>High TIC:</strong> Dark colors may exceed ink limits</li>
              <li><strong>Black handling:</strong> RGB(0,0,0) converts to K=100%, not registration black</li>
              <li><strong>Gradients:</strong> May show banding in CMYK that wasn't visible in RGB</li>
              <li><strong>Transparency:</strong> Flattened differently in CMYK color space</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">When to Use This Converter</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li><strong>Before sending to printer:</strong> Check TIC and color values</li>
              <li><strong>Creating print versions:</strong> Convert digital brand colors</li>
              <li><strong>Print estimates:</strong> Calculate ink usage for quotes</li>
              <li><strong>Color matching:</strong> Find CMYK equivalents for screen colors</li>
              <li><strong>Design review:</strong> Identify problematic out-of-gamut colors</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Professional Workflow Tips</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li>Design in RGB, convert to CMYK for final output</li>
              <li>Save both RGB and CMYK versions of your files</li>
              <li>Use Pantone spot colors for brand-critical colors if possible</li>
              <li>Test print on actual paper stock before large runs</li>
              <li>Work with your printer's ICC color profile for best results</li>
              <li>Document color values for future reference and consistency</li>
            </ul>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Why does my printed color look different from my screen?
              </h3>
              <p className="text-gray-700">
                RGB and CMYK use fundamentally different methods to create color. RGB screens emit light (additive color), while CMYK printing reflects light from paper (subtractive color). Additionally, CMYK has a smaller color gamut than RGB, meaning some bright screen colors simply cannot be reproduced in print. Screen brightness, calibration, paper type, ink quality, and lighting conditions all affect the final appearance. This is why physical print proofs are essential for color-critical work.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                What is Total Ink Coverage and why does it matter?
              </h3>
              <p className="text-gray-700">
                Total Ink Coverage (TIC) is the sum of all four CMYK percentages. It matters because too much ink causes serious printing problems: ink doesn't dry properly, colors bleed together, paper becomes oversaturated and warps, and sheets stick together. Most printers limit TIC to 300-340%. Exceeding this causes rejected jobs and wasted materials. Always check TIC before sending files to print and reduce coverage if necessary by adjusting black generation or color values.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Can all RGB colors be converted to CMYK?
              </h3>
              <p className="text-gray-700">
                Yes, mathematically all RGB colors can be converted to CMYK values. However, many RGB colors are "out of gamut" - they cannot be accurately reproduced in CMYK printing. Bright neons, electric blues, and vivid oranges will convert to CMYK numbers, but the printed result will look duller and different from the screen. For these colors, consider using Pantone spot colors instead of process CMYK, or accept that the printed color will be an approximation.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Should I reduce high Total Ink Coverage values?
              </h3>
              <p className="text-gray-700">
                Yes, if your TIC exceeds your printer's limit (typically 300-340%), you must reduce it. You can lower TIC by reducing the black (K) component and increasing CMY slightly, or by adjusting the overall color to a lighter value. The best approach is to consult your printer's specifications before designing. Many professional design applications have tools to automatically reduce TIC while maintaining color appearance as much as possible.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                When should I convert from RGB to CMYK in my workflow?
              </h3>
              <p className="text-gray-700">
                Design in RGB and convert to CMYK near the end of your process, not at the beginning. Working in RGB gives you the full color range during the creative phase. Convert to CMYK when preparing final files for the printer, which allows you to see and adjust for any color shifts or gamut issues. Save a separate CMYK version for print while keeping your RGB master file. This workflow gives you flexibility while ensuring print-ready output.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                How accurate is this converter for professional printing?
              </h3>
              <p className="text-gray-700">
                Our converter uses standard RGB to CMYK conversion formulas and provides accurate mathematical conversions. However, actual print results depend on many factors: printer calibration, ink types, paper properties, ICC color profiles, and press conditions. For professional work, always use your printer's specific ICC profile in design software like Adobe Photoshop or Illustrator, and request physical proofs. Our converter is excellent for quick checks, color planning, and TIC validation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
