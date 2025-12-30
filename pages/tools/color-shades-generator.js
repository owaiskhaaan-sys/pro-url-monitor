import Head from 'next/head';
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';

export default function ColorShadesGenerator() {
  const [baseColor, setBaseColor] = useState('#3B82F6');
  const [shadeCount, setShadeCount] = useState(5);
  const [tints, setTints] = useState([]);
  const [shades, setShades] = useState([]);
  const [tones, setTones] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    generateVariations();
  }, [baseColor, shadeCount]);

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  const hslToRgb = (h, s, l) => {
    h = h / 360;
    s = s / 100;
    l = l / 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  const rgbToHex = (r, g, b) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  const generateVariations = () => {
    const rgb = hexToRgb(baseColor);
    if (!rgb) return;

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    // Generate tints (lighter - increase lightness)
    const tintColors = [];
    for (let i = 1; i <= shadeCount; i++) {
      const lightnessIncrease = (100 - hsl.l) * (i / (shadeCount + 1));
      const newLightness = Math.min(hsl.l + lightnessIncrease, 95);
      const tintRgb = hslToRgb(hsl.h, hsl.s, newLightness);
      tintColors.push({
        hex: rgbToHex(tintRgb.r, tintRgb.g, tintRgb.b),
        rgb: `rgb(${tintRgb.r}, ${tintRgb.g}, ${tintRgb.b})`,
        hsl: `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(newLightness)}%)`,
        values: { ...tintRgb, h: hsl.h, s: hsl.s, l: newLightness }
      });
    }
    setTints(tintColors);

    // Generate shades (darker - decrease lightness)
    const shadeColors = [];
    for (let i = 1; i <= shadeCount; i++) {
      const lightnessDecrease = hsl.l * (i / (shadeCount + 1));
      const newLightness = Math.max(hsl.l - lightnessDecrease, 5);
      const shadeRgb = hslToRgb(hsl.h, hsl.s, newLightness);
      shadeColors.push({
        hex: rgbToHex(shadeRgb.r, shadeRgb.g, shadeRgb.b),
        rgb: `rgb(${shadeRgb.r}, ${shadeRgb.g}, ${shadeRgb.b})`,
        hsl: `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(newLightness)}%)`,
        values: { ...shadeRgb, h: hsl.h, s: hsl.s, l: newLightness }
      });
    }
    setShades(shadeColors);

    // Generate tones (desaturated - decrease saturation)
    const toneColors = [];
    for (let i = 1; i <= shadeCount; i++) {
      const saturationDecrease = hsl.s * (i / (shadeCount + 1));
      const newSaturation = Math.max(hsl.s - saturationDecrease, 0);
      const toneRgb = hslToRgb(hsl.h, newSaturation, hsl.l);
      toneColors.push({
        hex: rgbToHex(toneRgb.r, toneRgb.g, toneRgb.b),
        rgb: `rgb(${toneRgb.r}, ${toneRgb.g}, ${toneRgb.b})`,
        hsl: `hsl(${Math.round(hsl.h)}, ${Math.round(newSaturation)}%, ${Math.round(hsl.l)}%)`,
        values: { ...toneRgb, h: hsl.h, s: newSaturation, l: hsl.l }
      });
    }
    setTones(toneColors);
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAllVariations = () => {
    const allColors = [
      ...tints.map((c, i) => `Tint ${i + 1}: ${c.hex}`),
      `Base: ${baseColor}`,
      ...shades.map((c, i) => `Shade ${i + 1}: ${c.hex}`),
      ...tones.map((c, i) => `Tone ${i + 1}: ${c.hex}`)
    ].join('\n');
    navigator.clipboard.writeText(allColors);
  };

  const loadRandomColor = () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setBaseColor(randomColor);
  };

  const loadBrandColor = () => {
    const brandColors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
    const randomBrand = brandColors[Math.floor(Math.random() * brandColors.length)];
    setBaseColor(randomBrand);
  };

  const ColorSwatch = ({ color, label, type, index }) => (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div
        className="w-full h-24 cursor-pointer relative group"
        style={{ backgroundColor: color.hex }}
        onClick={() => copyToClipboard(color.hex, `${type}-${index}`)}
      >
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity flex items-center justify-center">
          <span className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100">Click to copy</span>
        </div>
      </div>
      <div className="p-2">
        <div className="text-xs font-semibold text-gray-700 mb-2">{label}</div>
        <button
          onClick={() => copyToClipboard(color.hex, `${type}-${index}-hex`)}
          className="w-full text-left text-xs font-mono bg-gray-50 px-2 py-1 rounded border border-gray-200 hover:bg-gray-100 transition-colors mb-1"
        >
          {color.hex}
          {copiedIndex === `${type}-${index}-hex` && (
            <span className="float-right text-green-600">✓</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <Layout>
      <Head>
        <title>Color Shades Generator - Create Tints, Shades & Tones Online | ProURLMonitor</title>
        <meta name="description" content="Free color shades generator. Create tints (lighter), shades (darker), and tones (muted) variations of any color. Perfect for creating cohesive color systems." />
        <meta name="keywords" content="color shades, tints and shades, color variations, color tones, color lightness, design system colors, color palette" />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/color-shades-generator" />
        
        <meta property="og:title" content="Color Shades Generator - Create Tints, Shades & Tones Online" />
        <meta property="og:description" content="Generate beautiful color variations. Create tints, shades, and tones from any base color for cohesive design systems." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://prourlmonitor.com/tools/color-shades-generator" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Color Shades Generator - Create Tints, Shades & Tones" />
        <meta name="twitter:description" content="Generate tints, shades, and tones from any color for beautiful design systems." />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Color Shades Generator</h1>
          <p className="text-lg text-gray-600">
            Generate tints (lighter), shades (darker), and tones (muted) variations of any color
          </p>
        </div>

        {/* Generator Tool */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* Base Color Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Base Color
            </label>
            <div className="flex gap-4 items-center">
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-20 h-20 rounded-lg cursor-pointer border-2 border-gray-300"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono"
                  placeholder="#3B82F6"
                />
                <p className="text-xs text-gray-500 mt-1">Enter HEX color code</p>
              </div>
              <button
                onClick={loadRandomColor}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Random
              </button>
              <button
                onClick={loadBrandColor}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Brand
              </button>
            </div>
          </div>

          {/* Variation Count */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Variations per type: {shadeCount}
            </label>
            <input
              type="range"
              min="3"
              max="10"
              value={shadeCount}
              onChange={(e) => setShadeCount(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Copy All Button */}
          <div className="mb-6 text-right">
            <button
              onClick={copyAllVariations}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Copy All Colors
            </button>
          </div>

          {/* Tints Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 flex-1 bg-gradient-to-r from-white to-blue-500 rounded"></div>
              <h3 className="text-lg font-bold text-gray-800">Tints (Lighter)</h3>
              <div className="h-1 flex-1 bg-gradient-to-l from-white to-blue-500 rounded"></div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Tints are created by adding white (increasing lightness). Perfect for backgrounds and subtle variations.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {tints.map((color, index) => (
                <ColorSwatch
                  key={index}
                  color={color}
                  label={`Tint ${index + 1}`}
                  type="tint"
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* Base Color Display */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 flex-1 bg-gray-300 rounded"></div>
              <h3 className="text-lg font-bold text-gray-800">Base Color</h3>
              <div className="h-1 flex-1 bg-gray-300 rounded"></div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden border-2 border-blue-500 shadow-lg max-w-xs mx-auto">
              <div
                className="w-full h-32 cursor-pointer"
                style={{ backgroundColor: baseColor }}
                onClick={() => copyToClipboard(baseColor, 'base')}
              />
              <div className="p-4 bg-blue-50">
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Original Color</div>
                  <button
                    onClick={() => copyToClipboard(baseColor, 'base-hex')}
                    className="text-lg font-mono font-bold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {baseColor}
                    {copiedIndex === 'base-hex' && (
                      <span className="ml-2 text-green-600">✓</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Shades Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 flex-1 bg-gradient-to-r from-blue-500 to-black rounded"></div>
              <h3 className="text-lg font-bold text-gray-800">Shades (Darker)</h3>
              <div className="h-1 flex-1 bg-gradient-to-l from-blue-500 to-black rounded"></div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Shades are created by adding black (decreasing lightness). Great for text, borders, and emphasis.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {shades.map((color, index) => (
                <ColorSwatch
                  key={index}
                  color={color}
                  label={`Shade ${index + 1}`}
                  type="shade"
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* Tones Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 flex-1 bg-gradient-to-r from-blue-500 to-gray-400 rounded"></div>
              <h3 className="text-lg font-bold text-gray-800">Tones (Muted)</h3>
              <div className="h-1 flex-1 bg-gradient-to-l from-blue-500 to-gray-400 rounded"></div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Tones are created by adding gray (decreasing saturation). Ideal for sophisticated, muted designs.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {tones.map((color, index) => (
                <ColorSwatch
                  key={index}
                  color={color}
                  label={`Tone ${index + 1}`}
                  type="tone"
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={generateVariations}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Regenerate
            </button>
            <button
              onClick={loadRandomColor}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Random Color
            </button>
            <button
              onClick={() => {
                setBaseColor('#3B82F6');
                setShadeCount(5);
              }}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Visual Comparison */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Visual Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Tints Scale</h3>
              <div className="space-y-1">
                {tints.map((color, i) => (
                  <div key={i} className="h-8 rounded" style={{ backgroundColor: color.hex }} />
                ))}
                <div className="h-8 rounded border-2 border-blue-500" style={{ backgroundColor: baseColor }} />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Shades Scale</h3>
              <div className="space-y-1">
                <div className="h-8 rounded border-2 border-blue-500" style={{ backgroundColor: baseColor }} />
                {shades.map((color, i) => (
                  <div key={i} className="h-8 rounded" style={{ backgroundColor: color.hex }} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Tones Scale</h3>
              <div className="space-y-1">
                <div className="h-8 rounded border-2 border-blue-500" style={{ backgroundColor: baseColor }} />
                {tones.map((color, i) => (
                  <div key={i} className="h-8 rounded" style={{ backgroundColor: color.hex }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding Tints, Shades, and Tones</h2>
          
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">
              Tints, shades, and tones are fundamental concepts in color theory that help designers create cohesive color systems. Understanding these variations allows you to build entire color palettes from a single base color, ensuring consistency and harmony throughout your designs. These variations are essential for creating depth, hierarchy, and visual interest while maintaining brand consistency.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">What Are Tints?</h3>
            <p className="text-gray-700 mb-4">
              Tints are created by adding white to a color, which increases its lightness while maintaining the same hue and saturation. Tints become progressively lighter and more pastel-like as more white is added.
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-2">
              <li><strong>Technical definition:</strong> Increasing the lightness (L) value in HSL color space</li>
              <li><strong>Visual effect:</strong> Colors become softer, lighter, and more delicate</li>
              <li><strong>Common uses:</strong> Backgrounds, hover states, subtle UI elements, card backgrounds</li>
              <li><strong>Design impact:</strong> Creates a calm, airy feeling; perfect for spacious designs</li>
              <li><strong>Accessibility note:</strong> Very light tints may lack sufficient contrast for text</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">What Are Shades?</h3>
            <p className="text-gray-700 mb-4">
              Shades are created by adding black to a color, which decreases its lightness while keeping hue and saturation constant. Shades become progressively darker and more intense as more black is added.
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-2">
              <li><strong>Technical definition:</strong> Decreasing the lightness (L) value in HSL color space</li>
              <li><strong>Visual effect:</strong> Colors become deeper, richer, and more dramatic</li>
              <li><strong>Common uses:</strong> Text, borders, active states, headers, emphasis elements</li>
              <li><strong>Design impact:</strong> Adds weight and seriousness; creates visual hierarchy</li>
              <li><strong>Accessibility note:</strong> Dark shades provide excellent contrast for light backgrounds</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">What Are Tones?</h3>
            <p className="text-gray-700 mb-4">
              Tones are created by adding gray to a color, which decreases its saturation while maintaining lightness and hue. Tones become progressively more muted and sophisticated as saturation decreases.
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-2">
              <li><strong>Technical definition:</strong> Decreasing the saturation (S) value in HSL color space</li>
              <li><strong>Visual effect:</strong> Colors become less vibrant, more subtle and sophisticated</li>
              <li><strong>Common uses:</strong> Disabled states, secondary elements, neutral backgrounds, elegant designs</li>
              <li><strong>Design impact:</strong> Creates refinement and restraint; less demanding on the eye</li>
              <li><strong>Accessibility note:</strong> Tones work well for creating sufficient but not harsh contrast</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Building a Design System with Variations</h3>
            <p className="text-gray-700 mb-4">
              Modern design systems typically include 5-10 variations of each main color. Here's how to use them effectively:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-2">
              <li><strong>50 (lightest tint):</strong> Very subtle backgrounds, hover states on white</li>
              <li><strong>100-200 (light tints):</strong> Card backgrounds, alternating row colors</li>
              <li><strong>300-400 (mid-light tints):</strong> Borders, dividers, disabled backgrounds</li>
              <li><strong>500 (base color):</strong> Primary buttons, links, brand elements</li>
              <li><strong>600-700 (light shades):</strong> Hover states on buttons, active elements</li>
              <li><strong>800-900 (dark shades):</strong> Text, headers, high-emphasis content</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Practical Applications</h3>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h4 className="font-bold text-gray-800 mb-2">Web Design</h4>
              <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 ml-2">
                <li>Use tints for page backgrounds and sections</li>
                <li>Use base color for primary actions (buttons, links)</li>
                <li>Use shades for text and borders</li>
                <li>Use tones for disabled states and secondary elements</li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <h4 className="font-bold text-gray-800 mb-2">Branding</h4>
              <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 ml-2">
                <li>Establish brand color as base (500 level)</li>
                <li>Create tints for supporting materials</li>
                <li>Use shades for formal communications</li>
                <li>Apply tones for sophisticated, premium feel</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg mb-4">
              <h4 className="font-bold text-gray-800 mb-2">UI Components</h4>
              <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 ml-2">
                <li>Default state: Base color</li>
                <li>Hover state: Light shade (600)</li>
                <li>Active/pressed: Medium shade (700)</li>
                <li>Disabled: Tone or light tint with reduced opacity</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Common Mistakes to Avoid</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-2">
              <li><strong>Too many variations:</strong> Stick to 5-10 levels; more creates confusion</li>
              <li><strong>Uneven spacing:</strong> Ensure consistent visual steps between variations</li>
              <li><strong>Ignoring accessibility:</strong> Always check contrast ratios for text</li>
              <li><strong>Mixing methods:</strong> Be consistent - use tints OR tones, not random combinations</li>
              <li><strong>Forgetting context:</strong> Test variations in actual designs, not just swatches</li>
              <li><strong>Starting too light/dark:</strong> Choose a mid-range base color for maximum variation range</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Design System Implementation</h3>
            <p className="text-gray-700 mb-4">
              When implementing these variations in code:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4 font-mono text-sm">
              <div>--color-primary-50: #EFF6FF; (lightest tint)</div>
              <div>--color-primary-100: #DBEAFE;</div>
              <div>--color-primary-200: #BFDBFE;</div>
              <div>--color-primary-500: #3B82F6; (base)</div>
              <div>--color-primary-700: #1D4ED8;</div>
              <div>--color-primary-900: #1E3A8A; (darkest shade)</div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Choosing the Right Variation Type</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-2">
              <li><strong>Use tints when:</strong> You need light backgrounds, want a fresh feel, designing for young audiences</li>
              <li><strong>Use shades when:</strong> You need strong contrast, want depth, creating premium/serious designs</li>
              <li><strong>Use tones when:</strong> You want sophistication, need subtle variations, designing for mature audiences</li>
              <li><strong>Combine all three when:</strong> Building a complete design system with full range of options</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Testing Your Color Variations</h3>
            <p className="text-gray-700 mb-4">
              Before finalizing your color variations:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-2">
              <li>Test on actual UI components, not just color swatches</li>
              <li>Check contrast ratios using accessibility tools (WCAG standards)</li>
              <li>View on different screens and in various lighting conditions</li>
              <li>Ensure sufficient visual distinction between adjacent levels</li>
              <li>Verify colors work in both light and dark modes</li>
              <li>Test with color blindness simulators</li>
            </ul>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                What's the difference between tints, shades, and tones?
              </h3>
              <p className="text-gray-700">
                Tints are made by adding white (increasing lightness), creating lighter, more pastel versions of a color. Shades are made by adding black (decreasing lightness), creating darker, deeper versions. Tones are made by adding gray (decreasing saturation), creating more muted, sophisticated versions. Tints and shades change the lightness while keeping saturation the same, while tones change saturation while keeping lightness the same. All three maintain the original hue.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                How many color variations should I generate for a design system?
              </h3>
              <p className="text-gray-700">
                Most modern design systems use 5-10 variations per color. A common pattern is: 50, 100, 200, 300, 400, 500 (base), 600, 700, 800, 900. This provides enough variety for all use cases while remaining manageable. Too few variations limit flexibility; too many create confusion. If you need more nuance in specific ranges (like very dark or very light), you can add intermediate levels like 150 or 950, but keep the total reasonable.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Should I use tints or tones for backgrounds?
              </h3>
              <p className="text-gray-700">
                Both work, but serve different purposes. Use tints for clean, airy designs with a modern feel - they're perfect for light mode interfaces and give a fresh appearance. Use tones for sophisticated, elegant designs with subtle depth - they're excellent for premium brands and create less visual noise. Tints tend to work better for light, positive brands, while tones suit serious, professional brands. You can also combine them: tints for primary backgrounds, tones for secondary elements.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                How do I ensure my color variations meet accessibility standards?
              </h3>
              <p className="text-gray-700">
                For accessibility, focus on contrast ratios between text and background. WCAG 2.1 requires a minimum 4.5:1 ratio for normal text and 3:1 for large text (18pt+ or 14pt+ bold). Use shades (darker colors) for text on light backgrounds, and tints (lighter colors) for text on dark backgrounds. Never use tones or light tints for body text - they lack sufficient contrast. Test all color combinations with contrast checking tools and validate with screen readers and color blindness simulators.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Can I generate these variations for multiple brand colors?
              </h3>
              <p className="text-gray-700">
                Yes, absolutely! Apply this same process to all your brand colors - primary, secondary, accent, success, warning, error, etc. Each color should have its own set of tints, shades, and possibly tones. This creates a complete, cohesive design system. Many brands have 3-5 main colors, each with 5-10 variations, resulting in 15-50 total color values in their design system. Document all variations in a style guide for consistent usage across your team and projects.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Why do my generated colors look different than design tools like Figma?
              </h3>
              <p className="text-gray-700">
                Different tools use slightly different algorithms for generating variations. Some tools adjust both lightness and saturation simultaneously, while our tool changes them independently for more predictable results. Additionally, perceived color depends on surrounding colors, screen calibration, and lighting conditions. The mathematical values might differ slightly, but the overall effect should be similar. For production use, generate variations here as a starting point, then fine-tune them in your design tool to match your specific needs and ensure they work in your actual designs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
