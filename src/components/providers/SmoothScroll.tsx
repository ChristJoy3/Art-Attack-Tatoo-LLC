"use client";

import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scrollState } from "@/lib/store";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Keeps ScrollTrigger in sync with Lenis and refreshes after fonts/assets settle. */
function LenisBridge() {
  useLenis((lenis) => {
    ScrollTrigger.update();
    scrollState.velocity = lenis.velocity;
    scrollState.progress = lenis.progress;
  });

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    // Debounced refresh when the document height changes (images, accordions…).
    let t: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(t);
      t = setTimeout(refresh, 200);
    });
    ro.observe(document.body);
    return () => {
      window.removeEventListener("load", refresh);
      ro.disconnect();
      clearTimeout(t);
    };
  }, []);

  return null;
}

/**
 * Root smooth-scroll provider. Lenis is driven by the GSAP ticker (single RAF
 * loop for scroll + animations), so ScrollTrigger scrubs never drift.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        // Reduced motion: no smoothing, native-feeling scroll.
        lerp: reduced ? 1 : 0.085,
        smoothWheel: !reduced,
        wheelMultiplier: 0.9,
        // Plain in-page anchors (e.g. footer links) also scroll smoothly.
        anchors: true,
      }}
    >
      <LenisBridge />
      {children}
    </ReactLenis>
  );
}
