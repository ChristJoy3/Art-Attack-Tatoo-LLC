/**
 * Studio atmosphere — a soft, low-contrast backdrop: faint drifting haze,
 * a gentle pool of warm light behind each section's focus point, a whisper
 * of electric red, and a dim light that follows the cursor. No hard edges,
 * so it stays easy on the eyes behind long-form text. Dithered to avoid
 * banding in the dark gradients.
 */
export const atmosphereVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  // Full-screen triangle in clip space, always behind everything.
  gl_Position = vec4(position.xy, 0.9999, 1.0);
}
`;

export const atmosphereFragment = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uFocus;      // uv of the light pool
uniform float uGlow;      // light pool strength
uniform float uHaze;      // haze strength
uniform float uAccent;    // red ember strength
uniform vec2 uMouse;      // uv
uniform float uMouseOn;   // 0..1
uniform vec3 uBone;
uniform vec3 uElectric;
uniform vec3 uInk;

varying vec2 vUv;

// --- 2D simplex noise (Ashima / Gustavson, MIT) ---------------------------
vec3 permute3(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute3(permute3(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// 3 octaves are plenty for soft, low-frequency haze (keeps retina tablets light).
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * snoise(p);
    p = p * 2.03 + vec2(11.7, 5.3);
    a *= 0.5;
  }
  return v;
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
  vec2 focus = (uFocus - 0.5) * vec2(aspect, 1.0);
  vec2 mouse = (uMouse - 0.5) * vec2(aspect, 1.0);
  float t = uTime * 0.025;

  // Slow, layered smoke drifting upward, domain-warped for softness
  // (single-octave warp: 5 noise samples per pixel in total).
  vec2 w = vec2(snoise(p * 0.9 + vec2(0.0, -t)), snoise(p * 0.9 + vec2(5.2, -t * 1.3))) * 0.6;
  float smoke = fbm(p * 1.3 + w * 0.8 + vec2(t * 0.4, -t * 1.6));
  smoke = smoothstep(-0.1, 0.75, smoke);

  // Soft pool of light behind the focus point, breathing very slowly.
  vec2 rel = p - focus;
  float pool = exp(-dot(rel, rel) * 2.6) * (0.9 + 0.1 * sin(uTime * 0.4));
  // Haze is lit mostly near the light, like smoke in a spotlight.
  float lit = smoke * (0.35 + 0.65 * pool);

  // A whisper of electric red, offset low beside the light.
  vec2 er = rel - vec2(-0.18, -0.22);
  float ember = exp(-dot(er, er) * 5.0) * (0.6 + 0.4 * smoke);

  // Dim cursor light.
  vec2 dm = p - mouse;
  float cursor = exp(-dot(dm, dm) * 9.0) * uMouseOn;

  // Values are linear light: tiny amounts read as soft greys on screen.
  vec3 color = uInk;
  color += uBone * (pool * 0.012 * uGlow + lit * 0.007 * uHaze + cursor * 0.006);
  color += uElectric * ember * 0.012 * uAccent * uGlow;

  float vig = smoothstep(1.25, 0.3, length(p * vec2(0.85, 1.0)));
  color *= 0.75 + 0.25 * vig;

  gl_FragColor = vec4(color, 1.0);
  #include <colorspace_fragment>
  // Dither in display space (after conversion) to prevent banding.
  gl_FragColor.rgb += (hash(vUv * uResolution + fract(uTime)) - 0.5) / 255.0;
}
`;
