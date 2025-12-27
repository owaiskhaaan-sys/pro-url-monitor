import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function SEOTitleGenerator() {
  const [content, setContent] = useState('');
  const [keyword, setKeyword] = useState('');
  const [titles, setTitles] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const powerWords = {
    action: ['Ultimate', 'Essential', 'Complete', 'Proven', 'Step-by-Step'],
    emotional: ['Amazing', 'Incredible', 'Powerful', 'Stunning', 'Revolutionary'],
    urgency: ['Now', 'Today', 'Quick', 'Fast', 'Instant'],
    value: ['Free', 'Best', 'Top', 'Expert', 'Professional'],
    curiosity: ['Secret', 'Hidden', 'Unknown', 'Surprising', 'Shocking']
  };

  const titleFormats = [
    { pattern: '[Number] [Keyword] Tips for [Year]', type: 'List' },
    { pattern: 'How to [Keyword]: [Benefit]', type: 'How-To' },
    { pattern: '[Keyword]: The Complete Guide', type: 'Guide' },
    { pattern: '[Adjective] [Keyword] That [Benefit]', type: 'Benefit-Focused' },
    { pattern: '[Keyword] - [Promise] in [Timeframe]', type: 'Quick Win' }
  ];

  const generateTitles = () => {
    setError('');
    setTitles([]);
    setIsGenerating(true);

    if (!content.trim() && !keyword.trim()) {
      setError('Please enter either content or a keyword');
      setIsGenerating(false);
      return;
    }

    const generated = [];
    const year = new Date().getFullYear();
    const mainKeyword = keyword || extractKeyword(content);
    const numbers = ['5', '7', '10', '15', '20'];
    const benefits = ['Boost Your Results', 'Save Time', 'Get Better Results', 'Increase Traffic', 'Improve Rankings'];
    const timeframes = ['Minutes', 'Days', 'Weeks', 'No Time'];

    // Title 1: Number-based list with year
    const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
    const powerWord1 = powerWords.action[Math.floor(Math.random() * powerWords.action.length)];
    const title1 = `${randomNumber} ${powerWord1} ${mainKeyword} Tips for ${year}`;
    generated.push({
      text: title1.substring(0, 60),
      length: Math.min(title1.length, 60),
      type: 'List Format',
      score: calculateScore(title1)
    });

    // Title 2: How-to format
    const powerWord2 = powerWords.value[Math.floor(Math.random() * powerWords.value.length)];
    const benefit1 = benefits[Math.floor(Math.random() * benefits.length)];
    const title2 = `How to ${mainKeyword}: ${powerWord2} Guide to ${benefit1}`;
    generated.push({
      text: title2.substring(0, 60),
      length: Math.min(title2.length, 60),
      type: 'How-To',
      score: calculateScore(title2)
    });

    // Title 3: Ultimate guide
    const powerWord3 = powerWords.action[Math.floor(Math.random() * powerWords.action.length)];
    const title3 = `${powerWord3} Guide to ${mainKeyword} [${year} Edition]`;
    generated.push({
      text: title3.substring(0, 60),
      length: Math.min(title3.length, 60),
      type: 'Complete Guide',
      score: calculateScore(title3)
    });

    // Title 4: Benefit-focused with emotional trigger
    const powerWord4 = powerWords.emotional[Math.floor(Math.random() * powerWords.emotional.length)];
    const benefit2 = benefits[Math.floor(Math.random() * benefits.length)];
    const title4 = `${powerWord4} ${mainKeyword} Tools That ${benefit2}`;
    generated.push({
      text: title4.substring(0, 60),
      length: Math.min(title4.length, 60),
      type: 'Benefit-Driven',
      score: calculateScore(title4)
    });

    // Title 5: Quick win promise
    const powerWord5 = powerWords.urgency[Math.floor(Math.random() * powerWords.urgency.length)];
    const timeframe = timeframes[Math.floor(Math.random() * timeframes.length)];
    const benefit3 = benefits[Math.floor(Math.random() * benefits.length)];
    const title5 = `${mainKeyword}: ${benefit3} in ${timeframe} (${powerWord5}!)`;
    generated.push({
      text: title5.substring(0, 60),
      length: Math.min(title5.length, 60),
      type: 'Quick Result',
      score: calculateScore(title5)
    });

    // Title 6: Question format
    const title6 = `What is ${mainKeyword}? Everything You Need to Know`;
    generated.push({
      text: title6.substring(0, 60),
      length: Math.min(title6.length, 60),
      type: 'Question-Based',
      score: calculateScore(title6)
    });

    // Title 7: Comparison/versus
    const randomNumber2 = numbers[Math.floor(Math.random() * numbers.length)];
    const title7 = `${mainKeyword} vs Alternatives: Top ${randomNumber2} Options`;
    generated.push({
      text: title7.substring(0, 60),
      length: Math.min(title7.length, 60),
      type: 'Comparison',
      score: calculateScore(title7)
    });

    setTimeout(() => {
      setTitles(generated.sort((a, b) => b.score - a.score));
      setIsGenerating(false);
    }, 800);
  };

  const extractKeyword = (text) => {
    const words = text.toLowerCase().split(/\s+/);
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const filtered = words.filter(w => w.length > 3 && !stopWords.includes(w));
    return filtered[0] || 'Topic';
  };

  const calculateScore = (title) => {
    let score = 0;
    
    // Length score
    if (title.length >= 50 && title.length <= 60) score += 30;
    else if (title.length >= 40 && title.length < 50) score += 20;
    else score += 10;

    // Has number
    if (/\d+/.test(title)) score += 15;

    // Has power words
    const allPowerWords = Object.values(powerWords).flat().map(w => w.toLowerCase());
    const titleLower = title.toLowerCase();
    if (allPowerWords.some(pw => titleLower.includes(pw))) score += 20;

    // Has current year
    if (title.includes(new Date().getFullYear().toString())) score += 10;

    // Has brackets or parentheses
    if (/[\[\(]/.test(title)) score += 10;

    // Capitalization
    if (/[A-Z]/.test(title.charAt(0))) score += 5;

    // Has colon (structure)
    if (title.includes(':')) score += 10;

    return score;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const getCharacterColor = (length) => {
    if (length < 40) return 'text-orange-600';
    if (length >= 50 && length <= 60) return 'text-emerald-600';
    if (length > 60) return 'text-red-600';
    return 'text-blue-600';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  return (
    <Layout>
      <Head>
        <title>SEO Title Tag Generator - Create Click-Worthy Titles | ProURLMonitor</title>
        <meta name="description" content="Generate SEO-optimized title tags that rank and get clicks. Get 7 unique title variations with power words, optimal length (50-60 chars), and high CTR potential." />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4 text-center">SEO Title Tag Generator</h1>
        <p className="text-gray-600 mb-8 text-center">
          Generate click-worthy SEO title tags optimized for rankings and CTR. Get 7 unique variations instantly!
        </p>

        <div className="card mb-8">
          {/* Keyword Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Keyword (Recommended):</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g., SEO tools, meta tags, binary converter"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-lg"
            />
          </div>

          {/* Content Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Page Content (Optional):</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your content here to help generate more relevant titles..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 min-h-[120px]"
              rows={5}
            />
            <p className="text-xs text-gray-500 mt-1">If no keyword provided, we'll extract one from your content</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Generate Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={generateTitles}
              disabled={isGenerating}
              className={`btn btn-primary px-12 py-3 text-lg ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isGenerating ? 'Generating...' : 'Generate Title Tags'}
            </button>
          </div>

          {/* Results */}
          {titles.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">✨ Generated SEO Title Tags:</h2>
              
              {titles.map((title, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border-2 border-blue-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                        #{index + 1}
                      </span>
                      <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded">
                        {title.type}
                      </span>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${getScoreColor(title.score)} bg-white border-2`}>
                        Score: {title.score}/100 - {getScoreLabel(title.score)}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(title.text)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1"
                    >
                      📋 Copy
                    </button>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-3 leading-tight">{title.text}</h3>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`font-bold ${getCharacterColor(title.length)}`}>
                      {title.length} characters
                    </span>
                    {title.length >= 50 && title.length <= 60 && (
                      <span className="text-emerald-600 text-xs font-semibold">✓ Perfect Length</span>
                    )}
                    {title.length < 40 && (
                      <span className="text-orange-600 text-xs font-semibold">⚠ Too Short</span>
                    )}
                    {title.length > 60 && (
                      <span className="text-red-600 text-xs font-semibold">⚠ Too Long</span>
                    )}
                  </div>
                </div>
              ))}

              <div className="bg-emerald-50 p-5 rounded-lg border border-emerald-200 mt-6">
                <h3 className="font-semibold text-emerald-800 mb-3">💡 Title Optimization Tips:</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• <strong>Optimal Length:</strong> 50-60 characters (Google displays fully in search results)</li>
                  <li>• <strong>Keyword Placement:</strong> Include your main keyword near the beginning</li>
                  <li>• <strong>Power Words:</strong> Use emotional triggers like "Ultimate," "Complete," "Proven"</li>
                  <li>• <strong>Numbers:</strong> Titles with numbers get 36% more clicks (e.g., "7 Ways...")</li>
                  <li>• <strong>Year:</strong> Including the current year signals freshness</li>
                  <li>• <strong>Brand:</strong> Consider adding " | YourBrand" if space allows</li>
                  <li>• <strong>Uniqueness:</strong> Each page should have a unique, descriptive title</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* SEO Content */}
        <div className="prose prose-emerald max-w-none mt-12 space-y-8">
          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">What is an SEO Title Tag?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              An <strong>SEO title tag</strong> (also called page title or title element) is an HTML element that specifies the title of a web page. It appears as the clickable headline in search engine results pages (SERPs) and is one of the most important on-page SEO factors. The title tag is displayed in three key places: search results, browser tabs, and social media shares.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Title tags directly impact both SEO rankings and click-through rates (CTR). Google uses title tags as a primary indicator of page relevance for search queries, making them crucial for rankings. A well-optimized title tag should be 50-60 characters long, include the target keyword near the beginning, and be compelling enough to entice users to click. The perfect title balances SEO optimization with user appeal.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our <strong>SEO title generator</strong> creates 7 unique title variations using proven formulas that combine power words, numbers, and emotional triggers. Each title is scored based on SEO best practices and optimized for maximum click-through rates. For complete on-page optimization, also check our <a href="/tools/meta-description-generator" className="text-emerald-600 hover:text-emerald-700 font-medium">Meta Description Generator</a> tool.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">How to Write Perfect SEO Titles</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Creating <strong>high-performing title tags</strong> requires strategic optimization:
            </p>
            <div className="bg-blue-50 p-6 rounded-lg mb-4">
              <h3 className="font-semibold text-blue-800 mb-3">Essential Elements of Great Titles:</h3>
              <ol className="space-y-3 text-gray-700">
                <li><strong>1. Optimal Length (50-60 characters):</strong> Google displays approximately 50-60 characters in search results. Longer titles get truncated with "..." which reduces effectiveness and CTR.</li>
                <li><strong>2. Primary Keyword First:</strong> Place your main keyword near the beginning. Example: "SEO Title Generator" instead of "Generator for SEO Titles"</li>
                <li><strong>3. Power Words:</strong> Use emotional triggers like Ultimate, Complete, Essential, Proven, Expert, Best, Top to increase appeal and clicks.</li>
                <li><strong>4. Numbers Work:</strong> Titles with numbers (7 Tips, 10 Ways, 5 Steps) get 36% higher CTR. Odd numbers perform slightly better than even.</li>
                <li><strong>5. Current Year:</strong> Adding [2025] signals fresh, up-to-date content and can improve rankings for time-sensitive queries.</li>
                <li><strong>6. Brand Name:</strong> Add "| YourBrand" at the end if space allows. This builds brand recognition and trust in search results.</li>
                <li><strong>7. Unique Value:</strong> Communicate what makes your page different. Why should users click YOUR result over competitors?</li>
              </ol>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Title Formula Examples That Work:</strong>
            </p>
            <div className="space-y-2 mb-4">
              <div className="bg-emerald-50 p-3 rounded border-l-4 border-emerald-500">
                <p className="font-mono text-sm text-gray-800"><strong>[Number] [Power Word] [Keyword] [Benefit/Promise]</strong></p>
                <p className="text-xs text-gray-600 mt-1">Example: "7 Ultimate SEO Tools to Boost Your Rankings"</p>
              </div>
              <div className="bg-emerald-50 p-3 rounded border-l-4 border-emerald-500">
                <p className="font-mono text-sm text-gray-800"><strong>How to [Keyword]: [Benefit] [Year]</strong></p>
                <p className="text-xs text-gray-600 mt-1">Example: "How to Write SEO Titles: Complete Guide 2025"</p>
              </div>
              <div className="bg-emerald-50 p-3 rounded border-l-4 border-emerald-500">
                <p className="font-mono text-sm text-gray-800"><strong>[Keyword] - [Promise] in [Timeframe]</strong></p>
                <p className="text-xs text-gray-600 mt-1">Example: "SEO Optimization - Rank Higher in 30 Days"</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              For analyzing your current title tags, use our <a href="/tools/seo-audit" className="text-emerald-600 hover:text-emerald-700 font-medium">SEO Audit Tool</a> for comprehensive page analysis.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Title Tag Length Guidelines</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Understanding <strong>title tag character limits</strong> and pixel width:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Length</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Status</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Result in SERPs</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono">&lt; 30 chars</td><td className="border border-gray-300 px-4 py-2"><span className="text-red-600 font-semibold">Too Short</span></td><td className="border border-gray-300 px-4 py-2 text-sm">Wasted space, may appear incomplete or unprofessional</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono">30-49 chars</td><td className="border border-gray-300 px-4 py-2"><span className="text-orange-600 font-semibold">Short</span></td><td className="border border-gray-300 px-4 py-2 text-sm">Displays fully but doesn't utilize available SERP space</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono">50-60 chars</td><td className="border border-gray-300 px-4 py-2"><span className="text-emerald-600 font-semibold">Perfect ✓</span></td><td className="border border-gray-300 px-4 py-2 text-sm">Optimal length - displays fully on all devices</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono">60-70 chars</td><td className="border border-gray-300 px-4 py-2"><span className="text-yellow-600 font-semibold">Acceptable</span></td><td className="border border-gray-300 px-4 py-2 text-sm">May get truncated on mobile, use with caution</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono">&gt; 70 chars</td><td className="border border-gray-300 px-4 py-2"><span className="text-red-600 font-semibold">Too Long</span></td><td className="border border-gray-300 px-4 py-2 text-sm">Will be cut off with "..." losing important information</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Important Note:</strong> Google actually measures title display by pixel width (approximately 600 pixels), not character count. Wide characters like "W" and "M" take more space than "i" or "l". However, staying within 50-60 characters is a safe guideline that works for most titles. Our generator automatically optimizes for this sweet spot.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Power Words for Higher CTR</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Power words</strong> are persuasive terms that trigger emotional responses and increase click-through rates:
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">🎯 Action Words</h3>
                <div className="flex flex-wrap gap-2">
                  {['Ultimate', 'Complete', 'Essential', 'Proven', 'Step-by-Step', 'Definitive', 'Comprehensive'].map(word => (
                    <span key={word} className="text-xs bg-white px-2 py-1 rounded border border-purple-300">{word}</span>
                  ))}
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="text-lg font-semibold text-red-800 mb-3">⚡ Urgency Words</h3>
                <div className="flex flex-wrap gap-2">
                  {['Now', 'Today', 'Quick', 'Fast', 'Instant', 'Immediately', 'Limited'].map(word => (
                    <span key={word} className="text-xs bg-white px-2 py-1 rounded border border-red-300">{word}</span>
                  ))}
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">💎 Value Words</h3>
                <div className="flex flex-wrap gap-2">
                  {['Free', 'Best', 'Top', 'Expert', 'Professional', 'Premium', 'Exclusive'].map(word => (
                    <span key={word} className="text-xs bg-white px-2 py-1 rounded border border-blue-300">{word}</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Research shows titles with power words can increase CTR by 12-18%. However, use them authentically—don't add power words that don't match your content, as this increases bounce rates and hurts SEO.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Common Title Tag Mistakes to Avoid</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Avoid these <strong>critical title tag errors</strong>:
            </p>
            <div className="space-y-3">
              <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">❌ Duplicate Title Tags</h3>
                <p className="text-sm text-gray-700">Using identical titles across multiple pages confuses search engines and dilutes ranking power. Each page needs a unique, descriptive title.</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">❌ Keyword Stuffing</h3>
                <p className="text-sm text-gray-700">"Buy Shoes - Cheap Shoes - Best Shoes - Discount Shoes" looks spammy and hurts rankings. Use keywords naturally once or twice max.</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">❌ Missing Keywords</h3>
                <p className="text-sm text-gray-700">Generic titles like "Home" or "Services" waste SEO potential. Always include your target keyword.</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">❌ Too Long Titles</h3>
                <p className="text-sm text-gray-700">Titles over 60 characters get truncated. Important information at the end gets cut off with "..."</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">❌ All Caps or Special Characters</h3>
                <p className="text-sm text-gray-700">"AMAZING SEO TOOL!!!" appears unprofessional. Use title case and minimal punctuation.</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">❌ Misleading Clickbait</h3>
                <p className="text-sm text-gray-700">False promises increase bounce rates. Google tracks user behavior and may penalize misleading titles.</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Title Tag SEO Impact</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              How <strong>title tags affect SEO performance</strong>:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">🏆 Ranking Factor</h3>
                <p className="text-sm text-gray-700">Title tags are among the top 3 most important on-page SEO factors. They directly influence how Google understands and ranks your page for target keywords.</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">👆 Click-Through Rate</h3>
                <p className="text-sm text-gray-700">Optimized titles can increase CTR by 20-40%. Higher CTR signals relevance to Google, improving rankings over time through user behavior metrics.</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">🎯 User Experience</h3>
                <p className="text-sm text-gray-700">Clear, accurate titles set proper expectations, reducing bounce rates and increasing time-on-site—both positive ranking signals.</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">📱 Social Sharing</h3>
                <p className="text-sm text-gray-700">Title tags appear when pages are shared on social media, influencing social engagement and driving additional traffic.</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Studies show pages with optimized title tags rank an average of 6-8 positions higher than those with generic titles. The combination of keyword optimization and compelling copy creates a powerful SEO advantage.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Related SEO Tools</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Complete your SEO optimization with these tools:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/meta-description-generator" className="hover:text-emerald-600">📝 Meta Description Generator</a>
                </h3>
                <p className="text-sm text-gray-700">Create SEO-optimized meta descriptions (120-155 chars).</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/heading-analyzer" className="hover:text-emerald-600">📑 Heading Analyzer</a>
                </h3>
                <p className="text-sm text-gray-700">Analyze and optimize your H1-H6 heading structure.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/seo-audit" className="hover:text-emerald-600">🔍 SEO Audit Tool</a>
                </h3>
                <p className="text-sm text-gray-700">Comprehensive SEO analysis of your web pages.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/keyword-density-checker" className="hover:text-emerald-600">🎯 Keyword Density Checker</a>
                </h3>
                <p className="text-sm text-gray-700">Analyze keyword usage and density in content.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/meta-generator" className="hover:text-emerald-600">🏷️ Meta Tags Generator</a>
                </h3>
                <p className="text-sm text-gray-700">Generate complete meta tags for your pages.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/schema-generator" className="hover:text-emerald-600">📋 Schema Generator</a>
                </h3>
                <p className="text-sm text-gray-700">Create structured data markup for rich results.</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">📚 Frequently Asked Questions (FAQs)</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What is the ideal title tag length for SEO?</h3>
                <p className="text-gray-700 text-sm">A: The optimal length is 50-60 characters (approximately 600 pixels). This ensures your full title displays in search results without truncation on all devices, maximizing visibility and CTR.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Should I put keywords at the beginning or end of title tags?</h3>
                <p className="text-gray-700 text-sm">A: Place your primary keyword near the beginning (first 3-5 words). Google gives more weight to words at the start, and users scan from left to right, making early keywords more impactful.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Can I use the same title tag on multiple pages?</h3>
                <p className="text-gray-700 text-sm">A: No. Duplicate title tags confuse search engines about which page to rank for what queries. Each page needs a unique title that accurately describes its specific content.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Do title tags affect rankings directly?</h3>
                <p className="text-gray-700 text-sm">A: Yes. Title tags are one of the top 3 most important on-page SEO factors. They help search engines understand page content and relevance for specific keywords, directly influencing rankings.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Should I include my brand name in title tags?</h3>
                <p className="text-gray-700 text-sm">A: Yes, if space allows. Add "| YourBrand" at the end. This builds brand recognition and trust. For homepage, put brand first: "Brand Name - What You Do"</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What are power words and why use them?</h3>
                <p className="text-gray-700 text-sm">A: Power words are emotional triggers (Ultimate, Essential, Proven, Best) that increase CTR by 12-18%. They make titles more compelling and clickable in search results.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Do numbers in titles really improve CTR?</h3>
                <p className="text-gray-700 text-sm">A: Yes! Research shows titles with numbers get 36% more clicks. Numbers promise specific, actionable content (e.g., "7 Tips" vs "Tips"). Odd numbers perform slightly better than even.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Will Google rewrite my title tag?</h3>
                <p className="text-gray-700 text-sm">A: Sometimes. Google may rewrite titles it considers too long, keyword-stuffed, or not relevant to the query. Write clear, accurate, keyword-optimized titles to minimize rewrites.</p>
              </div>
            </div>
          </div>

          <div className="card bg-blue-700 text-white">
            <h2 className="text-2xl font-bold mb-4">🚀 Start Creating SEO Titles Now!</h2>
            <p className="mb-4">
              Use our <strong>free SEO title generator</strong> to create click-worthy title tags that rank and drive traffic. Perfect for bloggers, content marketers, SEO professionals, and website owners who want to maximize search visibility and CTR. Get 7 unique variations scored for SEO effectiveness with power words, optimal length, and proven formulas.
            </p>
            <p className="mb-4">
              No registration required. Unlimited generations. Completely free forever!
            </p>
            <p className="font-semibold">
              Explore more tools: <a href="/tools/meta-description-generator" className="text-blue-100 hover:text-white underline">Meta Description</a> • <a href="/tools/seo-audit" className="text-blue-100 hover:text-white underline">SEO Audit</a> • <a href="/tools/heading-analyzer" className="text-blue-100 hover:text-white underline">Heading Analyzer</a> 🎯
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
