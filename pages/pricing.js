import Layout from '../components/Layout';
import Head from 'next/head';

export default function Pricing() {
  return (
    <Layout>
      <Head>
        <title>Pricing - Coming Soon | ProURLMonitor</title>
        <meta name="description" content="ProURLMonitor pricing plans coming soon. All tools are currently free to use. Stay tuned for premium features and plans." />
        <link rel="canonical" href="https://www.prourlmonitor.com/pricing" />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <span className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Coming Soon
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Pricing Plans
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            We're working on flexible pricing options for advanced features
          </p>
        </div>

        <div className="card max-w-2xl mx-auto bg-gradient-to-br from-emerald-50 to-blue-50 border-2 border-emerald-200">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-2xl font-bold text-emerald-700 mb-4">All Tools Currently FREE</h2>
          <p className="text-gray-700 mb-6">
            Enjoy unlimited access to all our SEO tools while we prepare exciting premium features. 
            No credit card required, no hidden fees.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 text-left">
            <div className="bg-white rounded-lg p-4">
              <div className="text-emerald-600 text-2xl mb-2">✓</div>
              <div className="font-semibold text-gray-900 mb-1">SEO Audit</div>
              <div className="text-sm text-gray-600">18 automated checks</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-emerald-600 text-2xl mb-2">✓</div>
              <div className="font-semibold text-gray-900 mb-1">Meta Tags</div>
              <div className="text-sm text-gray-600">Generate optimized tags</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-emerald-600 text-2xl mb-2">✓</div>
              <div className="font-semibold text-gray-900 mb-1">Schema Markup</div>
              <div className="text-sm text-gray-600">JSON-LD generator</div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Coming Premium Features</h3>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
            <div className="card bg-white">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold text-gray-900 mb-2">Advanced Analytics</div>
              <div className="text-sm text-gray-600">Track historical SEO data and trends over time</div>
            </div>
            <div className="card bg-white">
              <div className="text-2xl mb-2">🔔</div>
              <div className="font-semibold text-gray-900 mb-2">Alert Monitoring</div>
              <div className="text-sm text-gray-600">Get notified when issues are detected</div>
            </div>
            <div className="card bg-white">
              <div className="text-2xl mb-2">📈</div>
              <div className="font-semibold text-gray-900 mb-2">Rank Tracking</div>
              <div className="text-sm text-gray-600">Monitor keyword positions daily</div>
            </div>
            <div className="card bg-white">
              <div className="text-2xl mb-2">👥</div>
              <div className="font-semibold text-gray-900 mb-2">Team Collaboration</div>
              <div className="text-sm text-gray-600">Share reports and work together</div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <a href="/" className="btn btn-primary text-lg px-8 py-3">
            🔧 Explore Free Tools
          </a>
          <p className="text-sm text-gray-500 mt-4">
            Want to be notified when pricing launches? Follow us on social media!
          </p>
        </div>
      </div>
    </Layout>
  );
}
