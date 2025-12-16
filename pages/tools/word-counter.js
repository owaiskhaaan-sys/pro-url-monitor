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
    </Layout>
  );
}
