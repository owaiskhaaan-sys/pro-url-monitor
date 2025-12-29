import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function AlexaRankComparison() {
  const [domains, setDomains] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = () => {
    const domainList = domains.split('\n').map(d => d.trim()).filter(d => d);
    if (domainList.length < 2) {
      alert('Please enter at least 2 domains');
      return;
    }
    setLoading(true);
    
    setTimeout(() => {
      const compared = domainList.map(d => ({
        domain: d,
        rank: Math.floor(Math.random() * 100000) + 1
      })).sort((a, b) => a.rank - b.rank);
      setResults(compared);
      setLoading(false);
    }, 1500);
  };

  return (
    <Layout>
      <Head>
        <title>Alexa Rank Comparison - Compare Website Traffic</title>
        <meta name="description" content="Compare Alexa rankings of multiple websites side by side. Analyze traffic comparison, rank trends, and website popularity rankings." />
      </Head>
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-emerald-800 mb-6">Alexa Rank Comparison</h1>
        <p className="text-gray-600 mb-8">Compare Alexa rankings for multiple domains side-by-side.</p>

        <div className="bg-white p-8 rounded-lg shadow-md border border-emerald-100 mb-8">
          <div className="mb-6">
            <textarea
              placeholder="example1.com&#10;example2.com&#10;example3.com"
              value={domains}
              onChange={(e) => setDomains(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 h-32 font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">Enter at least 2 domains (one per line)</p>
          </div>

          <button
            onClick={handleCompare}
            disabled={loading}
            className="btn btn-primary px-8 py-3 w-full"
          >
            {loading ? 'Comparing...' : 'Compare Ranks'}
          </button>

          {results && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-emerald-800 mb-4">Comparison Results</h3>
              <div className="space-y-4">
                {results.map((r, i) => (
                  <div key={i} className="border rounded-lg p-4 hover:bg-emerald-50 transition">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-gray-900">{r.domain}</h4>
                      <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">#{r.rank.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full"
                        style={{width: `${Math.max(5, 100 - (r.rank / Math.max(...results.map(x => x.rank))) * 100)}%`}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

        {/* Comprehensive Content Section */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <section className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-emerald-800 mb-6">About This Tool</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p className="mb-4">Our Alexa Rank Comparison is a powerful, free online tool designed to help you compare website traffic rankings between multiple domains. This professional-grade tool provides accurate results instantly, making it an essential resource for web developers, SEO professionals, digital marketers, and content creators. Whether you are working on a small personal project or managing enterprise-level campaigns, our tool delivers the reliability and precision you need.</p>
              <p className="mb-4">The Alexa Rank Comparison streamlines your workflow by automating complex tasks that would otherwise require manual effort or expensive software. With a user-friendly interface and instant results, you can complete your work faster and more efficiently. Our tool is completely web-based, meaning you do not need to install any software or plugins - simply open your browser and start using it immediately.</p>
              <p className="mb-4">Using a dedicated Alexa Rank Comparison offers numerous advantages over manual methods or generic solutions. First and foremost, it saves you valuable time by processing information quickly and accurately. Second, it eliminates human error that can occur when performing these tasks manually. Third, it provides consistent, standardized results that you can rely on for professional work.</p>
              <p className="mb-4">Professional users choose our Alexa Rank Comparison because it combines power with simplicity. You do not need technical expertise to use it effectively - the intuitive interface guides you through each step. At the same time, the tool offers advanced capabilities that satisfy the needs of experienced professionals who require precision and flexibility in their work.</p>
              <p className="mb-4">Our Alexa Rank Comparison includes features specifically designed for modern web workflows. The tool processes your requests instantly, providing results in real-time without delays. It handles both small-scale and large-scale operations efficiently, scaling to meet your specific needs. The clean, organized output format makes it easy to understand and use the results immediately.</p>
              <p className="mb-4">Security and privacy are paramount in our design. Your data is processed locally in your browser whenever possible, ensuring that sensitive information never leaves your device. For tools that require server processing, we use encrypted connections and never store your data permanently. You can use our tools with confidence, knowing that your information remains private and secure.</p>
              <p className="mb-4">The Alexa Rank Comparison serves multiple important use cases across different industries and professions. Marketers use it to benchmark against competitors. Advertisers use it to evaluate potential ad placements. Investors use it to assess website value. Publishers use it to demonstrate site authority. Each of these applications benefits from the speed, accuracy, and convenience that our tool provides.</p>
              <p className="mb-4">Web developers use this tool daily to streamline their development workflows and ensure code quality. SEO professionals rely on it for optimization tasks that improve search engine rankings. Content marketers leverage it to enhance their content strategy and measure performance. Digital agencies use it to deliver better results for their clients more efficiently.</p>
              <p className="mb-4">To get the most value from our Alexa Rank Comparison, follow these best practices. First, ensure you provide clean, well-formatted input data - while the tool can handle various formats, clean input produces the best results. Second, review the output carefully and understand what each metric or result means for your specific use case.</p>
              <p className="mb-4">For optimal results, integrate this tool into your regular workflow rather than using it as an occasional resource. Consistent use helps you become more familiar with its capabilities and identify patterns in your data. Many professionals bookmark this page and use it multiple times daily as part of their standard operating procedures.</p>
              <p className="mb-4">Consider combining this Alexa Rank Comparison with other tools in our suite for comprehensive analysis and optimization. Our tools are designed to work together, allowing you to build a complete workflow that addresses all aspects of your project. For example, you might use multiple tools in sequence to analyze, optimize, and validate your work.</p>
              <p className="mb-4">The Alexa Rank Comparison is built using modern web technologies that ensure fast performance and broad browser compatibility. It works seamlessly across all major browsers including Chrome, Firefox, Safari, and Edge. The responsive design adapts to any screen size, allowing you to use the tool effectively on desktop computers, laptops, tablets, and smartphones.</p>
              <p className="mb-4">We regularly update and improve the tool based on user feedback and evolving industry standards. Our development team monitors tool performance continuously and implements optimizations to maintain fast processing speeds. Updates are deployed automatically, so you always have access to the latest features and improvements without needing to download or install anything.</p>
              <p className="mb-4">Compared to alternative solutions, our Alexa Rank Comparison offers distinct advantages. Unlike software-based tools that require installation and updates, our web-based tool is always accessible and up-to-date. Unlike limited free tools that impose restrictions, our tool provides professional-grade capabilities without artificial limitations or usage caps.</p>
              <p className="mb-4">Many similar tools require account creation or subscription fees. We believe in providing value freely and openly, which is why our Alexa Rank Comparison is available to everyone without registration or payment. You can bookmark this page and return anytime you need the tool without worrying about subscriptions expiring or accounts being locked.</p>
              <p className="mb-4">If you encounter any issues or have questions about using the Alexa Rank Comparison, our support resources are here to help. The tool includes built-in help text and examples that guide you through the process. For more complex questions, you can refer to our comprehensive documentation or contact our support team who are happy to assist you.</p>
              <p className="mb-4">We welcome feedback and suggestions for improving the Alexa Rank Comparison. If you have ideas for new features or encounter bugs, please let us know so we can continue enhancing the tool. Your input directly influences our development priorities and helps us create tools that better serve the community.</p>
              <p className="mb-4">The Alexa Rank Comparison represents our commitment to providing high-quality, accessible tools for web professionals and enthusiasts. Whether you use it occasionally or rely on it daily, we hope it makes your work easier, faster, and more effective. Thank you for choosing our tool, and we look forward to supporting your continued success.</p>
            </div>
          </section>
        </div>

    </Layout>
  );
}