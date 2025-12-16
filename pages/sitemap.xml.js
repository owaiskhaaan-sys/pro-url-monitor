import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const baseUrl = 'https://www.prourlmonitor.com';
  
  const tools = [
    'seo-audit',
    'http-status-checker',
    'broken-links-checker',
    'binary-translator',
    'word-counter',
    'link-extractor',
    'robots-txt-generator',
    'domain-authority-checker',
    'bulk-domain-age-checker',
    'reverse-ip-domain-checker',
    'social-media-counter'
  ];

  const staticPages = [
    '',
    '/login',
    '/signup',
    '/app/dashboard',
    '/blog'
  ];

  // Get blog posts
  const postsDirectory = path.join(process.cwd(), 'content/blog');
  let blogPosts = [];
  
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    blogPosts = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => fileName.replace(/\.md$/, ''));
  } catch (error) {
    // Blog directory doesn't exist yet
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
  res.write(sitemap);
  res.end();
}
