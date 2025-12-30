import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Layout from '../components/Layout';
import CloudflareTurnstile from '../components/CloudflareTurnstile';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!verified) {
      setError('Please complete the human verification first');
      setLoading(false);
      return;
    }

    if (!email || !password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    try {
      // Simulate login - in production, call your auth API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        // Store token in localStorage (in production use httpOnly cookies)
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/app/dashboard';
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Login to Pro URL Monitor - Access Your Dashboard</title>
        <meta name="description" content="Login to Pro URL Monitor to access your dashboard. Monitor website performance, check URLs, and manage your SEO tools. Secure authentication with Cloudflare protection." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <Link href="/">
              <div className="text-3xl font-bold text-blue-600 inline-block">Pro URL Monitor</div>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Login Form */}
            <div className="card">
              <h1 className="text-2xl font-bold text-center mb-6">Login to Your Account</h1>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                      Forgot password?
                    </Link>
                  </div>
                  <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                </div>

                <div className="pt-2">
                  <CloudflareTurnstile
                    onVerify={(token) => {
                      setTurnstileToken(token);
                      setVerified(true);
                    }}
                    onError={() => setVerified(false)}
                    onExpire={() => setVerified(false)}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading || !verified} 
                  className="w-full btn btn-primary py-3 font-semibold disabled:opacity-50"
                >
                  {loading ? 'Signing in...' : (verified ? 'Sign In' : 'Complete Verification First')}
                </button>
              </form>

              <div className="mt-6 flex items-center gap-2">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="text-sm text-gray-500">OR</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              <button className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">Continue with Google</button>

              <p className="text-center text-sm text-gray-600 mt-6">Don't have an account? <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">Sign up</Link></p>

              <p className="text-center text-sm text-gray-600 mt-4"><a href="#" className="text-blue-600 hover:text-blue-700">Forgot password?</a></p>
            </div>

            {/* Benefits Section */}
            <div className="space-y-6">
              <div className="card bg-gradient-to-br from-blue-50 to-indigo-50">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Why Login to Pro URL Monitor?</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <strong className="text-gray-900">Access 100+ SEO Tools</strong>
                      <p className="text-sm text-gray-700">Get unlimited access to all our professional SEO and website monitoring tools.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <strong className="text-gray-900">Save Your Work</strong>
                      <p className="text-sm text-gray-700">Save and organize your URL monitoring projects, SEO audits, and tool results.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <strong className="text-gray-900">Track History</strong>
                      <p className="text-sm text-gray-700">Monitor website performance over time with historical data and trend analysis.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <strong className="text-gray-900">Automated Reports</strong>
                      <p className="text-sm text-gray-700">Get scheduled reports delivered to your inbox with insights and recommendations.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <strong className="text-gray-900">Priority Support</strong>
                      <p className="text-sm text-gray-700">Get faster response times and dedicated support from our expert team.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="card">
                <h3 className="font-bold mb-3 text-gray-900">Secure Authentication</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Your account is protected with industry-standard security measures including Cloudflare Turnstile verification, encrypted passwords, and secure HTTPS connections.
                </p>
                <p className="text-sm text-gray-700">
                  We take your privacy seriously. Your data is never shared with third parties and is stored securely in compliance with GDPR regulations.
                </p>
              </div>

              <div className="card bg-gradient-to-br from-green-50 to-emerald-50">
                <h3 className="font-bold mb-3 text-gray-900">🎯 What You Can Do After Login</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                    Monitor unlimited URLs and websites
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                    Check HTTP status codes in bulk
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                    Analyze SEO performance and rankings
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                    Generate meta tags and schema markup
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                    Access advanced text and code tools
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                    Export reports in multiple formats
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 mt-8">Demo: Use email <code className="bg-gray-200 px-2 py-1 rounded">demo@example.com</code> | password <code className="bg-gray-200 px-2 py-1 rounded">demo123</code></p>
        </div>
      </div>
    </Layout>
  );
}
