import nodemailer from 'nodemailer';

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

  // Verify Cloudflare Turnstile token (in production)
  if (turnstileToken) {
    try {
      const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: turnstileToken,
        }),
      });
      const turnstileData = await turnstileResponse.json();
      if (!turnstileData.success) {
        return res.status(400).json({ error: 'Verification failed. Please try again.' });
      }
    } catch (error) {
      console.error('Turnstile verification error:', error);
    }
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

    // Configure email transporter
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
          .code { background: white; padding: 15px; border-radius: 5px; font-size: 24px; font-weight: bold; letter-spacing: 3px; text-align: center; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to Pro URL Monitor!</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Thanks for signing up! We're excited to have you on board.</p>
            <p>Please verify your email address by clicking the button below:</p>
            <center>
              <a href="${verificationLink}" class="button">Verify Email Address</a>
            </center>
            <p>Or copy and paste this link in your browser:</p>
            <p style="background: white; padding: 10px; border-radius: 5px; word-break: break-all;">${verificationLink}</p>
            <p><strong>This link will expire in 24 hours.</strong></p>
            <p>Once verified, you'll get access to:</p>
            <ul>
              <li>✅ 100+ Professional SEO Tools</li>
              <li>✅ Unlimited URL Monitoring</li>
              <li>✅ Automated Reports</li>
              <li>✅ Historical Data & Analytics</li>
              <li>✅ Priority Support</li>
            </ul>
            <p>If you didn't create this account, you can safely ignore this email.</p>
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

    // Send verification email
    await transporter.sendMail({
      from: `"Pro URL Monitor" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '🎉 Welcome to Pro URL Monitor - Verify Your Email',
      html: emailHTML,
    });

    // Demo token for immediate login (remove in production)
    const demoToken = Buffer.from(JSON.stringify({ 
      email, 
      name,
      exp: Date.now() + 86400000 
    })).toString('base64');
    
    return res.status(201).json({
      success: true,
      message: 'Account created! Please check your email to verify your account.',
      token: demoToken, // For demo purposes
      user: {
        id: Math.random().toString(36).substr(2, 9),
        email: email,
        name: name,
        emailVerified: false
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ 
      error: 'Failed to create account. Please try again.' 
    });
  }
}

