"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { setupReveals } from "@/lib/animations";
import { booking, aftercare, aftercareNote, piercingWork } from "@/data/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function Accordion({ title, body }: { title: string; body: string }) {
  return (
    <details className="group border-b border-bone/10 py-5 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg transition-colors hover:text-electric">
        {title}
        <span aria-hidden className="relative h-4 w-4 shrink-0">
          <span className="absolute left-0 top-1/2 h-px w-4 bg-current" />
          <span className="absolute left-0 top-1/2 h-px w-4 rotate-90 bg-current transition-transform duration-500 ease-expo group-open:rotate-0" />
        </span>
      </summary>
      <p className="mt-4 max-w-2xl leading-relaxed text-bone/70">{body}</p>
    </details>
  );
}

export function Booking() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!root.current) return;
      setupReveals(root.current, reduced);
      if (reduced) return;
      // The timeline rail draws itself as you scroll through the steps.
      gsap.fromTo(
        "[data-rail]",
        { scaleX: 0 },
        { scaleX: 1, ease: "none", scrollTrigger: { trigger: "[data-steps]", start: "top 75%", end: "bottom 60%", scrub: true } },
      );
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <section ref={root} id="booking" data-stage="6" aria-labelledby="booking-title" className="relative px-4 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        {/* Piercings by Lee */}
        <div className="mb-28 md:mb-40">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p data-reveal="fade" className="label mb-3 !text-electric">
                Piercings by Lee
              </p>
              <p data-reveal="fade" className="max-w-md text-bone/70">
                Book with Lee, or see her up-to-date portfolio, on Instagram.
              </p>
            </div>
            <a data-reveal="fade" href="https://www.instagram.com/piercings.by.lee/" target="_blank" rel="noopener noreferrer" className="text-sm underline decoration-electric underline-offset-4 hover:text-electric">
              @piercings.by.lee
            </a>
          </div>
          <ul className="mt-8 grid grid-cols-3 gap-3 md:grid-cols-5 md:gap-5">
            {piercingWork.map((w, i) => (
              <li key={w.src} data-reveal="fade" data-delay={i * 0.05} className={`relative aspect-square overflow-hidden rounded-xl ${i > 2 ? "hidden md:block" : ""}`}>
                <Image src={w.src} alt={w.alt} fill sizes="(min-width: 768px) 20vw, 33vw" className="object-cover grayscale transition duration-700 hover:grayscale-0" />
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-16 grid gap-6 md:mb-24 md:grid-cols-12">
          <p data-reveal="fade" className="label md:col-span-3">
            {booking.kicker}
          </p>
          <div className="md:col-span-9">
            <h2 id="booking-title" data-reveal="lines" className="font-display text-[clamp(2.4rem,6vw,6rem)] leading-[0.95] tracking-[-0.02em]">
              {booking.title}
            </h2>
            <p data-reveal="fade" className="mt-6 max-w-2xl text-lg leading-relaxed text-bone/70">
              {booking.intro}
            </p>
          </div>
        </div>

        {/* Steps */}
        <div data-steps className="relative">
          <div className="absolute left-0 right-0 top-[1.6rem] hidden h-px bg-bone/10 md:block" aria-hidden>
            <div data-rail className="h-full w-full origin-left bg-electric" />
          </div>
          <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
            {booking.steps.map((s, i) => (
              <li key={s.title} data-reveal="fade" data-delay={i * 0.12} className="relative">
                <span className="relative z-10 mb-8 flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-full border border-bone/25 bg-ink font-display text-lg">
                  {i + 1}
                </span>
                <h3 className="font-display text-3xl">{s.title}</h3>
                <p className="mt-3 max-w-sm leading-relaxed text-bone/70">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Policies + aftercare */}
        <div className="mt-28 grid gap-16 md:mt-40 md:grid-cols-2 md:gap-20">
          <div className="rounded-2xl border border-bone/10 bg-ink/85 p-6 backdrop-blur-md md:p-10">
            <p data-reveal="fade" className="label mb-4">
              Before you come in
            </p>
            <h3 data-reveal="fade" className="font-display text-4xl">
              Shop policies
            </h3>
            <div className="mt-6">
              {booking.policies.map((p) => (
                <Accordion key={p.title} {...p} />
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-bone/10 bg-ink/85 p-6 backdrop-blur-md md:p-10">
            <p data-reveal="fade" className="label mb-4">
              After you leave
            </p>
            <h3 data-reveal="fade" className="font-display text-4xl">
              Aftercare
            </h3>
            {aftercare.map((guide) => (
              <div key={guide.title} className="mt-8">
                <p className="label !text-electric">{guide.title}</p>
                <div className="mt-2">
                  {guide.steps.map((s) => (
                    <Accordion key={s.title} {...s} />
                  ))}
                </div>
              </div>
            ))}
            <p className="mt-8 text-sm text-bone/60">{aftercareNote}</p>
          </div>
        </div>

        <p data-reveal="lines" className="mt-28 text-center font-display text-[clamp(2rem,5vw,4.5rem)] italic leading-tight md:mt-40">
          {booking.tagline}
        </p>
      </div>
    </section>
  );
}
