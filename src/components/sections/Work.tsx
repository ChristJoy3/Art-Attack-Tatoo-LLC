"use client";

import Image from "next/image";
import { useRef } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { setupReveals } from "@/lib/animations";
import { scrollState } from "@/lib/store";
import { FEATURED, galleries, getWorkItems } from "@/data/content";
import { useAppState } from "@/hooks/useAppState";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSelectGallery } from "@/hooks/useSelectGallery";

const TABS = [
  { id: FEATURED, label: "Featured" },
  ...galleries.map((g) => ({
    id: g.id,
    label: g.kind === "piercing" ? `${g.artist.split(" ")[0]} · Piercing` : g.artist.split(" ")[0],
  })),
];

/** Artist filter, shared by the 3D and grid layouts. */
function GalleryTabs({ active }: { active: string }) {
  const { select, preload } = useSelectGallery();
  return (
    <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
      <div role="tablist" aria-label="Choose an artist's portfolio" className="flex w-max gap-2 lg:w-auto lg:flex-wrap lg:justify-end">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active === t.id}
            aria-controls="work-gallery"
            onClick={() => select(t.id)}
            onPointerEnter={() => preload(t.id)}
            onFocus={() => preload(t.id)}
            className="whitespace-nowrap rounded-full border border-bone/20 px-4 py-2 text-xs uppercase tracking-[0.18em] text-bone/70 transition-colors duration-300 hover:border-bone hover:text-bone aria-selected:border-electric aria-selected:bg-electric aria-selected:text-bone"
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Portfolio. With WebGL: a pinned section whose scroll rotates the 3D card
 * ring in the canvas (WorkCarousel). The DOM shows the tabs and caption.
 * Without WebGL (or with reduced motion) it falls back to an image grid.
 */
export function Work() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const { webgl, workGallery } = useAppState();
  const items = getWorkItems(workGallery, isMobile);
  // Assume WebGL until proven otherwise so the pin exists from first render.
  const use3D = webgl !== false && !reduced;

  useGSAP(
    () => {
      if (!root.current) return;
      setupReveals(root.current, reduced);
      if (!use3D || !pin.current) return;
      const caption = pin.current.querySelector<HTMLElement>("[data-work-artist]");
      const alt = pin.current.querySelector<HTMLElement>("[data-work-alt]");
      const count = pin.current.querySelector<HTMLElement>("[data-work-count]");
      const bar = pin.current.querySelector<HTMLElement>("[data-work-progress]");
      let current = -1;

      ScrollTrigger.create({
        trigger: pin.current,
        pin: true,
        refreshPriority: 1,
        start: "top top",
        // ~0.3 viewport of scroll per piece, so every card gets its moment.
        end: () => `+=${window.innerHeight * Math.max(2.5, items.length * 0.3)}`,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          scrollState.local.work = self.progress;
          if (bar) bar.style.transform = `scaleX(${self.progress})`;
          const i = Math.round(self.progress * (items.length - 1));
          if (i !== current) {
            current = i;
            if (caption) caption.textContent = items[i].artist;
            if (alt) alt.textContent = items[i].alt;
            if (count) count.textContent = String(i + 1).padStart(2, "0");
          }
        },
      });
      // This pin can be (re)created after mount (WebGL detection, resize,
      // gallery change): re-sort so pins refresh first, then re-measure.
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    },
    { scope: root, dependencies: [use3D, isMobile, reduced, workGallery], revertOnUpdate: true },
  );

  const total = String(items.length).padStart(2, "0");

  return (
    <section ref={root} id="work" data-stage="5" aria-labelledby="work-title" className="relative">
      {use3D ? (
        <div ref={pin} className="relative flex h-svh flex-col justify-between px-4 pb-8 pt-20 md:px-10 md:pb-10 md:pt-24">
          {/* Title and tabs share one row on large screens so the header stays
              compact and clear of the 3D wheel, even on short viewports. */}
          <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <div className="shrink-0">
              <p className="label mb-3">05 — The Work</p>
              <h2 id="work-title" className="font-display text-[clamp(2.2rem,min(6vw,9svh),6rem)] leading-[0.95] tracking-[-0.02em]">
                Fresh <span className="italic">ink.</span>
              </h2>
            </div>
            <div className="lg:pb-2">
              <p className="mb-3 hidden text-sm text-bone/60 lg:block lg:text-right">Pick an artist to see their full portfolio. Scroll to turn the wheel.</p>
              <GalleryTabs active={workGallery} />
            </div>
          </div>

          <div className="mx-auto grid w-full max-w-[1600px] gap-4 md:grid-cols-12 md:items-end">
            <div className="md:col-span-6" aria-live="polite">
              <p className="label">
                <span data-work-count className="text-electric">
                  01
                </span>{" "}
                / {total}
              </p>
              <p data-work-artist className="mt-2 font-display text-3xl md:text-5xl">
                {items[0].artist}
              </p>
              <p data-work-alt className="mt-1 text-sm text-bone/60">
                {items[0].alt}
              </p>
            </div>
            <div className="h-px w-full overflow-hidden bg-bone/15 md:col-span-4 md:col-start-9 md:mb-3">
              <div data-work-progress className="h-full w-full origin-left scale-x-0 bg-electric" />
            </div>
          </div>

          {/* Accessible list of the pieces shown in the 3D carousel. */}
          <ul id="work-gallery" className="sr-only">
            {items.map((w) => (
              <li key={w.src}>
                {w.alt}, by {w.artist}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mx-auto max-w-[1600px] px-4 py-28 md:px-10 md:py-40">
          <p data-reveal="fade" className="label mb-4">
            05 — The Work
          </p>
          <h2 id="work-title" data-reveal="lines" className="mb-10 font-display text-[clamp(2.4rem,6vw,6rem)] leading-[0.95]">
            Fresh <span className="italic">ink.</span>
          </h2>
          <div className="mb-10">
            <GalleryTabs active={workGallery} />
          </div>
          <ul id="work-gallery" className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5 lg:grid-cols-5">
            {items.map((w) => (
              <li key={w.src} className="group relative aspect-[4/5] overflow-hidden rounded-xl">
                <Image src={w.src} alt={w.alt} fill sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, 50vw" className="object-cover transition duration-700 group-hover:scale-105" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink to-transparent p-3 text-xs">{w.artist}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
