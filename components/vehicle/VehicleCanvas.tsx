"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { CameraControls, ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";
import DroneModel from "./DroneModel";
import InfoPanel from "./InfoPanel";
import HeroOverlay from "./HeroOverlay";
import type { GroupId } from "@/lib/vehicle/groupId";

const GROUP_FIT_PADDING = { paddingLeft: 0.2, paddingRight: 0.2, paddingTop: 0.2, paddingBottom: 0.2 };

// Elevated 3/4 hero framing. The camera sits high and back on a corner *between*
// the arms — azimuth ~22.5deg avoids looking straight down an arm axis (which
// would overlap the front/back arms) — and looks down at ~48deg elevation, so
// all four arms read with clear spacing.
const CAMERA_FOV = 45;
const HERO_AZIMUTH = Math.PI / 8;
const HERO_ELEVATION = (30 * Math.PI) / 180;
// Headroom around the fitted silhouette. Applied to a *tight* projected fit
// (not a loose bounding sphere), so this reads as real margin, and covers the
// slight perspective foreshortening the orthographic projection below ignores.
// Kept close for a "confident hero" read.
const FRAME_MARGIN = 1.3;
// Screen-space composition offset, as a fraction of the frame's half-extents.
// The hero copy sits bottom-left, so the drone is nudged up (freeing the lower
// band for the "Strom" headline + scroll hint) and slightly right (clearing the
// text column). Both are safely inside the FRAME_MARGIN headroom, so nothing crops.
const PAN_UP_FRAC = 0.03;
const PAN_RIGHT_FRAC = -0.02;

// Frames the drone at a consistent, close "hero" size at *any* landscape aspect
// ratio. Rather than fitting the loose bounding sphere to the vertical FOV
// (which is width-independent, so wide viewports waste all their extra
// horizontal room and the drone reads as small/distant), this projects the
// model's real bounding-box silhouette onto the view plane and fits *that*,
// aspect-aware: on wider viewports the height binds and the camera moves in
// closer instead of pulling back. The result reads the same "close and
// confident" size whether the window is narrow or wide, and never crops.
function frameHeroView(
  controls: CameraControls,
  bounds: THREE.Box3,
  enableTransition: boolean
) {
  const camera = controls.camera as THREE.PerspectiveCamera;
  const aspect = camera.aspect || 1;
  const center = bounds.getCenter(new THREE.Vector3());

  // Fixed hero view direction (points from the target back toward the camera);
  // independent of distance, so we can derive the fit from it.
  const dir = new THREE.Vector3(
    Math.cos(HERO_ELEVATION) * Math.cos(HERO_AZIMUTH),
    Math.sin(HERO_ELEVATION),
    Math.cos(HERO_ELEVATION) * Math.sin(HERO_AZIMUTH)
  ).normalize();

  // Screen basis on the image plane for this view direction.
  const worldUp = new THREE.Vector3(0, 1, 0);
  const right = new THREE.Vector3().crossVectors(worldUp, dir).normalize();
  const up = new THREE.Vector3().crossVectors(dir, right).normalize();

  // Project the 8 box corners onto the image plane to get the true silhouette
  // half-extents under this specific view — a tight fit, not the diagonal sphere.
  const { min, max } = bounds;
  const corner = new THREE.Vector3();
  let halfW = 0;
  let halfH = 0;
  for (let i = 0; i < 8; i++) {
    corner
      .set(i & 1 ? max.x : min.x, i & 2 ? max.y : min.y, i & 4 ? max.z : min.z)
      .sub(center);
    halfW = Math.max(halfW, Math.abs(corner.dot(right)));
    halfH = Math.max(halfH, Math.abs(corner.dot(up)));
  }

  const tanV = Math.tan(((CAMERA_FOV * Math.PI) / 180) / 2);
  const distForHeight = halfH / tanV;
  const distForWidth = halfW / (tanV * aspect);
  const dist = Math.max(distForHeight, distForWidth) * FRAME_MARGIN;

  // Compose: shift the whole view so the drone reads up-and-right of dead
  // center, balancing the bottom-left hero copy. Panning the eye+target by
  // -right/-up moves the subject the opposite way on screen. Scaled by the
  // frame's world half-extents at this distance so the offset is consistent
  // across aspect ratios.
  const halfFrameH = dist * tanV;
  const halfFrameW = halfFrameH * aspect;
  const target = center
    .clone()
    .addScaledVector(right, -PAN_RIGHT_FRAC * halfFrameW)
    .addScaledVector(up, -PAN_UP_FRAC * halfFrameH);

  controls.setLookAt(
    target.x + dir.x * dist,
    target.y + dir.y * dist,
    target.z + dir.z * dist,
    target.x,
    target.y,
    target.z,
    enableTransition
  );
}

interface GroundShadow {
  x: number;
  y: number;
  z: number;
  scale: number;
}

