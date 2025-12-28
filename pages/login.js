import { useState } from 'react';
import Link from 'next/link';
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
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/">
              <div className="text-3xl font-bold text-blue-600 inline-block">Pro URL Monitor</div>
            </Link>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-center mb-6">Login to Your Account</h2>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
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

          <p className="text-center text-xs text-gray-500 mt-8">Demo: Use email <code className="bg-gray-200 px-2 py-1 rounded">demo@example.com</code> | password <code className="bg-gray-200 px-2 py-1 rounded">demo123</code></p>
        </div>
      </div>
    </Layout>
  );
}
