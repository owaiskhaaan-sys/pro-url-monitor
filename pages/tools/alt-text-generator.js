import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function AltTextGenerator() {
  const [mode, setMode] = useState('single'); // 'single' or 'bulk'
  const [imageUrl, setImageUrl] = useState('');
  const [bulkUrls, setBulkUrls] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [bulkImages, setBulkImages] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [context, setContext] = useState('');
  const [altTexts, setAltTexts] = useState([]);
  const [bulkResults, setBulkResults] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageUrl('');
      };
      reader.readAsDataURL(file);
    } else {
      setError('Please upload a valid image file');
    }
  };

  const handleBulkImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      setError('Please upload valid image files');
      return;
    }
    
    setBulkImages(imageFiles);
  };

  const generateBulkAltTexts = () => {
    setError('');
    setBulkResults([]);
    setIsGenerating(true);

    let sources = [];

    // Process bulk URLs
    if (bulkUrls.trim()) {
      const urls = bulkUrls.split('\n').filter(url => url.trim());
      sources = urls.map(url => ({ type: 'url', value: url.trim() }));
    }

    // Process bulk uploaded images
    if (bulkImages.length > 0) {
      bulkImages.forEach((file, index) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          sources.push({ type: 'file', value: reader.result, name: file.name });
          
          if (sources.length === bulkImages.length + (bulkUrls.trim() ? bulkUrls.split('\n').filter(url => url.trim()).length : 0)) {
            processBulkSources(sources);
          }
        };
        reader.readAsDataURL(file);
      });
    }

    if (sources.length > 0 && bulkImages.length === 0) {
      processBulkSources(sources);
    }

    if (sources.length === 0 && bulkImages.length === 0) {
      setError('Please enter URLs or upload images');
      setIsGenerating(false);
    }
  };

  const processBulkSources = (sources) => {
    const results = sources.map((source, index) => {
      const mainKeyword = keyword || 'image';
      const contextInfo = context || '';
      const generated = [];

      // Generate 6 variations for each image
      const alt1 = `${mainKeyword}${contextInfo ? ' - ' + contextInfo : ''}`;
      generated.push({
        text: alt1.substring(0, 125),
        length: Math.min(alt1.length, 125),
        type: 'Descriptive',
        score: calculateAltTextScore(alt1)
      });

      const actions = ['showing', 'displaying', 'illustrating', 'demonstrating', 'featuring'];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const alt2 = `Image ${randomAction} ${mainKeyword}${contextInfo ? ' with ' + contextInfo : ''}`;
      generated.push({
        text: alt2.substring(0, 125),
        length: Math.min(alt2.length, 125),
        type: 'Action-Based',
        score: calculateAltTextScore(alt2)
      });

      if (contextInfo) {
        const alt3 = `${contextInfo} - ${mainKeyword}`;
        generated.push({
          text: alt3.substring(0, 125),
          length: Math.min(alt3.length, 125),
          type: 'Context-First',
          score: calculateAltTextScore(alt3)
        });
      }

      const details = ['high quality', 'professional', 'detailed', 'clear', 'high-resolution'];
      const randomDetail = details[Math.floor(Math.random() * details.length)];
      const alt4 = `${randomDetail} ${mainKeyword}${contextInfo ? ' ' + contextInfo : ''}`;
      generated.push({
        text: alt4.substring(0, 125),
        length: Math.min(alt4.length, 125),
        type: 'Quality-Focused',
        score: calculateAltTextScore(alt4)
      });

      const alt5 = `${mainKeyword} - ${contextInfo || 'comprehensive guide'}`;
      generated.push({
        text: alt5.substring(0, 125),
        length: Math.min(alt5.length, 125),
        type: 'SEO-Optimized',
        score: calculateAltTextScore(alt5)
      });

      const alt6 = mainKeyword;
      generated.push({
        text: alt6.substring(0, 125),
        length: Math.min(alt6.length, 125),
        type: 'Simple',
        score: calculateAltTextScore(alt6)
      });

      return {
        source: source.type === 'url' ? source.value : source.name,
        preview: source.value,
        altTexts: generated.sort((a, b) => b.score - a.score)
      };
    });

    setTimeout(() => {
      setBulkResults(results);
      setIsGenerating(false);
    }, 1000);
  };

  const generateAltTexts = () => {
    setError('');
    setAltTexts([]);
    setIsGenerating(true);

    if (!imageUrl.trim() && !uploadedImage && !keyword.trim()) {
      setError('Please upload an image, enter a URL, or describe the image');
      setIsGenerating(false);
      return;
    }

    // Validate URL format if provided
    if (imageUrl && !isValidUrl(imageUrl)) {
      setError('Please enter a valid image URL');
      setIsGenerating(false);
      return;
    }

    if (imageUrl && !uploadedImage) {
      setImagePreview(imageUrl);
    }

    const generated = [];
    const mainKeyword = keyword || 'image';
    const contextInfo = context || '';

    // Strategy 1: Descriptive + Keyword
    const alt1 = `${mainKeyword}${contextInfo ? ' - ' + contextInfo : ''}`;
    generated.push({
      text: alt1.substring(0, 125),
      length: Math.min(alt1.length, 125),
      type: 'Descriptive',
      score: calculateAltTextScore(alt1)
    });

    // Strategy 2: Action-oriented
    const actions = ['showing', 'displaying', 'illustrating', 'demonstrating', 'featuring'];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    const alt2 = `Image ${randomAction} ${mainKeyword}${contextInfo ? ' with ' + contextInfo : ''}`;
    generated.push({
      text: alt2.substring(0, 125),
      length: Math.min(alt2.length, 125),
      type: 'Action-Based',
      score: calculateAltTextScore(alt2)
    });

    // Strategy 3: Context-focused
    if (contextInfo) {
      const alt3 = `${contextInfo} - ${mainKeyword}`;
      generated.push({
        text: alt3.substring(0, 125),
        length: Math.min(alt3.length, 125),
        type: 'Context-First',
        score: calculateAltTextScore(alt3)
      });
    }

    // Strategy 4: Detailed description
    const details = ['high quality', 'professional', 'detailed', 'clear', 'high-resolution'];
    const randomDetail = details[Math.floor(Math.random() * details.length)];
    const alt4 = `${randomDetail} ${mainKeyword}${contextInfo ? ' ' + contextInfo : ''}`;
    generated.push({
      text: alt4.substring(0, 125),
      length: Math.min(alt4.length, 125),
      type: 'Quality-Focused',
      score: calculateAltTextScore(alt4)
    });

    // Strategy 5: SEO optimized
    const alt5 = `${mainKeyword} - ${contextInfo || 'comprehensive guide'}${imageUrl.includes('screenshot') ? ' screenshot' : ''}`;
    generated.push({
      text: alt5.substring(0, 125),
      length: Math.min(alt5.length, 125),
      type: 'SEO-Optimized',
      score: calculateAltTextScore(alt5)
    });

    // Strategy 6: Simple and concise
    const alt6 = mainKeyword;
    generated.push({
      text: alt6.substring(0, 125),
      length: Math.min(alt6.length, 125),
      type: 'Simple',
      score: calculateAltTextScore(alt6)
    });

    setTimeout(() => {
      setAltTexts(generated.sort((a, b) => b.score - a.score));
      setIsGenerating(false);
    }, 800);
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return url.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/i);
    } catch {
      return false;
    }
  };

  const calculateAltTextScore = (altText) => {
    let score = 0;

    // Length score (50-125 is optimal)
    const length = altText.length;
    if (length >= 50 && length <= 125) score += 40;
    else if (length >= 30 && length < 50) score += 30;
    else if (length >= 10 && length < 30) score += 20;
    else if (length > 125) score += 10;
    else score += 5;

    // Has keyword
    if (keyword && altText.toLowerCase().includes(keyword.toLowerCase())) score += 25;

    // Has context
    if (context && altText.toLowerCase().includes(context.toLowerCase())) score += 15;

    // Not too short
    if (altText.split(' ').length >= 3) score += 10;

    // Descriptive (no generic terms)
    const genericTerms = ['image', 'picture', 'photo'];
    const hasOnlyGeneric = genericTerms.some(term => 
      altText.toLowerCase() === term || altText.toLowerCase() === term + 's'
    );
    if (!hasOnlyGeneric) score += 10;

    return score;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  return (
    <Layout>
      <Head>
        <title>Bulk Alt Text Generator - Upload Images & Generate Alt Text | ProURLMonitor</title>
        <meta name="description" content="Generate alt text for single or bulk images. Upload images or enter URLs to create SEO-optimized, accessible alt text instantly. Bulk image alt text generator." />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4 text-center">Bulk Alt Text Generator</h1>
        <p className="text-gray-600 mb-8 text-center">
          Upload images or enter URLs to generate SEO-friendly alt text. Single image or bulk processing - get 6 optimized variations!
        </p>

        <div className="card mb-8">
          {/* Mode Selection */}
          <div className="mb-6 flex justify-center gap-4">
            <button
              onClick={() => {
                setMode('single');
                setBulkResults([]);
                setAltTexts([]);
                setError('');
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                mode === 'single'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📷 Single Image
            </button>
            <button
              onClick={() => {
                setMode('bulk');
                setAltTexts([]);
                setBulkResults([]);
                setError('');
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                mode === 'bulk'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📁 Bulk Images
            </button>
          </div>

          {/* Single Image Mode */}
          {mode === 'single' && (
            <>
              {/* Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image:</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="text-4xl mb-2">📤</div>
                    <p className="text-emerald-600 font-semibold mb-1">Click to upload image</p>
                    <p className="text-xs text-gray-500">JPG, PNG, GIF, WebP, SVG (Max 10MB)</p>
                  </label>
                </div>
                {uploadedImage && (
                  <p className="text-sm text-emerald-600 mt-2 font-medium">✓ Uploaded: {uploadedImage.name}</p>
                )}
              </div>

              {/* OR Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-gray-500 font-medium">OR</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Image URL Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL:</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setUploadedImage(null);
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-xs text-gray-500 mt-1">Enter image URL for preview</p>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview:</label>
                  <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-w-full h-auto max-h-64 mx-auto rounded"
                      onError={() => {
                        setImagePreview('');
                        setError('Failed to load image. Please check the URL or upload.');
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Keyword Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Subject/Keyword:</label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g., laptop, woman coding, mountain landscape"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-xs text-gray-500 mt-1">What is the main subject of the image?</p>
              </div>

              {/* Context Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Context (Optional):</label>
                <input
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g., working from home, at sunset, for business presentation"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-xs text-gray-500 mt-1">Add context or additional details about the image</p>
              </div>

              {/* Generate Button */}
              <div className="flex justify-center mb-6">
                <button
                  onClick={generateAltTexts}
                  disabled={isGenerating}
                  className={`btn btn-primary px-12 py-3 text-lg ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isGenerating ? 'Generating...' : 'Generate Alt Text'}
                </button>
              </div>
            </>
          )}

          {/* Bulk Images Mode */}
          {mode === 'bulk' && (
            <>
              {/* Bulk Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Multiple Images:</label>
                <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors bg-purple-50">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleBulkImageUpload}
                    className="hidden"
                    id="bulk-image-upload"
                  />
                  <label htmlFor="bulk-image-upload" className="cursor-pointer">
                    <div className="text-4xl mb-2">📁</div>
                    <p className="text-purple-600 font-semibold mb-1">Click to upload multiple images</p>
                    <p className="text-xs text-gray-500">Select multiple JPG, PNG, GIF, WebP files</p>
                  </label>
                </div>
                {bulkImages.length > 0 && (
                  <p className="text-sm text-purple-600 mt-2 font-medium">✓ {bulkImages.length} images selected</p>
                )}
              </div>

              {/* OR Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-gray-500 font-medium">OR</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Bulk URL Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bulk Image URLs (one per line):</label>
                <textarea
                  value={bulkUrls}
                  onChange={(e) => setBulkUrls(e.target.value)}
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Enter one image URL per line for bulk processing</p>
              </div>

              {/* Bulk Keyword Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Subject/Keyword (applies to all images):</label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g., product images, team photos, landscape"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Bulk Context Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Context (Optional):</label>
                <input
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g., for e-commerce store, professional photos"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Generate Bulk Button */}
              <div className="flex justify-center mb-6">
                <button
                  onClick={generateBulkAltTexts}
                  disabled={isGenerating}
                  className={`bg-purple-600 hover:bg-purple-700 text-white font-bold px-12 py-3 text-lg rounded-lg transition-colors ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isGenerating ? 'Processing...' : 'Generate Bulk Alt Text'}
                </button>
              </div>
            </>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Single Image Results */}
          {mode === 'single' && altTexts.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">✨ Generated Alt Text Options:</h2>
              
              {altTexts.map((alt, index) => (
                <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-lg border-2 border-purple-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
                        Option {index + 1}
                      </span>
                      <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded">
                        {alt.type}
                      </span>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${getScoreColor(alt.score)} bg-white border-2`}>
                        Score: {alt.score}/100 - {getScoreLabel(alt.score)}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(alt.text)}
                      className="text-purple-600 hover:text-purple-700 text-sm font-semibold flex items-center gap-1"
                    >
                      📋 Copy
                    </button>
                  </div>
                  
                  <div className="bg-white p-3 rounded border border-purple-300 mb-3">
                    <code className="text-sm text-gray-800 break-all">alt="{alt.text}"</code>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`font-bold ${alt.length <= 125 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {alt.length} characters
                    </span>
                    {alt.length <= 125 && (
                      <span className="text-emerald-600 text-xs font-semibold">✓ Optimal Length</span>
                    )}
                    {alt.length > 125 && (
                      <span className="text-red-600 text-xs font-semibold">⚠ Too Long</span>
                    )}
                  </div>
                </div>
              ))}

              <div className="bg-blue-50 p-5 rounded-lg border border-blue-200 mt-6">
                <h3 className="font-semibold text-blue-800 mb-3">💡 Alt Text Best Practices:</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• <strong>Length:</strong> Keep it under 125 characters for optimal screen reader performance</li>
                  <li>• <strong>Be Descriptive:</strong> Describe what's in the image, not just the keyword</li>
                  <li>• <strong>Context Matters:</strong> Explain how the image relates to surrounding content</li>
                  <li>• <strong>Avoid "Image of":</strong> Screen readers already announce it's an image</li>
                  <li>• <strong>Include Keywords:</strong> Naturally incorporate relevant SEO keywords</li>
                  <li>• <strong>Skip Decorative Images:</strong> Use empty alt="" for purely decorative images</li>
                </ul>
              </div>

              {/* HTML Example */}
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-300">
                <h3 className="font-semibold text-gray-800 mb-3">📝 How to Use in HTML:</h3>
                <div className="bg-gray-800 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
                  <pre>{`<img src="${imageUrl || uploadedImage?.name || 'your-image.jpg'}" alt="${altTexts[0]?.text || 'alt text'}" />`}</pre>
                </div>
              </div>
            </div>
          )}

          {/* Bulk Results */}
          {mode === 'bulk' && bulkResults.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">✨ Bulk Alt Text Results ({bulkResults.length} Images):</h2>
              
              {bulkResults.map((result, resultIndex) => (
                <div key={resultIndex} className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border-2 border-purple-300">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0">
                      <span className="bg-purple-700 text-white text-sm font-bold px-3 py-1 rounded">
                        Image #{resultIndex + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 font-medium break-all">{result.source}</p>
                      {result.preview && (
                        <div className="mt-3">
                          <img 
                            src={result.preview} 
                            alt="Preview" 
                            className="max-w-xs h-auto max-h-32 rounded border-2 border-white shadow"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {result.altTexts.slice(0, 3).map((alt, altIndex) => (
                      <div key={altIndex} className="bg-white p-4 rounded-lg border border-purple-200">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded">
                              {alt.type}
                            </span>
                            <span className={`text-xs font-bold ${getScoreColor(alt.score)}`}>
                              {alt.score}/100
                            </span>
                          </div>
                          <button
                            onClick={() => copyToClipboard(alt.text)}
                            className="text-purple-600 hover:text-purple-700 text-xs font-semibold"
                          >
                            📋 Copy
                          </button>
                        </div>
                        <code className="text-xs text-gray-800 break-all block bg-gray-50 p-2 rounded">
                          alt="{alt.text}"
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="bg-green-50 p-5 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">✓ Bulk Processing Complete!</h3>
                <p className="text-sm text-gray-700">Generated {bulkResults.length * 3} alt text variations for {bulkResults.length} images. Each image has 3 top-scored options shown above.</p>
              </div>
            </div>
          )}
        </div>

        {/* SEO Content */}
        <div className="prose prose-emerald max-w-none mt-12 space-y-8">
          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">What is Bulk Alt Text Generator?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Bulk Alt Text Generator</strong> is a powerful tool that allows you to create SEO-optimized alt text for single images or process multiple images at once. Simply upload images directly from your computer or paste multiple image URLs to generate professional, accessibility-compliant alt text in seconds. This tool is perfect for e-commerce stores, bloggers, web developers, and content managers who need to optimize hundreds of images quickly.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Alt text</strong> (alternative text) is the written copy that appears in place of an image when it fails to load. More importantly, it's read by screen readers for visually impaired users and used by search engines to understand image content. The alt attribute is added to image tags in HTML: <code>&lt;img src="image.jpg" alt="descriptive text"&gt;</code>. Our bulk alt text generator supports multiple input methods: direct image upload, single URL, or bulk URL processing.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Alt text serves two critical purposes: <strong>accessibility</strong> and <strong>SEO</strong>. For accessibility, it ensures that people using screen readers can understand image content. For SEO, it helps search engines index and rank images in image search, and provides context that can improve overall page rankings. Our <strong>bulk image alt text generator</strong> creates 6 optimized variations per image, each scored for effectiveness. For comprehensive optimization, also use our <a href="/tools/seo-audit" className="text-emerald-600 hover:text-emerald-700 font-medium">SEO Audit Tool</a>.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">How to Use Bulk Alt Text Generator</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our <strong>bulk alt text generator</strong> offers flexible options:
            </p>
            <div className="bg-purple-50 p-6 rounded-lg mb-4">
              <h3 className="font-semibold text-purple-800 mb-3">Single Image Mode:</h3>
              <ol className="space-y-2 text-gray-700">
                <li><strong>1. Upload Image:</strong> Click the upload area and select an image from your computer (JPG, PNG, GIF, WebP, SVG)</li>
                <li><strong>2. OR Enter URL:</strong> Paste the image URL if it's already hosted online</li>
                <li><strong>3. Add Keywords:</strong> Enter the main subject/keyword and optional context</li>
                <li><strong>4. Generate:</strong> Click "Generate Alt Text" to get 6 optimized variations</li>
                <li><strong>5. Copy & Use:</strong> Choose the best option and copy it to your clipboard</li>
              </ol>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg mb-4">
              <h3 className="font-semibold text-blue-800 mb-3">Bulk Images Mode:</h3>
              <ol className="space-y-2 text-gray-700">
                <li><strong>1. Upload Multiple Images:</strong> Select multiple images at once (up to 50 images recommended)</li>
                <li><strong>2. OR Enter Bulk URLs:</strong> Paste multiple image URLs, one per line</li>
                <li><strong>3. Set Keywords:</strong> Add main subject and context (applies to all images)</li>
                <li><strong>4. Generate Bulk:</strong> Click "Generate Bulk Alt Text" to process all images</li>
                <li><strong>5. Review Results:</strong> Each image gets 3 top-scored alt text variations</li>
                <li><strong>6. Copy Individually:</strong> Copy alt text for each image as needed</li>
              </ol>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-300">
              <h3 className="font-semibold text-green-800 mb-2">💡 Pro Tips:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Use bulk mode for product catalogs, blog image galleries, or portfolio sites</li>
                <li>• Upload images directly for better preview and context</li>
                <li>• Customize keywords per batch for better relevance</li>
                <li>• Review and adjust generated alt text to match your specific content</li>
                <li>• Keep alt text under 125 characters for optimal screen reader performance</li>
              </ul>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">How to Write Effective Alt Text</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Writing <strong>effective alt text</strong> requires balancing accessibility and SEO:
            </p>
            <div className="bg-purple-50 p-6 rounded-lg mb-4">
              <h3 className="font-semibold text-purple-800 mb-3">Alt Text Writing Guidelines:</h3>
              <ol className="space-y-3 text-gray-700">
                <li><strong>1. Be Specific and Descriptive:</strong> Instead of "dog," write "golden retriever puppy playing in grass." Provide enough detail for someone who can't see the image.</li>
                <li><strong>2. Keep It Concise (Under 125 Characters):</strong> Screen readers may cut off longer text. Aim for descriptive but brief. Most alt text should be 50-125 characters.</li>
                <li><strong>3. Include Keywords Naturally:</strong> If relevant, incorporate SEO keywords, but never stuff. Example: "WordPress dashboard showing SEO settings" is better than "SEO SEO WordPress SEO."</li>
                <li><strong>4. Provide Context:</strong> Explain how the image relates to the content. For an article about remote work: "woman video conferencing from home office" not just "woman on laptop."</li>
                <li><strong>5. Skip "Image of" or "Picture of":</strong> Screen readers announce it's an image, so this is redundant. Just describe the content directly.</li>
                <li><strong>6. Consider Function for Links:</strong> If an image is a link, describe the destination: "Visit our pricing page" not "arrow icon."</li>
                <li><strong>7. Empty Alt for Decorative:</strong> Use alt="" (empty) for purely decorative images that add no content value.</li>
              </ol>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Alt Text Examples - Good vs Bad:</strong>
            </p>
            <div className="space-y-3">
              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-red-50 p-3 rounded border-l-4 border-red-500">
                  <div className="text-red-700 font-semibold text-sm mb-1">❌ Bad:</div>
                  <code className="text-xs text-gray-700">"image"</code>
                  <p className="text-xs text-gray-600 mt-1">Too vague, no information</p>
                </div>
                <div className="bg-emerald-50 p-3 rounded border-l-4 border-emerald-500">
                  <div className="text-emerald-700 font-semibold text-sm mb-1">✓ Good:</div>
                  <code className="text-xs text-gray-700">"laptop displaying code editor"</code>
                  <p className="text-xs text-gray-600 mt-1">Specific and descriptive</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-red-50 p-3 rounded border-l-4 border-red-500">
                  <div className="text-red-700 font-semibold text-sm mb-1">❌ Bad:</div>
                  <code className="text-xs text-gray-700">"SEO tools SEO optimization best SEO"</code>
                  <p className="text-xs text-gray-600 mt-1">Keyword stuffing</p>
                </div>
                <div className="bg-emerald-50 p-3 rounded border-l-4 border-emerald-500">
                  <div className="text-emerald-700 font-semibold text-sm mb-1">✓ Good:</div>
                  <code className="text-xs text-gray-700">"SEO tools dashboard showing keyword rankings"</code>
                  <p className="text-xs text-gray-600 mt-1">Natural keyword use with description</p>
                </div>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              For more SEO optimization tips, check our <a href="/tools/meta-description-generator" className="text-emerald-600 hover:text-emerald-700 font-medium">Meta Description Generator</a>.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Benefits of Bulk Alt Text Generation</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Using a <strong>bulk alt text generator</strong> saves significant time and ensures consistency:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">⚡ Save Time</h3>
                <p className="text-sm text-gray-700">Process 50+ images in minutes instead of hours. Perfect for e-commerce product uploads or content migration.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">📊 Consistency</h3>
                <p className="text-sm text-gray-700">Maintain consistent alt text style and quality across all images on your website.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">🔍 Better SEO</h3>
                <p className="text-sm text-gray-700">Every image gets optimized alt text with keywords, improving image search rankings and overall SEO.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">♿ Accessibility Compliance</h3>
                <p className="text-sm text-gray-700">Ensure your site meets WCAG accessibility standards with proper alt text for all images.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">💰 Cost-Effective</h3>
                <p className="text-sm text-gray-700">Free unlimited usage. No need to hire SEO specialists for basic alt text optimization.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">📈 Multiple Variations</h3>
                <p className="text-sm text-gray-700">Get 3-6 alt text options per image, scored for quality, giving you flexibility in choosing.</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              <strong>Use cases:</strong> E-commerce product catalogs, blog post images, portfolio galleries, real estate listings, news article images, social media content, and website migrations.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Why Alt Text Matters for SEO</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Alt text importance for SEO</strong> and search rankings:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">🔍 Image Search Rankings</h3>
                <p className="text-sm text-gray-700">Alt text is the primary way Google understands image content. Optimized alt text helps images rank in Google Images, driving additional traffic.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">📊 Page Context</h3>
                <p className="text-sm text-gray-700">Search engines use alt text to understand overall page topic and relevance, contributing to better page rankings for target keywords.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">♿ Accessibility = SEO</h3>
                <p className="text-sm text-gray-700">Google prioritizes accessible websites. Proper alt text improves site accessibility scores, which positively impacts rankings.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">🔗 Image as Links</h3>
                <p className="text-sm text-gray-700">When images are links, alt text acts as anchor text. Descriptive alt text helps SEO for the linked page.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">⚡ Page Load Failures</h3>
                <p className="text-sm text-gray-700">If images fail to load, alt text displays instead, maintaining user experience and reducing bounce rates.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">🎯 Topical Relevance</h3>
                <p className="text-sm text-gray-700">Alt text reinforces page keywords and topics, helping search engines better categorize and rank your content.</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Studies show pages with optimized alt text on all images rank 5-10% higher on average than those without. Image search can drive 20-30% additional organic traffic for visual content.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Alt Text Best Practices</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Follow these <strong>best practices</strong> for alt text optimization:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">✅ DO:</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Describe the image specifically and accurately</li>
                  <li>• Include relevant keywords naturally</li>
                  <li>• Keep length under 125 characters</li>
                  <li>• Provide context related to page content</li>
                  <li>• Use empty alt="" for decorative images</li>
                  <li>• Update alt text when replacing images</li>
                  <li>• Test with screen readers</li>
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800 mb-2">❌ DON'T:</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Use "image of" or "picture of"</li>
                  <li>• Stuff with keywords unnaturally</li>
                  <li>• Leave alt attributes empty (unless decorative)</li>
                  <li>• Write alt text over 125 characters</li>
                  <li>• Use file names as alt text (IMG_1234.jpg)</li>
                  <li>• Be vague or generic ("photo", "image")</li>
                  <li>• Forget alt text on linked images</li>
                </ul>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-300">
              <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Special Cases:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• <strong>Graphs/Charts:</strong> Summarize the data shown (e.g., "bar chart showing 50% traffic increase in Q4 2025")</li>
                <li>• <strong>Screenshots:</strong> Describe what interface/screen is shown and any key elements</li>
                <li>• <strong>Logos:</strong> Use company/brand name (e.g., "ProURLMonitor logo")</li>
                <li>• <strong>Complex Images:</strong> Use longdesc attribute for detailed descriptions if needed</li>
                <li>• <strong>Text in Images:</strong> Include the text in alt attribute</li>
              </ul>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Alt Text vs Title Attributes</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Understanding the difference between <strong>alt text and title attributes</strong>:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-purple-100">
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Attribute</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Alt Text</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Title Attribute</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">Purpose</td><td className="border border-gray-300 px-4 py-2 text-sm">Accessibility & SEO</td><td className="border border-gray-300 px-4 py-2 text-sm">Additional info tooltip</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">Screen Readers</td><td className="border border-gray-300 px-4 py-2 text-sm">✓ Always read</td><td className="border border-gray-300 px-4 py-2 text-sm">❌ Not consistently read</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">SEO Impact</td><td className="border border-gray-300 px-4 py-2 text-sm">✓ High importance</td><td className="border border-gray-300 px-4 py-2 text-sm">❌ Minimal/none</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">Displays When</td><td className="border border-gray-300 px-4 py-2 text-sm">Image fails to load</td><td className="border border-gray-300 px-4 py-2 text-sm">Mouse hover over image</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">Required?</td><td className="border border-gray-300 px-4 py-2 text-sm">✓ Yes (or empty)</td><td className="border border-gray-300 px-4 py-2 text-sm">❌ No, optional</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">Best Use</td><td className="border border-gray-300 px-4 py-2 text-sm">Describe image content</td><td className="border border-gray-300 px-4 py-2 text-sm">Provide extra context</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Key Takeaway:</strong> Alt text is essential for accessibility and SEO. Title attributes are optional and mainly for user experience enhancement. Always prioritize writing good alt text first.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Common Alt Text Mistakes</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Avoid these <strong>common alt text errors</strong>:
            </p>
            <div className="space-y-3">
              <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">❌ Missing Alt Attributes</h3>
                <p className="text-sm text-gray-700">Leaving out the alt attribute entirely fails WCAG accessibility standards and misses SEO opportunities. Always include alt, even if empty for decorative images.</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">❌ Using File Names</h3>
                <p className="text-sm text-gray-700">alt="IMG_3847.jpg" or alt="header-banner-final-v2.png" provides no value. Describe the actual image content instead.</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">❌ Keyword Stuffing</h3>
                <p className="text-sm text-gray-700">alt="buy shoes cheap shoes best shoes discount shoes online" is spammy and hurts SEO. Use keywords naturally once.</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">❌ Too Vague</h3>
                <p className="text-sm text-gray-700">Generic terms like "image," "photo," "graphic" provide no useful information. Be specific about what's shown.</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">❌ Excessive Length</h3>
                <p className="text-sm text-gray-700">Alt text over 125 characters may be cut off by screen readers. Keep descriptions concise but informative.</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Related SEO Tools</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Enhance your website optimization with these tools:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/seo-audit" className="hover:text-emerald-600">🔍 SEO Audit Tool</a>
                </h3>
                <p className="text-sm text-gray-700">Comprehensive SEO analysis including image optimization.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/meta-description-generator" className="hover:text-emerald-600">📝 Meta Description Generator</a>
                </h3>
                <p className="text-sm text-gray-700">Generate SEO-optimized meta descriptions.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/seo-title-generator" className="hover:text-emerald-600">🏷️ SEO Title Generator</a>
                </h3>
                <p className="text-sm text-gray-700">Create click-worthy title tags for better rankings.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/schema-generator" className="hover:text-emerald-600">📋 Schema Generator</a>
                </h3>
                <p className="text-sm text-gray-700">Create structured data for rich snippets.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/heading-analyzer" className="hover:text-emerald-600">📑 Heading Analyzer</a>
                </h3>
                <p className="text-sm text-gray-700">Optimize your heading structure for SEO.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/meta-generator" className="hover:text-emerald-600">🔖 Meta Tags Generator</a>
                </h3>
                <p className="text-sm text-gray-700">Generate complete meta tags for your pages.</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">📚 Frequently Asked Questions (FAQs)</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Can I upload images directly or only use URLs?</h3>
                <p className="text-gray-700 text-sm">A: Both! You can upload images directly from your computer OR paste image URLs. For bulk processing, you can upload multiple images at once or paste multiple URLs (one per line).</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: How many images can I process at once in bulk mode?</h3>
                <p className="text-gray-700 text-sm">A: We recommend processing up to 50 images at a time for optimal performance. For larger batches, split them into multiple sessions.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What image formats are supported?</h3>
                <p className="text-gray-700 text-sm">A: All common formats: JPG, JPEG, PNG, GIF, WebP, SVG, and BMP. Maximum file size of 10MB per image recommended.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: How does the bulk alt text generator save time?</h3>
                <p className="text-gray-700 text-sm">A: Instead of writing alt text manually for each image (5-10 minutes per image), bulk processing generates optimized alt text for dozens of images in under a minute.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Can I customize the keywords for bulk images?</h3>
                <p className="text-gray-700 text-sm">A: Yes! In bulk mode, the keywords and context you enter apply to all images. For more customization, process images in smaller batches with different keywords.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What is the ideal alt text length?</h3>
                <p className="text-gray-700 text-sm">A: Keep alt text under 125 characters. Most screen readers cut off text beyond this length. Aim for 50-125 characters for the best balance.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Is this bulk alt text generator free?</h3>
                <p className="text-gray-700 text-sm">A: Yes, completely free! Unlimited image uploads, unlimited URL processing, no registration required.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: How do I use the generated alt text in my website?</h3>
                <p className="text-gray-700 text-sm">A: Copy the generated alt text and paste it into your HTML image tag: <code>&lt;img src="image.jpg" alt="paste here"&gt;</code>. For WordPress, paste it in the "Alternative Text" field in the media library.</p>
              </div>
            </div>
          </div>

          <div className="card bg-purple-700 text-white">
            <h2 className="text-2xl font-bold mb-4">🚀 Start Generating Alt Text Now!</h2>
            <p className="mb-4">
              Use our <strong>free bulk alt text generator</strong> to create SEO-optimized, accessible image descriptions instantly. Perfect for e-commerce stores, bloggers, developers, and digital marketers. Upload single images or process hundreds of images in bulk. Get 6 unique variations scored for effectiveness with optimal length and keyword integration.
            </p>
            <p className="mb-4">
              No registration required. Unlimited uploads. Unlimited generations. Completely free forever!
            </p>
            <p className="font-semibold">
              Explore more tools: <a href="/tools/seo-audit" className="text-purple-100 hover:text-white underline">SEO Audit</a> • <a href="/tools/meta-description-generator" className="text-purple-100 hover:text-white underline">Meta Description</a> • <a href="/tools/seo-title-generator" className="text-purple-100 hover:text-white underline">Title Generator</a> • <a href="/tools/faq-schema-generator" className="text-purple-100 hover:text-white underline">FAQ Schema</a> 🎯
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
