// In-memory storage for demo (use database in production)
export const emailVerificationTokens = new Map();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'Verification token is required' });
  }

  try {
    // Verify token
    const tokenData = emailVerificationTokens.get(token);

    if (!tokenData) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    // Check if token is expired (24 hours)
    if (Date.now() > tokenData.expires) {
      emailVerificationTokens.delete(token);
      return res.status(400).json({ error: 'Verification token has expired. Please sign up again.' });
    }

    // In production: Mark email as verified in database
    // Example: await db.users.update({ email: tokenData.email }, { emailVerified: true })
    
    // Delete used token
    emailVerificationTokens.delete(token);

    // Redirect to login page with success message
    return res.redirect('/login?verified=true');

  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({ 
      error: 'Failed to verify email. Please try again.' 
    });
  }
}
