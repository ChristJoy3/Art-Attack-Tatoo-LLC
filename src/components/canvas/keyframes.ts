/**
 * Scroll choreography for the persistent 3D scene.
 *
 * One keyframe per page section (same order as STAGES in lib/store.ts).
 * `sceneAt()` turns the continuous stage coordinate into concrete camera,
 * object and atmosphere parameters. It's pure and allocation-free so it can
 * run every frame.
 */

type Vec3 = [number, number, number];

type Keyframe = {
  cam: Vec3;
  look: Vec3;
  /** World point the atmosphere's light pool sits behind (projected each frame). */
  focus: Vec3;
  /** Strength of the soft light pool. */
  glow: number;
  /** Strength of the drifting haze. */
  haze: number;
  /** 0..1 visibility of the solid tattoo machine model. */
  machine: number;
  machinePos: Vec3;
  sparks: number;
  carousel: number;
  /** Electric-red warmth (ember in the haze, key light). */
  accent: number;
};

const KEYFRAMES: Keyframe[] = [
  // 0 · Hero — the machine lit by a soft pool of light in studio haze
  { cam: [0, 0, 9], look: [0, 0, 0], focus: [2.6, 0.1, 0], glow: 1, haze: 1, machine: 1, machinePos: [2.6, 0.1, 0], sparks: 1, carousel: 0, accent: 1 },
  // 1 · About — the camera drifts forward; the light softens and widens
  { cam: [1.4, -0.3, 4.4], look: [-1.2, 0, -2], focus: [1.5, 0.5, -2], glow: 0.45, haze: 0.8, machine: 0, machinePos: [4.5, -1.5, -3], sparks: 0, carousel: 0, accent: 0.6 },
  // 2 · Services — light sits behind the service photo on the right
  { cam: [0, 0, 8.5], look: [0, 0, 0], focus: [2.8, 0, 0], glow: 0.85, haze: 0.6, machine: 0, machinePos: [5, 0, -4], sparks: 0, carousel: 0, accent: 0.8 },
  // 3 · Highlights — dim and even, out of the way of the cards
  { cam: [0, 5, 11], look: [0, -0.5, 0], focus: [0, 0, 0], glow: 0.3, haze: 0.6, machine: 0, machinePos: [0, -5, -4], sparks: 0, carousel: 0, accent: 0.5 },
  // 4 · Artists — quiet backdrop behind the cards
  { cam: [-2.5, 0.4, 9], look: [0, 0, 0], focus: [-1, 0, 0], glow: 0.3, haze: 0.5, machine: 0, machinePos: [0, -5, -4], sparks: 0, carousel: 0, accent: 0.4 },
  // 5 · Work — a spotlight on the portfolio wheel
  { cam: [0, 0.8, 12], look: [0, 0.7, 0], focus: [0, 0, 0], glow: 0.75, haze: 0.5, machine: 0, machinePos: [0, -5, -4], sparks: 0, carousel: 1, accent: 0.4 },
  // 6 · Booking — the quietest page, for reading
  { cam: [0, -1, 12], look: [0, 0, 0], focus: [0, 0, 0], glow: 0.2, haze: 0.4, machine: 0, machinePos: [0, -5, -4], sparks: 0, carousel: 0, accent: 0.3 },
  // 7 · Contact — a warm halo around the logo medallion
  { cam: [0, 0, 8.5], look: [0, 0, 0], focus: [0, 0, 0], glow: 1.2, haze: 0.7, machine: 0, machinePos: [0, -5, -4], sparks: 0.4, carousel: 0, accent: 1 },
];

/** Number of services in the pinned sequence (matches content.services). */
const SERVICE_COUNT = 4;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Index of the active service for a pinned progress value (used by the DOM). */
export function serviceIndexAt(p: number) {
  return Math.min(SERVICE_COUNT - 1, Math.round(clamp01(p) * (SERVICE_COUNT - 1)));
}

export type SceneParams = Keyframe;

export function createSceneParams(): SceneParams {
  const k = KEYFRAMES[0];
  return { ...k, cam: [...k.cam], look: [...k.look], focus: [...k.focus], machinePos: [...k.machinePos] };
}

const NUM_KEYS = ["glow", "haze", "machine", "sparks", "carousel", "accent"] as const;
const VEC_KEYS = ["cam", "look", "focus", "machinePos"] as const;

/** Write the scene state for a given scroll position into `out`. `narrow` = portrait viewport. */
export function sceneAt(stage: number, narrow: boolean, out: SceneParams) {
  const last = KEYFRAMES.length - 1;
  const i = Math.min(last, Math.max(0, Math.floor(stage)));
  const j = Math.min(last, i + 1);
  const t = smoothstep(0, 1, stage - i);
  const A = KEYFRAMES[i];
  const B = KEYFRAMES[j];

  for (const key of NUM_KEYS) out[key] = A[key] + (B[key] - A[key]) * t;
  for (const key of VEC_KEYS) {
    for (let c = 0; c < 3; c++) out[key][c] = A[key][c] + (B[key][c] - A[key][c]) * t;
  }

  if (narrow) {
    // Portrait viewport (phones, tablets): centre everything, step the camera
    // back, and lift the hero machine (and its light) above the headline.
    out.cam[2] += 3.5;
    out.focus[0] = 0;
    if (i === 0) {
      out.machinePos[0] *= t;
      out.machinePos[1] += 1.4 * (1 - t);
      out.focus[1] += 1.4 * (1 - t);
    }
    // Services: the photo sits above the text on phones.
    if (i === 2 || j === 2) out.focus[1] += 1.6 * (i === 2 ? 1 - t : t);
  }
  return out;
}
