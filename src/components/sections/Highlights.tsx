"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { setupParallax, setupReveals } from "@/lib/animations";
import { highlights } from "@/data/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Parallax speeds per card — columns drift at different rates. */
const SPEEDS = [0.9, 1.08, 0.96, 1.12, 0.92, 1.04];

export function Highlights() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      setupReveals(el, reduced);
      setupParallax(el, reduced);

      // Quote: words light up as you scroll through it.
      const quote = el.querySelector<HTMLElement>("[data-quote]");
      if (quote && !reduced) {
        SplitText.create(quote, {
          type: "words",
          autoSplit: true,
          onSplit: (self) =>
            gsap.fromTo(
              self.words,
              { opacity: 0.15 },
              { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: quote, start: "top 80%", end: "bottom 45%", scrub: true } },
            ),
        });
      }
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <section ref={root} id="why" data-stage="3" aria-labelledby="why-title" className="relative px-4 py-28 md:px-10 md:py-44">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-16 grid gap-6 md:mb-24 md:grid-cols-12">
          <p data-reveal="fade" className="label md:col-span-3">
            {highlights.kicker}
          </p>
          <h2 id="why-title" data-reveal="lines" className="font-display text-[clamp(2.4rem,6.5vw,6.5rem)] leading-[0.95] tracking-[-0.02em] md:col-span-9">
            {highlights.title}
          </h2>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.items.map((h, i) => (
            <li
              key={h.title}
              data-speed={SPEEDS[i]}
              className={`group relative overflow-hidden rounded-2xl border border-bone/10 bg-ink/75 p-8 backdrop-blur-md transition-colors duration-700 hover:border-electric/60 md:p-10 ${i % 3 === 1 ? "lg:translate-y-16" : ""}`}
            >
              <div data-reveal="fade" data-delay={(i % 3) * 0.08}>
                <div className="mb-10 flex items-center justify-between">
                  <span className="label !text-electric">{h.kicker}</span>
                  <span className="font-display text-sm text-bone/30">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="font-display text-3xl leading-tight">{h.title}</h3>
                <p className="mt-4 leading-relaxed text-bone/70">{h.body}</p>
              </div>
              {/* Engraved corner sunburst on hover */}
              <svg aria-hidden viewBox="0 0 100 100" className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rotate-0 text-bone/0 transition-all duration-1000 ease-expo group-hover:rotate-45 group-hover:text-bone/20">
                {Array.from({ length: 24 }, (_, k) => {
                  const a = (k / 24) * Math.PI * 2;
                  return <line key={k} x1={50 + Math.cos(a) * 18} y1={50 + Math.sin(a) * 18} x2={50 + Math.cos(a) * 48} y2={50 + Math.sin(a) * 48} stroke="currentColor" strokeWidth="0.6" />;
                })}
              </svg>
            </li>
          ))}
        </ul>

        <figure className="mx-auto mt-32 max-w-5xl text-center md:mt-48">
          <blockquote data-quote className="font-display text-[clamp(1.8rem,4.2vw,4rem)] italic leading-[1.1] tracking-[-0.01em]">
            “{highlights.quote.text}”
          </blockquote>
          <figcaption data-reveal="fade" className="label mt-8 !text-electric">
            {highlights.quote.tag}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
