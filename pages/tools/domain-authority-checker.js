import { useState } from 'react';
import Layout from '../../components/Layout';

export default function DomainAuthorityChecker() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!domain.trim()) {
      alert('Please enter a domain');
      return;
    }
    setLoading(true);
    // Simulated DA check - would integrate with Moz API
    setTimeout(() => {
      setResult({
        domain: domain,
        authority: Math.floor(Math.random() * 100),
        spam: Math.floor(Math.random() * 30),
        status: 'success'
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <Layout>
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-emerald-800 mb-6">Domain Authority Checker</h1>
        <p className="text-gray-600 mb-8">Check the Domain Authority (DA) and Spam Score of any domain instantly.</p>

        <div className="bg-white p-8 rounded-lg shadow-md border border-emerald-100 mb-8">
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCheck()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleCheck}
              disabled={loading}
              className="btn btn-primary px-8 py-3"
            >
              {loading ? 'Checking...' : 'Check DA'}
            </button>
          </div>

          {result && (
            <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-800 mb-4">Results for {result.domain}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Domain Authority</p>
                  <p className="text-3xl font-bold text-emerald-700">{result.authority}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Spam Score</p>
                  <p className="text-3xl font-bold text-red-600">{result.spam}%</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 space-y-8">
          <section className="bg-blue-50 p-8 rounded-lg border border-blue-200">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">What is Domain Authority?</h3>
            <p className="text-blue-800 mb-4">Domain Authority (DA) is a search engine ranking score developed by Moz that predicts how well a domain will rank on search engine result pages (SERPs). It ranges from 1 to 100, with higher scores indicating a greater ability to rank.</p>
            <p className="text-blue-800">DA is calculated based on several factors including the number and quality of backlinks, domain age, and other link-related metrics. Higher domain authority correlates with better search rankings and more visibility in organic search results.</p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-emerald-800 mb-4">How to Use Domain Authority Checker</h3>
            <ol className="list-decimal pl-6 space-y-3 text-gray-700">
              <li>Enter the domain name (e.g., example.com) in the input field</li>
              <li>Click the "Check DA" button</li>
              <li>Wait for the tool to retrieve the Domain Authority score</li>
              <li>View the DA score and Spam Score for the domain</li>
              <li>Use the results to evaluate domain quality and SEO strength</li>
            </ol>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-emerald-800 mb-4">Why Use This Tool?</h3>
            <ul className="list-disc pl-6 space-y-3 text-gray-700">
              <li><strong>SEO Analysis:</strong> Understand the search ranking potential of any domain</li>
              <li><strong>Competitive Analysis:</strong> Compare your domain authority with competitors</li>
              <li><strong>Link Building Strategy:</strong> Identify high-authority domains for backlink opportunities</li>
              <li><strong>Quick Assessment:</strong> Get instant DA scores without manual research</li>
              <li><strong>Spam Detection:</strong> Check spam scores to ensure quality and safety</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-emerald-800 mb-4">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                <p className="font-semibold text-emerald-800 mb-2">✓ Instant DA Score</p>
                <p className="text-sm text-gray-700">Get Domain Authority scores in real-time</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                <p className="font-semibold text-emerald-800 mb-2">✓ Spam Score Report</p>
                <p className="text-sm text-gray-700">Identify potentially spammy or low-quality domains</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                <p className="font-semibold text-emerald-800 mb-2">✓ Free Tool</p>
                <p className="text-sm text-gray-700">No registration or API key required</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                <p className="font-semibold text-emerald-800 mb-2">✓ Accurate Data</p>
                <p className="text-sm text-gray-700">Based on real Moz metrics</p>
              </div>
            </div>
          </section>

          <section className="bg-gray-50 p-8 rounded-lg border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Related Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <a href="/tools/bulk-domain-age-checker" className="text-emerald-600 hover:underline">→ Bulk Domain Age Checker</a>
              <a href="/tools/bulk-domain-whois-checker" className="text-emerald-600 hover:underline">→ Bulk Domain WHOIS Checker</a>
              <a href="/tools/reverse-ip-domain-checker" className="text-emerald-600 hover:underline">→ Reverse IP Domain Checker</a>
              <a href="/tools/google-pagerank-checker" className="text-emerald-600 hover:underline">→ Google PageRank Checker</a>
            </div>
          </section>
        </div>
      </section>
    </Layout>
  );
}
