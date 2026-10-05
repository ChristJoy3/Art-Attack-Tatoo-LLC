"use client";

import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { palette } from "@/lib/theme";
import { scrollState } from "@/lib/store";
import type { WorkItem } from "@/data/content";
import { cardFragment, cardVertex } from "../shaders/card";
import type { SceneParams } from "../keyframes";

const CARD_W = 1.8;
const CARD_H = 2.3;
/** Distance of the front card from the ring centre at the default radius. */
const FRONT_Z = 4.4;

/**
 * Scroll-driven 3D ring of portfolio pieces. Textures load through drei's
 * useTexture, so they're tracked by useProgress (the preloader).
 */
export function WorkCarousel({ items, params, radius }: { items: WorkItem[]; params: SceneParams; radius: number }) {
  const textures = useTexture(items.map((i) => i.src));
  const gl = useThree((s) => s.gl);
  const ring = useRef<THREE.Group>(null);
  const root = useRef<THREE.Group>(null);
  const smoothed = useRef(0);
  const count = items.length;
  const step = (Math.PI * 2) / count;

  const geometry = useMemo(() => new THREE.PlaneGeometry(CARD_W, CARD_H, 24, 1), []);

  const materials = useMemo(
    () =>
      textures.map((tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
        const img = tex.image as { width: number; height: number };
        const imgAspect = img.width / img.height;
        const planeAspect = CARD_W / CARD_H;
        const ratio =
          imgAspect > planeAspect ? new THREE.Vector2(planeAspect / imgAspect, 1) : new THREE.Vector2(1, imgAspect / planeAspect);
        return new THREE.ShaderMaterial({
          vertexShader: cardVertex,
          fragmentShader: cardFragment,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false,
          uniforms: {
            uMap: { value: tex },
            uImageRatio: { value: ratio },
            uFocus: { value: 0 },
            uOpacity: { value: 0 },
            uRadius: { value: radius },
            uBend: { value: 0.6 },
            uBone: { value: new THREE.Color(palette.bone) },
            uInk: { value: new THREE.Color(palette.ink) },
          },
        });
      }),
    [textures, gl, radius],
  );

  // Dispose GPU resources on unmount.
  useEffect(() => () => materials.forEach((m) => m.dispose()), [materials]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state, delta) => {
    const r = root.current;
    const g = ring.current;
    if (!r || !g) return;
    const v = params.carousel;
    r.visible = v > 0.01;
    if (!r.visible) return;
    smoothed.current = THREE.MathUtils.damp(smoothed.current, scrollState.local.work, 6, delta);
    const rot = -smoothed.current * step * (count - 1);
    g.rotation.y = rot;
    r.rotation.x = 0.06 + state.pointer.y * -0.05;
    r.rotation.z = state.pointer.x * 0.02;
    // Bigger rings sit further back so the front card keeps the same size.
    r.position.set(0, (1 - v) * -2, FRONT_Z - Math.max(radius, FRONT_Z));
    for (let i = 0; i < count; i++) {
      const facing = Math.cos(i * step + rot);
      const u = materials[i].uniforms;
      u.uFocus.value = THREE.MathUtils.smoothstep(facing, 0.82, 1);
      u.uOpacity.value = v * (0.25 + 0.75 * THREE.MathUtils.smoothstep(facing, -0.6, 0.9));
    }
  });

  return (
    <group ref={root}>
      <group ref={ring}>
        {materials.map((m, i) => {
          const a = i * step;
          return (
            <mesh
              key={items[i].src}
              geometry={geometry}
              material={m}
              position={[Math.sin(a) * radius, 0, Math.cos(a) * radius]}
              rotation={[0, a, 0]}
              renderOrder={1}
            />
          );
        })}
      </group>
    </group>
  );
}
