import { gsap, ScrollTrigger, SplitText } from "./gsap";

/**
 * Declarative scroll reveals. Inside a section's useGSAP scope, mark elements:
 *   data-reveal="lines"  → masked line-by-line rise (SplitText)
 *   data-reveal="fade"   → soft rise + fade
 *   data-delay="0.2"     → optional delay (seconds)
 * Everything is created inside the caller's gsap.context, so useGSAP reverts
 * splits, tweens and triggers on unmount.
 */
export function setupReveals(scope: HTMLElement, reduced: boolean) {
  const lineEls = scope.querySelectorAll<HTMLElement>('[data-reveal="lines"]');
  const fadeEls = scope.querySelectorAll<HTMLElement>('[data-reveal="fade"]');

  if (reduced) {
    [...lineEls, ...fadeEls].forEach((el) =>
      gsap.from(el, { autoAlpha: 0, duration: 0.6, ease: "power1.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } }),
    );
    return;
  }

  lineEls.forEach((el) => {
    const delay = Number(el.dataset.delay ?? 0);
    SplitText.create(el, {
      type: "lines",
      mask: "lines",
      linesClass: "split-line",
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 115,
          duration: 1.4,
          stagger: 0.09,
          delay,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        }),
    });
  });

  fadeEls.forEach((el) => {
    gsap.from(el, {
      y: 48,
      autoAlpha: 0,
      duration: 1.3,
      delay: Number(el.dataset.delay ?? 0),
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });
}

/** Parallax for elements with data-speed (e.g. 0.85 slower, 1.15 faster). */
export function setupParallax(scope: HTMLElement, reduced: boolean) {
  if (reduced) return;
  scope.querySelectorAll<HTMLElement>("[data-speed]").forEach((el) => {
    const speed = Number(el.dataset.speed);
    gsap.fromTo(
      el,
      { y: () => (1 - speed) * -window.innerHeight * 0.25 },
      {
        y: () => (1 - speed) * window.innerHeight * 0.25,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
      },
    );
  });
}

export { ScrollTrigger };
