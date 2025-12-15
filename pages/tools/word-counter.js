import { useState } from 'react';
import Layout from '../../components/Layout';

export default function WordCounter() {
  const [text, setText] = useState('');

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const sentences = (text.match(/[.!?]+/g) || []).length;
  const readingMinutes = (words / 200).toFixed(2);

  return (
    <Layout>
      <section className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-emerald-700 mb-3">Word Counter</h1>
        <p className="text-gray-600 mb-4">Paste your text below to get word, character, sentence counts and estimated reading time.</p>

        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10}
          className="w-full p-3 rounded border border-gray-200 resize-y" placeholder="Paste or type text here..." />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          <div className="card text-center">
            <div className="text-sm text-gray-500">Words</div>
            <div className="text-xl font-bold">{words}</div>
          </div>
          <div className="card text-center">
            <div className="text-sm text-gray-500">Characters</div>
            <div className="text-xl font-bold">{chars}</div>
          </div>
          <div className="card text-center">
            <div className="text-sm text-gray-500">Sentences</div>
            <div className="text-xl font-bold">{sentences}</div>
          </div>
          <div className="card text-center">
            <div className="text-sm text-gray-500">Reading (mins)</div>
            <div className="text-xl font-bold">{readingMinutes}</div>
          </div>
        </div>
      </section>

      <section className="mt-12 space-y-8">
        <section className="bg-blue-50 p-8 rounded-lg border border-blue-200">
          <h3 className="text-2xl font-bold text-blue-900 mb-4">What is a Word Counter?</h3>
          <p className="text-blue-800 mb-4">A word counter calculates the number of words, characters, and sentences in your text. This helps with SEO limits, content briefs, academic word counts, and readability checks.</p>
          <p className="text-blue-800">Use it to meet platform limits (meta descriptions, ads, social posts), ensure consistency, and estimate reading time for your audience.</p>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-emerald-800 mb-4">How to Use</h3>
          <ol className="list-decimal pl-6 space-y-3 text-gray-700">
            <li>Paste or type your text into the box</li>
            <li>View live counts for words, characters, and sentences</li>
            <li>Check estimated reading time to plan length</li>
            <li>Edit and refine until you hit the desired limits</li>
          </ol>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-emerald-800 mb-4">Why Use This Tool?</h3>
          <ul className="list-disc pl-6 space-y-3 text-gray-700">
            <li><strong>SEO & Meta Limits:</strong> Keep copy within platform character limits</li>
            <li><strong>Content Planning:</strong> Align length with briefs and guidelines</li>
            <li><strong>Readability:</strong> Estimate time-to-read for your audience</li>
            <li><strong>Editing Speed:</strong> Instant counts as you type</li>
          </ul>
        </section>

        <section className="bg-gray-50 p-8 rounded-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Related Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <a href="/tools/text-cleaner" className="text-emerald-600 hover:underline">→ Text Cleaner</a>
            <a href="/tools/meta-generator" className="text-emerald-600 hover:underline">→ Meta Tag Generator</a>
            <a href="/tools/paraphraser" className="text-emerald-600 hover:underline">→ Paraphraser</a>
            <a href="/tools/plagiarism" className="text-emerald-600 hover:underline">→ Plagiarism Checker</a>
          </div>
        </section>
      </section>
    </Layout>
  );
}
