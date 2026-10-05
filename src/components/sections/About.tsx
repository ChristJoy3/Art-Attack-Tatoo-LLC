"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { setupReveals } from "@/lib/animations";
import { about } from "@/data/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useAnchorScroll } from "@/hooks/useAnchorScroll";

export function About() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const onAnchor = useAnchorScroll();

  useGSAP(
    () => {
      if (!root.current) return;
      setupReveals(root.current, reduced);
      if (reduced) return;
      // Shop photo: clip-path wipe + inner counter-parallax.
      gsap.fromTo(
        "[data-about-photo]",
        { clipPath: "inset(18% 12% 18% 12%)" },
        { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: "[data-about-photo]", start: "top 95%", end: "center 55%", scrub: true } },
      );
      gsap.fromTo(
        "[data-about-photo] img",
        { scale: 1.25, yPercent: -6 },
        { scale: 1.05, yPercent: 6, ease: "none", scrollTrigger: { trigger: "[data-about-photo]", start: "top bottom", end: "bottom top", scrub: true } },
      );
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <section ref={root} id="about" data-stage="1" aria-labelledby="about-title" className="relative px-4 py-28 md:px-10 md:py-44">
      <div className="mx-auto grid max-w-[1600px] gap-12 md:gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p data-reveal="fade" className="label mb-8">
            {about.kicker}
          </p>
          <h2 id="about-title" data-reveal="lines" className="font-display text-[clamp(2.4rem,6vw,6rem)] leading-[0.95] tracking-[-0.02em]">
            {about.title}
          </h2>
        </div>

        <div className="space-y-6 text-lg leading-relaxed text-bone/75 md:max-w-2xl lg:col-span-4 lg:col-start-9 lg:max-w-none lg:pt-24">
          {about.paragraphs.map((p, i) => (
            <p key={i} data-reveal="fade" data-delay={i * 0.08}>
              {p}
            </p>
          ))}
        </div>

        <dl className="grid gap-px overflow-hidden rounded-2xl border border-bone/10 bg-bone/10 sm:grid-cols-3 lg:col-span-12 lg:mt-10">
          {about.facts.map((f, i) => (
            <div key={f.label} data-reveal="fade" data-delay={i * 0.1} className="bg-ink/85 p-6 backdrop-blur-sm lg:p-8">
              <dt className="label mb-3">{f.label}</dt>
              <dd className="font-display text-xl leading-snug md:text-2xl lg:text-3xl">{f.value}</dd>
            </div>
          ))}
        </dl>

        <figure className="lg:col-span-8 lg:mt-16">
          <div data-about-photo className="relative aspect-[16/9] overflow-hidden rounded-2xl lg:aspect-[16/7]">
            <Image
              src="/images/shop/panorama.webp"
              alt="Inside the Art Attack Tattoo studio: clean lobby with seating, front counter and wood floors"
              fill
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="object-cover grayscale-[35%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          </div>
          <figcaption className="label mt-4">The studio · 3656 Reynolda Road</figcaption>
        </figure>

        {/* Tablet: a wide two-column card under the photo. Desktop: a column beside it. */}
        <aside data-reveal="fade" className="self-end rounded-2xl border border-bone/10 bg-ink/80 p-8 backdrop-blur-sm md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-10 lg:col-span-4 lg:mt-16 lg:block">
          <div>
            <p className="label mb-4">{about.owner.role}</p>
            <h3 className="font-display text-3xl">{about.owner.name}</h3>
          </div>
          <div>
            <p className="mt-4 text-bone/70 md:mt-0 lg:mt-4">{about.owner.summary}</p>
            <a href="#artists" onClick={onAnchor} className="mt-6 inline-flex items-center gap-2 text-sm underline decoration-electric underline-offset-4 hover:text-electric">
              {about.owner.cta} <span aria-hidden>→</span>
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
