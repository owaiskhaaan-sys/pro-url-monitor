import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function KeywordDensityChecker() {
  const [content, setContent] = useState('');
  const [results, setResults] = useState(null);

  const analyzeKeywords = () => {
    if (!content.trim()) {
      alert('Please enter some content to analyze');
      return;
    }

    // Clean and process text
    const text = content.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const words = text.split(' ').filter(w => w.length > 2); // Ignore 1-2 letter words
    const totalWords = words.length;

    // Count word frequency
    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    // Calculate density and sort
    const keywordData = Object.entries(wordCount)
      .map(([word, count]) => ({
        keyword: word,
        count,
        density: ((count / totalWords) * 100).toFixed(2)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20); // Top 20 keywords

    // Calculate 2-word phrases
    const phrases = [];
    for (let i = 0; i < words.length - 1; i++) {
      phrases.push(`${words[i]} ${words[i + 1]}`);
    }

    const phraseCount = {};
    phrases.forEach(phrase => {
      phraseCount[phrase] = (phraseCount[phrase] || 0) + 1;
    });

    const phraseData = Object.entries(phraseCount)
      .filter(([, count]) => count > 1)
      .map(([phrase, count]) => ({
        phrase,
        count,
        density: ((count / (totalWords - 1)) * 100).toFixed(2)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    setResults({
      totalWords,
      uniqueWords: Object.keys(wordCount).length,
      keywords: keywordData,
      phrases: phraseData
    });
  };

  return (
    <Layout>
      <Head>
        <title>Keyword Density Checker - Analyze Content Keywords for SEO | ProURLMonitor</title>
        <meta name="description" content="Free keyword density checker tool. Analyze keyword frequency, find over-optimization, and improve your content's SEO with detailed keyword analysis." />
        <meta name="keywords" content="keyword density checker, keyword frequency tool, SEO content analyzer, keyword stuffing detector, content optimization tool" />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/keyword-density-checker" />
      </Head>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4">Keyword Density Checker</h1>
        <p className="text-gray-600 mb-8">Analyze keyword frequency and density in your content to optimize for SEO without keyword stuffing</p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="card">
              <h2 className="text-xl font-bold text-emerald-700 mb-4">Your Content</h2>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="15"
                placeholder="Paste your article, blog post, or content here...&#10;&#10;The tool will analyze keyword frequency, density, and find potential keyword stuffing issues."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
              />
              <div className="mt-3 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {content.split(/\s+/).filter(w => w.length > 0).length} words
                </span>
                <button
                  onClick={analyzeKeywords}
                  className="btn btn-primary"
                >
                  🔍 Analyze Keywords
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            {results ? (
              <>
                {/* Summary */}
                <div className="card bg-emerald-50">
                  <h2 className="text-xl font-bold text-emerald-700 mb-4">Summary</h2>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-emerald-600">{results.totalWords}</div>
                      <div className="text-sm text-gray-600">Total Words</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-blue-600">{results.uniqueWords}</div>
                      <div className="text-sm text-gray-600">Unique Words</div>
                    </div>
                  </div>
                </div>

                {/* Top Keywords */}
                <div className="card max-h-96 overflow-y-auto">
                  <h2 className="text-xl font-bold text-emerald-700 mb-4">Top Keywords</h2>
                  <div className="space-y-2">
                    {results.keywords.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="font-medium text-gray-700">{item.keyword}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">{item.count}x</span>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            parseFloat(item.density) > 3 ? 'bg-red-100 text-red-700' : 
                            parseFloat(item.density) > 2 ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-green-100 text-green-700'
                          }`}>
                            {item.density}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Phrases */}
                {results.phrases.length > 0 && (
                  <div className="card max-h-80 overflow-y-auto">
                    <h2 className="text-xl font-bold text-emerald-700 mb-4">Common 2-Word Phrases</h2>
                    <div className="space-y-2">
                      {results.phrases.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="font-medium text-gray-700">{item.phrase}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">{item.count}x</span>
                            <span className="px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-700">
                              {item.density}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SEO Tips */}
                <div className="card bg-blue-50">
                  <h3 className="font-bold text-blue-700 mb-2">💡 SEO Tips</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li className="flex items-start gap-2">
                      <span className={results.keywords[0] && parseFloat(results.keywords[0].density) > 3 ? 'text-red-600' : 'text-green-600'}>●</span>
                      <span>Ideal keyword density: 0.5% - 2.5% (avoid stuffing)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">●</span>
                      <span>Use LSI keywords and synonyms for natural content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">●</span>
                      <span>Focus on user intent, not just keyword density</span>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="card text-center py-16 text-gray-500">
                <p className="text-lg mb-2">👈 Enter your content and click Analyze</p>
                <p className="text-sm">We'll show you keyword frequency, density, and optimization tips</p>
              </div>
            )}
          </div>
        </div>

        {/* SEO Content */}
        <div className="mt-12 card">
          <h2 className="text-2xl font-bold text-emerald-700 mb-4">Complete Guide to Keyword Density and SEO Content Optimization</h2>
          <div className="prose max-w-none text-gray-700 space-y-4">
            <p>
              Look, keyword density used to be the holy grail of SEO back in the early 2000s. People would stuff their content with keywords until it was basically unreadable, and Google would still rank them. Those days are long gone, but understanding <strong>keyword density</strong> is still crucial for creating well-optimized content that actually ranks.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">What is Keyword Density and Why It Still Matters</h3>
            <p>
              <strong>Keyword density</strong> is simply the percentage of times a target keyword appears in your content compared to the total word count. For example, if your article has 1000 words and your keyword appears 10 times, that's a 1% keyword density. Simple math, but the implications are huge for your SEO strategy.
            </p>
            <p>
              Here's the thing - Google's gotten incredibly smart with algorithms like RankBrain and BERT. They don't just count keywords anymore; they understand context, intent, and semantic relationships. But that doesn't mean keyword density is dead. It's evolved into something more nuanced. You still need to use your target keywords, but now it's about using them naturally within high-quality content that actually answers user questions.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">The Ideal Keyword Density for Modern SEO</h3>
            <p>
              So what's the magic number? Most SEO experts agree that a <strong>keyword density between 0.5% and 2.5%</strong> is the sweet spot. Anything above 3% starts looking suspicious to search engines and might get flagged as keyword stuffing. Below 0.5%, and you might not be signaling strongly enough what your content is about.
            </p>
            <p>
              But here's what really matters - it's not just about hitting a specific percentage. Your primary keyword should appear in strategic places: your title tag, first 100 words, at least one H2 heading, and naturally throughout the body. The density will take care of itself if you're writing comprehensive, helpful content that thoroughly covers your topic.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">How to Use Our Keyword Density Checker</h3>
            <p>
              Our <strong>keyword density analyzer</strong> makes optimization dead simple. Just paste your content into the tool, hit analyze, and you'll get a complete breakdown of your most frequently used words and phrases. We show you which keywords are appearing too often (potential stuffing), which ones are perfectly balanced, and even highlight common 2-word phrases that might represent your LSI keywords.
            </p>
            <p>
              The color coding system tells you everything at a glance: green means your density is in the healthy range, yellow indicates you're pushing it a bit, and red means you've definitely overdone it with that keyword. Use this feedback to revise your content before publishing, ensuring you're optimized without crossing into spammy territory.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Understanding Keyword Stuffing and How to Avoid It</h3>
            <p>
              <strong>Keyword stuffing</strong> is when you cram keywords into your content so many times that it becomes obvious you're trying to manipulate search rankings. Google's algorithms are specifically designed to detect and penalize this practice. You'll see your rankings tank, not rise.
            </p>
            <p>
              Common signs of keyword stuffing include unnatural repetition, keywords where they don't make sense grammatically, and hidden text (keywords in white text on white background - yeah, people still try this). Our tool helps you catch these issues before they become problems. If you see any keyword pushing 4-5% density or higher, that's your red flag to edit and diversify your language.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">LSI Keywords and Semantic SEO</h3>
            <p>
              This is where modern SEO gets interesting. <strong>LSI keywords</strong> (Latent Semantic Indexing) are terms and phrases that are semantically related to your main keyword. For example, if you're writing about "coffee," LSI keywords might include "beans," "brewing," "espresso," "caffeine," etc.
            </p>
            <p>
              Google uses these related terms to understand the full context of your content. This is why our tool also analyzes common phrases - they often reveal your LSI keywords. A well-optimized article will have a natural mix of your primary keyword plus several related terms, all appearing at reasonable densities. This creates that sweet spot of being obviously on-topic without being spammy.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Best Practices for Content Optimization</h3>
            <p>
              Start by writing for humans, not search engines. Seriously. Create comprehensive content that thoroughly answers questions and provides real value. Then use our <strong>keyword density checker</strong> to optimize. Look for opportunities to naturally include your target keywords in places you might have missed.
            </p>
            <p>
              Pay attention to your headings structure. Use your main keyword in your H1 and at least one H2. Sprinkle variations and LSI keywords in other headings. Make sure your first paragraph contains your primary keyword - that's premium real estate for SEO. And remember, natural language always beats forced optimization.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Common Mistakes That Kill Your Rankings</h3>
            <p>
              I see this all the time: people focus so hard on keyword density that they forget about readability. Your content should flow naturally. If a sentence sounds weird because you forced a keyword in there, rewrite it. Search engines can detect unnatural language patterns, and more importantly, users will bounce if your content reads like robot-speak.
            </p>
            <p>
              Another huge mistake is ignoring long-tail keywords and phrase variations. Don't just use "SEO tools" fifty times. Mix it up with "SEO analysis tools," "search engine optimization software," "website SEO checker," etc. This not only helps you rank for more queries but also keeps your density numbers healthy across multiple related terms.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Using Keyword Density Data to Improve Rankings</h3>
            <p>
              Once you've analyzed your content, here's what to do with the data. Look at your top 5-10 keywords. Are they all relevant to your topic? If random words like "the," "and," or "very" are dominating (we filter these out, but just in case), your content might lack focus. Your top keywords should be topic-relevant terms.
            </p>
            <p>
              Check if you're missing important keywords that should be there. Writing about SEO but the word "ranking" never appears? That's a gap. Use the phrase analysis to find natural two-word combinations you can incorporate more strategically. Maybe "search engine" appears 15 times but "search results" only once - that could be an opportunity to diversify.
            </p>

            <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Keyword Density for Different Content Types</h3>
            <p>
              Blog posts, product pages, and landing pages all require slightly different approaches. Long-form blog content (1500+ words) can handle slightly lower keyword densities because you have more room to cover related topics. A 2000-word article might sit comfortably at 1% density for your main keyword.
            </p>
            <p>
              Product pages and landing pages, being shorter, might need slightly higher densities (1.5-2.5%) to clearly signal what they're about. But the same rule applies - it must read naturally. If you're hitting 3%+ on a 300-word product description, you've definitely gone overboard.
            </p>

            <p className="text-lg font-semibold text-emerald-700 mt-6">
              Ready to optimize your content for better rankings? Use our free keyword density checker above to analyze your articles, identify over-optimization, and perfect your SEO strategy. Combine this with our <a href="/tools/seo-audit" className="text-emerald-600 hover:underline">SEO Audit tool</a> for complete website analysis and <a href="/tools/meta-generator" className="text-emerald-600 hover:underline">Meta Tag Generator</a> to create compelling titles and descriptions that actually get clicks.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 card bg-gray-50">
          <h2 className="text-2xl font-bold text-emerald-700 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">What is the best keyword density for SEO in 2025?</h3>
              <p className="text-gray-700">The ideal keyword density is between 0.5% to 2.5%. This range helps search engines understand your content topic without triggering keyword stuffing penalties.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Can keyword stuffing hurt my rankings?</h3>
              <p className="text-gray-700">Yes, absolutely. Google's algorithms specifically detect and penalize keyword stuffing. Your rankings will drop, not improve, if you over-optimize.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">How do I check keyword density?</h3>
              <p className="text-gray-700">Simply paste your content into our free keyword density checker tool above. It will analyze your text and show you the frequency and percentage of each keyword.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Should I optimize for exact match keywords or variations?</h3>
              <p className="text-gray-700">Use both! Include your exact match keyword naturally, but also use variations, synonyms, and LSI keywords. This creates better content and ranks for more queries.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
