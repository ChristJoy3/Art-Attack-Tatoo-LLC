"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { setupReveals } from "@/lib/animations";
import { contact, contactSection } from "@/data/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MagneticButton } from "@/components/ui/MagneticButton";

/**
 * Closing scene. The 3D particles resolve into the logo's sunburst, centred
 * on screen; the logo sits in the clear ring at its core.
 */
export function Contact() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!root.current) return;
      setupReveals(root.current, reduced);
      if (reduced) return;
      gsap.fromTo(
        "[data-contact-logo]",
        { scale: 0.7, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, ease: "power2.out", scrollTrigger: { trigger: "[data-contact-stage]", start: "top 80%", end: "top top", scrub: true } },
      );
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  const address = `${contact.street}, ${contact.city}, ${contact.region} ${contact.postalCode}`;

  return (
    <section ref={root} id="contact" data-stage="7" aria-labelledby="contact-title" className="relative">
      <div data-contact-stage className="relative flex h-svh flex-col items-center justify-between px-4 pb-10 pt-24 md:px-10 md:pt-28">
        <p data-reveal="fade" className="label self-start md:self-center">
          {contactSection.kicker}
        </p>
        {/* Ink medallion behind the logo: same black as the logo's own field,
            so the artwork stays untouched while particles stop at the edge. */}
        <div data-contact-logo className="relative flex aspect-square w-[min(38vh,78vw)] items-center justify-center rounded-full bg-ink shadow-[0_0_80px_30px_var(--ink)] ring-1 ring-bone/15 md:w-[min(50vh,46vw)]">
          <span aria-hidden className="absolute inset-3 rounded-full ring-1 ring-bone/10" />
          <Image src="/logo.png" alt="Art Attack Electric Tattooing" width={839} height={506} className="relative h-auto w-[84%]" />
        </div>
        <h2 id="contact-title" className="w-full text-center font-display text-[clamp(2.2rem,6vw,6rem)] leading-[0.95] tracking-[-0.02em]">
          {contactSection.title.map((l, i) => (
            <span key={l} data-reveal="lines" data-delay={i * 0.1} className={`block ${i === 1 ? "italic text-bone/85" : ""}`}>
              {l}
            </span>
          ))}
        </h2>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 pb-24 pt-10 md:px-10 md:pb-32">
        <p data-reveal="fade" className="mx-auto mb-14 max-w-xl text-center text-lg text-bone/70">
          {contactSection.body}
        </p>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-bone/10 bg-bone/10 md:grid-cols-2 lg:grid-cols-4">
          <address data-reveal="fade" className="flex flex-col gap-4 bg-ink/90 p-8 not-italic backdrop-blur-md">
            <span className="label">Visit</span>
            <span className="font-display text-2xl leading-snug">
              {contact.street}
              <br />
              {contact.city}, {contact.region} {contact.postalCode}
            </span>
            <a href={contact.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-auto text-sm underline decoration-electric underline-offset-4 hover:text-electric" aria-label={`Open ${address} in Google Maps`}>
              Open in Maps ↗
            </a>
          </address>

          <div data-reveal="fade" data-delay="0.06" className="flex flex-col gap-4 bg-ink/90 p-8 backdrop-blur-md">
            <span className="label">Call or email</span>
            <a href={contact.phoneHref} className="font-display text-2xl transition-colors hover:text-electric">
              {contact.phoneDisplay}
            </a>
            <span className="-mt-3 text-sm text-bone/50">{contact.phoneDigits}</span>
            <a href={`mailto:${contact.email}`} className="mt-auto break-all text-sm underline decoration-electric underline-offset-4 hover:text-electric">
              {contact.email}
            </a>
          </div>

          <div data-reveal="fade" data-delay="0.12" className="flex flex-col gap-4 bg-ink/90 p-8 backdrop-blur-md">
            <span className="label">Hours</span>
            <dl className="space-y-3">
              {contact.hours.map((h) => (
                <div key={h.days}>
                  <dt className="text-sm text-bone/60">{h.days}</dt>
                  <dd className="font-display text-2xl">{h.time}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-auto text-sm text-bone/50">Walk-ins when time allows. Call to check.</p>
          </div>

          <div data-reveal="fade" data-delay="0.18" className="flex flex-col gap-4 bg-ink/90 p-8 backdrop-blur-md">
            <span className="label">Follow</span>
            <ul className="space-y-3">
              {contact.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="group flex items-baseline justify-between gap-4">
                    <span className="font-display text-2xl transition-colors group-hover:text-electric">{s.label}</span>
                    <span className="text-xs text-bone/50">{s.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap justify-center gap-3">
          <MagneticButton href={contact.mapUrl} external>
            Get directions <span aria-hidden>↗</span>
          </MagneticButton>
          <MagneticButton href={contact.phoneHref} variant="ghost">
            Call the shop
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
