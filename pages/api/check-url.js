export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      redirect: 'follow'
    });

    res.status(200).json({
      status: response.status,
      statusText: response.statusText,
      url: response.url
    });
  } catch (error) {
    res.status(200).json({
      status: 0,
      statusText: 'Connection failed',
      error: error.message
    });
  }
}
