"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { lookupSubsystemForNode } from "@/lib/vehicle/subsystemLookup";
import { clusterArms } from "@/lib/vehicle/armClustering";
import {
  assemblyProgressForGroup,
  type AssemblyScrollApi,
} from "@/lib/vehicle/assemblyOrder";

const MODEL_URL = "/models/storm-final-optimized-v4.glb";
const DRACO_DECODER_PATH = "/draco/";
const MODEL_YAW = Math.PI;
const ARM_SUBSYSTEMS = new Set(["motor"]);

const FALLBACK_DIRECTIONS: Record<string, THREE.Vector3> = {
  avionicsHousing: new THREE.Vector3(0, 1, 0.15),
  battery: new THREE.Vector3(0, 1, 0),
  esc: new THREE.Vector3(0.5, 0.25, 0.5),
  companionComputer: new THREE.Vector3(-0.6, 0.35, 0.15),
  camera: new THREE.Vector3(0, -0.35, 1),
  payload: new THREE.Vector3(0, -1, 0.15),
};

useGLTF.preload(MODEL_URL, DRACO_DECODER_PATH);

interface ExplodePart {
  group: THREE.Group;
  direction: THREE.Vector3;
  distance: number;
  key: string;
  /** Mid-flight lift axis (root-local). */
  arcAxis: THREE.Vector3;
  /** Peak arc offset at t = 0.5. */
  arcStrength: number;
}

interface DroneAssemblyModelProps {
  scrollApi: AssemblyScrollApi;
  reducedMotion?: boolean;
}

function AssemblyCamera({ radius }: { radius: number }) {
  const { camera } = useThree();

  useLayoutEffect(() => {
    const dist = Math.max(radius * 2.8, 0.8);
    camera.position.set(dist * 0.62, dist * 0.72, dist * 0.38);
    camera.lookAt(0, 0, 0);
    if ("updateProjectionMatrix" in camera) {
      camera.updateProjectionMatrix();
    }
  }, [camera, radius]);

  return null;
}

function refineDirection(key: string, direction: THREE.Vector3): THREE.Vector3 {
  const dir = direction.clone();

  if (key.startsWith("motor:")) {
    dir.y *= 0.1;
    if (dir.lengthSq() > 1e-5) return dir.normalize();
    return new THREE.Vector3(1, 0, 0);
  }

  if (key === "battery" || key === "avionicsHousing") {
    dir.y = Math.max(dir.y, 0.65);
    dir.x *= 0.35;
    dir.z *= 0.35;
    return dir.normalize();
  }

  if (key === "camera" || key === "payload") {
    dir.y = Math.min(dir.y, -0.45);
    return dir.normalize();
  }

  if (key === "esc" || key === "companionComputer") {
    dir.y *= 0.45;
    return dir.normalize();
  }

  return dir;
}

function arcForPart(
  key: string,
  direction: THREE.Vector3,
  fitRadius: number
): { axis: THREE.Vector3; strength: number } {
  if (key === "camera" || key === "payload") {
    return {
      axis: new THREE.Vector3(0, 1, 0),
      strength: fitRadius * 1.15,
    };
  }

  if (key === "battery") {
    return {
      axis: new THREE.Vector3(0, 1, 0),
      strength: fitRadius * 0.55,
    };
  }

  if (key.startsWith("motor:")) {
    return {
      axis: new THREE.Vector3(0, 0.65, 0),
      strength: fitRadius * 0.42,
    };
  }

  if (key === "avionicsHousing") {
    return {
      axis: new THREE.Vector3(0, 1, 0),
      strength: fitRadius * 0.38,
    };
  }

  const sideways = new THREE.Vector3(-direction.z, 0.35, direction.x);
  if (sideways.lengthSq() < 1e-5) sideways.set(1, 0.35, 0);
  sideways.normalize();

  return { axis: sideways, strength: fitRadius * 0.48 };
}

function explodeDistanceForKey(key: string, fitRadius: number): number {
  if (key.startsWith("motor:")) return fitRadius * 2.6;
  if (key === "battery") return fitRadius * 2.2;
  if (key === "camera" || key === "payload") return fitRadius * 2.0;
  if (key === "avionicsHousing") return fitRadius * 1.7;
  return fitRadius * 1.8;
}

