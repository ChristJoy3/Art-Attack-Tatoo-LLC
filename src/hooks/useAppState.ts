"use client";

import { useSyncExternalStore } from "react";
import { appState } from "@/lib/store";

/** Subscribe a component to discrete app state (progress / ready / webgl). */
export function useAppState() {
  return useSyncExternalStore(appState.subscribe, appState.get, () => appState.serverSnapshot);
}
