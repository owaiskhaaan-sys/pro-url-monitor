export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Step 1: Fetch robots.txt
    const baseUrl = url.replace(/\/$/, '');
    const robotsUrl = `${baseUrl}/robots.txt`;
    
    let sitemapUrls = [];
    
    try {
      const robotsResponse = await fetch(robotsUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ProURLMonitor/1.0)' }
      });
      
      if (robotsResponse.ok) {
        const robotsTxt = await robotsResponse.text();
        const lines = robotsTxt.split('\n');
        
        lines.forEach(line => {
          if (line.toLowerCase().startsWith('sitemap:')) {
            const sitemapUrl = line.replace(/sitemap:\s*/i, '').trim();
            if (sitemapUrl) {
              sitemapUrls.push(sitemapUrl);
            }
          }
        });
      }
    } catch (err) {
      // If robots.txt not found, try default sitemap location
    }

    // Fallback: try common sitemap locations
    if (sitemapUrls.length === 0) {
      sitemapUrls = [
        `${baseUrl}/sitemap.xml`,
        `${baseUrl}/sitemap_index.xml`,
        `${baseUrl}/wp-sitemap.xml`
      ];
    }

    let allUrls = [];

    // Step 2: Process each sitemap
    for (const sitemapUrl of sitemapUrls) {
      try {
        const urls = await parseSitemap(sitemapUrl);
        allUrls = allUrls.concat(urls);
      } catch (err) {
        // Continue if this sitemap fails
      }
    }

    // Step 3: Remove duplicates and filter
    const uniqueUrls = [...new Set(allUrls)];
    const filteredUrls = uniqueUrls.filter(url => {
      return !(
        url.includes('/feed') ||
        url.includes('wp-json') ||
        url.includes('/category/') ||
        url.includes('/tag/') ||
        url.includes('/author/') ||
        url.match(/\.(jpg|jpeg|png|gif|svg|webp|pdf|zip|mp4)$/i)
      );
    });

    return res.status(200).json({
      success: true,
      sitemaps: sitemapUrls,
      totalUrls: allUrls.length,
      filteredUrls: filteredUrls.length,
      urls: filteredUrls
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// Parse sitemap XML (handles nested sitemaps)
async function parseSitemap(sitemapUrl, depth = 0) {
  if (depth > 3) return []; // Prevent infinite recursion

  try {
    const response = await fetch(sitemapUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ProURLMonitor/1.0)' }
    });

    if (!response.ok) return [];

    const xml = await response.text();
    let urls = [];

    // Check if it's a sitemap index (contains nested sitemaps)
    if (xml.includes('<sitemapindex')) {
      const sitemapMatches = xml.match(/<loc>([^<]+)<\/loc>/g) || [];
      
      for (const match of sitemapMatches) {
        const nestedUrl = match.replace(/<\/?loc>/g, '');
        const nestedUrls = await parseSitemap(nestedUrl, depth + 1);
        urls = urls.concat(nestedUrls);
      }
    } 
    // Regular sitemap with URLs
    else if (xml.includes('<urlset')) {
      const urlMatches = xml.match(/<loc>([^<]+)<\/loc>/g) || [];
      urls = urlMatches.map(match => match.replace(/<\/?loc>/g, ''));
    }

    return urls;

  } catch (error) {
    return [];
  }
}
