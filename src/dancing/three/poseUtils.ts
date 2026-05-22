import * as THREE from 'three';

export const PROJ_FOV = (52 * Math.PI) / 180;
export const PROJ_ASPECT = 16 / 9;
export const BASE_DEPTH = 160;

const UP = new THREE.Vector3(0, 1, 0);

export function projectLandmark(
  out: THREE.Vector3,
  p: { x: number; y: number; z: number },
  mirror: boolean,
  baseDepth: number = BASE_DEPTH,
  zScale: number = 50,
): THREE.Vector3 {
  const depth = baseDepth + p.z * zScale;
  const cx = mirror ? -(2 * p.x - 1) : 2 * p.x - 1;
  const cy = 1 - 2 * p.y;
  const tanY = Math.tan(PROJ_FOV / 2);
  out.set(cx * tanY * PROJ_ASPECT * depth, cy * tanY * depth, -depth);
  return out;
}

export function setBone(
  mesh: THREE.Mesh,
  from: THREE.Vector3,
  to: THREE.Vector3,
  radius: number,
  tmp: THREE.Vector3,
): void {
  tmp.subVectors(to, from);
  const len = tmp.length();
  if (len < 0.0001) {
    mesh.visible = false;
    return;
  }
  mesh.visible = true;
  mesh.position.copy(from).addScaledVector(tmp, 0.5);
  mesh.scale.set(radius, len, radius);
  mesh.quaternion.setFromUnitVectors(UP, tmp.normalize());
}
