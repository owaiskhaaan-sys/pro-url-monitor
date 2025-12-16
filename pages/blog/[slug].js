import Layout from '../../components/Layout';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { getAllPostSlugs, getPostData } from '../../lib/blog';

export default function Post({ postData }) {
  return (
    <Layout>
      <Head>
        <title>{postData.title} | ProURLMonitor</title>
        <meta name="description" content={postData.excerpt} />
        <meta name="keywords" content={postData.keywords} />
        <meta name="author" content={postData.author} />
        
        {/* Open Graph */}
        <meta property="og:title" content={postData.title} />
        <meta property="og:description" content={postData.excerpt} />
        <meta property="og:type" content="article" />
        {postData.image && <meta property="og:image" content={`https://www.prourlmonitor.com${postData.image}`} />}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={postData.title} />
        <meta name="twitter:description" content={postData.excerpt} />
        {postData.image && <meta name="twitter:image" content={`https://www.prourlmonitor.com${postData.image}`} />}
      </Head>

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-emerald-600">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{postData.title}</span>
        </nav>

        {/* Featured Image */}
        {postData.image && (
          <div className="relative w-full h-64 sm:h-96 mb-8 rounded-lg overflow-hidden">
            <Image 
              src={postData.image} 
              alt={postData.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Post Meta */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{postData.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>By {postData.author}</span>
            <span>•</span>
            <time dateTime={postData.date}>{new Date(postData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          </div>
        </div>

        {/* Post Content */}
        <div 
          className="prose prose-lg max-w-none prose-headings:text-emerald-700 prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
        />

        {/* Related Tools CTA */}
        <div className="mt-12 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border-2 border-emerald-200">
          <h3 className="text-xl font-bold text-emerald-700 mb-3">Try Our Free SEO Tools</h3>
          <p className="text-gray-600 mb-4">Put what you learned into action with our free SEO analysis tools.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/tools/http-status-checker" className="btn btn-primary">
              HTTP Status Checker
            </Link>
            <Link href="/tools/seo-audit" className="btn btn-secondary">
              SEO Audit Tool
            </Link>
            <Link href="/tools/broken-links-checker" className="btn btn-secondary">
              Broken Links Checker
            </Link>
          </div>
        </div>

        {/* Back to Blog */}
        <div className="mt-8 text-center">
          <Link href="/blog" className="text-emerald-600 hover:underline">
            ← Back to all articles
          </Link>
        </div>
      </article>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getAllPostSlugs();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.slug);
  return {
    props: {
      postData,
    },
  };
}
