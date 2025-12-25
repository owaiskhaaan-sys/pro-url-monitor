import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { url, strategy } = req.query;
  const API_KEY = 'AIzaSyACg_8Pn61ChGGFlS0oFyzZlXXEVaQWVUM'; // New provided key

  if (!url || !strategy) {
    return res.status(400).json({ error: 'URL and strategy are required' });
  }

  try {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&key=${API_KEY}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      return res.status(500).json({ error: 'PageSpeed API error' });
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
