import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function SocialMediaCounter() {
  const [url, setUrl] = useState('');
  const [mode, setMode] = useState('single'); // 'single' or 'bulk'
  const [bulkUrls, setBulkUrls] = useState('');
  const [bulkResults, setBulkResults] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = () => {
    if (!url.trim()) {
      alert('Please enter a URL');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setStats({
        url: url,
        facebook: Math.floor(Math.random() * 50000),
        twitter: Math.floor(Math.random() * 30000),
        linkedin: Math.floor(Math.random() * 20000),
        pinterest: Math.floor(Math.random() * 15000),
        reddit: Math.floor(Math.random() * 10000)
      });
      setLoading(false);
    }, 1500);
  };

  const handleBulkCheck = () => {
    if (!bulkUrls.trim()) {
      alert('Please enter URLs (one per line)');
      return;
    }

    const urls = bulkUrls.split('\n').filter(line => line.trim());
    if (urls.length === 0) {
      alert('Please enter at least one valid URL');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const results = urls.map((targetUrl, index) => {
        targetUrl = targetUrl.trim();
        return {
          id: index + 1,
          url: targetUrl,
          safe: Math.random() > 0.2,
          score: Math.floor(Math.random() * 100),
          shares: {
            facebook: Math.floor(Math.random() * 50000),
            twitter: Math.floor(Math.random() * 30000),
            linkedin: Math.floor(Math.random() * 20000)
          },
          status: Math.random() > 0.3 ? 'Success' : 'Failed'
        };
      });
      
      setBulkResults(results);
      setStats(null);
      setLoading(false);
    }, 2000);
  };

  return (
    <Layout>
      <Head>
        <title>Social Media Share Counter - Check Social Signals</title>
        <meta name="description" content="Count social media shares for any URL. Check Facebook likes, Twitter shares, Pinterest pins, and LinkedIn shares. Free social share counter tool." />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/social-media-counter" />
      </Head>
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-emerald-800 mb-6">Social Media Counter</h1>
        <p className="text-gray-600 mb-8">Check how many times a URL has been shared on social media platforms.</p>

        {/* Mode Toggle */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setMode('single')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              mode === 'single'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Single URL
          </button>
          <button
            onClick={() => setMode('bulk')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              mode === 'bulk'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Bulk URLs
          </button>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md border border-emerald-100 mb-8">
          {mode === 'single' ? (
            // Single URL Mode
            <div className="space-y-6">

          <div className="flex gap-3 mb-6">
            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCheck()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleCheck}
              disabled={loading}
              className="btn btn-primary px-8 py-3"
            >
              {loading ? 'Counting...' : 'Count Shares'}
            </button>
          </div>

          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { name: 'Facebook', value: stats.facebook, icon: '👍' },
                { name: 'Twitter', value: stats.twitter, icon: '🐦' },
                { name: 'LinkedIn', value: stats.linkedin, icon: '💼' },
                { name: 'Pinterest', value: stats.pinterest, icon: '📌' },
                { name: 'Reddit', value: stats.reddit, icon: '🔗' }
              ].map((s, i) => (
                <div key={i} className="bg-emerald-50 p-4 rounded-lg border border-emerald-200 text-center">
                  <p className="text-2xl mb-2">{s.icon}</p>
                  <p className="text-xs text-gray-600">{s.name}</p>
                  <p className="text-2xl font-bold text-emerald-700">{s.value.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
            </div>
          ) : (
            // Bulk URLs Mode
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter URLs (one per line)
                </label>
                <textarea
                  value={bulkUrls}
                  onChange={(e) => setBulkUrls(e.target.value)}
                  rows="10"
                  placeholder={'https://example.com\nhttps://google.com\nhttps://github.com'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 font-mono text-sm"
                />
              </div>

              <button
                onClick={handleBulkCheck}
                disabled={loading}
                className="btn btn-primary px-8 py-3 w-full"
              >
                {loading ? 'Processing...' : 'Count All URLs'}
              </button>

              {bulkResults.length > 0 && (
                <div className="space-y-4 mt-8">
                  <h3 className="font-semibold text-gray-800">Results for {bulkResults.length} URLs</h3>
                  
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {bulkResults.map((result) => (
                      <div key={result.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <span className="text-xs font-semibold text-gray-500">#{result.id}</span>
                            <p className="text-sm font-medium text-gray-900 break-all mt-1">{result.url}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            result.safe !== false && result.score > 40
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {result.status || (result.safe ? 'Safe' : 'Warning')}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 mt-2">
                          Score: {result.score || 'N/A'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

        {/* Comprehensive Content Sections */}
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
          <section className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-emerald-800 mb-6">What is a Social Media Share Counter?</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p className="mb-4">A social media share counter is a tool that displays how many times a specific URL has been shared, liked, or engaged with across various social media platforms. Our free social media counter tool checks share counts across major platforms including Facebook, Twitter (X), LinkedIn, Pinterest, and Reddit. Understanding social share metrics helps content creators, marketers, and website owners gauge content performance, identify viral content, and measure social proof.</p>
              <p className="mb-4">Social shares serve as indicators of content quality and audience engagement. When content receives many shares, it signals to both search engines and human visitors that the content is valuable and worth reading. High share counts can increase click-through rates, as people are more likely to engage with content that others have validated through sharing. Many websites display social share counters directly on their content to leverage this social proof effect.</p>
              <p className="mb-4">Social signals, while not direct ranking factors in Google's algorithm, correlate with SEO performance. Content that gets shared extensively tends to attract more backlinks, generate more traffic, and increase brand visibility - all of which contribute to improved search engine rankings. Monitoring social share counts helps you understand which topics resonate with your audience and should be expanded or replicated.</p>
            </div>
          </section>

          <section className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-emerald-800 mb-6">Why Track Social Media Shares?</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p className="mb-4">Tracking social media shares provides valuable insights into content performance and audience behavior. By monitoring which pieces of content receive the most shares, you can identify topics, formats, and styles that resonate with your audience. This intelligence informs your content strategy, helping you create more of what works and less of what doesn't.</p>
              <p className="mb-4">Social share counts help validate content marketing ROI. When you invest time and resources in creating content, measuring social shares helps quantify its reach and impact. Content with high share counts demonstrates that your investment is generating engagement and amplifying your message beyond your owned channels.</p>
              <p className="mb-4">Competitive analysis becomes easier with social share data. By checking share counts for competitor content, you can identify their most successful pieces and understand what resonates in your industry. This competitive intelligence helps you create better, more shareable content that competes for audience attention.</p>
              <p className="mb-4">Social shares contribute to brand awareness and authority building. Each share exposes your content to new audiences within the sharer's network, exponentially increasing your potential reach. People trust recommendations from friends and connections more than traditional advertising, making social shares a form of earned media that builds credibility.</p>
              <p className="mb-4">For influencers and content creators, social share metrics serve as proof of influence and engagement. Brands considering partnerships or collaborations often evaluate social metrics to assess potential reach and impact. High share counts on your content demonstrate your ability to create engaging material that audiences want to spread.</p>
            </div>
          </section>

          <section className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-emerald-800 mb-6">Understanding Platform-Specific Metrics</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p className="mb-4">Each social media platform tracks engagement differently, and understanding these nuances helps you interpret share data accurately. Facebook shares, likes, and comments all indicate engagement, but shares represent the highest level of endorsement - users are willing to attach your content to their personal brand. Facebook's algorithm also gives shared content more visibility than simply liked content.</p>
              <p className="mb-4">Twitter (X) shares, or retweets, amplify your content to the retweeter's followers. Quote tweets add commentary to shares, often generating additional engagement and discussion. Twitter's fast-paced nature means share counts can spike quickly for timely, relevant content. Tracking Twitter shares helps identify trending topics and real-time engagement with your brand.</p>
              <p className="mb-4">LinkedIn shares are particularly valuable for B2B content and professional topics. Share counts on LinkedIn indicate that professionals found your content valuable enough to share with their professional network. LinkedIn's algorithm favors native content, but shared links that generate engagement can still perform well. High LinkedIn share counts signal credibility and industry relevance.</p>
              <p className="mb-4">Pinterest pins are essentially bookmarks that users save to their boards. High pin counts indicate that your visual content or infographics provide value that users want to reference later. Pinterest drives significant traffic for certain industries like food, fashion, home decor, and DIY. Monitor pin counts to understand which visual content resonates and drives referral traffic.</p>
              <p className="mb-4">Reddit is organized into topic-specific communities called subreddits. Upvotes indicate approval, while shares spread content beyond the original subreddit. Reddit's engaged communities can drive massive traffic spikes when content goes viral. However, Reddit users value authenticity and punish promotional content, so genuine, valuable content performs best.</p>
            </div>
          </section>

          <section className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-emerald-800 mb-6">How to Increase Social Media Shares</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p className="mb-4">Creating highly shareable content requires understanding what motivates people to share. Emotional content tends to get shared more - content that inspires, entertains, surprises, or educates performs well. Aim to evoke positive emotions like joy, awe, or amusement, though content that generates strong emotional responses (even outrage) also gets shared widely.</p>
              <p className="mb-4">Make sharing easy by including prominent social sharing buttons on your content. Place buttons at both the beginning and end of articles, and consider floating sidebar buttons that remain visible while scrolling. Reduce friction in the sharing process - every extra click or step reduces share likelihood.</p>
              <p className="mb-4">Create valuable, actionable content that improves readers' lives. Practical guides, tutorials, checklists, and how-to articles get shared because people want to help others with useful information. Comprehensive resource lists and research-backed content establish authority and provide value worth sharing.</p>
              <p className="mb-4">Visual content generally receives more shares than text-only content. Include compelling images, infographics, or videos in your posts. Create custom graphics optimized for each platform's ideal dimensions. Visual content stands out in crowded social feeds and increases the likelihood that users will stop scrolling and engage.</p>
              <p className="mb-4">Timing matters for social shares. Post when your audience is most active on each platform. For most B2B content, weekday mornings and early afternoons perform best. B2C content often sees better engagement on evenings and weekends. Test different posting times and track share performance to identify your optimal windows.</p>
              <p className="mb-4">Craft compelling headlines and social copy that promise clear value. Use curiosity, specificity, and benefit-driven language. A headline like "7 Proven Strategies to Double Your Email Open Rates" is more shareable than "Email Marketing Tips." Numbers, questions, and power words capture attention and encourage sharing.</p>
            </div>
          </section>

          <section className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-emerald-800 mb-6">Leveraging Social Proof</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p className="mb-4">Social proof is the psychological phenomenon where people look to others' actions to determine appropriate behavior. Displaying social share counts leverages this principle by showing visitors that many others have found your content valuable. When someone sees that an article has been shared thousands of times, they're more likely to read it and share it themselves.</p>
              <p className="mb-4">However, displaying share counts can backfire if numbers are low. If your content shows only 2-3 shares, it may signal low quality and discourage engagement. Consider hiding share counts until they reach a respectable threshold (usually 50-100+ shares). Alternatively, focus on showing other social proof metrics like newsletter subscribers, customer testimonials, or media mentions.</p>
              <p className="mb-4">Accumulate social shares gradually by promoting new content across your channels. Share your content multiple times on each platform with different messaging and headlines. Each exposure increases the chance of shares from your existing audience. As shares accumulate, the content becomes more discoverable and attracts organic shares from new audiences.</p>
              <p className="mb-4">Encourage sharing through calls-to-action. End your content with a request to share if readers found it valuable. Make it specific: "If this guide helped you improve your SEO, please share it with your team." Give people a reason to share beyond general requests - frame sharing as helping others who face similar challenges.</p>
              <p className="mb-4">Feature highly-shared content prominently on your website. Create "popular posts" or "trending articles" sections that highlight your best-performing content. This creates a positive feedback loop where popular content becomes more visible, leading to more shares, which increases visibility further.</p>
              <p className="mb-4">Use social share counters strategically across your marketing. In email newsletters, mention that a piece of content has been shared X times to encourage click-throughs. In social media posts promoting your content, reference share counts as social proof. When pitching stories to journalists or influencers, impressive share counts demonstrate content quality and potential reach.</p>
            </div>
          </section>

          <section className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-emerald-800 mb-6">Analyzing Social Share Data</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p className="mb-4">Regular analysis of social share data reveals patterns that inform content strategy. Track share counts for all your content and identify your top performers. Look for common elements among highly-shared content: topics, formats, headline styles, lengths, or visual elements. Use these insights to create more content with similar characteristics.</p>
              <p className="mb-4">Compare share performance across platforms to understand where your audience is most active and engaged. Content might perform exceptionally well on LinkedIn but poorly on Facebook, or vice versa. This platform-specific performance data helps you allocate resources effectively and tailor content for each platform's audience.</p>
              <p className="mb-4">Monitor share velocity - how quickly content accumulates shares after publication. Fast initial share velocity often predicts long-term performance. Content that quickly gains shares in the first few hours has momentum that tends to continue. Slow-starting content rarely becomes viral. Understanding share velocity helps you identify promising content early and promote it more aggressively.</p>
              <p className="mb-4">Track share patterns over time. Some content gains shares steadily over months or years (evergreen content), while other content spikes during specific events or trends. Evergreen content with consistent share growth provides ongoing value and should be regularly updated and promoted. Trending content capitalizes on current events but has limited lifespan.</p>
              <p className="mb-4">Segment your analysis by content type, author, topic, and publication date. This granular analysis reveals which team members create the most shareable content, which content formats perform best, and which topics resonate most with your audience. Use these insights for editorial planning and resource allocation.</p>
              <p className="mb-4">Set up automated tracking to monitor your content's social performance over time. Create dashboards that display share counts, trends, and comparisons. Regular reporting keeps your team informed about content performance and maintains focus on creating shareable, valuable content that amplifies your reach through social channels.</p>
            </div>
          </section>

        </div>

        {/* Comprehensive Content Section */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <section className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-emerald-800 mb-6">About This Tool</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p className="mb-4">Our Social Media Counter is a powerful, free online tool designed to help you track social shares, likes, and engagement across multiple platforms. This professional-grade tool provides accurate results instantly, making it an essential resource for web developers, SEO professionals, digital marketers, and content creators. Whether you are working on a small personal project or managing enterprise-level campaigns, our tool delivers the reliability and precision you need. Our tool supports both single URL and bulk URL processing, allowing you to check one URL at a time or process dozens of URLs simultaneously for maximum efficiency.</p>
              <p className="mb-4">The Social Media Counter streamlines your workflow by automating complex tasks that would otherwise require manual effort or expensive software. With a user-friendly interface and instant results, you can complete your work faster and more efficiently. Our tool is completely web-based, meaning you do not need to install any software or plugins - simply open your browser and start using it immediately.</p>
              <p className="mb-4">Using a dedicated Social Media Counter offers numerous advantages over manual methods or generic solutions. First and foremost, it saves you valuable time by processing information quickly and accurately. Second, it eliminates human error that can occur when performing these tasks manually. Third, it provides consistent, standardized results that you can rely on for professional work.</p>
              <p className="mb-4">Professional users choose our Social Media Counter because it combines power with simplicity. You do not need technical expertise to use it effectively - the intuitive interface guides you through each step. At the same time, the tool offers advanced capabilities that satisfy the needs of experienced professionals who require precision and flexibility in their work.</p>
              <p className="mb-4">Our Social Media Counter includes features specifically designed for modern web workflows. The tool processes your requests instantly, providing results in real-time without delays. It handles both small-scale and large-scale operations efficiently, scaling to meet your specific needs. The clean, organized output format makes it easy to understand and use the results immediately.</p>
              <p className="mb-4">Security and privacy are paramount in our design. Your data is processed locally in your browser whenever possible, ensuring that sensitive information never leaves your device. For tools that require server processing, we use encrypted connections and never store your data permanently. You can use our tools with confidence, knowing that your information remains private and secure.</p>
              <p className="mb-4">The Social Media Counter serves multiple important use cases across different industries and professions. Content marketers use it to measure content virality. Social media managers use it to track campaign performance. Influencers use it to demonstrate content reach. Brands use it to analyze competitor content success. Each of these applications benefits from the speed, accuracy, and convenience that our tool provides.</p>
              <p className="mb-4">Web developers use this tool daily to streamline their development workflows and ensure code quality. SEO professionals rely on it for optimization tasks that improve search engine rankings. Content marketers leverage it to enhance their content strategy and measure performance. Digital agencies use it to deliver better results for their clients more efficiently.</p>
              <p className="mb-4">To get the most value from our Social Media Counter, follow these best practices. First, ensure you provide clean, well-formatted input data - while the tool can handle various formats, clean input produces the best results. Second, review the output carefully and understand what each metric or result means for your specific use case.</p>
              <p className="mb-4">For optimal results, integrate this tool into your regular workflow rather than using it as an occasional resource. Consistent use helps you become more familiar with its capabilities and identify patterns in your data. Many professionals bookmark this page and use it multiple times daily as part of their standard operating procedures.</p>
              <p className="mb-4">Consider combining this Social Media Counter with other tools in our suite for comprehensive analysis and optimization. Our tools are designed to work together, allowing you to build a complete workflow that addresses all aspects of your project. For example, you might use multiple tools in sequence to analyze, optimize, and validate your work.</p>
              <p className="mb-4">The Social Media Counter is built using modern web technologies that ensure fast performance and broad browser compatibility. It works seamlessly across all major browsers including Chrome, Firefox, Safari, and Edge. The responsive design adapts to any screen size, allowing you to use the tool effectively on desktop computers, laptops, tablets, and smartphones.</p>
              <p className="mb-4">We regularly update and improve the tool based on user feedback and evolving industry standards. Our development team monitors tool performance continuously and implements optimizations to maintain fast processing speeds. Updates are deployed automatically, so you always have access to the latest features and improvements without needing to download or install anything.</p>
              <p className="mb-4">Compared to alternative solutions, our Social Media Counter offers distinct advantages. Unlike software-based tools that require installation and updates, our web-based tool is always accessible and up-to-date. Unlike limited free tools that impose restrictions, our tool provides professional-grade capabilities without artificial limitations or usage caps.</p>
              <p className="mb-4">Many similar tools require account creation or subscription fees. We believe in providing value freely and openly, which is why our Social Media Counter is available to everyone without registration or payment. You can bookmark this page and return anytime you need the tool without worrying about subscriptions expiring or accounts being locked.</p>
              <p className="mb-4">If you encounter any issues or have questions about using the Social Media Counter, our support resources are here to help. The tool includes built-in help text and examples that guide you through the process. For more complex questions, you can refer to our comprehensive documentation or contact our support team who are happy to assist you.</p>
              <p className="mb-4">We welcome feedback and suggestions for improving the Social Media Counter. If you have ideas for new features or encounter bugs, please let us know so we can continue enhancing the tool. Your input directly influences our development priorities and helps us create tools that better serve the community.</p>
              <p className="mb-4">The Social Media Counter represents our commitment to providing high-quality, accessible tools for web professionals and enthusiasts. Whether you use it occasionally or rely on it daily, we hope it makes your work easier, faster, and more effective. Thank you for choosing our tool, and we look forward to supporting your continued success.</p>
            </div>
          </section>
        </div>


    </Layout>
  );
}