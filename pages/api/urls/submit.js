export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Validate URL
    new URL(url);

    // Google Apps Script کو call کریں
    const googleAppsScriptURL = process.env.GOOGLE_APPS_SCRIPT_URL;
    
    if (!googleAppsScriptURL) {
      return res.status(500).json({ 
        error: 'Google Apps Script URL not configured',
        success: false 
      });
    }

    const response = await fetch(googleAppsScriptURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url })
    });

    const data = await response.json();

    return res.status(200).json({
      success: data.success,
      message: data.message || 'URL submitted for crawling and indexing',
      data: {
        url,
        submittedAt: new Date().toISOString(),
        status: data.success ? 'processing' : 'failed',
        googleResponse: data
      }
    });

  } catch (error) {
    return res.status(400).json({ 
      error: 'Invalid URL or processing failed',
      message: error.message,
      success: false 
    });
  }
}
