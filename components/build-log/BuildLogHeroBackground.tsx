"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { usePathname } from "next/navigation";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import {
  computeDroneAimQuaternion,
  raycastScreenToTeamAimPlane,
} from "@/lib/build-log/drone-yaw";
import { getHeroSceneTheme } from "@/lib/build-log/themes";
import { isSubTeamSlug } from "@/lib/build-log/teams";
import type { SubTeamSlug } from "@/lib/build-log/types";
import { setupPropellerSpinners } from "@/lib/vehicle/findPropellerPivots";

const MODEL_URL = "/models/storm-final-optimized-v2.glb";
const DRACO_DECODER_PATH = "/draco/";
/** Baked into the cloned model — same 180° correction as DroneModel. */
const MODEL_YAW = Math.PI;
const MODEL_SCALE = 3;
const INTRO_DURATION = 2.4;
const PROPELLER_SPEED = 22;
const TEAM_AIM_SMOOTH = 1.8;
const TEAM_SWAY_Y = 0.06;

useGLTF.preload(MODEL_URL, DRACO_DECODER_PATH);

function getActiveTeamSlug(pathname: string): SubTeamSlug {
  const slug = pathname.split("/").pop() ?? "";
  return isSubTeamSlug(slug) ? slug : "computer-vision";
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function TeamHeroOverlays() {
  const theme = getHeroSceneTheme("computer-vision");

  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[#0a1628]/55" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: theme.radialGlow }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#05071e]/95 via-[#0a1628]/72 to-[#05071e]/95" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/45 to-transparent" />
    </>
  );
}

function TeamLighting({
  teamSlug,
  reducedMotion,
}: {
  teamSlug: SubTeamSlug;
  reducedMotion: boolean;
}) {
  const target = useMemo(() => {
    const theme = getHeroSceneTheme(teamSlug);
    return {
      ambient: new THREE.Color(theme.ambientLight),
      key: new THREE.Color(theme.keyLight),
      fill: new THREE.Color(theme.fillLight),
      rim: new THREE.Color(theme.rimLight),
      hemiTop: new THREE.Color(theme.hemisphereTop),
      hemiBottom: new THREE.Color(theme.hemisphereBottom),
    };
  }, [teamSlug]);

  const current = useRef({
    ambient: new THREE.Color(getHeroSceneTheme("computer-vision").ambientLight),
    key: new THREE.Color(getHeroSceneTheme("computer-vision").keyLight),
    fill: new THREE.Color(getHeroSceneTheme("computer-vision").fillLight),
    rim: new THREE.Color(getHeroSceneTheme("computer-vision").rimLight),
    hemiTop: new THREE.Color(getHeroSceneTheme("computer-vision").hemisphereTop),
    hemiBottom: new THREE.Color(getHeroSceneTheme("computer-vision").hemisphereBottom),
  });

  const ambientRef = useRef<THREE.AmbientLight>(null);
  const keyRef = useRef<THREE.DirectionalLight>(null);
  const fillRef = useRef<THREE.DirectionalLight>(null);
  const rimRef = useRef<THREE.DirectionalLight>(null);
  const hemiRef = useRef<THREE.HemisphereLight>(null);

  useFrame((_, delta) => {
    const t = reducedMotion ? 1 : 1 - Math.exp(-delta / TEAM_AIM_SMOOTH);

    current.current.ambient.lerp(target.ambient, t);
    current.current.key.lerp(target.key, t);
    current.current.fill.lerp(target.fill, t);
    current.current.rim.lerp(target.rim, t);
    current.current.hemiTop.lerp(target.hemiTop, t);
    current.current.hemiBottom.lerp(target.hemiBottom, t);

    ambientRef.current?.color.copy(current.current.ambient);
    keyRef.current?.color.copy(current.current.key);
    fillRef.current?.color.copy(current.current.fill);
    rimRef.current?.color.copy(current.current.rim);

    if (hemiRef.current) {
      hemiRef.current.color.copy(current.current.hemiTop);
      hemiRef.current.groundColor.copy(current.current.hemiBottom);
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.1} />
      <directionalLight ref={keyRef} position={[3.5, 4.5, 4]} intensity={0.1} />
      <directionalLight ref={fillRef} position={[-4.5, 2.5, 3]} intensity={0.1} />
      <directionalLight ref={rimRef} position={[0.5, 3.5, -5]} intensity={0.1} />
      <hemisphereLight ref={hemiRef} intensity={0.35} />
    </>
  );
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

function CinematicDrone({
  pointerRef,
  reducedMotion,
}: {
  pointerRef: RefObject<{ x: number; y: number } | null>;
  reducedMotion: boolean;
}) {
  const { scene } = useGLTF(MODEL_URL, DRACO_DECODER_PATH);
  const rigRef = useRef<THREE.Group>(null);
  const introProgress = useRef(0);
  const aimInitialized = useRef(false);
  const currentAimQuat = useRef(new THREE.Quaternion());
  const targetAimQuat = useRef(new THREE.Quaternion());
  const shadowRef = useRef<THREE.Group>(null);
  const dronePosition = useMemo(() => new THREE.Vector3(), []);
  const worldTarget = useMemo(() => new THREE.Vector3(), []);
  const swayEuler = useRef(new THREE.Euler());
  const swayQuat = useRef(new THREE.Quaternion());
  const propSpinAxis = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  const { model, shadowScale, groundY, propellerSpinners } = useMemo(() => {
    const clone = scene.clone(true);
    clone.rotation.set(0, 0, 0);
    clone.position.set(0, 0, 0);
    clone.scale.setScalar(1);
    clone.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(clone);
    const center = bounds.getCenter(new THREE.Vector3());
    clone.position.sub(center);
    clone.updateMatrixWorld(true);

    const size = bounds.getSize(new THREE.Vector3());
    const spinners = setupPropellerSpinners(clone);

    return {
      model: clone,
      shadowScale: Math.max(size.x, size.z) * MODEL_SCALE * 1.15,
      groundY: (-size.y * MODEL_SCALE) / 2 - 0.02,
      propellerSpinners: spinners,
    };
  }, [scene]);

  useFrame(({ camera, clock, gl }, delta) => {
    if (!rigRef.current) {
      return;
    }

    if (reducedMotion) {
      rigRef.current.position.set(0, 0, 0);
      rigRef.current.scale.setScalar(MODEL_SCALE);
    } else {
      introProgress.current = Math.min(
        1,
        introProgress.current + delta / INTRO_DURATION,
      );
      const intro = easeOutCubic(introProgress.current);
      const t = clock.elapsedTime;

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

      for (const { pivot, direction } of propellerSpinners) {
        pivot.rotateOnWorldAxis(
          propSpinAxis,
          direction * PROPELLER_SPEED * intro * delta,
        );
      }
    }

    rigRef.current.getWorldPosition(dronePosition);

    const screenPoint = pointerRef.current;
    if (screenPoint) {
      const canvasRect = gl.domElement.getBoundingClientRect();
      const hit = raycastScreenToTeamAimPlane(
        screenPoint.x,
        screenPoint.y,
        canvasRect,
        camera,
        worldTarget,
      );
      if (hit) {
        computeDroneAimQuaternion(dronePosition, hit, targetAimQuat.current);
      }
    }

    const aimBlend = reducedMotion ? 1 : 1 - Math.exp(-delta / TEAM_AIM_SMOOTH);
    if (!aimInitialized.current && screenPoint) {
      currentAimQuat.current.copy(targetAimQuat.current);
      aimInitialized.current = true;
    } else {
      currentAimQuat.current.slerp(targetAimQuat.current, aimBlend);
    }

    if (reducedMotion) {
      rigRef.current.quaternion.copy(currentAimQuat.current);
      return;
    }

    const intro = easeOutCubic(introProgress.current);
    const t = clock.elapsedTime;
    swayEuler.current.set(
      Math.sin(t * 0.42 + 0.4) * 0.035 * intro,
      Math.sin(t * 0.28) * TEAM_SWAY_Y * intro,
      Math.cos(t * 0.36 + 0.2) * 0.022 * intro,
    );
    swayQuat.current.setFromEuler(swayEuler.current);
    rigRef.current.quaternion
      .copy(currentAimQuat.current)
      .multiply(swayQuat.current);
  });

  return (
    <>
      <group ref={rigRef}>
        <group rotation={[0, MODEL_YAW, 0]}>
          <primitive object={model} />
        </group>
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

function HeroScene({
  teamSlug,
  pointerRef,
  reducedMotion,
}: {
  teamSlug: SubTeamSlug;
  pointerRef: RefObject<{ x: number; y: number } | null>;
  reducedMotion: boolean;
}) {
  return (
    <>
      <TeamLighting teamSlug={teamSlug} reducedMotion={reducedMotion} />
      {/* Self-hosted rather than drei's `preset="studio"`, which resolves to
          raw.githack.com — a third-party dev proxy the deployed site would
          otherwise depend on at runtime. Same asset, served with the export. */}
      <Environment files="/hdri/studio_small_03_512.hdr" environmentIntensity={0.42} />
      <CinematicCamera reducedMotion={reducedMotion} />
      <Suspense fallback={null}>
        <CinematicDrone pointerRef={pointerRef} reducedMotion={reducedMotion} />
      </Suspense>
    </>
  );
}

export default function BuildLogHeroBackground() {
  const pathname = usePathname();
  const activeSlug = getActiveTeamSlug(pathname);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    pointerRef.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY };
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <>
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
          <HeroScene
            teamSlug={activeSlug}
            pointerRef={pointerRef}
            reducedMotion={reducedMotion}
          />
        </Canvas>
      </div>

      <TeamHeroOverlays />
    </>
  );
}
