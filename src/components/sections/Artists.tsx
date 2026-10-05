"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { setupReveals } from "@/lib/animations";
import { scrollState } from "@/lib/store";
import { artists, galleryFor, type Artist } from "@/data/content";
import { useSelectGallery } from "@/hooks/useSelectGallery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("");
}

function ArtistCard({ artist, index }: { artist: Artist; index: number }) {
  const gallery = galleryFor(artist.name);
  const { select, preload } = useSelectGallery();
  return (
    <article className="group relative flex w-[82vw] shrink-0 snap-center flex-col overflow-hidden rounded-2xl border border-bone/10 bg-ink/85 backdrop-blur-md sm:w-[420px] md:w-[440px]">
      <div className="relative aspect-[4/3] overflow-hidden bg-bone/5 md:aspect-auto md:h-[30vh]">
        {artist.portrait ? (
          <Image
            src={artist.portrait}
            alt={`Portrait of ${artist.name}`}
            fill
            sizes="(min-width: 768px) 440px, 82vw"
            style={artist.portraitPosition ? { objectPosition: artist.portraitPosition } : undefined}
            className="object-cover grayscale transition duration-1000 ease-expo group-hover:scale-105 group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-full items-center justify-center" aria-hidden>
            <svg viewBox="0 0 200 200" className="absolute h-[140%] w-[140%] text-bone/15">
              {Array.from({ length: 48 }, (_, k) => {
                const a = (k / 48) * Math.PI * 2;
                return <line key={k} x1={100 + Math.cos(a) * 36} y1={100 + Math.sin(a) * 36} x2={100 + Math.cos(a) * 96} y2={100 + Math.sin(a) * 96} stroke="currentColor" strokeWidth="0.5" />;
              })}
            </svg>
            <span className="relative font-display text-7xl italic text-bone/80">{initials(artist.name)}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
        <span className="absolute left-5 top-5 font-display text-sm text-bone/60">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-8">
        <p className="label !text-electric">{artist.role}</p>
        <h3 className="mt-2 font-display text-3xl md:text-4xl">{artist.name}</h3>
        {artist.styles && (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Specialties">
            {artist.styles.map((s) => (
              <li key={s} className="rounded-full border border-bone/20 px-3 py-1 text-xs tracking-wide text-bone/75">
                {s}
              </li>
            ))}
          </ul>
        )}
        {artist.bio && <p className="mt-4 text-sm leading-relaxed text-bone/70">{artist.bio}</p>}
        {artist.note && <p className="mt-3 text-xs leading-relaxed text-bone/50">{artist.note}</p>}
        {artist.email && (
          <a href={`mailto:${artist.email}`} className="mt-2 break-all text-sm underline decoration-electric underline-offset-4 hover:text-electric">
            {artist.email}
          </a>
        )}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pt-6">
          <a
            href={`https://www.instagram.com/${artist.instagram}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-bone transition-colors hover:text-electric"
            aria-label={`${artist.name} on Instagram (@${artist.instagram})`}
          >
            <span className="h-px w-6 bg-electric transition-all duration-500 group-hover:w-10" />@{artist.instagram}
          </a>
          {gallery && (
            <button
              type="button"
              onClick={() => select(gallery.id)}
              onPointerEnter={() => preload(gallery.id)}
              onFocus={() => preload(gallery.id)}
              className="rounded-full border border-bone/25 px-4 py-2 text-xs uppercase tracking-[0.16em] transition-colors hover:border-electric hover:bg-electric"
            >
              See all {gallery.items.length} {gallery.kind === "piercing" ? "piercings" : "pieces"} →
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * Desktop: pinned horizontal scroll driven by vertical scroll.
 * Mobile / reduced motion: native horizontal swipe with snap points.
 */
export function Artists() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!root.current) return;
      setupReveals(root.current, reduced);
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const t = track.current;
        if (!t || !pin.current) return;
        const distance = () => Math.max(0, t.scrollWidth - window.innerWidth);
        gsap.to(t, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin.current,
            pin: true,
            refreshPriority: 1,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              scrollState.local.artists = self.progress;
            },
          },
        });
        // Cards tilt slightly with scroll velocity for a physical feel.
        const cards = t.querySelectorAll("article");
        const skew = gsap.quickTo(cards, "skewX", { duration: 0.6, ease: "power3.out" });
        const onTick = () => {
          skew(gsap.utils.clamp(-4, 4, -scrollState.velocity * 0.12));
        };
        gsap.ticker.add(onTick);
        return () => gsap.ticker.remove(onTick);
      });
      // Re-measure once portraits have loaded.
      root.current.querySelectorAll("img").forEach((img) => img.addEventListener("load", () => ScrollTrigger.refresh(), { once: true }));
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <section ref={root} id="artists" data-stage="4" aria-labelledby="artists-title" className="relative">
      <div ref={pin} className="flex min-h-svh flex-col justify-center gap-10 py-24 md:h-svh md:gap-8 md:pb-6 md:pt-24">
        <div className="mx-auto grid w-full max-w-[1600px] gap-6 px-4 md:grid-cols-12 md:px-10">
          <p data-reveal="fade" className="label md:col-span-3">
            04 — The Crew
          </p>
          <div className="md:col-span-9">
            <h2 id="artists-title" data-reveal="lines" className="font-display text-[clamp(2.4rem,4.6vw,4.8rem)] leading-[0.95] tracking-[-0.02em]">
              Talented hands. Real people.
            </h2>
            <p data-reveal="fade" className="mt-6 max-w-xl text-bone/70">
              To check pricing, book an appointment or see up-to-date portfolios, message each artist directly through their business Instagram.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto overscroll-x-contain [scrollbar-width:none] md:overflow-visible [&::-webkit-scrollbar]:hidden">
          <div ref={track} className="flex w-max snap-x snap-mandatory gap-5 px-4 will-change-transform md:snap-none md:gap-6 md:px-10">
            {artists.map((a, i) => (
              <ArtistCard key={a.name} artist={a} index={i} />
            ))}
            <div className="w-[1vw] shrink-0" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
