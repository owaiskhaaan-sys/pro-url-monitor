import { passwordResetTokens } from './forgot-password';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    // Verify token
    const tokenData = passwordResetTokens.get(token);

    if (!tokenData) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Check if token is expired
    if (Date.now() > tokenData.expires) {
      passwordResetTokens.delete(token);
      return res.status(400).json({ error: 'Reset token has expired. Please request a new one.' });
    }

    // In production: Update password in database
    // Example: await db.users.update({ email: tokenData.email }, { password: hash(newPassword) })
    
    // Delete used token
    passwordResetTokens.delete(token);

    return res.status(200).json({ 
      success: true,
      message: 'Password successfully reset. You can now login with your new password.' 
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ 
      error: 'Failed to reset password. Please try again.' 
    });
  }
}
