import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useAR } from '../context/ARContext';
import { projectLandmark, setBone } from './poseUtils';

type Zone = 'torso' | 'arm' | 'leg' | 'foot' | 'face';

const NEON = {
  head: '#00BFFF',
  torso: '#FF2EC4',
  arm: '#11FA8F',
  leg: '#FF7357',
  foot: '#FF1B6B',
  face: '#B388FF',
  joint: '#FFFFFF',
} as const;

const BONE_GROUPS: { zone: Zone; thickness: number; bones: [number, number][] }[] = [
  { zone: 'torso', thickness: 2.2, bones: [[11, 12], [11, 23], [12, 24], [23, 24]] },
  { zone: 'arm', thickness: 1.5, bones: [[11, 13], [12, 14]] },
  { zone: 'arm', thickness: 1.2, bones: [[13, 15], [14, 16]] },
  { zone: 'leg', thickness: 1.9, bones: [[23, 25], [24, 26]] },
  { zone: 'leg', thickness: 1.5, bones: [[25, 27], [26, 28]] },
  {
    zone: 'foot',
    thickness: 0.9,
    bones: [
      [27, 29], [27, 31], [29, 31],
      [28, 30], [28, 32], [30, 32],
    ],
  },
];

interface FlatBone {
  from: number;
  to: number;
  thickness: number;
  zone: Zone;
}
const FLAT_BONES: FlatBone[] = BONE_GROUPS.flatMap((g) =>
  g.bones.map(([a, b]) => ({ from: a, to: b, thickness: g.thickness, zone: g.zone })),
);

const JOINT_SIZES: number[] = [
  0,
  0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7,
  0.6, 0.6,
  1.8, 1.8,
  1.4, 1.4,
  1.2, 1.2,
  0.7, 0.7, 0.7, 0.7, 0.7, 0.7,
  1.8, 1.8,
  1.5, 1.5,
  1.3, 1.3,
  0.9, 0.9, 0.9, 0.9,
];

const POSE_HAND_LANDMARKS = new Set([17, 18, 19, 20, 21, 22]);
const VISIBILITY_THRESHOLD = 0.5;

interface PoseSkeletonProps {
  hideHands?: boolean;
}

export function PoseSkeleton({ hideHands = false }: PoseSkeletonProps) {
  const { poseFrame, mirror, poseSmoothedRef } = useAR();

  const jointRefs = useRef<(THREE.Mesh | null)[]>([]);
  const boneRefs = useRef<(THREE.Mesh | null)[]>([]);
  const headRef = useRef<THREE.Mesh>(null);
  const neckRef = useRef<THREE.Mesh>(null);

  const smoothed = poseSmoothedRef.current;
  const target = useMemo(() => new THREE.Vector3(), []);
  const tmpDir = useMemo(() => new THREE.Vector3(), []);
  const tmpMid = useMemo(() => new THREE.Vector3(), []);

  const zoneMats = useMemo(() => {
    const make = (color: string, intensity = 1.4) =>
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: intensity,
        roughness: 0.35,
        metalness: 0.25,
        toneMapped: false,
      });
    return {
      torso: make(NEON.torso),
      arm: make(NEON.arm),
      leg: make(NEON.leg),
      foot: make(NEON.foot),
      face: make(NEON.face, 0.9),
      head: make(NEON.head, 1.2),
      joint: make(NEON.joint, 1.6),
    };
  }, []);

  useFrame((_, dt) => {
    const lms = poseFrame.landmarks;
    if (!lms) return;
    const t = 1 - Math.exp(-18 * dt);

    for (let i = 0; i < 33 && i < lms.length; i++) {
      projectLandmark(target, lms[i], mirror);
      smoothed[i].lerp(target, t);
    }

    const vis = (i: number) =>
      (lms[i]?.visibility ?? 0) > VISIBILITY_THRESHOLD;

    for (let i = 0; i < 33; i++) {
      const m = jointRefs.current[i];
      if (!m) continue;
      const size = JOINT_SIZES[i] ?? 0;
      if (size <= 0) {
        m.visible = false;
        continue;
      }
      const hideAsPoseHand = hideHands && POSE_HAND_LANDMARKS.has(i);
      m.position.copy(smoothed[i]);
      m.visible = !hideAsPoseHand && vis(i);
    }

    for (let i = 0; i < FLAT_BONES.length; i++) {
      const { from, to, thickness } = FLAT_BONES[i];
      const m = boneRefs.current[i];
      if (!m) continue;
      if (!vis(from) || !vis(to)) {
        m.visible = false;
        continue;
      }
      setBone(m, smoothed[from], smoothed[to], thickness, tmpDir);
    }

    const head = headRef.current;
    if (head) {
      if (vis(7) && vis(8)) {
        tmpMid.copy(smoothed[7]).add(smoothed[8]).multiplyScalar(0.5);
        head.position.copy(tmpMid);
        head.visible = true;
        const ear = smoothed[7].distanceTo(smoothed[8]);
        const r = THREE.MathUtils.clamp(ear * 0.65, 3, 18);
        head.scale.setScalar(r);
      } else if (vis(0)) {
        head.position.copy(smoothed[0]);
        head.visible = true;
        head.scale.setScalar(4);
      } else {
        head.visible = false;
      }
    }

    const neck = neckRef.current;
    if (neck && head) {
      if (vis(11) && vis(12) && head.visible) {
        tmpMid.copy(smoothed[11]).add(smoothed[12]).multiplyScalar(0.5);
        setBone(neck, head.position, tmpMid, 1.3, tmpDir);
      } else {
        neck.visible = false;
      }
    }
  });

  return (
    <group>
      <mesh ref={headRef} material={zoneMats.head}>
        <sphereGeometry args={[1, 24, 24]} />
      </mesh>
      <mesh ref={neckRef} material={zoneMats.torso}>
        <cylinderGeometry args={[1, 1, 1, 12, 1, true]} />
      </mesh>
      {FLAT_BONES.map((b, i) => (
        <mesh
          key={`b-${i}`}
          ref={(el) => {
            boneRefs.current[i] = el;
          }}
          material={zoneMats[b.zone]}
        >
          <cylinderGeometry args={[1, 1, 1, 12, 1, true]} />
        </mesh>
      ))}
      {Array.from({ length: 33 }, (_, i) => (
        <mesh
          key={`j-${i}`}
          ref={(el) => {
            jointRefs.current[i] = el;
          }}
          material={zoneMats.joint}
        >
          <sphereGeometry args={[JOINT_SIZES[i] || 0.5, 14, 14]} />
        </mesh>
      ))}
    </group>
  );
}
