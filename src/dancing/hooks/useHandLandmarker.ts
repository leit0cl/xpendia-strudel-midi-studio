import { useEffect, useRef } from 'react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { useAR } from '../context/ARContext';

const WASM_PATH =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm';
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';

export function useHandLandmarker(enabled: boolean) {
  const { videoRef, pushHandFrame } = useAR();
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef(-1);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    (async () => {
      try {
        const fileset = await FilesetResolver.forVisionTasks(WASM_PATH);
        if (cancelled) return;
        const landmarker = await HandLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
          runningMode: 'VIDEO',
          numHands: 2,
        });
        if (cancelled) {
          landmarker.close();
          return;
        }
        landmarkerRef.current = landmarker;
        loop();
      } catch {
        /* hand tracking is optional — fail silently */
      }
    })();

    function loop() {
      const video = videoRef.current;
      const lm = landmarkerRef.current;
      if (!video || !lm) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      if (
        video.readyState >= 2 &&
        video.currentTime !== lastVideoTimeRef.current
      ) {
        lastVideoTimeRef.current = video.currentTime;
        const ts = performance.now();
        try {
          const res = lm.detectForVideo(video, ts);
          const hands = (res.landmarks ?? []).map((lms, i) => ({
            landmarks: lms.map((p) => ({ x: p.x, y: p.y, z: p.z })),
            handedness: res.handedness?.[i]?.[0]?.categoryName ?? 'Right',
          }));
          pushHandFrame({
            hands,
            timestamp: ts,
            detected: hands.length > 0,
          });
        } catch {
          /* swallow per-frame errors */
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    }

    return () => {
      cancelled = true;
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
    };
  }, [enabled, videoRef, pushHandFrame]);
}
