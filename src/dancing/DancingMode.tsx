import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { ARProvider, useAR } from './context/ARContext';
import { useWebcam } from './hooks/useWebcam';
import { usePoseLandmarker } from './hooks/usePoseLandmarker';
import { useHandLandmarker } from './hooks/useHandLandmarker';
import { PoseSkeleton } from './three/PoseSkeleton';
import { DancingHand } from './three/DancingHand';
import { CameraPermissionCard } from './CameraPermissionCard';
import { LoadingOverlay } from './LoadingOverlay';
import { AudioWaveBand } from './AudioWaveBand';

function HiddenVideo() {
  const { videoRef, stream } = useAR();
  const localRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = localRef.current;
    if (!v) return;
    videoRef.current = v;
    if (stream) {
      v.srcObject = stream;
      v.play().catch(() => {});
    }
  }, [stream, videoRef]);
  return (
    <video
      ref={localRef}
      autoPlay
      playsInline
      muted
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        opacity: 0,
        pointerEvents: 'none',
      }}
    />
  );
}

function DancingScene({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const { status, error, stream } = useAR();
  const { start, stop } = useWebcam();

  const trackerEnabled = status === 'ready' || status === 'tracking';
  usePoseLandmarker(trackerEnabled);
  useHandLandmarker(trackerEnabled);

  // Stop camera when component unmounts
  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    stop();
    onClose();
  };

  return (
    <div className="dancing-overlay">
      <HiddenVideo />

      <Canvas
        camera={{ position: [0, 0, 0], fov: 52, near: 1, far: 2000 }}
        gl={{ alpha: false, antialias: true }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <color attach="background" args={['#04070b']} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[80, 200, 100]} intensity={0.5} />

        <PoseSkeleton hideHands />
        <DancingHand side="Left" />
        <DancingHand side="Right" />

        <EffectComposer>
          <Bloom
            mipmapBlur
            intensity={1.6}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.4}
            radius={0.9}
          />
        </EffectComposer>
      </Canvas>

      <div className="dancing-header">
        <div className="dancing-brand">
          <span className="lab-tag">💃 {t('dancing.permission_title')}</span>
          <span className="dancing-status">
            {status === 'tracking' ? t('dancing.live_label') : status.toUpperCase()}
          </span>
        </div>
        <button
          className="dancing-close"
          onClick={handleClose}
          aria-label={t('dancing.close_aria')}
          title={t('common.close')}
        >
          ✕
        </button>
      </div>

      <div className="dancing-wave">
        <AudioWaveBand />
      </div>

      <div className="dancing-footer">
        <a
          href="https://xpendia.cl"
          target="_blank"
          rel="noopener noreferrer"
        >
          xpendia.cl
        </a>
      </div>

      {status === 'requesting' && (
        <LoadingOverlay label={t('dancing.loading_camera')} />
      )}
      {status === 'ready' && (
        <LoadingOverlay label={t('dancing.loading_model')} />
      )}

      {(status === 'idle' || status === 'error') && (
        <CameraPermissionCard onStart={start} error={error} />
      )}
    </div>
  );
}

export function DancingMode({ onClose }: { onClose: () => void }) {
  return (
    <ARProvider>
      <DancingScene onClose={onClose} />
    </ARProvider>
  );
}
