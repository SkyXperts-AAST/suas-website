import * as THREE from "three";
import { clusterArms } from "@/lib/vehicle/armClustering";
import {
  isPropellerNode,
  lookupSubsystemForNode,
} from "@/lib/vehicle/subsystemLookup";

export type PropellerSpinner = {
  pivot: THREE.Group;
  direction: number;
};

function isMotorMesh(mesh: THREE.Mesh): boolean {
  return lookupSubsystemForNode(mesh)?.key === "motor";
}

/**
 * Propeller blades spin; motor cans and mounts don't. Identified by the
 * "3402b-Propeller_*" assembly group (models/subsystem-map.json →
 * propellerGroups) rather than a hardcoded leaf-name list, which pointed at
 * the previous model's numbering and matches nothing after a CAD re-export.
 */
function isPropellerMesh(mesh: THREE.Mesh): boolean {
  return isPropellerNode(mesh);
}

function computeMeshCentroid(
  meshes: THREE.Mesh[],
  box: THREE.Box3,
): THREE.Vector3 {
  const center = new THREE.Vector3();

  for (const mesh of meshes) {
    box.setFromObject(mesh);
    center.add(box.getCenter(new THREE.Vector3()));
  }

  return center.divideScalar(meshes.length);
}

function computeShaftCenter(
  propellerMeshes: THREE.Mesh[],
  hubMeshes: THREE.Mesh[],
  box: THREE.Box3,
): THREE.Vector3 {
  const propCenter = computeMeshCentroid(propellerMeshes, box);
  const hubCenter = computeMeshCentroid(hubMeshes, box);

  // Lock spin to the vertical motor shaft: X/Z from the prop hub, Y from the motor can.
  return new THREE.Vector3(propCenter.x, hubCenter.y, propCenter.z);
}

/**
 * Builds one spin pivot per arm on the vertical motor shaft. Only propeller CAD
 * meshes spin; mounts and motor cans stay fixed on the airframe.
 */
export function setupPropellerSpinners(model: THREE.Object3D): PropellerSpinner[] {
  const motorMeshes: THREE.Mesh[] = [];

  model.traverse((obj) => {
    if (obj instanceof THREE.Mesh && isMotorMesh(obj)) {
      motorMeshes.push(obj);
    }
  });

  if (motorMeshes.length === 0) {
    return [];
  }

  const { armIndexByMesh } = clusterArms(motorMeshes);
  const box = new THREE.Box3();

  const byArm = new Map<number, THREE.Mesh[]>();
  for (const mesh of motorMeshes) {
    const arm = armIndexByMesh.get(mesh) ?? 0;
    const armMeshes = byArm.get(arm) ?? [];
    armMeshes.push(mesh);
    byArm.set(arm, armMeshes);
  }

  const spinners: PropellerSpinner[] = [];

  for (const [armIndex, armMeshes] of byArm.entries()) {
    const hubMeshes = armMeshes.filter((mesh) => !isPropellerMesh(mesh));
    const propellerMeshes = armMeshes.filter((mesh) => isPropellerMesh(mesh));

    if (propellerMeshes.length === 0 || hubMeshes.length === 0) {
      continue;
    }

    const shaftCenter = computeShaftCenter(propellerMeshes, hubMeshes, box);

    // `shaftCenter` is a world-space point, but the pivot is parented under
    // `model` and its `position` is interpreted in `model`'s local space.
    // Those coincide only when `model` itself has an identity transform; if
    // it's rotated (as DroneModel's is, 180° about Y), assigning the raw
    // world point directly places the pivot's rotation axis on the opposite
    // side of the model, so spinning it sweeps the propeller across the
    // whole scene instead of spinning it in place. Converting through
    // `model`'s current matrixWorld keeps this correct for any caller.
    const pivot = new THREE.Group();
    pivot.position.copy(model.worldToLocal(shaftCenter.clone()));
    model.add(pivot);

    for (const mesh of propellerMeshes) {
      pivot.attach(mesh);
    }

    spinners.push({
      pivot,
      direction: armIndex % 2 === 0 ? 1 : -1,
    });
  }

  return spinners;
}

export function spinPropellerPivot(
  pivot: THREE.Group,
  direction: number,
  speed: number,
  delta: number,
) {
  // Spin around the pivot's local Y axis (vertical motor shaft in model space).
  pivot.rotation.y += direction * speed * delta;
}
