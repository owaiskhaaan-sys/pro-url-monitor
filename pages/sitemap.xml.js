import { getSortedPostsData } from '../lib/blog';

export async function getServerSideProps({ res }) {
  const baseUrl = 'https://www.prourlmonitor.com';
  
  const tools = [
    // SEO Tools
    'seo-audit',
    'meta-generator',
    'schema-generator',
    'faq-schema-generator',
    'keyword-density-checker',
    'heading-analyzer',
    'robots-txt-generator',
    'xml-html-sitemap-generator',
    'meta-description-generator',
    'seo-title-generator',
    'alt-text-generator',
    'semantic-keyword-finder',
    'internal-linking-assistant',
    'content-readability-optimizer',
    'google-index-checker',
    'ai-search-ranking-checker',
    'ai-prompt-generator',
    'ai-content-detector',
    'ai-resume-optimizer',
    'chatgpt-prompt-templates',
    'ai-text-humanizer',
    
    // HTTP & Network Tools
    'http-status-checker',
    'broken-links-checker',
    'ping-multiple-urls-online',
    'server-status-checker',
    'server-port-scanner',
    'traceroute',
    'different-locations-ping',
    
    // DNS Tools
    'dns-records-checker',
    'dns-propagation-checker',
    'dns-report-checker',
    'reverse-ns-checker',
    
    // Domain Tools
    'domain-authority-checker',
    'bulk-domain-age-checker',
    'bulk-domain-whois-checker',
    'domain-ip-history-checker',
    'reverse-ip-domain-checker',
    'reverse-whois-checker',
    'class-c-ip-checker',
    'ip-location',
    
    // Link Tools
    'link-extractor',
    'backlinks-maker',
    'link-search',
    'social-media-counter',
    'google-malware-checker',
    'google-pagerank-checker',
    'bulk-alexa-rank-checker',
    'alexa-rank-comparison',
    
    // Text Tools
    'word-counter',
    'case-converter',
    'text-cleaner',
    'text-reverser',
    'text-to-slug',
    'find-and-replace',
    'sort-text-lines',
    'remove-line-breaks',
    'duplicate-line-remover',
    'text-diff-checker',
    'character-frequency-counter',
    'lorem-ipsum-generator',
    'paraphraser',
    'plagiarism',
    
    // Code Beautifiers
    'html-beautifier-minifier',
    'css-beautifier-minifier',
    'json-beautifier-validator',
    'xml-beautifier-validator',
    'sql-formatter',
    'php-beautifier',
    'python-formatter',
    'code-syntax-highlighter',
    'regex-tester',
    
    // Encoders & Decoders
    'base64-encoder-decoder',
    'url-encoder-decoder',
    'html-encoder-decoder',
    'jwt-decoder',
    'ascii-converter',
    'binary-translator',
    'rot13-cipher',
    'md5-generator',
    'sha256-generator',
    'sha512-generator',
    
    // Color Tools
    'hex-to-rgb',
    'rgb-to-hex',
    'hsl-to-rgb',
    'rgb-to-hsl',
    'cmyk-to-rgb',
    'rgb-to-cmyk',
    'color-palette-generator',
    'color-shades-generator',
    'color-mixer',
    'color-name-finder',
    
    // Binary & Hex Tools
    'binary-converter',
    'binary-calculator',
    'binary-to-decimal',
    'binary-to-hex',
    'binary-to-octal',
    'decimal-to-binary',
    'decimal-to-hex',
    'hex-converter',
    'hex-to-binary',
    'hex-to-decimal',
    'octal-to-binary',
    'octal-to-decimal',
    'bitwise-operations',
    'twos-complement-calculator',
    
    // Other Tools
    'image-compress',
    'submit',
    'bulk'
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
