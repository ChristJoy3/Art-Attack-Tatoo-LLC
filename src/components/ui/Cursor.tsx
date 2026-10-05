"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useIsTouch } from "@/hooks/useIsMobile";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/** Custom cursor (desktop, fine pointers only): electric dot + trailing ring. */
export function Cursor() {
  const touch = useIsTouch();
  const reduced = useReducedMotion();
  // Desktop widths only: tablets (even with a trackpad) keep the system pointer.
  const wide = useMediaQuery("(min-width: 1024px)");
  const enabled = !touch && !reduced && wide;
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!enabled || !dot.current || !ring.current) return;
      document.documentElement.classList.add("has-cursor");
      gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50, autoAlpha: 0 });
      const dx = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3.out" });
      const dy = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3.out" });
      const rx = gsap.quickTo(ring.current, "x", { duration: 0.55, ease: "power3.out" });
      const ry = gsap.quickTo(ring.current, "y", { duration: 0.55, ease: "power3.out" });
      let visible = false;

      const move = (e: PointerEvent) => {
        if (!visible) {
          visible = true;
          gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 });
        }
        dx(e.clientX);
        dy(e.clientY);
        rx(e.clientX);
        ry(e.clientY);
      };
      const over = (e: PointerEvent) => {
        const hit = (e.target as Element | null)?.closest("a, button, summary, [data-cursor]");
        gsap.to(ring.current, {
          scale: hit ? 1.9 : 1,
          backgroundColor: hit ? "rgb(237 232 223 / 0.08)" : "rgb(237 232 223 / 0)",
          borderColor: hit ? "rgb(224 38 43 / 0.9)" : "rgb(237 232 223 / 0.45)",
          duration: 0.4,
        });
        gsap.to(dot.current, { scale: hit ? 0.5 : 1, duration: 0.3 });
      };
      const leave = () => {
        visible = false;
        gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.3 });
      };

      window.addEventListener("pointermove", move, { passive: true });
      window.addEventListener("pointerover", over, { passive: true });
      document.documentElement.addEventListener("pointerleave", leave);
      return () => {
        document.documentElement.classList.remove("has-cursor");
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerover", over);
        document.documentElement.removeEventListener("pointerleave", leave);
      };
    },
    { dependencies: [enabled], revertOnUpdate: true },
  );

  if (!enabled) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]">
      <div ref={ring} className="fixed left-0 top-0 h-9 w-9 rounded-full border border-bone/45" />
      <div ref={dot} className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-electric" />
    </div>
  );
}
