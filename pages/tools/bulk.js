import { useState, useRef } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function BulkUpload() {
  const [urls, setUrls] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0, success: 0, failed: 0 });
  const fileRef = useRef();

  const parseText = (text) => {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    // If first line looks like a header (contains 'url' or 'link'), drop it
    if (lines.length > 1 && /url|link/i.test(lines[0])) lines.shift();
    // For CSV lines, take first column if comma exists
    const parsed = lines.map(line => {
      if (line.includes(',')) return line.split(',')[0].trim();
      return line;
    }).filter(l => /^https?:\/\//i.test(l));
    return parsed;
  };

  const handleFile = (e) => {
    const file = e.target.files && e.target.files[0];
    setMessage(null);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      const parsed = parseText(text);
      if (parsed.length === 0) setMessage({ type: 'error', text: 'کوئی درست URL نہیں ملا' });
      setUrls(parsed.map(u => ({ url: u, status: 'pending' })));
    };
    reader.onerror = () => setMessage({ type: 'error', text: 'Error reading file' });
    reader.readAsText(file);
  };

  const handlePaste = (e) => {
    const text = e.target.value;
    const parsed = parseText(text);
    setUrls(parsed.map(u => ({ url: u, status: 'pending' })));
  };

  const submitAll = async () => {
    if (urls.length === 0) return setMessage({ type: 'error', text: 'No URLs to submit' });
    setLoading(true);
    setMessage(null);
    setProgress({ done: 0, total: urls.length, success: 0, failed: 0 });

    const updateStatus = (index, status) => {
      setUrls(prev => {
        const copy = [...prev];
        copy[index] = { ...copy[index], status };
        return copy;
      });
    };

    const concurrency = 5;
    let i = 0;
    const workers = Array.from({ length: concurrency }).map(async () => {
      while (i < urls.length) {
        const idx = i++;
        const entry = urls[idx];
        try {
          const res = await fetch('/api/urls/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: entry.url })
          });
          const data = await res.json();
          if (res.ok) {
            updateStatus(idx, 'success');
            setProgress(p => ({ ...p, done: p.done + 1, success: p.success + 1 }));
          } else {
            updateStatus(idx, 'failed');
            setProgress(p => ({ ...p, done: p.done + 1, failed: p.failed + 1 }));
          }
        } catch (err) {
          updateStatus(idx, 'failed');
          setProgress(p => ({ ...p, done: p.done + 1, failed: p.failed + 1 }));
        }
      }
    });

    await Promise.all(workers);
    setLoading(false);
    setMessage({ type: 'success', text: `Completed: ${progress.success} success, ${progress.failed} failed` });
  };

  return (
    <Layout>
      <Head>
        <title>Bulk SEO Tools - Check Multiple URLs at Once</title>
        <meta name="description" content="Access bulk SEO tools to check multiple URLs simultaneously. Batch process domain authority, WHOIS lookups, Alexa ranks, and more." />
      </Head>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold mb-4">Bulk Upload</h1>
        <p className="text-gray-600 mb-6">Upload a CSV or TXT file with one URL per line, or paste URLs below.</p>

        <div className="card mb-6">
          {message && (
            <div className={`mb-4 p-4 rounded ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>{message.text}</div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Choose file (CSV/TXT)</label>
            <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleFile} />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Or paste URLs (one per line)</label>
            <textarea rows={6} onChange={handlePaste} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" placeholder="https://example.com/page1\nhttps://example.com/page2"></textarea>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={submitAll} disabled={loading} className="btn btn-primary">{loading ? 'Submitting...' : 'Submit All'}</button>
            <button onClick={() => { setUrls([]); setMessage(null); fileRef.current && (fileRef.current.value = null); }} className="btn btn-secondary">Clear</button>
            <div className="ml-auto text-sm text-gray-600">Total: {urls.length}</div>
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-3">Preview ({urls.length})</h2>
          <div className="table-responsive">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-2">URL</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {urls.map((u, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 break-all">{u.url}</td>
                    <td className="py-2 capitalize">{u.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

        {/* Comprehensive Content Section */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <section className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-emerald-800 mb-6">About This Tool</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p className="mb-4">Our Bulk URL Checker is a powerful, free online tool designed to help you analyze multiple URLs simultaneously for various metrics and issues. This professional-grade tool provides accurate results instantly, making it an essential resource for web developers, SEO professionals, digital marketers, and content creators. Whether you are working on a small personal project or managing enterprise-level campaigns, our tool delivers the reliability and precision you need.</p>
              <p className="mb-4">The Bulk URL Checker streamlines your workflow by automating complex tasks that would otherwise require manual effort or expensive software. With a user-friendly interface and instant results, you can complete your work faster and more efficiently. Our tool is completely web-based, meaning you do not need to install any software or plugins - simply open your browser and start using it immediately.</p>
              <p className="mb-4">Using a dedicated Bulk URL Checker offers numerous advantages over manual methods or generic solutions. First and foremost, it saves you valuable time by processing information quickly and accurately. Second, it eliminates human error that can occur when performing these tasks manually. Third, it provides consistent, standardized results that you can rely on for professional work.</p>
              <p className="mb-4">Professional users choose our Bulk URL Checker because it combines power with simplicity. You do not need technical expertise to use it effectively - the intuitive interface guides you through each step. At the same time, the tool offers advanced capabilities that satisfy the needs of experienced professionals who require precision and flexibility in their work.</p>
              <p className="mb-4">Our Bulk URL Checker includes features specifically designed for modern web workflows. The tool processes your requests instantly, providing results in real-time without delays. It handles both small-scale and large-scale operations efficiently, scaling to meet your specific needs. The clean, organized output format makes it easy to understand and use the results immediately.</p>
              <p className="mb-4">Security and privacy are paramount in our design. Your data is processed locally in your browser whenever possible, ensuring that sensitive information never leaves your device. For tools that require server processing, we use encrypted connections and never store your data permanently. You can use our tools with confidence, knowing that your information remains private and secure.</p>
              <p className="mb-4">The Bulk URL Checker serves multiple important use cases across different industries and professions. SEO teams use it for large-scale site audits. QA teams use it to test multiple pages. Migration teams use it to verify redirects. Marketing teams use it to check campaign landing pages. Each of these applications benefits from the speed, accuracy, and convenience that our tool provides.</p>
              <p className="mb-4">Web developers use this tool daily to streamline their development workflows and ensure code quality. SEO professionals rely on it for optimization tasks that improve search engine rankings. Content marketers leverage it to enhance their content strategy and measure performance. Digital agencies use it to deliver better results for their clients more efficiently.</p>
              <p className="mb-4">To get the most value from our Bulk URL Checker, follow these best practices. First, ensure you provide clean, well-formatted input data - while the tool can handle various formats, clean input produces the best results. Second, review the output carefully and understand what each metric or result means for your specific use case.</p>
              <p className="mb-4">For optimal results, integrate this tool into your regular workflow rather than using it as an occasional resource. Consistent use helps you become more familiar with its capabilities and identify patterns in your data. Many professionals bookmark this page and use it multiple times daily as part of their standard operating procedures.</p>
              <p className="mb-4">Consider combining this Bulk URL Checker with other tools in our suite for comprehensive analysis and optimization. Our tools are designed to work together, allowing you to build a complete workflow that addresses all aspects of your project. For example, you might use multiple tools in sequence to analyze, optimize, and validate your work.</p>
              <p className="mb-4">The Bulk URL Checker is built using modern web technologies that ensure fast performance and broad browser compatibility. It works seamlessly across all major browsers including Chrome, Firefox, Safari, and Edge. The responsive design adapts to any screen size, allowing you to use the tool effectively on desktop computers, laptops, tablets, and smartphones.</p>
              <p className="mb-4">We regularly update and improve the tool based on user feedback and evolving industry standards. Our development team monitors tool performance continuously and implements optimizations to maintain fast processing speeds. Updates are deployed automatically, so you always have access to the latest features and improvements without needing to download or install anything.</p>
              <p className="mb-4">Compared to alternative solutions, our Bulk URL Checker offers distinct advantages. Unlike software-based tools that require installation and updates, our web-based tool is always accessible and up-to-date. Unlike limited free tools that impose restrictions, our tool provides professional-grade capabilities without artificial limitations or usage caps.</p>
              <p className="mb-4">Many similar tools require account creation or subscription fees. We believe in providing value freely and openly, which is why our Bulk URL Checker is available to everyone without registration or payment. You can bookmark this page and return anytime you need the tool without worrying about subscriptions expiring or accounts being locked.</p>
              <p className="mb-4">If you encounter any issues or have questions about using the Bulk URL Checker, our support resources are here to help. The tool includes built-in help text and examples that guide you through the process. For more complex questions, you can refer to our comprehensive documentation or contact our support team who are happy to assist you.</p>
              <p className="mb-4">We welcome feedback and suggestions for improving the Bulk URL Checker. If you have ideas for new features or encounter bugs, please let us know so we can continue enhancing the tool. Your input directly influences our development priorities and helps us create tools that better serve the community.</p>
              <p className="mb-4">The Bulk URL Checker represents our commitment to providing high-quality, accessible tools for web professionals and enthusiasts. Whether you use it occasionally or rely on it daily, we hope it makes your work easier, faster, and more effective. Thank you for choosing our tool, and we look forward to supporting your continued success.</p>
            </div>
          </section>
        </div>

    </Layout>
  );
}
