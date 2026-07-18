import { useEffect, useRef, useState } from 'react';

/**
 * Returns the page scroll progress (0-1) and whether the back-to-top
 * button should be visible. Replaces the original jQuery `progress-wrap`
 * scroll handler.
 */
export default function useScrollProgress(showAfter = 100) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const frameId = useRef(null);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(pct);
      setVisible(scrollTop > showAfter);
      frameId.current = null;
    };

    const handleScroll = () => {
      if (frameId.current === null) {
        frameId.current = window.requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameId.current !== null) {
        window.cancelAnimationFrame(frameId.current);
      }
    };
  }, [showAfter]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return { progress, visible, scrollToTop };
}
