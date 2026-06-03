import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Ensures every route change starts at the top of the page.
 * Skips when navigation includes a hash anchor (#id).
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;