export default function VehicleCanvas() {
  const [hoveredGroup, setHoveredGroup] = useState<GroupId | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<GroupId | null>(null);
  const [ground, setGround] = useState<GroundShadow | null>(null);
  const controlsRef = useRef<CameraControls | null>(null);
  const overallBoundsRef = useRef<THREE.Box3 | null>(null);
  // Mirror of selectedGroup for the resize listener, so it can skip reframing
  // while a component is selected (its fitToBox owns the camera then).
  const selectedGroupRef = useRef<GroupId | null>(null);
  useEffect(() => {
    selectedGroupRef.current = selectedGroup;
  }, [selectedGroup]);

  const handleReady = useCallback((overallBounds: THREE.Box3) => {
    overallBoundsRef.current = overallBounds;
    const controls = controlsRef.current;
    if (controls) frameHeroView(controls, overallBounds, false);

    // Ground plane for the soft contact shadow: sit it just under the lowest
    // point of the drone (the legs) and size it to the footprint.
    const size = overallBounds.getSize(new THREE.Vector3());
    const center = overallBounds.getCenter(new THREE.Vector3());
    setGround({
      x: center.x,
      y: overallBounds.min.y - 0.02,
      z: center.z,
      scale: Math.max(size.x, size.z) * 1.15,
    });
  }, []);

  // Keep the hero framing consistent as the window resizes — the fit is
  // aspect-aware, so a new width needs a fresh distance. Deferred to the next
  // frame so react-three-fiber has updated the camera aspect first. Skipped
  // while a component is selected.
  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const controls = controlsRef.current;
        const bounds = overallBoundsRef.current;
        if (controls && bounds && selectedGroupRef.current === null) {
          frameHeroView(controls, bounds, false);
        }
      });
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const handleSelectGroup = useCallback(
    (group: GroupId, bounds: THREE.Box3) => {
      setSelectedGroup(group);
      controlsRef.current?.fitToBox(bounds, true, GROUP_FIT_PADDING);
    },
    []
  );

  const handleDeselect = useCallback(() => {
    setSelectedGroup(null);
    const controls = controlsRef.current;
    if (controls && overallBoundsRef.current) {
      frameHeroView(controls, overallBoundsRef.current, true);
    }
  }, []);

  return (
    <div
      className="relative h-[calc(100vh-72px)] w-full overflow-hidden"
      style={{
        background: [
          // Accent-red brand bloom, upper-right — SkyXperts red presence plus
          // warm/cool contrast against the navy field.
          "radial-gradient(50% 40% at 74% 16%, rgba(227,28,28,0.16) 0%, rgba(227,28,28,0) 60%)",
          // Cool "spotlight" glow behind the subject (up-and-right, where the
          // drone now sits) — lifts it off the field and adds depth.
          "radial-gradient(46% 44% at 58% 38%, rgba(86,112,230,0.30) 0%, rgba(86,112,230,0) 64%)",
          // Warm hero light pool beneath the model — grounds it and echoes the
          // warm under-light, fading through a touch of red into the navy.
          "radial-gradient(44% 26% at 52% 88%, rgba(255,150,74,0.32) 0%, rgba(232,72,48,0.11) 46%, rgba(255,120,60,0) 74%)",
          // Deep navy base vignette: a considered indigo core with a strong,
          // layered falloff to near-black at the corners so the drone has punch.
          "radial-gradient(135% 122% at 54% 34%, #1E2A7A 0%, #131B5C 30%, #0A0F3C 52%, #05071E 76%, #010207 100%)",
        ].join(", "),
      }}
    >
      <Canvas
        camera={{ position: [1.5, 1.8, 0.6], fov: CAMERA_FOV, near: 0.01, far: 100 }}
        gl={{ alpha: true }}
        onPointerMissed={handleDeselect}
      >
        {/* Low ambient for contrast, so the shaped warm-key / cool-rim lighting
            reads as dominant and the metal gets real shape. */}
        <ambientLight intensity={0.22} />
        {/* Warm key light, high front-right — the primary shaper. */}
        <directionalLight position={[3, 5, 2]} intensity={1.9} color="#fff3e6" />
        {/* Cool fill — lifts the shadow side without flattening (warm/cool split). */}
        <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#cdd8ff" />
        {/* Cool rim from behind-top: a crisp premium edge that separates the
            drone's silhouette from the navy background. */}
        <directionalLight
          position={[-2.2, 4, -4.5]}
          intensity={1.7}
          color="#a7c4ff"
        />
        {/* Warm hero under/rim light: a pronounced glow rising from beneath. */}
        <pointLight
          position={[0, -0.55, 0.15]}
          intensity={7}
          distance={2.6}
          decay={2}
          color="#ff9e4d"
        />
        {/* Richer image-based reflections for a more premium metallic read. */}
        <Environment preset="city" environmentIntensity={0.55} />
        <Suspense fallback={null}>
          <DroneModel
            hoveredGroup={hoveredGroup}
            selectedGroup={selectedGroup}
            onHoverGroup={setHoveredGroup}
            onSelectGroup={handleSelectGroup}
            onReady={handleReady}
          />
        </Suspense>
        {/* Soft contact shadow anchoring the drone — adds depth and grounding
            under the legs without a visible ground plane. */}
        {ground && (
          <ContactShadows
            position={[ground.x, ground.y, ground.z]}
            scale={ground.scale}
            resolution={1024}
            blur={2.6}
            opacity={0.55}
            far={ground.scale}
            color="#01020c"
          />
        )}
        <CameraControls ref={controlsRef} makeDefault />
      </Canvas>
      <HeroOverlay dimmed={selectedGroup !== null} />
      <InfoPanel selectedGroup={selectedGroup} onClose={handleDeselect} />
    </div>
  );
}
