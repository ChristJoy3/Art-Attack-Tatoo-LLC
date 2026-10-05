"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { whenReady } from "@/lib/store";
import { hero, contact } from "@/data/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const headline = el.querySelector<HTMLElement>("[data-hero-title]");
      if (!headline) return;

      // Hidden until the preloader leaves; then a cinematic character rise.
      gsap.set("[data-hero-fade]", { autoAlpha: 0, y: reduced ? 0 : 24 });
      gsap.set(headline, { autoAlpha: 0 });
      let split: SplitText | undefined;

      const unsub = whenReady(() => {
        document.fonts.ready.then(() => {
          gsap.set(headline, { autoAlpha: 1 });
          const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
          if (reduced) {
            tl.from(headline, { autoAlpha: 0, duration: 0.6 });
          } else {
            split = SplitText.create(headline, { type: "lines,chars", mask: "lines", linesClass: "split-line" });
            tl.from(split.chars, { yPercent: 120, rotate: 8, duration: 1.6, stagger: 0.025 });
          }
          tl.to("[data-hero-fade]", { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.08 }, reduced ? 0 : 0.5);
        });
      });

      // Scroll away: content drifts up and dims while the camera dives.
      if (!reduced) {
        gsap.to("[data-hero-content]", {
          yPercent: -18,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
      }
      return () => {
        unsub();
        split?.revert();
      };
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <section ref={root} id="top" data-stage="0" aria-labelledby="hero-title" className="relative flex min-h-svh flex-col justify-end overflow-hidden px-4 pb-10 pt-28 md:px-10 md:pb-14">
      <div data-hero-content className="mx-auto w-full max-w-[1600px]">
        <p data-hero-fade className="label mb-6 md:mb-8">
          <span className="mr-3 inline-block h-1.5 w-1.5 -translate-y-px rounded-full bg-electric align-middle" />
          {hero.eyebrow}
        </p>

        <h1 id="hero-title" data-hero-title className="font-display text-[clamp(3.2rem,12vw,12.5rem)] font-normal leading-[0.88] tracking-[-0.035em]">
          {hero.headline.map((line, i) => (
            <span key={line} className={`block ${i === 1 ? "pl-[8vw] italic text-bone/90" : ""} ${i === 2 ? "md:pl-[16vw]" : ""}`}>
              {i === 2 ? (
                <>
                  {line.replace(/\.$/, "")}
                  <span className="text-electric">.</span>
                </>
              ) : (
                line
              )}
            </span>
          ))}
        </h1>

        <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-12 md:items-end">
          <p data-hero-fade className="max-w-md text-base leading-relaxed text-bone/75 md:col-span-5 md:text-lg">
            {hero.sub}
          </p>
          <div data-hero-fade className="flex flex-wrap gap-3 md:col-span-4 md:col-start-6">
            <MagneticButton href={hero.primaryCta.href}>
              {hero.primaryCta.label}
              <span aria-hidden>→</span>
            </MagneticButton>
            <MagneticButton href={hero.secondaryCta.href} variant="ghost">
              {hero.secondaryCta.label}
            </MagneticButton>
          </div>
          <dl data-hero-fade className="hidden gap-1 text-right md:col-span-3 md:grid">
            <dt className="label">Open</dt>
            <dd className="text-sm text-bone/80">Tues – Sat · 10am – 6pm</dd>
            <dt className="label mt-3">Call</dt>
            <dd className="text-sm text-bone/80">
              <a href={contact.phoneHref} className="hover:text-electric">
                {contact.phoneDisplay}
              </a>
            </dd>
          </dl>
        </div>
      </div>

    </section>
  );
}
