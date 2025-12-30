import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Layout from '../components/Layout';
import CloudflareTurnstile from '../components/CloudflareTurnstile';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
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
        body: JSON.stringify({ email, password, turnstileToken })
      });

      if (response.ok) {
        // Store token in localStorage (in production use httpOnly cookies)
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/app/dashboard';
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // In production, implement Google OAuth
    window.location.href = '/api/auth/google';
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setResetLoading(true);

    if (!resetEmail) {
      setError('Please enter your email address');
      setResetLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });

      if (response.ok) {
        setSuccess('Password reset link sent! Check your email inbox.');
        setResetEmail('');
        setTimeout(() => {
          setShowForgotPassword(false);
          setSuccess('');
        }, 3000);
      } else {
        setError('Email not found. Please check and try again.');
      }
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
      console.error(err);
    } finally {
      setResetLoading(false);
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

              {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded text-green-700">{success}</div>
              )}

              {!showForgotPassword ? (
                <>
                  {/* Google Login Button */}
                  <button 
                    onClick={handleGoogleLogin}
                    className="w-full mb-4 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium flex items-center justify-center gap-3 transition"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>

                  <div className="flex items-center gap-2 my-4">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="text-sm text-gray-500">OR</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="you@example.com" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                      />
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input 
                        id="password" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="••••••••" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                      />
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

                  <div className="mt-6 flex justify-between items-center text-sm">
                    <button 
                      onClick={() => setShowForgotPassword(true)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Forgot Password?
                    </button>
                    <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                      Create Account
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  {/* Forgot Password Form */}
                  <button 
                    onClick={() => setShowForgotPassword(false)}
                    className="mb-4 text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Login
                  </button>

                  <h2 className="text-xl font-bold mb-2">Reset Your Password</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>

                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input 
                        id="resetEmail" 
                        type="email" 
                        value={resetEmail} 
                        onChange={(e) => setResetEmail(e.target.value)} 
                        placeholder="you@example.com" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={resetLoading} 
                      className="w-full btn btn-primary py-3 font-semibold disabled:opacity-50"
                    >
                      {resetLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </form>

                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm text-blue-800">
                      <strong>📧 Check your inbox!</strong><br/>
                      If an account exists with this email, you'll receive a password reset link within a few minutes.
                    </p>
                  </div>
                </>
              )}
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
