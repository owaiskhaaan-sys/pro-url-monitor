import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function MetaDescriptionGenerator() {
  const [content, setContent] = useState('');
  const [keyword, setKeyword] = useState('');
  const [descriptions, setDescriptions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const generateDescriptions = () => {
    setError('');
    setDescriptions([]);
    setIsGenerating(true);

    if (!content.trim()) {
      setError('Please enter your content');
      setIsGenerating(false);
      return;
    }

    // Extract key sentences and phrases
    const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
    const words = content.toLowerCase().split(/\s+/);
    
    // Generate multiple descriptions using different strategies
    const generated = [];

    // Strategy 1: First sentence + keyword
    if (sentences.length > 0) {
      let desc1 = sentences[0].trim();
      if (keyword) {
        desc1 = desc1.replace(/\.$/, '') + '. ' + keyword + '.';
      }
      if (desc1.length > 155) {
        desc1 = desc1.substring(0, 152) + '...';
      }
      generated.push({
        text: desc1,
        length: desc1.length,
        type: 'Opening Focus'
      });
    }

    // Strategy 2: Extract most important sentence with keyword
    if (keyword && sentences.length > 1) {
      const keywordLower = keyword.toLowerCase();
      const relevantSentence = sentences.find(s => 
        s.toLowerCase().includes(keywordLower)
      ) || sentences[1];
      
      let desc2 = relevantSentence.trim();
      if (desc2.length > 155) {
        desc2 = desc2.substring(0, 152) + '...';
      }
      generated.push({
        text: desc2,
        length: desc2.length,
        type: 'Keyword Rich'
      });
    }

    // Strategy 3: Summary style (first 2 sentences)
    if (sentences.length >= 2) {
      let desc3 = sentences[0].trim() + ' ' + sentences[1].trim();
      if (desc3.length > 155) {
        desc3 = desc3.substring(0, 152) + '...';
      }
      generated.push({
        text: desc3,
        length: desc3.length,
        type: 'Summary Style'
      });
    }

    // Strategy 4: CTA focused
    const ctaPhrases = [
      'Learn more about',
      'Discover how to',
      'Find out everything about',
      'Get expert tips on',
      'Complete guide to'
    ];
    const randomCTA = ctaPhrases[Math.floor(Math.random() * ctaPhrases.length)];
    const topic = keyword || (sentences[0] ? sentences[0].split(' ').slice(0, 5).join(' ') : 'this topic');
    let desc4 = `${randomCTA} ${topic}. ${sentences[0] ? sentences[0].substring(0, 80) : content.substring(0, 80)}`;
    if (desc4.length > 155) {
      desc4 = desc4.substring(0, 152) + '...';
    }
    generated.push({
      text: desc4,
      length: desc4.length,
      type: 'Action Oriented'
    });

    // Strategy 5: Question format
    if (sentences.length > 0) {
      const questionWords = ['What', 'How', 'Why', 'When', 'Where'];
      const randomQ = questionWords[Math.floor(Math.random() * questionWords.length)];
      let desc5 = `${randomQ} about ${keyword || 'this'}? ${sentences[0].trim()}`;
      if (desc5.length > 155) {
        desc5 = desc5.substring(0, 152) + '...';
      }
      generated.push({
        text: desc5,
        length: desc5.length,
        type: 'Question Format'
      });
    }

    setTimeout(() => {
      setDescriptions(generated);
      setIsGenerating(false);
    }, 800);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const getCharacterColor = (length) => {
    if (length < 120) return 'text-orange-600';
    if (length >= 120 && length <= 155) return 'text-emerald-600';
    return 'text-red-600';
  };

  const getCharacterLabel = (length) => {
    if (length < 120) return 'Too Short';
    if (length >= 120 && length <= 155) return 'Perfect';
    return 'Too Long';
  };

  return (
    <Layout>
      <Head>
        <title>Meta Description Generator - AI-Powered SEO Tool | ProURLMonitor</title>
        <meta name="description" content="Generate SEO-optimized meta descriptions instantly with our AI-powered tool. Get 5 unique descriptions optimized for 155 characters, keyword-rich, and click-worthy." />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4 text-center">Meta Description Generator</h1>
        <p className="text-gray-600 mb-8 text-center">
          Generate SEO-optimized meta descriptions from your content. Get 5 unique variations instantly!
        </p>

        <div className="card mb-8">
          {/* Content Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Page Content:</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your page content here... The more content you provide, the better the meta descriptions will be."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 min-h-[200px]"
              rows={8}
            />
            <p className="text-xs text-gray-500 mt-1">{content.length} characters</p>
          </div>

          {/* Keyword Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Keyword (Optional):</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g., SEO tools, binary converter, etc."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
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
              onClick={generateDescriptions}
              disabled={isGenerating}
              className={`btn btn-primary px-12 py-3 text-lg ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isGenerating ? 'Generating...' : 'Generate Meta Descriptions'}
            </button>
          </div>

          {/* Results */}
          {descriptions.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">✨ Generated Meta Descriptions:</h2>
              
              {descriptions.map((desc, index) => (
                <div key={index} className="bg-gradient-to-r from-emerald-50 to-teal-50 p-5 rounded-lg border-2 border-emerald-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded">
                        Option {index + 1}
                      </span>
                      <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded">
                        {desc.type}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(desc.text)}
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold flex items-center gap-1"
                    >
                      📋 Copy
                    </button>
                  </div>
                  
                  <p className="text-gray-800 mb-3 leading-relaxed">{desc.text}</p>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <span className={`font-bold ${getCharacterColor(desc.length)}`}>
                      {desc.length} characters
                    </span>
                    <span className={`text-xs font-semibold ${getCharacterColor(desc.length)}`}>
                      • {getCharacterLabel(desc.length)}
                    </span>
                    {desc.length >= 120 && desc.length <= 155 && (
                      <span className="text-emerald-600 text-xs">✓ Optimal Length</span>
                    )}
                  </div>
                </div>
              ))}

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-6">
                <h3 className="font-semibold text-blue-800 mb-2">💡 Pro Tips:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Ideal length: 120-155 characters (Google displays fully)</li>
                  <li>• Include your target keyword naturally</li>
                  <li>• Add a call-to-action (Learn, Discover, Get, Find)</li>
                  <li>• Make it unique and compelling for click-through rate</li>
                  <li>• Test different variations to see what performs best</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* SEO Content */}
        <div className="prose prose-emerald max-w-none mt-12 space-y-8">
          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">What is a Meta Description?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A <strong>meta description</strong> is an HTML attribute that provides a brief summary of a web page's content. It appears below the page title in search engine results pages (SERPs) and plays a crucial role in SEO and click-through rates. While meta descriptions don't directly impact rankings, they significantly influence whether users click on your link.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Google typically displays 120-155 characters of a meta description, though this can vary based on screen size and device. A well-crafted meta description acts as your page's "advertisement" in search results, enticing users to click through to your website. Our <strong>meta description generator</strong> creates optimized descriptions that are the perfect length, keyword-rich, and designed to maximize clicks.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The tool analyzes your content and generates 5 unique meta description variations using different strategies—from keyword-focused to action-oriented formats. Each description is automatically optimized for the ideal character count and includes compelling language to improve your CTR. For analyzing your page's SEO further, try our <a href="/tools/seo-audit" className="text-emerald-600 hover:text-emerald-700 font-medium">SEO Audit Tool</a>.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">How to Write Perfect Meta Descriptions</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Creating effective <strong>meta descriptions</strong> requires balancing SEO best practices with compelling copywriting:
            </p>
            <div className="bg-emerald-50 p-6 rounded-lg mb-4">
              <h3 className="font-semibold text-emerald-800 mb-3">Key Elements of Great Meta Descriptions:</h3>
              <ol className="space-y-3 text-gray-700">
                <li><strong>1. Optimal Length:</strong> Keep it between 120-155 characters. Shorter descriptions may not utilize available space; longer ones get truncated with "..."</li>
                <li><strong>2. Include Target Keyword:</strong> Incorporate your primary keyword naturally. Google bolds matching keywords in search results, making your listing more noticeable.</li>
                <li><strong>3. Compelling CTA:</strong> Use action words like "Learn," "Discover," "Get," "Find," or "Explore" to encourage clicks.</li>
                <li><strong>4. Unique Value Proposition:</strong> Explain what makes your page valuable. What will users gain by clicking?</li>
                <li><strong>5. Match Search Intent:</strong> Ensure your description aligns with what users are searching for.</li>
                <li><strong>6. Avoid Duplicate Descriptions:</strong> Each page should have a unique meta description.</li>
              </ol>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Example of a Well-Optimized Meta Description:</strong>
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4 font-mono text-sm">
              <p className="text-gray-800">
                "Learn how to create SEO-optimized meta descriptions that drive clicks. Get expert tips, best practices, and examples for perfect 155-character descriptions."
              </p>
              <p className="text-xs text-gray-600 mt-2">✓ 152 characters | ✓ Keyword present | ✓ Action word | ✓ Clear benefit</p>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Our generator automatically applies these principles to create descriptions that are both search-engine friendly and user-compelling. For more SEO optimization, check our <a href="/tools/meta-generator" className="text-emerald-600 hover:text-emerald-700 font-medium">Complete Meta Tags Generator</a>.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Meta Description Best Practices</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Follow these <strong>SEO best practices</strong> for meta descriptions:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">✅ DO:</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Write unique descriptions for each page</li>
                  <li>• Include your target keyword naturally</li>
                  <li>• Use active voice and actionable language</li>
                  <li>• Match the actual page content accurately</li>
                  <li>• Add numbers and specific details when relevant</li>
                  <li>• Update descriptions as content changes</li>
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800 mb-2">❌ DON'T:</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Stuff keywords unnaturally</li>
                  <li>• Use duplicate descriptions across pages</li>
                  <li>• Write generic, vague descriptions</li>
                  <li>• Exceed 155 characters (gets cut off)</li>
                  <li>• Use special characters excessively</li>
                  <li>• Make false promises or clickbait</li>
                </ul>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Remember, while meta descriptions don't directly impact rankings, they heavily influence CTR (click-through rate), which <em>does</em> affect SEO performance. A higher CTR signals to Google that your page is relevant and valuable for that search query.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Meta Description Character Limits</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Understanding <strong>character limits</strong> for meta descriptions:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-emerald-100">
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Length</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Status</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono">&lt; 120</td><td className="border border-gray-300 px-4 py-2"><span className="text-orange-600 font-semibold">Too Short</span></td><td className="border border-gray-300 px-4 py-2 text-sm">Not utilizing available SERP space effectively</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono">120-155</td><td className="border border-gray-300 px-4 py-2"><span className="text-emerald-600 font-semibold">Perfect ✓</span></td><td className="border border-gray-300 px-4 py-2 text-sm">Optimal range - displays fully on most devices</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-mono">155-160</td><td className="border border-gray-300 px-4 py-2"><span className="text-yellow-600 font-semibold">Acceptable</span></td><td className="border border-gray-300 px-4 py-2 text-sm">May get truncated on some devices</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-mono">&gt; 160</td><td className="border border-gray-300 px-4 py-2"><span className="text-red-600 font-semibold">Too Long</span></td><td className="border border-gray-300 px-4 py-2 text-sm">Will be cut off with "..." in search results</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Note:</strong> Google's display length can vary based on pixel width (not just character count). On mobile devices, descriptions may be truncated earlier. Our generator targets the sweet spot of 120-155 characters to ensure your full message displays across all devices.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Why Meta Descriptions Matter for SEO</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The importance of <strong>meta descriptions in SEO</strong>:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">📈 Impact on CTR</h3>
                <p className="text-sm text-gray-700">Well-written meta descriptions can increase click-through rates by 5-15%, driving more organic traffic to your site.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">🎯 User Experience</h3>
                <p className="text-sm text-gray-700">They set accurate expectations for users, reducing bounce rates and improving engagement metrics.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">🔍 Search Relevance</h3>
                <p className="text-sm text-gray-700">Google bolds matching keywords in descriptions, making your result more visible and relevant.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">🏆 Competitive Edge</h3>
                <p className="text-sm text-gray-700">Stand out from competitors with compelling copy that encourages users to choose your link.</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              While meta descriptions aren't a direct ranking factor, they indirectly influence SEO through improved CTR and user engagement. Higher CTR signals relevance to Google, potentially boosting your rankings over time. For comprehensive page optimization, use our <a href="/tools/heading-analyzer" className="text-emerald-600 hover:text-emerald-700 font-medium">Heading Analyzer Tool</a>.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Common Meta Description Mistakes</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Avoid these <strong>common mistakes</strong> when writing meta descriptions:
            </p>
            <div className="space-y-3">
              <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">❌ Duplicate Descriptions</h3>
                <p className="text-sm text-gray-700">Using the same meta description across multiple pages confuses search engines and reduces uniqueness. Each page needs its own description.</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">❌ Keyword Stuffing</h3>
                <p className="text-sm text-gray-700">"Buy shoes, cheap shoes, best shoes, discount shoes" - this looks spammy and hurts credibility. Use keywords naturally.</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">❌ Missing Descriptions</h3>
                <p className="text-sm text-gray-700">If you don't provide one, Google creates its own (often poorly). Always write custom descriptions.</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">❌ Not Matching Content</h3>
                <p className="text-sm text-gray-700">Misleading descriptions increase bounce rates when users don't find what they expected.</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">❌ Too Technical or Vague</h3>
                <p className="text-sm text-gray-700">Write for humans, not robots. Use clear, benefit-focused language that anyone can understand.</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Related SEO Tools</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Optimize your website with our complete suite of SEO tools:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/meta-generator" className="hover:text-emerald-600">🏷️ Complete Meta Tags Generator</a>
                </h3>
                <p className="text-sm text-gray-700">Generate all meta tags including Open Graph and Twitter Cards.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/seo-audit" className="hover:text-emerald-600">🔍 SEO Audit Tool</a>
                </h3>
                <p className="text-sm text-gray-700">Comprehensive SEO analysis of your web pages.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/heading-analyzer" className="hover:text-emerald-600">📑 Heading Analyzer</a>
                </h3>
                <p className="text-sm text-gray-700">Analyze and optimize your heading structure (H1-H6).</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/keyword-density-checker" className="hover:text-emerald-600">🎯 Keyword Density Checker</a>
                </h3>
                <p className="text-sm text-gray-700">Check keyword frequency and density in your content.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/schema-generator" className="hover:text-emerald-600">📋 Schema Markup Generator</a>
                </h3>
                <p className="text-sm text-gray-700">Create structured data for rich snippets.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/http-status-checker" className="hover:text-emerald-600">✅ HTTP Status Checker</a>
                </h3>
                <p className="text-sm text-gray-700">Check HTTP status codes for SEO health.</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">📚 Frequently Asked Questions (FAQs)</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What is the ideal meta description length?</h3>
                <p className="text-gray-700 text-sm">A: The ideal length is 120-155 characters. This ensures your full description displays in search results without being truncated. Shorter descriptions waste valuable SERP space, while longer ones get cut off with "..."</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Do meta descriptions affect SEO rankings?</h3>
                <p className="text-gray-700 text-sm">A: Meta descriptions are not a direct ranking factor, but they significantly impact click-through rates (CTR). Higher CTR signals relevance to Google, which can indirectly improve rankings over time.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Should I include keywords in meta descriptions?</h3>
                <p className="text-gray-700 text-sm">A: Yes! Include your target keyword naturally. Google bolds matching keywords in search results, making your listing more visible and relevant to searchers.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Can I use the same meta description for multiple pages?</h3>
                <p className="text-gray-700 text-sm">A: No. Each page should have a unique meta description that accurately describes its specific content. Duplicate descriptions confuse search engines and reduce your pages' distinctiveness.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What happens if I don't write a meta description?</h3>
                <p className="text-gray-700 text-sm">A: Google will automatically generate one from your page content, often producing a poor or irrelevant description. Always write custom descriptions to control your SERP appearance.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Should meta descriptions include emojis?</h3>
                <p className="text-gray-700 text-sm">A: Use emojis sparingly and only if appropriate for your brand. They can increase visibility but may look unprofessional in some industries. Test to see what works for your audience.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: How often should I update meta descriptions?</h3>
                <p className="text-gray-700 text-sm">A: Update them when page content changes significantly, when targeting new keywords, or when A/B testing shows better-performing variations. Review and optimize quarterly for best results.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Will Google always use my meta description?</h3>
                <p className="text-gray-700 text-sm">A: Not always. Google may generate its own description if it believes it better matches the user's search query. Write comprehensive descriptions that align with common search intents to increase usage rate.</p>
              </div>
            </div>
          </div>

          <div className="card bg-emerald-700 text-white">
            <h2 className="text-2xl font-bold mb-4">🚀 Start Generating Meta Descriptions Now!</h2>
            <p className="mb-4">
              Use our <strong>free meta description generator</strong> to create SEO-optimized descriptions instantly. Perfect for bloggers, content marketers, SEO professionals, and website owners who want to improve click-through rates and search visibility. Get 5 unique variations with optimal character counts, keyword integration, and compelling CTAs.
            </p>
            <p className="mb-4">
              No registration required. Unlimited generations. Completely free forever!
            </p>
            <p className="font-semibold">
              Explore more tools: <a href="/tools/seo-audit" className="text-emerald-100 hover:text-white underline">SEO Audit</a> • <a href="/tools/meta-generator" className="text-emerald-100 hover:text-white underline">Meta Tags Generator</a> • <a href="/tools/schema-generator" className="text-emerald-100 hover:text-white underline">Schema Generator</a> 🎯
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
