import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function LoremIpsumGenerator() {
  const [paragraphs, setParagraphs] = useState(3);
  const [wordsPerParagraph, setWordsPerParagraph] = useState(50);
  const [outputType, setOutputType] = useState('paragraphs');
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState('');

  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'semper', 'risus',
    'viverra', 'accumsan', 'lacus', 'vel', 'facilisis', 'volutpat', 'mauris',
    'nunc', 'congue', 'nec', 'ultrices', 'dui', 'sapien', 'eget', 'mi', 'proin'
  ];

  const generateWord = () => {
    return loremWords[Math.floor(Math.random() * loremWords.length)];
  };

  const generateSentence = (minWords = 5, maxWords = 15) => {
    const wordCount = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
    const words = [];
    for (let i = 0; i < wordCount; i++) {
      words.push(generateWord());
    }
    return words.join(' ').charAt(0).toUpperCase() + words.join(' ').slice(1) + '.';
  };

  const generateParagraph = (wordCount) => {
    let paragraph = '';
    let currentWords = 0;
    while (currentWords < wordCount) {
      const sentence = generateSentence();
      const sentenceWords = sentence.split(' ').length;
      if (currentWords + sentenceWords <= wordCount + 5) {
        paragraph += sentence + ' ';
        currentWords += sentenceWords;
      } else {
        break;
      }
    }
    return paragraph.trim();
  };

  const generateLorem = () => {
    let result = '';

    if (outputType === 'paragraphs') {
      const paraArray = [];
      for (let i = 0; i < paragraphs; i++) {
        let para = generateParagraph(wordsPerParagraph);
        if (startWithLorem && i === 0) {
          para = 'Lorem ipsum dolor sit amet, ' + para.substring(para.indexOf(' ') + 1);
        }
        paraArray.push(para);
      }
      result = paraArray.join('\n\n');
    } else if (outputType === 'words') {
      const words = [];
      for (let i = 0; i < paragraphs * wordsPerParagraph; i++) {
        words.push(generateWord());
      }
      if (startWithLorem) {
        words[0] = 'Lorem';
        words[1] = 'ipsum';
      }
      result = words.join(' ');
    } else if (outputType === 'sentences') {
      const sentences = [];
      const sentenceCount = paragraphs;
      for (let i = 0; i < sentenceCount; i++) {
        sentences.push(generateSentence(10, 20));
      }
      if (startWithLorem) {
        sentences[0] = 'Lorem ipsum dolor sit amet, ' + sentences[0].substring(sentences[0].indexOf(' ') + 1);
      }
      result = sentences.join(' ');
    } else if (outputType === 'lists') {
      const items = [];
      for (let i = 0; i < paragraphs; i++) {
        items.push('• ' + generateSentence(3, 8));
      }
      result = items.join('\n');
    }

    setOutput(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    alert('Copied to clipboard!');
  };

  const clearAll = () => {
    setOutput('');
  };

  const getStats = () => {
    if (!output) return { chars: 0, words: 0, paragraphs: 0, sentences: 0 };
    const chars = output.length;
    const words = output.trim().split(/\s+/).length;
    const paragraphs = output.split('\n\n').length;
    const sentences = output.split(/[.!?]+/).filter(s => s.trim()).length;
    return { chars, words, paragraphs, sentences };
  };

  const stats = getStats();

  return (
    <Layout>
      <Head>
        <title>Lorem Ipsum Generator - Placeholder Text Generator</title>
        <meta name="description" content="Generate Lorem Ipsum dummy text for design mockups and layouts. Free placeholder text generator with customizable paragraphs and words." />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/lorem-ipsum-generator" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Lorem Ipsum Generator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Generate placeholder text for your designs and mockups. Customize length, format, and output type.
            </p>
          </div>

          {/* Tool Interface */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            {/* Settings */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Generator Settings
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Output Type</label>
                  <select
                    value={outputType}
                    onChange={(e) => setOutputType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="paragraphs">Paragraphs</option>
                    <option value="sentences">Sentences</option>
                    <option value="words">Words</option>
                    <option value="lists">List Items</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">
                    {outputType === 'paragraphs' ? 'Number of Paragraphs' : 
                     outputType === 'sentences' ? 'Number of Sentences' :
                     outputType === 'lists' ? 'Number of Items' : 'Total Words'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={paragraphs}
                    onChange={(e) => setParagraphs(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                {outputType === 'paragraphs' && (
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Words per Paragraph</label>
                    <input
                      type="number"
                      min="10"
                      max="200"
                      value={wordsPerParagraph}
                      onChange={(e) => setWordsPerParagraph(parseInt(e.target.value) || 50)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                )}
              </div>
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={startWithLorem}
                    onChange={(e) => setStartWithLorem(e.target.checked)}
                    className="w-4 h-4 text-orange-600 focus:ring-orange-500 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Start with "Lorem ipsum dolor sit amet"</span>
                </label>
              </div>
            </div>

            {/* Generate Button */}
            <div className="mb-6">
              <button
                onClick={generateLorem}
                className="w-full md:w-auto px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium shadow-lg"
              >
                📝 Generate Lorem Ipsum
              </button>
            </div>

            {/* Output Section */}
            {output && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Generated Text
                </label>
                <textarea
                  value={output}
                  readOnly
                  className="w-full h-96 p-4 border border-gray-300 rounded-lg bg-gray-50 resize-none text-sm"
                />
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>Characters: {stats.chars.toLocaleString()}</span>
                  <span>Words: {stats.words.toLocaleString()}</span>
                  <span>Paragraphs: {stats.paragraphs}</span>
                  <span>Sentences: {stats.sentences}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {output && (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={copyToClipboard}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-lg"
                >
                  📋 Copy to Clipboard
                </button>
                <button
                  onClick={clearAll}
                  className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  Clear
                </button>
              </div>
            )}

            {/* Info Notice */}
            <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400">
              <div className="flex">
                <span className="text-blue-400 mr-3">💡</span>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">About Lorem Ipsum</h4>
                  <p className="text-sm text-blue-700">
                    Lorem Ipsum is dummy text used in printing and typesetting since the 1500s. 
                    It's derived from Latin literature and provides realistic-looking placeholder content.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Information Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              About Lorem Ipsum
            </h2>

            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">What is Lorem Ipsum?</h3>
                <p>
                  Lorem Ipsum is placeholder text commonly used in the graphic design, printing, and publishing industries. 
                  It's been the industry standard dummy text since the 1500s, when an unknown printer scrambled a galley 
                  of type to create a type specimen book. The text is derived from sections 1.10.32 and 1.10.33 of 
                  "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Why Use Lorem Ipsum?</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Focus on Design:</strong> Prevents distracting readable content during design phase</li>
                  <li><strong>Realistic Layout:</strong> Shows how actual text will look in the final design</li>
                  <li><strong>Industry Standard:</strong> Universally recognized by designers and clients</li>
                  <li><strong>Language Neutral:</strong> Doesn't favor any particular language or bias</li>
                  <li><strong>Natural Distribution:</strong> Letter frequency resembles normal English text</li>
                  <li><strong>Prevent Premature Judgement:</strong> Clients focus on design rather than content</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Common Use Cases</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-2">🎨 Design & Mockups</h4>
                    <p className="text-sm">
                      Fill website layouts, app interfaces, and graphic designs with realistic-looking text 
                      to visualize final appearance.
                    </p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <h4 className="font-semibold text-amber-800 mb-2">💻 Web Development</h4>
                    <p className="text-sm">
                      Test layouts, responsive designs, and typography settings during website development 
                      before real content is available.
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2">📱 App Prototypes</h4>
                    <p className="text-sm">
                      Create realistic mobile and desktop app prototypes that demonstrate UI/UX 
                      without requiring final copy.
                    </p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-2">📄 Print Design</h4>
                    <p className="text-sm">
                      Fill brochures, magazines, and marketing materials to show layout and typography 
                      before content is finalized.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Output Type Guide</h3>
                <div className="space-y-3">
                  <div className="flex items-start border-l-4 border-orange-500 pl-4">
                    <div>
                      <h4 className="font-semibold mb-1">📄 Paragraphs</h4>
                      <p className="text-sm">
                        Multiple paragraphs of text separated by line breaks. Best for blog posts, articles, 
                        and long-form content layouts.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start border-l-4 border-amber-500 pl-4">
                    <div>
                      <h4 className="font-semibold mb-1">📝 Sentences</h4>
                      <p className="text-sm">
                        Individual sentences with proper punctuation. Ideal for short descriptions, 
                        captions, and UI text.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start border-l-4 border-yellow-500 pl-4">
                    <div>
                      <h4 className="font-semibold mb-1">🔤 Words</h4>
                      <p className="text-sm">
                        Continuous stream of words without punctuation. Useful for testing text wrapping 
                        and character limits.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start border-l-4 border-red-500 pl-4">
                    <div>
                      <h4 className="font-semibold mb-1">• List Items</h4>
                      <p className="text-sm">
                        Bullet-pointed list items. Perfect for navigation menus, feature lists, 
                        and itemized content.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <h4 className="font-semibold text-yellow-800 mb-2">Pro Tips</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Use realistic amounts of text to accurately test layouts</li>
                  <li>• Test with both short and long paragraphs for edge cases</li>
                  <li>• Replace Lorem Ipsum with real content as soon as available</li>
                  <li>• Consider using real draft content instead of Lorem Ipsum when possible</li>
                  <li>• Remember that Lorem Ipsum doesn't test readability of actual content</li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What does Lorem Ipsum mean?
                </h3>
                <p className="text-gray-700">
                  Lorem Ipsum is derived from Latin text by Cicero from 45 BC. The phrase "Lorem ipsum dolor sit amet" 
                  roughly translates to "pain itself" or "suffering". However, the text is scrambled and doesn't form 
                  coherent sentences in Latin.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Is Lorem Ipsum copyrighted?
                </h3>
                <p className="text-gray-700">
                  No, Lorem Ipsum is in the public domain. The original Latin text is over 2000 years old, 
                  and the scrambled version has been used freely in the printing industry since the 1500s. 
                  You can use it without any legal restrictions.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Should I always start with "Lorem ipsum dolor sit amet"?
                </h3>
                <p className="text-gray-700">
                  It's traditional but not required. Starting with the classic phrase makes it immediately recognizable 
                  as placeholder text. However, for variety or testing purposes, you can disable this option to generate 
                  random Lorem Ipsum text throughout.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Are there alternatives to Lorem Ipsum?
                </h3>
                <p className="text-gray-700">
                  Yes, alternatives include Hipster Ipsum, Bacon Ipsum, and actual draft content. However, Lorem Ipsum 
                  remains the industry standard because it's neutral, doesn't distract with humor, and has natural 
                  letter distribution similar to English.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How much Lorem Ipsum should I use?
                </h3>
                <p className="text-gray-700">
                  Use enough to realistically represent the final content. For a blog post layout, use 3-5 paragraphs. 
                  For a landing page hero section, use 1-2 sentences. Match the volume of text you expect in production.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
