import { useEffect, useRef, useState } from 'react';

export default function CloudflareTurnstile({ onVerify, onError, onExpire }) {
  const turnstileRef = useRef(null);
  const [widgetId, setWidgetId] = useState(null);

  // Replace this with your actual Cloudflare Turnstile site key
  // Get it from: https://dash.cloudflare.com/?to=/:account/turnstile
  // Testing key (works on all domains): 1x00000000000000000000AA
  // Production key: 0x4AAAAAACJefAMC1oY_DaBk
  const SITE_KEY = process.env.NODE_ENV === 'production' 
    ? '0x4AAAAAACJefAMC1oY_DaBk' 
    : '1x00000000000000000000AA'; // Cloudflare's test key

  useEffect(() => {
    let mounted = true;
    let intervalId = null;

    // Wait for Turnstile script to load
    const loadTurnstile = () => {
      if (!mounted) return;
      
      if (window.turnstile && turnstileRef.current) {
        // Check if widget already exists
        if (turnstileRef.current.children.length > 0) {
          return;
        }

        try {
          const id = window.turnstile.render(turnstileRef.current, {
            sitekey: SITE_KEY,
            theme: 'light',
            callback: (token) => {
              if (mounted && onVerify) onVerify(token);
            },
            'error-callback': () => {
              if (mounted && onError) onError();
            },
            'expired-callback': () => {
              if (mounted && onExpire) onExpire();
            },
          });
          if (mounted) {
            setWidgetId(id);
          }
        } catch (error) {
          console.error('Turnstile render error:', error);
        }
      }
    };

    // Check if script is already loaded
    if (window.turnstile) {
      loadTurnstile();
    } else {
      // Wait for script to load
      intervalId = setInterval(() => {
        if (window.turnstile) {
          loadTurnstile();
          clearInterval(intervalId);
          intervalId = null;
        }
      }, 100);
    }

    // Cleanup
    return () => {
      mounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (widgetId !== null && window.turnstile) {
        try {
          window.turnstile.remove(widgetId);
        } catch (error) {
          // Widget may already be removed
        }
      }
    };
  }, []);

  return <div ref={turnstileRef}></div>;
}
