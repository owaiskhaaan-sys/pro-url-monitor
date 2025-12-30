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
          <p className="text-blue-800 mb-4">Image compression reduces file size while preserving visual quality. Smaller images load faster, improve Core Web Vitals, and boost SEO performance.</p>
          <p className="text-blue-800">This tool compresses images directly in your browser (client-side) for privacy and speed. Outputs JPEG at quality 0.7 with optional resizing to max width 1200px.</p>
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
              <p className="mb-4">Our Image Compressor is a powerful, free online tool designed to help you reduce image file sizes while maintaining visual quality. This professional-grade tool provides accurate results instantly, making it an essential resource for web developers, SEO professionals, digital marketers, and content creators. Whether you are working on a small personal project or managing enterprise-level campaigns, our tool delivers the reliability and precision you need.</p>
              <p className="mb-4">The Image Compressor streamlines your workflow by automating complex tasks that would otherwise require manual effort or expensive software. With a user-friendly interface and instant results, you can complete your work faster and more efficiently. Our tool is completely web-based, meaning you do not need to install any software or plugins - simply open your browser and start using it immediately.</p>
              <p className="mb-4">Using a dedicated Image Compressor offers numerous advantages over manual methods or generic solutions. First and foremost, it saves you valuable time by processing information quickly and accurately. Second, it eliminates human error that can occur when performing these tasks manually. Third, it provides consistent, standardized results that you can rely on for professional work.</p>
              <p className="mb-4">Professional users choose our Image Compressor because it combines power with simplicity. You do not need technical expertise to use it effectively - the intuitive interface guides you through each step. At the same time, the tool offers advanced capabilities that satisfy the needs of experienced professionals who require precision and flexibility in their work.</p>
              <p className="mb-4">Our Image Compressor includes features specifically designed for modern web workflows. The tool processes your requests instantly, providing results in real-time without delays. It handles both small-scale and large-scale operations efficiently, scaling to meet your specific needs. The clean, organized output format makes it easy to understand and use the results immediately.</p>
              <p className="mb-4">Security and privacy are paramount in our design. Your data is processed locally in your browser whenever possible, ensuring that sensitive information never leaves your device. For tools that require server processing, we use encrypted connections and never store your data permanently. You can use our tools with confidence, knowing that your information remains private and secure.</p>
              <p className="mb-4">The Image Compressor serves multiple important use cases across different industries and professions. Web developers use it to improve page load speed. Photographers use it to optimize images for web. Marketers use it to prepare social media graphics. Bloggers use it to reduce bandwidth usage. Each of these applications benefits from the speed, accuracy, and convenience that our tool provides.</p>
              <p className="mb-4">Web developers use this tool daily to streamline their development workflows and ensure code quality. SEO professionals rely on it for optimization tasks that improve search engine rankings. Content marketers leverage it to enhance their content strategy and measure performance. Digital agencies use it to deliver better results for their clients more efficiently.</p>
              <p className="mb-4">To get the most value from our Image Compressor, follow these best practices. First, ensure you provide clean, well-formatted input data - while the tool can handle various formats, clean input produces the best results. Second, review the output carefully and understand what each metric or result means for your specific use case.</p>
              <p className="mb-4">For optimal results, integrate this tool into your regular workflow rather than using it as an occasional resource. Consistent use helps you become more familiar with its capabilities and identify patterns in your data. Many professionals bookmark this page and use it multiple times daily as part of their standard operating procedures.</p>
              <p className="mb-4">Consider combining this Image Compressor with other tools in our suite for comprehensive analysis and optimization. Our tools are designed to work together, allowing you to build a complete workflow that addresses all aspects of your project. For example, you might use multiple tools in sequence to analyze, optimize, and validate your work.</p>
              <p className="mb-4">The Image Compressor is built using modern web technologies that ensure fast performance and broad browser compatibility. It works seamlessly across all major browsers including Chrome, Firefox, Safari, and Edge. The responsive design adapts to any screen size, allowing you to use the tool effectively on desktop computers, laptops, tablets, and smartphones.</p>
              <p className="mb-4">We regularly update and improve the tool based on user feedback and evolving industry standards. Our development team monitors tool performance continuously and implements optimizations to maintain fast processing speeds. Updates are deployed automatically, so you always have access to the latest features and improvements without needing to download or install anything.</p>
              <p className="mb-4">Compared to alternative solutions, our Image Compressor offers distinct advantages. Unlike software-based tools that require installation and updates, our web-based tool is always accessible and up-to-date. Unlike limited free tools that impose restrictions, our tool provides professional-grade capabilities without artificial limitations or usage caps.</p>
              <p className="mb-4">Many similar tools require account creation or subscription fees. We believe in providing value freely and openly, which is why our Image Compressor is available to everyone without registration or payment. You can bookmark this page and return anytime you need the tool without worrying about subscriptions expiring or accounts being locked.</p>
              <p className="mb-4">If you encounter any issues or have questions about using the Image Compressor, our support resources are here to help. The tool includes built-in help text and examples that guide you through the process. For more complex questions, you can refer to our comprehensive documentation or contact our support team who are happy to assist you.</p>
              <p className="mb-4">We welcome feedback and suggestions for improving the Image Compressor. If you have ideas for new features or encounter bugs, please let us know so we can continue enhancing the tool. Your input directly influences our development priorities and helps us create tools that better serve the community.</p>
              <p className="mb-4">The Image Compressor represents our commitment to providing high-quality, accessible tools for web professionals and enthusiasts. Whether you use it occasionally or rely on it daily, we hope it makes your work easier, faster, and more effective. Thank you for choosing our tool, and we look forward to supporting your continued success.</p>
            </div>
          </section>
        </div>

    </Layout>
  );
}
