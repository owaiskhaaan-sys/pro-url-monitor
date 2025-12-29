import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function WordCounter() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState(null);

  const analyzeText = () => {
    if (!text.trim()) {
      alert('Please enter some text');
      return;
    }

    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length;
    const readingTime = Math.ceil(words.length / 200); // Average reading speed

    setStats({
      words: words.length,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingTime
    });
  };

  return (
    <Layout>
      <Head>
        <title>Word Counter - Character & Sentence Counter | ProURLMonitor</title>
        <meta name="description" content="Free word counter tool. Count words, characters, sentences, and paragraphs. Get reading time estimates." />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4">Word Counter</h1>
        <p className="text-gray-600 mb-8">Count words, characters, sentences, and get reading time</p>

        <div className="card mb-6">
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (e.target.value.trim()) analyzeText();
            }}
            rows="10"
            placeholder="Type or paste your text here..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 mb-4"
          />

          <button onClick={analyzeText} className="btn btn-primary w-full">
            📊 Analyze Text
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="card text-center bg-emerald-50">
              <div className="text-3xl font-bold text-emerald-700">{stats.words}</div>
              <div className="text-sm text-gray-600">Words</div>
            </div>
            <div className="card text-center bg-blue-50">
              <div className="text-3xl font-bold text-blue-700">{stats.characters}</div>
              <div className="text-sm text-gray-600">Characters</div>
            </div>
            <div className="card text-center bg-purple-50">
              <div className="text-3xl font-bold text-purple-700">{stats.charactersNoSpaces}</div>
              <div className="text-sm text-gray-600">Characters (no spaces)</div>
            </div>
            <div className="card text-center bg-orange-50">
              <div className="text-3xl font-bold text-orange-700">{stats.sentences}</div>
              <div className="text-sm text-gray-600">Sentences</div>
            </div>
            <div className="card text-center bg-pink-50">
              <div className="text-3xl font-bold text-pink-700">{stats.paragraphs}</div>
              <div className="text-sm text-gray-600">Paragraphs</div>
            </div>
            <div className="card text-center bg-teal-50">
              <div className="text-3xl font-bold text-teal-700">{stats.readingTime} min</div>
              <div className="text-sm text-gray-600">Reading Time</div>
            </div>
          </div>
        )}
      </div>

        {/* Comprehensive Content Sections */}
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
          <section className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-emerald-800 mb-6">What is a Word Counter Tool?</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p className="mb-4">A word counter tool is an essential utility for writers, students, content creators, bloggers, and professionals who need to track the length of their written content. This free online word counter provides instant statistics about your text, including word count, character count, sentence count, paragraph count, and estimated reading time. Whether you're writing essays, articles, social media posts, or professional documents, our word counter helps you meet specific word count requirements and optimize your content length.</p>
              <p className="mb-4">Word counting is crucial in many scenarios: students need to meet assignment requirements, content writers must adhere to article length guidelines, social media managers need to stay within platform character limits, and SEO specialists aim for optimal content length for search engine rankings. Our tool processes your text in real-time, giving you immediate feedback as you type or paste content.</p>
            </div>
          </section>

          <section className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-emerald-800 mb-6">Key Features of Our Word Counter</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p className="mb-4">Our word counter tool offers comprehensive text analysis features that go beyond simple word counting. The tool provides accurate word count by splitting text based on whitespace and filtering empty strings, ensuring precise results even with irregular spacing. Character count includes both total characters and characters excluding spaces, which is particularly useful for platforms with character limits like Twitter or SMS messaging.</p>
              <p className="mb-4">The sentence counter identifies sentences by detecting punctuation marks (periods, exclamation points, question marks) and filters out empty results. Paragraph counting helps you understand content structure by identifying line breaks. The reading time estimator calculates how long it would take an average reader to consume your content, based on the standard reading speed of 200 words per minute. This feature is particularly valuable for bloggers and content marketers who want to provide reading time estimates to their audience.</p>
            </div>
          </section>

          <section className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-emerald-800 mb-6">How to Use the Word Counter</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p className="mb-4">Using our word counter is incredibly simple and intuitive. Start by typing directly into the text area or paste your existing content from any source. The tool automatically analyzes your text in real-time as you type, providing instant updates to all statistics. You can also click the "Analyze Text" button to get a comprehensive breakdown of your content metrics.</p>
              <p className="mb-4">The results are displayed in an easy-to-read grid format with color-coded cards for each metric. The green card shows total words, blue displays character count with spaces, purple shows characters without spaces, orange indicates sentence count, pink displays paragraph count, and teal shows estimated reading time. This visual organization makes it easy to quickly identify the metrics you need. The tool works entirely in your browser, ensuring your content remains private and secure - no data is sent to any server.</p>
            </div>
          </section>

          <section className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-emerald-800 mb-6">Why Word Count Matters for SEO</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p className="mb-4">Word count plays a significant role in search engine optimization (SEO) and content performance. Search engines like Google tend to favor comprehensive, in-depth content that thoroughly covers a topic. Studies have shown that longer articles (typically 1000-2000 words) often rank higher in search results because they provide more value to readers and demonstrate expertise on the subject.</p>
              <p className="mb-4">However, quality always trumps quantity - simply adding words without value will not improve rankings. The key is to use word count as a guideline while ensuring every word contributes meaningful information. Content length should match user intent: quick answers might only need 300-500 words, while comprehensive guides might require 2000-5000 words. Our word counter helps you monitor your content length and ensure you're providing sufficient depth without unnecessary fluff.</p>
              <p className="mb-4">For blog posts, aim for at least 1000 words to thoroughly explore your topic. Product descriptions might only need 150-300 words but should be informative and persuasive. Social media posts have varying limits: Twitter allows 280 characters, Facebook posts are most engaging at 40-80 characters, and LinkedIn articles perform well at 1900-2000 words.</p>
            </div>
          </section>

          <section className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-emerald-800 mb-6">Best Practices for Content Length</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p className="mb-4">Understanding optimal content length for different platforms and purposes is crucial for effective communication. For academic writing, always adhere to assignment guidelines - essays typically range from 500 to 5000 words depending on the level and subject. Research papers often require 3000-10000 words with proper citations and references.</p>
              <p className="mb-4">Blog posts should be at least 300 words for basic topics, but aim for 1000-2500 words for comprehensive guides and tutorials. News articles typically range from 500-800 words, while feature articles can extend to 2000-3000 words. For email marketing, keep messages between 50-125 words for optimal engagement - recipients prefer concise, actionable content.</p>
              <p className="mb-4">Website copy should be concise yet informative: homepage content works well at 350-600 words, about pages at 200-500 words, and service pages at 300-750 words. Landing pages for conversions should be longer, around 500-1000 words, to fully explain benefits and overcome objections. Meta descriptions should be 150-160 characters to avoid truncation in search results. Product descriptions should be detailed enough to inform purchase decisions, typically 150-400 words depending on product complexity.</p>
            </div>
          </section>

          <section className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-emerald-800 mb-6">Common Use Cases</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p className="mb-4">Writers and editors use word counters to meet publisher requirements and maintain consistency across articles. A magazine might require articles between 800-1200 words, and our tool helps writers stay within those boundaries. Students rely on word counters to ensure their essays and assignments meet minimum and maximum word requirements - submitting under-length or over-length work can result in grade penalties.</p>
              <p className="mb-4">Content marketers use word count analysis to optimize blog posts for SEO, ensuring articles are comprehensive enough to rank well while remaining engaging. Social media managers check character counts before posting to ensure messages aren't truncated on platforms with character limits. Copywriters use word counters to craft concise, impactful ad copy that delivers maximum message in minimum space.</p>
              <p className="mb-4">Translators often charge by word count, making accurate word counting essential for project quotes and invoicing. Authors track daily word count to monitor progress on books and maintain consistent writing habits - many successful authors aim for 1000-2000 words per day. Journalists use word counters to meet strict article length requirements for print publications where space is limited. Resume writers ensure CVs stay within the recommended 400-800 words to maintain recruiter interest.</p>
            </div>
          </section>

        </div>

        {/* Comprehensive Content Section */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <section className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-emerald-800 mb-6">About This Tool</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p className="mb-4">Our Word Counter is a powerful, free online tool designed to help you count words, characters, sentences, paragraphs, and reading time in your text. This professional-grade tool provides accurate results instantly, making it an essential resource for web developers, SEO professionals, digital marketers, and content creators. Whether you are working on a small personal project or managing enterprise-level campaigns, our tool delivers the reliability and precision you need.</p>
              <p className="mb-4">The Word Counter streamlines your workflow by automating complex tasks that would otherwise require manual effort or expensive software. With a user-friendly interface and instant results, you can complete your work faster and more efficiently. Our tool is completely web-based, meaning you do not need to install any software or plugins - simply open your browser and start using it immediately.</p>
              <p className="mb-4">Using a dedicated Word Counter offers numerous advantages over manual methods or generic solutions. First and foremost, it saves you valuable time by processing information quickly and accurately. Second, it eliminates human error that can occur when performing these tasks manually. Third, it provides consistent, standardized results that you can rely on for professional work.</p>
              <p className="mb-4">Professional users choose our Word Counter because it combines power with simplicity. You do not need technical expertise to use it effectively - the intuitive interface guides you through each step. At the same time, the tool offers advanced capabilities that satisfy the needs of experienced professionals who require precision and flexibility in their work.</p>
              <p className="mb-4">Our Word Counter includes features specifically designed for modern web workflows. The tool processes your requests instantly, providing results in real-time without delays. It handles both small-scale and large-scale operations efficiently, scaling to meet your specific needs. The clean, organized output format makes it easy to understand and use the results immediately.</p>
              <p className="mb-4">Security and privacy are paramount in our design. Your data is processed locally in your browser whenever possible, ensuring that sensitive information never leaves your device. For tools that require server processing, we use encrypted connections and never store your data permanently. You can use our tools with confidence, knowing that your information remains private and secure.</p>
              <p className="mb-4">The Word Counter serves multiple important use cases across different industries and professions. Students use it to ensure essays meet word count requirements. Content writers use it to optimize article length for SEO. Social media managers use it to stay within character limits. Bloggers use it to track writing progress and maintain consistency. Each of these applications benefits from the speed, accuracy, and convenience that our tool provides.</p>
              <p className="mb-4">Web developers use this tool daily to streamline their development workflows and ensure code quality. SEO professionals rely on it for optimization tasks that improve search engine rankings. Content marketers leverage it to enhance their content strategy and measure performance. Digital agencies use it to deliver better results for their clients more efficiently.</p>
              <p className="mb-4">To get the most value from our Word Counter, follow these best practices. First, ensure you provide clean, well-formatted input data - while the tool can handle various formats, clean input produces the best results. Second, review the output carefully and understand what each metric or result means for your specific use case.</p>
              <p className="mb-4">For optimal results, integrate this tool into your regular workflow rather than using it as an occasional resource. Consistent use helps you become more familiar with its capabilities and identify patterns in your data. Many professionals bookmark this page and use it multiple times daily as part of their standard operating procedures.</p>
              <p className="mb-4">Consider combining this Word Counter with other tools in our suite for comprehensive analysis and optimization. Our tools are designed to work together, allowing you to build a complete workflow that addresses all aspects of your project. For example, you might use multiple tools in sequence to analyze, optimize, and validate your work.</p>
              <p className="mb-4">The Word Counter is built using modern web technologies that ensure fast performance and broad browser compatibility. It works seamlessly across all major browsers including Chrome, Firefox, Safari, and Edge. The responsive design adapts to any screen size, allowing you to use the tool effectively on desktop computers, laptops, tablets, and smartphones.</p>
              <p className="mb-4">We regularly update and improve the tool based on user feedback and evolving industry standards. Our development team monitors tool performance continuously and implements optimizations to maintain fast processing speeds. Updates are deployed automatically, so you always have access to the latest features and improvements without needing to download or install anything.</p>
              <p className="mb-4">Compared to alternative solutions, our Word Counter offers distinct advantages. Unlike software-based tools that require installation and updates, our web-based tool is always accessible and up-to-date. Unlike limited free tools that impose restrictions, our tool provides professional-grade capabilities without artificial limitations or usage caps.</p>
              <p className="mb-4">Many similar tools require account creation or subscription fees. We believe in providing value freely and openly, which is why our Word Counter is available to everyone without registration or payment. You can bookmark this page and return anytime you need the tool without worrying about subscriptions expiring or accounts being locked.</p>
              <p className="mb-4">If you encounter any issues or have questions about using the Word Counter, our support resources are here to help. The tool includes built-in help text and examples that guide you through the process. For more complex questions, you can refer to our comprehensive documentation or contact our support team who are happy to assist you.</p>
              <p className="mb-4">We welcome feedback and suggestions for improving the Word Counter. If you have ideas for new features or encounter bugs, please let us know so we can continue enhancing the tool. Your input directly influences our development priorities and helps us create tools that better serve the community.</p>
              <p className="mb-4">The Word Counter represents our commitment to providing high-quality, accessible tools for web professionals and enthusiasts. Whether you use it occasionally or rely on it daily, we hope it makes your work easier, faster, and more effective. Thank you for choosing our tool, and we look forward to supporting your continued success.</p>
            </div>
          </section>
        </div>


    </Layout>
  );
}
