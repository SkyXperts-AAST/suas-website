"use client";

import { useEffect, useMemo, useRef, type Dispatch, type SetStateAction } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { lookupSubsystem } from "@/lib/vehicle/subsystemLookup";
import { clusterArms } from "@/lib/vehicle/armClustering";
import { groupIdKey, groupIdsEqual, type GroupId } from "@/lib/vehicle/groupId";

const MODEL_URL = "/models/skyxperts-strom-optimized.glb";
const DRACO_DECODER_PATH = "/draco/";

// The GLB's front faces away from the hero camera, so spin the model 180deg
// about Y to present its front. Applied on the scene before any bounds /
// clustering are computed (below), so framing and per-group selection stay
// consistent with what's rendered.
const MODEL_YAW = Math.PI;

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
}

export default function DroneModel({
  hoveredGroup,
  selectedGroup,
  interactive = true,
  onHoverGroup,
  onSelectGroup,
  onReady,
}: DroneModelProps) {
  const { scene } = useGLTF(MODEL_URL, DRACO_DECODER_PATH);
  const readyRef = useRef(false);

  // Clone before any transforms or tagging so the shared useGLTF cache stays
  // pristine for other pages (e.g. build-log propeller pivots).
  const { model, groups, armCenters, overallBounds } = useMemo(() => {
    const model = scene.clone(true);
    model.rotation.set(0, MODEL_YAW, 0);
    model.updateMatrixWorld(true);

    const groups = new Map<string, TaggedGroup>();
    const armMeshes: THREE.Mesh[] = [];

    model.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      // Resolve the subsystem from the owning GLTF node, not the leaf mesh name.
      // The optimized GLB deduplicates geometry, so a multi-primitive part's
      // leaf meshes are named after whatever CAD body they were merged against
      // (e.g. a payload servo's leaves inherit a motor/esc body name). GLTFLoader
      // names the parent group with the true node name, so prefer that; single-
      // primitive parts carry the node name on the mesh itself (their parent is
      // the scene root, which won't resolve).
      const info =
        (obj.parent ? lookupSubsystem(obj.parent.name) : undefined) ??
        lookupSubsystem(obj.name);
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

    const overallBounds = new THREE.Box3().setFromObject(model);

    return { model, groups, armCenters, overallBounds };
  }, [scene]);

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
    <primitive
      object={model}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={interactive ? handleClick : undefined}
    />
  );
}
