import Link from 'next/link';
import Layout from '../components/Layout';
import Head from 'next/head';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>ProURLMonitor - Free SEO Tools, Domain Authority Checker & URL Analysis</title>
        <meta name="description" content="ProURLMonitor offers 17+ free SEO tools including Domain Authority Checker, Broken Links Checker, HTTP Status Checker, Meta Tag Generator, and more. Analyze domains, check backlinks, and optimize your website for better search rankings." />
      </Head>
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

      {/* Tools Overview Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="prose prose-emerald max-w-none">
          <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-6">Comprehensive SEO & Domain Analysis Tools</h2>
          
          <div className="text-gray-700 leading-relaxed space-y-4">
            <p>
              ProURLMonitor is your all-in-one platform for <strong>professional SEO analysis and domain intelligence</strong>. Whether you're an SEO specialist, digital marketer, web developer, or website owner, our suite of 17+ free tools helps you optimize your online presence, monitor website health, and improve search engine rankings.
            </p>
            
            <p>
              Our <Link href="/tools/domain-authority-checker" className="text-emerald-600 hover:text-emerald-700 font-medium">Domain Authority Checker</Link> provides instant insights into your website's credibility with accurate DA scores and spam score analysis. Need to ensure your website is crawlable? Use our <Link href="/tools/robots-txt-generator" className="text-emerald-600 hover:text-emerald-700 font-medium">Robots.txt Generator</Link> to create perfectly formatted robots.txt files with AI-powered suggestions. Identify technical issues with our <Link href="/tools/http-status-checker" className="text-emerald-600 hover:text-emerald-700 font-medium">HTTP Status Checker</Link> that scans multiple URLs for 200, 301, 404, and 500 status codes, helping you fix broken pages and redirect chains.
            </p>
            
            <p>
              Optimize your on-page SEO with our <Link href="/tools/meta-generator" className="text-emerald-600 hover:text-emerald-700 font-medium">Meta Tag Generator</Link> for creating perfect title tags and meta descriptions, while the <Link href="/tools/heading-analyzer" className="text-emerald-600 hover:text-emerald-700 font-medium">Heading Analyzer</Link> ensures proper H1-H6 structure. Check your keyword optimization using the <Link href="/tools/keyword-density-checker" className="text-emerald-600 hover:text-emerald-700 font-medium">Keyword Density Checker</Link> to avoid over-optimization penalties. Enhance your search visibility with our <Link href="/tools/schema-generator" className="text-emerald-600 hover:text-emerald-700 font-medium">Schema Markup Generator</Link> that creates JSON-LD structured data for rich snippets.
            </p>
            
            <p>
              For comprehensive website audits, our <Link href="/tools/seo-audit" className="text-emerald-600 hover:text-emerald-700 font-medium">SEO Audit Tool</Link> performs 18+ critical checks including PageSpeed scores, Core Web Vitals, and mobile-friendliness. Maintain site health with the <Link href="/tools/broken-links-checker" className="text-emerald-600 hover:text-emerald-700 font-medium">Broken Links Checker</Link> that scans your entire website for dead links. Monitor your backlink profile and track social engagement using our <Link href="/tools/social-media-counter" className="text-emerald-600 hover:text-emerald-700 font-medium">Social Media Counter</Link>. Need to analyze competitors or check domain history? Try our <Link href="/tools/reverse-ip-domain-checker" className="text-emerald-600 hover:text-emerald-700 font-medium">Reverse IP Domain Checker</Link> and <Link href="/tools/bulk-domain-age-checker" className="text-emerald-600 hover:text-emerald-700 font-medium">Bulk Domain Age Checker</Link> for detailed domain intelligence.
            </p>
            
            <p>
              All our tools are designed with <strong>user experience in mind</strong>—fast loading, no registration required, and most tools run entirely in your browser for maximum privacy and security. From <Link href="/tools/link-extractor" className="text-emerald-600 hover:text-emerald-700 font-medium">Link Extraction</Link> to <Link href="/tools/xml-html-sitemap-generator" className="text-emerald-600 hover:text-emerald-700 font-medium">XML Sitemap Generation</Link>, ProURLMonitor provides everything you need to succeed in modern SEO.
            </p>
          </div>
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
