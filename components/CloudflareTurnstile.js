import { useEffect, useRef, useState } from 'react';

export default function CloudflareTurnstile({ onVerify, onError, onExpire }) {
  const turnstileRef = useRef(null);
  const [widgetId, setWidgetId] = useState(null);

  // Replace this with your actual Cloudflare Turnstile site key
  // Get it from: https://dash.cloudflare.com/?to=/:account/turnstile
  const SITE_KEY = '1x00000000000000000000AA'; // Demo key - replace with your actual key

  useEffect(() => {
    // Wait for Turnstile script to load
    const loadTurnstile = () => {
      if (window.turnstile && turnstileRef.current) {
        const id = window.turnstile.render(turnstileRef.current, {
          sitekey: SITE_KEY,
          theme: 'light',
          callback: (token) => {
            if (onVerify) onVerify(token);
          },
          'error-callback': () => {
            if (onError) onError();
          },
          'expired-callback': () => {
            if (onExpire) onExpire();
          },
        });
        setWidgetId(id);
      }
    };

    // Check if script is already loaded
    if (window.turnstile) {
      loadTurnstile();
    } else {
      // Wait for script to load
      const checkTurnstile = setInterval(() => {
        if (window.turnstile) {
          loadTurnstile();
          clearInterval(checkTurnstile);
        }
      }, 100);

      return () => clearInterval(checkTurnstile);
    }

    // Cleanup
    return () => {
      if (widgetId !== null && window.turnstile) {
        window.turnstile.remove(widgetId);
      }
    };
  }, [onVerify, onError, onExpire]);

  return <div ref={turnstileRef}></div>;
}
