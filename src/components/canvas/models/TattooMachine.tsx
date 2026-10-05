"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { palette } from "@/lib/theme";
import { Sparks, type SparkAnchor } from "../objects/Sparks";
import type { SceneParams } from "../keyframes";

/**
 * ─── Swapping in a real model ────────────────────────────────────────────
 * Drop a file at /public/models/machine.glb and set MODEL_URL below.
 * The GLB is rendered in place of the procedural machine with the same
 * scroll choreography. Remember to also call `useGLTF.preload(MODEL_URL)`
 * so the preloader accounts for it.
 */
const MODEL_URL: string | null = null;

/** Local coordinates match the particle "machine" silhouette (inkShapes.ts). */
const OFFSET: THREE.Vector3Tuple = [0.15, 0.45, 0];

const SPARK_ANCHORS: SparkAnchor[] = [
  [[0.2, 2.4, 0], [0.2, 1.58, 0.05]],
  [[-0.42, 1.38, 0.3], [0.42, 1.38, 0.3]],
  [[-1.3, -3.2, 0], [-0.55, -3.7, 0.35]],
  [[-1.3, -3.2, 0], [-2.0, -3.45, -0.25]],
];

function useMaterials() {
  return useMemo(() => {
    const chrome = new THREE.MeshStandardMaterial({ color: palette.bone, metalness: 1, roughness: 0.22 });
    const dark = new THREE.MeshStandardMaterial({ color: palette.ink, metalness: 0.9, roughness: 0.35 });
    const wire = new THREE.MeshStandardMaterial({
      color: palette.electric,
      metalness: 0.75,
      roughness: 0.3,
      emissive: new THREE.Color(palette.electric),
      emissiveIntensity: 0.25,
    });
    return { chrome, dark, wire };
  }, []);
}

/** Coil helix wire as a tube. */
function useCoilGeometry() {
  return useMemo(() => {
    const turns = 22;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= turns * 24; i++) {
      const t = i / (turns * 24);
      const a = t * turns * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * 0.35, 0.05 + t * 1.3, Math.sin(a) * 0.35));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), turns * 24, 0.022, 6, false);
  }, []);
}

/** Frame as rounded segments between the silhouette points. */
const FRAME: THREE.Vector2Tuple[] = [
  [-1.0, -0.15], [0.95, -0.15], [1.15, 0.2], [1.15, 1.55], [0.85, 2.05], [0.25, 2.25], [0.15, 1.75],
];

function Frame({ material }: { material: THREE.Material }) {
  const segments = useMemo(
    () =>
      FRAME.slice(0, -1).map(([ax, ay], i) => {
        const [bx, by] = FRAME[i + 1];
        const len = Math.hypot(bx - ax, by - ay);
        return { pos: [(ax + bx) / 2, (ay + by) / 2, 0] as THREE.Vector3Tuple, rot: Math.atan2(by - ay, bx - ax), len };
      }),
    [],
  );
  return (
    <group>
      {segments.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={[0, 0, s.rot]} material={material}>
          <boxGeometry args={[s.len + 0.12, 0.16, 0.24]} />
        </mesh>
      ))}
    </group>
  );
}

function ProceduralMachine() {
  const m = useMaterials();
  const coil = useCoilGeometry();
  return (
    <group position={OFFSET}>
      <Frame material={m.chrome} />
      {[-0.42, 0.42].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.7, 0]} material={m.dark}>
            <cylinderGeometry args={[0.3, 0.3, 1.3, 32]} />
          </mesh>
          <mesh geometry={coil} material={m.wire} />
          <mesh position={[0, 0.05, 0]} material={m.chrome}>
            <cylinderGeometry args={[0.41, 0.41, 0.07, 32]} />
          </mesh>
          <mesh position={[0, 1.36, 0]} material={m.chrome}>
            <cylinderGeometry args={[0.41, 0.41, 0.07, 32]} />
          </mesh>
        </group>
      ))}
      {/* Armature bar */}
      <mesh position={[-0.25, 1.5, 0]} material={m.chrome}>
        <boxGeometry args={[2.1, 0.12, 0.3]} />
      </mesh>
      {/* Contact screw */}
      <mesh position={[0.2, 2.0, 0]} material={m.chrome}>
        <cylinderGeometry args={[0.05, 0.05, 0.85, 16]} />
      </mesh>
      {/* Needle bar */}
      <mesh position={[-1.3, -0.85, 0]} material={m.chrome}>
        <cylinderGeometry args={[0.025, 0.025, 4.7, 8]} />
      </mesh>
      {/* Grip with knurl rings */}
      <mesh position={[-1.3, -1.9, 0]} material={m.dark}>
        <cylinderGeometry args={[0.27, 0.27, 1.6, 32]} />
      </mesh>
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={i} position={[-1.3, -1.25 - i * 0.2, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.chrome}>
          <torusGeometry args={[0.28, 0.018, 8, 40]} />
        </mesh>
      ))}
      {/* Tip */}
      <mesh position={[-1.3, -2.85, 0]} material={m.chrome}>
        <cylinderGeometry args={[0.27, 0.07, 0.5, 32]} />
      </mesh>
    </group>
  );
}

function GltfMachine({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

type Props = { params: SceneParams; animate: boolean };

/** Hero centrepiece. Visibility, position and tilt are driven by scroll + pointer. */
export function TattooMachine({ params, animate }: Props) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const time = useRef(0);

  useFrame((state, delta) => {
    const g = outer.current;
    const i = inner.current;
    if (!g || !i) return;
    if (animate) time.current += delta;
    const v = params.machine;
    g.visible = v > 0.01;
    if (!g.visible) return;
    const ease = 1 - Math.pow(1 - v, 3);
    g.position.set(params.machinePos[0], params.machinePos[1] + Math.sin(time.current * 0.8) * 0.12, params.machinePos[2]);
    g.scale.setScalar(0.55 * (0.6 + ease * 0.4));
    // Slow showcase rotation plus pointer tilt.
    const { x, y } = state.pointer;
    i.rotation.y = THREE.MathUtils.damp(i.rotation.y, -0.5 + Math.sin(time.current * 0.25) * 0.35 + x * 0.35, 3, delta);
    i.rotation.x = THREE.MathUtils.damp(i.rotation.x, 0.08 - y * 0.2, 3, delta);
    i.rotation.z = -0.32;
  });

  return (
    <group ref={outer}>
      <group ref={inner}>
        {MODEL_URL ? <GltfMachine url={MODEL_URL} /> : <ProceduralMachine />}
        <group position={OFFSET}>
          <Sparks params={params} anchors={SPARK_ANCHORS} animate={animate} />
        </group>
      </group>
    </group>
  );
}
