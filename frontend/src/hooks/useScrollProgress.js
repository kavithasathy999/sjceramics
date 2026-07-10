import { useEffect, useState } from 'react';

/**
 * Returns the page scroll progress (0-1) and whether the back-to-top
 * button should be visible. Replaces the original jQuery `progress-wrap`
 * scroll handler.
 */
export default function useScrollProgress(showAfter = 100) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(pct);
      setVisible(scrollTop > showAfter);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfter]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return { progress, visible, scrollToTop };
}
