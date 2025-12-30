// Google OAuth handler
// Install: npm install googleapis

export default async function handler(req, res) {
  const { code } = req.query;

  // If no code, redirect to Google OAuth
  if (!code) {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/google&` +
      `response_type=code&` +
      `scope=openid email profile&` +
      `access_type=offline`;

    return res.redirect(googleAuthUrl);
  }

  // Exchange code for tokens
  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/google`,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();

    // Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const userInfo = await userResponse.json();

    // In production: Create or update user in database
    // Check if user exists, if not create new user
    // Store Google ID for future logins

    // Create session token
    const sessionToken = Buffer.from(JSON.stringify({ 
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      exp: Date.now() + 86400000 
    })).toString('base64');

    // Redirect to dashboard with token
    return res.redirect(`/app/dashboard?token=${sessionToken}&user=${encodeURIComponent(JSON.stringify({
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture
    }))}`);

  } catch (error) {
    console.error('Google OAuth error:', error);
    return res.redirect('/login?error=google_auth_failed');
  }
}

/* 
SETUP INSTRUCTIONS:

1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Create a new project or select existing
3. Enable "Google+ API"
4. Go to "Credentials" and create "OAuth 2.0 Client ID"
5. Add authorized redirect URIs:
   - http://localhost:3000/api/auth/google (development)
   - https://www.prourlmonitor.com/api/auth/google (production)

6. Add to .env file:
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   NEXT_PUBLIC_SITE_URL=https://www.prourlmonitor.com

7. Install googleapis: npm install googleapis
*/
