import { useEffect, useState } from 'react';

/**
 * Original template faded out a `.preloader` div once `window.onload`
 * fired. We reproduce that with a short timer + CSS transition instead
 * of a jQuery fade.
 */
export default function Preloader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHidden(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="preloader"
      style={{
        opacity: hidden ? 0 : 1,
        visibility: hidden ? 'hidden' : 'visible',
        transition: 'opacity 0.5s ease, visibility 0.5s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        backgroundImage: 'none',
      }}
    >
      <img
        src="/Logo_Png.png"
        alt="SJ Ceramics Logo"
        style={{
          maxWidth: '200px',
          maxHeight: '150px',
          objectFit: 'contain',
          animation: 'logo-pulse 1.6s infinite ease-in-out',
        }}
      />
      <style>{`
        @keyframes logo-pulse {
          0% { transform: scale(0.95); opacity: 0.85; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.85; }
        }
      `}</style>
    </div>
  );
}
