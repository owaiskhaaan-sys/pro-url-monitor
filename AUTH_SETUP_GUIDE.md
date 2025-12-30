# Authentication API Setup Guide

Complete guide to set up email verification, password reset, and Google OAuth for Pro URL Monitor.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Email Configuration](#email-configuration)
3. [Google OAuth Setup](#google-oauth-setup)
4. [Cloudflare Turnstile](#cloudflare-turnstile)
5. [API Endpoints](#api-endpoints)
6. [Production Deployment](#production-deployment)

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install nodemailer
```

### 2. Create Environment File

```bash
cp .env.example .env.local
```

### 3. Configure Environment Variables

Edit `.env.local` with your credentials (see sections below).

---

## 📧 Email Configuration

### Option A: Gmail (Recommended for Testing)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Copy the generated 16-character password

3. **Add to `.env.local`**:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
```

### Option B: SendGrid (Production Recommended)

1. Sign up at https://sendgrid.com/
2. Create API key
3. Update `.env.local`:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

### Option C: AWS SES (Enterprise)

1. Set up AWS SES: https://aws.amazon.com/ses/
2. Verify your domain
3. Get SMTP credentials
4. Update `.env.local`:
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-smtp-username
SMTP_PASSWORD=your-ses-smtp-password
```

---

## 🔐 Google OAuth Setup

### 1. Create Google Cloud Project

1. Go to: https://console.cloud.google.com/
2. Create new project or select existing
3. Enable "Google+ API" or "Google Identity"

### 2. Create OAuth 2.0 Credentials

1. Navigate to: **APIs & Services > Credentials**
2. Click **"Create Credentials" > "OAuth 2.0 Client ID"**
3. Choose "Web application"
4. Add **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/google
   https://www.prourlmonitor.com/api/auth/google
   ```

### 3. Add to `.env.local`

```env
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret-here
```

### 4. Test Google Login

Visit: http://localhost:3000/login and click "Continue with Google"

---

## 🛡️ Cloudflare Turnstile

### 1. Get Turnstile Keys

1. Go to: https://dash.cloudflare.com/
2. Select your account > Turnstile
3. Create a new site
4. Copy **Site Key** and **Secret Key**

### 2. Add to `.env.local`

```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAAbCdEfGhIjKlMnO
TURNSTILE_SECRET_KEY=0x4AAAAAAAbCdEfGhIjKlMnOpQrStUvWxYz
```

---

## 🔌 API Endpoints

### 1. **POST** `/api/auth/signup`
Create new user account with email verification.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "turnstileToken": "cloudflare_token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created! Check your email.",
  "token": "session_token",
  "user": {
    "id": "abc123",
    "email": "john@example.com",
    "name": "John Doe",
    "emailVerified": false
  }
}
```

**Email Sent:** Verification link to activate account

---

### 2. **POST** `/api/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123",
  "turnstileToken": "cloudflare_token"
}
```

**Response:**
```json
{
  "token": "session_token",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

---

### 3. **POST** `/api/auth/forgot-password`
Request password reset link.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

**Email Sent:** Reset link valid for 1 hour

---

### 4. **POST** `/api/auth/reset-password`
Reset password with token.

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password successfully reset"
}
```

---

### 5. **GET** `/api/auth/verify-email?token=xyz`
Verify email address.

**Query Parameters:**
- `token`: Verification token from email

**Response:** Redirects to `/login?verified=true`

---

### 6. **GET** `/api/auth/google`
Google OAuth authentication.

**Flow:**
1. Redirects to Google login
2. User authorizes app
3. Returns with code
4. Exchanges code for user info
5. Redirects to dashboard with session

---

## 🚀 Production Deployment

### 1. Environment Variables on Vercel/Netlify

Add all `.env.local` variables to your hosting platform:

**Vercel:**
1. Go to Project Settings > Environment Variables
2. Add each variable from `.env.local`
3. Redeploy

**Netlify:**
1. Go to Site Settings > Build & Deploy > Environment
2. Add each variable
3. Trigger new deploy

### 2. Database Integration (Production)

Current implementation uses in-memory storage (Map). For production, integrate a real database:

**Recommended Databases:**
- **PostgreSQL** (via Supabase/Neon/Railway)
- **MongoDB** (via MongoDB Atlas)
- **MySQL** (via PlanetScale)

**Example with Prisma + PostgreSQL:**

```bash
npm install prisma @prisma/client
npx prisma init
```

Update `schema.prisma`:
```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  name          String
  password      String
  emailVerified Boolean  @default(false)
  createdAt     DateTime @default(now())
}

model PasswordReset {
  id        String   @id @default(uuid())
  email     String
  token     String   @unique
  expires   DateTime
  createdAt DateTime @default(now())
}
```

Run migrations:
```bash
npx prisma migrate dev
```

### 3. Security Checklist

✅ Use HTTPS only in production  
✅ Store passwords hashed (bcrypt/argon2)  
✅ Use httpOnly cookies for sessions  
✅ Implement rate limiting  
✅ Add CSRF protection  
✅ Validate all inputs  
✅ Use environment variables (never hardcode secrets)  
✅ Enable CORS restrictions  
✅ Log authentication attempts  
✅ Implement account lockout after failed attempts

### 4. Testing

**Test Email Sending:**
```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

**Test Signup:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test123"}'
```

---

## 📝 Notes

### Current Limitations (Demo Mode)

⚠️ **In-memory storage**: Tokens stored in RAM (lost on server restart)  
⚠️ **No password hashing**: Passwords stored as plain text  
⚠️ **Demo accounts**: Allows any email/password combination  

### Production Todos

1. ✅ Connect real database
2. ✅ Hash passwords with bcrypt
3. ✅ Implement proper session management
4. ✅ Add rate limiting
5. ✅ Set up monitoring/logging
6. ✅ Add user profile management
7. ✅ Implement "Remember me" functionality
8. ✅ Add social login (Facebook, GitHub, etc.)

---

## 🆘 Troubleshooting

### Email Not Sending

**Problem:** "Failed to send email"

**Solutions:**
1. Check SMTP credentials are correct
2. Verify Gmail app password (not regular password)
3. Check firewall isn't blocking port 587
4. Try port 465 with `secure: true`
5. Check SMTP_USER is full email address

### Google OAuth Redirect Error

**Problem:** "redirect_uri_mismatch"

**Solution:**
1. Verify redirect URI in Google Console matches exactly:
   `https://www.prourlmonitor.com/api/auth/google`
2. No trailing slashes
3. Must be HTTPS in production
4. Add both localhost and production URLs

### Turnstile Verification Failed

**Problem:** "Verification failed"

**Solutions:**
1. Check NEXT_PUBLIC_TURNSTILE_SITE_KEY is set
2. Verify TURNSTILE_SECRET_KEY matches
3. Ensure site key starts with `0x4`
4. Check domain is whitelisted in Cloudflare

---

## 📚 Additional Resources

- [Nodemailer Docs](https://nodemailer.com/)
- [Google OAuth Guide](https://developers.google.com/identity/protocols/oauth2)
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

## 🎉 You're All Set!

Run the development server:
```bash
npm run dev
```

Visit http://localhost:3000/signup to test!

---

**Need Help?** Open an issue on GitHub or contact support.
