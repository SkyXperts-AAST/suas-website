"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import DroneAssemblyModel from "@/components/DroneAssemblyModel";
import SceneLighting from "@/components/vehicle/SceneLighting";
import type { AssemblyScrollApi } from "@/lib/vehicle/assemblyOrder";

/**
 * The R3F half of the build chapter, split into its own module so
 * DroneAssemblyScroll can `next/dynamic` it behind a viewport check. Nothing
 * here — three, drei, the Draco decoder, the GLB — reaches a phone.
 */
export default function DroneAssemblyCanvas({
  scrollApi,
  reducedMotion,
}: {
  scrollApi: AssemblyScrollApi;
  reducedMotion: boolean;
}) {
  return (
    <Canvas
      className="h-full w-full"
      style={{ touchAction: "pan-y" }}
      frameloop="always"
      camera={{ fov: 45, near: 0.01, far: 100 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 1.75]}
    >
      {/* Suspended separately from the model: <Environment> loads an HDRI,
          and without its own boundary that fetch suspends this whole
          subtree — nothing in the canvas commits until the environment map
          arrives (invisible once cached, but a blank canvas on a cold load).
          Split, the two load in parallel. Same fix as VehicleCanvas. */}
      <Suspense fallback={null}>
        <SceneLighting preset="studio" />
      </Suspense>
      <Suspense
        fallback={
          <mesh>
            <boxGeometry args={[0.01, 0.01, 0.01]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
        }
      >
        <DroneAssemblyModel
          scrollApi={scrollApi}
          reducedMotion={reducedMotion}
        />
        <ContactShadows
          position={[0, -0.12, 0]}
          opacity={0.45}
          scale={2.5}
          blur={2.2}
          far={1.2}
        />
      </Suspense>
    </Canvas>
  );
}
