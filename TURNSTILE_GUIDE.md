# Cloudflare Turnstile Implementation Guide

## ✅ Files Created/Updated

1. **components/CloudflareTurnstile.js** - Reusable Turnstile component
2. **pages/_document.js** - Added Turnstile script

## 🔑 Get Your Cloudflare Turnstile Site Key

1. Go to: https://dash.cloudflare.com/
2. Select your account
3. Go to **Turnstile** section
4. Click **Add Site**
5. Enter your domain: `prourlmonitor.com`
6. Copy the **Site Key**
7. Replace in `components/CloudflareTurnstile.js`:
   ```javascript
   const SITE_KEY = 'YOUR_ACTUAL_SITE_KEY_HERE';
   ```

## 📝 How to Use on Any Form/Button

### Example 1: Contact Form with Turnstile

```javascript
import { useState } from 'react';
import CloudflareTurnstile from '../components/CloudflareTurnstile';

export default function ContactForm() {
  const [turnstileToken, setTurnstileToken] = useState('');
  const [verified, setVerified] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!verified) {
      alert('Please complete the verification!');
      return;
    }

    // Your form submission logic
    const formData = {
      // your form fields
      turnstileToken: turnstileToken
    };

    // Send to backend
    const response = await fetch('/api/submit-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    // Handle response
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
      
      {/* Turnstile Widget */}
      <CloudflareTurnstile
        onVerify={(token) => {
          setTurnstileToken(token);
          setVerified(true);
        }}
        onError={() => setVerified(false)}
        onExpire={() => setVerified(false)}
      />

      <button 
        type="submit" 
        disabled={!verified}
        className="px-6 py-2 bg-blue-500 text-white rounded"
      >
        Submit
      </button>
    </form>
  );
}
```

### Example 2: Protect API Submission Button

```javascript
import { useState } from 'react';
import CloudflareTurnstile from '../components/CloudflareTurnstile';

export default function ToolPage() {
  const [turnstileToken, setTurnstileToken] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);

  const handleAction = async () => {
    if (!canSubmit) {
      alert('Please verify you are human!');
      return;
    }

    // Your API call with token
    await fetch('/api/your-endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        turnstileToken: turnstileToken,
        // other data
      })
    });
  };

  return (
    <div>
      {/* Your tool interface */}
      
      {/* Show Turnstile before button */}
      <div className="my-4">
        <CloudflareTurnstile
          onVerify={(token) => {
            setTurnstileToken(token);
            setCanSubmit(true);
          }}
          onError={() => setCanSubmit(false)}
          onExpire={() => setCanSubmit(false)}
        />
      </div>

      <button
        onClick={handleAction}
        disabled={!canSubmit}
        className={`px-6 py-2 rounded ${
          canSubmit ? 'bg-green-500' : 'bg-gray-300'
        } text-white`}
      >
        Submit
      </button>
    </div>
  );
}
```

### Example 3: Backend Verification (API Route)

```javascript
// pages/api/submit-form.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { turnstileToken } = req.body;

  // Verify token with Cloudflare
  const verifyResponse = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY, // Add to .env.local
        response: turnstileToken,
      }),
    }
  );

  const verifyData = await verifyResponse.json();

  if (!verifyData.success) {
    return res.status(400).json({ error: 'Verification failed' });
  }

  // Verification successful - proceed with your logic
  // ... your code here ...

  res.status(200).json({ success: true });
}
```

## 🔐 Environment Variables

Add to `.env.local`:

```
TURNSTILE_SECRET_KEY=your_secret_key_here
```

Get secret key from Cloudflare Turnstile dashboard.

## 🎨 Styling Options

Turnstile supports different themes:

```javascript
<CloudflareTurnstile
  theme="light"  // or "dark", "auto"
  onVerify={(token) => console.log(token)}
/>
```

## 📋 Where to Add Turnstile

Common places:
- ✅ Contact form
- ✅ Login/Signup forms  
- ✅ Tool submission buttons
- ✅ API calls that modify data
- ✅ Comment forms
- ✅ Download buttons

## 🚀 Quick Implementation

To add to existing pages like contact.js:

1. Import component:
   ```javascript
   import CloudflareTurnstile from '../components/CloudflareTurnstile';
   ```

2. Add state:
   ```javascript
   const [verified, setVerified] = useState(false);
   const [token, setToken] = useState('');
   ```

3. Add widget before button:
   ```javascript
   <CloudflareTurnstile
     onVerify={(t) => { setToken(t); setVerified(true); }}
   />
   ```

4. Disable button until verified:
   ```javascript
   <button disabled={!verified}>Submit</button>
   ```

## ⚠️ Important Notes

1. **Get your own Site Key** from Cloudflare dashboard
2. **Add Secret Key** to environment variables for backend verification
3. **Always verify** token on backend, never trust client-side only
4. Turnstile is **free** for unlimited use
5. Works on **localhost** for testing

## 🔗 Cloudflare Dashboard

Setup: https://dash.cloudflare.com/?to=/:account/turnstile
Docs: https://developers.cloudflare.com/turnstile/
