"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { palette } from "@/lib/theme";
import { scrollState } from "@/lib/store";
import { getWorkItems } from "@/data/content";
import { useAppState } from "@/hooks/useAppState";
import { createSceneParams, sceneAt } from "./keyframes";
import { Atmosphere } from "./objects/Atmosphere";
import { WorkCarousel } from "./objects/WorkCarousel";
import { TattooMachine } from "./models/TattooMachine";

/** Ring radius grows with the number of cards so spacing stays even. */
function radiusFor(count: number, isMobile: boolean) {
  const spacing = isMobile ? 2.5 : 2.3; // world units of arc per card
  return Math.max(isMobile ? 3.2 : 4.4, (count * spacing) / (Math.PI * 2));
}

export type Quality = {
  isMobile: boolean;
  /** false when prefers-reduced-motion: freeze idle animation, snap camera. */
  animate: boolean;
};

/**
 * Everything inside the persistent canvas. A single rig computes the scene
 * state from scroll each frame (no React state) and every object reads it.
 */
export function Experience({ isMobile, animate }: Quality) {
  const params = useMemo(() => createSceneParams(), []);
  const look = useRef(new THREE.Vector3());
  const smoothStage = useRef(0);
  const camera = useThree((s) => s.camera);
  // Layout follows the viewport shape: portrait screens (phones and tablets)
  // get the centred, stacked composition.
  const narrow = useThree((s) => s.size.width / s.size.height < 1);
  const { workGallery } = useAppState();
  const items = useMemo(() => getWorkItems(workGallery, isMobile), [workGallery, isMobile]);

  const keyLight = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    // Light extra smoothing on top of Lenis for cinematic camera moves.
    const lambda = animate ? 5 : 100;
    smoothStage.current = THREE.MathUtils.damp(smoothStage.current, scrollState.stage, lambda, dt);
    sceneAt(smoothStage.current, narrow, params);

    // Camera with subtle pointer parallax (desktop only).
    const px = narrow || !animate ? 0 : state.pointer.x * 0.45;
    const py = narrow || !animate ? 0 : state.pointer.y * 0.3;
    const camLambda = animate ? 3.2 : 100;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, params.cam[0] + px, camLambda, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, params.cam[1] + py, camLambda, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, params.cam[2], camLambda, dt);
    look.current.x = THREE.MathUtils.damp(look.current.x, params.look[0], camLambda, dt);
    look.current.y = THREE.MathUtils.damp(look.current.y, params.look[1], camLambda, dt);
    look.current.z = THREE.MathUtils.damp(look.current.z, params.look[2], camLambda, dt);
    camera.lookAt(look.current);

    if (keyLight.current) keyLight.current.intensity = 18 * params.accent;
  });

  return (
    <>
      <color attach="background" args={[palette.ink]} />
      <fog attach="fog" args={[palette.ink, 9, 26]} />

      <ambientLight intensity={0.15} />
      <directionalLight position={[4, 6, 5]} intensity={1.2} color={palette.bone} />
      <pointLight ref={keyLight} position={[-3, -2, 2]} intensity={18} distance={12} color={palette.electric} />

      {/* Procedural studio reflections — no HDR download. Rendered once. */}
      <Environment resolution={isMobile ? 128 : 256} frames={1}>
        <Lightformer form="rect" intensity={2.2} color={palette.bone} position={[0, 4, -6]} scale={[10, 1.2, 1]} />
        <Lightformer form="rect" intensity={1.4} color={palette.bone} position={[-6, 1, 0]} rotation-y={Math.PI / 2} scale={[8, 0.6, 1]} />
        <Lightformer form="rect" intensity={1.4} color={palette.bone} position={[6, -1, 0]} rotation-y={-Math.PI / 2} scale={[8, 0.6, 1]} />
        <Lightformer form="ring" intensity={3} color={palette.electric} position={[0, -5, 3]} scale={3} />
      </Environment>

      <Atmosphere params={params} animate={animate} interactive={!isMobile && animate} />
      <TattooMachine params={params} animate={animate} />

      <Suspense fallback={null}>
        {/* Keyed by selection: a new gallery suspends while its textures load. */}
        <WorkCarousel key={workGallery} items={items} params={params} radius={radiusFor(items.length, isMobile)} />
      </Suspense>
    </>
  );
}
