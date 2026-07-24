import * as THREE from "three";

/** Horizontal plane height for screen-ray → world target intersection. */
export const TEAM_AIM_PLANE_Y = 0;

/**
 * Nose direction in rig-local space (native +X forward, after the π correction
 * child group this aligns the front toward the aim target).
 */
export const RIG_NOSE_AXIS = new THREE.Vector3(1, 0, 0);

const _ndc = new THREE.Vector2();
const _raycaster = new THREE.Raycaster();
const _plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -TEAM_AIM_PLANE_Y);
const _direction = new THREE.Vector3();

/**
 * Cast a screen-space point through the canvas camera onto the team-aim plane.
 * Returns null when the ray is parallel to the plane.
 */
export function raycastScreenToTeamAimPlane(
  screenX: number,
  screenY: number,
  canvasRect: DOMRectReadOnly,
  camera: THREE.Camera,
  target = new THREE.Vector3(),
): THREE.Vector3 | null {
  _ndc.set(
    ((screenX - canvasRect.left) / canvasRect.width) * 2 - 1,
    -((screenY - canvasRect.top) / canvasRect.height) * 2 + 1,
  );
  _raycaster.setFromCamera(_ndc, camera);
  return _raycaster.ray.intersectPlane(_plane, target) ? target : null;
}

/** Quaternion rotating the rig nose to point at a world-space target. */
export function computeDroneAimQuaternion(
  dronePosition: THREE.Vector3,
  targetPosition: THREE.Vector3,
  target = new THREE.Quaternion(),
): THREE.Quaternion {
  _direction.copy(targetPosition).sub(dronePosition);

  if (_direction.lengthSq() < 1e-6) {
    return target.identity();
  }

  _direction.normalize();
  return target.setFromUnitVectors(RIG_NOSE_AXIS, _direction);
}
