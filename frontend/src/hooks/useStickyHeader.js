import { useEffect, useState } from 'react';

/**
 * Tracks scroll position and returns true once the page has scrolled
 * past `threshold` px, so the header can switch into its "fixed" style.
 * Replaces the original jQuery `$(window).scroll()` handler.
 */
export default function useStickyHeader(threshold = 200) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > threshold);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isSticky;
}
