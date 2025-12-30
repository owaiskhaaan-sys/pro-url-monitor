import Head from 'next/head';
import { useState } from 'react';
import Layout from '../../components/Layout';

export default function HslToRgbConverter() {
  const [hue, setHue] = useState(210);
  const [saturation, setSaturation] = useState(80);
  const [lightness, setLightness] = useState(60);
  const [alpha, setAlpha] = useState(100);
  const [outputFormat, setOutputFormat] = useState('rgb'); // 'rgb', 'rgba', 'hex', 'css'
  const [error, setError] = useState('');

  const validateHue = (value) => {
    const num = parseInt(value);
    if (isNaN(num) || num < 0 || num > 360) {
      setError('Hue must be between 0 and 360');
      return false;
    }
    setHue(num);
    setError('');
    return true;
  };

  const validatePercentage = (value, setter, name) => {
    const num = parseInt(value);
    if (isNaN(num) || num < 0 || num > 100) {
      setError(`${name} must be between 0 and 100`);
      return false;
    }
    setter(num);
    setError('');
    return true;
  };

  const hslToRgb = (h, s, l) => {
    // Convert to 0-1 range
    s = s / 100;
    l = l / 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) {
      r = c; g = x; b = 0;
    } else if (h >= 60 && h < 120) {
      r = x; g = c; b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0; g = c; b = x;
    } else if (h >= 180 && h < 240) {
      r = 0; g = x; b = c;
    } else if (h >= 240 && h < 300) {
      r = x; g = 0; b = c;
    } else if (h >= 300 && h < 360) {
      r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return { r, g, b };
  };

  const rgbToHex = (r, g, b) => {
    const componentToHex = (c) => {
      const hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
  };

  const getFormattedOutput = () => {
    const rgb = hslToRgb(hue, saturation, lightness);
    const a = alpha / 100;

    switch (outputFormat) {
      case 'rgb':
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      case 'rgba':
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a.toFixed(2)})`;
      case 'hex':
        return rgbToHex(rgb.r, rgb.g, rgb.b).toUpperCase();
      case 'css':
        return `color: hsl(${hue}, ${saturation}%, ${lightness}%);`;
      default:
        return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const loadExample = () => {
    const examples = [
      { h: 0, s: 100, l: 50 },    // Red
      { h: 120, s: 100, l: 50 },  // Green
      { h: 240, s: 100, l: 50 },  // Blue
      { h: 60, s: 100, l: 50 },   // Yellow
      { h: 300, s: 100, l: 50 },  // Magenta
      { h: 180, s: 100, l: 50 }   // Cyan
    ];
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    setHue(randomExample.h);
    setSaturation(randomExample.s);
    setLightness(randomExample.l);
    setError('');
  };

  const loadPastelExample = () => {
    const examples = [
      { h: 350, s: 80, l: 80 },   // Pastel Pink
      { h: 200, s: 70, l: 75 },   // Pastel Blue
      { h: 140, s: 60, l: 80 },   // Pastel Green
      { h: 280, s: 65, l: 85 }    // Pastel Purple
    ];
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    setHue(randomExample.h);
    setSaturation(randomExample.s);
    setLightness(randomExample.l);
    setError('');
  };

  const rgb = hslToRgb(hue, saturation, lightness);
  const hexColor = rgbToHex(rgb.r, rgb.g, rgb.b);

  return (
    <Layout>
      <Head>
        <title>HSL to RGB Converter - Convert HSL Color to RGB Online | ProURLMonitor</title>
        <meta name="description" content="Free HSL to RGB converter. Convert HSL (Hue, Saturation, Lightness) color values to RGB instantly. Interactive sliders with real-time preview and multiple output formats." />
        <meta name="keywords" content="hsl to rgb, color converter, hsl color, rgb color, color code converter, css color, hsl converter" />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/hsl-to-rgb" />
        
        <meta property="og:title" content="HSL to RGB Converter - Convert HSL Color to RGB Online" />
        <meta property="og:description" content="Free HSL to RGB converter. Convert HSL color values to RGB instantly. Interactive sliders with real-time preview and multiple output formats." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://prourlmonitor.com/tools/hsl-to-rgb" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HSL to RGB Converter - Convert HSL Color to RGB Online" />
        <meta name="twitter:description" content="Free HSL to RGB converter. Convert HSL color values to RGB instantly with interactive sliders and real-time preview." />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">HSL to RGB Converter</h1>
          <p className="text-lg text-gray-600">
            Convert HSL (Hue, Saturation, Lightness) color values to RGB instantly
          </p>
        </div>

        {/* Converter Tool */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* HSL Input Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              HSL Values
            </label>
            
            {/* Hue */}
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <label className="text-sm font-semibold text-gray-700">Hue (H): {hue}°</label>
                <span className="text-xs text-gray-500">0-360</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={hue}
                onChange={(e) => setHue(parseInt(e.target.value))}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(0, 100%, 50%), 
                    hsl(60, 100%, 50%), 
                    hsl(120, 100%, 50%), 
                    hsl(180, 100%, 50%), 
                    hsl(240, 100%, 50%), 
                    hsl(300, 100%, 50%), 
                    hsl(360, 100%, 50%))`
                }}
              />
              <input
                type="number"
                min="0"
                max="360"
                value={hue}
                onChange={(e) => validateHue(e.target.value)}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Saturation */}
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <label className="text-sm font-semibold text-gray-700">Saturation (S): {saturation}%</label>
                <span className="text-xs text-gray-500">0-100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={saturation}
                onChange={(e) => setSaturation(parseInt(e.target.value))}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(${hue}, 0%, ${lightness}%), 
                    hsl(${hue}, 100%, ${lightness}%))`
                }}
              />
              <input
                type="number"
                min="0"
                max="100"
                value={saturation}
                onChange={(e) => validatePercentage(e.target.value, setSaturation, 'Saturation')}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Lightness */}
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <label className="text-sm font-semibold text-gray-700">Lightness (L): {lightness}%</label>
                <span className="text-xs text-gray-500">0-100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={lightness}
                onChange={(e) => setLightness(parseInt(e.target.value))}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(${hue}, ${saturation}%, 0%), 
                    hsl(${hue}, ${saturation}%, 50%), 
                    hsl(${hue}, ${saturation}%, 100%))`
                }}
              />
              <input
                type="number"
                min="0"
                max="100"
                value={lightness}
                onChange={(e) => validatePercentage(e.target.value, setLightness, 'Lightness')}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
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
                style={{ backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)` }}
              />
              <div 
                className="flex-1 h-32 rounded-lg border-2 border-gray-300 shadow-inner relative overflow-hidden"
                style={{ backgroundColor: `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha / 100})` }}
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

          {/* RGB Values Display */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RGB Values
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <div className="text-xs text-gray-600 mb-1">Red</div>
                <div className="text-2xl font-bold text-red-600">{rgb.r}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-xs text-gray-600 mb-1">Green</div>
                <div className="text-2xl font-bold text-green-600">{rgb.g}</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-xs text-gray-600 mb-1">Blue</div>
                <div className="text-2xl font-bold text-blue-600">{rgb.b}</div>
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
                onClick={() => setOutputFormat('rgb')}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  outputFormat === 'rgb' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                RGB
              </button>
              <button
                onClick={() => setOutputFormat('rgba')}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  outputFormat === 'rgba' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                RGBA
              </button>
              <button
                onClick={() => setOutputFormat('hex')}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  outputFormat === 'hex' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                HEX
              </button>
              <button
                onClick={() => setOutputFormat('css')}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  outputFormat === 'css' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                CSS HSL
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
              Load Primary Color
            </button>
            <button
              onClick={loadPastelExample}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Load Pastel
            </button>
            <button
              onClick={() => {
                setHue(210);
                setSaturation(80);
                setLightness(60);
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

        {/* Color Information */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-xs text-gray-600 mb-1">HSL</div>
            <div className="text-sm font-bold text-gray-800">{hue}°, {saturation}%, {lightness}%</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-xs text-gray-600 mb-1">RGB</div>
            <div className="text-sm font-bold text-gray-800">{rgb.r}, {rgb.g}, {rgb.b}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-xs text-gray-600 mb-1">HEX</div>
            <div className="text-sm font-bold text-gray-800 font-mono">{hexColor}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-xs text-gray-600 mb-1">HSLA</div>
            <div className="text-sm font-bold text-gray-800">{hue}°, {saturation}%, {lightness}%, {(alpha / 100).toFixed(2)}</div>
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About HSL to RGB Conversion</h2>
          
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">
              The HSL to RGB converter transforms HSL (Hue, Saturation, Lightness) color values into RGB (Red, Green, Blue) format. HSL is a more intuitive color model for humans as it separates color (hue) from intensity (saturation) and brightness (lightness), making it easier to create color variations and harmonious palettes. This tool helps designers and developers translate HSL values into the widely-used RGB format.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Understanding HSL Color Model</h3>
            <p className="text-gray-700 mb-4">
              HSL stands for Hue, Saturation, and Lightness - a cylindrical color model that represents colors in a way that's closer to human perception:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li><strong>Hue (H):</strong> The color type, measured in degrees from 0° to 360° on a color wheel (0°=red, 120°=green, 240°=blue)</li>
              <li><strong>Saturation (S):</strong> The intensity or purity of the color, from 0% (gray) to 100% (full color)</li>
              <li><strong>Lightness (L):</strong> The brightness of the color, from 0% (black) to 100% (white), with 50% being the pure color</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Why Use HSL?</h3>
            <p className="text-gray-700 mb-4">
              HSL is particularly useful for designers and developers because it makes color manipulation intuitive:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li>Adjust lightness to create tints and shades without changing the base color</li>
              <li>Modify saturation to create muted or vibrant versions of a color</li>
              <li>Change hue while maintaining the same brightness and intensity</li>
              <li>Create complementary colors by adding 180° to the hue value</li>
              <li>Generate analogous color schemes by adjusting hue by small amounts</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Conversion Algorithm</h3>
            <p className="text-gray-700 mb-4">
              Converting HSL to RGB involves a mathematical transformation that maps the cylindrical HSL color space to the cubic RGB color space:
            </p>
            <ol className="list-decimal list-inside text-gray-700 mb-4 ml-4">
              <li>Calculate chroma (color intensity) based on saturation and lightness</li>
              <li>Determine RGB intermediate values based on hue position on color wheel</li>
              <li>Apply lightness adjustment to convert to final RGB values</li>
              <li>Scale values from 0-1 range to 0-255 range for standard RGB</li>
            </ol>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Hue Color Wheel Explained</h3>
            <p className="text-gray-700 mb-4">
              The hue value represents position on the color wheel, with key positions at:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li><strong>0° / 360°:</strong> Red</li>
              <li><strong>60°:</strong> Yellow</li>
              <li><strong>120°:</strong> Green</li>
              <li><strong>180°:</strong> Cyan</li>
              <li><strong>240°:</strong> Blue</li>
              <li><strong>300°:</strong> Magenta</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Values between these positions create intermediate colors (e.g., 30° is orange, 270° is purple).
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Saturation Effects</h3>
            <p className="text-gray-700 mb-4">
              Saturation controls color intensity and vividness:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li><strong>0%:</strong> Complete desaturation, resulting in grayscale</li>
              <li><strong>25%:</strong> Muted, subtle colors - good for backgrounds</li>
              <li><strong>50%:</strong> Moderate color intensity - balanced appearance</li>
              <li><strong>75%:</strong> Vibrant colors - catches attention</li>
              <li><strong>100%:</strong> Pure, fully saturated color - maximum intensity</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Lightness Understanding</h3>
            <p className="text-gray-700 mb-4">
              Lightness determines how dark or bright a color appears:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li><strong>0%:</strong> Always black, regardless of hue or saturation</li>
              <li><strong>25%:</strong> Dark shades - good for depth and shadows</li>
              <li><strong>50%:</strong> Pure color at full intensity</li>
              <li><strong>75%:</strong> Light tints - pastels and highlights</li>
              <li><strong>100%:</strong> Always white, regardless of hue or saturation</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Common Use Cases</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li><strong>UI Design:</strong> Creating consistent color themes with variations</li>
              <li><strong>CSS Preprocessing:</strong> Converting Sass/LESS HSL to standard CSS RGB</li>
              <li><strong>Color Theory:</strong> Working with complementary and analogous color schemes</li>
              <li><strong>Accessibility:</strong> Adjusting lightness for proper contrast ratios</li>
              <li><strong>Brand Colors:</strong> Generating tints and shades from primary brand colors</li>
              <li><strong>Data Visualization:</strong> Creating color scales for charts and graphs</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">HSL in Modern CSS</h3>
            <p className="text-gray-700 mb-4">
              HSL is natively supported in all modern browsers and CSS specifications. You can use HSL directly in CSS with the hsl() function, or convert to RGB/HEX for broader compatibility. The syntax is:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4 font-mono text-sm">
              <div>color: hsl(210, 80%, 60%);</div>
              <div>background: hsla(210, 80%, 60%, 0.5);</div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Creating Color Harmonies</h3>
            <p className="text-gray-700 mb-4">
              HSL makes it easy to create harmonious color schemes by manipulating hue values:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li><strong>Complementary:</strong> Add or subtract 180° from base hue</li>
              <li><strong>Triadic:</strong> Add 120° and 240° to base hue</li>
              <li><strong>Analogous:</strong> Add/subtract 30° for adjacent colors</li>
              <li><strong>Split-complementary:</strong> Use 150° and 210° offsets</li>
              <li><strong>Monochromatic:</strong> Keep same hue, vary saturation and lightness</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Browser Support</h3>
            <p className="text-gray-700 mb-4">
              HSL color notation (hsl() and hsla()) is supported by all modern browsers including Chrome, Firefox, Safari, Edge, and Opera since 2010. It's part of the CSS3 specification and can be safely used in production. For older browser support, convert to RGB or HEX format.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Tips for Using HSL</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li>Use interactive sliders to visually explore color variations</li>
              <li>Keep saturation below 90% for more professional, less harsh colors</li>
              <li>For readable text, use lightness values below 40% or above 80%</li>
              <li>Create accessible color pairs by ensuring sufficient lightness contrast</li>
              <li>Store brand colors as HSL values for easy theme generation</li>
              <li>Use HSL for dynamic color generation in JavaScript applications</li>
            </ul>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                What's the difference between HSL and RGB?
              </h3>
              <p className="text-gray-700">
                RGB defines colors by mixing red, green, and blue light channels, while HSL defines colors using hue (color type), saturation (color intensity), and lightness (brightness). HSL is more intuitive for humans - you can easily create lighter or darker versions of a color by adjusting lightness, or make colors more vibrant by increasing saturation. RGB requires adjusting all three channels simultaneously to achieve similar effects.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Why should I use HSL instead of HEX or RGB?
              </h3>
              <p className="text-gray-700">
                HSL is superior for color manipulation and theme creation because it separates color properties. You can create entire color palettes by keeping hue constant and varying saturation and lightness. This makes it easy to generate tints, shades, and tones systematically. HSL is also better for creating accessible color combinations by controlling lightness contrast. However, for final implementation, you may need to convert to RGB or HEX for universal browser support.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                How do I create a lighter or darker version of an HSL color?
              </h3>
              <p className="text-gray-700">
                To create lighter versions (tints), increase the lightness value toward 100%. To create darker versions (shades), decrease the lightness value toward 0%. For example, hsl(210, 80%, 60%) can become a lighter tint at hsl(210, 80%, 80%) or a darker shade at hsl(210, 80%, 40%). Keep the hue and saturation the same to maintain the same base color. This is much simpler than trying to lighten or darken RGB values.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                What happens when lightness is 0% or 100%?
              </h3>
              <p className="text-gray-700">
                When lightness is 0%, the color is always pure black (RGB 0, 0, 0), regardless of hue or saturation values. When lightness is 100%, the color is always pure white (RGB 255, 255, 255). This is because lightness represents the amount of light: 0% means no light (black) and 100% means maximum light (white). The pure color appears at 50% lightness, which is why most vibrant colors use L=50%.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Can I use HSL colors directly in CSS?
              </h3>
              <p className="text-gray-700">
                Yes! Modern CSS fully supports HSL notation using the hsl() and hsla() functions. You can write color: hsl(210, 80%, 60%) or background: hsla(210, 80%, 60%, 0.5) directly in your stylesheets. This works in all current browsers. However, if you need to support very old browsers (pre-2010), you may need to convert to RGB or HEX format. HSL is particularly useful with CSS custom properties for creating dynamic color themes.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                How do I find complementary colors using HSL?
              </h3>
              <p className="text-gray-700">
                To find the complementary color in HSL, simply add or subtract 180° from the hue value (wrapping around at 360°). For example, if your color is hsl(30, 70%, 50%) (orange), the complementary color is hsl(210, 70%, 50%) (blue). This works because complementary colors are opposite each other on the color wheel. Keep the same saturation and lightness values to maintain visual balance between the complementary pair.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
