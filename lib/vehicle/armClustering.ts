import * as THREE from "three";

export interface ArmClusterResult {
  armIndexByMesh: Map<THREE.Object3D, number>;
  /** World-space centroid of each arm cluster, ordered by armIndex. */
  armCenters: THREE.Vector3[];
}

/**
 * Groups meshes into the 4 physical arms of the quadcopter. The subsystem map
 * only knows a flat bucket, so arms are inferred from geometry: mesh
 * bounding-box centers are clustered in the horizontal (X-Z) plane with k-means
 * (k=4).
 *
 * The seeding is the important part. A quadcopter's arms are radially symmetric
 * but their angular *offset* is unknown — this model's arms sit on the diagonals
 * (~45/135/225/315), so seeding at a fixed 0/90/180/270 lands every seed
 * *between* two arms and collapses the clustering (two arms merge, others
 * starve). Instead we detect the offset from the data: the arms dominate the
 * outer ring, and averaging their angles times 4 recovers the offset modulo
 * 90 degrees (a circular mean). Seeding at the detected offset makes k-means
 * converge to the 4 true arms. Arm indices are then renumbered by angle
 * (clockwise from +X) for stable, predictable numbering.
 */
export function clusterArms(meshes: THREE.Object3D[]): ArmClusterResult {
  if (meshes.length === 0) {
    return { armIndexByMesh: new Map(), armCenters: [] };
  }

  const box = new THREE.Box3();
  const points = meshes.map((mesh) => {
    box.setFromObject(mesh);
    return box.getCenter(new THREE.Vector3());
  });

  const overallCenter = new THREE.Vector3();
  for (const p of points) overallCenter.add(p);
  overallCenter.divideScalar(points.length);

  const k = 4;
  const radii = points.map((p) =>
    Math.hypot(p.x - overallCenter.x, p.z - overallCenter.z)
  );
  const avgRadius = radii.reduce((a, b) => a + b, 0) / radii.length;
  const medianRadius = [...radii].sort((a, b) => a - b)[radii.length >> 1];

  // Detect the arms' angular offset via the circular mean of (angle * 4),
  // using only the outer ring so near-center parts don't add noise.
  let sinSum = 0;
  let cosSum = 0;
  for (let i = 0; i < points.length; i++) {
    if (radii[i] < medianRadius) continue;
    const angle =
      Math.atan2(points[i].z - overallCenter.z, points[i].x - overallCenter.x) * 4;
    sinSum += Math.sin(angle);
    cosSum += Math.cos(angle);
  }
  const offset = Math.atan2(sinSum, cosSum) / 4;

  const centroids: THREE.Vector3[] = Array.from({ length: k }, (_, i) => {
    const angle = offset + (i / k) * Math.PI * 2;
    return new THREE.Vector3(
      overallCenter.x + Math.cos(angle) * avgRadius,
      overallCenter.y,
      overallCenter.z + Math.sin(angle) * avgRadius
    );
  });

  const assignments = new Array<number>(points.length).fill(0);

  for (let iter = 0; iter < 20; iter++) {
    for (let i = 0; i < points.length; i++) {
      let best = 0;
      let bestDist = Infinity;
      for (let c = 0; c < k; c++) {
        const dist = Math.hypot(
          points[i].x - centroids[c].x,
          points[i].z - centroids[c].z
        );
        if (dist < bestDist) {
          bestDist = dist;
          best = c;
        }
      }
      assignments[i] = best;
    }

    const sums = Array.from({ length: k }, () => new THREE.Vector3());
    const counts = new Array(k).fill(0);
    for (let i = 0; i < points.length; i++) {
      sums[assignments[i]].add(points[i]);
      counts[assignments[i]]++;
    }
    for (let c = 0; c < k; c++) {
      if (counts[c] > 0) {
        centroids[c] = sums[c].divideScalar(counts[c]);
      }
    }
  }

  // Renumber clusters by angle around the overall center (clockwise from +X)
  // so arm 0/1/2/3 is stable and doesn't depend on k-means iteration order.
  const order = centroids
    .map((c, idx) => ({
      idx,
      angle: Math.atan2(c.z - overallCenter.z, c.x - overallCenter.x),
    }))
    .sort((a, b) => a.angle - b.angle)
    .map((e) => e.idx);
  const remap = new Map<number, number>();
  order.forEach((originalIdx, newIdx) => remap.set(originalIdx, newIdx));

  const armIndexByMesh = new Map<THREE.Object3D, number>();
  meshes.forEach((mesh, i) => {
    armIndexByMesh.set(mesh, remap.get(assignments[i])!);
  });

  const armCenters: THREE.Vector3[] = new Array(k);
  order.forEach((originalIdx, newIdx) => {
    armCenters[newIdx] = centroids[originalIdx];
  });

  return { armIndexByMesh, armCenters };
}
