import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import * as THREE from 'three';

export type ARStatus = 'idle' | 'requesting' | 'ready' | 'tracking' | 'error';

export interface HandData {
  landmarks: { x: number; y: number; z: number }[];
  handedness: string;
}

export interface HandFrame {
  hands: HandData[];
  timestamp: number;
  detected: boolean;
}

export interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

export interface PoseFrame {
  landmarks: PoseLandmark[] | null;
  worldLandmarks: PoseLandmark[] | null;
  timestamp: number;
  detected: boolean;
}

interface ARContextValue {
  status: ARStatus;
  setStatus: (s: ARStatus) => void;
  error: string | null;
  setError: (e: string | null) => void;

  videoRef: React.RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  setStream: (s: MediaStream | null) => void;

  handFrame: HandFrame;
  pushHandFrame: (f: HandFrame) => void;

  poseFrame: PoseFrame;
  pushPoseFrame: (f: PoseFrame) => void;

  poseSmoothedRef: React.RefObject<THREE.Vector3[]>;

  mirror: boolean;
}

const ARContext = createContext<ARContextValue | null>(null);

const DEFAULT_HAND_FRAME: HandFrame = {
  hands: [],
  timestamp: 0,
  detected: false,
};

const DEFAULT_POSE_FRAME: PoseFrame = {
  landmarks: null,
  worldLandmarks: null,
  timestamp: 0,
  detected: false,
};

export function ARProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ARStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [handFrame, setHandFrame] = useState<HandFrame>(DEFAULT_HAND_FRAME);
  const [poseFrame, setPoseFrame] = useState<PoseFrame>(DEFAULT_POSE_FRAME);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const poseSmoothedRef = useRef<THREE.Vector3[]>(
    Array.from({ length: 33 }, () => new THREE.Vector3(0, 0, -160)),
  );

  const pushHandFrame = useCallback((f: HandFrame) => setHandFrame(f), []);
  const pushPoseFrame = useCallback((f: PoseFrame) => setPoseFrame(f), []);

  const value = useMemo<ARContextValue>(
    () => ({
      status,
      setStatus,
      error,
      setError,
      videoRef,
      stream,
      setStream,
      handFrame,
      pushHandFrame,
      poseFrame,
      pushPoseFrame,
      poseSmoothedRef,
      mirror: true,
    }),
    [status, error, handFrame, poseFrame, stream, pushHandFrame, pushPoseFrame],
  );

  return <ARContext.Provider value={value}>{children}</ARContext.Provider>;
}

export function useAR() {
  const ctx = useContext(ARContext);
  if (!ctx) throw new Error('useAR must be used within ARProvider');
  return ctx;
}
