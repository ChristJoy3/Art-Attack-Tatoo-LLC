"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { palette } from "@/lib/theme";
import { atmosphereFragment, atmosphereVertex } from "../shaders/atmosphere";
import type { SceneParams } from "../keyframes";

type Props = { params: SceneParams; animate: boolean; interactive: boolean };

/**
 * Full-screen studio haze behind the scene: one triangle, one fragment
 * shader; per frame we only update a few uniforms.
 */
export function Atmosphere({ params, animate, interactive }: Props) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    // A single oversized triangle covering clip space.
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));
    return g;
  }, []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: atmosphereVertex,
        fragmentShader: atmosphereFragment,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2(1, 1) },
          uFocus: { value: new THREE.Vector2(0.5, 0.5) },
          uGlow: { value: 1 },
          uHaze: { value: 1 },
          uAccent: { value: 1 },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uMouseOn: { value: 0 },
          uBone: { value: new THREE.Color(palette.bone) },
          uElectric: { value: new THREE.Color(palette.electric) },
          uInk: { value: new THREE.Color(palette.ink) },
        },
      }),
    [],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  const focus = useMemo(() => new THREE.Vector3(), []);
  const mouse = useMemo(() => new THREE.Vector2(0.5, 0.5), []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const u = material.uniforms;
    if (animate) u.uTime.value += dt;
    state.gl.getDrawingBufferSize(u.uResolution.value);

    // Light pool follows the keyframe's world-space focus, projected to screen.
    focus.fromArray(params.focus).project(state.camera);
    u.uFocus.value.set(focus.x * 0.5 + 0.5, focus.y * 0.5 + 0.5);
    u.uGlow.value = params.glow;
    u.uHaze.value = params.haze;
    u.uAccent.value = params.accent;

    // Cursor light eases after the pointer (desktop only).
    if (interactive) {
      mouse.x = THREE.MathUtils.damp(mouse.x, state.pointer.x * 0.5 + 0.5, 4, dt);
      mouse.y = THREE.MathUtils.damp(mouse.y, state.pointer.y * 0.5 + 0.5, 4, dt);
      u.uMouse.value.copy(mouse);
      u.uMouseOn.value = THREE.MathUtils.damp(u.uMouseOn.value, 1, 2, dt);
    }
  });

  return <mesh geometry={geometry} material={material} frustumCulled={false} renderOrder={-10} />;
}
