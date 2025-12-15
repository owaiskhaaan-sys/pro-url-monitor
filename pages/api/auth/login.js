export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // Demo authentication - in production, validate against your database
  if (email === 'demo@example.com' && password === 'demo123') {
    const token = Buffer.from(JSON.stringify({ email, exp: Date.now() + 86400000 })).toString('base64');
    
    return res.status(200).json({
      token,
      user: {
        id: 1,
        email: email,
        name: 'Demo User'
      }
    });
  }

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  // For demo purposes, allow any email/password combination (NOT for production!)
  const token = Buffer.from(JSON.stringify({ email, exp: Date.now() + 86400000 })).toString('base64');
  
  return res.status(200).json({
    token,
    user: {
      id: 1,
      email: email,
      name: email.split('@')[0]
    }
  });
}
