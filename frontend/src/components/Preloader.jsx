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
      }}
    />
  );
}
