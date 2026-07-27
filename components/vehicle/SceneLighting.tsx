"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import {
  ATMOSPHERIC_FOG_COLOR,
  type LightingPreset,
} from "@/lib/vehicle/lighting";

// The hero camera sits in the +x/+y/+z octant (azimuth 22.5deg, elevation
// 30deg), so "behind the drone" is -x/-z and "in front of it" is +x/+z. Every
// light position below is expressed relative to that.

// Self-hosted copy of what drei's `preset="city"` resolves to. See the
// <Environment> comment below for why this isn't the `preset` prop.
const ENVIRONMENT_HDRI = "/hdri/potsdamer_platz_512.hdr";

/**
 * Seeded 32-bit PRNG (mulberry32). Deterministic on purpose: the mote layout
 * is scene dressing, and a fixed seed keeps it identical across re-renders and
 * between server and client.
 */
function makeRandom(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Slow-drifting dust motes for the `atmospheric` preset. */
function DustField({ count = 380, radius = 4.5 }: { count?: number; radius?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const positions = useMemo(() => {
    const random = makeRandom(0x5c17a1);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Rejection-free spherical sample, biased outward so motes read as
      // background haze rather than crowding the model.
      const r = radius * (0.35 + 0.65 * Math.cbrt(random()));
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.cos(phi) * 0.55;
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, [count, radius]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    group.rotation.y += delta * 0.012;
    group.position.y = Math.sin(performance.now() * 0.00012) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.012}
          sizeAttenuation
          color="#F5F5F7"
          transparent
          opacity={0.28}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function SceneLighting({ preset }: { preset: LightingPreset }) {
  const atmospheric = preset === "atmospheric";

  return (
    <>
      {/* Kept low on purpose. Ambient is a flat, angle-independent lift, so it
          is the fastest way to turn the black carbon and anodised parts grey;
          overall brightness comes from the directionals below instead, which
          fall off with angle and leave unlit faces actually black. */}
      <ambientLight intensity={atmospheric ? 0.16 : 0.12} />

      {/* KEY / RIM — high and behind the drone, opposite the camera. This is
          the only strong light in the scene; it wraps the body and prop edges
          in a cool white outline and leaves the camera-facing surfaces mostly
          in shadow, which is what sells the product-shot silhouette. */}
      <directionalLight
        position={[-3.4, 4.2, -1.6]}
        intensity={atmospheric ? 3.4 : 4.6}
        color="#E9F1FF"
      />

      {/* FILL — front-below, weak. Recovers the underside and the front faces
          just enough to keep detail legible. Kept far under the rim so it
          never flattens the edge separation. */}
      <directionalLight
        position={[2.6, -1.8, 1.4]}
        intensity={atmospheric ? 1.7 : 1.6}
        color="#DDE4F5"
      />

      {/* Second fill from front-above, softer still. The from-below fill alone
          leaves the top decks (battery lid, avionics housing) dark from this
          elevated camera; this recovers them without touching the rim edge. */}
      <directionalLight
        position={[2.2, 3.0, 1.8]}
        intensity={atmospheric ? 1.35 : 1.3}
        color="#EDF1FA"
      />

      {/* ACCENT — SkyXperts red grazing the far/under side. A brand note, not
          a light source: short range and low intensity so it tints one flank
          without competing with the rim/fill balance or reading as selection. */}
      <pointLight
        position={[-1.15, -0.45, 1.25]}
        intensity={2.4}
        distance={3.2}
        decay={2}
        color="#E31C1C"
      />

      {/* Image-based reflections, for the machined/anodised metal only. This is
          the main thing that greys out black surfaces — a rough black plate
          picks up the whole HDRI as a flat sheen — so it stays well under the
          directionals and buys specular character rather than brightness.
          Loaded from `files` rather than `preset`: drei's presets resolve to
          raw.githack.com, a third-party dev proxy, so `preset` would make the
          deployed site depend on an external host at runtime for a 1.5MB
          blocking fetch. Self-hosted, it ships with the static export, and is
          box-downsampled to 512x256 — at this intensity it contributes a
          broad specular sheen, not readable reflections, so the full 1k
          source (4x the bytes) bought nothing. Source kept in
          models/hdri-source/. */}
      <Environment
        files={ENVIRONMENT_HDRI}
        environmentIntensity={atmospheric ? 0.24 : 0.2}
      />

      {atmospheric && (
        <>
          <fogExp2 attach="fog" args={[ATMOSPHERIC_FOG_COLOR, 0.32]} />
          <DustField />
        </>
      )}
    </>
  );
}
