"use client";

import { useMediaQuery } from "./useMediaQuery";

/** Small viewport — used to lighten the 3D scene and simplify layouts. */
export function useIsMobile() {
  return useMediaQuery("(max-width: 767px)");
}

/** Touch-first device (no hover / coarse pointer) — disables cursor & magnetics. */
export function useIsTouch() {
  return useMediaQuery("(hover: none), (pointer: coarse)");
}
