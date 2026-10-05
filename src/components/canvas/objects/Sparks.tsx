"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { palette } from "@/lib/theme";
import type { SceneParams } from "../keyframes";

const ARCS = 4;
const SEGMENTS = 14;

export type SparkAnchor = readonly [THREE.Vector3Tuple, THREE.Vector3Tuple];

/**
 * Electric arcs — jagged red lines regenerated a few times per second.
 * Geometry is a fixed-size buffer rewritten in place (no allocations).
 */
export function Sparks({ params, anchors, animate }: { params: SceneParams; anchors: SparkAnchor[]; animate: boolean }) {
  const ref = useRef<THREE.LineSegments>(null);
  const timer = useRef(0);

  const { geometry, material } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(ARCS * SEGMENTS * 6), 3));
    const m = new THREE.LineBasicMaterial({
      color: new THREE.Color(palette.electric).multiplyScalar(2.2), // >1 so bloom catches it
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    return { geometry: g, material: m };
  }, []);

  const a = useMemo(() => new THREE.Vector3(), []);
  const b = useMemo(() => new THREE.Vector3(), []);
  const p = useMemo(() => new THREE.Vector3(), []);
  const prev = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const line = ref.current;
    if (!line) return;
    line.visible = params.sparks > 0.01 && animate;
    if (!line.visible) return;
    timer.current -= delta;
    material.opacity = params.sparks * (0.55 + Math.random() * 0.45);
    if (timer.current > 0) return;
    timer.current = 0.06 + Math.random() * 0.12;

    const attr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    let o = 0;
    for (let k = 0; k < ARCS; k++) {
      const [from, to] = anchors[Math.floor(Math.random() * anchors.length)];
      a.fromArray(from);
      b.fromArray(to);
      // Occasionally hide an arc for a flickering, intermittent feel.
      const live = Math.random() > 0.35;
      prev.copy(a);
      for (let s = 1; s <= SEGMENTS; s++) {
        const t = s / SEGMENTS;
        p.lerpVectors(a, b, t);
        const jitter = Math.sin(t * Math.PI) * 0.18;
        if (s < SEGMENTS) {
          p.x += (Math.random() - 0.5) * jitter;
          p.y += (Math.random() - 0.5) * jitter;
          p.z += (Math.random() - 0.5) * jitter;
        }
        if (live) {
          arr.set([prev.x, prev.y, prev.z, p.x, p.y, p.z], o);
        } else {
          arr.fill(0, o, o + 6);
        }
        o += 6;
        prev.copy(p);
      }
    }
    attr.needsUpdate = true;
  });

  return <lineSegments ref={ref} geometry={geometry} material={material} frustumCulled={false} />;
}
