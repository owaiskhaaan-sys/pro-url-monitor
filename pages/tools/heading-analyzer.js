import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function HeadingAnalyzer() {
  const [url, setUrl] = useState('');
  const [htmlInput, setHtmlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const analyzeHeadings = async (source = 'url') => {
    setLoading(true);
    setError('');
    setResults(null);

    try {
      let html = '';
      
      if (source === 'url') {
        if (!url.trim()) {
          setError('Please enter a URL');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/fetch-page', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: url.trim() })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch page. Please check the URL.');
        }

        const data = await response.json();
        html = data.html;
      } else {
        if (!htmlInput.trim()) {
          setError('Please paste some HTML');
          setLoading(false);
          return;
        }
        html = htmlInput;
      }

      // Extract headings
      const headings = {
        h1: extractHeadings(html, 'h1'),
        h2: extractHeadings(html, 'h2'),
        h3: extractHeadings(html, 'h3'),
        h4: extractHeadings(html, 'h4'),
        h5: extractHeadings(html, 'h5'),
        h6: extractHeadings(html, 'h6')
      };

      // SEO Analysis
      const issues = [];
      const suggestions = [];

      // Check H1 tags
      if (headings.h1.length === 0) {
        issues.push({ type: 'critical', text: 'No H1 tag found - every page needs exactly one H1' });
      } else if (headings.h1.length > 1) {
        issues.push({ type: 'warning', text: `Multiple H1 tags found (${headings.h1.length}) - should only have one per page` });
      } else {
        suggestions.push({ type: 'success', text: 'Perfect! Exactly one H1 tag found' });
      }

      // Check if headings exist
      const totalHeadings = Object.values(headings).flat().length;
      if (totalHeadings === 0) {
        issues.push({ type: 'critical', text: 'No heading tags found on this page' });
      } else if (totalHeadings < 3) {
        suggestions.push({ type: 'info', text: 'Consider adding more headings to improve content structure' });
      }

      // Check H2 after H1
      if (headings.h1.length > 0 && headings.h2.length === 0) {
        suggestions.push({ type: 'info', text: 'Add H2 subheadings to break down your content' });
      }

      // Check for empty headings
      const emptyCount = Object.values(headings).flat().filter(h => !h.text.trim()).length;
      if (emptyCount > 0) {
        issues.push({ type: 'warning', text: `${emptyCount} empty heading tag(s) found - add descriptive text` });
      }

      // Check heading length
      Object.entries(headings).forEach(([level, heads]) => {
        heads.forEach(h => {
          if (h.text.length > 70) {
            suggestions.push({ type: 'info', text: `${level.toUpperCase()} too long (${h.text.length} chars): "${h.text.substring(0, 50)}..." - keep under 70 characters` });
          }
        });
      });

      // Check for proper hierarchy
      const hierarchy = checkHierarchy(headings);
      if (!hierarchy.valid) {
        issues.push({ type: 'warning', text: hierarchy.message });
      }

      setResults({
        headings,
        totalHeadings,
        issues,
        suggestions
      });

    } catch (err) {
      setError(err.message || 'Failed to analyze headings');
    } finally {
      setLoading(false);
    }
  };

  const extractHeadings = (html, tag) => {
    const regex = new RegExp(`<${tag}[^>]*>(.*?)<\/${tag}>`, 'gi');
    const matches = [];
    let match;
    
    while ((match = regex.exec(html)) !== null) {
      matches.push({
        text: match[1].replace(/<[^>]*>/g, '').trim(),
        html: match[0]
      });
    }
    
    return matches;
  };

  const checkHierarchy = (headings) => {
    const levels = [];
    Object.keys(headings).forEach(level => {
      if (headings[level].length > 0) {
        levels.push(parseInt(level.substring(1)));
      }
    });

    levels.sort((a, b) => a - b);

    for (let i = 1; i < levels.length; i++) {
      if (levels[i] - levels[i - 1] > 1) {
        return {
          valid: false,
          message: `Heading hierarchy skipped from H${levels[i - 1]} to H${levels[i]} - avoid skipping levels`
        };
      }
    }

    return { valid: true };
  };

  const getBadgeColor = (level) => {
    const colors = {
      h1: 'bg-red-100 text-red-700',
      h2: 'bg-orange-100 text-orange-700',
      h3: 'bg-yellow-100 text-yellow-700',
      h4: 'bg-green-100 text-green-700',
      h5: 'bg-blue-100 text-blue-700',
      h6: 'bg-purple-100 text-purple-700'
    };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Layout>
      <Head>
        <title>Heading Tag Analyzer (H1-H6) - Check SEO Heading Structure | ProURLMonitor</title>
        <meta name="description" content="Free heading tag analyzer tool. Check your H1-H6 heading structure, find SEO issues, and optimize your content hierarchy for better rankings." />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/heading-analyzer" />
        <meta name="keywords" content="heading tag analyzer, H1 checker, heading structure SEO, H1-H6 analysis, content hierarchy tool" />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4">Heading Tag Analyzer (H1-H6)</h1>
        <p className="text-gray-600 mb-8">Analyze your page's heading structure to ensure proper SEO hierarchy and accessibility</p>

        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h2 className="text-xl font-bold text-emerald-700 mb-4">🔗 Analyze by URL</h2>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && analyzeHeadings('url')}
              placeholder="https://example.com"
              className="input mb-3"
            />
            <button
              onClick={() => analyzeHeadings('url')}
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? '⏳ Analyzing...' : '🔍 Analyze URL'}
            </button>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold text-emerald-700 mb-4">📝 Analyze HTML Code</h2>
            <textarea
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              rows="3"
              placeholder="Paste your HTML code here..."
              className="input mb-3 font-mono text-sm"
            />
            <button
              onClick={() => analyzeHeadings('html')}
              disabled={loading}
              className="btn btn-secondary w-full"
            >
              {loading ? '⏳ Analyzing...' : '🔍 Analyze HTML'}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="card bg-red-50 border-red-200 mb-6">
            <p className="text-red-700">❌ {error}</p>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="card bg-emerald-50">
              <h2 className="text-xl font-bold text-emerald-700 mb-4">📊 Summary</h2>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 text-center">
                {Object.entries(results.headings).map(([level, heads]) => (
                  <div key={level}>
                    <div className={`text-3xl font-bold ${heads.length > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {heads.length}
                    </div>
                    <div className="text-sm text-gray-600 uppercase">{level}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center border-t pt-4">
                <div className="text-2xl font-bold text-blue-600">{results.totalHeadings}</div>
                <div className="text-sm text-gray-600">Total Headings</div>
              </div>
            </div>

            {/* Issues & Suggestions */}
            {(results.issues.length > 0 || results.suggestions.length > 0) && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Issues */}
                {results.issues.length > 0 && (
                  <div className="card bg-red-50">
                    <h3 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                      ⚠️ Issues Found ({results.issues.length})
                    </h3>
                    <div className="space-y-2">
                      {results.issues.map((issue, idx) => (
                        <div key={idx} className={`p-2 rounded text-sm ${
                          issue.type === 'critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {issue.text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {results.suggestions.length > 0 && (
                  <div className="card bg-blue-50">
                    <h3 className="font-bold text-blue-700 mb-3 flex items-center gap-2">
                      💡 Suggestions ({results.suggestions.length})
                    </h3>
                    <div className="space-y-2">
                      {results.suggestions.map((suggestion, idx) => (
                        <div key={idx} className={`p-2 rounded text-sm ${
                          suggestion.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {suggestion.text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Heading List */}
            <div className="card">
              <h2 className="text-xl font-bold text-emerald-700 mb-4">📋 All Headings</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {Object.entries(results.headings).map(([level, heads]) => (
                  heads.length > 0 && (
                    <div key={level}>
                      <h3 className="font-bold text-gray-700 mb-2 uppercase">{level} Tags ({heads.length})</h3>
                      <div className="space-y-2 ml-4">
                        {heads.map((heading, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${getBadgeColor(level)}`}>
                              {level.toUpperCase()}
                            </span>
                            <div className="flex-1">
                              <p className="text-gray-900 font-medium">{heading.text || '(Empty)'}</p>
                              {heading.text.length > 70 && (
                                <p className="text-xs text-orange-600 mt-1">⚠️ {heading.text.length} characters (too long)</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Best Practices */}
            <div className="card bg-emerald-50">
              <h3 className="font-bold text-emerald-700 mb-3">✅ SEO Best Practices</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">●</span>
                  <span>Use exactly <strong>one H1 tag</strong> per page as your main title</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">●</span>
                  <span>Follow proper hierarchy: H1 → H2 → H3 (don't skip levels)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">●</span>
                  <span>Keep headings under 70 characters for readability</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">●</span>
                  <span>Include target keywords naturally in H1 and H2 tags</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">●</span>
                  <span>Use headings to break content into scannable sections</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {!results && !error && !loading && (
          <div className="card text-center py-16 text-gray-500">
            <p className="text-lg mb-2">👆 Enter a URL or paste HTML to analyze heading structure</p>
            <p className="text-sm">We'll check your H1-H6 tags and provide SEO recommendations</p>
          </div>
        )}

        {/* SEO Content */}
        <div className="mt-12 card">
          <h2 className="text-2xl font-bold text-emerald-700 mb-4">Complete Guide to Heading Tags and SEO Hierarchy</h2>
          <div className="prose max-w-none text-gray-700 space-y-4">
            <p>
              Heading tags are one of the most underrated aspects of on-page SEO. I see websites all the time with three H1 tags, or worse - no headings at all. It's like trying to read a book with no chapters. Your <strong>heading structure</strong> tells search engines exactly what your content is about and how it's organized, which directly impacts your rankings.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Why H1 Tags Are Critical for SEO</h3>
            <p>
              Your <strong>H1 tag</strong> is the most important heading on your page. Think of it as your page's headline - it should tell both users and search engines what the page is about in one clear, concise statement. Google gives significant weight to H1 tags when determining relevance, so this is premium real estate for your target keyword.
            </p>
            <p>
              Here's the golden rule: <strong>one H1 per page</strong>, and it should match or closely relate to your title tag. Multiple H1s confuse search engines about which topic is primary. It's like having two book titles on the cover - which one is the real one? Our heading analyzer instantly spots this issue and tells you exactly how many H1 tags you have.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Understanding Heading Hierarchy (H1-H6)</h3>
            <p>
              Heading hierarchy isn't just about SEO - it's about creating content that's actually readable and accessible. Screen readers use heading tags to help visually impaired users navigate your content. Search engine crawlers use them similarly to understand your content structure and relationships between sections.
            </p>
            <p>
              The hierarchy works like an outline: H1 is your main topic, H2s are your main sections, H3s are subsections under H2s, and so on. You should never skip levels - going from H1 directly to H3 breaks the logical flow. Our <strong>heading tag analyzer</strong> catches these hierarchy violations and shows you exactly where you've skipped levels.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">How to Use Our Heading Analyzer Tool</h3>
            <p>
              Using our tool is dead simple. Enter any URL and we'll crawl the page, extract every heading tag from H1 to H6, and show you exactly how your content is structured. You'll see color-coded badges for each heading level, making it easy to visualize your hierarchy at a glance.
            </p>
            <p>
              The analysis section tells you immediately if something's wrong - multiple H1s, missing headings, broken hierarchy, or headings that are too long. We also provide actionable suggestions like adding H2 subheadings to break up long sections or fixing empty heading tags that provide zero SEO value.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Common Heading Tag Mistakes That Hurt Rankings</h3>
            <p>
              The biggest mistake? Multiple H1 tags. I've audited sites with five or six H1s on a single page. Google gets confused about what the page is actually about, which dilutes your relevance signals. Stick to one H1, period.
            </p>
            <p>
              Another common issue is using headings for styling instead of structure. Just because you want bigger, bold text doesn't mean you should use an H3 tag. That's what CSS is for. Heading tags should reflect actual content hierarchy, not just visual design preferences. Search engines read the HTML, not the CSS, so misusing headings sends wrong signals.
            </p>
            <p>
              Empty headings are another killer. Tags like &lt;h2&gt;&lt;/h2&gt; with no text provide zero value and waste your SEO potential. If you're going to use a heading tag, make it descriptive and include relevant keywords naturally.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Optimizing H2 and H3 Tags for Better Rankings</h3>
            <p>
              While H1 gets all the glory, your <strong>H2 and H3 tags</strong> are incredibly valuable for ranking. These subheadings let you target secondary keywords and long-tail variations without stuffing your H1. Google uses these to understand the full scope of your content.
            </p>
            <p>
              A well-optimized article might have one H1 with the main keyword, 3-5 H2s with related keywords and questions, and several H3s diving deeper into specific points. This creates a rich semantic structure that helps you rank for multiple related queries. Our tool shows you exactly how many of each heading type you have, so you can ensure proper distribution.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Heading Length and Character Limits</h3>
            <p>
              Keep your headings concise - ideally under 70 characters. Longer headings get cut off in search results and are harder for users to scan. Your H1 especially should be punchy and clear. If you need 100+ characters to explain your topic, you're probably trying to cram too much in.
            </p>
            <p>
              Think of headings as your content's table of contents. Each one should be scannable and give readers a clear idea of what that section covers. If someone is just scrolling and reading headings, they should still understand your main points. That's good UX and good SEO.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Heading Tags and Featured Snippets</h3>
            <p>
              Here's a secret: proper heading structure dramatically increases your chances of winning <strong>featured snippets</strong> in Google. When you use H2 tags to ask questions (How to...? What is...? Why does...?), Google can easily pull that section as an answer box.
            </p>
            <p>
              Pair question-based H2s with clear, concise answers in the paragraph immediately following, and you've got featured snippet gold. Check competitor pages that rank in position zero - almost all of them have strong heading structures with question-based H2 tags.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Mobile Optimization and Heading Tags</h3>
            <p>
              On mobile devices, heading tags become even more important because users are scanning, not reading word-for-word. Clear H2 and H3 tags help mobile users jump to the section they need without endless scrolling. This reduces bounce rate and improves user experience signals - both ranking factors.
            </p>
            <p>
              Make sure your headings are descriptive enough to stand alone. "Introduction" as an H2 is useless. "What is Keyword Density and Why It Matters" is much better. Mobile users should be able to scan your headings and find exactly what they're looking for in seconds.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Using Headings for Internal Linking Strategy</h3>
            <p>
              Smart SEOs use heading tags to guide their internal linking. When you link to another page, you're telling search engines that page is important. When you link from a heading tag (or right after one), you're adding extra emphasis. This is why you'll see internal links clustered around H2 and H3 tags in well-optimized content.
            </p>
            <p>
              For example, if you have an H2 about "Keyword Research Tools," that's the perfect place to link to a detailed guide on that topic. The heading provides context for the link, making it more valuable for SEO. Our <a href="/tools/seo-audit" className="text-emerald-600 hover:underline">SEO Audit tool</a> can help you find more optimization opportunities like this across your entire site.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Accessibility and Heading Tag Best Practices</h3>
            <p>
              Accessibility isn't just the right thing to do - it's good for SEO. Screen readers rely on heading tags to navigate content, and search engines use similar logic. A properly structured heading hierarchy helps everyone, including Google's crawlers, understand and navigate your content.
            </p>
            <p>
              Never use heading tags purely for styling. Don't skip heading levels. Don't use images with alt text instead of actual text headings (search engines can't read images as reliably). Follow semantic HTML principles, and both your accessibility score and your SEO will improve together.
            </p>

            <p className="text-lg font-semibold text-emerald-700 mt-6">
              Ready to fix your heading structure? Use our free heading tag analyzer above to audit your pages, identify issues, and optimize for better rankings. Pair this with our <a href="/tools/keyword-density-checker" className="text-emerald-600 hover:underline">Keyword Density Checker</a> to ensure your headings have the right keyword balance, and our <a href="/tools/meta-generator" className="text-emerald-600 hover:underline">Meta Tag Generator</a> to create compelling titles that match your H1 tags.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-8 card bg-gray-50">
          <h2 className="text-2xl font-bold text-emerald-700 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">How many H1 tags should a page have?</h3>
              <p className="text-gray-700">Exactly one H1 tag per page. Multiple H1s confuse search engines about your primary topic and dilute SEO value.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Should my H1 tag match my title tag?</h3>
              <p className="text-gray-700">They should be similar but don't have to be identical. Your title tag can be optimized for SERPs (60 chars) while your H1 can be slightly longer and more descriptive.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Can I skip from H2 to H4?</h3>
              <p className="text-gray-700">No, you should follow proper hierarchy: H1 → H2 → H3 → H4. Skipping levels breaks the logical structure and confuses screen readers and search engines.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">How do I check my heading tags?</h3>
              <p className="text-gray-700">Use our free heading analyzer tool above. Just enter your URL and we'll extract all H1-H6 tags, check for SEO issues, and provide optimization suggestions.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
