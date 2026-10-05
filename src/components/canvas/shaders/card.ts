/**
 * Portfolio card: image with cover-fit UVs, curved to the carousel cylinder,
 * desaturated (ink & bone) until it faces the camera, then full colour.
 */
export const cardVertex = /* glsl */ `
uniform float uRadius;
uniform float uBend;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec3 p = position;
  // Bend the plane around the cylinder so cards feel physical.
  float a = p.x / uRadius;
  p.z += (cos(a) - 1.0) * uRadius * uBend;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

export const cardFragment = /* glsl */ `
uniform sampler2D uMap;
uniform vec2 uImageRatio; // scale applied to UVs for object-fit: cover
uniform float uFocus;     // 0 = background card, 1 = front card
uniform float uOpacity;
uniform vec3 uBone;
uniform vec3 uInk;
varying vec2 vUv;

float roundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 uv = (vUv - 0.5) * uImageRatio + 0.5;
  vec3 tex = texture2D(uMap, uv).rgb;
  float lum = dot(tex, vec3(0.299, 0.587, 0.114));
  // Duotone ink→bone for unfocused cards.
  vec3 duo = mix(uInk, uBone, smoothstep(0.05, 0.95, lum));
  vec3 color = mix(duo * 0.75, tex, uFocus);
  float d = roundedBox(vUv - 0.5, vec2(0.5), 0.04);
  float alpha = smoothstep(0.003, -0.003, d) * uOpacity;
  // Thin bone border.
  float border = smoothstep(-0.012, -0.006, d) * (1.0 - uFocus * 0.6);
  color = mix(color, uBone, border * 0.5);
  gl_FragColor = vec4(color, alpha);
  #include <colorspace_fragment>
}
`;
