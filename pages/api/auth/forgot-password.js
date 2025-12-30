import nodemailer from 'nodemailer';

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

    // Configure email transporter (use your SMTP settings)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Email HTML template
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Reset Your Password</h1>
          </div>
          <div class="content">
            <p>Hi there,</p>
            <p>We received a request to reset your password for your Pro URL Monitor account.</p>
            <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
            <center>
              <a href="${resetLink}" class="button">Reset Password</a>
            </center>
            <p>Or copy and paste this link in your browser:</p>
            <p style="background: white; padding: 10px; border-radius: 5px; word-break: break-all;">${resetLink}</p>
            <p><strong>If you didn't request this,</strong> you can safely ignore this email. Your password won't be changed.</p>
            <p>Thanks,<br/>Pro URL Monitor Team</p>
          </div>
          <div class="footer">
            <p>Pro URL Monitor - Professional Website Monitoring & SEO Tools</p>
            <p>This email was sent to ${email}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    await transporter.sendMail({
      from: `"Pro URL Monitor" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '🔐 Reset Your Password - Pro URL Monitor',
      html: emailHTML,
    });

    return res.status(200).json({ 
      success: true,
      message: 'Password reset link sent to your email' 
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
