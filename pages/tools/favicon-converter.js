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

        {/* Comprehensive Content Section */}
        <div className="card mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Complete Guide to Favicon Optimization</h2>
          <div className="prose max-w-none text-gray-700 space-y-4">
            <p>
              Let's talk about favicons - those tiny icons that make your website instantly recognizable. You know when you open 20 browser tabs and can immediately spot your favorite sites just by looking at their tiny icons? That's the power of a well-designed favicon. It's not just about looking professional; it's about brand recognition, user experience, and yes, even SEO.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Why Your Website Needs Multiple Favicon Sizes</h3>
            <p>
              Here's something most people don't realize - you can't just slap a single 16x16 pixel icon on your website and call it a day. Different devices, platforms, and browsers need different sizes. Think about it: Apple devices want 180x180 for their touch icons, Android needs 192x192 and 512x512 for home screen shortcuts and splash screens, and desktop browsers prefer 32x32 for retina displays.
            </p>
            <p>
              Our <strong>favicon converter tool</strong> automatically generates all nine essential sizes you need. We're talking about 16x16, 32x32, 48x48, 64x64, 96x96, 128x128, 180x180, 192x192, and 512x512 pixels. That's every size from tiny browser tabs to full-screen splash pages covered in one click.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Best Practices for Favicon Design</h3>
            <p>
              So you're probably wondering - what makes a great favicon? First rule: keep it simple. At 16x16 pixels, you literally have 256 tiny squares to work with. Detailed logos with lots of text? They'll look like a blurry mess. Instead, focus on your brand's most recognizable element - maybe it's your first letter, a simplified version of your logo, or a distinctive symbol.
            </p>
            <p>
              Color choice matters too. Use bold, contrasting colors that stand out against both light and dark browser interfaces. Test your favicon on different backgrounds to make sure it's always visible. And here's a pro tip: avoid pure white backgrounds because they'll disappear against light-themed browsers.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Technical SEO Impact of Favicons</h3>
            <p>
              Now, does having a favicon directly affect your Google rankings? Not exactly, but hear me out. Google looks at user experience signals, and favicons play a huge role there. When users can quickly identify your site among multiple tabs, they're more likely to return to it. Lower bounce rates, longer session durations, higher return visitor rates - these are all SEO signals that matter.
            </p>
            <p>
              Plus, having proper <strong>favicon implementation</strong> shows search engines that you care about the technical details of your website. It's part of the bigger picture of professional website management. Use our <a href="/tools/seo-audit" className="text-emerald-600 hover:underline font-semibold">SEO Audit Tool</a> to check if your favicon is properly configured along with 18 other critical SEO factors.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Common Favicon Mistakes to Avoid</h3>
            <p>
              Let me tell you about the biggest mistake I see all the time - people upload a 512x512 image and let the browser scale it down. Bad idea. Images scaled down by browsers look pixelated and unprofessional at small sizes. That's why you need proper conversion with quality optimization for each size.
            </p>
            <p>
              Another rookie error? Using the wrong file format. While browsers support various formats, PNG is your safest bet for crisp, transparent backgrounds. ICO files are legacy but still work. SVG favicons are gaining support but aren't universally compatible yet. Stick with PNG and you can't go wrong.
            </p>
            <p>
              And don't forget about caching! Once you update your favicon, browsers might still show the old one for days. That's because favicons are heavily cached. Always use versioned filenames or cache-busting techniques when updating. Better yet, test in an incognito window first.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Favicon and Progressive Web Apps (PWAs)</h3>
            <p>
              If you're building a Progressive Web App, favicons become even more critical. Android and iOS use those larger icon sizes (192x192 and 512x512) when users add your app to their home screen. These icons represent your app alongside native apps, so they need to look sharp and professional.
            </p>
            <p>
              The 512x512 icon is particularly important because it's used for splash screens when your PWA launches. Think of it as your app's first impression - you want that loading screen to look professional, not pixelated or stretched.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Testing Your Favicons Across Devices</h3>
            <p>
              After you've generated and uploaded your favicons, don't just assume they're working. Test them! Open your site on different browsers - Chrome, Firefox, Safari, Edge. Check it on your phone and tablet. Add it to your home screen and see how the 192x192 icon looks. Open multiple tabs and verify the 16x16 icon is crisp and recognizable.
            </p>
            <p>
              Use developer tools to force-refresh and clear cached icons. Sometimes you'll need to hard refresh (Ctrl+Shift+R or Cmd+Shift+R) to see updates. And always check the browser console for any 404 errors related to missing favicon files - those count as broken resources and can affect performance scores.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Integrating Favicons with Your Web Development Workflow</h3>
            <p>
              Smart developers automate favicon generation as part of their build process. But starting out? Our manual converter works perfectly. Generate your icons once, store them in your project repository, and reference them in your HTML template. Most modern frameworks like Next.js, React, Vue, and WordPress make this super easy with dedicated favicon configuration options.
            </p>
            <p>
              Speaking of technical setup, make sure your server is configured to serve image files with proper MIME types. PNG files should be served as image/png. Sounds obvious, but misconfigured servers can cause browsers to reject your carefully crafted favicons.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Measuring Favicon Performance</h3>
            <p>
              Yes, you can actually measure how your favicon performs! Use our <a href="/tools/http-status-checker" className="text-emerald-600 hover:underline font-semibold">HTTP Status Checker</a> to verify all your favicon files are returning proper 200 status codes. Run a <a href="/tools/seo-audit" className="text-emerald-600 hover:underline font-semibold">full SEO audit</a> to check if your favicon is properly detected and if it's causing any page speed issues.
            </p>
            <p>
              Favicon files should be optimized for size - ideally under 10KB even for the largest 512x512 version. Use image compression tools to reduce file sizes without sacrificing quality. Every kilobyte counts when it comes to page load speed, especially on mobile connections.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Advanced Favicon Techniques</h3>
            <p>
              Want to get fancy? You can actually create animated favicons (though browser support varies), use different favicons for dark mode (with media queries in your manifest), or even dynamically change favicons based on page state using JavaScript. Ever noticed how some sites change their favicon to show notifications? That's all JavaScript magic.
            </p>
            <p>
              For e-commerce sites, some developers change the favicon to show cart quantity. For productivity apps, favicons can indicate unread messages or pending tasks. These dynamic touches enhance user experience and keep users engaged even when your tab isn't active.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Favicon Troubleshooting Guide</h3>
            <p>
              Favicon not showing up? First, check your HTML syntax - make sure those link tags are in the head section. Second, verify file paths are correct and files are actually uploaded to your server. Third, clear your browser cache completely. Fourth, check browser developer tools for any 404 errors.
            </p>
            <p>
              Still not working? Check if your .htaccess or server configuration is blocking image files. Some security plugins or firewalls can inadvertently block favicon requests. Use our <a href="/tools/broken-links-checker" className="text-emerald-600 hover:underline font-semibold">Broken Links Checker</a> to verify all your favicon files are accessible.
            </p>

            <p className="text-lg font-semibold text-emerald-700 mt-6 border-t pt-6">
              Ready to create professional favicons for your website? Upload your logo or icon image above and get all 9 essential favicon sizes in seconds. Completely free, no watermarks, no signup required. Give your website the professional polish it deserves with optimized favicons for every device and platform.
            </p>
          </div>
        </div>

        {/* Related Tools */}
        <div className="card mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Website Optimization Tools</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <a href="/tools/seo-audit" className="block p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-lg transition-all">
              <h3 className="font-semibold text-emerald-600 mb-2">SEO Audit Tool</h3>
              <p className="text-sm text-gray-600">Run comprehensive SEO analysis with 18+ checks including favicon detection</p>
            </a>
            <a href="/tools/image-compress" className="block p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-lg transition-all">
              <h3 className="font-semibold text-emerald-600 mb-2">Image Compressor</h3>
              <p className="text-sm text-gray-600">Optimize your favicon source images before conversion</p>
            </a>
            <a href="/tools/meta-generator" className="block p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-lg transition-all">
              <h3 className="font-semibold text-emerald-600 mb-2">Meta Tags Generator</h3>
              <p className="text-sm text-gray-600">Create complete meta tags for better SEO and social sharing</p>
            </a>
            <a href="/tools/http-status-checker" className="block p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-lg transition-all">
              <h3 className="font-semibold text-emerald-600 mb-2">HTTP Status Checker</h3>
              <p className="text-sm text-gray-600">Verify your favicon files are loading correctly (200 status)</p>
            </a>
            <a href="/tools/broken-links-checker" className="block p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-lg transition-all">
              <h3 className="font-semibold text-emerald-600 mb-2">Broken Links Checker</h3>
              <p className="text-sm text-gray-600">Find broken favicon links and other 404 errors on your site</p>
            </a>
            <a href="/tools/schema-generator" className="block p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-lg transition-all">
              <h3 className="font-semibold text-emerald-600 mb-2">Schema Markup Generator</h3>
              <p className="text-sm text-gray-600">Add structured data for enhanced search appearance</p>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
