"use client";

import { AdaptiveDpr, PerformanceMonitor, useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useEffect, useState } from "react";
import { appState } from "@/lib/store";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Experience } from "./Experience";

/** Forwards drei's real loading progress to the (non-R3F) preloader. */
function LoadingBridge() {
  const { progress, active, total } = useProgress();
  useEffect(() => {
    if (total === 0 && !active) {
      // Nothing queued (yet). Give suspended loaders a moment to register
      // before declaring the purely procedural scene ready.
      const t = setTimeout(() => {
        const s = useProgress.getState();
        if (s.total === 0 && !s.active) appState.set({ progress: 100 });
      }, 800);
      return () => clearTimeout(t);
    }
    appState.set({ progress: active ? Math.min(99, Math.round(progress)) : 100 });
  }, [progress, active, total]);
  return null;
}

/** Pauses rendering entirely while the tab is hidden. */
function usePageVisible() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const onChange = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);
  return visible;
}

/** Client-only (loaded with ssr: false), so `document` is always available. */
export default function Scene() {
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const visible = usePageVisible();
  // Drops to false if the device can't hold the framerate.
  const [highQuality, setHighQuality] = useState(true);
  const effects = !isMobile && highQuality && !reduced;

  return (
    <Canvas
      // Track the pointer anywhere on the page even though the canvas sits behind the content.
      eventSource={document.body}
      eventPrefix="client"
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      frameloop={visible ? "always" : "never"}
      camera={{ position: [0, 0, 9], fov: 42, near: 0.1, far: 60 }}
      gl={{ antialias: !effects, powerPreference: "high-performance", alpha: false, stencil: false }}
      aria-hidden
    >
      <PerformanceMonitor onDecline={() => setHighQuality(false)} flipflops={3} onFallback={() => setHighQuality(false)}>
        <AdaptiveDpr pixelated={false} />
        <LoadingBridge />
        <Experience isMobile={isMobile} animate={!reduced} />
        {effects && (
          <EffectComposer multisampling={0}>
            <Bloom mipmapBlur intensity={0.7} luminanceThreshold={0.35} luminanceSmoothing={0.2} />
            <Vignette offset={0.25} darkness={0.75} />
          </EffectComposer>
        )}
      </PerformanceMonitor>
    </Canvas>
  );
}
