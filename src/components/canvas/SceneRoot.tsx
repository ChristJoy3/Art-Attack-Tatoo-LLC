"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { appState } from "@/lib/store";
import { useAppState } from "@/hooks/useAppState";

// three / R3F only load in the browser, in their own chunk.
const Scene = dynamic(() => import("./Scene"), { ssr: false });

function detectWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Fixed, full-viewport canvas layer behind the page content. */
export function SceneRoot() {
  const { webgl: supported } = useAppState();

  useEffect(() => {
    const ok = detectWebGL();
    appState.set({ webgl: ok });
    // Without WebGL there is nothing to load — let the preloader finish.
    if (!ok) appState.set({ progress: 100 });
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      {supported && <Scene />}
      {/* Soft scrim so long-form text stays readable over bright particles. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgb(2_2_2/0.55)_100%)]" />
    </div>
  );
}
