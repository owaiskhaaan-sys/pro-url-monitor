import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function ImageCompress() {
  const [mode, setMode] = useState('single'); // 'single' or 'bulk'
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  
  // Bulk mode states
  const [files, setFiles] = useState([]);
  const [compressedFiles, setCompressedFiles] = useState([]);
  const [processing, setProcessing] = useState(false);

  function handleFileChange(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }

  function handleBulkFileChange(e) {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setCompressedFiles([]);
  }

  async function compress() {
    if (!file) return;
    const img = new Image();
    img.src = preview;
    await img.decode();
    const canvas = document.createElement('canvas');
    const maxW = 1200;
    const scale = Math.min(1, maxW / img.width);
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const compressed = canvas.toDataURL('image/jpeg', 0.7);
    setResultUrl(compressed);
  }

  async function compressBulk() {
    if (files.length === 0) return;
    setProcessing(true);
    const results = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.src = url;
      
      try {
        await img.decode();
        const canvas = document.createElement('canvas');
        const maxW = 1200;
        const scale = Math.min(1, maxW / img.width);
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressed = canvas.toDataURL('image/jpeg', 0.7);
        
        results.push({
          name: file.name,
          originalSize: (file.size / 1024).toFixed(2) + ' KB',
          url: compressed,
          compressedSize: ((compressed.length * 0.75) / 1024).toFixed(2) + ' KB'
        });
      } catch (error) {
        results.push({
          name: file.name,
          error: 'Failed to compress'
        });
      }
      
      URL.revokeObjectURL(url);
    }

    setCompressedFiles(results);
    setProcessing(false);
  }

  function downloadAll() {
    compressedFiles.forEach((file, index) => {
      if (!file.error) {
        const link = document.createElement('a');
        link.href = file.url;
        link.download = `compressed-${index + 1}-${file.name.replace(/\.[^.]+$/, '.jpg')}`;
        link.click();
      }
    });
  }

  return (
    <Layout>
      <Head>
        <title>Image Compressor - Compress Images Online Free</title>
        <meta name="description" content="Compress images without losing quality. Free online image compressor for JPEG, PNG, WebP. Reduce image size for faster website loading." />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/image-compress" />
      </Head>
      <section className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-emerald-700 mb-3">Image Compressor</h1>
        <p className="text-gray-600 mb-4">Compress images online - Single or Bulk mode (JPEG output).</p>

        {/* Mode Toggle */}
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setMode('single')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${mode === 'single' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Single Image
          </button>
          <button 
            onClick={() => setMode('bulk')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${mode === 'bulk' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Bulk Images
          </button>
        </div>

        {/* Single Mode */}
        {mode === 'single' && (
          <>
            <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
            {preview && <div className="mt-4">
              <div className="text-sm text-gray-500 mb-2">Preview</div>
              <img src={preview} alt="preview" style={{maxWidth: '100%'}} className="rounded-lg border" />
            </div>}

            <div className="flex gap-2 mt-4">
              <button onClick={compress} className="btn btn-primary">Compress</button>
              <button onClick={() => { setFile(null); setPreview(null); setResultUrl(null); }} className="btn btn-secondary">Reset</button>
            </div>

            {resultUrl && (
              <div className="mt-6">
                <div className="text-sm text-gray-500 mb-2">Compressed Result</div>
                <img src={resultUrl} alt="result" style={{maxWidth: '100%'}} className="rounded-lg border" />
                <div className="mt-2">
                  <a href={resultUrl} download="compressed.jpg" className="btn btn-primary">Download</a>
                </div>
              </div>
            )}
          </>
        )}

        {/* Bulk Mode */}
        {mode === 'bulk' && (
          <>
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={handleBulkFileChange} 
              className="mb-4"
            />
            
            {files.length > 0 && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>{files.length}</strong> images selected
                </p>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button 
                onClick={compressBulk} 
                disabled={processing || files.length === 0}
                className="btn btn-primary disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Compress All'}
              </button>
              <button 
                onClick={() => { setFiles([]); setCompressedFiles([]); }} 
                className="btn btn-secondary"
              >
                Reset
              </button>
            </div>

            {compressedFiles.length > 0 && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-emerald-700">Compressed Images ({compressedFiles.length})</h3>
                  <button onClick={downloadAll} className="btn btn-primary">Download All</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {compressedFiles.map((file, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
                      {file.error ? (
                        <div className="text-red-600">
                          <p className="font-semibold">{file.name}</p>
                          <p className="text-sm">{file.error}</p>
                        </div>
                      ) : (
                        <>
                          <img src={file.url} alt={file.name} className="w-full h-40 object-cover rounded mb-2" />
                          <p className="text-sm font-semibold truncate">{file.name}</p>
                          <p className="text-xs text-gray-600">Original: {file.originalSize}</p>
                          <p className="text-xs text-gray-600">Compressed: {file.compressedSize}</p>
                          <a 
                            href={file.url} 
                            download={`compressed-${file.name.replace(/\.[^.]+$/, '.jpg')}`}
                            className="mt-2 inline-block text-emerald-600 hover:underline text-sm"
                          >
                            Download
                          </a>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <section className="mt-12 space-y-8">
        <section className="bg-blue-50 p-8 rounded-lg border border-blue-200">
          <h3 className="text-2xl font-bold text-blue-900 mb-4">What is Image Compression?</h3>
          <p className="text-blue-800 mb-4">Image compression reduces file size while preserving visual quality. Smaller images load faster, improve Core Web Vitals, and boost SEO performance. Our tool now supports both single and bulk image compression - process multiple images at once to save time!</p>
          <p className="text-blue-800">This tool compresses images directly in your browser (client-side) for privacy and speed. Whether you need to compress one image or hundreds, all processing happens locally on your device. Outputs JPEG at quality 0.7 with optional resizing to max width 1200px.</p>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-emerald-800 mb-4">How to Compress</h3>
          <div className="mb-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-amber-800 font-semibold mb-2">Two Modes Available:</p>
            <ul className="text-amber-800 space-y-1">
              <li>• <strong>Single Mode:</strong> Compress one image at a time</li>
              <li>• <strong>Bulk Mode:</strong> Compress multiple images at once</li>
            </ul>
          </div>
          
          <h4 className="font-bold text-emerald-700 mb-2">Single Image Mode:</h4>
          <ol className="list-decimal pl-6 space-y-3 text-gray-700 mb-4">
            <li>Click "Single Image" button</li>
            <li>Upload an image (PNG, JPG, or WebP)</li>
            <li>Preview the original image</li>
            <li>Click "Compress" to optimize size</li>
            <li>Download the compressed JPEG</li>
          </ol>

          <h4 className="font-bold text-emerald-700 mb-2">Bulk Images Mode:</h4>
          <ol className="list-decimal pl-6 space-y-3 text-gray-700">
            <li>Click "Bulk Images" button</li>
            <li>Select multiple images (hold Ctrl/Cmd to select multiple)</li>
            <li>Click "Compress All" to process all images</li>
            <li>Preview all compressed images with size comparison</li>
            <li>Download individually or click "Download All"</li>
            <li>All images are compressed to JPEG format at 70% quality</li>
          </ol>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-emerald-800 mb-4">Why Compress Images?</h3>
          <ul className="list-disc pl-6 space-y-3 text-gray-700">
            <li><strong>Faster Pages:</strong> Reduce load times and improve UX</li>
            <li><strong>SEO Gains:</strong> Better Core Web Vitals and rankings</li>
            <li><strong>Bandwidth Savings:</strong> Lower hosting and CDN costs</li>
            <li><strong>Better Conversions:</strong> Faster pages improve engagement</li>
            <li><strong>Privacy:</strong> Client-side compression keeps files local</li>
            <li><strong>Bulk Processing:</strong> Compress hundreds of images in minutes</li>
            <li><strong>Time Efficiency:</strong> Process entire image galleries at once</li>
            <li><strong>Consistent Quality:</strong> Apply same compression settings to all images</li>
          </ul>
        </section>

        <section className="bg-gray-50 p-8 rounded-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Related Content Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <a href="/tools/text-cleaner" className="text-emerald-600 hover:underline">→ Text Cleaner</a>
            <a href="/tools/meta-generator" className="text-emerald-600 hover:underline">→ Meta Tag Generator</a>
            <a href="/tools/bulk-alexa-rank-checker" className="text-emerald-600 hover:underline">→ Alexa Rank Checker</a>
            <a href="/tools/google-malware-checker" className="text-emerald-600 hover:underline">→ Malware Checker</a>
          </div>
        </section>
      </section>

        {/* Comprehensive Content Section */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <section className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-emerald-800 mb-6">About This Tool</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p className="mb-4">Our Image Compressor is a powerful, free online tool designed to help you reduce image file sizes while maintaining visual quality. Now featuring both Single and Bulk compression modes, this professional-grade tool provides accurate results instantly, making it an essential resource for web developers, SEO professionals, digital marketers, photographers, and content creators. Whether you need to compress one image or process an entire photo gallery, our tool delivers the reliability and precision you need.</p>
              <p className="mb-4">The Bulk Image Compression feature is a game-changer for professionals who work with multiple images daily. Instead of compressing images one by one, you can now select dozens or even hundreds of images and compress them all at once. This saves hours of manual work and ensures consistent quality across all your images. Perfect for e-commerce sites, photography portfolios, blog posts with multiple images, and any project requiring batch image optimization.</p>
              <p className="mb-4">The Image Compressor streamlines your workflow by automating complex tasks that would otherwise require manual effort or expensive software like Adobe Photoshop or paid compression services. With a user-friendly interface and instant results, you can complete your work faster and more efficiently. Our tool is completely web-based, meaning you do not need to install any software or plugins - simply open your browser, select Single or Bulk mode, and start compressing images immediately.</p>
              <p className="mb-4">Using a dedicated Image Compressor with Bulk capabilities offers numerous advantages over manual methods or generic solutions. First and foremost, it saves you valuable time - compress 50 images in the time it would take to process 5 manually. Second, it eliminates human error that can occur when performing repetitive compression tasks. Third, it provides consistent, standardized results across all images that you can rely on for professional work.</p>
              <p className="mb-4">Professional users choose our Image Compressor because it combines power with simplicity. You do not need technical expertise to use it effectively - the intuitive interface guides you through each step, whether you are compressing a single logo or an entire wedding photo album. At the same time, the tool offers advanced capabilities that satisfy the needs of experienced professionals who require precision and flexibility in their bulk image optimization workflows.</p>
              <p className="mb-4">Our Image Compressor includes features specifically designed for modern web workflows and bulk processing needs. The tool processes your requests instantly in Single mode, or efficiently handles multiple images in Bulk mode without overwhelming your browser. It handles both small-scale operations (single images) and large-scale batch operations (hundreds of images) efficiently, scaling to meet your specific needs. The clean, organized output format with thumbnails and size comparisons makes it easy to understand and use the results immediately.</p>
              <p className="mb-4">Security and privacy are paramount in our design, especially when dealing with bulk image compression. Your images are processed locally in your browser - they never get uploaded to our servers. This means your photos, product images, client work, and sensitive visual content remain 100% private and secure on your device. Whether you are compressing one image or a thousand, you can use our tool with confidence knowing that your content never leaves your computer.</p>
              <p className="mb-4">The Image Compressor serves multiple important use cases across different industries and professions. Web developers use it to optimize entire image directories for faster page loads. Photographers use it to prepare portfolio images for web galleries. E-commerce managers use Bulk mode to compress hundreds of product photos at once. Bloggers use it to optimize featured images and inline graphics. Real estate agents compress property photos. Each of these applications benefits from the speed, accuracy, convenience, and bulk processing capabilities that our tool provides.</p>
              <p className="mb-4">Web developers use the Bulk compression feature daily to optimize assets for production deployment, ensuring all images in a project are compressed uniformly. SEO professionals rely on it to improve site speed metrics across entire websites. Content marketers leverage it to prepare social media image batches. Digital agencies use it to deliver optimized image packages for their clients more efficiently. E-commerce platforms use it to process product catalog images in bulk.</p>
              <p className="mb-4">To get the most value from our Image Compressor, follow these best practices. For single images, ensure you review the preview before downloading. For bulk compression, organize your images into folders beforehand so you can select related images easily. The tool maintains the original aspect ratio and applies consistent compression settings, ensuring all your images have uniform quality. Review the size comparison data to understand your compression savings.</p>
              <p className="mb-4">For optimal results with Bulk mode, we recommend processing images in batches of 50-100 at a time for the best performance, though the tool can handle more. This ensures your browser remains responsive during processing. Consistent use helps you become more familiar with its capabilities and identify optimal compression settings for different image types. Many professionals bookmark this page and use it multiple times daily as part of their standard image preparation workflow.</p>
              <p className="mb-4">Consider combining this Image Compressor with other tools in our suite for comprehensive web optimization. Our tools are designed to work together, allowing you to build a complete workflow that addresses all aspects of your project. For example, after compressing images in bulk, you might use our SEO audit tool to verify that your page speed improvements are reflected in your Core Web Vitals scores.</p>
              <p className="mb-4">The Image Compressor is built using modern web technologies including HTML5 Canvas API for image processing and JavaScript for bulk operations handling. This ensures fast performance even when processing multiple images, with broad browser compatibility. It works seamlessly across all major browsers including Chrome, Firefox, Safari, and Edge. The responsive design adapts to any screen size, allowing you to use the tool effectively on desktop computers, laptops, tablets, and even smartphones for quick single-image compression.</p>
              <p className="mb-4">We regularly update and improve the tool based on user feedback and evolving industry standards. The recent addition of Bulk mode was directly requested by our users who needed to compress multiple images efficiently. Our development team monitors tool performance continuously and implements optimizations to maintain fast processing speeds even with large batches. Updates are deployed automatically, so you always have access to the latest features and improvements without needing to download or install anything.</p>
              <p className="mb-4">Compared to alternative solutions, our Image Compressor offers distinct advantages. Unlike desktop software like Photoshop that requires expensive subscriptions and manual batch processing setup, our web-based tool with built-in Bulk mode is completely free and ready to use instantly. Unlike online tools that upload your images to their servers (privacy risk!), our tool processes everything locally in your browser. Unlike limited free tools that restrict the number of images you can compress, our Bulk mode has no artificial limitations.</p>
              <p className="mb-4">Many similar tools require account creation, impose file size limits, or charge subscription fees for bulk compression features. We believe in providing value freely and openly, which is why our Image Compressor with full Bulk capabilities is available to everyone without registration, payment, or restrictions. You can bookmark this page and compress as many images as you need, whenever you need, without worrying about subscription renewals or usage quotas.</p>
              <p className="mb-4">If you encounter any issues or have questions about using the Image Compressor or Bulk mode, our support resources are here to help. The tool includes built-in help text and clear instructions that guide you through both single and bulk compression processes. For more complex questions about optimal compression settings or batch processing best practices, you can refer to our comprehensive documentation or contact our support team who are happy to assist you.</p>
              <p className="mb-4">We welcome feedback and suggestions for improving the Image Compressor. The Bulk mode feature was added based on user requests - your voice matters! If you have ideas for new features (like custom compression quality settings, WebP output format, or drag-and-drop functionality) or encounter bugs, please let us know so we can continue enhancing the tool. Your input directly influences our development priorities and helps us create tools that better serve the community.</p>
              <p className="mb-4">The Image Compressor represents our commitment to providing high-quality, accessible tools for web professionals and enthusiasts. Whether you compress a single image occasionally or process hundreds of images daily using Bulk mode, we hope it makes your work easier, faster, and more effective. Thank you for choosing our tool, and we look forward to supporting your continued success with your image optimization needs.</p>
            </div>
          </section>
        </div>

    </Layout>
  );
}
