// In-memory storage for demo (use database in production)
export const emailVerificationTokens = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, password, turnstileToken } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    // Generate verification token
    const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const verificationLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.prourlmonitor.com'}/api/auth/verify-email?token=${verificationToken}`;
    
    // Store token with expiry (24 hours)
    emailVerificationTokens.set(verificationToken, {
      email,
      name,
      password, // In production: hash the password before storing
      expires: Date.now() + 86400000 // 24 hours
    });

    // TODO: Send email in production
    // For now, just log the verification link
    console.log('Email Verification Link:', verificationLink);
    console.log('Token:', verificationToken);

    // Demo token for immediate login
    const demoToken = Buffer.from(JSON.stringify({ 
      email, 
      name,
      exp: Date.now() + 86400000 
    })).toString('base64');
    
    return res.status(201).json({
      success: true,
      message: 'Account created! Please check your email to verify your account.',
      token: demoToken,
      user: {
        id: Math.random().toString(36).substr(2, 9),
        email: email,
        name: name,
        emailVerified: false
      },
      // For demo purposes only - remove in production
      verificationLink: process.env.NODE_ENV === 'development' ? verificationLink : undefined
    });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ 
      error: 'Failed to create account. Please try again.' 
    });
  }
}

