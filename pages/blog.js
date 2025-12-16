import Layout from '../components/Layout';
import Link from 'next/link';

const posts = [
  { slug: 'writing-better-metadata', title: 'Writing Better Metadata for SEO', excerpt: 'How to craft titles and descriptions that get clicks.' },
  { slug: 'speed-up-pages', title: 'Speed Up Your Pages: Quick Wins', excerpt: 'Simple optimizations that improve load time and rankings.' }
];

export default function Blog() {
  return (
    <Layout>
      <Head>
        <title>SEO Blog - Domain Analysis Tips & URL Monitoring Guides | ProURLMonitor</title>
        <meta name="description" content="Expert guides on domain analysis, SEO optimization, URL monitoring, backlink building, and web presence management. Learn from SEO professionals." />
        <meta name="keywords" content="SEO blog, domain analysis tips, URL monitoring guide, backlinks strategy, SEO tutorials, digital marketing blog, web analytics guides" />
        <meta property="og:title" content="ProURLMonitor Blog - SEO & Domain Analysis Guides" />
        <meta property="og:description" content="Expert SEO tips and domain analysis tutorials" />
        <meta property="og:url" content="https://prourlmonitor.com/blog" />
        <link rel="canonical" content="https://prourlmonitor.com/blog" />
        <meta name="robots" content="index, follow" />
      </Head>
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-emerald-700 mb-6">Blog</h1>
        <p className="text-gray-600 mb-8">Helpful articles about SEO, content and tooling.</p>

        <div className="space-y-4">
          {posts.map(p => (
            <Link key={p.slug} href={`/blog/${p.slug}`}>
              <article className="card hover:shadow-md transition">
                <h2 className="text-xl font-semibold text-emerald-700">{p.title}</h2>
                <p className="text-gray-600 mt-2">{p.excerpt}</p>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
}
