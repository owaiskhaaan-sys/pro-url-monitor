import { getSortedPostsData } from '../lib/blog';

export async function getServerSideProps({ res }) {
  const baseUrl = 'https://www.prourlmonitor.com';
  
  const tools = [
    'seo-audit',
    'http-status-checker',
    'broken-links-checker',
    'binary-translator',
    'binary-calculator',
    'decimal-to-binary',
    'binary-to-decimal',
    'binary-to-hex',
    'hex-to-binary',
    'binary-to-octal',
    'octal-to-binary',
    'octal-to-decimal',
    'twos-complement-calculator',
    'decimal-to-hex',
    'hex-to-decimal',
    'bitwise-operations',
    'meta-description-generator',
    'seo-title-generator',
    'alt-text-generator',
    'schema-generator',
    'faq-schema-generator',
    'content-readability-optimizer',
    'semantic-keyword-finder',
    'internal-linking-assistant',
    'dns-records-checker',
    'dns-report-checker',
    'reverse-ns-checker',
    'word-counter',
    'link-extractor',
    'robots-txt-generator',
    'domain-authority-checker',
    'bulk-domain-age-checker',
    'reverse-ip-domain-checker',
    'social-media-counter',
    'google-index-checker'
  ];

  const staticPages = [
    '',
    '/login',
    '/signup',
    '/app/dashboard',
    '/blog'
  ];

  // Get blog posts dynamically
  let blogPosts = [];
  try {
    const posts = getSortedPostsData();
    blogPosts = posts.map(post => post.slug);
  } catch (error) {
    // No blog posts yet
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
  ${tools.map(tool => `
  <url>
    <loc>${baseUrl}/tools/${tool}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`).join('')}
  ${blogPosts.map(slug => `
  <url>
    <loc>${baseUrl}/blog/${slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default function Sitemap() {
  return null;
}
