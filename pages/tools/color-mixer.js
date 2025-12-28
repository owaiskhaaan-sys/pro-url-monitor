import Head from 'next/head';
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';

export default function ColorMixer() {
  const [color1, setColor1] = useState('#3B82F6');
  const [color2, setColor2] = useState('#EF4444');
  const [mixRatio, setMixRatio] = useState(50);
  const [mixMode, setMixMode] = useState('rgb'); // 'rgb' or 'hsl'
  const [mixedColor, setMixedColor] = useState('');
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    mixColors();
  }, [color1, color2, mixRatio, mixMode]);

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHex = (r, g, b) => {
    return '#' + [r, g, b].map(x => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
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

  const normalizeHue = (hue) => {
    while (hue < 0) hue += 360;
    while (hue >= 360) hue -= 360;
    return hue;
  };

  const mixColors = () => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return;

    const ratio1 = mixRatio / 100;
    const ratio2 = 1 - ratio1;

    let mixedRgb;

    if (mixMode === 'rgb') {
      // RGB mixing (additive)
      mixedRgb = {
        r: Math.round(rgb1.r * ratio2 + rgb2.r * ratio1),
        g: Math.round(rgb1.g * ratio2 + rgb2.g * ratio1),
        b: Math.round(rgb1.b * ratio2 + rgb2.b * ratio1)
      };
    } else {
      // HSL mixing (perceptual)
      const hsl1 = rgbToHsl(rgb1.r, rgb1.g, rgb1.b);
      const hsl2 = rgbToHsl(rgb2.r, rgb2.g, rgb2.b);

      // Handle hue wrapping (shortest path)
      let h1 = hsl1.h;
      let h2 = hsl2.h;
      const diff = h2 - h1;
      
      if (Math.abs(diff) > 180) {
        if (h1 < h2) {
          h1 += 360;
        } else {
          h2 += 360;
        }
      }

      const mixedHsl = {
        h: normalizeHue(h1 * ratio2 + h2 * ratio1),
        s: hsl1.s * ratio2 + hsl2.s * ratio1,
        l: hsl1.l * ratio2 + hsl2.l * ratio1
      };

      mixedRgb = hslToRgb(mixedHsl.h, mixedHsl.s, mixedHsl.l);
    }

    const hexResult = rgbToHex(mixedRgb.r, mixedRgb.g, mixedRgb.b);
    setMixedColor(hexResult);

    // Generate gradient steps
    const stepCount = 7;
    const gradientSteps = [];
    
    for (let i = 0; i < stepCount; i++) {
      const stepRatio = i / (stepCount - 1);
      let stepRgb;

      if (mixMode === 'rgb') {
        stepRgb = {
          r: Math.round(rgb1.r * (1 - stepRatio) + rgb2.r * stepRatio),
          g: Math.round(rgb1.g * (1 - stepRatio) + rgb2.g * stepRatio),
          b: Math.round(rgb1.b * (1 - stepRatio) + rgb2.b * stepRatio)
        };
      } else {
        const hsl1 = rgbToHsl(rgb1.r, rgb1.g, rgb1.b);
        const hsl2 = rgbToHsl(rgb2.r, rgb2.g, rgb2.b);

        let h1 = hsl1.h;
        let h2 = hsl2.h;
        const diff = h2 - h1;
        
        if (Math.abs(diff) > 180) {
          if (h1 < h2) {
            h1 += 360;
          } else {
            h2 += 360;
          }
        }

        const stepHsl = {
          h: normalizeHue(h1 * (1 - stepRatio) + h2 * stepRatio),
          s: hsl1.s * (1 - stepRatio) + hsl2.s * stepRatio,
          l: hsl1.l * (1 - stepRatio) + hsl2.l * stepRatio
        };

        stepRgb = hslToRgb(stepHsl.h, stepHsl.s, stepHsl.l);
      }

      gradientSteps.push({
        hex: rgbToHex(stepRgb.r, stepRgb.g, stepRgb.b),
        percent: Math.round(stepRatio * 100)
      });
    }

    setSteps(gradientSteps);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const swapColors = () => {
    const temp = color1;
    setColor1(color2);
    setColor2(temp);
  };

  const loadComplementary = () => {
    const rgb = hexToRgb(color1);
    if (!rgb) return;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const compHsl = { h: normalizeHue(hsl.h + 180), s: hsl.s, l: hsl.l };
    const compRgb = hslToRgb(compHsl.h, compHsl.s, compHsl.l);
    setColor2(rgbToHex(compRgb.r, compRgb.g, compRgb.b));
  };

  const loadRandomColors = () => {
    const random1 = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    const random2 = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setColor1(random1);
    setColor2(random2);
  };

  return (
    <Layout>
      <Head>
        <title>Color Mixer - Mix Two Colors Online | ProURLMonitor</title>
        <meta name="description" content="Free color mixer tool. Mix two colors with RGB or HSL blending modes. Create color gradients and find intermediate colors between any two colors." />
        <meta name="keywords" content="color mixer, blend colors, mix colors, color blending, rgb mixing, hsl mixing, color gradient, intermediate colors" />
        <link rel="canonical" href="https://prourlmonitor.com/tools/color-mixer" />
        
        <meta property="og:title" content="Color Mixer - Mix Two Colors Online" />
        <meta property="og:description" content="Mix two colors with RGB or HSL blending. Create beautiful gradients and find perfect intermediate colors." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://prourlmonitor.com/tools/color-mixer" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Color Mixer - Mix Two Colors Online" />
        <meta name="twitter:description" content="Mix colors with RGB or HSL blending modes. Create gradients and intermediate colors." />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Color Mixer</h1>
          <p className="text-lg text-gray-600">
            Mix two colors together with RGB or HSL blending modes
          </p>
        </div>

        {/* Mixer Tool */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* Color Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Color 1
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-300"
                />
                <input
                  type="text"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-mono"
                />
              </div>
              <div 
                className="mt-3 h-20 rounded-lg border-2 border-gray-300"
                style={{ backgroundColor: color1 }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Color 2
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-300"
                />
                <input
                  type="text"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-mono"
                />
              </div>
              <div 
                className="mt-3 h-20 rounded-lg border-2 border-gray-300"
                style={{ backgroundColor: color2 }}
              />
            </div>
          </div>

          {/* Mix Mode Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Blending Mode
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setMixMode('rgb')}
                className={`flex-1 px-6 py-3 rounded-lg transition-colors ${
                  mixMode === 'rgb'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="font-semibold">RGB Mixing</div>
                <div className="text-xs mt-1">Mathematical average</div>
              </button>
              <button
                onClick={() => setMixMode('hsl')}
                className={`flex-1 px-6 py-3 rounded-lg transition-colors ${
                  mixMode === 'hsl'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="font-semibold">HSL Mixing</div>
                <div className="text-xs mt-1">Perceptual blending</div>
              </button>
            </div>
            <div className={`mt-3 p-3 rounded-lg ${
              mixMode === 'rgb' ? 'bg-blue-50 border border-blue-200' : 'bg-purple-50 border border-purple-200'
            }`}>
              <p className="text-sm text-gray-700">
                {mixMode === 'rgb' 
                  ? 'RGB mixing averages red, green, and blue values separately. Creates more neutral intermediate colors.'
                  : 'HSL mixing blends hue, saturation, and lightness. Creates more vibrant gradients and natural transitions.'}
              </p>
            </div>
          </div>

          {/* Mix Ratio Slider */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">
                Mix Ratio
              </label>
              <span className="text-sm font-mono bg-gray-100 px-3 py-1 rounded">
                {100 - mixRatio}% : {mixRatio}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={mixRatio}
              onChange={(e) => setMixRatio(parseInt(e.target.value))}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${color1} 0%, ${mixedColor} 50%, ${color2} 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>More Color 1</span>
              <span>50/50</span>
              <span>More Color 2</span>
            </div>
          </div>

          {/* Mixed Result */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Mixed Color Result
            </label>
            <div className="bg-white border-2 border-blue-500 rounded-lg overflow-hidden shadow-lg">
              <div 
                className="h-40 cursor-pointer relative group"
                style={{ backgroundColor: mixedColor }}
                onClick={() => copyToClipboard(mixedColor)}
              >
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity flex items-center justify-center">
                  <span className="text-white font-semibold">Click to copy</span>
                </div>
              </div>
              <div className="p-4 bg-blue-50">
                <button
                  onClick={() => copyToClipboard(mixedColor)}
                  className="w-full text-center text-xl font-mono font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {mixedColor}
                </button>
              </div>
            </div>
          </div>

          {/* Gradient Steps */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Gradient Steps (Color 1 → Color 2)
            </label>
            <div className="flex h-16 rounded-lg overflow-hidden shadow-md mb-3">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex-1 cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: step.hex }}
                  onClick={() => copyToClipboard(step.hex)}
                  title={`${step.percent}% - ${step.hex}`}
                />
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {steps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => copyToClipboard(step.hex)}
                  className="text-xs font-mono bg-gray-50 px-2 py-2 rounded border border-gray-200 hover:bg-gray-100 transition-colors text-center"
                >
                  <div className="font-semibold">{step.percent}%</div>
                  <div className="text-gray-600">{step.hex}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={swapColors}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              ⇄ Swap Colors
            </button>
            <button
              onClick={loadComplementary}
              className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Complementary
            </button>
            <button
              onClick={loadRandomColors}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Random Colors
            </button>
            <button
              onClick={() => {
                setColor1('#3B82F6');
                setColor2('#EF4444');
                setMixRatio(50);
                setMixMode('rgb');
              }}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding Color Mixing</h2>
          
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">
              Color mixing is the process of combining two or more colors to create new colors. The result depends on the mixing method used - RGB (additive mixing) or HSL (perceptual mixing). Each method has different characteristics and produces different results, making them suitable for different design scenarios and creative applications.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">RGB Mixing (Additive)</h3>
            <p className="text-gray-700 mb-4">
              RGB mixing works by averaging the red, green, and blue components separately. This is mathematical color mixing that follows these principles:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-2">
              <li><strong>Mathematical average:</strong> Each RGB channel is averaged independently</li>
              <li><strong>Formula:</strong> Mixed Color = (Color1 × ratio1) + (Color2 × ratio2)</li>
              <li><strong>Result:</strong> Often creates neutral, desaturated intermediate colors</li>
              <li><strong>Best for:</strong> Realistic light mixing, technical applications, scientific visualization</li>
              <li><strong>Example:</strong> Blue (#0000FF) + Yellow (#FFFF00) = Gray/Green (due to RGB averaging)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">HSL Mixing (Perceptual)</h3>
            <p className="text-gray-700 mb-4">
              HSL mixing blends hue, saturation, and lightness separately. This creates more visually pleasing transitions:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-2">
              <li><strong>Hue blending:</strong> Takes shortest path around color wheel (handles wraparound)</li>
              <li><strong>Saturation mixing:</strong> Averages color intensity independently</li>
              <li><strong>Lightness mixing:</strong> Averages brightness levels</li>
              <li><strong>Result:</strong> Creates vibrant, saturated intermediate colors</li>
              <li><strong>Best for:</strong> Gradients, smooth color transitions, artistic work, UI design</li>
              <li><strong>Example:</strong> Blue + Yellow = Vibrant green (follows color wheel)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Practical Applications</h3>
            
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg mb-4">
              <h4 className="font-bold text-gray-800 mb-2">Creating Gradients</h4>
              <p className="text-gray-700 text-sm">
                Use the gradient steps feature to create smooth color transitions for backgrounds, UI elements, and design accents. HSL mixing typically produces more vibrant gradients that work well for modern designs.
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mb-4">
              <h4 className="font-bold text-gray-800 mb-2">Finding Intermediate Colors</h4>
              <p className="text-gray-700 text-sm">
                When you need a color between two existing colors in your design system, use the mixer to find mathematically perfect intermediates. Adjust the ratio to get closer to one color or the other.
              </p>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg mb-4">
              <h4 className="font-bold text-gray-800 mb-2">Color Transitions</h4>
              <p className="text-gray-700 text-sm">
                Create smooth state transitions for UI elements (hover, active, disabled). Mix your base color with white, black, or another brand color to generate perfect transition colors.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Choosing the Right Mixing Mode</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-2">
              <li><strong>Use RGB when:</strong> You need realistic light mixing, working with photography, scientific accuracy matters</li>
              <li><strong>Use HSL when:</strong> Creating UI gradients, making smooth transitions, wanting vibrant results, designing color schemes</li>
              <li><strong>Experiment with both:</strong> Try both modes to see which gives the result you prefer for your specific use case</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Color Theory in Mixing</h3>
            <p className="text-gray-700 mb-4">
              Understanding basic color relationships helps predict mixing results:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-2">
              <li><strong>Primary colors:</strong> Red, blue, yellow - mixing these creates secondary colors</li>
              <li><strong>Complementary colors:</strong> Opposite on color wheel - mix to create neutral browns/grays</li>
              <li><strong>Analogous colors:</strong> Next to each other - mix to create harmonious intermediates</li>
              <li><strong>Warm + Cool:</strong> Mixing warm and cool colors can create interesting neutral tones</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Tips for Better Results</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-2">
              <li>Start with colors of similar lightness for more predictable results</li>
              <li>HSL mixing preserves vibrancy better than RGB mixing</li>
              <li>For neutral intermediates, try mixing complementary colors</li>
              <li>Use gradient steps to visualize the full transition</li>
              <li>Test mixed colors in actual designs, not just swatches</li>
              <li>Save successful mixes for consistent use across projects</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Common Use Cases</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-2">
              <li><strong>UI States:</strong> Mix brand color with white for hover, with black for active</li>
              <li><strong>Chart Colors:</strong> Create data visualization palettes by mixing between key colors</li>
              <li><strong>Background Variations:</strong> Mix brand colors with white for subtle backgrounds</li>
              <li><strong>Theme Colors:</strong> Generate consistent color families from base colors</li>
              <li><strong>Accent Colors:</strong> Find perfect intermediates that complement existing colors</li>
            </ul>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                What's the difference between RGB and HSL color mixing?
              </h3>
              <p className="text-gray-700">
                RGB mixing averages the red, green, and blue values separately, which often produces more neutral, desaturated colors. HSL mixing blends hue (taking the shortest path around the color wheel), saturation, and lightness independently, creating more vibrant and visually pleasing results. For example, mixing blue and yellow in RGB produces a grayish green, while HSL produces a bright, vibrant green. Use RGB for realistic light simulation and HSL for design gradients and smooth transitions.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Why does mixing complementary colors create gray or brown?
              </h3>
              <p className="text-gray-700">
                Complementary colors (like red and green, or blue and orange) sit opposite each other on the color wheel. When mixed, they cancel out each other's color properties, resulting in neutral tones - gray in RGB mixing or brownish tones in HSL mixing. This is because complementary pairs contain all three primary colors in equal amounts when combined. This principle is useful when you want to create sophisticated neutral colors that harmonize with your existing palette rather than using pure gray.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                How can I create a smooth gradient between two colors?
              </h3>
              <p className="text-gray-700">
                Use the gradient steps feature in this tool, which shows 7 intermediate colors between your two chosen colors. For the smoothest gradients, use HSL mixing mode as it creates more natural color transitions. In CSS, you can implement this as: linear-gradient(to right, #color1, #color2). For even smoother results, consider adding intermediate colors from the gradient steps: linear-gradient(to right, #color1, #step3, #step5, #color2). Test your gradient on actual backgrounds to ensure it looks smooth across the entire range.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Which mixing mode should I use for UI design?
              </h3>
              <p className="text-gray-700">
                For UI design, HSL mixing is generally better because it produces more vibrant, saturated colors that look better on screens. Use HSL when creating button hover states, gradients, loading animations, and color transitions. However, RGB mixing can be useful when you specifically want more muted, professional tones or when simulating real-world lighting effects. Try both modes with your specific colors and choose the one that best matches your design intent and brand aesthetic.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Can I mix more than two colors at once?
              </h3>
              <p className="text-gray-700">
                This tool is designed for mixing two colors, but you can mix multiple colors sequentially. First, mix color A and B to get result C. Then mix C with color D to get result E, and so on. However, be aware that mixing multiple colors often leads to increasingly neutral, muddy results, especially with RGB mixing. For creating complex color schemes with multiple colors, consider using our Color Palette Generator tool instead, which is specifically designed for creating harmonious multi-color palettes.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                How do I find the perfect intermediate color between brand colors?
              </h3>
              <p className="text-gray-700">
                Start by entering your two brand colors and use the 50/50 mix ratio. Observe the result and adjust the ratio slider left or right to get closer to one color or the other. Try both RGB and HSL modes to see which produces a more aesthetically pleasing result. The gradient steps show you the full range of possibilities. Choose the intermediate color that maintains your brand's visual identity while serving its functional purpose. Save the hex code for consistent use across your design system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
