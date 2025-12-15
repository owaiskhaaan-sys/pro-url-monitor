# Pro URL Monitor - URL Indexing Platform

A modern, full-featured URL indexing and monitoring platform similar to cromojo.com. Built with Next.js, React, and Tailwind CSS.

## Features

- **Landing Page** — Professional marketing site with features, pricing, and CTA buttons
- **User Authentication** — Simple login and signup with session management
- **Dashboard** — Submit URLs, track indexing status, view analytics
- **API Endpoints** — `/api/auth/login`, `/api/auth/signup`, `/api/urls/submit`
- **Responsive Design** — Mobile-friendly Tailwind CSS styling
- **Demo Credentials** — Test with `demo@example.com` / `demo123`

## Project Structure

```
pro-url-monitor/
├── pages/
│   ├── index.js           # Landing page
│   ├── login.js           # Login page
│   ├── signup.js          # Signup page
│   ├── _app.js            # Next.js app wrapper
│   ├── api/
│   │   └── auth/
│   │       ├── login.js   # Login API endpoint
│   │       └── signup.js  # Signup API endpoint
│   └── app/
│       └── dashboard.js   # Protected dashboard
├── components/            # Reusable React components (for future use)
├── public/                # Static assets
├── styles/
│   └── globals.css        # Global Tailwind styles
├── package.json           # Dependencies
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── postcss.config.js      # PostCSS configuration
```

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### 3. Test Login

- Go to `/login`
- Email: `demo@example.com`
- Password: `demo123`
- Click "Sign In" → Redirects to `/app/dashboard`

### 4. Build for Production

```bash
npm run build
npm start
```

### 5. Export as Static HTML (for Hostinger)

```bash
npm run export
```

This generates an `out/` directory with static HTML files that can be uploaded to Hostinger.

## Key Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page with features & pricing |
| `/login` | User login page |
| `/signup` | User registration page |
| `/app/dashboard` | Protected dashboard (requires login) |
| `/api/auth/login` | POST endpoint for authentication |
| `/api/auth/signup` | POST endpoint for registration |
| `/api/urls/submit` | POST endpoint for submitting URLs |

## API Endpoints

### POST /api/auth/login
Submit user credentials to authenticate.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJ...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

### POST /api/auth/signup
Create a new user account.

**Request:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJ...",
  "user": {
    "id": "abc123",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

### POST /api/urls/submit
Submit a URL for indexing (requires authentication).

**Request:**
```json
{
  "url": "https://example.com/page"
}
```

**Response:**
```json
{
  "success": true,
  "message": "URL submitted successfully",
  "data": {
    "url": "https://example.com/page",
    "submittedAt": "2025-12-05T10:30:00Z",
    "status": "pending",
    "estimatedCrawlTime": "2-4 hours"
  }
}
```

## Deployment Options

### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Option 2: Hostinger (Static Export)
```bash
npm run export
# Upload contents of `out/` folder to Hostinger via hPanel File Manager
```

### Option 3: Self-Hosted VPS
```bash
npm run build
npm start
# Or use PM2:
pm2 start npm --name "pro-url-monitor" -- start
```

## Customization Guide

### Change App Name
1. Edit `pages/index.js` → Update `<title>` and header text
2. Edit `pages/login.js` → Update logo text
3. Edit `pages/signup.js` → Update logo text
4. Edit `pages/app/dashboard.js` → Update header

### Change Colors
Edit `globals.css` and `tailwind.config.js` to customize blue/gray theme.

### Add Database
- Install database driver: `npm install mongoose` (for MongoDB) or `npm install pg` (for PostgreSQL)
- Update `/api/auth/login.js` and `/api/auth/signup.js` to query your database
- Store hashed passwords using `bcryptjs`

### Enable Real Indexing
- Integrate with Google Search Console API
- Integrate with Bing Webmaster Tools API
- Replace demo status with real crawl data

## Technologies Used

- **Next.js 14** — React framework with built-in API routes
- **React 18** — UI components and state management
- **Tailwind CSS 3** — Utility-first CSS framework
- **PostCSS** — CSS processing
- **Next.js Auth (optional)** — For production authentication

## Notes

- **Demo mode**: Login API accepts any email/password combination for testing
- **No database**: Currently uses in-memory state; add a database for persistence
- **No email verification**: Sign-up is instant; add email verification in production
- **No password hashing**: Passwords stored as plain text (demo only); use bcryptjs in production

## Next Steps

1. **Add Database**: Connect MongoDB/PostgreSQL for user data persistence
2. **Implement Real Indexing**: Integrate Google Search Console and Bing Webmaster APIs
3. **Add Email Verification**: Use SendGrid or Mailgun for email confirmations
4. **Add Payment Processing**: Integrate Stripe for premium plans
5. **Add Analytics**: Use Google Analytics or Mixpanel to track user behavior
6. **Deploy to Vercel**: `vercel` command for instant production deployment

## Support

For questions or issues, check the Next.js documentation: https://nextjs.org/docs

---

**Ready to deploy?** Follow the deployment options above to get your site live!

If you want me to continue, reply which of these:
- `upload-help` — I will guide step-by-step while you upload (I'll ask for screenshots/errors).
- `more-pages` — I will add `about.html` and `contact.html` template files.
- `ftp-guide` — I will create a FileZilla import file and show FTP steps.
# pro-url-monitor
