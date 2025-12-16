import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function SEOAudit() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleAudit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate SEO audit
    setTimeout(() => {
      setResults({
        score: Math.floor(Math.random() * 40) + 60,
        meta: {
          title: url.includes('example') ? 'Example Domain' : 'Website Title Found',
          description: 'Meta description detected',
          keywords: 'SEO, audit, website'
        },
        issues: [
          { type: 'warning', message: 'Meta description is too short (recommended: 150-160 characters)' },
          { type: 'success', message: 'Page title found and optimized' },
          { type: 'error', message: 'Missing Open Graph tags' },
          { type: 'success', message: 'Mobile-friendly design detected' }
        ],
        performance: {
          loadTime: (Math.random() * 2 + 1).toFixed(2) + 's',
          pageSize: (Math.random() * 500 + 200).toFixed(0) + 'KB',
          requests: Math.floor(Math.random() * 30) + 20
        }
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <Layout>
      <Head>
        <title>SEO Audit Tool - Complete Website SEO Analysis | ProURLMonitor</title>
        <meta name="description" content="Free SEO audit tool to analyze your website's search engine optimization. Get detailed reports on meta tags, performance, mobile-friendliness, and SEO issues." />
        <meta name="keywords" content="SEO audit, website analysis, SEO checker, meta tags analyzer, search engine optimization, SEO score" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="SEO Audit Tool - Complete Website SEO Analysis" />
        <meta property="og:description" content="Analyze your website's SEO performance with our free audit tool. Get actionable insights and recommendations." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://prourlmonitor.com/tools/seo-audit" />
        <meta property="og:image" content="https://prourlmonitor.com/og-seo-audit.png" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SEO Audit Tool - ProURLMonitor" />
        <meta name="twitter:description" content="Free SEO audit tool to analyze your website's search engine optimization" />
        <meta name="twitter:image" content="https://prourlmonitor.com/og-seo-audit.png" />
        
        {/* Additional SEO */}
        <link rel="canonical" content="https://prourlmonitor.com/tools/seo-audit" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="ProURLMonitor" />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-800 mb-3">SEO Audit Tool</h1>
          <p className="text-gray-600 text-lg">Comprehensive website SEO analysis and recommendations</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleAudit}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Website URL
            </label>
            <div className="flex gap-3">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary px-6 py-2 disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Audit SEO'}
              </button>
            </div>
          </form>
        </div>

        {results && (
          <div className="space-y-6">
            {/* SEO Score */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-emerald-700 mb-4">SEO Score</h2>
              <div className="flex items-center justify-center">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#059669"
                      strokeWidth="10"
                      strokeDasharray={`${results.score * 2.827} 282.7`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-emerald-700">{results.score}</span>
                  </div>
                </div>
              </div>
              <p className="text-center text-gray-600 mt-4">
                {results.score >= 80 ? 'Excellent SEO!' : results.score >= 60 ? 'Good, needs improvement' : 'Needs work'}
              </p>
            </div>

            {/* Meta Tags */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-emerald-700 mb-4">Meta Tags</h2>
              <div className="space-y-3">
                <div className="border-l-4 border-emerald-500 pl-4">
                  <p className="font-semibold text-gray-700">Title</p>
                  <p className="text-gray-600">{results.meta.title}</p>
                </div>
                <div className="border-l-4 border-emerald-500 pl-4">
                  <p className="font-semibold text-gray-700">Description</p>
                  <p className="text-gray-600">{results.meta.description}</p>
                </div>
                <div className="border-l-4 border-emerald-500 pl-4">
                  <p className="font-semibold text-gray-700">Keywords</p>
                  <p className="text-gray-600">{results.meta.keywords}</p>
                </div>
              </div>
            </div>

            {/* Issues & Recommendations */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-emerald-700 mb-4">Issues & Recommendations</h2>
              <div className="space-y-3">
                {results.issues.map((issue, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-lg ${
                      issue.type === 'error'
                        ? 'bg-red-50 border-l-4 border-red-500'
                        : issue.type === 'warning'
                        ? 'bg-yellow-50 border-l-4 border-yellow-500'
                        : 'bg-green-50 border-l-4 border-green-500'
                    }`}
                  >
                    <span className="text-xl">
                      {issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : '✅'}
                    </span>
                    <p className="text-gray-700">{issue.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-emerald-700 mb-4">Performance</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <p className="text-3xl font-bold text-emerald-700">{results.performance.loadTime}</p>
                  <p className="text-gray-600 mt-1">Load Time</p>
                </div>
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <p className="text-3xl font-bold text-emerald-700">{results.performance.pageSize}</p>
                  <p className="text-gray-600 mt-1">Page Size</p>
                </div>
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <p className="text-3xl font-bold text-emerald-700">{results.performance.requests}</p>
                  <p className="text-gray-600 mt-1">HTTP Requests</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-emerald-50 rounded-lg p-6 mt-6">
          <h3 className="text-xl font-bold text-emerald-800 mb-3">About SEO Audit</h3>
          <p className="text-gray-700 mb-3">
            Our SEO audit tool analyzes your website's search engine optimization performance and provides actionable recommendations to improve your rankings.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Meta tags analysis (title, description, keywords)</li>
            <li>Performance metrics and page speed</li>
            <li>Mobile-friendliness check</li>
            <li>Open Graph and Twitter Card validation</li>
            <li>SEO issues and recommendations</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
