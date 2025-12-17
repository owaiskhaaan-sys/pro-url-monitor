import Link from 'next/link';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-emerald-800 mb-4 leading-tight">Complete Domain & URL Intelligence Tools</h1>
        <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">ProURLMonitor provides a comprehensive suite of domain analysis, SEO auditing, and URL monitoring tools. Check domain authority, analyze backlinks, verify domain history, and monitor your web presence — all in one platform.</p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Link href="/tools" className="btn btn-primary text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 w-full sm:w-auto">Explore Tools</Link>
          <Link href="/blog" className="btn btn-secondary text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 w-full sm:w-auto">Read Blog</Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-4 sm:mb-6">Popular Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
            title: 'Meta Tag Generator',
            href: '/tools/meta-generator',
            desc: 'Generate SEO-friendly title tags, meta descriptions, and Open Graph tags with character counter.'
          },{
            title: 'Keyword Density Checker',
            href: '/tools/keyword-density-checker',
            desc: 'Analyze keyword frequency and density to avoid keyword stuffing and optimize content.'
          },{
            title: 'Heading Tag Analyzer',
            href: '/tools/heading-analyzer',
            desc: 'Check your H1-H6 heading structure for SEO best practices and accessibility.'
          },{
            title: 'Schema Markup Generator',
            href: '/tools/schema-generator',
            desc: 'Create JSON-LD structured data for rich snippets in Google search results.'
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

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Why ProURLMonitor?</h2>
        <ul className="list-disc pl-5 sm:pl-6 text-gray-700 space-y-2 text-sm sm:text-base">
          <li>17 professional domain, link, and SEO analysis tools.</li>
          <li>Fast, secure, and most tools run fully in your browser — no uploads.</li>
          <li>Monitor domain health, track backlinks, check rankings, and verify URL safety.</li>
        </ul>
      </section>
    </Layout>
  );
}
