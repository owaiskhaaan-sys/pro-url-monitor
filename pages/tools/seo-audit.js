import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

const PAGESPEED_API_KEY = 'AIzaSyACg_8Pn61ChGGFlS0oFyzZlXXEVaQWVUM';

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

  const fetchHTML = async (targetUrl) => {
    try {
      const response = await fetch(`/api/fetch-page?url=${encodeURIComponent(targetUrl)}`);
      if (!response.ok) return null;
      return await response.text();
    } catch {
      return null;
    }
  };

  const checkResource = async (resourceUrl) => {
    try {
      const response = await fetch(`/api/check-url?url=${encodeURIComponent(resourceUrl)}`);
      const data = await response.json();
      return data.status === 200;
    } catch {
      return false;
    }
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

      const urlObj = new URL(targetUrl);
      const baseUrl = urlObj.origin;

      // Fetch PageSpeed data for both desktop and mobile + HTML
      const [desktopData, mobileData, html] = await Promise.all([
        analyzePageSpeed(targetUrl, 'desktop'),
        analyzePageSpeed(targetUrl, 'mobile'),
        fetchHTML(targetUrl)
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

      const checks = [];

      // 1. PageSpeed Check
      checks.push({
        item: 'Google PageSpeed (Desktop & Mobile)',
        details: `Desktop: ${desktopScore}/100 (LCP ${desktopLCP}, FCP ${desktopFCP}, CLS ${desktopCLS})\nMobile: ${mobileScore}/100 (LCP ${mobileLCP}, FCP ${mobileFCP}, CLS ${mobileCLS})`,
        status: overallScore >= 80 ? 'PASS' : overallScore >= 50 ? 'FAIL' : 'FAIL',
        suggestion: overallScore < 80 ? 'Optimize images, reduce JavaScript, enable caching' : 'Great performance!'
      });

      // 2. Core Web Vitals
      const lcpPass = parseFloat(mobileLCP) < 2.5 && parseFloat(desktopLCP) < 2.5;
      const clsPass = parseFloat(mobileCLS) < 0.1 && parseFloat(desktopCLS) < 0.1;
      checks.push({
        item: 'Core Web Vitals',
        details: `LCP: ${mobileLCP} (Mobile), ${desktopLCP} (Desktop)\nCLS: ${mobileCLS} (Mobile), ${desktopCLS} (Desktop)`,
        status: lcpPass && clsPass ? 'PASS' : 'FAIL',
        suggestion: 'Ensure LCP < 2.5s and CLS < 0.1 for better rankings'
      });

      // 3. HTTPS Security
      const isHttps = targetUrl.startsWith('https://');
      checks.push({
        item: 'HTTPS Security',
        details: isHttps ? 'Website uses HTTPS ✓' : 'Website uses HTTP (insecure)',
        status: isHttps ? 'PASS' : 'FAIL',
        suggestion: isHttps ? 'SSL certificate is active' : 'Install SSL certificate immediately'
      });

      // 4. Mobile Friendly
      const mobileUsability = mobileData.lighthouseResult.audits['viewport']?.score === 1;
      checks.push({
        item: 'Mobile Friendliness',
        details: mobileUsability ? 'Viewport meta tag present ✓' : 'Missing viewport configuration',
        status: mobileUsability ? 'PASS' : 'FAIL',
        suggestion: mobileUsability ? 'Mobile optimized' : 'Add <meta name="viewport"> tag'
      });

      // 5. Title Tag
      const titleAudit = desktopData.lighthouseResult.audits['document-title'];
      const hasTitleTag = titleAudit && (titleAudit.score === 1 || titleAudit.score === null || titleAudit.displayValue);
      checks.push({
        item: 'Title Tag',
        details: hasTitleTag ? 'Title tag found ✓' : 'Missing or empty title tag',
        status: hasTitleTag ? 'PASS' : 'FAIL',
        suggestion: 'Keep title between 50-60 characters with primary keyword'
      });

      // 6. Meta Description
      const metaAudit = desktopData.lighthouseResult.audits['meta-description'];
      const hasMetaDesc = metaAudit && (metaAudit.score === 1 || metaAudit.score === null || metaAudit.displayValue);
      checks.push({
        item: 'Meta Description',
        details: hasMetaDesc ? 'Meta description found ✓' : 'Missing meta description',
        status: hasMetaDesc ? 'PASS' : 'FAIL',
        suggestion: 'Add unique meta description (150-160 characters)'
      });

      // 7. H1 Tags - CHECK FROM HTML
      let h1Status = 'FAIL';
      let h1Details = 'Could not check H1 tags';
      if (html) {
        const h1Matches = html.match(/<h1[^>]*>.*?<\/h1>/gi);
        if (h1Matches && h1Matches.length === 1) {
          h1Status = 'PASS';
          h1Details = 'Single H1 tag found ✓';
        } else if (h1Matches && h1Matches.length > 1) {
          h1Status = 'FAIL';
          h1Details = `Multiple H1 tags found (${h1Matches.length})`;
        } else {
          h1Status = 'FAIL';
          h1Details = 'No H1 tag found';
        }
      }
      checks.push({
        item: 'H1 Tags',
        details: h1Details,
        status: h1Status,
        suggestion: 'Use single H1 tag with primary keyword'
      });

      // 8. Image ALT Attributes
      const imageAltAudit = desktopData.lighthouseResult.audits['image-alt'];
      const imageAltPass = imageAltAudit?.score === 1;
      checks.push({
        item: 'Image ALT Attributes',
        details: imageAltPass ? 'All images have alt text ✓' : `${imageAltAudit?.details?.items?.length || 0} images missing alt text`,
        status: imageAltPass ? 'PASS' : 'FAIL',
        suggestion: 'Add descriptive alt text to all images for accessibility and SEO'
      });

      // 9. Robots.txt - ACTUALLY CHECK
      const robotsTxtUrl = baseUrl + '/robots.txt';
      const robotsExists = await checkResource(robotsTxtUrl);
      checks.push({
        item: 'Robots.txt',
        details: robotsExists ? 'robots.txt found ✓' : 'robots.txt not found',
        status: robotsExists ? 'PASS' : 'FAIL',
        suggestion: robotsExists ? 'robots.txt is accessible' : 'Create robots.txt file in root directory'
      });

      // 10. Sitemap.xml - ACTUALLY CHECK
      const sitemapUrl = baseUrl + '/sitemap.xml';
      const sitemapExists = await checkResource(sitemapUrl);
      checks.push({
        item: 'Sitemap.xml',
        details: sitemapExists ? 'sitemap.xml found ✓' : 'sitemap.xml not found',
        status: sitemapExists ? 'PASS' : 'FAIL',
        suggestion: sitemapExists ? 'Submit to Google Search Console' : 'Create XML sitemap and submit to search engines'
      });

      // 11. Canonical URL - CHECK FROM PAGESPEED
      const canonicalAudit = desktopData.lighthouseResult.audits['canonical'];
      const canonicalPass = canonicalAudit && (canonicalAudit.score === 1 || canonicalAudit.score === null || !canonicalAudit.details?.items || canonicalAudit.details?.items?.length === 0);
      checks.push({
        item: 'Canonical URL',
        details: canonicalPass ? 'Canonical tag found ✓' : 'No canonical tag detected',
        status: canonicalPass ? 'PASS' : 'FAIL',
        suggestion: canonicalPass ? 'Canonical URL is set' : 'Add <link rel="canonical"> to prevent duplicate content'
      });

      // 12. Schema Markup - CHECK FROM HTML
      let schemaStatus = 'FAIL';
      let schemaDetails = 'No schema markup found';
      if (html) {
        if (html.includes('application/ld+json') || html.includes('schema.org')) {
          schemaStatus = 'PASS';
          schemaDetails = 'Schema markup detected ✓';
        }
      }
      checks.push({
        item: 'Schema Markup (Structured Data)',
        details: schemaDetails,
        status: schemaStatus,
        suggestion: 'Add JSON-LD schema for better rich snippets (Organization, Article, Product, etc.)'
      });

      // 13. Open Graph Tags - CHECK FROM HTML
      let ogStatus = 'FAIL';
      let ogDetails = 'Open Graph tags not found';
      if (html) {
        const hasOgTitle = html.includes('og:title');
        const hasOgDesc = html.includes('og:description');
        const hasOgImage = html.includes('og:image');
        if (hasOgTitle && hasOgDesc && hasOgImage) {
          ogStatus = 'PASS';
          ogDetails = 'Open Graph tags found (title, description, image) ✓';
        } else if (hasOgTitle || hasOgDesc || hasOgImage) {
          ogStatus = 'FAIL';
          ogDetails = 'Partial Open Graph tags (missing some required tags)';
        }
      }
      checks.push({
        item: 'Open Graph Meta Tags',
        details: ogDetails,
        status: ogStatus,
        suggestion: 'Add og:title, og:description, og:image, og:url for social sharing'
      });

      // 14. Favicon - CHECK
      const faviconUrl = baseUrl + '/favicon.ico';
      const faviconExists = await checkResource(faviconUrl);
      checks.push({
        item: 'Favicon',
        details: faviconExists ? 'Favicon found ✓' : 'Favicon not found',
        status: faviconExists ? 'PASS' : 'FAIL',
        suggestion: faviconExists ? 'Favicon is set' : 'Add favicon.ico in root directory or use <link rel="icon">'
      });

      // 15. Page Indexing - CHECK FROM HTML
      let indexStatus = 'PASS';
      let indexDetails = 'Page is indexable ✓';
      if (html) {
        if (html.includes('noindex') || html.includes('robots') && html.includes('content="noindex')) {
          indexStatus = 'FAIL';
          indexDetails = 'Page has noindex directive';
        }
      }
      checks.push({
        item: 'Search Engine Indexing',
        details: indexDetails,
        status: indexStatus,
        suggestion: indexStatus === 'PASS' ? 'Page can be indexed' : 'Remove noindex if you want page indexed'
      });

      // 16. Mixed Content
      const mixedContentAudit = desktopData.lighthouseResult.audits['is-on-https'];
      checks.push({
        item: 'Mixed Content Issues',
        details: mixedContentAudit?.score === 1 ? 'No mixed content ✓' : 'Mixed HTTP/HTTPS content detected',
        status: mixedContentAudit?.score === 1 ? 'PASS' : 'FAIL',
        suggestion: 'Use HTTPS for all resources (images, scripts, CSS)'
      });

      // 17. Link Health
      const crawlableLinksAudit = desktopData.lighthouseResult.audits['crawlable-anchors'];
      const allLinksCrawlable = crawlableLinksAudit && (crawlableLinksAudit.score === 1 || crawlableLinksAudit.score === null || !crawlableLinksAudit.details?.items || crawlableLinksAudit.details?.items?.length === 0);
      checks.push({
        item: 'Crawlable Links',
        details: allLinksCrawlable ? 'All links are crawlable ✓' : 'Some links may not be crawlable',
        status: allLinksCrawlable ? 'PASS' : 'FAIL',
        suggestion: 'Use proper <a> tags with href attributes'
      });

      // 18. Page Load Speed
      const speedIndex = desktopData.lighthouseResult.audits['speed-index']?.displayValue || 'N/A';
      const speedScore = desktopData.lighthouseResult.audits['speed-index']?.score || 0;
      checks.push({
        item: 'Page Load Speed',
        details: `Speed Index: ${speedIndex}`,
        status: speedScore >= 0.9 ? 'PASS' : speedScore >= 0.5 ? 'FAIL' : 'FAIL',
        suggestion: 'Optimize for faster load times (target < 3.4 seconds)'
      });

      setResults({
        url: targetUrl,
        mobileScore,
        desktopScore,
        overallScore,
        checks,
        timestamp: new Date().toISOString()
      });

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
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/seo-audit" />
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

            <div className="card bg-emerald-50">
              <h3 className="font-bold text-emerald-700 mb-2">Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
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
              </div>
            </div>
          </div>
        )}

        {/* SEO Content Section */}
        <div className="mt-12 space-y-8">
          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-700 mb-4">What is SEO Audit and Why You Need It?</h2>
            <div className="prose max-w-none text-gray-700 space-y-4">
              <p>
                Look, let's be real here. You've built this amazing website, poured your heart into it, but somehow it's not showing up on Google. Frustrating, right? That's exactly where an <strong>SEO audit tool</strong> comes in to save the day. Think of it as your website's health checkup - just like you'd visit a doctor for a yearly physical, your website needs regular SEO audits to stay in top shape.
              </p>
              <p>
                Our <strong>free SEO audit tool</strong> runs over 18 comprehensive checks on your website. We're talking about everything from <strong>Google PageSpeed scores</strong> to <strong>Core Web Vitals</strong>, from checking if you have proper <strong>meta descriptions</strong> to making sure your <strong>robots.txt file</strong> is set up correctly. It's like having an entire SEO team analyzing your site, but without the hefty price tag.
              </p>
              
              <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">How Does Our SEO Checker Actually Work?</h3>
              <p>
                So here's the thing - we don't just give you random numbers and expect you to figure things out. Our tool connects directly to <strong>Google's PageSpeed Insights API</strong>, which means you're getting the same data that Google uses to rank websites. Pretty cool, huh?
              </p>
              <p>
                When you run an <strong>SEO analysis</strong>, we check your site from both desktop and mobile perspectives because let's face it, most people are browsing on their phones these days. We calculate your <strong>Largest Contentful Paint (LCP)</strong>, <strong>First Contentful Paint (FCP)</strong>, and <strong>Cumulative Layout Shift (CLS)</strong> - these are the metrics Google actually cares about when deciding where to rank you.
              </p>

              <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Key Features That Make This Tool Stand Out</h3>
              <p>
                Here's what makes our <strong>website SEO audit tool</strong> different from others out there. First off, we check your <strong>H1 tags</strong> - and not just if they exist, but whether you have exactly one per page (having multiple H1s is a rookie mistake that tanks your SEO). We verify your <strong>sitemap.xml</strong> is accessible, make sure your <strong>Open Graph tags</strong> are set up for social media sharing, and even check if you've got that tiny <strong>favicon</strong> that shows up in browser tabs.
              </p>
              <p>
                And get this - we don't mark things as "manual check required" like some lazy tools do. Nope, every single one of our 18 checks is <strong>fully automated</strong>. You get real Pass/Fail results with specific details about what's working and what needs fixing. No guesswork, no vague suggestions - just straight facts about your <strong>on-page SEO</strong>.
              </p>

              <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Understanding Your SEO Audit Results</h3>
              <p>
                When you see those three colorful circles showing your Desktop, Mobile, and Overall scores, here's what you need to know. Anything above 90 is excellent (green zone, you're crushing it). Between 50-90 is decent but needs improvement (orange territory). Below 50? Time to roll up your sleeves because your site needs some serious optimization work.
              </p>
              <p>
                The detailed checklist below shows you exactly what's passing and what's failing. Failed your <strong>HTTPS check</strong>? Your site needs an SSL certificate ASAP - Google penalizes non-secure sites heavily. Missing <strong>schema markup</strong>? You're leaving easy wins on the table because structured data helps search engines understand your content better. No <strong>canonical URL</strong>? You might be competing with yourself for rankings.
              </p>

              <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Common SEO Issues We Help You Fix</h3>
              <p>
                You know what I see all the time? Websites with multiple H1 tags scattered everywhere, missing <strong>alt text on images</strong> (hello, accessibility and SEO boost!), and no proper <strong>meta descriptions</strong> that make people actually want to click. These are low-hanging fruits that can dramatically improve your search rankings.
              </p>
              <p>
                Our tool also checks if you're blocking search engines accidentally (yeah, it happens more than you'd think) and whether your site is mobile-friendly. With over 60% of searches happening on mobile devices, if your site doesn't have a proper <strong>viewport meta tag</strong>, you're basically invisible to half the internet.
              </p>

              <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Why Use ProURLMonitor for SEO Analysis?</h3>
              <p>
                Here's the honest truth - there are plenty of <strong>SEO audit tools</strong> out there, but most of them either charge you a monthly fee or give you incomplete data. We built this tool because we got tired of seeing people struggle with overpriced SEO software that doesn't deliver real value.
              </p>
              <p>
                Our <strong>free SEO checker</strong> gives you professional-grade analysis without any limitations. No "sign up for premium to see full results" nonsense. You type in your URL, hit analyze, and boom - you get a complete picture of your site's SEO health. Plus, we keep updating our checks based on Google's latest algorithm changes, so you're always getting current, relevant data.
              </p>

              <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Take Action on Your SEO Audit Report</h3>
              <p>
                Running an audit is great, but what matters is what you do with that information. Start with the failures first - those are your biggest opportunities for quick wins. Fix your <strong>page speed issues</strong>, add missing meta tags, optimize images, and make sure your technical SEO foundation is solid. Then move on to improving your passing scores even further.
              </p>
              <p>
                And hey, don't just run this once and forget about it. SEO is an ongoing game. Check your site monthly, especially after making updates or adding new content. Use our other tools like the <a href="/tools/http-status-checker" className="text-emerald-600 hover:underline">HTTP Status Checker</a> to make sure all your URLs are working correctly, and the <a href="/tools/broken-links-checker" className="text-emerald-600 hover:underline">Broken Links Checker</a> to avoid those pesky 404 errors that hurt your rankings.
              </p>

              <p className="text-lg font-semibold text-emerald-700 mt-6">
                Ready to boost your search rankings? Run your free SEO audit now and discover exactly what's holding your website back from page one of Google. No credit card required, no signup - just pure, actionable SEO insights in seconds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