function buildExplodedModel(scene: THREE.Group) {
  const source = scene.clone(true);
  source.rotation.y = MODEL_YAW;
  source.updateMatrixWorld(true);

  const taggedMeshes: Array<{ mesh: THREE.Mesh; key: string }> = [];
  const untaggedMeshes: THREE.Mesh[] = [];
  const armMeshes: THREE.Mesh[] = [];

  source.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    const info = lookupSubsystemForNode(obj);
    if (!info) {
      untaggedMeshes.push(obj);
      return;
    }

    obj.userData.subsystem = info.key;
    if (ARM_SUBSYSTEMS.has(info.key)) {
      armMeshes.push(obj);
    } else {
      taggedMeshes.push({ mesh: obj, key: info.key });
    }
  });

  const { armIndexByMesh } = clusterArms(armMeshes);
  for (const mesh of armMeshes) {
    const armIndex = armIndexByMesh.get(mesh) ?? 0;
    taggedMeshes.push({
      mesh,
      key: `${mesh.userData.subsystem as string}:${armIndex}`,
    });
  }

  const root = new THREE.Group();
  root.name = "assembly-root";

  const chassis = new THREE.Group();
  chassis.name = "chassis";
  root.add(chassis);
  for (const mesh of untaggedMeshes) {
    chassis.attach(mesh);
  }

  const groupsByKey = new Map<string, THREE.Group>();
  for (const { mesh, key } of taggedMeshes) {
    let group = groupsByKey.get(key);
    if (!group) {
      group = new THREE.Group();
      group.name = key;
      groupsByKey.set(key, group);
      root.add(group);
    }
    group.attach(mesh);
  }

  root.rotation.y = MODEL_YAW;
  root.updateMatrixWorld(true);

  const bounds = new THREE.Box3().setFromObject(root);
  const center = bounds.getCenter(new THREE.Vector3());
  root.position.sub(center);
  root.updateMatrixWorld(true);

  const fitBounds = new THREE.Box3().setFromObject(root);
  const fitSize = fitBounds.getSize(new THREE.Vector3());
  const fitRadius = Math.max(fitSize.x, fitSize.y, fitSize.z) * 0.5;

  const parts: ExplodePart[] = [];
  for (const [key, group] of groupsByKey) {
    const groupBounds = new THREE.Box3().setFromObject(group);
    const groupCenter = groupBounds.getCenter(new THREE.Vector3());
    root.worldToLocal(groupCenter);

    let direction: THREE.Vector3;
    if (groupCenter.lengthSq() > 1e-5) {
      direction = refineDirection(key, groupCenter.normalize());
    } else {
      const fallback = FALLBACK_DIRECTIONS[key];
      direction = refineDirection(
        key,
        fallback ? fallback.clone() : new THREE.Vector3(0, 1, 0)
      );
    }

    const { axis, strength } = arcForPart(key, direction, fitRadius);

    parts.push({
      group,
      direction,
      distance: explodeDistanceForKey(key, fitRadius),
      key,
      arcAxis: axis,
      arcStrength: strength,
    });
  }

  return { root, parts, fitRadius };
}

function applyExplode(parts: ExplodePart[], progress: number, root: THREE.Group) {
  const pos = new THREE.Vector3();

  for (const part of parts) {
    const t = assemblyProgressForGroup(progress, part.key);
    const explodeFactor = 1 - t;

    pos.copy(part.direction).multiplyScalar(part.distance * explodeFactor);

    // sin(π·t): 0 at exploded/assembled, peaks mid-flight — swings over the airframe.
    const arcLift = Math.sin(t * Math.PI) * part.arcStrength * explodeFactor;
    pos.addScaledVector(part.arcAxis, arcLift);

    part.group.position.copy(pos);
  }
  root.updateMatrixWorld(true);
}

export default function DroneAssemblyModel({
  scrollApi,
  reducedMotion = false,
}: DroneAssemblyModelProps) {
  const { scene } = useGLTF(MODEL_URL, DRACO_DECODER_PATH);
  const rootRef = useRef<THREE.Group | null>(null);
  const partsRef = useRef<ExplodePart[]>([]);
  const fitRadiusRef = useRef(0.5);

  const built = useMemo(() => buildExplodedModel(scene), [scene]);

  useLayoutEffect(() => {
    rootRef.current = built.root;
    partsRef.current = built.parts;
    fitRadiusRef.current = built.fitRadius;
    applyExplode(
      built.parts,
      reducedMotion ? 1 : scrollApi.progress,
      built.root
    );
  }, [built, reducedMotion, scrollApi]);

  useFrame(() => {
    const root = rootRef.current;
    const parts = partsRef.current;
    if (!root || parts.length === 0) return;

    const progress = reducedMotion ? 1 : scrollApi.progress;
    applyExplode(parts, progress, root);
  });

  return (
    <>
      <AssemblyCamera radius={fitRadiusRef.current} />
      <primitive object={built.root} />
    </>
  );
}
