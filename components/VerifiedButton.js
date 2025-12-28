import { useState } from 'react';
import CloudflareTurnstile from './CloudflareTurnstile';

/**
 * A button that requires Cloudflare Turnstile verification before enabling
 * Use this for any action that needs bot protection
 * 
 * Usage:
 * <VerifiedButton onClick={handleSubmit} loading={loading}>
 *   Check Now
 * </VerifiedButton>
 */
export default function VerifiedButton({ 
  onClick, 
  children, 
  loading = false, 
  className = '', 
  showTurnstile = true,
  disabled = false,
  ...props 
}) {
  const [verified, setVerified] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');

  const handleClick = (e) => {
    if (!verified) {
      e.preventDefault();
      alert('Please complete the human verification first!');
      return;
    }
    if (onClick) {
      onClick(e, turnstileToken);
    }
  };

  const isDisabled = loading || disabled || !verified;

  return (
    <div className="space-y-3">
      {showTurnstile && (
        <div className="flex justify-center">
          <CloudflareTurnstile
            onVerify={(token) => {
              setTurnstileToken(token);
              setVerified(true);
            }}
            onError={() => setVerified(false)}
            onExpire={() => setVerified(false)}
          />
        </div>
      )}
      
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={`${className} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        {...props}
      >
        {loading ? 'Processing...' : (verified ? children : 'Complete Verification First')}
      </button>
    </div>
  );
}
