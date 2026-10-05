"use client";

import Image from "next/image";
import { useLenis } from "lenis/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { nav, contact } from "@/data/content";
import { useAnchorScroll } from "@/hooks/useAnchorScroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MagneticButton } from "./MagneticButton";

/** Sticky minimal navbar: hides on scroll down, returns on scroll up. */
export function Navbar() {
  const bar = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const hidden = useRef(false);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();
  const reduced = useReducedMotion();
  const close = useCallback(() => setOpen(false), []);
  const onAnchor = useAnchorScroll(close);

  useLenis(({ scroll, direction }) => {
    const el = bar.current;
    if (!el) return;
    el.dataset.scrolled = scroll > 40 ? "true" : "false";
    const shouldHide = direction === 1 && scroll > 160 && !open;
    if (shouldHide !== hidden.current) {
      hidden.current = shouldHide;
      gsap.to(el, { yPercent: shouldHide ? -110 : 0, duration: reduced ? 0 : 0.7, ease: "expo.out", overwrite: true });
    }
  }, [open, reduced]);

  // Lock scroll + Escape to close while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis]);

  useGSAP(
    () => {
      if (!menu.current) return;
      if (open) {
        gsap.set(menu.current, { display: "flex" });
        gsap.fromTo(menu.current, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: reduced ? 0 : 0.9, ease: "expo.inOut" });
        gsap.from("[data-menu-item]", { yPercent: 120, duration: 1, stagger: 0.05, delay: 0.25, ease: "expo.out" });
      } else {
        gsap.to(menu.current, {
          clipPath: "inset(0 0 100% 0)",
          duration: reduced ? 0 : 0.6,
          ease: "expo.inOut",
          onComplete: () => gsap.set(menu.current, { display: "none" }),
        });
      }
    },
    { dependencies: [open], scope: menu },
  );

  return (
    <>
      <header
        ref={bar}
        data-scrolled="false"
        className="fixed inset-x-0 top-0 z-50 border-b border-transparent bg-ink transition-[border-color] duration-500 data-[scrolled=true]:border-bone/10"
      >
        <nav aria-label="Primary" className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 md:h-20 md:px-10">
          <a href="#top" onClick={onAnchor} className="block" aria-label="Art Attack Tattoo — back to top">
            {/* Logo sits on solid ink so its black field blends seamlessly. */}
            <Image src="/logo.png" alt="Art Attack Electric Tattooing" width={839} height={506} className="h-11 w-auto md:h-14" priority />
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {nav.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={onAnchor} className="group relative text-[0.8rem] uppercase tracking-[0.22em] text-bone/70 transition-colors hover:text-bone">
                  {l.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-full origin-right scale-x-0 bg-electric transition-transform duration-500 ease-expo group-hover:origin-left group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <MagneticButton href="#booking" className="!px-5 !py-2.5">
                Book a consult
              </MagneticButton>
            </div>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-bone/25 lg:hidden"
            >
              <span className={`absolute h-px w-5 bg-bone transition-transform duration-500 ease-expo ${open ? "rotate-45" : "-translate-y-1"}`} />
              <span className={`absolute h-px w-5 bg-bone transition-transform duration-500 ease-expo ${open ? "-rotate-45" : "translate-y-1"}`} />
            </button>
          </div>
        </nav>
      </header>

      <div
        ref={menu}
        id="mobile-menu"
        className="fixed inset-0 z-40 hidden flex-col justify-between bg-ink px-6 pb-10 pt-28 lg:hidden"
        style={{ clipPath: "inset(0 0 100% 0)" }}
        aria-hidden={!open}
      >
        <ul className="flex flex-col gap-2">
          {nav.map((l, i) => (
            <li key={l.href} className="overflow-hidden">
              <a data-menu-item href={l.href} onClick={onAnchor} tabIndex={open ? 0 : -1} className="flex items-baseline gap-4 font-display text-5xl leading-tight">
                <span className="label !text-electric">{String(i + 1).padStart(2, "0")}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="space-y-1 text-bone/70">
          <a href={contact.phoneHref} tabIndex={open ? 0 : -1} className="block text-lg text-bone">
            {contact.phoneDisplay}
          </a>
          <p className="label">Tues – Sat · 10am – 6pm</p>
        </div>
      </div>
    </>
  );
}
