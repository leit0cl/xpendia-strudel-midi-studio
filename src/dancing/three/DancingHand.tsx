import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useAR, type HandData } from '../context/ARContext';
import { projectLandmark, setBone } from './poseUtils';

const BONES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [9, 10], [10, 11], [11, 12],
  [13, 14], [14, 15], [15, 16],
  [0, 17], [17, 18], [18, 19], [19, 20],
  [5, 9], [9, 13], [13, 17],
];

const JOINT_RADIUS = [
  0.9,
  0.6, 0.55, 0.5, 0.45,
  0.65, 0.55, 0.5, 0.45,
  0.65, 0.55, 0.5, 0.45,
  0.65, 0.55, 0.5, 0.45,
  0.65, 0.55, 0.5, 0.45,
];

const NEON_YELLOW = '#FFD300';

interface DancingHandProps {
  side: 'Left' | 'Right';
}

export function DancingHand({ side }: DancingHandProps) {
  const { handFrame, mirror, poseSmoothedRef } = useAR();
  const groupRef = useRef<THREE.Group>(null);
  const jointRefs = useRef<(THREE.Mesh | null)[]>([]);
  const boneRefs = useRef<(THREE.Mesh | null)[]>([]);

  const smoothed = useMemo(
    () => Array.from({ length: 21 }, () => new THREE.Vector3()),
    [],
  );
  const target = useMemo(() => new THREE.Vector3(), []);
  const offset = useMemo(() => new THREE.Vector3(), []);
  const tmpDir = useMemo(() => new THREE.Vector3(), []);

  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: NEON_YELLOW,
        emissive: NEON_YELLOW,
        emissiveIntensity: 1.5,
        roughness: 0.35,
        metalness: 0.25,
        toneMapped: false,
      }),
    [],
  );

  useFrame((_, dt) => {
    const g = groupRef.current;
    if (!g) return;

    const hand = handFrame.hands.find((h) => h.handedness === side) as
      | HandData
      | undefined;

    if (!hand) {
      g.visible = false;
      return;
    }
    g.visible = true;

    const wristIdx = side === 'Left' ? 15 : 16;
    const anchor = poseSmoothedRef.current[wristIdx];
    const baseDepth = -anchor.z;

    projectLandmark(target, hand.landmarks[0], mirror, baseDepth, 0);
    offset.copy(anchor).sub(target);

    const t = 1 - Math.exp(-22 * dt);
    for (let i = 0; i < 21; i++) {
      projectLandmark(target, hand.landmarks[i], mirror, baseDepth);
      target.add(offset);
      smoothed[i].lerp(target, t);
    }

    for (let i = 0; i < 21; i++) {
      const m = jointRefs.current[i];
      if (m) m.position.copy(smoothed[i]);
    }
    for (let i = 0; i < BONES.length; i++) {
      const [a, b] = BONES[i];
      const m = boneRefs.current[i];
      if (!m) continue;
      setBone(m, smoothed[a], smoothed[b], 0.35, tmpDir);
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 21 }, (_, i) => (
        <mesh
          key={`j-${i}`}
          ref={(el) => {
            jointRefs.current[i] = el;
          }}
          material={mat}
        >
          <sphereGeometry args={[JOINT_RADIUS[i], 12, 12]} />
        </mesh>
      ))}
      {BONES.map((_, i) => (
        <mesh
          key={`b-${i}`}
          ref={(el) => {
            boneRefs.current[i] = el;
          }}
          material={mat}
        >
          <cylinderGeometry args={[1, 1, 1, 10, 1, true]} />
        </mesh>
      ))}
    </group>
  );
}
