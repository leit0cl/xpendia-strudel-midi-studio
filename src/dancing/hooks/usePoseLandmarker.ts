import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { useAR } from '../context/ARContext';

const WASM_PATH =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm';
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';

export function usePoseLandmarker(enabled: boolean) {
  const { t } = useTranslation();
  const { videoRef, pushPoseFrame, setStatus, setError } = useAR();
  const landmarkerRef = useRef<PoseLandmarker | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef(-1);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    (async () => {
      try {
        const fileset = await FilesetResolver.forVisionTasks(WASM_PATH);
        if (cancelled) return;
        const landmarker = await PoseLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
          runningMode: 'VIDEO',
          numPoses: 1,
        });
        if (cancelled) {
          landmarker.close();
          return;
        }
        landmarkerRef.current = landmarker;
        setStatus('tracking');
        loop();
      } catch (e) {
        const msg = e instanceof Error ? e.message : t('errors.pose_failed');
        setError(msg);
        setStatus('error');
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
          const lms = res.landmarks?.[0] ?? null;
          const wlms = res.worldLandmarks?.[0] ?? null;
          pushPoseFrame({
            landmarks: lms
              ? lms.map((p) => ({
                  x: p.x,
                  y: p.y,
                  z: p.z,
                  visibility: p.visibility ?? 0,
                }))
              : null,
            worldLandmarks: wlms
              ? wlms.map((p) => ({
                  x: p.x,
                  y: p.y,
                  z: p.z,
                  visibility: p.visibility ?? 0,
                }))
              : null,
            timestamp: ts,
            detected: !!lms,
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
  }, [enabled, videoRef, pushPoseFrame, setStatus, setError, t]);
}
