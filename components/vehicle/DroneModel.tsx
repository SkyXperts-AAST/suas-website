"use client";

import { useEffect, useMemo, useRef, type Dispatch, type SetStateAction } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { lookupSubsystemForNode } from "@/lib/vehicle/subsystemLookup";
import { clusterArms } from "@/lib/vehicle/armClustering";
import { groupIdKey, groupIdsEqual, type GroupId } from "@/lib/vehicle/groupId";
import { setupPropellerSpinners, spinPropellerPivot } from "@/lib/vehicle/findPropellerPivots";

const MODEL_URL = "/models/storm-final-optimized-v2.glb";
const DRACO_DECODER_PATH = "/draco/";

// The GLB's front faces away from the hero camera, so spin the model 180deg
// about Y to present its front. Applied on the scene before any bounds /
// clustering are computed (below), so framing and per-group selection stay
// consistent with what's rendered.
const MODEL_YAW = Math.PI;

// One-time landing sequence played on mount. The model's raw bounds are ~0.34
// units tall (see storm-final-optimized-v2.glb), so 0.22 units of lift reads
// as "hovering just above the landing spot" at this scene's scale without
// pushing the drone out of the hero camera's framed view. X/Z and rotation
// are never touched — only Y animates, straight down onto the resting pose
// the camera is already framed around.
const LANDING_OFFSET_Y = 0.22;
const LANDING_DURATION = 1.8;
// Matches BuildLogHeroBackground's hover-spin rate, for a consistent idle
// speed across the two drone hero scenes.
const PROPELLER_IDLE_SPEED = 22;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

// Hover/selection tint. Deliberately NOT Accent Red: most of Storm's bodywork
// is already red, so a red emissive was invisible against the parts it was
// meant to call out. This cyan is the same one the site's frosted nav gradient
// uses (.nav-glass in globals.css), and it separates hard from both the red
// panels and the black carbon.
const HIGHLIGHT_COLOR = "#38BDF8";
const HOVER_EMISSIVE_INTENSITY = 0.7;
const SELECTED_EMISSIVE_INTENSITY = 1.5;

// Subsystems whose parts live on the 4 propulsion arms and therefore carry a
// per-arm index, grouped as `${subsystem}:${armIndex}`. Only the motors are
// arm-scoped: the ESCs are mounted on the central hub faces (rotated 45deg off
// the arms), so they don't map onto arm indices and are kept as one group.
const ARM_SUBSYSTEMS = new Set(["motor"]);

useGLTF.preload(MODEL_URL, DRACO_DECODER_PATH);

interface TaggedGroup {
  meshes: THREE.Mesh[];
  bounds: THREE.Box3;
}

interface DroneModelProps {
  hoveredGroup: GroupId | null;
  selectedGroup: GroupId | null;
  /**
   * When false, clicking the model does nothing. Used while the guided tour
   * owns the camera, so a stray click can't fight the tour for a target.
   * Hover highlighting stays live — `selectedGroup` outranks it anyway.
   */
  interactive?: boolean;
  /**
   * True once the one-time landing sequence has finished. Hover/click on the
   * model are suppressed until then, regardless of `interactive`.
   */
  hasLanded: boolean;
  onHoverGroup: Dispatch<SetStateAction<GroupId | null>>;
  onSelectGroup: (group: GroupId, bounds: THREE.Box3) => void;
  /**
   * Fires once, after tagging and arm clustering. `groupBounds` is keyed by
   * `groupIdKey` so the parent can fly to any subsystem it wasn't clicked into
   * — the guided tour needs targets for groups the user never touched.
   */
  onReady: (
    overallBounds: THREE.Box3,
    groupBounds: Map<string, THREE.Box3>
  ) => void;
  /** Fires once, when the landing sequence reaches the resting pose. */
  onLanded: () => void;
}

