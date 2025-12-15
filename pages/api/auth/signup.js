export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Demo signup - in production, save to database
  const token = Buffer.from(JSON.stringify({ 
    email, 
    exp: Date.now() + 86400000 
  })).toString('base64');
  
  return res.status(201).json({
    token,
    user: {
      id: Math.random().toString(36).substr(2, 9),
      email: email,
      name: name
    }
  });
}
