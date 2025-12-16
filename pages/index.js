import Link from 'next/link';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-extrabold text-emerald-800 mb-4">Complete Domain & URL Intelligence Tools</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">ProURLMonitor provides a comprehensive suite of domain analysis, SEO auditing, and URL monitoring tools. Check domain authority, analyze backlinks, verify domain history, and monitor your web presence — all in one platform.</p>

        <div className="flex gap-4 justify-center">
          <Link href="/tools" className="btn btn-primary text-lg px-8 py-3">Explore Tools</Link>
          <Link href="/blog" className="btn btn-secondary text-lg px-8 py-3">Read Blog</Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-emerald-700 mb-6">Popular Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[{
            title: 'SEO Audit Tool',
            href: '/tools/seo-audit',
            desc: 'Complete website SEO analysis with PageSpeed scores, Core Web Vitals, and 18+ checks.'
          },{
            title: 'Robots.txt Generator',
            href: '/tools/robots-txt-generator',
            desc: 'AI-powered robots.txt file generator with live preview and download.'
          },{
            title: 'HTTP Status Checker',
            href: '/tools/http-status-checker',
            desc: 'Check 200, 301, 404, 500 status codes and redirects for multiple URLs.'
          },{
            title: 'Domain Authority Checker',
            href: '/tools/domain-authority-checker',
            desc: 'Check domain authority and spam score instantly.'
          },{
            title: 'Bulk Domain Age Checker',
            href: '/tools/bulk-domain-age-checker',
            desc: 'Check creation dates for multiple domains at once.'
          },{
            title: 'Reverse IP Domain Checker',
            href: '/tools/reverse-ip-domain-checker',
            desc: 'Find all domains hosted on a specific IP address.'
          },{
            title: 'Broken Links Checker',
            href: '/tools/broken-links-checker',
            desc: 'Scan and identify all broken links on your website.'
          },{
            title: 'Social Media Counter',
            href: '/tools/social-media-counter',
            desc: 'Track social shares across Facebook, Twitter, LinkedIn.'
          },{
            title: 'Link Extractor',
            href: '/tools/link-extractor',
            desc: 'Extract and download all links from text or HTML.'
          }].map((t, i) => (
            <div key={i} className="card">
              <h3 className="text-xl font-semibold mb-2 text-emerald-700">{t.title}</h3>
              <p className="text-gray-600 mb-4">{t.desc}</p>
              <Link href={t.href} className="btn btn-primary">Open Tool</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-4">Why ProURLMonitor?</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>17 professional domain, link, and SEO analysis tools.</li>
          <li>Fast, secure, and most tools run fully in your browser — no uploads.</li>
          <li>Monitor domain health, track backlinks, check rankings, and verify URL safety.</li>
        </ul>
      </section>
    </Layout>
  );
}