export default function DroneModel({
  hoveredGroup,
  selectedGroup,
  interactive = true,
  hasLanded,
  onHoverGroup,
  onSelectGroup,
  onReady,
  onLanded,
}: DroneModelProps) {
  const { scene } = useGLTF(MODEL_URL, DRACO_DECODER_PATH);
  const readyRef = useRef(false);
  const landedRef = useRef(false);
  const landingElapsedRef = useRef(0);

  // Clone before any transforms or tagging so the shared useGLTF cache stays
  // pristine for other pages (e.g. build-log propeller pivots).
  const { model, groups, armCenters, overallBounds, propellerSpinners } = useMemo(() => {
    const model = scene.clone(true);
    model.rotation.set(0, MODEL_YAW, 0);
    model.updateMatrixWorld(true);

    const groups = new Map<string, TaggedGroup>();
    const armMeshes: THREE.Mesh[] = [];

    model.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      // Resolve the subsystem by walking up to the nearest CAD assembly group
      // ("Motor Mount", "SIYI Camera v1", ...). Leaf mesh names are
      // auto-generated and get renumbered on every CAD re-export, so they can't
      // be matched on directly; the group names are stable. See
      // lib/vehicle/subsystemLookup.ts and models/subsystem-map.json.
      const info = lookupSubsystemForNode(obj);
      if (!info) return;
      obj.userData.subsystem = info.key;
      obj.userData.subsystemLabel = info.label;
      if (ARM_SUBSYSTEMS.has(info.key)) {
        // Grouped below, once each mesh's arm is known.
        armMeshes.push(obj);
      } else {
        const group = groups.get(info.key) ?? { meshes: [], bounds: new THREE.Box3() };
        group.meshes.push(obj);
        groups.set(info.key, group);
      }
    });

    // Cluster the motor parts into the 4 physical arms by position.
    const { armIndexByMesh, armCenters } = clusterArms(armMeshes);

    for (const mesh of armMeshes) {
      const armIndex = armIndexByMesh.get(mesh) ?? 0;
      mesh.userData.armIndex = armIndex;
      const key = `${mesh.userData.subsystem as string}:${armIndex}`;
      const group = groups.get(key) ?? { meshes: [], bounds: new THREE.Box3() };
      group.meshes.push(mesh);
      groups.set(key, group);
    }

    for (const group of groups.values()) {
      for (const mesh of group.meshes) group.bounds.expandByObject(mesh);
    }

    // Bounds are captured at the resting pose (Y = 0) *before* the airborne
    // offset below, so the hero camera frames the same shot the drone lands
    // into rather than the elevated starting position.
    const overallBounds = new THREE.Box3().setFromObject(model);

    // Reparents propeller meshes onto per-arm pivots; done after tagging so
    // the subsystem lookup above (keyed off original parent names) isn't
    // affected by the reparenting.
    const propellerSpinners = setupPropellerSpinners(model);

    return { model, groups, armCenters, overallBounds, propellerSpinners };
  }, [scene]);

  // Landing sequence lives on a wrapper group rather than `model` itself —
  // `model` comes from useMemo and mutating it directly in a hook callback
  // isn't safe under the React Compiler; a ref is the sanctioned escape
  // hatch (same pattern as BuildLogHeroBackground's rigRef).
  const landingGroupRef = useRef<THREE.Group>(null);

  // Descends from the airborne Y to the resting Y (0) over LANDING_DURATION,
  // ease-out cubic, with propeller spin-down driven by the same eased
  // progress so both finish together. Runs once per mount — guarded by
  // landedRef rather than component state, since it mutates the group/pivots
  // directly every frame without needing a re-render.
  useFrame((_, delta) => {
    if (landedRef.current) return;
    const group = landingGroupRef.current;
    if (!group) return;

    landingElapsedRef.current = Math.min(
      LANDING_DURATION,
      landingElapsedRef.current + delta
    );
    const t = landingElapsedRef.current / LANDING_DURATION;
    const eased = easeOutCubic(t);

    group.position.y = LANDING_OFFSET_Y * (1 - eased);

    const propSpeed = PROPELLER_IDLE_SPEED * (1 - eased);
    for (const { pivot, direction } of propellerSpinners) {
      spinPropellerPivot(pivot, direction, propSpeed, delta);
    }

    if (t >= 1) {
      landedRef.current = true;
      group.position.y = 0;
      onLanded();
    }
  });

  // One-time side effects once tagging/clustering has run: log the arm
  // clustering result for sanity-checking, and hand the overall bounds up
  // so the camera can frame the model.
  useEffect(() => {
    const armSummary = [0, 1, 2, 3].map((i) => ({
      arm: i,
      motorParts: groups.get(`motor:${i}`)?.meshes.length ?? 0,
      center: armCenters[i]
        ? `(${armCenters[i].x.toFixed(3)}, ${armCenters[i].y.toFixed(3)}, ${armCenters[i].z.toFixed(3)})`
        : "n/a",
    }));
    console.log(
      `[VehicleCanvas] motor arm clustering (esc: ${groups.get("esc")?.meshes.length ?? 0} parts, single group):`
    );
    console.table(armSummary);

    if (!readyRef.current) {
      readyRef.current = true;
      const groupBounds = new Map(
        [...groups].map(([key, group]) => [key, group.bounds])
      );
      onReady(overallBounds, groupBounds);
    }
  }, [groups, armCenters, overallBounds, onReady]);

  // Highlight the active group by tinting the real meshes' emissive channel.
  // The propulsion parts are instanced and all share one material, so we clone
  // the material per mesh for the duration of the highlight (mutating the
  // shared material directly would light up every instance) and restore the
  // originals on change. Runs only when the active group changes — not per
  // frame.
  useEffect(() => {
    const active = selectedGroup ?? hoveredGroup;
    const group = active ? groups.get(groupIdKey(active)) : undefined;
    if (!group) return;

    const color = new THREE.Color(HIGHLIGHT_COLOR);
    const intensity = groupIdsEqual(active, selectedGroup)
      ? SELECTED_EMISSIVE_INTENSITY
      : HOVER_EMISSIVE_INTENSITY;

    const restores: Array<() => void> = [];
    for (const mesh of group.meshes) {
      const original = mesh.material;
      const originals = Array.isArray(original) ? original : [original];
      const highlighted = originals.map((mat) => {
        const clone = mat.clone() as THREE.MeshStandardMaterial;
        if (clone.emissive) {
          clone.emissive = color;
          clone.emissiveIntensity = intensity;
        }
        return clone;
      });
      mesh.material = Array.isArray(original) ? highlighted : highlighted[0];
      restores.push(() => {
        mesh.material = original;
        highlighted.forEach((c) => c.dispose());
      });
    }
    return () => restores.forEach((restore) => restore());
  }, [hoveredGroup, selectedGroup, groups]);

  const groupForMesh = (mesh: THREE.Mesh): GroupId | null => {
    const subsystem = mesh.userData.subsystem as string | undefined;
    if (!subsystem) return null;
    const armIndex = mesh.userData.armIndex as number | undefined;
    return armIndex !== undefined ? { subsystem, armIndex } : { subsystem };
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const group = groupForMesh(e.object as THREE.Mesh);
    if (group) onHoverGroup(group);
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const leavingGroup = groupForMesh(e.object as THREE.Mesh);
    if (!leavingGroup) return;
    onHoverGroup((prev: GroupId | null) =>
      groupIdsEqual(prev, leavingGroup) ? null : prev
    );
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const group = groupForMesh(e.object as THREE.Mesh);
    if (!group) return;
    const taggedGroup = groups.get(groupIdKey(group));
    if (taggedGroup) onSelectGroup(group, taggedGroup.bounds);
  };

  return (
    <group ref={landingGroupRef} position={[0, LANDING_OFFSET_Y, 0]}>
      <primitive
        object={model}
        onPointerOver={hasLanded ? handlePointerOver : undefined}
        onPointerOut={hasLanded ? handlePointerOut : undefined}
        onClick={interactive && hasLanded ? handleClick : undefined}
      />
    </group>
  );
}
