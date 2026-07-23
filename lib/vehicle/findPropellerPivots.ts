import * as THREE from "three";
import { clusterArms } from "@/lib/vehicle/armClustering";
import { lookupSubsystem } from "@/lib/vehicle/subsystemLookup";

export type PropellerSpinner = {
  pivot: THREE.Group;
  direction: number;
};

// Propeller-only CAD leaves from subsystem-map motor bucket (3402b-Propeller_*).
const PROPELLER_MESH_NAMES = new Set(
  [
    "Body1.126",
    "Body1.127",
    "Body1.128",
    "Body1.129",
    "Body1.130",
    "Body1.131",
    "Body1.132",
    "Body1.133",
    "Body1.134",
    "Body1.135",
    "Body1.136",
    "Body1.137",
    "Body1.138",
    "Body1.139",
    "Body1.140",
    "Body1.141",
  ].map(normalizeMeshName),
);


function normalizeMeshName(name: string): string {
  return name.replace(/[[\].:/]/g, "").replace(/_\d+$/, "");
}

function isMotorMesh(mesh: THREE.Mesh): boolean {
  const info =
    (mesh.parent ? lookupSubsystem(mesh.parent.name) : undefined) ??
    lookupSubsystem(mesh.name);
  return info?.key === "motor";
}

function isPropellerMesh(mesh: THREE.Mesh): boolean {
  return (
    PROPELLER_MESH_NAMES.has(normalizeMeshName(mesh.name)) ||
    (mesh.parent
      ? PROPELLER_MESH_NAMES.has(normalizeMeshName(mesh.parent.name))
      : false)
  );
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

    const pivot = new THREE.Group();
    pivot.position.copy(shaftCenter);
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
