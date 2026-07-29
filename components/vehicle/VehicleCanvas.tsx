"use client";

import {
  memo,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Canvas } from "@react-three/fiber";
import { CameraControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import DroneModel from "./DroneModel";
import InfoPanel from "./InfoPanel";
import HeroOverlay from "./HeroOverlay";
import SceneLighting from "./SceneLighting";
import { groupIdKey, type GroupId } from "@/lib/vehicle/groupId";
import {
  DEFAULT_LIGHTING_PRESET,
  isLightingPreset,
  PRESET_BACKGROUNDS,
  type LightingPreset,
} from "@/lib/vehicle/lighting";

// Elevated 3/4 hero framing. The camera sits high and back on a corner *between*
// the arms — azimuth ~22.5deg avoids looking straight down an arm axis (which
// would overlap the front/back arms) — and looks down at ~48deg elevation, so
// all four arms read with clear spacing.
const CAMERA_FOV = 45;
const HERO_AZIMUTH = Math.PI / 8;
const HERO_ELEVATION = (30 * Math.PI) / 180;

// Per-subsystem viewing elevation, overriding HERO_ELEVATION. The camera and
// payload hang *under* the main deck, so the hero's looking-down angle puts the
// airframe between the viewer and the part; a near-horizontal angle sees in
// under the plates instead. Kept just above level so the camera never drops
// below the contact-shadow plane, which would be visible edge-on from beneath.
const UNDERSLUNG_ELEVATION = (5 * Math.PI) / 180;
const SUBSYSTEM_ELEVATION: Record<string, number> = {
  camera: UNDERSLUNG_ELEVATION,
  payload: UNDERSLUNG_ELEVATION,
};

function elevationFor(group: GroupId): number {
  return SUBSYSTEM_ELEVATION[group.subsystem] ?? HERO_ELEVATION;
}
// Headroom around the fitted silhouette. Applied to a *tight* projected fit
// (not a loose bounding sphere), so this reads as real margin, and covers the
// slight perspective foreshortening the orthographic projection below ignores.
// Kept close for a "confident hero" read.
const FRAME_MARGIN = 1.3;
// Screen-space composition offset, as a fraction of the frame's half-extents.
// The hero copy sits bottom-left, so the drone is nudged up (freeing the lower
// band for the "Storm" headline + scroll hint) and slightly right (clearing the
// text column). Both are safely inside the FRAME_MARGIN headroom, so nothing crops.
const PAN_UP_FRAC = 0.03;
const PAN_RIGHT_FRAC = -0.02;

// --- Per-component framing -------------------------------------------------
// A component fit has the opposite problem to the hero fit: parts are tiny
// relative to the airframe, so fitting one tightly buries the camera inside the
// model and crops away the surrounding structure, leaving no clue where on the
// drone you're looking.
//
// The bounds are therefore fitted loosely and then clamped as a fraction of the
// *hero distance* — not of the model's radius, which says nothing about how the
// hero shot is composed. "Between 0.45x and 0.78x of the hero distance" is a
// claim about apparent size on screen, which is what's actually being tuned.
const GROUP_FRAME_MARGIN = 3.0;
// Floor: nothing gets closer than this, so a 2cm ESC still reads with its
// mounting context instead of filling the frame.
const GROUP_MIN_DIST_FRAC = 0.45;
// Ceiling: nothing gets further, so a physically large group (the companion
// computer's 77 nodes) doesn't just reproduce the hero shot.
const GROUP_MAX_DIST_FRAC = 0.78;

// --- Panel occlusion -------------------------------------------------------
// The info panel covers a real slice of the viewport, so the "visible" region
// for a component view isn't the full canvas. Both numbers mirror InfoPanel's
// CSS; if that layout changes, these change with it.
const PANEL_BREAKPOINT_PX = 768;
// md+: 26rem rail + 1rem inset.
const PANEL_RAIL_PX = 27 * 16;
// Below md: the bottom sheet's height cap plus its inset, as a fraction.
const PANEL_SHEET_FRAC = 0.48;
// Ceiling on how far the camera pulls back to compensate for that occlusion.
// The exact correction is 1/visibleFraction, which on a phone-sized sheet is
// ~2x and collapses every component view back into the hero shot. Capping it
// trades a little cropping for a component that's still worth looking at.
const MAX_OCCLUSION_PULLBACK = 1.45;

/**
 * Screen basis for a view direction at the hero azimuth and the given
 * elevation. `dir` points from the target back toward the camera and is
 * distance-independent, so a fit can be derived from it; `right`/`up` are the
 * image-plane axes for that direction.
 */
function heroViewBasis(elevation: number = HERO_ELEVATION) {
  const dir = new THREE.Vector3(
    Math.cos(elevation) * Math.cos(HERO_AZIMUTH),
    Math.sin(elevation),
    Math.cos(elevation) * Math.sin(HERO_AZIMUTH)
  ).normalize();
  const worldUp = new THREE.Vector3(0, 1, 0);
  const right = new THREE.Vector3().crossVectors(worldUp, dir).normalize();
  const up = new THREE.Vector3().crossVectors(dir, right).normalize();
  return { dir, right, up };
}

/**
 * Projects a box's 8 corners onto the image plane to get the true silhouette
 * half-extents under this view — a tight fit, not the loose diagonal sphere.
 */
function projectedHalfExtents(
  bounds: THREE.Box3,
  center: THREE.Vector3,
  right: THREE.Vector3,
  up: THREE.Vector3
) {
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
  return { halfW, halfH };
}

/** Camera distance that fits the given half-extents at CAMERA_FOV. */
function distanceToFit(halfW: number, halfH: number, aspect: number) {
  const tanV = Math.tan(((CAMERA_FOV * Math.PI) / 180) / 2);
  return Math.max(halfH / tanV, halfW / (tanV * aspect));
}

/**
 * How much of the canvas the info panel covers, as fractions of width/height.
 * Exactly one axis is ever non-zero: the panel is a right rail above the
 * breakpoint and a bottom sheet below it.
 */
function panelOcclusion(viewportW: number, viewportH: number) {
  if (viewportW >= PANEL_BREAKPOINT_PX) {
    return { right: Math.min(PANEL_RAIL_PX / viewportW, 0.5), bottom: 0 };
  }
  return { right: 0, bottom: viewportH > 0 ? PANEL_SHEET_FRAC : 0 };
}

/**
 * Frames a single tagged subsystem. Keeps the hero's elevated 3/4 direction —
 * only distance and look-at point change — so flying between components reads
 * as one continuous orbit rather than a cut to an arbitrary new angle.
 *
 * Two corrections on top of a plain fit:
 *  1. Distance is clamped to a fraction of the hero distance, so apparent size
 *     is bounded regardless of how big or small the part actually is.
 *  2. The part is pulled back and panned into the slice of canvas the info
 *     panel *isn't* covering, so selecting something never parks it behind the
 *     panel.
 */
function frameGroupView(
  controls: CameraControls,
  groupBounds: THREE.Box3,
  overallBounds: THREE.Box3,
  viewportW: number,
  viewportH: number,
  elevation: number
) {
  const camera = controls.camera as THREE.PerspectiveCamera;
  const aspect = camera.aspect || 1;
  const { dir, right, up } = heroViewBasis(elevation);
  const center = groupBounds.getCenter(new THREE.Vector3());

  // Apparent size, bounded against the hero framing rather than against the
  // model's own dimensions. The reference hero fit is measured in *this* view's
  // basis, so a lowered elevation (where the airframe presents a much shorter
  // silhouette) doesn't inherit a distance derived from the top-down one.
  const group = projectedHalfExtents(groupBounds, center, right, up);
  const overallCenter = overallBounds.getCenter(new THREE.Vector3());
  const whole = projectedHalfExtents(overallBounds, overallCenter, right, up);
  const heroDist =
    distanceToFit(whole.halfW, whole.halfH, aspect) * FRAME_MARGIN;

  let dist = THREE.MathUtils.clamp(
    distanceToFit(group.halfW, group.halfH, aspect) * GROUP_FRAME_MARGIN,
    heroDist * GROUP_MIN_DIST_FRAC,
    heroDist * GROUP_MAX_DIST_FRAC
  );

  // Back off so the framing fits the *unoccluded* band, capped so a tall bottom
  // sheet can't push every component view back to the hero distance.
  const occlusion = panelOcclusion(viewportW, viewportH);
  const visible = Math.min(1 - occlusion.right, 1 - occlusion.bottom);
  dist *= Math.min(1 / visible, MAX_OCCLUSION_PULLBACK);

  // Recentre on that band. Panning eye+target along +right slides the subject
  // left on screen; along -up slides it up. Shifting by half the occluded
  // extent puts the subject in the middle of what's actually visible.
  const tanV = Math.tan(((CAMERA_FOV * Math.PI) / 180) / 2);
  const halfFrameH = dist * tanV;
  const halfFrameW = halfFrameH * aspect;
  const target = center
    .clone()
    .addScaledVector(right, occlusion.right * halfFrameW)
    .addScaledVector(up, -occlusion.bottom * halfFrameH);

  controls.setLookAt(
    target.x + dir.x * dist,
    target.y + dir.y * dist,
    target.z + dir.z * dist,
    target.x,
    target.y,
    target.z,
    true
  );
}

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
  const { dir, right, up } = heroViewBasis();
  const { halfW, halfH } = projectedHalfExtents(bounds, center, right, up);

  const tanV = Math.tan(((CAMERA_FOV * Math.PI) / 180) / 2);
  const dist = distanceToFit(halfW, halfH, aspect) * FRAME_MARGIN;

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

// Guided-tour route, front-to-back through the airframe: the avionics stack and
// battery in the centre body first, then out to a propulsion arm and its ESC,
// then back in for the autonomy hardware, and finally down to the camera and
// payload slung underneath. `motor` is arm-scoped, so the tour visits one arm
// as the representative — the other three are identical. Arm 3 (armIndex 2, as
// the panel labels it) reads best from the hero azimuth; the others sit further
// behind the body from this angle.
const TOUR_STOPS: readonly GroupId[] = [
  { subsystem: "avionicsHousing" },
  { subsystem: "battery" },
  { subsystem: "motor", armIndex: 2 },
  { subsystem: "esc" },
  { subsystem: "companionComputer" },
  { subsystem: "camera" },
  { subsystem: "payload" },
];

interface GroundShadow {
  x: number;
  y: number;
  z: number;
  scale: number;
}

// drei's ContactShadows re-renders its shadow pass every frame by default, and
// keeps doing so forever even once the drone stops moving. Each pass is a full
// re-render of the whole scene into a 1024px target with a depth override,
// followed by four full-screen blur passes — i.e. it roughly doubles the
// geometry submitted per frame, permanently.
//
// Its `frames` prop caps that, but the installed version tracks the count in a
// plain render-scope `let`, not a ref, so ANY re-render of the component
// re-arms it. Hovering the model changes `hoveredGroup`, which re-renders
// VehicleCanvas, which re-renders this — so the cap silently never held.
// Memoizing fixes that, but only if every prop is referentially stable, which
// is why the position tuple below is memoized rather than written inline.
const FrozenContactShadows = memo(ContactShadows);

// The lighting preset is read from the URL, which React treats as an external
// store: the server render has no query string, so it falls back to the prop
// and the client re-reads after hydration.
const NEVER_CHANGES = () => () => {};

function useLightingPreset(fallback: LightingPreset): LightingPreset {
  const read = useCallback(() => {
    const fromQuery = new URLSearchParams(window.location.search).get("lighting");
    return isLightingPreset(fromQuery) ? fromQuery : fallback;
  }, [fallback]);
  const readOnServer = useCallback(() => fallback, [fallback]);
  return useSyncExternalStore(NEVER_CHANGES, read, readOnServer);
}

interface VehicleCanvasProps {
  /** Which lighting look to render. See lib/vehicle/lighting.ts. */
  lightingPreset?: LightingPreset;
}

export default function VehicleCanvas({
  lightingPreset = DEFAULT_LIGHTING_PRESET,
}: VehicleCanvasProps) {
  // `?lighting=atmospheric` overrides the prop, so the two presets can be
  // compared in the browser without a rebuild.
  const preset = useLightingPreset(lightingPreset);

  const [hoveredGroup, setHoveredGroup] = useState<GroupId | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<GroupId | null>(null);
  const [ground, setGround] = useState<GroundShadow | null>(null);
  // Index into TOUR_STOPS while the guided tour runs; null when it isn't.
  const [tourStop, setTourStop] = useState<number | null>(null);
  // Flips once, when the mount-time landing sequence reaches the resting
  // pose. Gates the hero text fade-in and all model/tour interactivity so
  // nothing else in the scene moves until the drone has actually landed.
  const [hasLanded, setHasLanded] = useState(false);
  const controlsRef = useRef<CameraControls | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const overallBoundsRef = useRef<THREE.Box3 | null>(null);
  const groupBoundsRef = useRef<Map<string, THREE.Box3> | null>(null);
  // Mirror of tourStop that callbacks can read synchronously. The auto-advance
  // timer and the click handlers both need "which stop are we on" without
  // taking tourStop as a dependency and re-creating themselves every stop.
  const tourStopRef = useRef<number | null>(null);
  // Mirror of selectedGroup for the resize listener, so it can skip reframing
  // while a component is selected (its fitToBox owns the camera then).
  const selectedGroupRef = useRef<GroupId | null>(null);
  useEffect(() => {
    selectedGroupRef.current = selectedGroup;
  }, [selectedGroup]);

  const handleReady = useCallback(
    (overallBounds: THREE.Box3, groupBounds: Map<string, THREE.Box3>) => {
      overallBoundsRef.current = overallBounds;
      groupBoundsRef.current = groupBounds;
      const controls = controlsRef.current;
      if (controls) frameHeroView(controls, overallBounds, false);
      // On touch devices, a single-finger drag on the canvas defaults to
      // orbiting the camera — which also means it swallows the vertical
      // swipe a mobile visitor expects to scroll the page. Selecting a
      // component is already a tap (DroneModel's onClick, independent of
      // this), so free-orbiting isn't needed for the touch interaction
      // model; only pinch-zoom (touches.two) is kept.
      if (controls && window.matchMedia("(pointer: coarse)").matches) {
        controls.touches.one = 0; // CameraControls.ACTION.NONE
      }

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
    },
    []
  );

  // Keep the hero framing consistent as the window resizes — the fit is
  // aspect-aware, so a new width needs a fresh distance. Deferred to the next
  // frame so react-three-fiber has updated the camera aspect first. Skipped
  // while a component is selected.
  //
  // Gated on width actually changing: mobile browsers fire `resize` when
  // their chrome (address bar) collapses/expands during a scroll gesture,
  // even though the container's svh-based height doesn't move as a result.
  // Reframing on that phantom resize would yank the camera mid-scroll.
  useEffect(() => {
    let raf = 0;
    let lastWidth = window.innerWidth;
    const onResize = () => {
      const width = window.innerWidth;
      if (width === lastWidth) return;
      lastWidth = width;
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

  /** Flies to a group, sized against the canvas the panel will share. */
  const flyToGroup = useCallback((group: GroupId, bounds: THREE.Box3) => {
    const controls = controlsRef.current;
    const overall = overallBoundsRef.current;
    const container = containerRef.current;
    if (!controls || !overall || !container) return;
    frameGroupView(
      controls,
      bounds,
      overall,
      container.clientWidth,
      container.clientHeight,
      elevationFor(group)
    );
  }, []);

  const handleSelectGroup = useCallback(
    (group: GroupId, bounds: THREE.Box3) => {
      setSelectedGroup(group);
      flyToGroup(group, bounds);
    },
    [flyToGroup]
  );

  /**
   * The universal "back to neutral": clears the selection, cancels any running
   * tour, and eases the camera back to the hero framing. Wired to the panel's
   * close button, to clicks that miss the model, and to the tour's own exit —
   * they should all land in the same place.
   */
  const returnToHero = useCallback(() => {
    tourStopRef.current = null;
    setTourStop(null);
    setSelectedGroup(null);
    const controls = controlsRef.current;
    if (controls && overallBoundsRef.current) {
      frameHeroView(controls, overallBoundsRef.current, true);
    }
  }, []);

  /** Selects the stop at `index` and flies the camera to it. */
  const goToStop = useCallback(
    (index: number) => {
      const stop = TOUR_STOPS[index];
      if (!stop) return;
      tourStopRef.current = index;
      setTourStop(index);
      setSelectedGroup(stop);
      const bounds = groupBoundsRef.current?.get(groupIdKey(stop));
      if (bounds) flyToGroup(stop, bounds);
    },
    [flyToGroup]
  );

  const startTour = useCallback(() => {
    if (!hasLanded) return;
    goToStop(0);
  }, [goToStop, hasLanded]);

  const handleLanded = useCallback(() => setHasLanded(true), []);

  // Referentially stable so FrozenContactShadows' memo actually holds across
  // unrelated re-renders (hover, selection, tour). An inline array literal here
  // would be a new object every render and defeat the memo entirely.
  const groundPosition = useMemo<[number, number, number] | null>(
    () => (ground ? [ground.x, ground.y, ground.z] : null),
    [ground]
  );

  // The tour advances only when the viewer asks it to. There is deliberately no
  // dwell timer: reading a stop takes as long as it takes, and a clock that
  // moves the camera out from under you while you're reading is worse than no
  // automation at all.
  const advanceTour = useCallback(() => {
    const current = tourStopRef.current;
    if (current === null) return;
    const next = current + 1;
    // Past the last stop the tour is done — fall back to the hero view.
    if (next >= TOUR_STOPS.length) returnToHero();
    else goToStop(next);
  }, [goToStop, returnToHero]);

  const scrollToDetails = useCallback(() => {
    document
      .getElementById("vehicle-details")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div
      ref={containerRef}
      // svh (not vh/dvh) so the mobile browser chrome collapsing/expanding
      // mid-scroll doesn't resize this container out from under the user —
      // it's pinned to the smallest-chrome-visible viewport instead of
      // tracking chrome state. Nav height differs per breakpoint (56px
      // mobile + its own safe-area inset, 64px desktop; see Nav.tsx), so
      // that's matched here rather than the single fixed 72px both used
      // to share.
      className="relative h-[calc(100svh-56px-env(safe-area-inset-top))] w-full overflow-hidden touch-pan-y md:h-[calc(100svh-64px)]"
      style={{ background: PRESET_BACKGROUNDS[preset] }}
    >
      <Canvas
        camera={{ position: [1.5, 1.8, 0.6], fov: CAMERA_FOV, near: 0.01, far: 100 }}
        gl={{ alpha: true }}
        // r3f defaults to the display's raw devicePixelRatio with no ceiling.
        // On a 2x screen that is 4x the fragments of a 1x render, every frame,
        // over a full-viewport canvas — by far the largest per-frame cost here,
        // since this scene is fragment-bound (35 materials, image-based
        // lighting, optional fog) rather than draw-call-bound. Capping at 1.75
        // keeps edges crisp while cutting worst-case fragment work by ~23% vs
        // 2x, and much more on 3x phone screens.
        dpr={[1, 1.75]}
        onPointerMissed={returnToHero}
      >
        {/* Suspended separately from the model: <Environment> loads a ~1.5MB
            HDRI, and without its own boundary that fetch suspends this whole
            subtree, so the drone can't render until the environment map has
            arrived. Split, the two load in parallel and the scene appears as
            soon as the geometry is ready. */}
        <Suspense fallback={null}>
          <SceneLighting preset={preset} />
        </Suspense>
        <Suspense fallback={null}>
          <DroneModel
            hoveredGroup={hoveredGroup}
            selectedGroup={selectedGroup}
            interactive={tourStop === null}
            hasLanded={hasLanded}
            onHoverGroup={setHoveredGroup}
            onSelectGroup={handleSelectGroup}
            onReady={handleReady}
            onLanded={handleLanded}
          />
        </Suspense>
        {/* Soft contact shadow anchoring the drone — adds depth and grounding
            under the legs without a visible ground plane. Kept live
            (frames=Infinity) through the landing descent so it sharpens
            naturally as the drone approaches the ground, then frozen after
            one more frame once it's landed — nothing under it moves again
            after that, so continuing to re-render the shadow forever would
            be pure cost with no visual difference. */}
        {ground && groundPosition && (
          <FrozenContactShadows
            position={groundPosition}
            scale={ground.scale}
            resolution={1024}
            blur={2.6}
            opacity={0.6}
            far={ground.scale}
            color="#000106"
            frames={hasLanded ? 1 : Infinity}
          />
        )}
        <CameraControls ref={controlsRef} makeDefault />
      </Canvas>
      <HeroOverlay
        dimmed={selectedGroup !== null}
        tourActive={tourStop !== null}
        hasLanded={hasLanded}
        onExplore={startTour}
        onMoreInfo={scrollToDetails}
      />
      <InfoPanel
        selectedGroup={selectedGroup}
        onClose={returnToHero}
        tour={
          tourStop === null
            ? null
            : {
                index: tourStop,
                total: TOUR_STOPS.length,
                onNext: advanceTour,
                onEnd: returnToHero,
              }
        }
      />
    </div>
  );
}
