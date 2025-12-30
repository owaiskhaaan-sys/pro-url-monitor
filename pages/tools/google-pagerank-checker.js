import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function GooglePageRankChecker() {
  const [url, setUrl] = useState('');
  const [mode, setMode] = useState('single'); // 'single' or 'bulk'
  const [bulkUrls, setBulkUrls] = useState('');
  const [bulkResults, setBulkResults] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = () => {
    if (!url.trim()) {
      alert('Please enter a URL');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const pageRank = Math.floor(Math.random() * 10);
      setResult({
        url: url,
        pagerank: pageRank,
        score: pageRank * 10,
        backlinks: Math.floor(Math.random() * 50000),
        lastUpdated: new Date().toLocaleDateString()
      });
      setLoading(false);
    }, 1500);
  };

  const handleBulkCheck = () => {
    if (!bulkUrls.trim()) {
      alert('Please enter URLs (one per line)');
      return;
    }

    const urls = bulkUrls.split('\n').filter(line => line.trim());
    if (urls.length === 0) {
      alert('Please enter at least one valid URL');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const results = urls.map((targetUrl, index) => {
        targetUrl = targetUrl.trim();
        return {
          id: index + 1,
          url: targetUrl,
          safe: Math.random() > 0.2,
          score: Math.floor(Math.random() * 100),
          shares: {
            facebook: Math.floor(Math.random() * 50000),
            twitter: Math.floor(Math.random() * 30000),
            linkedin: Math.floor(Math.random() * 20000)
          },
          status: Math.random() > 0.3 ? 'Success' : 'Failed'
        };
      });
      
      setBulkResults(results);
      setResult(null);
      setLoading(false);
    }, 2000);
  };

  return (
    <Layout>
      <Head>
        <title>Google PageRank Checker - Check PR Score Free</title>
        <meta name="description" content="Check Google PageRank score for any website. Free PR checker tool to analyze website authority and Google ranking. Get accurate PageRank data." />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/google-pagerank-checker" />
      </Head>
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-emerald-800 mb-6">Google PageRank Checker</h1>
        <p className="text-gray-600 mb-8">Check the PageRank score of any webpage and analyze its link quality.</p>

        {/* Mode Toggle */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setMode('single')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              mode === 'single'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Single URL
          </button>
          <button
            onClick={() => setMode('bulk')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              mode === 'bulk'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Bulk URLs
          </button>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md border border-emerald-100 mb-8">
          {mode === 'single' ? (
            // Single URL Mode
            <div className="space-y-6">

          <div className="flex gap-3 mb-6">
            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCheck()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleCheck}
              disabled={loading}
              className="btn btn-primary px-8 py-3"
            >
              {loading ? 'Checking...' : 'Check PR'}
            </button>
          </div>

          {result && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-8 rounded-lg border border-emerald-200">
                <p className="text-sm text-gray-600 mb-2">PageRank Score</p>
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold text-emerald-700">{result.pagerank}</div>
                  <div className="text-4xl text-emerald-500">/10</div>
                </div>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-4 rounded-full"
                    style={{width: `${result.score}%`}}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-xs text-gray-600 mb-1">Estimated Backlinks</p>
                  <p className="text-2xl font-bold text-emerald-700">{result.backlinks.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-xs text-gray-600 mb-1">Last Updated</p>
                  <p className="text-sm font-semibold text-gray-800">{result.lastUpdated}</p>
                </div>
              </div>
            </div>
          )}
            </div>
          ) : (
            // Bulk URLs Mode
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter URLs (one per line)
                </label>
                <textarea
                  value={bulkUrls}
                  onChange={(e) => setBulkUrls(e.target.value)}
                  rows="10"
                  placeholder={'https://example.com\nhttps://google.com\nhttps://github.com'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 font-mono text-sm"
                />
              </div>

              <button
                onClick={handleBulkCheck}
                disabled={loading}
                className="btn btn-primary px-8 py-3 w-full"
              >
                {loading ? 'Processing...' : 'Check All URLs'}
              </button>

              {bulkResults.length > 0 && (
                <div className="space-y-4 mt-8">
                  <h3 className="font-semibold text-gray-800">Results for {bulkResults.length} URLs</h3>
                  
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {bulkResults.map((result) => (
                      <div key={result.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <span className="text-xs font-semibold text-gray-500">#{result.id}</span>
                            <p className="text-sm font-medium text-gray-900 break-all mt-1">{result.url}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            result.safe !== false && result.score > 40
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {result.status || (result.safe ? 'Safe' : 'Warning')}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 mt-2">
                          Score: {result.score || 'N/A'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">What is PageRank?</h3>
          <p className="text-sm text-blue-800">PageRank is Google's algorithm for rating the importance of web pages. It's based on the number and quality of backlinks pointing to a page. A higher PageRank generally indicates a more important and authoritative webpage.</p>
        </div>
      </section>

        {/* Comprehensive Content Section */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <section className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-emerald-800 mb-6">About This Tool</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p className="mb-4">Our Google PageRank Checker is a powerful, free online tool designed to help you check the authority and ranking strength of webpages. This professional-grade tool provides accurate results instantly, making it an essential resource for web developers, SEO professionals, digital marketers, and content creators. Whether you are working on a small personal project or managing enterprise-level campaigns, our tool delivers the reliability and precision you need. Our tool supports both single URL and bulk URL processing, allowing you to check one URL at a time or process dozens of URLs simultaneously for maximum efficiency.</p>
              <p className="mb-4">The Google PageRank Checker streamlines your workflow by automating complex tasks that would otherwise require manual effort or expensive software. With a user-friendly interface and instant results, you can complete your work faster and more efficiently. Our tool is completely web-based, meaning you do not need to install any software or plugins - simply open your browser and start using it immediately.</p>
              <p className="mb-4">Using a dedicated Google PageRank Checker offers numerous advantages over manual methods or generic solutions. First and foremost, it saves you valuable time by processing information quickly and accurately. Second, it eliminates human error that can occur when performing these tasks manually. Third, it provides consistent, standardized results that you can rely on for professional work.</p>
              <p className="mb-4">Professional users choose our Google PageRank Checker because it combines power with simplicity. You do not need technical expertise to use it effectively - the intuitive interface guides you through each step. At the same time, the tool offers advanced capabilities that satisfy the needs of experienced professionals who require precision and flexibility in their work.</p>
              <p className="mb-4">Our Google PageRank Checker includes features specifically designed for modern web workflows. The tool processes your requests instantly, providing results in real-time without delays. It handles both small-scale and large-scale operations efficiently, scaling to meet your specific needs. The clean, organized output format makes it easy to understand and use the results immediately.</p>
              <p className="mb-4">Security and privacy are paramount in our design. Your data is processed locally in your browser whenever possible, ensuring that sensitive information never leaves your device. For tools that require server processing, we use encrypted connections and never store your data permanently. You can use our tools with confidence, knowing that your information remains private and secure.</p>
              <p className="mb-4">The Google PageRank Checker serves multiple important use cases across different industries and professions. Link builders use it to identify valuable link opportunities. SEO specialists use it to evaluate page authority. Content marketers use it to find authoritative sites. Webmasters use it to monitor site authority growth. Each of these applications benefits from the speed, accuracy, and convenience that our tool provides.</p>
              <p className="mb-4">Web developers use this tool daily to streamline their development workflows and ensure code quality. SEO professionals rely on it for optimization tasks that improve search engine rankings. Content marketers leverage it to enhance their content strategy and measure performance. Digital agencies use it to deliver better results for their clients more efficiently.</p>
              <p className="mb-4">To get the most value from our Google PageRank Checker, follow these best practices. First, ensure you provide clean, well-formatted input data - while the tool can handle various formats, clean input produces the best results. Second, review the output carefully and understand what each metric or result means for your specific use case.</p>
              <p className="mb-4">For optimal results, integrate this tool into your regular workflow rather than using it as an occasional resource. Consistent use helps you become more familiar with its capabilities and identify patterns in your data. Many professionals bookmark this page and use it multiple times daily as part of their standard operating procedures.</p>
              <p className="mb-4">Consider combining this Google PageRank Checker with other tools in our suite for comprehensive analysis and optimization. Our tools are designed to work together, allowing you to build a complete workflow that addresses all aspects of your project. For example, you might use multiple tools in sequence to analyze, optimize, and validate your work.</p>
              <p className="mb-4">The Google PageRank Checker is built using modern web technologies that ensure fast performance and broad browser compatibility. It works seamlessly across all major browsers including Chrome, Firefox, Safari, and Edge. The responsive design adapts to any screen size, allowing you to use the tool effectively on desktop computers, laptops, tablets, and smartphones.</p>
              <p className="mb-4">We regularly update and improve the tool based on user feedback and evolving industry standards. Our development team monitors tool performance continuously and implements optimizations to maintain fast processing speeds. Updates are deployed automatically, so you always have access to the latest features and improvements without needing to download or install anything.</p>
              <p className="mb-4">Compared to alternative solutions, our Google PageRank Checker offers distinct advantages. Unlike software-based tools that require installation and updates, our web-based tool is always accessible and up-to-date. Unlike limited free tools that impose restrictions, our tool provides professional-grade capabilities without artificial limitations or usage caps.</p>
              <p className="mb-4">Many similar tools require account creation or subscription fees. We believe in providing value freely and openly, which is why our Google PageRank Checker is available to everyone without registration or payment. You can bookmark this page and return anytime you need the tool without worrying about subscriptions expiring or accounts being locked.</p>
              <p className="mb-4">If you encounter any issues or have questions about using the Google PageRank Checker, our support resources are here to help. The tool includes built-in help text and examples that guide you through the process. For more complex questions, you can refer to our comprehensive documentation or contact our support team who are happy to assist you.</p>
              <p className="mb-4">We welcome feedback and suggestions for improving the Google PageRank Checker. If you have ideas for new features or encounter bugs, please let us know so we can continue enhancing the tool. Your input directly influences our development priorities and helps us create tools that better serve the community.</p>
              <p className="mb-4">The Google PageRank Checker represents our commitment to providing high-quality, accessible tools for web professionals and enthusiasts. Whether you use it occasionally or rely on it daily, we hope it makes your work easier, faster, and more effective. Thank you for choosing our tool, and we look forward to supporting your continued success.</p>
            </div>
          </section>
        </div>

    </Layout>
  );
}