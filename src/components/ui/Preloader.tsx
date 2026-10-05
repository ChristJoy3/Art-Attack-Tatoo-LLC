"use client";

import Image from "next/image";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { appState } from "@/lib/store";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const RAYS = 96;
const MIN_TIME = 1400; // ms — long enough to read the logo, short enough not to annoy
const MAX_TIME = 12000; // ms — never trap the visitor if something stalls

/**
 * Logo preloader. The radiating rays and counter follow real 3D asset
 * loading (drei useProgress → appState.progress), then the panel wipes away.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const rays = useRef<SVGGElement>(null);
  const [done, setDone] = useState(false);
  const lenis = useLenis();
  const reduced = useReducedMotion();

  // Lock scrolling while loading.
  useEffect(() => {
    if (!lenis || done) return;
    lenis.stop();
    window.scrollTo(0, 0);
    return () => lenis.start();
  }, [lenis, done]);

  useGSAP(
    () => {
      const shown = { p: 0 };
      const start = performance.now();
      let exiting = false;
      const rayEls = rays.current ? Array.from(rays.current.children) : [];

      const render = () => {
        const p = shown.p;
        if (counter.current) counter.current.textContent = String(Math.round(p)).padStart(3, "0");
        if (bar.current) bar.current.style.transform = `scaleX(${p / 100})`;
        const lit = Math.round((p / 100) * RAYS);
        rayEls.forEach((el, i) => el.setAttribute("opacity", i < lit ? "1" : "0.12"));
      };

      const exit = () => {
        if (exiting) return;
        exiting = true;
        gsap
          .timeline({
            onComplete: () => {
              appState.set({ ready: true });
              setDone(true);
            },
          })
          .to(shown, { p: 100, duration: 0.4, ease: "power2.out", onUpdate: render })
          .to("[data-pre-fade]", { autoAlpha: 0, y: -12, duration: 0.5, stagger: 0.05, ease: "power2.in" }, "+=0.15")
          .to("[data-pre-logo]", { scale: reduced ? 1 : 1.08, autoAlpha: 0, duration: 0.7, ease: "power3.in" }, "<0.1")
          .to(root.current, { clipPath: "inset(0 0 100% 0)", duration: reduced ? 0.3 : 1.1, ease: "expo.inOut" }, "-=0.2");
      };

      const tick = () => {
        const target = appState.get().progress;
        // Ease the displayed value toward the real one.
        shown.p += (Math.max(shown.p, target) - shown.p) * 0.12;
        render();
        const elapsed = performance.now() - start;
        if ((target >= 100 && elapsed > MIN_TIME) || elapsed > MAX_TIME) {
          gsap.ticker.remove(tick);
          document.fonts.ready.then(exit);
        }
      };
      gsap.ticker.add(tick);

      gsap.from("[data-pre-logo]", { autoAlpha: 0, scale: 0.94, duration: 1.4, ease: "expo.out" });
      return () => gsap.ticker.remove(tick);
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
      style={{ clipPath: "inset(0 0 0 0)" }}
      role="status"
      aria-live="polite"
      aria-label="Loading Art Attack Tattoo"
    >
      <div className="relative flex aspect-square w-[min(92vw,640px)] items-center justify-center">
        <svg viewBox="-500 -500 1000 1000" className="absolute inset-0 h-full w-full" aria-hidden>
          <g ref={rays} stroke="var(--bone)" strokeWidth="1.2" strokeLinecap="round">
            {Array.from({ length: RAYS }, (_, i) => {
              const a = (i / RAYS) * Math.PI * 2 - Math.PI / 2;
              const inner = 330;
              const outer = inner + 40 + ((i * 37) % 11) * 11;
              const f = (n: number) => Math.round(n * 100) / 100;
              return (
                <line
                  key={i}
                  x1={f(Math.cos(a) * inner)}
                  y1={f(Math.sin(a) * inner)}
                  x2={f(Math.cos(a) * outer)}
                  y2={f(Math.sin(a) * outer)}
                  opacity="0.12"
                  stroke={i % 12 === 0 ? "var(--electric)" : undefined}
                />
              );
            })}
          </g>
        </svg>
        <div data-pre-logo className="relative w-[78%]">
          <Image src="/logo.png" alt="Art Attack Electric Tattooing" width={839} height={506} priority className="h-auto w-full" />
        </div>
      </div>

      <div className="mt-2 flex w-[min(80vw,320px)] flex-col items-center gap-3">
        <div data-pre-fade className="h-px w-full overflow-hidden bg-bone/15">
          <div ref={bar} className="h-full w-full origin-left scale-x-0 bg-electric" />
        </div>
        <p data-pre-fade className="label tabular-nums">
          Loading <span ref={counter}>000</span>%
        </p>
      </div>
    </div>
  );
}
