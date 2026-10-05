"use client";

import { useLenis } from "lenis/react";
import { useCallback, type MouseEvent } from "react";

/** Smooth in-page anchor navigation through Lenis (falls back to native). */
export function useAnchorScroll(onNavigate?: () => void) {
  const lenis = useLenis();
  return useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      const href = e.currentTarget.getAttribute("href");
      if (!href?.startsWith("#")) return;
      const target = href === "#top" ? 0 : document.querySelector<HTMLElement>(href);
      if (target === null) return;
      e.preventDefault();
      onNavigate?.();
      if (lenis) {
        lenis.scrollTo(target, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) });
      } else if (target === 0) {
        window.scrollTo({ top: 0 });
      } else {
        target.scrollIntoView();
      }
      history.replaceState(null, "", href === "#top" ? location.pathname : href);
    },
    [lenis, onNavigate],
  );
}
