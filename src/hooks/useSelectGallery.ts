"use client";

import { useLenis } from "lenis/react";
import { useCallback } from "react";
import { appState } from "@/lib/store";
import { getWorkItems } from "@/data/content";

const warmed = new Set<string>();

/**
 * Show a gallery in the Work section and bring the visitor to its start.
 * `preload` warms the browser cache (e.g. on hover) so the 3D texture swap
 * is near-instant — plain image requests keep three.js out of this bundle.
 */
export function useSelectGallery() {
  const lenis = useLenis();

  const select = useCallback(
    (id: string, { scroll = true }: { scroll?: boolean } = {}) => {
      appState.set({ workGallery: id });
      if (!scroll) return;
      const target = document.getElementById("work");
      if (!target) return;
      if (lenis) lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
      else target.scrollIntoView();
    },
    [lenis],
  );

  const preload = useCallback((id: string) => {
    if (warmed.has(id)) return;
    warmed.add(id);
    for (const item of getWorkItems(id, false)) {
      const img = new Image();
      img.decoding = "async";
      img.src = item.src;
    }
  }, []);

  return { select, preload };
}
