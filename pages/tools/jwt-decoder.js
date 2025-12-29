import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function JWTDecoder() {
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState(null);
  const [error, setError] = useState('');

  const base64UrlDecode = (str) => {
    // Replace URL-safe characters
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    
    // Add padding if needed
    const pad = str.length % 4;
    if (pad) {
      if (pad === 1) {
        throw new Error('Invalid base64 string');
      }
      str += new Array(5 - pad).join('=');
    }
    
    try {
      // Decode base64
      const decoded = atob(str);
      // Parse as JSON
      return JSON.parse(decoded);
    } catch (err) {
      throw new Error('Invalid JWT format');
    }
  };

  const decodeToken = () => {
    if (!token.trim()) {
      setError('Please enter a JWT token');
      setDecoded(null);
      return;
    }

    try {
      // Split token into parts
      const parts = token.trim().split('.');
      
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. Token must have 3 parts separated by dots.');
      }

      // Decode header and payload
      const header = base64UrlDecode(parts[0]);
      const payload = base64UrlDecode(parts[1]);
      
      // Get signature (don't decode, it's binary)
      const signature = parts[2];

      // Check for expiration
      let isExpired = false;
      let expiresIn = null;
      if (payload.exp) {
        const now = Math.floor(Date.now() / 1000);
        isExpired = payload.exp < now;
        expiresIn = payload.exp - now;
      }

      setDecoded({
        header,
        payload,
        signature,
        isExpired,
        expiresIn,
        raw: {
          header: parts[0],
          payload: parts[1],
          signature: parts[2]
        }
      });
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to decode JWT token');
      setDecoded(null);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (err) {
      alert('Failed to copy');
    }
  };

  const formatJSON = (obj) => {
    return JSON.stringify(obj, null, 2);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const formatDuration = (seconds) => {
    if (seconds < 0) return 'Expired';
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
    
    return parts.join(' ');
  };

  const loadExample = () => {
    // Example JWT token (sample, not a real secret)
    const exampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxOTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    setToken(exampleToken);
  };

  const clearAll = () => {
    setToken('');
    setDecoded(null);
    setError('');
  };

  const getAlgorithmColor = (alg) => {
    const colors = {
      'HS256': 'bg-blue-100 text-blue-800',
      'HS384': 'bg-blue-100 text-blue-800',
      'HS512': 'bg-blue-100 text-blue-800',
      'RS256': 'bg-green-100 text-green-800',
      'RS384': 'bg-green-100 text-green-800',
      'RS512': 'bg-green-100 text-green-800',
      'ES256': 'bg-purple-100 text-purple-800',
      'ES384': 'bg-purple-100 text-purple-800',
      'ES512': 'bg-purple-100 text-purple-800',
    };
    return colors[alg] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Layout
      title="JWT Decoder - Decode JSON Web Tokens Online"
      description="Free online JWT decoder. Decode and analyze JSON Web Tokens (JWT) to view header, payload, and signature. Perfect for debugging authentication tokens."
    >
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              JWT Decoder
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Decode and analyze JSON Web Tokens (JWT) to inspect header, payload, and expiration. Essential tool for debugging authentication and authorization.
            </p>
          </div>

          {/* Tool Interface */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            {/* Input Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                JWT Token
              </label>
              <textarea
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste your JWT token here...&#10;Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.SflKxwRJ..."
                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm resize-none"
              />
              <div className="mt-2 text-sm text-gray-600">
                {token.length} characters
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={decodeToken}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium shadow-lg"
              >
                Decode JWT
              </button>
              <button
                onClick={loadExample}
                className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
              >
                Load Example
              </button>
              <button
                onClick={clearAll}
                className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Clear All
              </button>
            </div>

            {/* Security Notice */}
            <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
              <div className="flex">
                <span className="text-yellow-400 mr-3">⚠️</span>
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-1">Security Notice</h4>
                  <p className="text-sm text-yellow-700">
                    This tool only <strong>decodes</strong> JWT tokens, it does not verify signatures. 
                    Never share production tokens publicly. All processing happens in your browser.
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="font-semibold text-red-800 mb-1">Error</div>
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            {/* Decoded Output */}
            {decoded && !error && (
              <div className="space-y-6">
                {/* Token Status */}
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <div className="text-sm text-indigo-600 font-semibold mb-1">Token Status</div>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                        decoded.isExpired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {decoded.isExpired ? '❌ Expired' : '✓ Valid'}
                      </div>
                    </div>
                    {decoded.payload.exp && (
                      <div>
                        <div className="text-sm text-indigo-600 font-semibold mb-1">
                          {decoded.isExpired ? 'Expired' : 'Expires In'}
                        </div>
                        <div className="text-gray-900 font-mono">
                          {decoded.isExpired ? formatDuration(Math.abs(decoded.expiresIn)) + ' ago' : formatDuration(decoded.expiresIn)}
                        </div>
                      </div>
                    )}
                    {decoded.header.alg && (
                      <div>
                        <div className="text-sm text-indigo-600 font-semibold mb-1">Algorithm</div>
                        <div className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getAlgorithmColor(decoded.header.alg)}`}>
                          {decoded.header.alg}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Header */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-700">
                      Header (Algorithm & Token Type)
                    </label>
                    <button
                      onClick={() => copyToClipboard(formatJSON(decoded.header))}
                      className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                    >
                      Copy
                    </button>
                  </div>
                  <pre className="p-4 bg-gray-50 border border-gray-200 rounded-lg overflow-x-auto">
                    <code className="text-sm font-mono text-gray-900">{formatJSON(decoded.header)}</code>
                  </pre>
                </div>

                {/* Payload */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-700">
                      Payload (Claims & Data)
                    </label>
                    <button
                      onClick={() => copyToClipboard(formatJSON(decoded.payload))}
                      className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                    >
                      Copy
                    </button>
                  </div>
                  <pre className="p-4 bg-gray-50 border border-gray-200 rounded-lg overflow-x-auto">
                    <code className="text-sm font-mono text-gray-900">{formatJSON(decoded.payload)}</code>
                  </pre>
                </div>

                {/* Standard Claims */}
                {(decoded.payload.iss || decoded.payload.sub || decoded.payload.aud || decoded.payload.exp || decoded.payload.iat || decoded.payload.nbf) && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Standard Claims
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {decoded.payload.iss && (
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">Issuer (iss)</div>
                          <div className="font-mono text-sm text-gray-900 break-all">{decoded.payload.iss}</div>
                        </div>
                      )}
                      {decoded.payload.sub && (
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">Subject (sub)</div>
                          <div className="font-mono text-sm text-gray-900 break-all">{decoded.payload.sub}</div>
                        </div>
                      )}
                      {decoded.payload.aud && (
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">Audience (aud)</div>
                          <div className="font-mono text-sm text-gray-900 break-all">
                            {Array.isArray(decoded.payload.aud) ? decoded.payload.aud.join(', ') : decoded.payload.aud}
                          </div>
                        </div>
                      )}
                      {decoded.payload.exp && (
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">Expiration (exp)</div>
                          <div className="text-sm text-gray-900">{formatTimestamp(decoded.payload.exp)}</div>
                          <div className="text-xs text-gray-600 mt-1">Unix: {decoded.payload.exp}</div>
                        </div>
                      )}
                      {decoded.payload.iat && (
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">Issued At (iat)</div>
                          <div className="text-sm text-gray-900">{formatTimestamp(decoded.payload.iat)}</div>
                          <div className="text-xs text-gray-600 mt-1">Unix: {decoded.payload.iat}</div>
                        </div>
                      )}
                      {decoded.payload.nbf && (
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">Not Before (nbf)</div>
                          <div className="text-sm text-gray-900">{formatTimestamp(decoded.payload.nbf)}</div>
                          <div className="text-xs text-gray-600 mt-1">Unix: {decoded.payload.nbf}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Signature */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Signature (Base64 URL Encoded)
                  </label>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <code className="text-sm font-mono text-gray-900 break-all">{decoded.signature}</code>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    This signature verifies the token hasn't been tampered with. Verification requires the secret key.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Information Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              About JSON Web Tokens (JWT)
            </h2>
            
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">
                JSON Web Tokens (JWT) are compact, URL-safe tokens used for securely transmitting information 
                between parties. They're commonly used for authentication and information exchange in modern 
                web applications and APIs.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                JWT Structure
              </h3>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <div className="font-mono text-sm space-y-2">
                  <div>
                    <span className="text-red-600 font-semibold">Header</span>
                    <span className="text-gray-400">.</span>
                    <span className="text-purple-600 font-semibold">Payload</span>
                    <span className="text-gray-400">.</span>
                    <span className="text-cyan-600 font-semibold">Signature</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    Each part is Base64 URL encoded and separated by dots (.)
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-2">1. Header</h4>
                  <p className="text-sm text-red-800">
                    Contains token type (JWT) and signing algorithm (HS256, RS256, etc.)
                  </p>
                </div>
                <div className="border border-purple-200 bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">2. Payload</h4>
                  <p className="text-sm text-purple-800">
                    Contains claims (user data, permissions, expiration, etc.)
                  </p>
                </div>
                <div className="border border-cyan-200 bg-cyan-50 rounded-lg p-4">
                  <h4 className="font-semibold text-cyan-900 mb-2">3. Signature</h4>
                  <p className="text-sm text-cyan-800">
                    Verifies token integrity using secret key or public/private key pair
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Common Use Cases
              </h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span><strong>Authentication:</strong> Verify user identity after login without sessions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span><strong>Authorization:</strong> Control access to API endpoints and resources</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span><strong>Single Sign-On (SSO):</strong> Share authentication across multiple services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span><strong>API Security:</strong> Secure REST APIs with stateless authentication</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span><strong>Information Exchange:</strong> Securely transmit verified data between parties</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span><strong>OAuth 2.0:</strong> Used as access and refresh tokens in OAuth flows</span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Standard Claims (Registered)
              </h3>
              
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border border-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Claim</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Full Name</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono">iss</td>
                      <td className="border border-gray-200 px-4 py-2">Issuer</td>
                      <td className="border border-gray-200 px-4 py-2">Who created and signed the token</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono">sub</td>
                      <td className="border border-gray-200 px-4 py-2">Subject</td>
                      <td className="border border-gray-200 px-4 py-2">User ID or subject identifier</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono">aud</td>
                      <td className="border border-gray-200 px-4 py-2">Audience</td>
                      <td className="border border-gray-200 px-4 py-2">Who the token is intended for</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono">exp</td>
                      <td className="border border-gray-200 px-4 py-2">Expiration Time</td>
                      <td className="border border-gray-200 px-4 py-2">When the token expires (Unix timestamp)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono">iat</td>
                      <td className="border border-gray-200 px-4 py-2">Issued At</td>
                      <td className="border border-gray-200 px-4 py-2">When the token was created (Unix timestamp)</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-mono">nbf</td>
                      <td className="border border-gray-200 px-4 py-2">Not Before</td>
                      <td className="border border-gray-200 px-4 py-2">Token not valid before this time</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-mono">jti</td>
                      <td className="border border-gray-200 px-4 py-2">JWT ID</td>
                      <td className="border border-gray-200 px-4 py-2">Unique identifier for the token</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Signing Algorithms
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">HMAC (Symmetric)</h4>
                  <ul className="space-y-2 text-sm">
                    <li><strong>HS256:</strong> HMAC with SHA-256 (most common)</li>
                    <li><strong>HS384:</strong> HMAC with SHA-384</li>
                    <li><strong>HS512:</strong> HMAC with SHA-512</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-2">
                    Uses shared secret key. Same key signs and verifies.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">RSA/ECDSA (Asymmetric)</h4>
                  <ul className="space-y-2 text-sm">
                    <li><strong>RS256:</strong> RSA with SHA-256</li>
                    <li><strong>ES256:</strong> ECDSA with SHA-256</li>
                    <li><strong>PS256:</strong> RSA-PSS with SHA-256</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-2">
                    Uses key pair. Private key signs, public key verifies.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Security Best Practices
              </h3>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <h4 className="font-semibold text-blue-800 mb-2">✓ Do's</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Always verify signatures on the server</li>
                  <li>• Use HTTPS to prevent token interception</li>
                  <li>• Set short expiration times (exp claim)</li>
                  <li>• Store tokens securely (httpOnly cookies preferred)</li>
                  <li>• Include audience (aud) and issuer (iss) claims</li>
                  <li>• Use strong algorithms (RS256, ES256 for production)</li>
                  <li>• Implement token refresh mechanisms</li>
                </ul>
              </div>

              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <h4 className="font-semibold text-red-800 mb-2">✗ Don'ts</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Don't store sensitive data in payload (it's not encrypted!)</li>
                  <li>• Don't use 'none' algorithm in production</li>
                  <li>• Don't share secret keys or tokens publicly</li>
                  <li>• Don't skip signature verification</li>
                  <li>• Don't store tokens in localStorage (XSS vulnerable)</li>
                  <li>• Don't use weak secrets for HMAC algorithms</li>
                  <li>• Don't trust decoded tokens without verification</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Frequently Asked Questions
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Are JWT tokens encrypted?</h4>
                  <p>
                    No, standard JWTs are <strong>signed</strong> but not <strong>encrypted</strong>. The payload 
                    is Base64 encoded and easily decoded. Anyone can read the contents. For encryption, use JWE 
                    (JSON Web Encryption) instead.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Can I decode a JWT without the secret?</h4>
                  <p>
                    Yes! Decoding only reads the Base64 encoded content. The secret is needed for <strong>verification</strong> 
                    (checking if the signature is valid). This tool decodes but doesn't verify.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">How long should JWT tokens be valid?</h4>
                  <p>
                    Short-lived access tokens (5-15 minutes) with long-lived refresh tokens (days/weeks) is 
                    recommended. Balance security (shorter is safer) with user experience (longer requires 
                    fewer refreshes).
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Should I use JWT for sessions?</h4>
                  <p>
                    JWT works for stateless authentication but has tradeoffs: can't revoke tokens easily, 
                    larger than session IDs, and all data is sent with each request. Consider your use case: 
                    JWTs excel for APIs and microservices, sessions work well for traditional web apps.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What's the difference between HS256 and RS256?</h4>
                  <p>
                    HS256 uses a shared secret (symmetric) - same key for signing and verification. RS256 uses 
                    RSA key pairs (asymmetric) - private key signs, public key verifies. Use RS256 when multiple 
                    services need to verify but not create tokens.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Can I modify a JWT token?</h4>
                  <p>
                    You can modify the payload, but the signature will no longer be valid. Any verification will 
                    fail. This is by design - JWT's signature ensures integrity. To legitimately change data, 
                    you must re-sign with the secret key.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
