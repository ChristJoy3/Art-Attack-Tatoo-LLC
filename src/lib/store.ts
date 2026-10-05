/**
 * Lightweight, non-React shared state.
 *
 * The 3D scene reads these values every frame inside useFrame, so they are
 * plain mutable objects (no React state → no re-renders). The few React
 * components that care about discrete changes (preloader, WebGL fallback)
 * subscribe through `appState`.
 */

/** Section order — must match the `data-stage` indices in page.tsx. */
export const STAGES = [
  "hero",
  "about",
  "services",
  "highlights",
  "artists",
  "work",
  "booking",
  "contact",
] as const;
export type StageName = (typeof STAGES)[number];

export const scrollState = {
  /** Continuous section coordinate: integer = section fully in view, fraction = transition to the next. */
  stage: 0,
  /** 0..1 over the whole page. */
  progress: 0,
  /** Lenis velocity (px/frame-ish), used for subtle motion intensity. */
  velocity: 0,
  /** Local progress of pinned sections (0..1), written by their ScrollTriggers. */
  local: { services: 0, artists: 0, work: 0 },
  /** Normalized pointer, -1..1, y up. */
  mouse: { x: 0, y: 0 },
};

type AppSnapshot = {
  /** 0..100 real asset loading progress (drei useProgress). */
  progress: number;
  /** Assets are loaded and the preloader has finished its exit. */
  ready: boolean;
  /** null = not yet known. */
  webgl: boolean | null;
  /** Portfolio shown in the Work section: "featured" or a gallery id. */
  workGallery: string;
};

const initial: AppSnapshot = { progress: 0, ready: false, webgl: null, workGallery: "featured" };
let snapshot: AppSnapshot = initial;
const listeners = new Set<() => void>();

export const appState = {
  get: () => snapshot,
  set(patch: Partial<AppSnapshot>) {
    const next = { ...snapshot, ...patch };
    const keys = Object.keys(next) as (keyof AppSnapshot)[];
    if (keys.every((k) => next[k] === snapshot[k])) return;
    snapshot = next;
    listeners.forEach((l) => l());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  serverSnapshot: initial,
};

/** Resolve once the experience is ready (preloader gone). */
export function whenReady(cb: () => void) {
  if (snapshot.ready) {
    cb();
    return () => {};
  }
  const unsub = appState.subscribe(() => {
    if (snapshot.ready) {
      unsub();
      cb();
    }
  });
  return () => {
    unsub();
  };
}
