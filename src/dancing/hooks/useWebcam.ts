import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAR } from '../context/ARContext';

export function useWebcam() {
  const { t } = useTranslation();
  const { videoRef, setStatus, setError, status, stream, setStream } = useAR();

  const start = useCallback(async () => {
    setStatus('requesting');
    setError(null);
    try {
      let s = stream;
      if (!s || s.getTracks().every((t) => t.readyState !== 'live')) {
        s = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user',
          },
          audio: false,
        });
        setStream(s);
      }
      const v = videoRef.current;
      if (v) {
        v.srcObject = s;
        await v.play().catch(() => {});
      }
      setStatus('ready');
    } catch (e) {
      const msg = e instanceof Error ? e.message : t('errors.no_camera');
      setError(msg);
      setStatus('error');
    }
  }, [videoRef, setStatus, setError, stream, setStream, t]);

  const stop = useCallback(() => {
    if (stream) stream.getTracks().forEach((t) => t.stop());
    setStream(null);
    const v = videoRef.current;
    if (v) v.srcObject = null;
    setStatus('idle');
  }, [videoRef, setStatus, stream, setStream]);

  return { start, stop, status };
}
