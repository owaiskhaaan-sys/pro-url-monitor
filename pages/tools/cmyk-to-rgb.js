import Head from 'next/head';
import { useState } from 'react';
import Layout from '../../components/Layout';

export default function CmykToRgbConverter() {
  const [cyan, setCyan] = useState(76);
  const [magenta, setMagenta] = useState(47);
  const [yellow, setYellow] = useState(0);
  const [black, setBlack] = useState(4);
  const [alpha, setAlpha] = useState(100);
  const [outputFormat, setOutputFormat] = useState('rgb'); // 'rgb', 'rgba', 'hex', 'css'
  const [error, setError] = useState('');

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

  const cmykToRgb = (c, m, y, k) => {
    // Convert percentages to 0-1 range
    c = c / 100;
    m = m / 100;
    y = y / 100;
    k = k / 100;

    // CMYK to RGB conversion formula
    const r = Math.round(255 * (1 - c) * (1 - k));
    const g = Math.round(255 * (1 - m) * (1 - k));
    const b = Math.round(255 * (1 - y) * (1 - k));

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
    const rgb = cmykToRgb(cyan, magenta, yellow, black);
    const a = alpha / 100;

    switch (outputFormat) {
      case 'rgb':
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      case 'rgba':
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a.toFixed(2)})`;
      case 'hex':
        return rgbToHex(rgb.r, rgb.g, rgb.b).toUpperCase();
      case 'css':
        return `color: rgb(${rgb.r}, ${rgb.g}, ${rgb.b});`;
      default:
        return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const loadExample = () => {
    const examples = [
      { c: 100, m: 0, y: 0, k: 0 },   // Cyan
      { c: 0, m: 100, y: 0, k: 0 },   // Magenta
      { c: 0, m: 0, y: 100, k: 0 },   // Yellow
      { c: 0, m: 0, y: 0, k: 100 },   // Black
      { c: 75, m: 68, y: 67, k: 90 }, // Rich Black
      { c: 15, m: 100, y: 90, k: 10 } // Red
    ];
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    setCyan(randomExample.c);
    setMagenta(randomExample.m);
    setYellow(randomExample.y);
    setBlack(randomExample.k);
    setError('');
  };

  const loadPrintExample = () => {
    const examples = [
      { c: 0, m: 0, y: 0, k: 0 },     // Paper white
      { c: 0, m: 0, y: 0, k: 100 },   // Registration black
      { c: 50, m: 0, y: 100, k: 0 },  // Lime green
      { c: 100, m: 100, y: 0, k: 0 }  // Process blue
    ];
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    setCyan(randomExample.c);
    setMagenta(randomExample.m);
    setYellow(randomExample.y);
    setBlack(randomExample.k);
    setError('');
  };

  const rgb = cmykToRgb(cyan, magenta, yellow, black);
  const hexColor = rgbToHex(rgb.r, rgb.g, rgb.b);

  return (
    <Layout>
      <Head>
        <title>CMYK to RGB Converter - Convert CMYK | ProURLMonitor</title>
        <meta name="description" content="Free CMYK to RGB converter. Convert CMYK (Cyan, Magenta, Yellow, Black) print colors to RGB screen colors instantly. Perfect for print to digital color..." />
        <meta name="keywords" content="cmyk to rgb, color converter, cmyk color, rgb color, print to digital, color conversion, cmyk converter" />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/cmyk-to-rgb" />
        
        <meta property="og:title" content="CMYK to RGB Converter - Convert CMYK Color to RGB Online" />
        <meta property="og:description" content="Free CMYK to RGB converter. Convert print colors to digital screen colors instantly with interactive sliders." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://prourlmonitor.com/tools/cmyk-to-rgb" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CMYK to RGB Converter - Convert CMYK Color to RGB Online" />
        <meta name="twitter:description" content="Free CMYK to RGB converter. Convert print colors to digital screen colors instantly." />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">CMYK to RGB Converter</h1>
          <p className="text-lg text-gray-600">
            Convert CMYK (Cyan, Magenta, Yellow, Black) print colors to RGB screen colors
          </p>
        </div>

        {/* Converter Tool */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* CMYK Input Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              CMYK Values (0-100%)
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* Cyan */}
              <div>
                <label className="block text-xs text-cyan-600 mb-1 font-semibold">Cyan (C): {cyan}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={cyan}
                  onChange={(e) => setCyan(parseInt(e.target.value))}
                  className="w-full mt-2"
                  style={{ accentColor: '#06b6d4' }}
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={cyan}
                  onChange={(e) => validatePercentage(e.target.value, setCyan, 'Cyan')}
                  className="w-full px-3 py-2 mt-2 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              {/* Magenta */}
              <div>
                <label className="block text-xs text-pink-600 mb-1 font-semibold">Magenta (M): {magenta}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={magenta}
                  onChange={(e) => setMagenta(parseInt(e.target.value))}
                  className="w-full mt-2"
                  style={{ accentColor: '#ec4899' }}
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={magenta}
                  onChange={(e) => validatePercentage(e.target.value, setMagenta, 'Magenta')}
                  className="w-full px-3 py-2 mt-2 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              {/* Yellow */}
              <div>
                <label className="block text-xs text-yellow-600 mb-1 font-semibold">Yellow (Y): {yellow}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={yellow}
                  onChange={(e) => setYellow(parseInt(e.target.value))}
                  className="w-full mt-2"
                  style={{ accentColor: '#eab308' }}
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={yellow}
                  onChange={(e) => validatePercentage(e.target.value, setYellow, 'Yellow')}
                  className="w-full px-3 py-2 mt-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              {/* Black (Key) */}
              <div>
                <label className="block text-xs text-gray-800 mb-1 font-semibold">Black/Key (K): {black}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={black}
                  onChange={(e) => setBlack(parseInt(e.target.value))}
                  className="w-full mt-2"
                  style={{ accentColor: '#000000' }}
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={black}
                  onChange={(e) => validatePercentage(e.target.value, setBlack, 'Black')}
                  className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
              Color Preview (RGB on Screen)
            </label>
            <div className="flex gap-4">
              <div 
                className="flex-1 h-32 rounded-lg border-2 border-gray-300 shadow-inner"
                style={{ backgroundColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` }}
              />
              <div 
                className="flex-1 h-32 rounded-lg border-2 border-gray-300 shadow-inner relative overflow-hidden"
                style={{ backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha / 100})` }}
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
              ⚠️ Note: Colors may appear different when printed due to CMYK limitations and paper properties
            </p>
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

          {/* CMYK Info Display */}
          <div className="mb-6 p-4 bg-gradient-to-r from-cyan-50 via-pink-50 via-yellow-50 to-gray-50 border border-gray-200 rounded-lg">
            <div className="text-sm text-gray-700 font-semibold mb-2">CMYK Print Values</div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <span className="text-xs text-cyan-700">C:</span>
                <span className="ml-1 font-bold text-cyan-900">{cyan}%</span>
              </div>
              <div>
                <span className="text-xs text-pink-700">M:</span>
                <span className="ml-1 font-bold text-pink-900">{magenta}%</span>
              </div>
              <div>
                <span className="text-xs text-yellow-700">Y:</span>
                <span className="ml-1 font-bold text-yellow-900">{yellow}%</span>
              </div>
              <div>
                <span className="text-xs text-gray-700">K:</span>
                <span className="ml-1 font-bold text-gray-900">{black}%</span>
              </div>
            </div>
          </div>

          {/* Output Format */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RGB Output Format
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
              onClick={loadPrintExample}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Print Colors
            </button>
            <button
              onClick={() => {
                setCyan(76);
                setMagenta(47);
                setYellow(0);
                setBlack(4);
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-xs text-gray-600 mb-1">CMYK</div>
            <div className="text-sm font-bold text-gray-800">{cyan}%, {magenta}%, {yellow}%, {black}%</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-xs text-gray-600 mb-1">RGB</div>
            <div className="text-sm font-bold text-gray-800">{rgb.r}, {rgb.g}, {rgb.b}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-xs text-gray-600 mb-1">HEX</div>
            <div className="text-sm font-bold text-gray-800 font-mono">{hexColor}</div>
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About CMYK to RGB Conversion</h2>
          
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">
              The CMYK to RGB converter transforms CMYK (Cyan, Magenta, Yellow, Black/Key) print colors to RGB (Red, Green, Blue) screen colors. CMYK is a subtractive color model used in printing, while RGB is an additive color model used for digital displays. This conversion is essential when adapting print designs for digital use or previewing how printed materials will appear on screen.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Understanding CMYK Color Model</h3>
            <p className="text-gray-700 mb-4">
              CMYK is the standard color model for commercial printing and uses four ink colors:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li><strong>Cyan (C):</strong> Blue-green ink, absorbs red light</li>
              <li><strong>Magenta (M):</strong> Purple-red ink, absorbs green light</li>
              <li><strong>Yellow (Y):</strong> Yellow ink, absorbs blue light</li>
              <li><strong>Black/Key (K):</strong> Black ink for depth and detail</li>
            </ul>
            <p className="text-gray-700 mb-4">
              CMYK is called "subtractive" because inks subtract wavelengths of light from white paper. Starting with white (all colors), each ink layer subtracts specific colors.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Why "K" for Black?</h3>
            <p className="text-gray-700 mb-4">
              The letter "K" stands for "Key" - the key plate in printing that carries the detail. Using "B" would be confusing with Blue in RGB. Black is crucial in CMYK because:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li>Mixing CMY creates muddy brown, not true black</li>
              <li>Black ink is cheaper than using three colors</li>
              <li>Black provides crisp text and sharp details</li>
              <li>Using separate black reduces ink coverage</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Conversion Formula</h3>
            <p className="text-gray-700 mb-4">
              Converting CMYK to RGB uses a mathematical formula based on ink absorption:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4 font-mono text-sm">
              <div>R = 255 × (1 - C) × (1 - K)</div>
              <div>G = 255 × (1 - M) × (1 - K)</div>
              <div>B = 255 × (1 - Y) × (1 - K)</div>
            </div>
            <p className="text-gray-700 mb-4">
              Where C, M, Y, K are values from 0 to 1 (percentages divided by 100).
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Print vs Screen Color Differences</h3>
            <p className="text-gray-700 mb-4">
              Colors often look different in print versus on screen due to fundamental differences:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li><strong>Color Gamut:</strong> RGB can display colors CMYK cannot print (like bright neons)</li>
              <li><strong>Light Source:</strong> Screens emit light; print reflects light from paper</li>
              <li><strong>Paper Properties:</strong> Paper color, texture, and coating affect appearance</li>
              <li><strong>Ink Properties:</strong> Different inks produce different results</li>
              <li><strong>Viewing Conditions:</strong> Ambient lighting affects printed color perception</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Common CMYK Color Values</h3>
            <p className="text-gray-700 mb-4">
              Standard CMYK combinations for common colors:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li><strong>Pure Cyan:</strong> C=100%, M=0%, Y=0%, K=0%</li>
              <li><strong>Pure Magenta:</strong> C=0%, M=100%, Y=0%, K=0%</li>
              <li><strong>Pure Yellow:</strong> C=0%, M=0%, Y=100%, K=0%</li>
              <li><strong>Rich Black:</strong> C=75%, M=68%, Y=67%, K=90%</li>
              <li><strong>Registration Black:</strong> C=100%, M=100%, Y=100%, K=100%</li>
              <li><strong>Paper White:</strong> C=0%, M=0%, Y=0%, K=0%</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Rich Black vs Registration Black</h3>
            <p className="text-gray-700 mb-4">
              Two types of black are commonly used in printing:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li><strong>Standard Black (K=100%):</strong> Black ink only, may appear faded on large areas</li>
              <li><strong>Rich Black:</strong> Black plus CMY for deeper, richer appearance in large areas</li>
              <li><strong>Registration Black:</strong> All four inks at 100%, used for registration marks only</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Common Use Cases</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li><strong>Print to Digital:</strong> Converting print designs for web or screen use</li>
              <li><strong>Color Proofing:</strong> Previewing how printed colors appear on screen</li>
              <li><strong>Design Adaptation:</strong> Repurposing print materials for digital platforms</li>
              <li><strong>Color Matching:</strong> Finding RGB equivalents of CMYK colors</li>
              <li><strong>Brand Guidelines:</strong> Translating brand colors from print to digital</li>
              <li><strong>Mockup Creation:</strong> Creating digital mockups of printed materials</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Conversion Limitations</h3>
            <p className="text-gray-700 mb-4">
              Be aware of these limitations when converting CMYK to RGB:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li>Not all RGB colors can be accurately printed in CMYK</li>
              <li>Conversion doesn't account for paper color or coating</li>
              <li>Different printers produce different results from same CMYK values</li>
              <li>Screen calibration affects how RGB colors appear</li>
              <li>Mathematical conversion is approximate; use physical proofs for critical work</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Total Ink Coverage (TIC)</h3>
            <p className="text-gray-700 mb-4">
              In professional printing, Total Ink Coverage matters:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li>TIC = C + M + Y + K (sum of all percentages)</li>
              <li>Maximum TIC is typically 300-400% depending on paper and press</li>
              <li>Exceeding TIC limits causes ink bleeding and drying issues</li>
              <li>Registration black (400% TIC) is only for registration marks</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Professional Workflow Tips</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li>Always request physical print proofs for color-critical projects</li>
              <li>Use calibrated monitors to improve on-screen accuracy</li>
              <li>Consult your printer about their specific CMYK color profiles</li>
              <li>Test print samples before large production runs</li>
              <li>Keep print and digital versions in separate files</li>
              <li>Document color values for both CMYK and RGB versions</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">When to Use CMYK vs RGB</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
              <li><strong>Use CMYK for:</strong> Print materials, brochures, magazines, packaging, offset printing</li>
              <li><strong>Use RGB for:</strong> Websites, digital displays, photography, video, screen graphics</li>
              <li><strong>Convert CMYK→RGB when:</strong> Adapting print designs for digital platforms</li>
              <li><strong>Convert RGB→CMYK when:</strong> Preparing digital designs for printing</li>
            </ul>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Why do CMYK colors look different on screen than in print?
              </h3>
              <p className="text-gray-700">
                CMYK and RGB use completely different color production methods. CMYK (printing) is subtractive - it absorbs light wavelengths from white paper. RGB (screens) is additive - it emits light directly. Additionally, screen colors are affected by brightness settings and calibration, while print colors depend on paper quality, ink properties, and lighting conditions. This fundamental difference means colors will never look exactly the same in both mediums.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Can all CMYK colors be converted to RGB accurately?
              </h3>
              <p className="text-gray-700">
                Yes, all CMYK colors can be mathematically converted to RGB values. However, the reverse isn't true - many bright RGB colors (especially neons and bright cyans) cannot be reproduced in CMYK printing. The CMYK color gamut is smaller than RGB's gamut, so while CMYK→RGB conversion always works, the resulting RGB color might represent something that looks different when printed than the original CMYK color intended.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                What is the difference between K=100% and rich black?
              </h3>
              <p className="text-gray-700">
                K=100% uses only black ink, which can appear grayish or washed out in large solid areas. Rich black adds cyan, magenta, and yellow (typically C=75%, M=68%, Y=67%, K=90%) to create a deeper, more saturated black. Rich black should only be used for large solid areas, never for text, as the multiple ink layers can cause registration issues and make text appear blurry.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                How accurate is CMYK to RGB conversion for color matching?
              </h3>
              <p className="text-gray-700">
                The mathematical conversion is accurate for creating RGB values that approximate the CMYK color. However, the final appearance depends on many factors: paper type, ink quality, printing process, screen calibration, and viewing conditions. For professional work requiring exact color matching, always use physical print proofs and calibrated monitors. Our converter provides a good approximation for general use and digital mockups.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Should I use CMYK values for my website design?
              </h3>
              <p className="text-gray-700">
                No, use RGB or HEX values for website design. Web browsers and digital displays use RGB color. However, if you're adapting a print brand identity to digital, you should convert the CMYK brand colors to RGB equivalents for consistency. Our converter helps you find the appropriate RGB values from your print CMYK specifications, though you may need to adjust them to achieve the desired appearance on screen.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                What is Total Ink Coverage and why does it matter?
              </h3>
              <p className="text-gray-700">
                Total Ink Coverage (TIC) is the sum of all four CMYK percentages. Most printers have a maximum TIC limit (typically 300-400%) to prevent ink from oversaturating the paper, which causes bleeding, poor drying, and ink offsetting. Registration black (400% TIC) should only be used for registration marks, never for design elements. When preparing files for printing, consult your printer about their TIC limits and adjust your colors accordingly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
