import { useEffect, useRef, useState } from 'react';

/**
 * Tracks both the sticky state and the user's scroll direction.
 * Once activated, the sticky header remains available until the page reaches
 * the top so it does not disappear while the user is scrolling upward.
 */
export default function useStickyHeader(threshold = 200, directionDelta = 6) {
  const [isSticky, setIsSticky] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const isStickyRef = useRef(false);
  const frameId = useRef(null);

  useEffect(() => {
    const updateHeader = () => {
      const currentScrollY = Math.max(window.scrollY, 0);

      if (currentScrollY === 0) {
        isStickyRef.current = false;
        setIsSticky(false);
        setIsVisible(true);
        lastScrollY.current = 0;
        frameId.current = null;
        return;
      }

      if (!isStickyRef.current && currentScrollY >= threshold) {
        isStickyRef.current = true;
        setIsSticky(true);
      }

      if (!isStickyRef.current) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        frameId.current = null;
        return;
      }

      const scrollDifference = currentScrollY - lastScrollY.current;

      // Ignore tiny trackpad/touch movements so the header does not flicker.
      if (Math.abs(scrollDifference) >= directionDelta) {
        setIsVisible(scrollDifference < 0);
        lastScrollY.current = currentScrollY;
      }

      frameId.current = null;
    };

    const handleScroll = () => {
      if (frameId.current === null) {
        frameId.current = window.requestAnimationFrame(updateHeader);
      }
    };

    lastScrollY.current = Math.max(window.scrollY, 0);
    isStickyRef.current = lastScrollY.current >= threshold;
    setIsSticky(isStickyRef.current);
    setIsVisible(true);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameId.current !== null) {
        window.cancelAnimationFrame(frameId.current);
      }
    };
  }, [directionDelta, threshold]);

  return { isSticky, isVisible };
}
