import Layout from '../../components/Layout';

export default function Plagiarism() {
  return (
    <Layout>
      <section className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-emerald-700 mb-3">Plagiarism Checker (Coming Soon)</h1>
        <p className="text-gray-700 mb-6">Full plagiarism detection requires server-side indexing and external APIs. This page outlines planned capabilities and interim guidance.</p>

        <div className="space-y-8">
          <section className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-xl font-bold text-blue-900 mb-3">What is Plagiarism Checking?</h3>
            <p className="text-blue-800">Plagiarism checking compares your text against large indexes of web pages and publications to find duplicate or highly similar content.</p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-emerald-800 mb-3">Planned Features</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Deep web + academic index scanning</li>
              <li>Similarity percentages and highlighted matches</li>
              <li>Source links and citation suggestions</li>
              <li>Batch document uploads (DOCX/PDF/TXT)</li>
              <li>Downloadable reports</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-emerald-800 mb-3">Interim Guidance</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Use trusted online checkers for now and keep your text local</li>
              <li>Paraphrase and cite sources properly</li>
              <li>Keep originality above 90% for safety</li>
            </ul>
          </section>

          <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Related Tools</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <a href="/tools/paraphraser" className="text-emerald-600 hover:underline">→ Paraphraser</a>
              <a href="/tools/word-counter" className="text-emerald-600 hover:underline">→ Word Counter</a>
              <a href="/tools/text-cleaner" className="text-emerald-600 hover:underline">→ Text Cleaner</a>
              <a href="/tools/meta-generator" className="text-emerald-600 hover:underline">→ Meta Tag Generator</a>
            </div>
          </section>
        </div>
      </section>
    </Layout>
  );
}
