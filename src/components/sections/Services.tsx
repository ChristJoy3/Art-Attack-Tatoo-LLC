"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { scrollState } from "@/lib/store";
import { services } from "@/data/content";
import { serviceIndexAt } from "@/components/canvas/keyframes";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Pinned services sequence. Pin progress picks the active service: its copy
 * rises in and its photo wipes over the previous one, then slowly drifts.
 */
export function Services() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!pin.current) return;
      const panels = gsap.utils.toArray<HTMLElement>("[data-service-panel]");
      const tabs = gsap.utils.toArray<HTMLElement>("[data-service-tab]");
      const progressBar = pin.current.querySelector<HTMLElement>("[data-service-progress]");
      const count = pin.current.querySelector<HTMLElement>("[data-service-count]");
      const visual = pin.current.querySelector<HTMLElement>("[data-service-visual]");
      const images = gsap.utils.toArray<HTMLElement>("[data-service-image]");
      const credit = pin.current.querySelector<HTMLElement>("[data-service-credit]");
      let active = -1;
      let drift: gsap.core.Tween | undefined;

      gsap.set(panels, { autoAlpha: 0 });
      gsap.set(images, { autoAlpha: 0 });

      /**
       * Photo transition: the new image wipes in over the old one (upward when
       * scrolling down, downward when scrolling back) while settling from a
       * slight zoom; then it drifts slowly (Ken Burns) until the next change.
       */
      const showImage = (index: number, prev: number) => {
        const img = images[index];
        const inner = img.querySelector<HTMLElement>("[data-kb]");
        drift?.kill();
        if (credit) {
          gsap.to(credit, {
            autoAlpha: 0,
            y: reduced ? 0 : 8,
            duration: 0.25,
            onComplete: () => {
              credit.textContent = services[index].image.credit;
              gsap.to(credit, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" });
            },
          });
        }
        // Fixed layering: incoming on top, outgoing beneath, the rest hidden below.
        images.forEach((el, i) => gsap.set(el, { zIndex: i === index ? 3 : i === prev ? 2 : 1 }));
        gsap.set(img, { autoAlpha: 1 });
        if (reduced || prev < 0) {
          gsap.fromTo(img, { autoAlpha: 0 }, { autoAlpha: 1, duration: reduced ? 0.3 : 0.8, clipPath: "inset(0% 0% 0% 0%)" });
          if (inner) gsap.set(inner, { scale: 1.06 });
        } else {
          const from = index > prev ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)";
          gsap.fromTo(img, { clipPath: from }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut", overwrite: true });
          if (inner) gsap.fromTo(inner, { scale: 1.3, yPercent: index > prev ? 6 : -6 }, { scale: 1.06, yPercent: 0, duration: 1.6, ease: "expo.out" });
          // The outgoing photo sinks back slightly beneath the wipe.
          const prevInner = images[prev].querySelector<HTMLElement>("[data-kb]");
          if (prevInner) gsap.to(prevInner, { scale: 1.0, yPercent: index > prev ? -4 : 4, duration: 1.3, ease: "expo.inOut" });
        }
        if (!reduced && inner) {
          drift = gsap.to(inner, { scale: 1.14, xPercent: index % 2 ? -2 : 2, duration: 9, delay: 1.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
        }
      };

      const show = (index: number) => {
        if (index === active) return;
        const prev = active;
        active = index;
        if (count) count.textContent = services[index].index;
        showImage(index, prev);
        tabs.forEach((t, i) => t.setAttribute("aria-current", i === index ? "true" : "false"));
        if (prev >= 0) {
          gsap.to(panels[prev], { autoAlpha: 0, y: reduced ? 0 : index > prev ? -40 : 40, duration: reduced ? 0.2 : 0.6, ease: "power3.in", overwrite: true });
        }
        gsap.fromTo(
          panels[index],
          { autoAlpha: 0, y: reduced ? 0 : index > prev ? 60 : -60 },
          { autoAlpha: 1, y: 0, duration: reduced ? 0.2 : 1.1, delay: prev >= 0 && !reduced ? 0.25 : 0, ease: "expo.out", overwrite: true },
        );
      };
      show(0);

      // Subtle 3D tilt of the photo toward the pointer (desktop, motion OK).
      let cleanupTilt = () => {};
      if (visual && !reduced && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        const rx = gsap.quickTo(visual, "rotationX", { duration: 0.8, ease: "power3.out" });
        const ry = gsap.quickTo(visual, "rotationY", { duration: 0.8, ease: "power3.out" });
        const onMove = (e: PointerEvent) => {
          rx((0.5 - e.clientY / window.innerHeight) * 8);
          ry((e.clientX / window.innerWidth - 0.5) * 10);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        cleanupTilt = () => window.removeEventListener("pointermove", onMove);
      }

      ScrollTrigger.create({
        trigger: pin.current,
        pin: true,
        refreshPriority: 1,
        start: "top top",
        end: () => `+=${window.innerHeight * (services.length - 0.5)}`,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          scrollState.local.services = self.progress;
          if (progressBar) progressBar.style.transform = `scaleY(${self.progress})`;
          show(serviceIndexAt(self.progress));
        },
      });
      return () => {
        cleanupTilt();
        drift?.kill();
      };
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <section ref={root} id="services" data-stage="2" aria-labelledby="services-title" className="relative">
      <div ref={pin} className="relative flex h-svh flex-col justify-end px-4 pb-10 pt-24 md:justify-center md:px-10 md:pb-0">
        {/* Phones and tablets: stacked (photo, then copy). Desktop: list · copy · photo. */}
        <div className="mx-auto grid w-full max-w-[1600px] gap-8 md:gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="hidden lg:col-span-3 lg:block">
            <p className="label mb-10">02 — Services</p>
            <h2 id="services-title" className="sr-only">
              Services
            </h2>
            <ol className="space-y-4">
              {services.map((s) => (
                <li key={s.id} data-service-tab aria-current="false" className="group flex items-center gap-4 text-bone/40 transition-colors duration-500 aria-[current=true]:text-bone">
                  <span className="h-px w-6 bg-current transition-all duration-700 ease-expo group-aria-[current=true]:w-12 group-aria-[current=true]:bg-electric" />
                  <span className="text-sm uppercase tracking-[0.2em]">{s.title}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative md:mx-auto md:w-full md:max-w-xl lg:col-span-5 lg:mx-0 lg:max-w-none">
            <p className="label mb-4 lg:hidden">02 — Services</p>
            <div className="mb-6 flex items-baseline gap-3 font-display">
              <span data-service-count className="text-6xl text-electric md:text-7xl lg:text-8xl">
                01
              </span>
              <span className="text-2xl text-bone/40">/ {String(services.length).padStart(2, "0")}</span>
            </div>
            <div className="relative min-h-[16rem] md:min-h-[17rem] lg:min-h-[22rem]">
              {services.map((s) => (
                <article key={s.id} data-service-panel className="absolute inset-x-0 top-0">
                  <p className="label mb-4 !text-electric">{s.tagline}</p>
                  <h3 className="font-display text-[clamp(2.4rem,5vw,5rem)] leading-[0.95] tracking-[-0.02em]">{s.title}</h3>
                  <p className="mt-6 max-w-md text-base leading-relaxed text-bone/75 md:text-lg">{s.body}</p>
                </article>
              ))}
            </div>
          </div>

          {/* Service photo — swaps with an animated wipe for each service. */}
          <div className="order-first [perspective:1200px] lg:order-none lg:col-span-4 lg:col-start-9 lg:mr-10 lg:self-center">
            <div
              data-service-visual
              className="relative mx-auto aspect-[4/5] h-[32svh] overflow-hidden rounded-2xl border border-bone/15 bg-ink shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)] md:h-[42svh] lg:h-auto lg:max-h-[68svh] lg:w-full"
            >
              {services.map((s, i) => (
                <figure key={s.id} data-service-image className="absolute inset-0 m-0">
                  <div data-kb className="absolute inset-0 will-change-transform">
                    <Image
                      src={s.image.src}
                      alt={s.image.alt}
                      fill
                      priority={i === 0}
                      sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 60vw"
                      className="object-cover"
                      style={s.image.position ? { objectPosition: s.image.position } : undefined}
                    />
                  </div>
                </figure>
              ))}
              {/* Ink grading + engraved inner frame, to sit the photos in the palette. */}
              <div aria-hidden className="pointer-events-none absolute inset-0 z-[50] bg-gradient-to-t from-ink via-ink/10 to-ink/30" />
              <div aria-hidden className="pointer-events-none absolute inset-3 z-[50] rounded-xl ring-1 ring-bone/15" />
              <div className="absolute inset-x-0 bottom-0 z-[51] flex items-center gap-3 p-5 md:p-6">
                <span aria-hidden className="h-px w-6 bg-electric" />
                <p data-service-credit className="label !text-bone/80">
                  {services[0].image.credit}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Vertical progress rail */}
        <div className="absolute right-4 top-1/2 h-40 w-px -translate-y-1/2 bg-bone/15 md:right-10" aria-hidden>
          <div data-service-progress className="h-full w-full origin-top scale-y-0 bg-electric" />
        </div>
      </div>
    </section>
  );
}
