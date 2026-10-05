"use client";

import { useGSAP, gsap, ScrollTrigger } from "@/lib/gsap";
import { scrollState } from "@/lib/store";

/**
 * Converts page scroll into a continuous "stage" coordinate for the 3D scene.
 *
 * For each `[data-stage]` section we measure a HOLD interval (section covers
 * the viewport — stage = i) and a TRANSITION interval (next section sliding
 * in — stage goes i → i+1 over one viewport of scroll). Pinned sections
 * automatically get a long hold because their pin-spacer makes them taller.
 *
 * Rendered after all sections so their pins exist before we measure.
 */
export function StageTracker() {
  useGSAP(() => {
    const sections = gsap.utils.toArray<HTMLElement>("[data-stage]");
    // Non-pinning triggers give us refresh-aware start/end positions.
    const holds = sections.map((el) =>
      // Lowest priority: measured after every pin has added its spacing.
      ScrollTrigger.create({ trigger: el, start: "top top", end: "bottom bottom", refreshPriority: -1 }),
    );

    const compute = () => {
      const y = window.scrollY;
      let stage = 0;
      for (let i = 0; i < holds.length; i++) {
        const start = holds[i].start;
        const holdEnd = Math.max(start, holds[i].end);
        const next = holds[i + 1]?.start ?? ScrollTrigger.maxScroll(window);
        if (y < start) break;
        if (y <= holdEnd) {
          stage = i;
          break;
        }
        const span = Math.max(1, next - holdEnd);
        stage = i + Math.min(1, (y - holdEnd) / span);
      }
      // The last section never "transitions" further than its own index.
      scrollState.stage = Math.min(stage, holds.length - 1);
    };

    gsap.ticker.add(compute);
    ScrollTrigger.addEventListener("refresh", compute);
    compute();
    return () => {
      gsap.ticker.remove(compute);
      ScrollTrigger.removeEventListener("refresh", compute);
    };
  });

  return null;
}
