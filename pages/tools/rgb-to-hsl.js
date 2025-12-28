import Head from 'next/head';
import { useState } from 'react';
import Layout from '../../components/Layout';

export default function RgbToHslConverter() {
  const [red, setRed] = useState(59);
  const [green, setGreen] = useState(130);
  const [blue, setBlue] = useState(246);
  const [alpha, setAlpha] = useState(100);
  const [outputFormat, setOutputFormat] = useState('hsl'); // 'hsl', 'hsla', 'css', 'degrees'
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

  const rgbToHsl = (r, g, b) => {
    // Convert to 0-1 range
    r = r / 255;
    g = g / 255;
    b = b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    
    let h = 0;
    let s = 0;
    let l = (max + min) / 2;

    if (diff !== 0) {
      s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / diff + 2) / 6;
          break;
        case b:
          h = ((r - g) / diff + 4) / 6;
          break;
      }
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return { h, s, l };
  };

  const getFormattedOutput = () => {
    const hsl = rgbToHsl(red, green, blue);
    const a = alpha / 100;

    switch (outputFormat) {
      case 'hsl':
        return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
      case 'hsla':
        return `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${a.toFixed(2)})`;
      case 'css':
        return `background-color: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%);`;
      case 'degrees':
        return `${hsl.h}°, ${hsl.s}%, ${hsl.l}%`;
      default:
        return `${hsl.h}, ${hsl.s}%, ${hsl.l}%`;
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
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

  const loadGrayscaleExample = () => {
    const value = Math.floor(Math.random() * 256);
    setRed(value);
    setGreen(value);
    setBlue(value);
    setError('');
  };

  const hsl = rgbToHsl(red, green, blue);

  const getColorName = (h, s, l) => {
    if (l < 10) return 'Very Dark';
    if (l > 90) return 'Very Light';
    if (s < 10) return 'Grayscale';
    
    if (h < 15 || h >= 345) return 'Red';
    if (h < 45) return 'Orange';
    if (h < 75) return 'Yellow';
    if (h < 165) return 'Green';
    if (h < 195) return 'Cyan';
    if (h < 255) return 'Blue';
    if (h < 285) return 'Purple';
    return 'Magenta';
  };

  return (
    <Layout>
      <Head>
        <title>RGB to HSL Converter - Convert RGB Color to HSL Online | ProURLMonitor</title>
        <meta name="description" content="Free RGB to HSL converter. Convert RGB (Red, Green, Blue) color values to HSL (Hue, Saturation, Lightness) instantly. Interactive sliders with real-time preview." />
        <meta name="keywords" content="rgb to hsl, color converter, rgb color, hsl color, color code converter, css color, hsl converter" />
        <link rel="canonical" href="https://prourlmonitor.com/tools/rgb-to-hsl" />
        
        <meta property="og:title" content="RGB to HSL Converter - Convert RGB Color to HSL Online" />
        <meta property="og:description" content="Free RGB to HSL converter. Convert RGB color values to HSL instantly with interactive sliders and real-time preview." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://prourlmonitor.com/tools/rgb-to-hsl" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="RGB to HSL Converter - Convert RGB Color to HSL Online" />
        <meta name="twitter:description" content="Free RGB to HSL converter. Convert RGB color values to HSL instantly with interactive sliders and real-time preview." />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">RGB to HSL Converter</h1>
          <p className="text-lg text-gray-600">
            Convert RGB (Red, Green, Blue) color values to HSL (Hue, Saturation, Lightness)
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

          {/* HSL Values Display */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              HSL Values
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-purple-500 to-red-500 p-4 rounded-lg text-center">
                <div className="text-xs text-white font-semibold mb-1 drop-shadow-md">Hue</div>
                <div className="text-2xl font-bold text-white drop-shadow-md">{hsl.h}°</div>
              </div>
              <div className="bg-gradient-to-r from-gray-400 to-purple-500 p-4 rounded-lg text-center">
                <div className="text-xs text-white font-semibold mb-1 drop-shadow-md">Saturation</div>
                <div className="text-2xl font-bold text-white drop-shadow-md">{hsl.s}%</div>
              </div>
              <div className="bg-gradient-to-r from-black via-gray-500 to-white p-4 rounded-lg text-center">
                <div className="text-xs text-gray-700 font-semibold mb-1 drop-shadow-sm">Lightness</div>
                <div className="text-2xl font-bold text-gray-700 drop-shadow-sm">{hsl.l}%</div>
              </div>
            </div>
          </div>

          {/* Color Info */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-blue-800 font-semibold">Color Category</div>
                <div className="text-lg text-blue-900 font-bold">{getColorName(hsl.h, hsl.s, hsl.l)}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-800 font-semibold">HSL Notation</div>
                <div className="text-lg text-blue-900 font-bold font-mono">{hsl.h}°, {hsl.s}%, {hsl.l}%</div>
              </div>
            </div>
          </div>

          {/* Output Format */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Output Format
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <button
                onClick={() => setOutputFormat('hsl')}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  outputFormat === 'hsl' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                HSL
              </button>
              <button
                onClick={() => setOutputFormat('hsla')}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  outputFormat === 'hsla' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                HSLA
              </button>
              <button
                onClick={() => setOutputFormat('degrees')}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  outputFormat === 'degrees' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Degrees
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
              onClick={loadGrayscaleExample}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Load Grayscale
            </button>
            <button
              onClick={() => {
                setRed(59);
                setGreen(130);
                setBlue(246);
                setAlpha(100);
                setOutputFormat('hsl');
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
            <div className="text-xs text-gray-600 mb-1">RGB</div>
            <div className="text-sm font-bold text-gray-800">{red}, {green}, {blue}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-xs text-gray-600 mb-1">HSL</div>
            <div className="text-sm font-bold text-gray-800">{hsl.h}°, {hsl.s}%, {hsl.l}%</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-xs text-gray-600 mb-1">RGBA</div>
            <div className="text-sm font-bold text-gray-800">{red}, {green}, {blue}, {(alpha / 100).toFixed(2)}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-xs text-gray-600 mb-1">HSLA</div>
            <div className="text-sm font-bold text-gray-800">{hsl.h}°, {hsl.s}%, {hsl.l}%, {(alpha / 100).toFixed(2)}</div>
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About RGB to HSL Conversion</h2>
          
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">
              The RGB to HSL converter transforms RGB (Red, Green, Blue) color values into HSL (Hue, Saturation, Lightness) format. While RGB is the standard for digital displays, HSL provides a more intuitive way to understand and manipulate colors. This conversion is essential for designers who want to work with colors in a more human-friendly format while maintaining compatibility with digital systems.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Why Convert RGB to HSL?</h3>
            <p className="text-gray-700 mb-4">
              RGB values are how computers store and display colors, but they're not intuitive for humans to work with. HSL separates color into three understandable components:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li><strong>Hue:</strong> The actual color (red, blue, green, etc.) represented as degrees on a color wheel</li>
              <li><strong>Saturation:</strong> How pure or vivid the color is, from gray to full color</li>
              <li><strong>Lightness:</strong> How bright or dark the color is, from black to white</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Understanding the Conversion</h3>
            <p className="text-gray-700 mb-4">
              Converting RGB to HSL involves several mathematical steps:
            </p>
            <ol className="list-decimal list-inside text-gray-700 mb-4 ml-4">
              <li>Normalize RGB values from 0-255 range to 0-1 range</li>
              <li>Find the maximum and minimum values among R, G, and B</li>
              <li>Calculate lightness as the average of max and min values</li>
              <li>Calculate saturation based on the difference between max and min</li>
              <li>Calculate hue based on which RGB component is dominant</li>
              <li>Convert hue to degrees (0-360°) and saturation/lightness to percentages</li>
            </ol>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Hue Calculation Details</h3>
            <p className="text-gray-700 mb-4">
              Hue is determined by which RGB component has the highest value:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li><strong>Red is maximum:</strong> Hue is based on the relationship between green and blue</li>
              <li><strong>Green is maximum:</strong> Hue is in the green-cyan range</li>
              <li><strong>Blue is maximum:</strong> Hue is in the blue-magenta range</li>
              <li><strong>All equal:</strong> No hue (grayscale), saturation is 0%</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Saturation Explained</h3>
            <p className="text-gray-700 mb-4">
              Saturation represents color intensity and is calculated differently based on lightness:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li><strong>0% Saturation:</strong> Completely desaturated (grayscale) - all RGB values are equal</li>
              <li><strong>50% Saturation:</strong> Moderate color intensity with some gray mixed in</li>
              <li><strong>100% Saturation:</strong> Pure, vivid color with no gray component</li>
            </ul>
            <p className="text-gray-700 mb-4">
              When RGB values are very different, saturation is high. When they're similar, saturation is low.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Lightness Understanding</h3>
            <p className="text-gray-700 mb-4">
              Lightness is the average of the highest and lowest RGB values:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li><strong>0% Lightness:</strong> RGB(0, 0, 0) - Black</li>
              <li><strong>50% Lightness:</strong> Full color intensity at maximum saturation</li>
              <li><strong>100% Lightness:</strong> RGB(255, 255, 255) - White</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Grayscale Colors</h3>
            <p className="text-gray-700 mb-4">
              When all three RGB values are equal, the color is grayscale (achromatic):
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li>Hue is undefined (typically set to 0°)</li>
              <li>Saturation is always 0%</li>
              <li>Lightness varies from 0% (black) to 100% (white)</li>
              <li>Example: RGB(128, 128, 128) = HSL(0°, 0%, 50%) - middle gray</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Common Use Cases</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li><strong>Design Systems:</strong> Creating consistent color palettes with systematic variations</li>
              <li><strong>Color Manipulation:</strong> Adjusting brightness or saturation without affecting base color</li>
              <li><strong>Accessibility:</strong> Checking and adjusting lightness for proper contrast ratios</li>
              <li><strong>Theme Generation:</strong> Creating light and dark modes by adjusting lightness</li>
              <li><strong>Image Processing:</strong> Analyzing and modifying colors in photographs</li>
              <li><strong>Color Analysis:</strong> Understanding color composition for branding and design</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Benefits of HSL Over RGB</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li><strong>Intuitive Adjustments:</strong> Easy to make colors lighter, darker, more or less saturated</li>
              <li><strong>Color Relationships:</strong> Simple to find complementary and analogous colors</li>
              <li><strong>Consistency:</strong> Maintain color identity while varying intensity and brightness</li>
              <li><strong>Accessibility:</strong> Easier to ensure sufficient contrast for readability</li>
              <li><strong>Design Flexibility:</strong> Create entire color schemes from a single base hue</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Working with HSL in CSS</h3>
            <p className="text-gray-700 mb-4">
              Modern CSS fully supports HSL notation, making it easy to use converted values directly in stylesheets:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4 font-mono text-sm">
              <div>color: hsl(210, 76%, 60%);</div>
              <div>background: hsla(210, 76%, 60%, 0.8);</div>
              <div>border-color: hsl(210, 76%, 40%);</div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Conversion Accuracy</h3>
            <p className="text-gray-700 mb-4">
              RGB to HSL conversion is mathematically precise and reversible. Converting RGB → HSL → RGB will return you to the original color (within rounding constraints). However, be aware that:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li>HSL values are typically rounded to whole numbers for display</li>
              <li>Some precision may be lost in the conversion process</li>
              <li>Grayscale colors have undefined hue values</li>
              <li>Very dark or very light colors may show unexpected saturation values</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Tips for Using RGB to HSL</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li>Use sliders for real-time color exploration and experimentation</li>
              <li>Compare RGB and HSL values to understand color composition</li>
              <li>Note the hue value to find related colors on the color wheel</li>
              <li>Check saturation to understand color purity and vibrancy</li>
              <li>Use lightness values to ensure accessibility and readability</li>
              <li>Convert brand colors to HSL for easier theme variations</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Browser Compatibility</h3>
            <p className="text-gray-700 mb-4">
              HSL color notation is supported by all modern web browsers including Chrome, Firefox, Safari, Edge, and Opera. Both hsl() and hsla() functions have been part of CSS3 since 2010 and can be safely used in production websites. For legacy browser support (pre-2010), you may need to provide RGB fallbacks.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                How do I convert RGB to HSL manually?
              </h3>
              <p className="text-gray-700">
                Manual conversion is complex and involves multiple steps. First, divide all RGB values by 255 to normalize them. Find the maximum and minimum values. Calculate lightness as (max + min) / 2. Calculate saturation based on the difference between max and min, adjusted for lightness. Finally, calculate hue based on which RGB component is largest, using specific formulas for each case. Our converter does all this instantly and accurately.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                What happens to grayscale colors in HSL?
              </h3>
              <p className="text-gray-700">
                When RGB values are equal (grayscale), the resulting HSL has 0% saturation and undefined hue (usually shown as 0°). Only lightness varies: RGB(0,0,0) becomes HSL(0°, 0%, 0%) for black, RGB(128,128,128) becomes HSL(0°, 0%, 50%) for gray, and RGB(255,255,255) becomes HSL(0°, 0%, 100%) for white. The hue value is meaningless for grayscale colors since there's no actual color present.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Why is HSL better for color manipulation than RGB?
              </h3>
              <p className="text-gray-700">
                HSL separates color properties into intuitive components. To make a color lighter, you simply increase the L value. To make it more vivid, increase S. To change the color type, adjust H. In RGB, making a color lighter requires proportionally increasing all three values, which is not intuitive. HSL makes it easy to create consistent color variations, generate themes, and maintain color relationships - essential for design systems and branding.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Can I convert RGB to HSL and back without losing color information?
              </h3>
              <p className="text-gray-700">
                Yes, RGB to HSL conversion is mathematically reversible. However, rounding may introduce minor variations. When HSL values are rounded to whole numbers (common in CSS), converting HSL back to RGB may result in slightly different RGB values (typically ±1 or 2). For most practical purposes, this difference is imperceptible. If you need exact color preservation, store the original RGB values or use higher precision HSL values.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                How do I use HSL values in my CSS?
              </h3>
              <p className="text-gray-700">
                Simply use the hsl() or hsla() function in your CSS. For example: color: hsl(210, 76%, 60%); or background: hsla(210, 76%, 60%, 0.5); for semi-transparency. HSL is particularly useful with CSS custom properties: define --primary-hue: 210; then use hsl(var(--primary-hue), 76%, 60%) to create color systems where you can change the entire theme by adjusting one hue value.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                What's the difference between lightness in HSL and brightness?
              </h3>
              <p className="text-gray-700">
                Lightness (L in HSL) is different from perceived brightness. Lightness is a mathematical calculation: pure colors appear at 50% lightness, black at 0%, and white at 100%. However, human eyes perceive different hues as having different brightness even at the same lightness. For example, yellow at 50% lightness looks brighter than blue at 50% lightness. For accessibility and contrast calculations, consider using perceptual color spaces or luminance calculations instead of relying solely on HSL lightness.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
