"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useIsTouch } from "@/hooks/useIsMobile";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useAnchorScroll } from "@/hooks/useAnchorScroll";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "ghost";
  className?: string;
  external?: boolean;
};

/** Pill link that leans toward the pointer. Anchor links scroll via Lenis. */
export function MagneticButton({ href, children, variant = "solid", className = "", external }: Props) {
  const el = useRef<HTMLAnchorElement>(null);
  const inner = useRef<HTMLSpanElement>(null);
  const touch = useIsTouch();
  const reduced = useReducedMotion();
  const onAnchor = useAnchorScroll();

  useGSAP(
    (_, contextSafe) => {
      if (touch || reduced || !el.current || !contextSafe) return;
      const node = el.current;
      const xTo = gsap.quickTo(node, "x", { duration: 0.6, ease: "power3.out" });
      const yTo = gsap.quickTo(node, "y", { duration: 0.6, ease: "power3.out" });
      const ixTo = gsap.quickTo(inner.current, "x", { duration: 0.6, ease: "power3.out" });
      const iyTo = gsap.quickTo(inner.current, "y", { duration: 0.6, ease: "power3.out" });
      const move = contextSafe((e: PointerEvent) => {
        const r = node.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        xTo(dx * 0.3);
        yTo(dy * 0.4);
        ixTo(dx * 0.12);
        iyTo(dy * 0.16);
      });
      const leave = contextSafe(() => {
        xTo(0);
        yTo(0);
        ixTo(0);
        iyTo(0);
      });
      node.addEventListener("pointermove", move);
      node.addEventListener("pointerleave", leave);
      return () => {
        node.removeEventListener("pointermove", move);
        node.removeEventListener("pointerleave", leave);
      };
    },
    { dependencies: [touch, reduced], revertOnUpdate: true },
  );

  const styles =
    variant === "solid"
      ? "bg-electric text-bone hover:bg-bone hover:text-ink"
      : "border border-bone/30 text-bone hover:border-bone hover:bg-bone hover:text-ink";

  return (
    <a
      ref={el}
      href={href}
      onClick={href.startsWith("#") ? onAnchor : undefined}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      data-cursor="magnetic"
      className={`group relative inline-flex items-center justify-center gap-3 rounded-full px-7 py-4 text-sm font-medium tracking-wide transition-colors duration-500 ease-expo ${styles} ${className}`}
    >
      <span ref={inner} className="inline-flex items-center gap-3">
        {children}
      </span>
    </a>
  );
}
