export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { domain, recordType } = req.body;

  if (!domain || !recordType) {
    return res.status(400).json({ error: 'Domain and record type are required' });
  }

  try {
    const response = await fetch(
      `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${recordType}`,
      {
        headers: {
          'Accept': 'application/dns-json'
        }
      }
    );

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('DNS lookup error:', error);
    return res.status(500).json({ error: 'Failed to fetch DNS records' });
  }
}
