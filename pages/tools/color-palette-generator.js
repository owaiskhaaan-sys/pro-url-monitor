import Head from 'next/head';
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';

export default function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState('#3B82F6');
  const [scheme, setScheme] = useState('complementary');
  const [colorCount, setColorCount] = useState(5);
  const [palette, setPalette] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    generatePalette();
  }, [baseColor, scheme, colorCount]);

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

  const normalizeHue = (hue) => {
    while (hue < 0) hue += 360;
    while (hue >= 360) hue -= 360;
    return hue;
  };

  const generatePalette = () => {
    const rgb = hexToRgb(baseColor);
    if (!rgb) return;

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    let colors = [];

    switch (scheme) {
      case 'complementary':
        colors = [
          { ...hsl },
          { h: normalizeHue(hsl.h + 180), s: hsl.s, l: hsl.l }
        ];
        // Add lighter and darker variations
        colors.push(
          { h: hsl.h, s: Math.max(hsl.s - 20, 0), l: Math.min(hsl.l + 20, 100) },
          { h: normalizeHue(hsl.h + 180), s: Math.max(hsl.s - 20, 0), l: Math.min(hsl.l + 20, 100) },
          { h: hsl.h, s: Math.min(hsl.s + 20, 100), l: Math.max(hsl.l - 20, 0) }
        );
        break;

      case 'triadic':
        colors = [
          { ...hsl },
          { h: normalizeHue(hsl.h + 120), s: hsl.s, l: hsl.l },
          { h: normalizeHue(hsl.h + 240), s: hsl.s, l: hsl.l }
        ];
        // Add variations
        colors.push(
          { h: hsl.h, s: Math.max(hsl.s - 20, 0), l: Math.min(hsl.l + 15, 100) },
          { h: normalizeHue(hsl.h + 120), s: Math.max(hsl.s - 20, 0), l: Math.min(hsl.l + 15, 100) }
        );
        break;

      case 'analogous':
        colors = [
          { h: normalizeHue(hsl.h - 30), s: hsl.s, l: hsl.l },
          { h: normalizeHue(hsl.h - 15), s: hsl.s, l: hsl.l },
          { ...hsl },
          { h: normalizeHue(hsl.h + 15), s: hsl.s, l: hsl.l },
          { h: normalizeHue(hsl.h + 30), s: hsl.s, l: hsl.l }
        ];
        break;

      case 'split-complementary':
        colors = [
          { ...hsl },
          { h: normalizeHue(hsl.h + 150), s: hsl.s, l: hsl.l },
          { h: normalizeHue(hsl.h + 210), s: hsl.s, l: hsl.l }
        ];
        colors.push(
          { h: hsl.h, s: Math.max(hsl.s - 20, 0), l: Math.min(hsl.l + 20, 100) },
          { h: normalizeHue(hsl.h + 180), s: Math.max(hsl.s - 30, 0), l: Math.min(hsl.l + 20, 100) }
        );
        break;

      case 'tetradic':
        colors = [
          { ...hsl },
          { h: normalizeHue(hsl.h + 90), s: hsl.s, l: hsl.l },
          { h: normalizeHue(hsl.h + 180), s: hsl.s, l: hsl.l },
          { h: normalizeHue(hsl.h + 270), s: hsl.s, l: hsl.l }
        ];
        colors.push(
          { h: hsl.h, s: Math.max(hsl.s - 20, 0), l: Math.min(hsl.l + 15, 100) }
        );
        break;

      case 'monochromatic':
        for (let i = 0; i < 5; i++) {
          const lightness = 20 + (i * 15);
          colors.push({ h: hsl.h, s: hsl.s, l: lightness });
        }
        break;

      case 'square':
        colors = [
          { ...hsl },
          { h: normalizeHue(hsl.h + 90), s: hsl.s, l: hsl.l },
          { h: normalizeHue(hsl.h + 180), s: hsl.s, l: hsl.l },
          { h: normalizeHue(hsl.h + 270), s: hsl.s, l: hsl.l },
          { h: hsl.h, s: Math.max(hsl.s - 30, 0), l: Math.min(hsl.l + 25, 100) }
        ];
        break;

      default:
        colors = [{ ...hsl }];
    }

    // Limit to requested color count
    colors = colors.slice(0, colorCount);

    // Convert to RGB and HEX
    const finalPalette = colors.map(color => {
      const rgb = hslToRgb(color.h, color.s, color.l);
      return {
        hex: rgbToHex(rgb.r, rgb.g, rgb.b),
        rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        hsl: `hsl(${Math.round(color.h)}, ${Math.round(color.s)}%, ${Math.round(color.l)}%)`,
        values: { ...rgb, ...color }
      };
    });

    setPalette(finalPalette);
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyEntirePalette = () => {
    const paletteText = palette.map((color, i) => 
      `Color ${i + 1}: ${color.hex} | ${color.rgb} | ${color.hsl}`
    ).join('\n');
    navigator.clipboard.writeText(paletteText);
  };

  const loadRandomColor = () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setBaseColor(randomColor);
  };

  const getSchemeDescription = () => {
    const descriptions = {
      'complementary': 'Colors opposite on the color wheel - creates high contrast and vibrant look',
      'triadic': 'Three colors evenly spaced on the color wheel - balanced and vibrant',
      'analogous': 'Colors next to each other on the wheel - harmonious and pleasant',
      'split-complementary': 'Base color with two adjacent to its complement - softer than complementary',
      'tetradic': 'Four colors in two complementary pairs - rich and diverse palette',
      'square': 'Four colors evenly spaced on the wheel - balanced but bold',
      'monochromatic': 'Variations of a single hue - cohesive and sophisticated'
    };
    return descriptions[scheme] || '';
  };

  return (
    <Layout>
      <Head>
        <title>Color Palette Generator - Create | ProURLMonitor</title>
        <meta name="description" content="Free color palette generator. Create beautiful harmonious color schemes using complementary, triadic, analogous, and more color theory principles...." />
        <meta name="keywords" content="color palette generator, color scheme, harmonious colors, complementary colors, triadic colors, analogous colors, color theory, design colors" />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/color-palette-generator" />
        
        <meta property="og:title" content="Color Palette Generator - Create Harmonious Color Schemes Online" />
        <meta property="og:description" content="Generate beautiful color palettes based on color theory. Perfect for web design, branding, and creative projects." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://prourlmonitor.com/tools/color-palette-generator" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Color Palette Generator - Create Harmonious Color Schemes" />
        <meta name="twitter:description" content="Generate harmonious color palettes with complementary, triadic, analogous schemes and more." />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Color Palette Generator</h1>
          <p className="text-lg text-gray-600">
            Create beautiful harmonious color schemes based on color theory principles
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
            </div>
          </div>

          {/* Color Scheme Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Color Harmony Scheme
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              {[
                'complementary',
                'triadic',
                'analogous',
                'split-complementary',
                'tetradic',
                'square',
                'monochromatic'
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => setScheme(s)}
                  className={`px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                    scheme === s
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {s.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </button>
              ))}
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>{scheme.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}:</strong> {getSchemeDescription()}
              </p>
            </div>
          </div>

          {/* Color Count */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Colors: {colorCount}
            </label>
            <input
              type="range"
              min="2"
              max="8"
              value={colorCount}
              onChange={(e) => setColorCount(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Generated Palette */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-gray-700">
                Generated Palette
              </label>
              <button
                onClick={copyEntirePalette}
                className="px-3 py-1 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
              >
                Copy All
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {palette.map((color, index) => (
                <div key={index} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                  <div
                    className="w-full h-32 cursor-pointer"
                    style={{ backgroundColor: color.hex }}
                    onClick={() => copyToClipboard(color.hex, index)}
                  />
                  <div className="p-3">
                    <div className="space-y-2">
                      <button
                        onClick={() => copyToClipboard(color.hex, `${index}-hex`)}
                        className="w-full text-left text-xs font-mono bg-white px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        {color.hex}
                        {copiedIndex === `${index}-hex` && (
                          <span className="float-right text-green-600">✓</span>
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(color.rgb, `${index}-rgb`)}
                        className="w-full text-left text-xs font-mono bg-white px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        RGB
                        {copiedIndex === `${index}-rgb` && (
                          <span className="float-right text-green-600">✓</span>
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(color.hsl, `${index}-hsl`)}
                        className="w-full text-left text-xs font-mono bg-white px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        HSL
                        {copiedIndex === `${index}-hsl` && (
                          <span className="float-right text-green-600">✓</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Palette Preview Bar */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Palette Preview
            </label>
            <div className="flex h-20 rounded-lg overflow-hidden shadow-md">
              {palette.map((color, index) => (
                <div
                  key={index}
                  className="flex-1 cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: color.hex }}
                  onClick={() => copyToClipboard(color.hex, index)}
                  title={color.hex}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={generatePalette}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Regenerate
            </button>
            <button
              onClick={loadRandomColor}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Random Base
            </button>
            <button
              onClick={() => {
                setBaseColor('#3B82F6');
                setScheme('complementary');
                setColorCount(5);
              }}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Color Theory Guide */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding Color Harmony</h2>
          
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">
              Color harmony is the theory of combining colors in a way that is pleasing to the eye. Our color palette generator uses established color theory principles to create harmonious color schemes that work well together in design projects. Whether you're designing a website, creating a brand identity, or working on any visual project, understanding these color relationships is essential for professional results.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Color Harmony Schemes Explained</h3>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">Complementary Colors</h4>
                <p className="text-gray-700 text-sm">
                  Colors that sit opposite each other on the color wheel (180° apart). This creates maximum contrast and visual impact. Perfect for designs that need to grab attention or emphasize specific elements. Examples: blue and orange, red and green, purple and yellow.
                </p>
                <p className="text-gray-600 text-xs mt-2"><strong>Best for:</strong> Call-to-action buttons, high-impact designs, sports branding</p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-100 p-4 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">Triadic Colors</h4>
                <p className="text-gray-700 text-sm">
                  Three colors evenly spaced around the color wheel (120° apart). Creates a balanced, vibrant palette with good contrast while remaining harmonious. Works well when one color dominates and the others accent.
                </p>
                <p className="text-gray-600 text-xs mt-2"><strong>Best for:</strong> Playful brands, children's content, vibrant web designs</p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-4 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">Analogous Colors</h4>
                <p className="text-gray-700 text-sm">
                  Colors that sit next to each other on the color wheel (typically within 30° of each other). Creates serene, comfortable designs that are easy on the eyes. Often found in nature and perceived as naturally harmonious.
                </p>
                <p className="text-gray-600 text-xs mt-2"><strong>Best for:</strong> Calming designs, nature themes, elegant websites</p>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-yellow-100 p-4 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">Split-Complementary Colors</h4>
                <p className="text-gray-700 text-sm">
                  A base color with the two colors adjacent to its complement (150° and 210° from base). Provides strong visual contrast like complementary schemes but with less tension. More versatile and easier to use than pure complementary.
                </p>
                <p className="text-gray-600 text-xs mt-2"><strong>Best for:</strong> Beginners, versatile designs, when you want contrast without harshness</p>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-purple-100 p-4 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">Tetradic (Rectangle) Colors</h4>
                <p className="text-gray-700 text-sm">
                  Four colors arranged into two complementary pairs. Offers the richest and most diverse palette but requires careful balance. One color should dominate while others accent.
                </p>
                <p className="text-gray-600 text-xs mt-2"><strong>Best for:</strong> Complex designs, illustrations, when you need many colors</p>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-blue-100 p-4 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">Square Colors</h4>
                <p className="text-gray-700 text-sm">
                  Four colors evenly spaced around the wheel (90° apart). Similar to tetradic but creates more balanced energy. Works best when one color dominates while the rest support.
                </p>
                <p className="text-gray-600 text-xs mt-2"><strong>Best for:</strong> Bold designs, when you want balanced energy, colorful projects</p>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-slate-100 p-4 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">Monochromatic Colors</h4>
                <p className="text-gray-700 text-sm">
                  Variations of a single hue by changing lightness and saturation. Creates cohesive, sophisticated designs with subtle depth. Easy to use and always harmonious but can lack visual excitement.
                </p>
                <p className="text-gray-600 text-xs mt-2"><strong>Best for:</strong> Minimalist designs, professional sites, when you want cohesion</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">How to Use This Tool Effectively</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-2">
              <li><strong>Start with your brand color:</strong> Enter your main brand color as the base and explore different schemes</li>
              <li><strong>Test different schemes:</strong> Try multiple harmony types to see which works best for your project</li>
              <li><strong>Adjust color count:</strong> More colors provide flexibility but can be harder to balance</li>
              <li><strong>Click to copy:</strong> Click any color swatch or format to instantly copy it</li>
              <li><strong>Use the preview bar:</strong> See how colors work together in a linear layout</li>
              <li><strong>Random exploration:</strong> Use the Random button to discover unexpected color combinations</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Color Theory Fundamentals</h3>
            <p className="text-gray-700 mb-4">
              Understanding basic color theory helps you create better designs:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-2">
              <li><strong>Hue:</strong> The pure color (red, blue, green, etc.)</li>
              <li><strong>Saturation:</strong> The intensity or purity of the color (from gray to vivid)</li>
              <li><strong>Lightness:</strong> How light or dark the color is (from black to white)</li>
              <li><strong>Warm colors:</strong> Reds, oranges, yellows - energetic and attention-grabbing</li>
              <li><strong>Cool colors:</strong> Blues, greens, purples - calming and professional</li>
              <li><strong>Neutral colors:</strong> Black, white, gray, brown - balance and sophistication</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Practical Design Applications</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-2">
              <li><strong>Web Design:</strong> Use complementary for CTAs, analogous for backgrounds, monochromatic for minimalist sites</li>
              <li><strong>Brand Identity:</strong> Choose a scheme that reflects brand personality and ensures consistency</li>
              <li><strong>UI/UX Design:</strong> Apply 60-30-10 rule: 60% dominant color, 30% secondary, 10% accent</li>
              <li><strong>Marketing Materials:</strong> Use contrasting colors to highlight important information</li>
              <li><strong>Social Media:</strong> Create consistent color themes for brand recognition</li>
              <li><strong>Print Design:</strong> Consider how colors translate to print (CMYK) before finalizing</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">The 60-30-10 Rule</h3>
            <p className="text-gray-700 mb-4">
              Interior designers use this rule, and it works perfectly for digital design too:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-2">
              <li><strong>60% Dominant color:</strong> Main background or large areas (often neutral)</li>
              <li><strong>30% Secondary color:</strong> Supporting elements, sections, cards</li>
              <li><strong>10% Accent color:</strong> Buttons, links, highlights that draw attention</li>
            </ul>
            <p className="text-gray-700 mb-4">
              This ratio creates visual hierarchy and prevents any single color from overwhelming the design.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Common Color Mistakes to Avoid</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-2">
              <li><strong>Too many colors:</strong> Stick to 3-5 main colors to avoid visual chaos</li>
              <li><strong>Poor contrast:</strong> Ensure text is readable against backgrounds (minimum 4.5:1 ratio for accessibility)</li>
              <li><strong>Ignoring context:</strong> Colors have cultural meanings - research your audience</li>
              <li><strong>No testing:</strong> Always test colors on actual devices and screens</li>
              <li><strong>Neglecting accessibility:</strong> Consider color blindness - don't rely solely on color to convey information</li>
              <li><strong>Following trends blindly:</strong> Choose colors that fit your brand, not just what's trendy</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Color Psychology in Design</h3>
            <p className="text-gray-700 mb-4">
              Colors evoke emotions and associations. Use this to your advantage:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-2">
              <li><strong>Red:</strong> Energy, passion, urgency (sales, food, excitement)</li>
              <li><strong>Blue:</strong> Trust, professionalism, calm (corporate, healthcare, tech)</li>
              <li><strong>Green:</strong> Growth, nature, health (environmental, financial, wellness)</li>
              <li><strong>Yellow:</strong> Optimism, attention, warmth (children's products, warnings)</li>
              <li><strong>Purple:</strong> Luxury, creativity, wisdom (beauty, premium products)</li>
              <li><strong>Orange:</strong> Friendly, energetic, affordable (entertainment, sports)</li>
              <li><strong>Black:</strong> Sophistication, elegance, power (luxury, modern)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Testing and Refining Your Palette</h3>
            <p className="text-gray-700 mb-4">
              After generating a palette, test it thoroughly:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-2">
              <li>Apply colors to actual design mockups, not just swatches</li>
              <li>Test on different devices (desktop, mobile, tablet)</li>
              <li>Check in different lighting conditions</li>
              <li>Verify accessibility with contrast checkers</li>
              <li>Get feedback from your target audience</li>
              <li>Consider how colors will age - will they still work in 5 years?</li>
            </ul>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Which color harmony scheme should I use for my project?
              </h3>
              <p className="text-gray-700">
                It depends on your goals. For high contrast and attention (like sales pages), use complementary colors. For calm, professional designs (like corporate sites), choose analogous colors. For playful, energetic projects (like children's content), try triadic colors. Monochromatic works best for minimalist, elegant designs. Split-complementary is a safe, versatile choice for beginners. Consider your brand personality, target audience, and the emotions you want to evoke.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                How many colors should I use in my design?
              </h3>
              <p className="text-gray-700">
                Most professional designs use 3-5 main colors: one dominant color (60% of design), one secondary color (30%), and one or two accent colors (10%). Too many colors create visual confusion and dilute your message. However, you can have more colors as subtle variations - like different shades of your main colors. For web design, establish a core palette of 3-5 colors, then create lighter and darker variations as needed for UI elements.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Can I use these colors for both print and digital?
              </h3>
              <p className="text-gray-700">
                Yes, but colors may look different in print vs. screens. Digital displays use RGB (additive color) while printing uses CMYK (subtractive color). Some bright RGB colors cannot be accurately reproduced in print. If you need the palette for both mediums, generate it here, then convert to CMYK using our RGB to CMYK converter and request print proofs. Alternatively, start with Pantone colors that have both RGB and CMYK specifications for perfect consistency.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                How do I ensure my color palette is accessible?
              </h3>
              <p className="text-gray-700">
                Accessibility mainly concerns text contrast. Use an online contrast checker to ensure text-to-background contrast meets WCAG standards: minimum 4.5:1 for normal text, 3:1 for large text (18pt+). Don't rely solely on color to convey information - use icons, labels, or patterns too. About 8% of men and 0.5% of women have color vision deficiency, so test your designs with color blindness simulators. Ensure interactive elements have sufficient contrast in all states (hover, focus, active).
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Can I save or export my generated palettes?
              </h3>
              <p className="text-gray-700">
                Currently, you can copy individual color values by clicking on them, or copy the entire palette using the "Copy All" button. This copies all colors with their HEX, RGB, and HSL values. You can paste this into a document for future reference. Take screenshots of palettes you like, or bookmark the page with your settings. For professional work, consider creating a style guide document that includes your palette along with usage guidelines and examples.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Why do some color combinations look bad even though they're "harmonious"?
              </h3>
              <p className="text-gray-700">
                Color harmony rules are guidelines, not guarantees. Even harmonious colors can clash if saturation and lightness aren't balanced. Two highly saturated colors can vibrate against each other even if they're complementary. Context matters too - colors that work in a logo might not work in a full website. The surrounding colors, amount of white space, and intended emotion all affect perception. Use these generated palettes as starting points, then adjust saturation and lightness until they feel right for your specific use case.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
