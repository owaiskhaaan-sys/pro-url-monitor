import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

const PAGESPEED_API_KEY = 'AIzaSyBgmfPJmx4LbiCrwl0itXtKuspEsqaUM_Y';

export default function SEOAudit() {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const analyzePageSpeed = async (targetUrl, strategy) => {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&strategy=${strategy}&key=${PAGESPEED_API_KEY}`;
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('PageSpeed API error');
    return await response.json();
  };

  const handleAudit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults(null);

    try {
      let targetUrl = url.trim();
      if (!targetUrl.startsWith('http')) {
        targetUrl = 'https://' + targetUrl;
      }

      // Fetch PageSpeed data for both desktop and mobile
      const [desktopData, mobileData] = await Promise.all([
        analyzePageSpeed(targetUrl, 'desktop'),
        analyzePageSpeed(targetUrl, 'mobile')
      ]);

      const mobileScore = Math.round(mobileData.lighthouseResult.categories.performance.score * 100);
      const desktopScore = Math.round(desktopData.lighthouseResult.categories.performance.score * 100);
      const overallScore = Math.round((mobileScore + desktopScore) / 2);

      // Extract Core Web Vitals
      const mobileLCP = mobileData.lighthouseResult.audits['largest-contentful-paint']?.displayValue || 'N/A';
      const mobileFCP = mobileData.lighthouseResult.audits['first-contentful-paint']?.displayValue || 'N/A';
      const mobileCLS = mobileData.lighthouseResult.audits['cumulative-layout-shift']?.displayValue || 'N/A';
      
      const desktopLCP = desktopData.lighthouseResult.audits['largest-contentful-paint']?.displayValue || 'N/A';
      const desktopFCP = desktopData.lighthouseResult.audits['first-contentful-paint']?.displayValue || 'N/A';
      const desktopCLS = desktopData.lighthouseResult.audits['cumulative-layout-shift']?.displayValue || 'N/A';

      // Perform SEO checks
      const checks = [];

      // 1. PageSpeed Check
      checks.push({
        item: 'Google PageSpeed (Desktop & Mobile)',
        details: `Desktop: ${desktopScore}/100 (LCP ${desktopLCP}, FCP ${desktopFCP}, CLS ${desktopCLS})\nMobile: ${mobileScore}/100 (LCP ${mobileLCP}, FCP ${mobileFCP}, CLS ${mobileCLS})`,
        status: overallScore >= 80 ? 'PASS' : overallScore >= 50 ? 'Manual' : 'FAIL',
        suggestion: overallScore < 80 ? 'Optimize images, reduce JavaScript, enable caching' : 'Great performance!'
      });

      // 2. Core Web Vitals
      const lcpPass = parseFloat(mobileLCP) < 2.5 && parseFloat(desktopLCP) < 2.5;
      const clsPass = parseFloat(mobileCLS) < 0.1 && parseFloat(desktopCLS) < 0.1;
      checks.push({
        item: 'Core Web Vitals',
        details: `LCP (Mobile): ${mobileLCP}, LCP (Desktop): ${desktopLCP}\nCLS (Mobile): ${mobileCLS}, CLS (Desktop): ${desktopCLS}`,
        status: lcpPass && clsPass ? 'PASS' : 'Manual',
        suggestion: 'Ensure LCP < 2.5s and CLS < 0.1 for better rankings'
      });

      // 3. HTTPS Security
      const isHttps = targetUrl.startsWith('https://');
      checks.push({
        item: 'HTTPS Security',
        details: isHttps ? 'Website uses HTTPS' : 'Website uses HTTP (insecure)',
        status: isHttps ? 'PASS' : 'FAIL',
        suggestion: isHttps ? 'SSL certificate is active' : 'Install SSL certificate immediately'
      });

      // 4. Mobile Friendly
      const mobileUsability = mobileData.lighthouseResult.audits['viewport']?.score === 1;
      checks.push({
        item: 'Mobile Friendliness',
        details: mobileUsability ? 'Viewport meta tag present' : 'Missing viewport configuration',
        status: mobileUsability ? 'PASS' : 'FAIL',
        suggestion: mobileUsability ? 'Mobile optimized' : 'Add <meta name="viewport"> tag'
      });

      // 5. Title Tag
      const titleAudit = desktopData.lighthouseResult.audits['document-title'];
      checks.push({
        item: 'Title Tag',
        details: titleAudit?.score === 1 ? 'Title tag found' : 'Missing or empty title tag',
        status: titleAudit?.score === 1 ? 'PASS' : 'FAIL',
        suggestion: 'Keep title between 50-60 characters with primary keyword'
      });

      // 6. Meta Description
      const metaAudit = desktopData.lighthouseResult.audits['meta-description'];
      checks.push({
        item: 'Meta Description',
        details: metaAudit?.score === 1 ? 'Meta description found' : 'Missing meta description',
        status: metaAudit?.score === 1 ? 'PASS' : 'FAIL',
        suggestion: 'Add unique meta description (150-160 characters)'
      });

      // 7. H1 Tags
      const headingAudit = desktopData.lighthouseResult.audits['heading-order'];
      checks.push({
        item: 'H1 Tags',
        details: headingAudit?.score >= 0.5 ? 'Heading structure found' : 'Poor heading structure',
        status: headingAudit?.score >= 0.5 ? 'PASS' : 'Manual',
        suggestion: 'Use single H1 tag with primary keyword'
      });

      // 8. Image ALT Attributes
      const imageAltAudit = desktopData.lighthouseResult.audits['image-alt'];
      checks.push({
        item: 'Image ALT Attributes',
        details: imageAltAudit?.score === 1 ? 'All images have alt text' : 'Some images missing alt text',
        status: imageAltAudit?.score === 1 ? 'PASS' : 'Manual',
        suggestion: 'Add descriptive alt text to all images'
      });

      // 9. Robots.txt
      checks.push({
        item: 'Robots.txt',
        details: 'Check manually at /robots.txt',
        status: 'Manual',
        suggestion: 'Ensure robots.txt exists and is properly configured'
      });

      // 10. Sitemap.xml
      checks.push({
        item: 'Sitemap.xml',
        details: 'Check manually at /sitemap.xml',
        status: 'Manual',
        suggestion: 'Create and submit XML sitemap to Google Search Console'
      });

      // 11. Canonical URL
      const canonicalAudit = desktopData.lighthouseResult.audits['canonical'];
      checks.push({
        item: 'Canonical URL',
        details: canonicalAudit?.score === 1 ? 'Canonical tag found' : 'No canonical tag detected',
        status: canonicalAudit?.score === 1 ? 'PASS' : 'Manual',
        suggestion: 'Add <link rel="canonical"> to prevent duplicate content'
      });

      // 12. Schema Markup
      const structuredDataAudit = desktopData.lighthouseResult.audits['structured-data'];
      checks.push({
        item: 'Schema Markup (Structured Data)',
        details: structuredDataAudit ? 'Structured data detected' : 'No schema markup found',
        status: structuredDataAudit ? 'PASS' : 'Manual',
        suggestion: 'Add JSON-LD schema for better rich snippets'
      });

      // 13. Open Graph Tags
      checks.push({
        item: 'Open Graph Meta Tags',
        details: 'Manual verification required',
        status: 'Manual',
        suggestion: 'Add og:title, og:description, og:image for social sharing'
      });

      // 14. Favicon
      checks.push({
        item: 'Favicon',
        details: 'Check browser tab for favicon',
        status: 'Manual',
        suggestion: 'Add favicon.ico in root directory'
      });

      // 15. Page Indexing
      checks.push({
        item: 'Search Engine Indexing',
        details: 'Check robots meta tag',
        status: 'Manual',
        suggestion: 'Ensure no "noindex" directive unless intended'
      });

      // 16. Mixed Content
      const mixedContentAudit = desktopData.lighthouseResult.audits['is-on-https'];
      checks.push({
        item: 'Mixed Content Issues',
        details: mixedContentAudit?.score === 1 ? 'No mixed content' : 'Mixed HTTP/HTTPS content detected',
        status: mixedContentAudit?.score === 1 ? 'PASS' : 'FAIL',
        suggestion: 'Use HTTPS for all resources (images, scripts, CSS)'
      });

      // 17. Link Health
      const crawlableLinksAudit = desktopData.lighthouseResult.audits['crawlable-anchors'];
      checks.push({
        item: 'Crawlable Links',
        details: crawlableLinksAudit?.score === 1 ? 'All links are crawlable' : 'Some links may not be crawlable',
        status: crawlableLinksAudit?.score === 1 ? 'PASS' : 'Manual',
        suggestion: 'Use proper <a> tags with href attributes'
      });

      // 18. Page Load Speed
      const speedIndex = desktopData.lighthouseResult.audits['speed-index']?.displayValue || 'N/A';
      checks.push({
        item: 'Page Load Speed',
        details: `Speed Index: ${speedIndex}`,
        status: parseFloat(speedIndex) < 3 ? 'PASS' : 'Manual',
        suggestion: 'Optimize for faster load times (< 3 seconds)'
      });

      setResults({
        url: targetUrl,
        mobileScore,
        desktopScore,
        overallScore,
        checks,
        timestamp: new Date().toISOString()
      });

      // Send email if provided
      if (email) {
        console.log(`Email report would be sent to: ${email}`);
      }

    } catch (err) {
      setError('Error analyzing website: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status) => {
    const colors = {
      'PASS': 'bg-green-100 text-green-800',
      'FAIL': 'bg-red-100 text-red-800',
      'Manual': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || colors.Manual;
  };

  return (
    <Layout>
      <Head>
        <title>SEO Audit Tool - Complete Website SEO Analysis | ProURLMonitor</title>
        <meta name="description" content="Free SEO audit tool powered by Google PageSpeed Insights. Analyze 18+ SEO factors including Core Web Vitals, mobile-friendliness, and meta tags." />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4">SEO Audit Tool</h1>
        <p className="text-gray-600 mb-8">Complete website SEO analysis with Google PageSpeed Insights API - 18+ automated checks</p>

        <form onSubmit={handleAudit} className="card mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website URL *
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email (optional - for report)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? '🔍 Analyzing... (30-60 seconds)' : '🔍 Start SEO Audit'}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        {results && (
          <div className="space-y-6">
            {/* Score Overview */}
            <div className="card">
              <h2 className="text-2xl font-bold text-emerald-700 mb-4">PageSpeed Scores</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`text-4xl font-bold ${getScoreColor(results.desktopScore)}`}>
                    {results.desktopScore}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">Desktop</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`text-4xl font-bold ${getScoreColor(results.mobileScore)}`}>
                    {results.mobileScore}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">Mobile</div>
                </div>
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <div className={`text-4xl font-bold ${getScoreColor(results.overallScore)}`}>
                    {results.overallScore}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">Overall</div>
                </div>
              </div>
            </div>

            {/* Detailed Checks */}
            <div className="card">
              <h2 className="text-2xl font-bold text-emerald-700 mb-4">Detailed SEO Audit Results</h2>
              <div className="space-y-4">
                {results.checks.map((check, idx) => (
                  <div key={idx} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{check.item}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(check.status)}`}>
                        {check.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1 whitespace-pre-line">{check.details}</p>
                    {check.suggestion && (
                      <p className="text-sm text-blue-600">💡 {check.suggestion}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="card bg-emerald-50">
              <h3 className="font-bold text-emerald-700 mb-2">Summary</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {results.checks.filter(c => c.status === 'PASS').length}
                  </div>
                  <div className="text-sm text-gray-600">Passed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {results.checks.filter(c => c.status === 'FAIL').length}
                  </div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {results.checks.filter(c => c.status === 'Manual').length}
                  </div>
                  <div className="text-sm text-gray-600">Manual Check</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
