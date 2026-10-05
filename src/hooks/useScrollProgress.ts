"use client";

import { scrollState } from "@/lib/store";

/**
 * Returns the shared mutable scroll state. Read it inside useFrame / gsap
 * ticker callbacks — it never triggers React re-renders by design.
 */
export function useScrollProgress() {
  return scrollState;
}
