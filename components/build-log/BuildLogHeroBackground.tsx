"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "/models/skyxperts-strom-optimized.glb";
const DRACO_DECODER_PATH = "/draco/";
const MODEL_YAW = Math.PI;
const MODEL_SCALE = 3;
const INTRO_DURATION = 2.4;

useGLTF.preload(MODEL_URL, DRACO_DECODER_PATH);

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function CinematicCamera({ reducedMotion }: { reducedMotion: boolean }) {
  const basePosition = useMemo(() => new THREE.Vector3(0, 0.82, 2.35), []);
  const lookAtTarget = useMemo(() => new THREE.Vector3(0, 0.04, 0), []);
  const introProgress = useRef(0);

  useFrame(({ camera, clock }, delta) => {
    if (reducedMotion) {
      camera.position.copy(basePosition);
      camera.lookAt(lookAtTarget);
      return;
    }

    introProgress.current = Math.min(
      1,
      introProgress.current + delta / INTRO_DURATION,
    );
    const intro = easeOutCubic(introProgress.current);
    const t = clock.elapsedTime;

    camera.position.set(
      basePosition.x + Math.sin(t * 0.16) * 0.07 * intro,
      basePosition.y + Math.sin(t * 0.21 + 0.8) * 0.035 * intro,
      basePosition.z + Math.cos(t * 0.13) * 0.05 * intro,
    );

    lookAtTarget.set(
      0,
      0.04 + Math.sin(t * 0.27) * 0.012 * intro,
      0,
    );
    camera.lookAt(lookAtTarget);
  });

  return null;
}

function CinematicDrone({ reducedMotion }: { reducedMotion: boolean }) {
  const { scene } = useGLTF(MODEL_URL, DRACO_DECODER_PATH);
  const rigRef = useRef<THREE.Group>(null);
  const introProgress = useRef(0);
  const shadowRef = useRef<THREE.Group>(null);

  const { model, shadowScale, groundY } = useMemo(() => {
    const clone = scene.clone(true);
    clone.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(clone);
    const center = bounds.getCenter(new THREE.Vector3());
    clone.position.sub(center);

    const size = bounds.getSize(new THREE.Vector3());

    return {
      model: clone,
      shadowScale: Math.max(size.x, size.z) * MODEL_SCALE * 1.15,
      groundY: (-size.y * MODEL_SCALE) / 2 - 0.02,
    };
  }, [scene]);

  useFrame(({ clock }, delta) => {
    if (!rigRef.current) {
      return;
    }

    if (reducedMotion) {
      rigRef.current.rotation.set(0, MODEL_YAW, 0);
      rigRef.current.position.set(0, 0, 0);
      rigRef.current.scale.setScalar(MODEL_SCALE);
      return;
    }

    introProgress.current = Math.min(
      1,
      introProgress.current + delta / INTRO_DURATION,
    );
    const intro = easeOutCubic(introProgress.current);
    const t = clock.elapsedTime;

    rigRef.current.rotation.set(
      Math.sin(t * 0.42 + 0.4) * 0.035 * intro,
      MODEL_YAW + Math.sin(t * 0.28) * 0.22 * intro,
      Math.cos(t * 0.36 + 0.2) * 0.022 * intro,
    );

    rigRef.current.position.set(
      Math.sin(t * 0.19) * 0.012 * intro,
      (Math.sin(t * 0.52) * 0.028 + Math.sin(t * 1.15) * 0.009) * intro,
      Math.cos(t * 0.23) * 0.008 * intro,
    );

    const scale = MODEL_SCALE * (0.93 + 0.07 * intro);
    rigRef.current.scale.setScalar(scale);

    if (shadowRef.current) {
      shadowRef.current.position.y = groundY + rigRef.current.position.y * 0.35;
    }
  });

  return (
    <>
      <group ref={rigRef}>
        <primitive object={model} />
      </group>
      <group ref={shadowRef} position={[0, groundY, 0]}>
        <ContactShadows
          scale={shadowScale}
          resolution={1024}
          blur={4.5}
          opacity={0.24}
          far={shadowScale}
          color="#02040a"
        />
      </group>
    </>
  );
}

function HeroScene({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <>
      <color attach="background" args={["#070b16"]} />
      <ambientLight intensity={0.1} color="#e8ecf7" />
      <directionalLight
        position={[3.5, 4.5, 4]}
        intensity={0.1}
        color="#fff6ee"
      />
      <directionalLight
        position={[-4.5, 2.5, 3]}
        intensity={0.1}
        color="#e3e9ff"
      />
      <directionalLight
        position={[0.5, 3.5, -5]}
        intensity={0.1}
        color="#d8e2ff"
      />
      <hemisphereLight args={["#eef1fb", "#1a2038", 0.35]} />
      <Environment preset="studio" environmentIntensity={0.42} />
      <CinematicCamera reducedMotion={reducedMotion} />
      <Suspense fallback={null}>
        <CinematicDrone reducedMotion={reducedMotion} />
      </Suspense>
    </>
  );
}

export default function BuildLogHeroBackground() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <Canvas
        className="!h-full !w-full"
        camera={{ position: [0, 0.82, 2.35], fov: 32, near: 0.01, far: 100 }}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ camera, scene }) => {
          camera.lookAt(0, 0.04, 0);
          scene.background = null;
        }}
      >
        <HeroScene reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
