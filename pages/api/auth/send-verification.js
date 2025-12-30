import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, name, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'Email and code are required' });
    }

    const { data, error } = await resend.emails.send({
      from: 'ProURLMonitor <owaiskhaaan@gmail.com>', // Temporary - using verified email
      to: [email],
      subject: 'Verify Your Email - ProURLMonitor',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                ProURLMonitor
              </h1>
              <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 14px;">
                Professional URL Monitoring & SEO Tools
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1a202c; font-size: 24px; font-weight: 600;">
                Welcome${name ? `, ${name}` : ''}! 👋
              </h2>
              
              <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                Thanks for signing up! To complete your registration and verify your email address, please use the verification code below:
              </p>

              <!-- Verification Code -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center" style="background-color: #f7fafc; border: 2px dashed #667eea; border-radius: 8px; padding: 30px;">
                    <div style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                      ${code}
                    </div>
                    <p style="margin: 15px 0 0 0; color: #718096; font-size: 14px;">
                      This code expires in 10 minutes
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 20px 0 0 0; color: #4a5568; font-size: 14px; line-height: 1.6;">
                If you didn't create an account with ProURLMonitor, you can safely ignore this email.
              </p>

              <!-- Features Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0 0 0; background-color: #edf2f7; border-radius: 8px; padding: 20px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 10px 0; color: #2d3748; font-size: 14px; font-weight: 600;">
                      🚀 What's Next?
                    </p>
                    <ul style="margin: 0; padding-left: 20px; color: #4a5568; font-size: 14px; line-height: 1.8;">
                      <li>Enter the verification code on the signup page</li>
                      <li>Complete your profile setup</li>
                      <li>Start using 100+ free SEO and monitoring tools</li>
                      <li>Monitor your URLs and improve your SEO</li>
                    </ul>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px 0; color: #718096; font-size: 14px;">
                Need help? Contact us at <a href="mailto:support@prourlmonitor.com" style="color: #667eea; text-decoration: none;">support@prourlmonitor.com</a>
              </p>
              <p style="margin: 10px 0 0 0; color: #a0aec0; font-size: 12px;">
                © 2025 ProURLMonitor. All rights reserved.
              </p>
              <p style="margin: 10px 0 0 0;">
                <a href="https://www.prourlmonitor.com" style="color: #667eea; text-decoration: none; font-size: 12px; margin: 0 10px;">Website</a> |
                <a href="https://www.prourlmonitor.com/privacy" style="color: #667eea; text-decoration: none; font-size: 12px; margin: 0 10px;">Privacy</a> |
                <a href="https://www.prourlmonitor.com/terms" style="color: #667eea; text-decoration: none; font-size: 12px; margin: 0 10px;">Terms</a>
              </p>
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
      message: 'Verification email sent successfully',
      messageId: data.id 
    });

  } catch (error) {
    console.error('Send verification error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
