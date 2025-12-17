import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function MetaGenerator() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [keywords, setKeywords] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');
  const [siteName, setSiteName] = useState('');

  function suggestFromTitle(t) {
    setDesc(t ? `${t} — Learn more about ${t} and how to optimize your strategy.` : '');
    setKeywords(t ? t.split(' ').slice(0,8).join(', ') : '');
  }

  const copyAllMetaTags = () => {
    const metaTags = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${desc}">
<meta name="keywords" content="${keywords}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${image}">
${siteName ? `<meta property="og:site_name" content="${siteName}">` : ''}

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${url}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${desc}">
<meta property="twitter:image" content="${image}">`;

    navigator.clipboard.writeText(metaTags);
    alert('✅ All meta tags copied to clipboard!');
  };

  return (
    <Layout>
      <Head>
        <title>Meta Tag Generator - Create SEO Title Tags & Meta Descriptions | ProURLMonitor</title>
        <meta name="description" content="Free meta tag generator tool. Create optimized title tags, meta descriptions, Open Graph tags, and Twitter Cards with character counter for perfect SEO." />
        <meta name="keywords" content="meta tag generator, title tag generator, meta description tool, Open Graph generator, Twitter Card generator, SEO meta tags" />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4">Meta Tag Generator</h1>
        <p className="text-gray-600 mb-8">Create SEO-optimized meta tags with character counter, Open Graph, and Twitter Card tags for maximum CTR</p>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="card">
              <h2 className="text-xl font-bold text-emerald-700 mb-4">Basic Meta Tags</h2>
              
              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title Tag <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); suggestFromTitle(e.target.value); }}
                  placeholder="Best SEO Tools for Website Optimization | ProURLMonitor"
                  className="input"
                  maxLength="70"
                />
                <div className="flex justify-between mt-1 text-xs">
                  <span className={title.length > 60 ? 'text-red-600' : 'text-gray-600'}>
                    {title.length}/60 characters (max 70)
                  </span>
                  {title.length > 60 && title.length <= 70 && (
                    <span className="text-orange-600">May be truncated on mobile</span>
                  )}
                  {title.length > 70 && (
                    <span className="text-red-600 font-semibold">Too long!</span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows="3"
                  placeholder="Discover free SEO tools to check HTTP status codes, audit your website, and boost rankings. Everything you need for better search visibility."
                  className="input"
                  maxLength="170"
                />
                <div className="flex justify-between mt-1 text-xs">
                  <span className={desc.length > 160 ? 'text-red-600' : 'text-gray-600'}>
                    {desc.length}/160 characters (max 170)
                  </span>
                  {desc.length > 160 && desc.length <= 170 && (
                    <span className="text-orange-600">May be truncated</span>
                  )}
                  {desc.length > 170 && (
                    <span className="text-red-600 font-semibold">Too long!</span>
                  )}
                </div>
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Keywords (optional)
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="SEO tools, website audit, HTTP status checker"
                  className="input"
                />
                <p className="text-xs text-gray-500 mt-1">Comma-separated keywords (mostly ignored by Google, but used by some other search engines)</p>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold text-emerald-700 mb-4">Social Media Tags</h2>
              
              {/* URL */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Page URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://prourlmonitor.com/tools/seo-audit"
                  className="input"
                />
              </div>

              {/* Image */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (for social sharing)</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://prourlmonitor.com/og-image.jpg"
                  className="input"
                />
                <p className="text-xs text-gray-500 mt-1">Recommended: 1200x630px for Facebook, Twitter</p>
              </div>

              {/* Site Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="ProURLMonitor"
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-4">
            {/* Google Preview */}
            <div className="card">
              <h2 className="text-xl font-bold text-emerald-700 mb-4">🔍 Google Search Preview</h2>
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="text-xs text-gray-600 mb-1">{url || 'https://example.com/page'}</div>
                <div className="text-blue-600 text-xl mb-1 hover:underline cursor-pointer">
                  {title || 'Your Title Tag Will Appear Here | Site Name'}
                </div>
                <div className="text-sm text-gray-600">
                  {desc || 'Your meta description will appear here. Make it compelling to increase click-through rate from search results. Include your target keywords naturally.'}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">💡 This is how your page will look in Google search results</p>
            </div>

            {/* Open Graph Preview */}
            <div className="card">
              <h2 className="text-xl font-bold text-emerald-700 mb-4">📘 Facebook / Open Graph Preview</h2>
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                {image && (
                  <img 
                    src={image} 
                    alt="OG Preview" 
                    className="w-full h-48 object-cover bg-gray-100"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
                {!image && (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                    1200x630px Image
                  </div>
                )}
                <div className="p-4 bg-gray-50">
                  <div className="text-xs text-gray-500 uppercase mb-1">{siteName || url || 'example.com'}</div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">
                    {title || 'Your Title Will Appear Here'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {desc || 'Your meta description appears here on Facebook shares'}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">💡 This is how your link will look when shared on Facebook</p>
            </div>

            {/* Twitter Preview */}
            <div className="card">
              <h2 className="text-xl font-bold text-emerald-700 mb-4">🐦 Twitter Card Preview</h2>
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                {image && (
                  <img 
                    src={image} 
                    alt="Twitter Preview" 
                    className="w-full h-48 object-cover bg-gray-100"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
                {!image && (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                    1200x630px Image
                  </div>
                )}
                <div className="p-4">
                  <div className="text-base font-semibold text-gray-900 mb-1">
                    {title || 'Your Title Will Appear Here'}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {desc || 'Your meta description appears here on Twitter shares'}
                  </div>
                  <div className="text-xs text-gray-400">🔗 {url || 'example.com'}</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">💡 This is how your link will look when shared on Twitter/X</p>
            </div>

            {/* Copy Button */}
            <button
              onClick={copyAllMetaTags}
              disabled={!title || !desc}
              className="btn btn-primary w-full text-lg py-4"
            >
              📋 Copy All Meta Tags
            </button>

            {(!title || !desc) && (
              <p className="text-center text-sm text-gray-500">Fill in Title and Description to copy tags</p>
            )}
          </div>
        </div>

        {/* Generated Code Preview */}
        {title && desc && (
          <div className="mt-8 card">
            <h2 className="text-xl font-bold text-emerald-700 mb-4">📝 Generated HTML Code</h2>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${desc}">
${keywords ? `<meta name="keywords" content="${keywords}">` : ''}

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
${url ? `<meta property="og:url" content="${url}">` : ''}
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
${image ? `<meta property="og:image" content="${image}">` : ''}
${siteName ? `<meta property="og:site_name" content="${siteName}">` : ''}

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
${url ? `<meta property="twitter:url" content="${url}">` : ''}
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${desc}">
${image ? `<meta property="twitter:image" content="${image}">` : ''}`}</code>
            </pre>
            <p className="text-sm text-gray-600 mt-3">💡 Copy this code and paste it in your page's &lt;head&gt; section</p>
          </div>
        )}

        {/* SEO Content */}
        <div className="mt-12 card">
          <h2 className="text-2xl font-bold text-emerald-700 mb-4">Complete Guide to Meta Tags and Title Tag Optimization for SEO</h2>
          <div className="prose max-w-none text-gray-700 space-y-4">
            <p>
              Your <strong>meta tags</strong> are the first thing people see in search results before they even visit your site. Get them wrong, and you're invisible. Get them right, and you can literally double your traffic overnight by improving your click-through rate. I've seen it happen dozens of times - same ranking position, better title and description, 50% more clicks. That's the power of meta tag optimization.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Why Title Tags Are Your Most Important SEO Element</h3>
            <p>
              Your <strong>title tag</strong> is the blue clickable headline in Google search results. It's the single most important on-page SEO element because it tells both search engines and users what your page is about in one concise statement. Google weighs title tags heavily when determining relevance, so this is prime real estate for your target keyword.
            </p>
            <p>
              The ideal title tag length is <strong>50-60 characters</strong>. Google typically displays about 60 characters before cutting off with "..." - anything beyond that is wasted. But here's the trick: on mobile devices, Google shows even less (about 50-55 chars), so front-load your most important keywords. Our meta tag generator shows you exactly when you're approaching or exceeding the limits with color-coded warnings.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Crafting Compelling Meta Descriptions That Drive Clicks</h3>
            <p>
              Your <strong>meta description</strong> is not a ranking factor - let me repeat that because it confuses people. Google doesn't use meta descriptions for ranking. However, they're absolutely critical for CTR (click-through rate), and CTR IS a ranking signal. A compelling meta description can be the difference between someone clicking your result or your competitor's.
            </p>
            <p>
              Keep meta descriptions between <strong>150-160 characters</strong>. Google sometimes shows up to 170 on desktop, but mobile cuts off earlier, so stick to 160 max. Think of it as ad copy - you're selling the click. Include your target keyword (Google bolds matching terms), a clear benefit or value proposition, and ideally a call-to-action like "Learn more" or "Get started free."
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">How to Use Our Meta Tag Generator Tool</h3>
            <p>
              Using our tool couldn't be simpler. Start by entering your title tag - as you type, we auto-generate a suggested description and keywords based on your title. The character counters turn orange when you're approaching the limit and red when you've gone over, so you know instantly if you need to trim.
            </p>
            <p>
              Fill in the social media fields (URL, image, site name) and watch the live previews update in real-time. You'll see exactly how your link will look when shared on Google, Facebook, and Twitter. This is gold for optimizing social shares - you can test different images and descriptions to see what looks most appealing before you even publish.
            </p>
            <p>
              When you're happy with everything, click "Copy All Meta Tags" and we'll generate perfectly formatted HTML code with all your primary meta tags, Open Graph tags for Facebook, and Twitter Card tags. Just paste this code into your page's &lt;head&gt; section and you're done. No coding knowledge required.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Understanding Open Graph Tags for Facebook</h3>
            <p>
              <strong>Open Graph tags</strong> (og: tags) were created by Facebook but are now used by most social platforms including LinkedIn, WhatsApp, and Slack. When someone shares your link on social media, these tags control what image, title, and description appear in the preview card.
            </p>
            <p>
              The most important Open Graph tags are og:title, og:description, og:image, and og:url. Your og:image should be <strong>1200x630 pixels</strong> for optimal display across all platforms. Smaller images get upscaled and look blurry, larger images get compressed. Use compelling, high-quality images - studies show social posts with great images get 3x more engagement.
            </p>
            <p>
              Here's a pro tip: your og:title and og:description don't have to match your SEO title and meta description. You can optimize the OG tags specifically for social sharing with more casual, attention-grabbing language, while keeping your SEO tags more keyword-focused. Our tool lets you use the same content for both, which works great in most cases.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Twitter Cards and Why They Matter</h3>
            <p>
              <strong>Twitter Cards</strong> turn plain links into rich media cards with images and descriptions. Without Twitter Card tags, your links just show as plain text URLs - boring and low CTR. With proper Twitter Cards, you get a large image, title, and description that makes your tweets stand out.
            </p>
            <p>
              The twitter:card property has several options: summary (small square image), summary_large_image (full-width image), app (for mobile apps), and player (for video/audio). For most websites, use summary_large_image - it takes up more space in the feed and gets more engagement. The image specs are the same as Open Graph: 1200x630px.
            </p>
            <p>
              Fun fact: if you don't specify Twitter Card tags, Twitter will fall back to your Open Graph tags. So technically you only NEED og: tags. But adding Twitter-specific tags gives you more control and Twitter validates them separately, so I recommend including both.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">The Truth About Meta Keywords Tag</h3>
            <p>
              Let's address the elephant in the room: the <strong>meta keywords tag</strong> is dead for Google SEO. Google officially stopped using it as a ranking signal in 2009 because it was too easy to spam. However, some other search engines (like Bing and Yandex) still use it as a minor signal, so it doesn't hurt to include it.
            </p>
            <p>
              If you do use the keywords tag, keep it simple - 5-10 comma-separated keywords max. Don't stuff it with dozens of keywords. Focus on your main topic and a few closely related terms. Our tool auto-suggests keywords from your title, which is a good starting point. Just don't expect it to move the needle on Google rankings.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Common Meta Tag Mistakes That Kill CTR</h3>
            <p>
              The biggest mistake I see is generic, templated meta tags. "Home - Company Name" as a title tag tells me nothing. "Learn more about our services" as a description is useless. Be specific, include keywords, communicate value. "Best SEO Tools for Website Optimization | ProURLMonitor" tells me exactly what I'm getting.
            </p>
            <p>
              Another killer mistake: duplicate meta tags across multiple pages. Every page on your site should have unique title and description tags optimized for that specific page's content and target keyword. Using the same meta tags everywhere confuses search engines and wastes opportunities to rank for different keywords.
            </p>
            <p>
              Title tag keyword stuffing is another common error. "SEO Tools | Best SEO Tools | Free SEO Tools | SEO Audit Tools" looks spammy and gets low CTR. One clean, benefit-focused title beats keyword-stuffed nonsense every time. Google might even rewrite spammy titles in search results, which means you lose control of your messaging.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">A/B Testing Your Meta Tags for Higher CTR</h3>
            <p>
              Here's an advanced tactic: A/B test your meta tags. Use Google Search Console to monitor CTR for important pages. If a page ranks well but has low CTR, that's your signal to test a new title or description. Change one element, wait 2-4 weeks for data, and compare performance.
            </p>
            <p>
              Elements to test: Adding numbers ("7 Ways to..."), questions ("Are You Making This Mistake?"), power words (Free, Proven, Ultimate), current year (2025), or urgency (Limited Time). Sometimes a small tweak like adding brackets [2025 Guide] can boost CTR by 10-15%. Our tool makes it easy to preview different variations before committing.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Dynamic Meta Tags for E-Commerce and Large Sites</h3>
            <p>
              If you have hundreds or thousands of pages (like an e-commerce store), manually writing meta tags for each page is impossible. Use dynamic templates with variables. For product pages: "[Product Name] - [Category] | [Brand Name]" as title, and "[Product Name] description. [Price]. [Availability]. Free shipping over $50" as description.
            </p>
            <p>
              Most CMS platforms and e-commerce systems let you set meta tag templates. You can also use structured data (like our <a href="/tools/schema-generator" className="text-emerald-600 hover:underline">Schema Generator</a> creates) to help Google understand dynamic content. Just make sure your templates create unique, descriptive meta tags, not generic duplicates.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Monitoring Meta Tag Performance</h3>
            <p>
              Use Google Search Console to track how your meta tags perform in the real world. The Performance report shows impressions, clicks, CTR, and average position for each page. If you see high impressions but low CTR, your meta tags probably need work - you're showing up in search but not getting clicks.
            </p>
            <p>
              Also check Search Console's Coverage report for issues like missing title tags or duplicate meta descriptions. These are technical SEO problems that can hurt your rankings. Our <a href="/tools/seo-audit" className="text-emerald-600 hover:underline">SEO Audit tool</a> can automatically scan your entire site for these issues and flag pages that need attention.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Meta Tags and Featured Snippets</h3>
            <p>
              While meta descriptions don't directly help you win <strong>featured snippets</strong>, they work together. Google often pulls featured snippet text from page content, not meta tags. However, if your page ranks in position 1-3 and has a well-optimized meta description that clearly answers the query, you're more likely to get clicks even if a competitor has the featured snippet.
            </p>
            <p>
              The strategy: optimize your content and headings (use our <a href="/tools/heading-analyzer" className="text-emerald-600 hover:underline">Heading Analyzer</a>) to win featured snippets, then optimize your meta tags to capture clicks from regular results. This one-two punch can give you dominant visibility in search results.
            </p>

            <p className="text-lg font-semibold text-emerald-700 mt-6">
              Ready to boost your click-through rate and drive more organic traffic? Use our free meta tag generator above to create perfectly optimized title tags, meta descriptions, Open Graph tags, and Twitter Cards in seconds. See live previews, check character counts, and copy production-ready code with one click. Combine this with our <a href="/tools/keyword-density-checker" className="text-emerald-600 hover:underline">Keyword Density Checker</a> to ensure optimal keyword usage and our <a href="/tools/seo-audit" className="text-emerald-600 hover:underline">SEO Audit</a> to fix technical issues holding you back.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-8 card bg-gray-50">
          <h2 className="text-2xl font-bold text-emerald-700 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">What is the ideal title tag length for SEO?</h3>
              <p className="text-gray-700">The ideal title tag length is 50-60 characters. Google displays about 60 characters on desktop and 50-55 on mobile before truncating with "..."</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Do meta descriptions affect SEO rankings?</h3>
              <p className="text-gray-700">No, meta descriptions are not a direct ranking factor. However, they heavily influence click-through rate (CTR), which IS a ranking signal. Better CTR = better rankings over time.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">What size should my Open Graph image be?</h3>
              <p className="text-gray-700">The recommended size is 1200x630 pixels. This works perfectly for Facebook, Twitter, LinkedIn, and most other social platforms.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Should I use meta keywords tag?</h3>
              <p className="text-gray-700">Google ignores the meta keywords tag since 2009. Some other search engines like Bing still use it as a minor signal, so it doesn't hurt to include it, but don't expect major SEO benefits.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Can I use different meta tags for SEO vs social media?</h3>
              <p className="text-gray-700">Yes! You can have different og:title and og:description (for social) vs your SEO title tag and meta description. This lets you optimize each for its specific purpose.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
