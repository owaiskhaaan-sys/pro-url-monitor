import { useState } from 'react';
import Layout from '../../components/Layout';

export default function ImageCompress() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);

  function handleFileChange(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
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

  return (
    <Layout>
      <section className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-emerald-700 mb-3">Image Compressor</h1>
        <p className="text-gray-600 mb-4">Upload an image and compress it in your browser (JPEG output).</p>

        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && <div className="mt-4">
          <div className="text-sm text-gray-500 mb-2">Preview</div>
          <img src={preview} alt="preview" style={{maxWidth: '100%'}} />
        </div>}

        <div className="flex gap-2 mt-4">
          <button onClick={compress} className="btn btn-primary">Compress</button>
          <button onClick={() => { setFile(null); setPreview(null); setResultUrl(null); }} className="btn btn-secondary">Reset</button>
        </div>

        {resultUrl && (
          <div className="mt-6">
            <div className="text-sm text-gray-500 mb-2">Compressed Result</div>
            <img src={resultUrl} alt="result" style={{maxWidth: '100%'}} />
            <div className="mt-2">
              <a href={resultUrl} download="compressed.jpg" className="btn btn-primary">Download</a>
            </div>
          </div>
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
          <ol className="list-decimal pl-6 space-y-3 text-gray-700">
            <li>Upload an image (PNG, JPG, or WebP)</li>
            <li>Preview the original image</li>
            <li>Click "Compress" to optimize size</li>
            <li>Download the compressed JPEG</li>
            <li>Use optimized images on your site for faster loads</li>
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
    </Layout>
  );
}
