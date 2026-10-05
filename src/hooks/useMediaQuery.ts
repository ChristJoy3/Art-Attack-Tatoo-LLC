"use client";

import { useSyncExternalStore } from "react";

/**
 * SSR-safe media query hook. Returns `serverValue` during prerender and the
 * first hydration pass, then the real value — no hydration mismatch.
 */
export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}
