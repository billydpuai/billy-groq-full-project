import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

// Returns true when window.innerWidth < 768. Uses a resize listener
// (not a CSS media query) so components can branch inline styles with
// a plain boolean: isMobile ? mobileValue : desktopValue.
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false,
  );

  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return isMobile;
}
