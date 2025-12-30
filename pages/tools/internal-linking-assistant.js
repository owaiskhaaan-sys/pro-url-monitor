import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function InternalLinkingAssistant() {
  const [content, setContent] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeContent = () => {
    if (!content.trim()) {
      alert('Please enter your content');
      return;
    }

    setIsAnalyzing(true);

    // Analyze content for linking opportunities
    const linkableKeywords = findLinkableKeywords(content);
    const anchorTextSuggestions = generateAnchorTextSuggestions(content);
    const internalLinkOpportunities = identifyLinkOpportunities(content, linkableKeywords);
    const existingLinks = extractExistingLinks(content);
    const linkDensity = calculateLinkDensity(content, existingLinks.length);
    const orphanedKeywords = findOrphanedKeywords(content, existingLinks);
    const contextualSuggestions = generateContextualSuggestions(content);
    const linkDistribution = analyzeLinkDistribution(content, existingLinks);

    setTimeout(() => {
      setResults({
        linkableKeywords,
        anchorTextSuggestions,
        internalLinkOpportunities,
        existingLinks,
        linkDensity,
        orphanedKeywords,
        contextualSuggestions,
        linkDistribution,
        totalOpportunities: internalLinkOpportunities.length
      });
      setIsAnalyzing(false);
    }, 1000);
  };

  const findLinkableKeywords = (text) => {
    const commonTopics = {
      'seo': ['search engine optimization', 'organic traffic', 'keyword research', 'backlinks', 'meta tags', 'seo strategy', 'seo tools', 'on-page seo', 'technical seo'],
      'content': ['content marketing', 'blog posts', 'content strategy', 'quality content', 'content creation', 'editorial calendar', 'content optimization'],
      'marketing': ['digital marketing', 'email marketing', 'social media marketing', 'marketing strategy', 'lead generation', 'conversion optimization'],
      'website': ['website design', 'web development', 'user experience', 'website speed', 'mobile optimization', 'responsive design', 'landing pages'],
      'analytics': ['google analytics', 'traffic analysis', 'conversion tracking', 'user behavior', 'bounce rate', 'performance metrics']
    };

    const linkable = [];
    const lowerText = text.toLowerCase();

    for (let category in commonTopics) {
      for (let keyword of commonTopics[category]) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = lowerText.match(regex);
        if (matches) {
          linkable.push({
            keyword: keyword,
            category: category,
            occurrences: matches.length,
            priority: matches.length > 2 ? 'High' : matches.length > 1 ? 'Medium' : 'Low',
            suggestedUrl: generateSuggestedUrl(keyword)
          });
        }
      }
    }

    // Generic important keywords
    const importantPatterns = [
      'guide', 'tutorial', 'tips', 'strategies', 'best practices', 
      'how to', 'step by step', 'checklist', 'tools', 'examples'
    ];

    importantPatterns.forEach(pattern => {
      const regex = new RegExp(`\\b${pattern}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches && matches.length > 0) {
        linkable.push({
          keyword: pattern,
          category: 'general',
          occurrences: matches.length,
          priority: 'Medium',
          suggestedUrl: generateSuggestedUrl(pattern)
        });
      }
    });

    return linkable.sort((a, b) => b.occurrences - a.occurrences).slice(0, 15);
  };

  const generateSuggestedUrl = (keyword) => {
    const slug = keyword.toLowerCase().replace(/\s+/g, '-');
    return siteUrl ? `${siteUrl}/${slug}` : `/blog/${slug}`;
  };

  const generateAnchorTextSuggestions = (text) => {
    const suggestions = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

    const anchorTypes = [
      {
        type: 'Exact Match',
        description: 'Use the exact keyword as anchor text',
        example: 'SEO strategy',
        strength: 'High relevance but use sparingly',
        color: 'blue'
      },
      {
        type: 'Partial Match',
        description: 'Include keyword with additional words',
        example: 'comprehensive SEO strategy guide',
        strength: 'Natural and effective',
        color: 'green'
      },
      {
        type: 'Branded',
        description: 'Use your brand name',
        example: 'ProURLMonitor SEO tools',
        strength: 'Builds brand authority',
        color: 'purple'
      },
      {
        type: 'Naked URL',
        description: 'Use the actual URL',
        example: 'https://example.com/seo-guide',
        strength: 'Less impactful but natural',
        color: 'gray'
      },
      {
        type: 'Generic',
        description: 'Generic call-to-action phrases',
        example: 'click here, learn more, read this',
        strength: 'Use occasionally, not ideal for SEO',
        color: 'yellow'
      },
      {
        type: 'LSI Keywords',
        description: 'Semantically related terms',
        example: 'search rankings optimization',
        strength: 'Excellent for natural linking',
        color: 'emerald'
      }
    ];

    return anchorTypes;
  };

  const identifyLinkOpportunities = (text, linkableKeywords) => {
    const opportunities = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);

    linkableKeywords.slice(0, 10).forEach(keyword => {
      const regex = new RegExp(`([^.!?]*\\b${keyword.keyword}\\b[^.!?]*)`, 'gi');
      const matches = text.match(regex);

      if (matches) {
        matches.slice(0, 2).forEach((match, idx) => {
          opportunities.push({
            keyword: keyword.keyword,
            context: match.trim().substring(0, 150) + '...',
            suggestedUrl: keyword.suggestedUrl,
            anchorText: keyword.keyword,
            priority: keyword.priority,
            reason: `Found "${keyword.keyword}" mentioned ${keyword.occurrences} times`,
            position: idx === 0 ? 'First mention' : 'Repeated mention'
          });
        });
      }
    });

    return opportunities.slice(0, 12);
  };

  const extractExistingLinks = (text) => {
    const links = [];
    
    // Match markdown links [text](url)
    const markdownRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    while ((match = markdownRegex.exec(text)) !== null) {
      links.push({
        anchorText: match[1],
        url: match[2],
        type: 'Markdown',
        quality: evaluateLinkQuality(match[1], match[2])
      });
    }

    // Match HTML links
    const htmlRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi;
    while ((match = htmlRegex.exec(text)) !== null) {
      links.push({
        anchorText: match[2],
        url: match[1],
        type: 'HTML',
        quality: evaluateLinkQuality(match[2], match[1])
      });
    }

    return links;
  };

  const evaluateLinkQuality = (anchorText, url) => {
    const genericAnchors = ['click here', 'read more', 'this', 'here', 'link'];
    const isGeneric = genericAnchors.some(generic => anchorText.toLowerCase().includes(generic));
    
    if (isGeneric) return { score: 40, rating: 'Poor', issue: 'Generic anchor text' };
    if (anchorText.length < 3) return { score: 50, rating: 'Fair', issue: 'Too short' };
    if (anchorText.length > 60) return { score: 60, rating: 'Fair', issue: 'Too long' };
    if (url.startsWith('http') && !url.includes(siteUrl || 'example.com')) 
      return { score: 70, rating: 'Good', issue: 'External link' };
    
    return { score: 90, rating: 'Excellent', issue: 'None' };
  };

  const calculateLinkDensity = (text, linkCount) => {
    const words = text.split(/\s+/).length;
    const density = ((linkCount / words) * 100).toFixed(2);
    
    let status = 'Optimal';
    let recommendation = 'Perfect link density for SEO';
    let color = 'green';
    
    if (density < 1) {
      status = 'Too Low';
      recommendation = 'Add more internal links (aim for 2-3%)';
      color = 'yellow';
    } else if (density > 5) {
      status = 'Too High';
      recommendation = 'Reduce links to avoid over-optimization';
      color = 'red';
    }
    
    return {
      density: parseFloat(density),
      linkCount,
      wordCount: words,
      status,
      recommendation,
      color
    };
  };

  const findOrphanedKeywords = (text, existingLinks) => {
    const linkedKeywords = existingLinks.map(link => link.anchorText.toLowerCase());
    const orphaned = [];
    
    const importantKeywords = [
      'guide', 'tutorial', 'best practices', 'tips', 'strategies',
      'how to', 'examples', 'checklist', 'tools', 'resources'
    ];
    
    importantKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = text.toLowerCase().match(regex);
      const isLinked = linkedKeywords.some(anchor => anchor.includes(keyword));
      
      if (matches && !isLinked) {
        orphaned.push({
          keyword: keyword,
          occurrences: matches.length,
          opportunity: 'High - frequently mentioned but not linked'
        });
      }
    });
    
    return orphaned;
  };

  const generateContextualSuggestions = (text) => {
    const suggestions = [];
    
    // Analyze content type
    const hasHowTo = /how to/gi.test(text);
    const hasGuide = /guide|tutorial/gi.test(text);
    const hasTips = /tips|strategies/gi.test(text);
    const hasExamples = /example|case study/gi.test(text);
    
    if (hasHowTo) {
      suggestions.push({
        title: 'Link to Related Tutorials',
        description: 'Your content includes "how-to" sections. Link to step-by-step guides.',
        pages: ['Beginner guides', 'Advanced tutorials', 'Quick start guides'],
        priority: 'High'
      });
    }
    
    if (hasGuide) {
      suggestions.push({
        title: 'Link to Comprehensive Resources',
        description: 'Guide content benefits from linking to detailed resource pages.',
        pages: ['Complete guides', 'Reference documentation', 'Best practices'],
        priority: 'High'
      });
    }
    
    if (hasTips) {
      suggestions.push({
        title: 'Link to Strategy Pages',
        description: 'Tips and strategies should link to in-depth strategy articles.',
        pages: ['Strategy guides', 'Implementation plans', 'Success stories'],
        priority: 'Medium'
      });
    }
    
    if (hasExamples) {
      suggestions.push({
        title: 'Link to Case Studies',
        description: 'Example-based content pairs well with detailed case studies.',
        pages: ['Case studies', 'Real-world examples', 'Success metrics'],
        priority: 'Medium'
      });
    }
    
    // General suggestions
    suggestions.push({
      title: 'Link to Your Homepage',
      description: 'Every page should link back to homepage for better navigation.',
      pages: ['Homepage', 'About page', 'Contact page'],
      priority: 'Low'
    });
    
    suggestions.push({
      title: 'Link to Related Tools',
      description: 'If you mention tools or features, link to your tool pages.',
      pages: ['SEO tools', 'Calculators', 'Analyzers', 'Generators'],
      priority: 'High'
    });
    
    return suggestions;
  };

  const analyzeLinkDistribution = (text, existingLinks) => {
    const totalLength = text.length;
    const thirds = totalLength / 3;
    
    const distribution = {
      top: 0,
      middle: 0,
      bottom: 0
    };
    
    existingLinks.forEach(link => {
      const position = text.indexOf(link.anchorText);
      if (position < thirds) distribution.top++;
      else if (position < thirds * 2) distribution.middle++;
      else distribution.bottom++;
    });
    
    let recommendation = '';
    if (distribution.top === 0) recommendation = 'Add links in the first paragraph for better engagement';
    else if (distribution.middle === 0) recommendation = 'Distribute links throughout the content';
    else if (distribution.bottom === 0) recommendation = 'Add links near the end for related content';
    else recommendation = 'Good link distribution across the content';
    
    return {
      top: distribution.top,
      middle: distribution.middle,
      bottom: distribution.bottom,
      total: existingLinks.length,
      recommendation
    };
  };

  const loadSampleContent = () => {
    const sample = `Search engine optimization (SEO) is crucial for improving your website's visibility. A comprehensive SEO strategy includes on-page optimization, technical SEO, and content marketing.

When developing your SEO strategy, focus on keyword research to identify terms your target audience searches for. Use tools like keyword planners and analytics to understand search intent.

Content marketing plays a vital role in SEO. Create quality content that provides value to readers. Blog posts, guides, and tutorials help establish your expertise.

Technical SEO ensures search engines can crawl and index your website effectively. Optimize site speed, fix broken links, and implement proper URL structure.

Backlinks from authoritative websites boost your domain authority. Build relationships and create link-worthy content to earn natural backlinks.

Don't forget about user experience. Mobile optimization and fast loading times keep visitors engaged and reduce bounce rate.

Regular SEO audits help identify issues and opportunities for improvement. Monitor your organic traffic and search rankings to measure success.`;
    
    setContent(sample);
    setSiteUrl('https://www.prourlmonitor.com');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 border-red-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Low': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getQualityColor = (rating) => {
    switch (rating) {
      case 'Excellent': return 'text-green-600';
      case 'Good': return 'text-blue-600';
      case 'Fair': return 'text-yellow-600';
      case 'Poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Layout>
      <Head>
        <title>Internal Linking Assistant - Smart Link Suggestions | ProURLMonitor</title>
        <meta name="description" content="Optimize internal linking strategy with AI-powered suggestions. Find link opportunities, analyze anchor text, check link density, and improve site structure." />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/internal-linking-assistant" />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4 text-center">Internal Linking Assistant</h1>
        <p className="text-gray-600 mb-8 text-center">
          Get smart internal linking suggestions to improve your site structure and SEO!
        </p>

        <div className="card mb-8">
          {/* Site URL Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Website URL (Optional):</label>
            <input
              type="text"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              placeholder="https://www.yourwebsite.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-xs text-gray-500 mt-1">Used to generate more accurate internal link suggestions</p>
          </div>

          {/* Content Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Content:</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your article or blog post content here..."
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">{content.split(/\s+/).filter(w => w).length} words</p>
              <button
                onClick={loadSampleContent}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Load Sample Content
              </button>
            </div>
          </div>

          {/* Analyze Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={analyzeContent}
              disabled={isAnalyzing}
              className={`btn btn-primary px-12 py-3 text-lg ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Internal Links'}
            </button>
          </div>

          {/* Results */}
          {results && (
            <div className="space-y-6">
              {/* Overview */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">📊 Internal Linking Analysis</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-500 bg-opacity-50 p-4 rounded">
                    <div className="text-3xl font-bold">{results.totalOpportunities}</div>
                    <div className="text-sm">Link Opportunities</div>
                  </div>
                  <div className="bg-blue-500 bg-opacity-50 p-4 rounded">
                    <div className="text-3xl font-bold">{results.linkableKeywords.length}</div>
                    <div className="text-sm">Linkable Keywords</div>
                  </div>
                  <div className="bg-blue-500 bg-opacity-50 p-4 rounded">
                    <div className="text-3xl font-bold">{results.existingLinks.length}</div>
                    <div className="text-sm">Existing Links</div>
                  </div>
                  <div className="bg-blue-500 bg-opacity-50 p-4 rounded">
                    <div className="text-3xl font-bold">{results.linkDensity.density}%</div>
                    <div className="text-sm">Link Density</div>
                  </div>
                </div>
              </div>

              {/* Link Density Analysis */}
              <div className={`bg-gradient-to-r ${results.linkDensity.color === 'green' ? 'from-green-50 to-emerald-50 border-green-200' : results.linkDensity.color === 'yellow' ? 'from-yellow-50 to-orange-50 border-yellow-200' : 'from-red-50 to-pink-50 border-red-200'} p-6 rounded-lg border-2`}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">📈 Link Density Analysis</h2>
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="text-sm text-gray-600">Current Density</div>
                      <div className="text-3xl font-bold text-gray-800">{results.linkDensity.density}%</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Status</div>
                      <div className={`text-xl font-bold ${results.linkDensity.color === 'green' ? 'text-green-600' : results.linkDensity.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`}>
                        {results.linkDensity.status}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-200 rounded-full h-4 mb-3">
                    <div 
                      className={`h-4 rounded-full ${results.linkDensity.color === 'green' ? 'bg-green-500' : results.linkDensity.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{width: `${Math.min(results.linkDensity.density * 20, 100)}%`}}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-700">
                    <strong>💡 Recommendation:</strong> {results.linkDensity.recommendation}
                  </p>
                  <div className="grid grid-cols-3 gap-4 mt-4 text-center text-xs">
                    <div>
                      <div className="text-gray-500">Links</div>
                      <div className="font-bold">{results.linkDensity.linkCount}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Words</div>
                      <div className="font-bold">{results.linkDensity.wordCount}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Ideal Range</div>
                      <div className="font-bold">2-4%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Link Opportunities */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-2 border-purple-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 Internal Link Opportunities</h2>
                <p className="text-sm text-gray-600 mb-4">Smart suggestions based on your content analysis</p>
                <div className="space-y-3">
                  {results.internalLinkOpportunities.map((opp, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(opp.priority)} border`}>
                            {opp.priority} Priority
                          </span>
                          <span className="ml-2 text-xs text-gray-500">{opp.position}</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(`[${opp.anchorText}](${opp.suggestedUrl})`)}
                          className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                        >
                          📋 Copy
                        </button>
                      </div>
                      <div className="mb-2">
                        <strong className="text-gray-800">Keyword:</strong> {opp.keyword}
                      </div>
                      <div className="mb-2">
                        <strong className="text-gray-800">Suggested Link:</strong>
                        <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">{opp.suggestedUrl}</code>
                      </div>
                      <div className="mb-2">
                        <strong className="text-gray-800">Context:</strong>
                        <p className="text-sm text-gray-600 mt-1 italic">"{opp.context}"</p>
                      </div>
                      <div className="text-xs text-gray-500">
                        💡 {opp.reason}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Linkable Keywords */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-lg border-2 border-emerald-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">🔗 Linkable Keywords</h2>
                <p className="text-sm text-gray-600 mb-4">Keywords in your content that should be linked to relevant pages</p>
                <div className="grid md:grid-cols-2 gap-3">
                  {results.linkableKeywords.map((kw, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold text-gray-800">{kw.keyword}</div>
                          <div className="text-xs text-gray-500 capitalize">{kw.category} topic</div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(kw.priority)}`}>
                          {kw.priority}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Mentioned <strong>{kw.occurrences}</strong> {kw.occurrences === 1 ? 'time' : 'times'}
                      </div>
                      <div className="text-xs text-gray-500">
                        Suggested: <code className="bg-gray-100 px-1 rounded">{kw.suggestedUrl}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Anchor Text Best Practices */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">⚓ Anchor Text Best Practices</h2>
                <div className="space-y-3">
                  {results.anchorTextSuggestions.map((suggestion, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className={`w-3 h-3 rounded-full bg-${suggestion.color}-500 mt-1`}></div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">{suggestion.type}</h3>
                          <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <span className="bg-gray-100 px-2 py-1 rounded">
                              <strong>Example:</strong> {suggestion.example}
                            </span>
                            <span className="bg-blue-50 px-2 py-1 rounded text-blue-700">
                              {suggestion.strength}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Existing Links Analysis */}
              {results.existingLinks.length > 0 && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border-2 border-yellow-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">🔍 Existing Links Analysis</h2>
                  <div className="space-y-3">
                    {results.existingLinks.map((link, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <strong className="text-gray-800">Anchor Text:</strong> {link.anchorText}
                          </div>
                          <span className={`font-bold ${getQualityColor(link.quality.rating)}`}>
                            {link.quality.score}/100
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-1">
                          <strong>URL:</strong> <code className="bg-gray-100 px-1 rounded text-xs">{link.url}</code>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className={`${getQualityColor(link.quality.rating)} font-semibold`}>
                            {link.quality.rating}
                          </span>
                          {link.quality.issue !== 'None' && (
                            <span className="text-gray-500">Issue: {link.quality.issue}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Orphaned Keywords */}
              {results.orphanedKeywords.length > 0 && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-lg border-2 border-red-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">⚠️ Orphaned Keywords</h2>
                  <p className="text-sm text-gray-600 mb-4">Important keywords mentioned but not linked - missed opportunities!</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {results.orphanedKeywords.map((kw, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
                        <div className="font-semibold text-gray-800 mb-1">{kw.keyword}</div>
                        <div className="text-sm text-gray-600 mb-1">
                          Mentioned {kw.occurrences} {kw.occurrences === 1 ? 'time' : 'times'}
                        </div>
                        <div className="text-xs text-red-600">
                          💡 {kw.opportunity}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Link Distribution */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border-2 border-indigo-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">📍 Link Distribution</h2>
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-indigo-600">{results.linkDistribution.top}</div>
                      <div className="text-sm text-gray-600">Top Third</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">{results.linkDistribution.middle}</div>
                      <div className="text-sm text-gray-600">Middle Third</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-pink-600">{results.linkDistribution.bottom}</div>
                      <div className="text-sm text-gray-600">Bottom Third</div>
                    </div>
                  </div>
                  <div className="bg-indigo-100 p-4 rounded-lg">
                    <p className="text-sm text-indigo-800">
                      <strong>💡 Recommendation:</strong> {results.linkDistribution.recommendation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contextual Suggestions */}
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-lg border-2 border-teal-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">💡 Contextual Link Suggestions</h2>
                <div className="space-y-3">
                  {results.contextualSuggestions.map((suggestion, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-800">{suggestion.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(suggestion.priority)}`}>
                          {suggestion.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestion.pages.map((page, pIdx) => (
                          <span key={pIdx} className="bg-teal-100 text-teal-700 px-2 py-1 rounded text-xs">
                            {page}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Plan */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-3">✨ Implementation Checklist</h2>
                <div className="space-y-2 text-sm">
                  <p>✓ Add {results.totalOpportunities} internal links to your content</p>
                  <p>✓ Link orphaned keywords ({results.orphanedKeywords.length} found)</p>
                  <p>✓ Improve {results.existingLinks.filter(l => l.quality.score < 70).length} low-quality anchor texts</p>
                  <p>✓ Maintain link density between 2-4% (currently {results.linkDensity.density}%)</p>
                  <p>✓ Distribute links evenly throughout content</p>
                  <p>✓ Use varied anchor text types for natural linking</p>
                  <p className="font-semibold mt-4">🎯 Pro Tip: Start by adding high-priority links first, then work through medium and low priority opportunities.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SEO Content */}
        <div className="prose prose-emerald max-w-none mt-12 space-y-8">
          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">What is Internal Linking?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Internal linking</strong> is the practice of linking from one page on your website to another page on the same domain. These links help users navigate your site, establish site architecture and hierarchy, and distribute page authority (link equity) throughout your site. Internal links are one of the most important on-page SEO factors you can control.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Why internal linking matters:</strong> Search engines use internal links to discover new pages, understand relationships between content, determine which pages are most important, and distribute ranking power across your site. A well-planned internal linking strategy can significantly boost your SEO performance without any external promotion.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our <strong>Internal Linking Assistant</strong> analyzes your content and provides smart suggestions for internal links based on keyword mentions, context, and best practices. It identifies linkable keywords, suggests anchor text variations, calculates link density, and helps you build a strong internal linking structure. For comprehensive SEO analysis, also use our <a href="/tools/seo-audit" className="text-emerald-600 hover:text-emerald-700 font-medium">SEO Audit</a> tool.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Benefits of Strategic Internal Linking</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">🚀 Improved Rankings</h3>
                <p className="text-sm text-gray-700">Internal links pass authority between pages, helping important pages rank higher in search results.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">🔍 Better Crawlability</h3>
                <p className="text-sm text-gray-700">Search engine bots discover and index more pages when you have a strong internal linking structure.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">👤 Enhanced User Experience</h3>
                <p className="text-sm text-gray-700">Visitors find related content easily, leading to longer sessions and lower bounce rates.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">📊 Authority Distribution</h3>
                <p className="text-sm text-gray-700">Spread link equity from high-authority pages to newer or less-visible pages.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">🎯 Conversion Boost</h3>
                <p className="text-sm text-gray-700">Guide users toward conversion pages through strategic internal linking.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">📈 Topical Relevance</h3>
                <p className="text-sm text-gray-700">Linking related content signals topical expertise to search engines.</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Studies show websites with strategic internal linking see 40% more organic traffic on average. Pages with 3-5 relevant internal links pointing to them rank 25% higher than pages with no internal links.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Internal Linking Best Practices</h2>
            <div className="bg-emerald-50 p-6 rounded-lg mb-4">
              <h3 className="font-semibold text-emerald-800 mb-3">✅ Internal Linking Strategy:</h3>
              <ol className="space-y-3 text-gray-700">
                <li><strong>1. Link from High-Authority Pages:</strong> Identify your highest-ranking pages and add internal links from them to pages you want to boost. Authority flows through internal links.</li>
                <li><strong>2. Use Descriptive Anchor Text:</strong> Avoid generic phrases like "click here." Use keyword-rich, descriptive anchor text that tells users what to expect. Example: "SEO strategy guide" instead of "read more."</li>
                <li><strong>3. Link Early in Content:</strong> Add important internal links in the first 100 words for better visibility. Users and search engines pay more attention to early content.</li>
                <li><strong>4. Maintain Optimal Link Density:</strong> Aim for 2-4% link density (2-4 links per 100 words). Too few wastes opportunities; too many appears spammy.</li>
                <li><strong>5. Link to Deep Pages:</strong> Don't just link to your homepage. Deep link to specific category pages, blog posts, and product pages for better distribution.</li>
                <li><strong>6. Create Content Hubs:</strong> Build pillar pages with comprehensive content and link to related cluster content. This establishes topical authority.</li>
                <li><strong>7. Fix Broken Internal Links:</strong> Regularly audit and fix broken links. Use our <a href="/tools/broken-links-checker" className="text-emerald-600 hover:text-emerald-700 font-medium">Broken Links Checker</a>.</li>
                <li><strong>8. Update Old Content:</strong> Add internal links to newer posts from older high-traffic posts to distribute authority and relevance.</li>
                <li><strong>9. Use Contextual Links:</strong> Links within content (contextual) are more valuable than sidebar or footer links. Make them relevant to surrounding text.</li>
                <li><strong>10. Create a Logical Hierarchy:</strong> Homepage → Category → Subcategory → Individual Page. Each level should link appropriately.</li>
              </ol>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Anchor Text Types and When to Use Them</h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Anchor Type</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Example</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">SEO Value</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Usage %</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">Exact Match</td><td className="border border-gray-300 px-4 py-2 text-sm">keyword research tools</td><td className="border border-gray-300 px-4 py-2 text-sm">Very High</td><td className="border border-gray-300 px-4 py-2 text-sm">15-20%</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">Partial Match</td><td className="border border-gray-300 px-4 py-2 text-sm">best keyword research tools</td><td className="border border-gray-300 px-4 py-2 text-sm">High</td><td className="border border-gray-300 px-4 py-2 text-sm">30-40%</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">LSI Keywords</td><td className="border border-gray-300 px-4 py-2 text-sm">search term analysis</td><td className="border border-gray-300 px-4 py-2 text-sm">High</td><td className="border border-gray-300 px-4 py-2 text-sm">20-30%</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">Branded</td><td className="border border-gray-300 px-4 py-2 text-sm">ProURLMonitor tools</td><td className="border border-gray-300 px-4 py-2 text-sm">Medium</td><td className="border border-gray-300 px-4 py-2 text-sm">10-15%</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">Generic</td><td className="border border-gray-300 px-4 py-2 text-sm">click here, learn more</td><td className="border border-gray-300 px-4 py-2 text-sm">Low</td><td className="border border-gray-300 px-4 py-2 text-sm">5-10%</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">Naked URL</td><td className="border border-gray-300 px-4 py-2 text-sm">https://example.com</td><td className="border border-gray-300 px-4 py-2 text-sm">Low</td><td className="border border-gray-300 px-4 py-2 text-sm">5-10%</td></tr>
                </tbody>
              </table>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-300">
              <h3 className="font-semibold text-yellow-800 mb-2">💡 Anchor Text Diversity:</h3>
              <p className="text-sm text-gray-700">Vary your anchor text types for natural linking. Over-optimization with exact match anchors can trigger spam filters. Aim for 60-70% keyword-related anchors (exact + partial + LSI) and 30-40% branded/generic anchors.</p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Common Internal Linking Mistakes</h2>
            <div className="space-y-4 mb-4">
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                <h3 className="font-semibold text-red-800 mb-2">❌ Too Many Links on One Page</h3>
                <p className="text-sm text-gray-700">Having 50+ internal links dilutes link value and confuses users. Keep it under 150 links per page maximum, with 20-30 being optimal for most content.</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                <h3 className="font-semibold text-red-800 mb-2">❌ Using Generic Anchor Text</h3>
                <p className="text-sm text-gray-700">"Click here" and "read more" waste SEO opportunity. Always use descriptive, keyword-rich anchor text that previews the destination.</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                <h3 className="font-semibold text-red-800 mb-2">❌ Linking Only to Homepage</h3>
                <p className="text-sm text-gray-700">Deep link to specific pages. Your homepage doesn't need 100 internal links—distribute authority to deeper pages that need ranking help.</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                <h3 className="font-semibold text-red-800 mb-2">❌ Ignoring Orphan Pages</h3>
                <p className="text-sm text-gray-700">Pages with zero internal links are hard to discover. Every page should have at least 2-3 internal links pointing to it.</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                <h3 className="font-semibold text-red-800 mb-2">❌ Broken Internal Links</h3>
                <p className="text-sm text-gray-700">404 errors hurt UX and SEO. Regular audits prevent broken links. Use our <a href="/tools/broken-links-checker" className="text-emerald-600 hover:text-emerald-700 font-medium">Broken Links Checker</a>.</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Related SEO Tools</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/semantic-keyword-finder" className="hover:text-emerald-600">🔍 Semantic Keyword Finder</a>
                </h3>
                <p className="text-sm text-gray-700">Find keywords to use in anchor text.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/broken-links-checker" className="hover:text-emerald-600">🔗 Broken Links Checker</a>
                </h3>
                <p className="text-sm text-gray-700">Find and fix broken internal links.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/seo-audit" className="hover:text-emerald-600">📊 SEO Audit</a>
                </h3>
                <p className="text-sm text-gray-700">Comprehensive site analysis including links.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/link-extractor" className="hover:text-emerald-600">📎 Link Extractor</a>
                </h3>
                <p className="text-sm text-gray-700">Extract all links from any webpage.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/content-readability-optimizer" className="hover:text-emerald-600">📖 Content Readability</a>
                </h3>
                <p className="text-sm text-gray-700">Optimize content structure for better UX.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/xml-html-sitemap-generator" className="hover:text-emerald-600">🗺️ Sitemap Generator</a>
                </h3>
                <p className="text-sm text-gray-700">Create sitemaps for better crawlability.</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">📚 Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What is internal linking in SEO?</h3>
                <p className="text-gray-700 text-sm">A: Internal linking is linking from one page on your website to another page on the same domain. It helps with navigation, site architecture, and distributing page authority to improve rankings.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: How many internal links should a page have?</h3>
                <p className="text-gray-700 text-sm">A: Aim for 20-30 internal links on content pages, with 2-4% link density (2-4 links per 100 words). Avoid exceeding 150 links per page as it dilutes link value.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What is the best anchor text for internal links?</h3>
                <p className="text-gray-700 text-sm">A: Use descriptive, keyword-rich anchor text. Mix exact match (15-20%), partial match (30-40%), LSI keywords (20-30%), and branded/generic (20-30%) for natural diversity.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Do internal links help SEO?</h3>
                <p className="text-gray-700 text-sm">A: Yes, significantly! Internal links help search engines discover pages, understand site structure, distribute authority, and improve rankings. Sites with strategic internal linking see 40% more organic traffic on average.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What are orphan pages?</h3>
                <p className="text-gray-700 text-sm">A: Orphan pages have no internal links pointing to them, making them hard for users and search engines to find. Every page should have at least 2-3 internal links.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Should I use nofollow on internal links?</h3>
                <p className="text-gray-700 text-sm">A: Generally no. Only use nofollow on internal links to login pages, admin areas, or low-value pages you don't want to waste crawl budget on.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: How do I find internal linking opportunities?</h3>
                <p className="text-gray-700 text-sm">A: Use our Internal Linking Assistant to analyze content and find linkable keywords. It identifies mentions of topics you've covered elsewhere and suggests relevant internal links.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Is this internal linking assistant free?</h3>
                <p className="text-gray-700 text-sm">A: Yes! Completely free with unlimited analysis. No registration or payment required. Analyze your content and get smart internal linking suggestions instantly.</p>
              </div>
            </div>
          </div>

          <div className="card bg-indigo-700 text-white">
            <h2 className="text-2xl font-bold mb-4">🚀 Optimize Your Internal Linking Now!</h2>
            <p className="mb-4">
              Use our <strong>free Internal Linking Assistant</strong> to discover linking opportunities, improve anchor text, check link density, and build a powerful internal linking structure. Perfect for content writers, SEO specialists, bloggers, and digital marketers.
            </p>
            <p className="mb-4">
              No registration required. Unlimited analysis. Completely free forever!
            </p>
            <p className="font-semibold">
              More tools: <a href="/tools/semantic-keyword-finder" className="text-indigo-100 hover:text-white underline">Keywords</a> • <a href="/tools/seo-audit" className="text-indigo-100 hover:text-white underline">SEO Audit</a> • <a href="/tools/broken-links-checker" className="text-indigo-100 hover:text-white underline">Broken Links</a> 🎯
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
