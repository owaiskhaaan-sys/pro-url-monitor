import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function AIPromptGenerator() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [selectedLength, setSelectedLength] = useState('medium');
  const [topic, setTopic] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const categories = [
    { id: 'marketing', name: '📢 Marketing & Copywriting', icon: '📢' },
    { id: 'coding', name: '💻 Coding & Programming', icon: '💻' },
    { id: 'writing', name: '✍️ Content Writing & Blog', icon: '✍️' },
    { id: 'business', name: '💼 Business & Strategy', icon: '💼' },
    { id: 'education', name: '📚 Education & Learning', icon: '📚' },
    { id: 'creative', name: '🎨 Creative & Design', icon: '🎨' },
    { id: 'social', name: '📱 Social Media', icon: '📱' },
    { id: 'seo', name: '🔍 SEO & Research', icon: '🔍' },
    { id: 'email', name: '📧 Email Marketing', icon: '📧' },
    { id: 'video', name: '🎬 Video & YouTube', icon: '🎬' }
  ];

  const promptTemplates = {
    marketing: [
      'Act as an expert {tone} marketing strategist. Create a comprehensive {length} marketing campaign for {topic}. Include target audience analysis, key messaging, channel strategy, and expected outcomes. {details}',
      'You are a professional copywriter. Write compelling {length} ad copy for {topic} that drives conversions. Use {tone} tone and include a strong call-to-action. {details}',
      'Generate a {length} product description for {topic} that highlights benefits, features, and unique selling points. Maintain a {tone} tone. {details}'
    ],
    coding: [
      'Act as an experienced {tone} software developer. Write clean, well-documented {length} code for {topic}. Include error handling, best practices, and comments explaining the logic. {details}',
      'You are a coding expert. Debug and optimize the following code related to {topic}. Provide {length} explanation in {tone} tone. {details}',
      'Create a {length} tutorial on {topic} for developers. Use {tone} language and include practical examples with code snippets. {details}'
    ],
    writing: [
      'Act as a {tone} content writer. Write a {length} blog post about {topic} that is SEO-optimized, engaging, and informative. Include an introduction, main points, and conclusion. {details}',
      'You are a professional article writer. Create {length} content on {topic} with a {tone} tone. Make it reader-friendly with subheadings, bullet points, and examples. {details}',
      'Generate a {length} compelling story or narrative about {topic}. Use {tone} writing style and create emotional engagement. {details}'
    ],
    business: [
      'Act as a {tone} business consultant. Analyze {topic} and provide {length} strategic recommendations. Include market analysis, opportunities, risks, and actionable steps. {details}',
      'You are a business strategy expert. Create a {length} business plan for {topic}. Use {tone} language and cover executive summary, market analysis, financial projections. {details}',
      'Generate {length} professional advice on {topic} for business growth. Maintain {tone} tone and provide data-driven insights. {details}'
    ],
    education: [
      'Act as an expert {tone} educator. Create a {length} lesson plan on {topic}. Include learning objectives, teaching methods, activities, and assessment criteria. {details}',
      'You are a skilled tutor. Explain {topic} in {length} detail using {tone} language. Make it easy to understand with examples and analogies. {details}',
      'Generate {length} study notes on {topic}. Use {tone} tone and organize information with headings, key points, and summaries. {details}'
    ],
    creative: [
      'Act as a creative {tone} designer. Describe a {length} design concept for {topic}. Include visual elements, color schemes, typography, and overall aesthetic. {details}',
      'You are a creative director. Brainstorm {length} innovative ideas for {topic}. Use {tone} approach and think outside the box. {details}',
      'Generate {length} creative content ideas for {topic}. Maintain {tone} tone and focus on originality and impact. {details}'
    ],
    social: [
      'Act as a {tone} social media manager. Create {length} engaging social media posts for {topic}. Include captions, hashtags, and posting strategy. {details}',
      'You are a social media expert. Write {length} content calendar for {topic} covering multiple platforms. Use {tone} tone. {details}',
      'Generate {length} viral social media content ideas for {topic}. Maintain {tone} style and focus on shareability. {details}'
    ],
    seo: [
      'Act as an {tone} SEO specialist. Perform {length} keyword research and SEO analysis for {topic}. Include search volume, competition, and optimization recommendations. {details}',
      'You are an SEO expert. Create a {length} SEO strategy for {topic}. Use {tone} language and cover on-page, off-page, and technical SEO. {details}',
      'Generate {length} SEO-optimized content outline for {topic}. Maintain {tone} tone and include target keywords, headings, and meta tags. {details}'
    ],
    email: [
      'Act as a {tone} email marketing specialist. Write a {length} email campaign for {topic}. Include subject line, body copy, and call-to-action. {details}',
      'You are an email copywriting expert. Create {length} persuasive email sequence for {topic}. Use {tone} tone and focus on conversions. {details}',
      'Generate {length} email newsletter content for {topic}. Maintain {tone} style and include engaging sections. {details}'
    ],
    video: [
      'Act as a {tone} video content creator. Write a {length} video script for {topic}. Include hook, main content, and call-to-action. {details}',
      'You are a YouTube expert. Create {length} video ideas and titles for {topic}. Use {tone} approach and focus on views and engagement. {details}',
      'Generate {length} video description and tags for {topic}. Maintain {tone} tone and optimize for YouTube SEO. {details}'
    ]
  };

  const lengthMap = {
    short: 'short and concise',
    medium: 'detailed',
    long: 'comprehensive and in-depth'
  };

  const generatePrompt = () => {
    if (!selectedCategory || !topic.trim()) {
      alert('Please select a category and enter a topic');
      return;
    }

    const templates = promptTemplates[selectedCategory];
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

    let prompt = randomTemplate
      .replace('{tone}', selectedTone)
      .replace('{length}', lengthMap[selectedLength])
      .replace(/{topic}/g, topic)
      .replace('{details}', additionalDetails ? `Additional context: ${additionalDetails}` : '');

    setGeneratedPrompt(prompt);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setSelectedCategory('');
    setTopic('');
    setAdditionalDetails('');
    setGeneratedPrompt('');
    setCopied(false);
  };

  return (
    <Layout>
      <Head>
        <title>AI Prompt Generator - Create Perfect Prompts for ChatGPT, Claude, Gemini | Free</title>
        <meta name="description" content="Free AI Prompt Generator for ChatGPT, Claude, Gemini, and all AI tools. Generate optimized prompts for marketing, coding, writing, business, education, and more. 10+ categories with customizable options." />
        <meta name="keywords" content="AI prompt generator, ChatGPT prompts, Claude prompts, AI writing prompts, prompt engineering, AI tool prompts, free prompt generator" />
        <meta property="og:title" content="AI Prompt Generator - Create Perfect AI Prompts Free" />
        <meta property="og:description" content="Generate optimized AI prompts for any task. 10+ categories including marketing, coding, writing, and business." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Prompt Generator - Free Tool" />
        <meta name="twitter:description" content="Create perfect prompts for ChatGPT, Claude, and other AI tools instantly." />
      </Head>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-emerald-800 mb-4">AI Prompt Generator</h1>
        <p className="text-gray-600 mb-8">Generate perfect prompts for ChatGPT, Claude, Gemini, and any AI tool. Choose from 10+ categories and customize tone, length, and details.</p>

        {/* Generator Section */}
        <div className="bg-white p-8 rounded-lg shadow-md border border-emerald-100 mb-8">
          <div className="space-y-6">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Select Category</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-3 rounded-lg border-2 transition text-left ${
                      selectedCategory === cat.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{cat.icon}</div>
                    <div className="text-xs font-medium text-gray-700">{cat.name.replace(/[📢💻✍️💼📚🎨📱🔍📧🎬]/g, '').trim()}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Topic/Subject</label>
              <input
                type="text"
                placeholder="e.g., Email marketing campaign for SaaS product"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Tone Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tone</label>
              <div className="flex flex-wrap gap-2">
                {['professional', 'casual', 'friendly', 'formal', 'creative', 'technical'].map((tone) => (
                  <button
                    key={tone}
                    onClick={() => setSelectedTone(tone)}
                    className={`px-4 py-2 rounded-lg border transition ${
                      selectedTone === tone
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-gray-300 hover:border-emerald-400'
                    }`}
                  >
                    {tone.charAt(0).toUpperCase() + tone.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Length Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Response Length</label>
              <div className="flex gap-2">
                {['short', 'medium', 'long'].map((len) => (
                  <button
                    key={len}
                    onClick={() => setSelectedLength(len)}
                    className={`px-6 py-2 rounded-lg border transition ${
                      selectedLength === len
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-gray-300 hover:border-emerald-400'
                    }`}
                  >
                    {len.charAt(0).toUpperCase() + len.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Details (Optional)</label>
              <textarea
                placeholder="Add any specific requirements, constraints, or context..."
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={generatePrompt}
                className="btn btn-primary px-8 py-3 flex-1"
              >
                ✨ Generate Prompt
              </button>
              <button
                onClick={clearAll}
                className="btn bg-gray-600 text-white hover:bg-gray-700 px-8 py-3"
              >
                🔄 Clear
              </button>
            </div>
          </div>
        </div>

        {/* Generated Prompt Display */}
        {generatedPrompt && (
          <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 p-8 rounded-lg border-2 border-emerald-200 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-emerald-800">Your Generated Prompt</h3>
              <button
                onClick={copyToClipboard}
                className={`btn ${copied ? 'bg-green-600' : 'bg-emerald-600'} text-white hover:bg-emerald-700 px-6 py-2`}
              >
                {copied ? '✓ Copied!' : '📋 Copy Prompt'}
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg border border-emerald-300">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{generatedPrompt}</p>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>💡 Pro Tip:</strong> Copy this prompt and paste it directly into ChatGPT, Claude, Gemini, or any AI tool. You can further customize it based on the AI's response.
              </p>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="bg-white p-8 rounded-lg shadow-md border border-emerald-100 mt-8">
          <h2 className="text-3xl font-bold text-emerald-800 mb-6">What is an AI Prompt Generator?</h2>
          <div className="prose prose-emerald max-w-none text-gray-700 space-y-4">
            <p>
              An AI Prompt Generator is a specialized tool that helps you create optimized, effective prompts for artificial intelligence platforms like <a href="https://chat.openai.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">ChatGPT</a>, <a href="https://claude.ai/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Claude</a>, <a href="https://gemini.google.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Google Gemini</a>, and other AI tools. Instead of struggling to phrase your requests correctly, our generator creates professional, well-structured prompts that get you better results from AI models.
            </p>
            <p>
              Prompt engineering is the art and science of crafting instructions that AI can understand and execute effectively. A well-written prompt can mean the difference between getting generic, unhelpful responses and receiving precisely targeted, high-quality output that meets your specific needs. Our AI Prompt Generator takes the guesswork out of this process by providing tested, proven prompt templates across multiple categories.
            </p>

            <h3 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">Why Use an AI Prompt Generator?</h3>
            <p>
              Creating effective AI prompts requires understanding how AI models interpret instructions, what context they need, and how to structure requests for optimal results. Here's why using a prompt generator is essential:
            </p>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Save Time:</strong> Instead of spending minutes or hours crafting the perfect prompt, generate professional prompts in seconds. Our tool eliminates trial and error.</li>
              <li><strong>Better Results:</strong> Well-structured prompts yield higher quality AI responses. Get more accurate, relevant, and detailed outputs consistently.</li>
              <li><strong>Learn Prompt Engineering:</strong> See examples of effective prompts and learn what makes them work. Improve your own prompt-writing skills over time.</li>
              <li><strong>Consistency:</strong> Maintain consistent quality across all your AI interactions. No more hit-or-miss results from poorly worded prompts.</li>
              <li><strong>Versatility:</strong> Access prompt templates for 10+ categories covering marketing, coding, writing, business, education, creative work, social media, SEO, email, and video content.</li>
              <li><strong>Customization:</strong> Tailor prompts to your specific needs with adjustable tone (professional, casual, friendly, formal, creative, technical), length (short, medium, long), and additional context.</li>
              <li><strong>Professional Quality:</strong> Use prompts that professionals and experts rely on, giving you access to enterprise-level prompt engineering.</li>
              <li><strong>Free Forever:</strong> No subscriptions, no hidden costs. Generate unlimited prompts for any AI tool completely free.</li>
            </ul>

            <h3 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">How to Use the AI Prompt Generator</h3>
            <p>
              Our tool is designed for simplicity and effectiveness. Follow these steps to create perfect AI prompts:
            </p>
            <ol className="list-decimal pl-6 space-y-3">
              <li><strong>Select Your Category:</strong> Choose from 10 specialized categories including Marketing & Copywriting, Coding & Programming, Content Writing, Business Strategy, Education, Creative Design, Social Media, SEO & Research, Email Marketing, or Video & YouTube. Each category has tailored prompt templates.</li>
              <li><strong>Enter Your Topic:</strong> Describe what you want the AI to help with. Be specific – instead of "marketing," try "email marketing campaign for a B2B SaaS product targeting CFOs."</li>
              <li><strong>Choose Tone:</strong> Select the communication style that fits your needs: Professional (business-appropriate), Casual (conversational), Friendly (approachable), Formal (academic/legal), Creative (innovative), or Technical (detailed/precise).</li>
              <li><strong>Set Response Length:</strong> Pick Short (concise answers), Medium (detailed responses), or Long (comprehensive, in-depth content).</li>
              <li><strong>Add Context (Optional):</strong> Include any specific requirements, constraints, target audience, industry details, or special considerations to make the prompt more targeted.</li>
              <li><strong>Generate & Copy:</strong> Click "Generate Prompt" to create your optimized prompt, then copy it with one click and paste into your preferred AI tool.</li>
              <li><strong>Iterate if Needed:</strong> If the first generated prompt isn't quite right, click generate again for a different variation or adjust your inputs.</li>
            </ol>

            <h3 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">Prompt Categories Explained</h3>

            <h4 className="text-xl font-semibold text-emerald-700 mt-6 mb-3">📢 Marketing & Copywriting</h4>
            <p>
              Generate prompts for marketing campaigns, ad copy, product descriptions, landing pages, sales letters, and persuasive content. Perfect for marketers, copywriters, and business owners who need compelling content that converts. Includes prompts for audience analysis, messaging strategies, and conversion optimization.
            </p>

            <h4 className="text-xl font-semibold text-emerald-700 mt-6 mb-3">💻 Coding & Programming</h4>
            <p>
              Create prompts for code generation, debugging, optimization, tutorials, and technical documentation. Ideal for developers, programmers, and software engineers. Generate prompts that request clean code, best practices, error handling, and detailed explanations. Supports all programming languages and frameworks.
            </p>

            <h4 className="text-xl font-semibold text-emerald-700 mt-6 mb-3">✍️ Content Writing & Blog</h4>
            <p>
              Craft prompts for blog posts, articles, stories, newsletters, and long-form content. Perfect for content writers, bloggers, and journalists. Generate SEO-optimized content prompts with proper structure, engaging introductions, informative body sections, and strong conclusions. Check your content length with our <a href="/tools/word-counter" className="text-emerald-600 hover:underline">Word Counter</a> tool.
            </p>

            <h4 className="text-xl font-semibold text-emerald-700 mt-6 mb-3">💼 Business & Strategy</h4>
            <p>
              Generate prompts for business plans, strategic analysis, market research, consulting advice, and growth strategies. Ideal for entrepreneurs, business consultants, and executives. Create prompts that request data-driven insights, competitive analysis, and actionable recommendations.
            </p>

            <h4 className="text-xl font-semibold text-emerald-700 mt-6 mb-3">📚 Education & Learning</h4>
            <p>
              Create prompts for lesson plans, study guides, explanations, tutorials, and educational content. Perfect for teachers, tutors, trainers, and students. Generate prompts that break down complex topics, provide examples, and ensure comprehensive understanding.
            </p>

            <h4 className="text-xl font-semibold text-emerald-700 mt-6 mb-3">🎨 Creative & Design</h4>
            <p>
              Generate prompts for creative concepts, design ideas, brainstorming, innovative solutions, and artistic projects. Ideal for designers, artists, and creative professionals. Create prompts that encourage out-of-the-box thinking and unique perspectives.
            </p>

            <h4 className="text-xl font-semibold text-emerald-700 mt-6 mb-3">📱 Social Media</h4>
            <p>
              Craft prompts for social media posts, captions, content calendars, engagement strategies, and platform-specific content. Perfect for social media managers, influencers, and brand marketers. Generate prompts for Instagram, Facebook, LinkedIn, Twitter, and TikTok.
            </p>

            <h4 className="text-xl font-semibold text-emerald-700 mt-6 mb-3">🔍 SEO & Research</h4>
            <p>
              Create prompts for keyword research, SEO analysis, content optimization, competitive research, and search strategy. Ideal for SEO specialists, digital marketers, and content strategists. Enhance your SEO workflow with our <a href="/tools/keyword-density-checker" className="text-emerald-600 hover:underline">Keyword Density Checker</a> and <a href="/tools/seo-audit" className="text-emerald-600 hover:underline">SEO Audit</a> tools.
            </p>

            <h4 className="text-xl font-semibold text-emerald-700 mt-6 mb-3">📧 Email Marketing</h4>
            <p>
              Generate prompts for email campaigns, sequences, newsletters, cold outreach, and automated flows. Perfect for email marketers, sales professionals, and business owners. Create prompts that focus on subject lines, body copy, CTAs, and conversion optimization.
            </p>

            <h4 className="text-xl font-semibold text-emerald-700 mt-6 mb-3">🎬 Video & YouTube</h4>
            <p>
              Craft prompts for video scripts, YouTube titles, descriptions, tags, and content ideas. Ideal for YouTubers, video creators, and content producers. Generate prompts optimized for engagement, views, and YouTube's algorithm.
            </p>

            <h3 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">Prompt Engineering Best Practices</h3>
            <p>
              While our generator creates effective prompts automatically, understanding these principles helps you customize and refine them further:
            </p>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Be Specific:</strong> The more specific your topic and context, the better the AI's response. Include relevant details about audience, purpose, and constraints.</li>
              <li><strong>Assign a Role:</strong> Starting with "Act as a [expert role]" helps the AI understand the perspective and expertise level to use. Our prompts automatically include appropriate role assignments.</li>
              <li><strong>Define Output Format:</strong> Specify if you want bullet points, paragraphs, code blocks, tables, or specific structures. This ensures the response matches your needs.</li>
              <li><strong>Set Length Expectations:</strong> Indicate whether you want brief summaries or comprehensive explanations. Our length settings handle this automatically.</li>
              <li><strong>Provide Examples:</strong> When possible, include examples of what you're looking for. This gives the AI a clear reference point.</li>
              <li><strong>Use Clear Language:</strong> Avoid ambiguity. Use direct, unambiguous instructions that leave no room for misinterpretation.</li>
              <li><strong>Iterate and Refine:</strong> If the first response isn't perfect, refine your prompt or ask follow-up questions to guide the AI toward better results.</li>
              <li><strong>Add Constraints:</strong> Specify any limitations, requirements, or boundaries (word count, reading level, technical depth, etc.).</li>
            </ul>

            <h3 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">Common Prompt Engineering Mistakes to Avoid</h3>
            <div className="space-y-4 mt-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Mistake: Vague or Overly Broad Prompts</h4>
                <p className="text-gray-700 mb-2"><strong>Bad:</strong> "Write about marketing"</p>
                <p className="text-gray-700"><strong>Good:</strong> "Act as a B2B marketing expert. Write a 1500-word guide on email marketing strategies for SaaS companies targeting enterprise clients."</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Mistake: Missing Context</h4>
                <p className="text-gray-700 mb-2"><strong>Bad:</strong> "Create social media posts"</p>
                <p className="text-gray-700"><strong>Good:</strong> "Create 7 Instagram posts for a sustainable fashion brand targeting eco-conscious millennials. Include captions with 3-5 hashtags and emoji."</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Mistake: No Output Format Specified</h4>
                <p className="text-gray-700 mb-2"><strong>Bad:</strong> "Explain Python loops"</p>
                <p className="text-gray-700"><strong>Good:</strong> "Explain Python loops in tutorial format with: 1) Introduction, 2) Three examples with code, 3) Common mistakes, 4) Practice exercises."</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Mistake: Unclear Tone or Audience</h4>
                <p className="text-gray-700 mb-2"><strong>Bad:</strong> "Write about AI"</p>
                <p className="text-gray-700"><strong>Good:</strong> "Write a beginner-friendly, conversational blog post explaining AI for non-technical business owners. Avoid jargon and use relatable analogies."</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">AI Tools Compatible with Our Prompts</h3>
            <p>
              Our generated prompts work perfectly with all major AI platforms:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">
                  <a href="https://chat.openai.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">ChatGPT (OpenAI)</a>
                </h4>
                <p className="text-sm text-gray-600">Most popular AI chatbot. Works with GPT-3.5, GPT-4, and all ChatGPT versions. Supports both free and Plus accounts.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">
                  <a href="https://claude.ai/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Claude (Anthropic)</a>
                </h4>
                <p className="text-sm text-gray-600">Known for nuanced responses and strong reasoning. Excellent for detailed analysis and comprehensive content.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">
                  <a href="https://gemini.google.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Google Gemini</a>
                </h4>
                <p className="text-sm text-gray-600">Google's advanced AI with deep search integration. Great for research-based prompts and factual content.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">
                  <a href="https://www.bing.com/chat" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Bing Copilot</a>
                </h4>
                <p className="text-sm text-gray-600">Microsoft's AI assistant with web browsing capabilities. Ideal for current information and citations.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">
                  <a href="https://www.perplexity.ai/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Perplexity AI</a>
                </h4>
                <p className="text-sm text-gray-600">AI search engine focused on sourced answers. Perfect for research and fact-based prompts.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">Other AI Tools</h4>
                <p className="text-sm text-gray-600">Our prompts also work with Jasper, Copy.ai, Writesonic, and any other text-based AI tool.</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">Advanced Prompt Techniques</h3>
            <p>
              Take your AI prompting to the next level with these advanced techniques:
            </p>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Chain of Thought:</strong> Ask the AI to explain its reasoning step-by-step before providing the final answer. This improves accuracy and transparency.</li>
              <li><strong>Few-Shot Learning:</strong> Provide 2-3 examples of the desired output format before asking for your specific result. The AI learns from your examples.</li>
              <li><strong>Persona Consistency:</strong> Maintain the same expert role throughout a conversation for consistent expertise and tone.</li>
              <li><strong>Constraint-Based:</strong> Add specific constraints (word count, reading level, exclude certain topics) to refine output precisely.</li>
              <li><strong>Multi-Step Prompts:</strong> Break complex tasks into sequential steps, each building on the previous response.</li>
              <li><strong>Comparative Analysis:</strong> Ask the AI to compare multiple options and provide pros/cons before recommending the best approach.</li>
              <li><strong>Error Checking:</strong> Request that the AI review its own output for errors, inconsistencies, or improvements before finalizing.</li>
            </ul>

            <h3 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">Frequently Asked Questions</h3>

            <div className="space-y-4 mt-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Is this AI Prompt Generator really free?</h4>
                <p className="text-gray-700">Yes! 100% free forever with no limits. Generate unlimited prompts for any category without any subscriptions or hidden costs.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Can I use these prompts commercially?</h4>
                <p className="text-gray-700">Absolutely! Use the generated prompts for personal, commercial, business, or any other purpose without restrictions.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Do I need an account to use this tool?</h4>
                <p className="text-gray-700">No account required. Start generating prompts immediately without signing up or providing any information.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Can I modify the generated prompts?</h4>
                <p className="text-gray-700">Yes! The generated prompts are starting points. Feel free to customize, edit, or adapt them to your specific needs.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Which AI tool works best with these prompts?</h4>
                <p className="text-gray-700">All major AI tools (ChatGPT, Claude, Gemini, Bing Copilot) work great. Choose based on your specific needs and preferences.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">How often are prompt templates updated?</h4>
                <p className="text-gray-700">We regularly update templates based on the latest AI capabilities and user feedback to ensure optimal results.</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">Why Choose Our AI Prompt Generator?</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>10+ Specialized Categories:</strong> Comprehensive coverage across all major use cases from marketing to coding.</li>
              <li><strong>Customizable Options:</strong> Adjust tone, length, and context to match your exact needs.</li>
              <li><strong>Professional Quality:</strong> Prompts engineered by experts and tested for effectiveness.</li>
              <li><strong>Instant Results:</strong> Generate optimized prompts in seconds, not hours.</li>
              <li><strong>Universal Compatibility:</strong> Works with all AI tools including ChatGPT, Claude, Gemini, and more.</li>
              <li><strong>No Learning Curve:</strong> Simple, intuitive interface that anyone can use immediately.</li>
              <li><strong>Regular Updates:</strong> Continuously improved based on AI advancements and user needs.</li>
              <li><strong>100% Free:</strong> Full access to all features without any costs or limitations.</li>
            </ul>

            <h3 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">Get Started Now</h3>
            <p>
              Stop wasting time crafting prompts from scratch. Use our AI Prompt Generator to create professional, optimized prompts in seconds. Whether you're a marketer, developer, writer, business owner, or student, our tool helps you get better results from AI tools faster and more consistently.
            </p>
            <p className="font-semibold text-emerald-800 mt-4">
              Start generating perfect AI prompts now and unlock the full potential of ChatGPT, Claude, Gemini, and all AI tools!
            </p>

            <h3 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">Related AI & SEO Tools</h3>
            <p className="mb-4">Enhance your AI and content workflow with our other powerful tools:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a href="/tools/ai-search-ranking-checker" className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-md transition">
                <h4 className="font-semibold text-emerald-700 mb-2">AI Search Ranking Checker</h4>
                <p className="text-sm text-gray-600">Track your website rankings in AI platforms</p>
              </a>
              <a href="/tools/word-counter" className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-md transition">
                <h4 className="font-semibold text-emerald-700 mb-2">Word Counter</h4>
                <p className="text-sm text-gray-600">Count words and characters in your content</p>
              </a>
              <a href="/tools/keyword-density-checker" className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-md transition">
                <h4 className="font-semibold text-emerald-700 mb-2">Keyword Density Checker</h4>
                <p className="text-sm text-gray-600">Analyze keyword frequency for SEO</p>
              </a>
              <a href="/tools/seo-audit" className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-md transition">
                <h4 className="font-semibold text-emerald-700 mb-2">SEO Audit Tool</h4>
                <p className="text-sm text-gray-600">Complete website SEO analysis</p>
              </a>
              <a href="/tools/meta-generator" className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-md transition">
                <h4 className="font-semibold text-emerald-700 mb-2">Meta Tag Generator</h4>
                <p className="text-sm text-gray-600">Create SEO-friendly meta tags</p>
              </a>
              <a href="/tools/content-readability-optimizer" className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-md transition">
                <h4 className="font-semibold text-emerald-700 mb-2">Readability Optimizer</h4>
                <p className="text-sm text-gray-600">Improve content readability scores</p>
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
