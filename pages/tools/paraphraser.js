import Layout from '../../components/Layout';

export default function Paraphraser() {
  return (
    <Layout>
      <section className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-emerald-700 mb-3">Paraphraser (Coming Soon)</h1>
        <p className="text-gray-700 mb-6">A full paraphrasing tool will be integrated here with multiple rewrite modes, tone selection, and multi-variant outputs.</p>

        <div className="space-y-8">
          <section className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-xl font-bold text-blue-900 mb-3">What is Paraphrasing?</h3>
            <p className="text-blue-800">Paraphrasing rewrites text while preserving meaning. It helps avoid duplication, improve clarity, and adapt tone for different audiences.</p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-emerald-800 mb-3">Planned Features</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Multiple tones: formal, casual, neutral</li>
              <li>Creativity levels: conservative to bold rewrites</li>
              <li>Variant outputs: generate 3–5 alternatives</li>
              <li>Grammar and fluency improvements</li>
              <li>Plagiarism-safe rewriting</li>
            </ul>
          </section>

          <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Related Tools</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <a href="/tools/word-counter" className="text-emerald-600 hover:underline">→ Word Counter</a>
              <a href="/tools/text-cleaner" className="text-emerald-600 hover:underline">→ Text Cleaner</a>
              <a href="/tools/plagiarism" className="text-emerald-600 hover:underline">→ Plagiarism Checker</a>
              <a href="/tools/meta-generator" className="text-emerald-600 hover:underline">→ Meta Tag Generator</a>
            </div>
          </section>
        </div>
      </section>
    </Layout>
  );
}
