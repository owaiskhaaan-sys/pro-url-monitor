import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// In-memory storage for demo (use database in production)
const passwordResetTokens = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, resetCode, resetLink } = req.body;

  if (!email || !resetCode) {
    return res.status(400).json({ error: 'Email and reset code are required' });
  }

  try {
    // Store token with expiry (15 minutes)
    passwordResetTokens.set(resetCode, {
      email,
      expires: Date.now() + 900000 // 15 minutes
    });

    // Send password reset email via Resend
    const { data, error } = await resend.emails.send({
      from: 'ProURLMonitor <owaiskhaaan@gmail.com>', // Temporary - using verified email
      to: [email],
      subject: 'Reset Your Password - ProURLMonitor',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
          
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">ProURLMonitor</h1>
              <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 14px;">Professional URL Monitoring & SEO Tools</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1a202c; font-size: 24px; font-weight: 600;">Password Reset Request 🔐</h2>
              
              <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                We received a request to reset the password for your ProURLMonitor account associated with <strong>${email}</strong>.
              </p>

              <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                Use the verification code below to reset your password:
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center" style="background-color: #fff5f5; border: 2px dashed #f56565; border-radius: 8px; padding: 30px;">
                    <div style="font-size: 36px; font-weight: bold; color: #e53e3e; letter-spacing: 8px; font-family: 'Courier New', monospace;">${resetCode}</div>
                    <p style="margin: 15px 0 0 0; color: #718096; font-size: 14px;">This code expires in 15 minutes</p>
                  </td>
                </tr>
              </table>

              ${resetLink ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                <tr>
                  <td align="center">
                    <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">Reset Password Now</a>
                  </td>
                </tr>
              </table>
              ` : ''}

              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0 0 0; background-color: #fffaf0; border-left: 4px solid #ed8936; border-radius: 4px; padding: 20px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 10px 0; color: #744210; font-size: 14px; font-weight: 600;">⚠️ Security Notice</p>
                    <p style="margin: 0; color: #744210; font-size: 14px; line-height: 1.6;">If you didn't request a password reset, please ignore this email.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px 0; color: #718096; font-size: 14px;">Need help? Contact us at <a href="mailto:support@prourlmonitor.com" style="color: #667eea; text-decoration: none;">support@prourlmonitor.com</a></p>
              <p style="margin: 10px 0 0 0; color: #a0aec0; font-size: 12px;">© 2025 ProURLMonitor. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(400).json({ error: 'Failed to send email', details: error });
    }

    return res.status(200).json({ 
      success: true,
      message: 'Password reset code sent to your email',
      messageId: data.id
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
