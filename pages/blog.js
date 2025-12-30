import Layout from '../components/Layout';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { getSortedPostsData } from '../lib/blog';

export default function Blog({ allPostsData }) {
  return (
    <Layout>
      <Head>
        <title>SEO Blog - Tips, Guides & Best Practices | ProURLMonitor</title>
        <meta name="description" content="Learn SEO tips, website optimization techniques, and digital marketing strategies. Free guides on HTTP status codes, broken links, and technical SEO." />
        <link rel="canonical" href="https://www.prourlmonitor.com/blog" />
      </Head>

      <section className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-6">SEO Blog & Guides</h1>
        <p className="text-gray-600 mb-8">Helpful articles about SEO, website optimization, and digital marketing best practices.</p>
        
        <div className="space-y-6">
          {allPostsData.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article className="card hover:shadow-lg transition-shadow cursor-pointer">
                {post.image && (
                  <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                    <Image 
                      src={post.image} 
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.author}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-emerald-700 mb-2 hover:text-emerald-600">{post.title}</h2>
                <p className="text-gray-600 mt-2">{post.excerpt}</p>
                <div className="mt-4 text-emerald-600 font-medium hover:underline">
                  Read more →
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
