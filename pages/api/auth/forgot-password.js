// In-memory storage for demo (use database in production)
const passwordResetTokens = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.prourlmonitor.com'}/reset-password?token=${resetToken}`;
    
    // Store token with expiry (1 hour)
    passwordResetTokens.set(resetToken, {
      email,
      expires: Date.now() + 3600000 // 1 hour
    });

    // TODO: Send email in production
    // For now, just log the reset link
    console.log('Password Reset Link:', resetLink);
    console.log('Token:', resetToken);

    return res.status(200).json({ 
      success: true,
      message: 'Password reset link sent to your email',
      // For demo purposes only - remove in production
      resetLink: process.env.NODE_ENV === 'development' ? resetLink : undefined
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ 
      error: 'Failed to send reset email. Please try again later.' 
    });
  }
}

// Export the tokens map for reset-password endpoint
export { passwordResetTokens };
