import { useState, useRef } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function FaviconConverter() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFavicons, setConvertedFavicons] = useState([]);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const faviconSizes = [
    { size: 16, name: 'favicon-16x16.png', description: 'Browser tab' },
    { size: 32, name: 'favicon-32x32.png', description: 'Standard' },
    { size: 48, name: 'favicon-48x48.png', description: 'Windows site icons' },
    { size: 64, name: 'favicon-64x64.png', description: 'Windows site icons' },
    { size: 96, name: 'favicon-96x96.png', description: 'Google TV' },
    { size: 128, name: 'favicon-128x128.png', description: 'Chrome Web Store' },
    { size: 180, name: 'apple-touch-icon.png', description: 'Apple touch icon' },
    { size: 192, name: 'android-chrome-192x192.png', description: 'Android' },
    { size: 512, name: 'android-chrome-512x512.png', description: 'Android splash' }
  ];

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, SVG)');
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setConvertedFavicons([]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please drop an image file (PNG, JPG, SVG)');
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setConvertedFavicons([]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const convertToFavicons = async () => {
    if (!selectedFile) return;

    setIsConverting(true);
    const favicons = [];

    try {
      const img = new Image();
      img.src = previewUrl;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      for (const favicon of faviconSizes) {
        canvas.width = favicon.size;
        canvas.height = favicon.size;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw image with best quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, favicon.size, favicon.size);
        
        // Convert to blob
        const blob = await new Promise(resolve => {
          canvas.toBlob(resolve, 'image/png', 1.0);
        });
        
        const url = URL.createObjectURL(blob);
        
        favicons.push({
          ...favicon,
          url,
          blob
        });
      }

      setConvertedFavicons(favicons);
    } catch (error) {
      console.error('Conversion error:', error);
      alert('Failed to convert image. Please try another file.');
    } finally {
      setIsConverting(false);
    }
  };

  const downloadFavicon = (favicon) => {
    const link = document.createElement('a');
    link.href = favicon.url;
    link.download = favicon.name;
    link.click();
  };

  const downloadAll = async () => {
    if (convertedFavicons.length === 0) return;

    // Download each favicon with a small delay
    for (const favicon of convertedFavicons) {
      downloadFavicon(favicon);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setConvertedFavicons([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Layout>
      <Head>
        <title>Favicon Converter - Generate All Sizes | ProURLMonitor</title>
        <meta name="description" content="Free online favicon converter. Upload your image and generate all favicon sizes (16x16, 32x32, 180x180, 192x192, 512x512). Create favicons for web..." />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/favicon-converter" />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4 text-center">
          Favicon Converter
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Convert your image to all favicon sizes - Generate 16x16, 32x32, 180x180, and more!
        </p>

        {/* Upload Section */}
        <div className="card mb-8">
          {!selectedFile ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-emerald-500 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Drop your image here or click to browse
              </h3>
              <p className="text-gray-500 mb-4">
                Supports PNG, JPG, SVG • Recommended: Square image, at least 512x512px
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button className="btn btn-primary">
                Select Image
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Preview */}
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 border-2 border-gray-300 rounded-lg p-4 bg-gray-50 flex items-center justify-center">
                    <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {selectedFile.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Size: {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {convertedFavicons.length === 0 ? (
                      <>
                        <button
                          onClick={convertToFavicons}
                          disabled={isConverting}
                          className={`btn btn-primary ${isConverting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {isConverting ? 'Converting...' : 'Generate Favicons'}
                        </button>
                        <button
                          onClick={reset}
                          className="btn bg-gray-500 hover:bg-gray-600 text-white"
                        >
                          Choose Another
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={downloadAll}
                          className="btn btn-primary"
                        >
                          Download All ({convertedFavicons.length})
                        </button>
                        <button
                          onClick={reset}
                          className="btn bg-gray-500 hover:bg-gray-600 text-white"
                        >
                          Start Over
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Converted Favicons */}
              {convertedFavicons.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Generated Favicons ({convertedFavicons.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {convertedFavicons.map((favicon) => (
                      <div
                        key={favicon.size}
                        className="border border-gray-200 rounded-lg p-4 hover:border-emerald-500 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div 
                            className="flex-shrink-0 border border-gray-300 rounded bg-gray-50 flex items-center justify-center"
                            style={{ width: Math.min(favicon.size, 64), height: Math.min(favicon.size, 64) }}
                          >
                            <img src={favicon.url} alt={favicon.name} className="max-w-full max-h-full" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 text-sm truncate">
                              {favicon.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {favicon.size}x{favicon.size} • {favicon.description}
                            </p>
                            <button
                              onClick={() => downloadFavicon(favicon)}
                              className="mt-2 text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                            >
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">What is a Favicon?</h2>
            <p className="text-gray-600 mb-3">
              A favicon (favorite icon) is a small icon that appears in browser tabs, bookmarks, and address bars. It helps users quickly identify your website among multiple open tabs.
            </p>
            <p className="text-gray-600">
              Modern websites need multiple favicon sizes to support different devices and platforms: desktop browsers, mobile devices, Apple devices, and Android devices.
            </p>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Why Multiple Sizes?</h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span><strong>16x16 & 32x32:</strong> Browser tabs and bookmarks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span><strong>180x180:</strong> iOS Safari and Apple Touch devices</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span><strong>192x192 & 512x512:</strong> Android Chrome and PWAs</span>
              </li>
            </ul>
          </div>
        </div>

        {/* How to Use */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">How to Use Favicon Converter</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Upload Your Image</h3>
                <p className="text-gray-600">Click or drag & drop your logo or image. Best results with square images (512x512px or larger).</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Generate All Sizes</h3>
                <p className="text-gray-600">Click "Generate Favicons" to automatically create all required sizes (9 different sizes).</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Download & Use</h3>
                <p className="text-gray-600">Download all favicons and add them to your website's root directory or public folder.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Implementation Guide */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Add Favicons to Your Website</h2>
          <p className="text-gray-600 mb-4">
            After downloading, add these HTML tags to your website's &lt;head&gt; section:
          </p>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">
{`<!-- Standard favicons -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

<!-- Android Chrome -->
<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">`}
            </pre>
          </div>
        </div>
      </div>
    </Layout>
  );
}
