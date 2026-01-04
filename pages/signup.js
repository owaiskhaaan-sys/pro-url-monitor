import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Layout from '../components/Layout';
import CloudflareTurnstile from '../components/CloudflareTurnstile';

export default function Signup() {
  const [step, setStep] = useState(1); // 1: Signup Form, 2: Email Verification
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!verified) {
      setError('Please complete the human verification first');
      setLoading(false);
      return;
    }

    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      // Generate 6-digit verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Send verification email
      const emailResponse = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          code: code
        })
      });

      if (emailResponse.ok) {
        // Store code temporarily (in production, store in backend with expiration)
        sessionStorage.setItem('signupCode', code);
        sessionStorage.setItem('signupData', JSON.stringify(formData));
        sessionStorage.setItem('codeExpiry', Date.now() + 10 * 60 * 1000); // 10 minutes
        
        setSuccess('Verification code sent to your email! Check your inbox.');
        setStep(2);
      } else {
        const data = await emailResponse.json();
        setError(data.error || 'Failed to send verification email');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      setLoading(false);
      return;
    }

    try {
      // Verify code
      const storedCode = sessionStorage.getItem('signupCode');
      const storedData = sessionStorage.getItem('signupData');
      const expiry = sessionStorage.getItem('codeExpiry');

      if (!storedCode || !storedData || Date.now() > parseInt(expiry)) {
        setError('Verification code expired. Please signup again.');
        setStep(1);
        setLoading(false);
        return;
      }

      if (verificationCode !== storedCode) {
        setError('Invalid verification code');
        setLoading(false);
        return;
      }

      // Code is correct, now create account
      const userData = JSON.parse(storedData);
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          verified: true
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Clean up session storage
        sessionStorage.removeItem('signupCode');
        sessionStorage.removeItem('signupData');
        sessionStorage.removeItem('codeExpiry');
        
        // Store user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setSuccess('Account created successfully! Redirecting...');
        setTimeout(() => {
          window.location.href = '/app/dashboard';
        }, 1500);
      } else {
        setError('Signup failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const storedData = sessionStorage.getItem('signupData');
      if (!storedData) {
        setError('Session expired. Please signup again.');
        setStep(1);
        setLoading(false);
        return;
      }

      const userData = JSON.parse(storedData);
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          name: userData.name,
          code: newCode
        })
      });

      if (response.ok) {
        sessionStorage.setItem('signupCode', newCode);
        sessionStorage.setItem('codeExpiry', Date.now() + 10 * 60 * 1000);
        setSuccess('New verification code sent!');
      } else {
        setError('Failed to resend code');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Sign Up - Create Your Pro URL Monitor Account</title>
        <meta name="description" content="Create a free Pro URL Monitor account. Get access to 100+ SEO tools, monitor website performance, check URLs, and manage your SEO campaigns. Sign up now!" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/">
              <div className="text-3xl font-bold text-emerald-600 inline-block">Pro URL Monitor</div>
            </Link>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-center mb-6">
              {step === 1 ? 'Create Your Account' : 'Verify Your Email'}
            </h2>

            {error && (<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>)}
            {success && (<div className="mb-4 p-4 bg-green-50 border border-green-200 rounded text-green-700">{success}</div>)}

            {step === 1 ? (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="John Doe" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <input id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
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
                  disabled={loading} 
                  className="w-full btn btn-primary py-3 font-semibold disabled:opacity-50"
                >
                  {loading ? 'Sending Code...' : 'Send Verification Code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">
                    We've sent a 6-digit verification code to<br />
                    <span className="font-semibold text-gray-800">{formData.email}</span>
                  </p>
                </div>

                <div>
                  <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1 text-center">
                    Enter Verification Code
                  </label>
                  <input 
                    id="verificationCode" 
                    type="text" 
                    value={verificationCode} 
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                    placeholder="000000" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-center text-2xl font-mono tracking-widest" 
                    maxLength="6"
                    required 
                  />
                  <p className="text-xs text-gray-500 mt-1 text-center">Code expires in 10 minutes</p>
                </div>

                <button 
                  type="submit" 
                  disabled={loading || verificationCode.length !== 6} 
                  className="w-full btn btn-primary py-3 font-semibold disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify & Create Account'}
                </button>

                <div className="text-center space-y-2">
                  <button 
                    type="button" 
                    onClick={handleResendCode} 
                    disabled={loading}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium disabled:opacity-50"
                  >
                    Resend Code
                  </button>
                  <br />
                  <button 
                    type="button" 
                    onClick={() => setStep(1)}
                    className="text-sm text-gray-600 hover:text-gray-700"
                  >
                    Change Email Address
                  </button>
                </div>
              </form>
            )}

            <p className="text-center text-sm text-gray-600 mt-6">Already have an account? <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">Log in</Link></p>
          </div>

          <p className="text-center text-xs text-gray-500 mt-8 max-w-sm">By signing up, you agree to our <a href="#" className="text-emerald-600 hover:text-emerald-700">Terms of Service</a> and <a href="#" className="text-emerald-600 hover:text-emerald-700">Privacy Policy</a></p>
        </div>
      </div>
    </Layout>
  );
}
