import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function TextCleaner() {
  const [text, setText] = useState('');

  function clean() {
    // Remove extra spaces and normalize line breaks
    const cleaned = text.replace(/\s+\n/g, '\n').replace(/\n{2,}/g, '\n\n').replace(/[ \t]{2,}/g, ' ').trim();
    setText(cleaned);
  }

  return (
    <Layout>
      <Head>
        <title>Text Cleaner - Remove Extra Spaces & Format Text</title>
        <meta name="description" content="Clean and format text by removing extra spaces, line breaks, and special characters. Free text cleaning tool to sanitize your content." />
      </Head>
      <section className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-emerald-700 mb-3">Text Cleaner</h1>
        <p className="text-gray-600 mb-4">Remove extra spaces, normalize line breaks, and tidy up copy for publishing.</p>

        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10}
          className="w-full p-3 rounded border border-gray-200 resize-y" placeholder="Paste text to clean..." />

        <div className="flex gap-2 mt-3">
          <button onClick={clean} className="btn btn-primary">Clean Text</button>
          <button onClick={() => setText('')} className="btn btn-secondary">Clear</button>
        </div>
      </section>

      <section className="mt-12 space-y-8">
        <section className="bg-blue-50 p-8 rounded-lg border border-blue-200">
          <h3 className="text-2xl font-bold text-blue-900 mb-4">What is Text Cleaning?</h3>
          <p className="text-blue-800 mb-4">Text cleaning removes extra spaces, fixes line breaks, and normalizes formatting so your content is ready for publishing, SEO, and readability.</p>
          <p className="text-blue-800">Clean text improves copy quality, ensures consistent formatting across platforms, and reduces manual editing time.</p>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-emerald-800 mb-4">How to Use</h3>
          <ol className="list-decimal pl-6 space-y-3 text-gray-700">
            <li>Paste your text into the box</li>
            <li>Click "Clean Text" to normalize spacing and line breaks</li>
            <li>Review the cleaned text</li>
            <li>Copy/paste into your CMS, docs, or emails</li>
          </ol>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-emerald-800 mb-4">Benefits</h3>
          <ul className="list-disc pl-6 space-y-3 text-gray-700">
            <li><strong>Formatting Consistency:</strong> Remove messy spacing instantly</li>
            <li><strong>Publishing Ready:</strong> Clean copy for CMS or email</li>
            <li><strong>SEO Friendly:</strong> Avoid formatting artifacts in HTML</li>
            <li><strong>Time Saving:</strong> One-click cleanup vs manual edits</li>
          </ul>
        </section>

        <section className="bg-gray-50 p-8 rounded-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Related Content Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <a href="/tools/word-counter" className="text-emerald-600 hover:underline">→ Word Counter</a>
            <a href="/tools/meta-generator" className="text-emerald-600 hover:underline">→ Meta Tag Generator</a>
            <a href="/tools/paraphraser" className="text-emerald-600 hover:underline">→ Paraphraser</a>
            <a href="/tools/plagiarism" className="text-emerald-600 hover:underline">→ Plagiarism Checker</a>
          </div>
        </section>
      </section>
    </Layout>
  );
}
