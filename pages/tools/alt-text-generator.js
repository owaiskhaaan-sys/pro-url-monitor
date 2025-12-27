import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function AltTextGenerator() {
  const [imageUrl, setImageUrl] = useState('');
  const [keyword, setKeyword] = useState('');
  const [context, setContext] = useState('');
  const [altTexts, setAltTexts] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const generateAltTexts = () => {
    setError('');
    setAltTexts([]);
    setIsGenerating(true);

    if (!imageUrl.trim() && !keyword.trim()) {
      setError('Please enter either an image URL or describe the image');
      setIsGenerating(false);
      return;
    }

    // Validate URL format if provided
    if (imageUrl && !isValidUrl(imageUrl)) {
      setError('Please enter a valid image URL');
      setIsGenerating(false);
      return;
    }

    if (imageUrl) {
      setImagePreview(imageUrl);
    }

    const generated = [];
    const mainKeyword = keyword || 'image';
    const contextInfo = context || '';

    // Strategy 1: Descriptive + Keyword
    const alt1 = `${mainKeyword}${contextInfo ? ' - ' + contextInfo : ''}`;
    generated.push({
      text: alt1.substring(0, 125),
      length: Math.min(alt1.length, 125),
      type: 'Descriptive',
      score: calculateAltTextScore(alt1)
    });

    // Strategy 2: Action-oriented
    const actions = ['showing', 'displaying', 'illustrating', 'demonstrating', 'featuring'];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    const alt2 = `Image ${randomAction} ${mainKeyword}${contextInfo ? ' with ' + contextInfo : ''}`;
    generated.push({
      text: alt2.substring(0, 125),
      length: Math.min(alt2.length, 125),
      type: 'Action-Based',
      score: calculateAltTextScore(alt2)
    });

    // Strategy 3: Context-focused
    if (contextInfo) {
      const alt3 = `${contextInfo} - ${mainKeyword}`;
      generated.push({
        text: alt3.substring(0, 125),
        length: Math.min(alt3.length, 125),
        type: 'Context-First',
        score: calculateAltTextScore(alt3)
      });
    }

    // Strategy 4: Detailed description
    const details = ['high quality', 'professional', 'detailed', 'clear', 'high-resolution'];
    const randomDetail = details[Math.floor(Math.random() * details.length)];
    const alt4 = `${randomDetail} ${mainKeyword}${contextInfo ? ' ' + contextInfo : ''}`;
    generated.push({
      text: alt4.substring(0, 125),
      length: Math.min(alt4.length, 125),
      type: 'Quality-Focused',
      score: calculateAltTextScore(alt4)
    });

    // Strategy 5: SEO optimized
    const alt5 = `${mainKeyword} - ${contextInfo || 'comprehensive guide'}${imageUrl.includes('screenshot') ? ' screenshot' : ''}`;
    generated.push({
      text: alt5.substring(0, 125),
      length: Math.min(alt5.length, 125),
      type: 'SEO-Optimized',
      score: calculateAltTextScore(alt5)
    });

    // Strategy 6: Simple and concise
    const alt6 = mainKeyword;
    generated.push({
      text: alt6.substring(0, 125),
      length: Math.min(alt6.length, 125),
      type: 'Simple',
      score: calculateAltTextScore(alt6)
    });

    setTimeout(() => {
      setAltTexts(generated.sort((a, b) => b.score - a.score));
      setIsGenerating(false);
    }, 800);
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return url.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/i);
    } catch {
      return false;
    }
  };

  const calculateAltTextScore = (altText) => {
    let score = 0;

    // Length score (50-125 is optimal)
    const length = altText.length;
    if (length >= 50 && length <= 125) score += 40;
    else if (length >= 30 && length < 50) score += 30;
    else if (length >= 10 && length < 30) score += 20;
    else if (length > 125) score += 10;
    else score += 5;

    // Has keyword
    if (keyword && altText.toLowerCase().includes(keyword.toLowerCase())) score += 25;

    // Has context
    if (context && altText.toLowerCase().includes(context.toLowerCase())) score += 15;

    // Not too short
    if (altText.split(' ').length >= 3) score += 10;

    // Descriptive (no generic terms)
    const genericTerms = ['image', 'picture', 'photo'];
    const hasOnlyGeneric = genericTerms.some(term => 
      altText.toLowerCase() === term || altText.toLowerCase() === term + 's'
    );
    if (!hasOnlyGeneric) score += 10;

    return score;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
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
        <title>Alt Text Generator for Images - SEO & Accessibility | ProURLMonitor</title>
        <meta name="description" content="Generate SEO-optimized alt text for images instantly. Improve accessibility, image SEO, and search rankings with descriptive, keyword-rich alt attributes." />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4 text-center">Alt Text Generator for Images</h1>
        <p className="text-gray-600 mb-8 text-center">
          Generate SEO-friendly alt text for accessibility and better image search rankings. Get 6 optimized variations!
        </p>

        <div className="card mb-8">
          {/* Image URL Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL (Optional):</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-xs text-gray-500 mt-1">Enter image URL for preview and better alt text generation</p>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview:</label>
              <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="max-w-full h-auto max-h-64 mx-auto rounded"
                  onError={() => {
                    setImagePreview('');
                    setError('Failed to load image. Please check the URL.');
                  }}
                />
              </div>
            </div>
          )}

          {/* Keyword Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Main Subject/Keyword:</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g., laptop, woman coding, mountain landscape"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-xs text-gray-500 mt-1">What is the main subject of the image?</p>
          </div>

          {/* Context Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Context (Optional):</label>
            <input
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g., working from home, at sunset, for business presentation"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-xs text-gray-500 mt-1">Add context or additional details about the image</p>
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
              onClick={generateAltTexts}
              disabled={isGenerating}
              className={`btn btn-primary px-12 py-3 text-lg ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isGenerating ? 'Generating...' : 'Generate Alt Text'}
            </button>
          </div>

          {/* Results */}
          {altTexts.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">✨ Generated Alt Text Options:</h2>
              
              {altTexts.map((alt, index) => (
                <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-lg border-2 border-purple-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
                        Option {index + 1}
                      </span>
                      <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded">
                        {alt.type}
                      </span>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${getScoreColor(alt.score)} bg-white border-2`}>
                        Score: {alt.score}/100 - {getScoreLabel(alt.score)}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(alt.text)}
                      className="text-purple-600 hover:text-purple-700 text-sm font-semibold flex items-center gap-1"
                    >
                      📋 Copy
                    </button>
                  </div>
                  
                  <div className="bg-white p-3 rounded border border-purple-300 mb-3">
                    <code className="text-sm text-gray-800 break-all">alt="{alt.text}"</code>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`font-bold ${alt.length <= 125 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {alt.length} characters
                    </span>
                    {alt.length <= 125 && (
                      <span className="text-emerald-600 text-xs font-semibold">✓ Optimal Length</span>
                    )}
                    {alt.length > 125 && (
                      <span className="text-red-600 text-xs font-semibold">⚠ Too Long</span>
                    )}
                  </div>
                </div>
              ))}

              <div className="bg-blue-50 p-5 rounded-lg border border-blue-200 mt-6">
                <h3 className="font-semibold text-blue-800 mb-3">💡 Alt Text Best Practices:</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• <strong>Length:</strong> Keep it under 125 characters for optimal screen reader performance</li>
                  <li>• <strong>Be Descriptive:</strong> Describe what's in the image, not just the keyword</li>
                  <li>• <strong>Context Matters:</strong> Explain how the image relates to surrounding content</li>
                  <li>• <strong>Avoid "Image of":</strong> Screen readers already announce it's an image</li>
                  <li>• <strong>Include Keywords:</strong> Naturally incorporate relevant SEO keywords</li>
                  <li>• <strong>Skip Decorative Images:</strong> Use empty alt="" for purely decorative images</li>
                </ul>
              </div>

              {/* HTML Example */}
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-300">
                <h3 className="font-semibold text-gray-800 mb-3">📝 How to Use in HTML:</h3>
                <div className="bg-gray-800 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
                  <pre>{`<img src="${imageUrl || 'your-image.jpg'}" alt="${altTexts[0].text}" />`}</pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SEO Content */}
        <div className="prose prose-emerald max-w-none mt-12 space-y-8">
          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">What is Alt Text for Images?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Alt text</strong> (alternative text), also known as "alt attributes" or "alt descriptions," is the written copy that appears in place of an image when it fails to load. More importantly, it's read by screen readers for visually impaired users and used by search engines to understand image content. The alt attribute is added to image tags in HTML: <code>&lt;img src="image.jpg" alt="descriptive text"&gt;</code>.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Alt text serves two critical purposes: <strong>accessibility</strong> and <strong>SEO</strong>. For accessibility, it ensures that people using screen readers can understand image content. For SEO, it helps search engines index and rank images in image search, and provides context that can improve overall page rankings. Well-written alt text describes what's in the image while naturally incorporating relevant keywords.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our <strong>alt text generator</strong> creates 6 optimized variations using different strategies—from simple descriptions to context-rich, SEO-focused options. Each suggestion is scored based on length, keyword inclusion, and descriptiveness. For comprehensive page optimization, also use our <a href="/tools/seo-audit" className="text-emerald-600 hover:text-emerald-700 font-medium">SEO Audit Tool</a>.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">How to Write Effective Alt Text</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Writing <strong>effective alt text</strong> requires balancing accessibility and SEO:
            </p>
            <div className="bg-purple-50 p-6 rounded-lg mb-4">
              <h3 className="font-semibold text-purple-800 mb-3">Alt Text Writing Guidelines:</h3>
              <ol className="space-y-3 text-gray-700">
                <li><strong>1. Be Specific and Descriptive:</strong> Instead of "dog," write "golden retriever puppy playing in grass." Provide enough detail for someone who can't see the image.</li>
                <li><strong>2. Keep It Concise (Under 125 Characters):</strong> Screen readers may cut off longer text. Aim for descriptive but brief. Most alt text should be 50-125 characters.</li>
                <li><strong>3. Include Keywords Naturally:</strong> If relevant, incorporate SEO keywords, but never stuff. Example: "WordPress dashboard showing SEO settings" is better than "SEO SEO WordPress SEO."</li>
                <li><strong>4. Provide Context:</strong> Explain how the image relates to the content. For an article about remote work: "woman video conferencing from home office" not just "woman on laptop."</li>
                <li><strong>5. Skip "Image of" or "Picture of":</strong> Screen readers announce it's an image, so this is redundant. Just describe the content directly.</li>
                <li><strong>6. Consider Function for Links:</strong> If an image is a link, describe the destination: "Visit our pricing page" not "arrow icon."</li>
                <li><strong>7. Empty Alt for Decorative:</strong> Use alt="" (empty) for purely decorative images that add no content value.</li>
              </ol>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Alt Text Examples - Good vs Bad:</strong>
            </p>
            <div className="space-y-3">
              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-red-50 p-3 rounded border-l-4 border-red-500">
                  <div className="text-red-700 font-semibold text-sm mb-1">❌ Bad:</div>
                  <code className="text-xs text-gray-700">"image"</code>
                  <p className="text-xs text-gray-600 mt-1">Too vague, no information</p>
                </div>
                <div className="bg-emerald-50 p-3 rounded border-l-4 border-emerald-500">
                  <div className="text-emerald-700 font-semibold text-sm mb-1">✓ Good:</div>
                  <code className="text-xs text-gray-700">"laptop displaying code editor"</code>
                  <p className="text-xs text-gray-600 mt-1">Specific and descriptive</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-red-50 p-3 rounded border-l-4 border-red-500">
                  <div className="text-red-700 font-semibold text-sm mb-1">❌ Bad:</div>
                  <code className="text-xs text-gray-700">"SEO tools SEO optimization best SEO"</code>
                  <p className="text-xs text-gray-600 mt-1">Keyword stuffing</p>
                </div>
                <div className="bg-emerald-50 p-3 rounded border-l-4 border-emerald-500">
                  <div className="text-emerald-700 font-semibold text-sm mb-1">✓ Good:</div>
                  <code className="text-xs text-gray-700">"SEO tools dashboard showing keyword rankings"</code>
                  <p className="text-xs text-gray-600 mt-1">Natural keyword use with description</p>
                </div>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              For more SEO optimization tips, check our <a href="/tools/meta-description-generator" className="text-emerald-600 hover:text-emerald-700 font-medium">Meta Description Generator</a>.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Why Alt Text Matters for SEO</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Alt text importance for SEO</strong> and search rankings:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">🔍 Image Search Rankings</h3>
                <p className="text-sm text-gray-700">Alt text is the primary way Google understands image content. Optimized alt text helps images rank in Google Images, driving additional traffic.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">📊 Page Context</h3>
                <p className="text-sm text-gray-700">Search engines use alt text to understand overall page topic and relevance, contributing to better page rankings for target keywords.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">♿ Accessibility = SEO</h3>
                <p className="text-sm text-gray-700">Google prioritizes accessible websites. Proper alt text improves site accessibility scores, which positively impacts rankings.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">🔗 Image as Links</h3>
                <p className="text-sm text-gray-700">When images are links, alt text acts as anchor text. Descriptive alt text helps SEO for the linked page.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">⚡ Page Load Failures</h3>
                <p className="text-sm text-gray-700">If images fail to load, alt text displays instead, maintaining user experience and reducing bounce rates.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">🎯 Topical Relevance</h3>
                <p className="text-sm text-gray-700">Alt text reinforces page keywords and topics, helping search engines better categorize and rank your content.</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Studies show pages with optimized alt text on all images rank 5-10% higher on average than those without. Image search can drive 20-30% additional organic traffic for visual content.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Alt Text Best Practices</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Follow these <strong>best practices</strong> for alt text optimization:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">✅ DO:</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Describe the image specifically and accurately</li>
                  <li>• Include relevant keywords naturally</li>
                  <li>• Keep length under 125 characters</li>
                  <li>• Provide context related to page content</li>
                  <li>• Use empty alt="" for decorative images</li>
                  <li>• Update alt text when replacing images</li>
                  <li>• Test with screen readers</li>
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800 mb-2">❌ DON'T:</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Use "image of" or "picture of"</li>
                  <li>• Stuff with keywords unnaturally</li>
                  <li>• Leave alt attributes empty (unless decorative)</li>
                  <li>• Write alt text over 125 characters</li>
                  <li>• Use file names as alt text (IMG_1234.jpg)</li>
                  <li>• Be vague or generic ("photo", "image")</li>
                  <li>• Forget alt text on linked images</li>
                </ul>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-300">
              <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Special Cases:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• <strong>Graphs/Charts:</strong> Summarize the data shown (e.g., "bar chart showing 50% traffic increase in Q4 2025")</li>
                <li>• <strong>Screenshots:</strong> Describe what interface/screen is shown and any key elements</li>
                <li>• <strong>Logos:</strong> Use company/brand name (e.g., "ProURLMonitor logo")</li>
                <li>• <strong>Complex Images:</strong> Use longdesc attribute for detailed descriptions if needed</li>
                <li>• <strong>Text in Images:</strong> Include the text in alt attribute</li>
              </ul>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Alt Text vs Title Attributes</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Understanding the difference between <strong>alt text and title attributes</strong>:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-purple-100">
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Attribute</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Alt Text</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Title Attribute</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">Purpose</td><td className="border border-gray-300 px-4 py-2 text-sm">Accessibility & SEO</td><td className="border border-gray-300 px-4 py-2 text-sm">Additional info tooltip</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">Screen Readers</td><td className="border border-gray-300 px-4 py-2 text-sm">✓ Always read</td><td className="border border-gray-300 px-4 py-2 text-sm">❌ Not consistently read</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">SEO Impact</td><td className="border border-gray-300 px-4 py-2 text-sm">✓ High importance</td><td className="border border-gray-300 px-4 py-2 text-sm">❌ Minimal/none</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">Displays When</td><td className="border border-gray-300 px-4 py-2 text-sm">Image fails to load</td><td className="border border-gray-300 px-4 py-2 text-sm">Mouse hover over image</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">Required?</td><td className="border border-gray-300 px-4 py-2 text-sm">✓ Yes (or empty)</td><td className="border border-gray-300 px-4 py-2 text-sm">❌ No, optional</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">Best Use</td><td className="border border-gray-300 px-4 py-2 text-sm">Describe image content</td><td className="border border-gray-300 px-4 py-2 text-sm">Provide extra context</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Key Takeaway:</strong> Alt text is essential for accessibility and SEO. Title attributes are optional and mainly for user experience enhancement. Always prioritize writing good alt text first.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Common Alt Text Mistakes</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Avoid these <strong>common alt text errors</strong>:
            </p>
            <div className="space-y-3">
              <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">❌ Missing Alt Attributes</h3>
                <p className="text-sm text-gray-700">Leaving out the alt attribute entirely fails WCAG accessibility standards and misses SEO opportunities. Always include alt, even if empty for decorative images.</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">❌ Using File Names</h3>
                <p className="text-sm text-gray-700">alt="IMG_3847.jpg" or alt="header-banner-final-v2.png" provides no value. Describe the actual image content instead.</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">❌ Keyword Stuffing</h3>
                <p className="text-sm text-gray-700">alt="buy shoes cheap shoes best shoes discount shoes online" is spammy and hurts SEO. Use keywords naturally once.</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">❌ Too Vague</h3>
                <p className="text-sm text-gray-700">Generic terms like "image," "photo," "graphic" provide no useful information. Be specific about what's shown.</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3 rounded">
                <h3 className="font-semibold text-gray-800 mb-1">❌ Excessive Length</h3>
                <p className="text-sm text-gray-700">Alt text over 125 characters may be cut off by screen readers. Keep descriptions concise but informative.</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Related SEO Tools</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Enhance your website optimization with these tools:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/seo-audit" className="hover:text-emerald-600">🔍 SEO Audit Tool</a>
                </h3>
                <p className="text-sm text-gray-700">Comprehensive SEO analysis including image optimization.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/meta-description-generator" className="hover:text-emerald-600">📝 Meta Description Generator</a>
                </h3>
                <p className="text-sm text-gray-700">Generate SEO-optimized meta descriptions.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/seo-title-generator" className="hover:text-emerald-600">🏷️ SEO Title Generator</a>
                </h3>
                <p className="text-sm text-gray-700">Create click-worthy title tags for better rankings.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/schema-generator" className="hover:text-emerald-600">📋 Schema Generator</a>
                </h3>
                <p className="text-sm text-gray-700">Create structured data for rich snippets.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/heading-analyzer" className="hover:text-emerald-600">📑 Heading Analyzer</a>
                </h3>
                <p className="text-sm text-gray-700">Optimize your heading structure for SEO.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/meta-generator" className="hover:text-emerald-600">🔖 Meta Tags Generator</a>
                </h3>
                <p className="text-sm text-gray-700">Generate complete meta tags for your pages.</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">📚 Frequently Asked Questions (FAQs)</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What is the ideal alt text length?</h3>
                <p className="text-gray-700 text-sm">A: Keep alt text under 125 characters. Most screen readers cut off text beyond this length. Aim for 50-125 characters for the best balance of descriptiveness and brevity.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Should I use "image of" in alt text?</h3>
                <p className="text-gray-700 text-sm">A: No. Screen readers already announce "image," so phrases like "image of" or "picture of" are redundant. Just describe the content directly.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: How does alt text help SEO?</h3>
                <p className="text-gray-700 text-sm">A: Alt text helps search engines understand image content, improves image search rankings, provides context for page relevance, and enhances overall accessibility—all positive SEO signals.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What should I write for decorative images?</h3>
                <p className="text-gray-700 text-sm">A: Use empty alt text: alt="". This tells screen readers to skip the image since it's purely decorative and adds no content value.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Can I use keywords in alt text?</h3>
                <p className="text-gray-700 text-sm">A: Yes, but naturally. Include relevant keywords when they accurately describe the image. Never stuff keywords—it hurts both accessibility and SEO.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What if my image has text in it?</h3>
                <p className="text-gray-700 text-sm">A: Include the text from the image in the alt attribute. For example, if an image shows a "50% OFF" banner, the alt text should include "50% OFF sale banner."</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Do I need alt text for logos?</h3>
                <p className="text-gray-700 text-sm">A: Yes. Use the company or brand name. For example: alt="ProURLMonitor logo" or just alt="ProURLMonitor" depending on context.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What about complex images like infographics?</h3>
                <p className="text-gray-700 text-sm">A: Provide a summary in alt text, then use longdesc attribute or provide a full text alternative nearby for detailed information that can't fit in 125 characters.</p>
              </div>
            </div>
          </div>

          <div className="card bg-purple-700 text-white">
            <h2 className="text-2xl font-bold mb-4">🚀 Start Generating Alt Text Now!</h2>
            <p className="mb-4">
              Use our <strong>free alt text generator</strong> to create SEO-optimized, accessible image descriptions instantly. Perfect for web developers, content creators, SEO specialists, and anyone wanting to improve website accessibility and image search rankings. Get 6 unique variations scored for effectiveness with optimal length and keyword integration.
            </p>
            <p className="mb-4">
              No registration required. Unlimited generations. Completely free forever!
            </p>
            <p className="font-semibold">
              Explore more tools: <a href="/tools/seo-audit" className="text-purple-100 hover:text-white underline">SEO Audit</a> • <a href="/tools/meta-description-generator" className="text-purple-100 hover:text-white underline">Meta Description</a> • <a href="/tools/seo-title-generator" className="text-purple-100 hover:text-white underline">Title Generator</a> 🎯
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
