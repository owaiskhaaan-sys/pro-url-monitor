import Head from 'next/head';
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';

export default function ColorNameFinder() {
  const [inputColor, setInputColor] = useState('#3B82F6');
  const [colorName, setColorName] = useState('');
  const [similarColors, setSimilarColors] = useState([]);
  const [colorCategory, setColorCategory] = useState('');

  // Comprehensive color database with common web colors
  const colorDatabase = [
    // Reds
    { name: 'Red', hex: '#FF0000', category: 'Red' },
    { name: 'Crimson', hex: '#DC143C', category: 'Red' },
    { name: 'Firebrick', hex: '#B22222', category: 'Red' },
    { name: 'Dark Red', hex: '#8B0000', category: 'Red' },
    { name: 'Indian Red', hex: '#CD5C5C', category: 'Red' },
    { name: 'Light Coral', hex: '#F08080', category: 'Red' },
    { name: 'Salmon', hex: '#FA8072', category: 'Red' },
    { name: 'Light Salmon', hex: '#FFA07A', category: 'Red' },
    { name: 'Tomato', hex: '#FF6347', category: 'Red' },
    { name: 'Coral', hex: '#FF7F50', category: 'Red' },
    
    // Oranges
    { name: 'Orange', hex: '#FFA500', category: 'Orange' },
    { name: 'Dark Orange', hex: '#FF8C00', category: 'Orange' },
    { name: 'Orange Red', hex: '#FF4500', category: 'Orange' },
    { name: 'Peach Puff', hex: '#FFDAB9', category: 'Orange' },
    { name: 'Papaya Whip', hex: '#FFEFD5', category: 'Orange' },
    
    // Yellows
    { name: 'Yellow', hex: '#FFFF00', category: 'Yellow' },
    { name: 'Gold', hex: '#FFD700', category: 'Yellow' },
    { name: 'Light Yellow', hex: '#FFFFE0', category: 'Yellow' },
    { name: 'Lemon Chiffon', hex: '#FFFACD', category: 'Yellow' },
    { name: 'Khaki', hex: '#F0E68C', category: 'Yellow' },
    { name: 'Dark Khaki', hex: '#BDB76B', category: 'Yellow' },
    
    // Greens
    { name: 'Green', hex: '#008000', category: 'Green' },
    { name: 'Lime', hex: '#00FF00', category: 'Green' },
    { name: 'Lime Green', hex: '#32CD32', category: 'Green' },
    { name: 'Spring Green', hex: '#00FF7F', category: 'Green' },
    { name: 'Sea Green', hex: '#2E8B57', category: 'Green' },
    { name: 'Forest Green', hex: '#228B22', category: 'Green' },
    { name: 'Dark Green', hex: '#006400', category: 'Green' },
    { name: 'Olive', hex: '#808000', category: 'Green' },
    { name: 'Olive Drab', hex: '#6B8E23', category: 'Green' },
    { name: 'Yellow Green', hex: '#9ACD32', category: 'Green' },
    { name: 'Lawn Green', hex: '#7CFC00', category: 'Green' },
    { name: 'Chartreuse', hex: '#7FFF00', category: 'Green' },
    { name: 'Light Green', hex: '#90EE90', category: 'Green' },
    { name: 'Pale Green', hex: '#98FB98', category: 'Green' },
    
    // Cyans/Aquas
    { name: 'Cyan', hex: '#00FFFF', category: 'Cyan' },
    { name: 'Aqua', hex: '#00FFFF', category: 'Cyan' },
    { name: 'Turquoise', hex: '#40E0D0', category: 'Cyan' },
    { name: 'Medium Turquoise', hex: '#48D1CC', category: 'Cyan' },
    { name: 'Dark Turquoise', hex: '#00CED1', category: 'Cyan' },
    { name: 'Aquamarine', hex: '#7FFFD4', category: 'Cyan' },
    { name: 'Teal', hex: '#008080', category: 'Cyan' },
    { name: 'Dark Cyan', hex: '#008B8B', category: 'Cyan' },
    
    // Blues
    { name: 'Blue', hex: '#0000FF', category: 'Blue' },
    { name: 'Navy', hex: '#000080', category: 'Blue' },
    { name: 'Dark Blue', hex: '#00008B', category: 'Blue' },
    { name: 'Medium Blue', hex: '#0000CD', category: 'Blue' },
    { name: 'Royal Blue', hex: '#4169E1', category: 'Blue' },
    { name: 'Steel Blue', hex: '#4682B4', category: 'Blue' },
    { name: 'Dodger Blue', hex: '#1E90FF', category: 'Blue' },
    { name: 'Deep Sky Blue', hex: '#00BFFF', category: 'Blue' },
    { name: 'Sky Blue', hex: '#87CEEB', category: 'Blue' },
    { name: 'Light Sky Blue', hex: '#87CEFA', category: 'Blue' },
    { name: 'Light Blue', hex: '#ADD8E6', category: 'Blue' },
    { name: 'Powder Blue', hex: '#B0E0E6', category: 'Blue' },
    { name: 'Cornflower Blue', hex: '#6495ED', category: 'Blue' },
    { name: 'Cadet Blue', hex: '#5F9EA0', category: 'Blue' },
    
    // Purples
    { name: 'Purple', hex: '#800080', category: 'Purple' },
    { name: 'Indigo', hex: '#4B0082', category: 'Purple' },
    { name: 'Dark Violet', hex: '#9400D3', category: 'Purple' },
    { name: 'Blue Violet', hex: '#8A2BE2', category: 'Purple' },
    { name: 'Medium Purple', hex: '#9370DB', category: 'Purple' },
    { name: 'Medium Orchid', hex: '#BA55D3', category: 'Purple' },
    { name: 'Orchid', hex: '#DA70D6', category: 'Purple' },
    { name: 'Violet', hex: '#EE82EE', category: 'Purple' },
    { name: 'Plum', hex: '#DDA0DD', category: 'Purple' },
    { name: 'Thistle', hex: '#D8BFD8', category: 'Purple' },
    { name: 'Lavender', hex: '#E6E6FA', category: 'Purple' },
    
    // Pinks/Magentas
    { name: 'Magenta', hex: '#FF00FF', category: 'Pink' },
    { name: 'Fuchsia', hex: '#FF00FF', category: 'Pink' },
    { name: 'Deep Pink', hex: '#FF1493', category: 'Pink' },
    { name: 'Hot Pink', hex: '#FF69B4', category: 'Pink' },
    { name: 'Pink', hex: '#FFC0CB', category: 'Pink' },
    { name: 'Light Pink', hex: '#FFB6C1', category: 'Pink' },
    { name: 'Pale Violet Red', hex: '#DB7093', category: 'Pink' },
    
    // Browns
    { name: 'Brown', hex: '#A52A2A', category: 'Brown' },
    { name: 'Saddle Brown', hex: '#8B4513', category: 'Brown' },
    { name: 'Sienna', hex: '#A0522D', category: 'Brown' },
    { name: 'Chocolate', hex: '#D2691E', category: 'Brown' },
    { name: 'Peru', hex: '#CD853F', category: 'Brown' },
    { name: 'Sandy Brown', hex: '#F4A460', category: 'Brown' },
    { name: 'Tan', hex: '#D2B48C', category: 'Brown' },
    { name: 'Wheat', hex: '#F5DEB3', category: 'Brown' },
    { name: 'Burlywood', hex: '#DEB887', category: 'Brown' },
    { name: 'Rosy Brown', hex: '#BC8F8F', category: 'Brown' },
    
    // Grays/Whites/Blacks
    { name: 'Black', hex: '#000000', category: 'Gray' },
    { name: 'Dim Gray', hex: '#696969', category: 'Gray' },
    { name: 'Gray', hex: '#808080', category: 'Gray' },
    { name: 'Dark Gray', hex: '#A9A9A9', category: 'Gray' },
    { name: 'Silver', hex: '#C0C0C0', category: 'Gray' },
    { name: 'Light Gray', hex: '#D3D3D3', category: 'Gray' },
    { name: 'Gainsboro', hex: '#DCDCDC', category: 'Gray' },
    { name: 'White Smoke', hex: '#F5F5F5', category: 'Gray' },
    { name: 'White', hex: '#FFFFFF', category: 'Gray' },
    { name: 'Snow', hex: '#FFFAFA', category: 'Gray' },
  ];

  useEffect(() => {
    findColorName();
  }, [inputColor]);

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const colorDistance = (rgb1, rgb2) => {
    // Euclidean distance in RGB color space
    const rDiff = rgb1.r - rgb2.r;
    const gDiff = rgb1.g - rgb2.g;
    const bDiff = rgb1.b - rgb2.b;
    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
  };

  const findColorName = () => {
    const inputRgb = hexToRgb(inputColor);
    if (!inputRgb) return;

    // Find closest color
    let closestColor = colorDatabase[0];
    let minDistance = Infinity;

    colorDatabase.forEach(color => {
      const colorRgb = hexToRgb(color.hex);
      if (colorRgb) {
        const distance = colorDistance(inputRgb, colorRgb);
        if (distance < minDistance) {
          minDistance = distance;
          closestColor = color;
        }
      }
    });

    setColorName(closestColor.name);
    setColorCategory(closestColor.category);

    // Find similar colors in the same category
    const similar = colorDatabase
      .filter(color => color.category === closestColor.category && color.name !== closestColor.name)
      .map(color => {
        const colorRgb = hexToRgb(color.hex);
        return {
          ...color,
          distance: colorDistance(inputRgb, colorRgb)
        };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 8);

    setSimilarColors(similar);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const loadColorByName = (hex) => {
    setInputColor(hex);
  };

  const loadRandomColor = () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setInputColor(randomColor);
  };

  const getCategoryColors = () => {
    return colorDatabase.filter(color => color.category === colorCategory);
  };

  return (
    <Layout>
      <Head>
        <title>Color Name Finder - Identify Color Names from HEX Codes | ProURLMonitor</title>
        <meta name="description" content="Free color name finder. Identify color names from HEX codes. Find similar colors and explore color categories. Perfect for designers and developers." />
        <meta name="keywords" content="color name finder, hex to color name, identify color, color names, web colors, css colors, color identification" />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/color-name-finder" />
        
        <meta property="og:title" content="Color Name Finder - Identify Color Names from HEX Codes" />
        <meta property="og:description" content="Find color names from HEX codes. Discover similar colors and explore web color categories." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://prourlmonitor.com/tools/color-name-finder" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Color Name Finder - Identify Color Names" />
        <meta name="twitter:description" content="Find color names from HEX codes and discover similar colors." />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Color Name Finder</h1>
          <p className="text-lg text-gray-600">
            Find the name of any color from its HEX code
          </p>
        </div>

        {/* Finder Tool */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* Color Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Enter Color (HEX)
            </label>
            <div className="flex gap-4 items-center">
              <input
                type="color"
                value={inputColor}
                onChange={(e) => setInputColor(e.target.value)}
                className="w-24 h-24 rounded-lg cursor-pointer border-2 border-gray-300"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={inputColor}
                  onChange={(e) => setInputColor(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-lg"
                  placeholder="#3B82F6"
                />
                <p className="text-xs text-gray-500 mt-1">Enter HEX color code or use the color picker</p>
              </div>
              <button
                onClick={loadRandomColor}
                className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Random
              </button>
            </div>
          </div>

          {/* Color Display */}
          <div className="mb-6">
            <div 
              className="w-full h-48 rounded-lg border-2 border-gray-300 shadow-inner"
              style={{ backgroundColor: inputColor }}
            />
          </div>

          {/* Color Name Result */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">Closest Named Color</div>
                <div className="text-4xl font-bold text-gray-800 mb-2">{colorName}</div>
                <div className="inline-block px-4 py-2 bg-white rounded-full shadow-sm">
                  <span className="text-sm text-gray-600">Category: </span>
                  <span className="text-sm font-semibold text-blue-600">{colorCategory}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Color Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-xs text-gray-600 mb-1">Your HEX</div>
              <button
                onClick={() => copyToClipboard(inputColor)}
                className="text-lg font-mono font-bold text-gray-800 hover:text-blue-600 transition-colors"
              >
                {inputColor}
              </button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-xs text-gray-600 mb-1">RGB</div>
              <div className="text-lg font-mono font-bold text-gray-800">
                {hexToRgb(inputColor) && `${hexToRgb(inputColor).r}, ${hexToRgb(inputColor).g}, ${hexToRgb(inputColor).b}`}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-xs text-gray-600 mb-1">CSS Name</div>
              <button
                onClick={() => copyToClipboard(colorName.toLowerCase().replace(/ /g, ''))}
                className="text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors"
              >
                {colorName.toLowerCase().replace(/ /g, '')}
              </button>
            </div>
          </div>

          {/* Similar Colors */}
          {similarColors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Similar Colors in {colorCategory} Category
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {similarColors.map((color, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => loadColorByName(color.hex)}
                  >
                    <div
                      className="w-full h-24"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="p-3">
                      <div className="text-sm font-semibold text-gray-800 mb-1">{color.name}</div>
                      <div className="text-xs font-mono text-gray-600">{color.hex}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Browser */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              All Colors in {colorCategory} Category
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {getCategoryColors().map((color, index) => (
                <div
                  key={index}
                  className="group cursor-pointer"
                  onClick={() => loadColorByName(color.hex)}
                  title={color.name}
                >
                  <div
                    className="w-full h-16 rounded-lg border border-gray-200 group-hover:border-blue-500 transition-all group-hover:scale-105"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="text-xs text-center mt-1 text-gray-600 group-hover:text-blue-600 transition-colors">
                    {color.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200 mt-6">
            <button
              onClick={loadRandomColor}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Random Color
            </button>
            <button
              onClick={() => setInputColor('#3B82F6')}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding Web Color Names</h2>
          
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">
              Web color names are predefined color keywords recognized by all modern browsers and can be used directly in CSS instead of HEX or RGB values. There are 147 standard color names defined in the CSS specification, making it easier to reference common colors in your code without memorizing color codes.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">How This Tool Works</h3>
            <p className="text-gray-700 mb-4">
              Our color name finder uses mathematical color distance calculations to find the closest named color to your input:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-2">
              <li><strong>Color matching:</strong> Calculates Euclidean distance in RGB color space</li>
              <li><strong>Closest match:</strong> Finds the named color with minimum distance to your input</li>
              <li><strong>Category grouping:</strong> Organizes colors into logical categories (Red, Blue, Green, etc.)</li>
              <li><strong>Similar colors:</strong> Shows other colors in the same category</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Benefits of Using Named Colors</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-2">
              <li><strong>Readability:</strong> Code is more readable with names like "coral" vs "#FF7F50"</li>
              <li><strong>No memorization:</strong> Don't need to remember hex codes for common colors</li>
              <li><strong>Quick prototyping:</strong> Faster to type color names during development</li>
              <li><strong>Universal support:</strong> All browsers support CSS color names</li>
              <li><strong>Easy communication:</strong> Simpler to discuss colors with team members</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Using Named Colors in CSS</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4 font-mono text-sm">
              <div>/* Using color names */</div>
              <div>background-color: dodgerblue;</div>
              <div>color: crimson;</div>
              <div>border: 2px solid forestgreen;</div>
              <div className="mt-2">/* Same as using hex codes */</div>
              <div>background-color: #1E90FF;</div>
              <div>color: #DC143C;</div>
              <div>border: 2px solid #228B22;</div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Color Categories Explained</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <h4 className="font-bold text-gray-800 mb-1">Red Colors</h4>
                <p className="text-sm text-gray-700">Warm, energetic colors ranging from light coral to dark crimson</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <h4 className="font-bold text-gray-800 mb-1">Orange Colors</h4>
                <p className="text-sm text-gray-700">Vibrant, attention-grabbing colors from peach to dark orange</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <h4 className="font-bold text-gray-800 mb-1">Yellow Colors</h4>
                <p className="text-sm text-gray-700">Bright, cheerful colors including gold, khaki, and lemon tones</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h4 className="font-bold text-gray-800 mb-1">Green Colors</h4>
                <p className="text-sm text-gray-700">Natural, calming colors from lime to forest green</p>
              </div>
              <div className="bg-cyan-50 p-3 rounded-lg border border-cyan-200">
                <h4 className="font-bold text-gray-800 mb-1">Cyan Colors</h4>
                <p className="text-sm text-gray-700">Cool, refreshing colors including aqua, turquoise, and teal</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h4 className="font-bold text-gray-800 mb-1">Blue Colors</h4>
                <p className="text-sm text-gray-700">Professional, trustworthy colors from sky blue to navy</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h4 className="font-bold text-gray-800 mb-1">Purple Colors</h4>
                <p className="text-sm text-gray-700">Luxurious, creative colors including violet, indigo, and lavender</p>
              </div>
              <div className="bg-pink-50 p-3 rounded-lg border border-pink-200">
                <h4 className="font-bold text-gray-800 mb-1">Pink Colors</h4>
                <p className="text-sm text-gray-700">Playful, feminine colors from hot pink to light pink</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Practical Use Cases</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-2">
              <li><strong>Code Review:</strong> Identify unnamed colors in existing code and suggest named alternatives</li>
              <li><strong>Documentation:</strong> Reference colors by name in design documentation</li>
              <li><strong>Learning:</strong> Understand the relationship between hex codes and color names</li>
              <li><strong>Quick Lookup:</strong> Find the CSS name for colors from design tools</li>
              <li><strong>Color Exploration:</strong> Discover new colors within specific categories</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Limitations of Named Colors</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-2">
              <li>Limited palette - only 147 predefined colors available</li>
              <li>Not all brand colors have named equivalents</li>
              <li>Some names are ambiguous (like "tan" or "peru")</li>
              <li>Your exact color may not match any named color perfectly</li>
              <li>Best for common colors; custom brand colors still need hex codes</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Best Practices</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-2">
              <li>Use named colors for common, standard colors in prototypes</li>
              <li>Use hex/RGB for exact brand colors and custom designs</li>
              <li>Consider using CSS variables for both named and custom colors</li>
              <li>Document color choices in your style guide</li>
              <li>Test named colors across different browsers (though all modern browsers support them)</li>
            </ul>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Are CSS color names supported in all browsers?
              </h3>
              <p className="text-gray-700">
                Yes, all 147 standard CSS color names are supported in all modern browsers including Chrome, Firefox, Safari, Edge, and even Internet Explorer 9+. These color names are part of the CSS specification and have been standardized for many years. You can safely use them in production websites without compatibility concerns. However, for exact brand colors or specific design requirements, HEX or RGB codes are still recommended.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Why doesn't my exact color match any named color?
              </h3>
              <p className="text-gray-700">
                There are only 147 named colors in CSS, but over 16 million possible colors in the RGB color space. This tool finds the closest named color to your input, but it may not be an exact match. If you need a specific color that doesn't match well, you should continue using the HEX code. Named colors are best for standard, common colors rather than precise custom colors. For brand-specific colors, stick with HEX codes and document them in your style guide.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Can I use color names in JavaScript and other languages?
              </h3>
              <p className="text-gray-700">
                CSS color names work directly in CSS and HTML styling. In JavaScript, you can use named colors when setting style properties (element.style.color = "crimson"). However, when getting computed colors, JavaScript always returns RGB format. For other programming languages and design tools, support varies. Most modern tools recognize CSS color names, but it's always safer to use HEX codes for cross-platform compatibility and when working with non-web technologies.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Should I use named colors or HEX codes in production?
              </h3>
              <p className="text-gray-700">
                Use named colors for quick prototyping, common standard colors, and when readability is more important than precision. Use HEX codes for brand colors, exact color matching, design system colors, and professional production work. Many developers use a hybrid approach: named colors for common elements (like "white", "black", "gray") and HEX codes for brand-specific colors. Consider using CSS custom properties (variables) that can reference either named colors or HEX codes, giving you the best of both worlds.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                How accurate is the color matching algorithm?
              </h3>
              <p className="text-gray-700">
                Our tool uses Euclidean distance in RGB color space to find the mathematically closest named color. This provides accurate results for most colors, though human color perception is more complex than pure mathematical distance. The "closest" color mathematically might not always be the closest perceptually. For best results, review the suggested color and the similar colors list to see if a different named color better matches your needs. The tool is excellent for finding approximate matches and discovering named alternatives.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                What's the difference between similar colors in the same category?
              </h3>
              <p className="text-gray-700">
                Similar colors are other named colors in the same color family (Red, Blue, Green, etc.) that are mathematically close to your input color. They're ordered by distance, so the first ones are most similar. This helps you discover alternative named colors that might work better for your design. For example, if you input a reddish color, you might see "crimson", "firebrick", and "indian red" as similar options. Click any similar color to explore it and see its full details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
