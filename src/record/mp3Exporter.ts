// Exporta a MP3 192kbps el audio actual de Strudel:
//   1) Engancha un MediaStreamDestination al output de superdough
//   2) MediaRecorder graba durante N segundos (tiempo real)
//   3) Decodifica el blob a PCM con AudioContext.decodeAudioData
//   4) Encodea el PCM con lamejs a MP3 192kbps
//   5) Descarga el archivo

import lamejs from '@breezystack/lamejs';
import { getAudioContext, getOutputStream, play, stop } from '../strudel/engine';

const KBPS = 192;
const MP3_SAMPLE_BLOCK = 1152; // lamejs requiere bloques de 1152 muestras

export type ExportProgress =
  | { phase: 'recording'; elapsed: number; total: number }
  | { phase: 'decoding' }
  | { phase: 'encoding'; progress: number }
  | { phase: 'done'; blob: Blob; durationSec: number };

export type ExportOptions = {
  code: string;
  durationSec: number;
  filename?: string;
  onProgress?: (p: ExportProgress) => void;
};

function floatTo16(input: Float32Array): Int16Array {
  const out = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return out;
}

async function recordStream(durationSec: number, onTick?: (s: number) => void): Promise<Blob> {
  const stream = await getOutputStream();
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/mp4',
  ];
  const mimeType = candidates.find((m) => MediaRecorder.isTypeSupported(m)) ?? '';
  const recorder = mimeType
    ? new MediaRecorder(stream, { mimeType })
    : new MediaRecorder(stream);
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  const startedAt = performance.now();
  recorder.start(250);
  let tickHandle: number | null = null;
  if (onTick) {
    tickHandle = window.setInterval(() => {
      onTick((performance.now() - startedAt) / 1000);
    }, 100);
  }

  await new Promise<void>((resolve) => setTimeout(resolve, durationSec * 1000));

  const stopped = new Promise<Blob>((resolve) => {
    recorder.onstop = () =>
      resolve(new Blob(chunks, { type: mimeType || 'audio/webm' }));
  });
  recorder.stop();
  if (tickHandle) clearInterval(tickHandle);
  // Importante: cerramos el stream para que el tap no quede activo.
  stream.getTracks().forEach((t) => t.stop());
  return stopped;
}

async function decodeBlob(blob: Blob): Promise<AudioBuffer> {
  const arrayBuf = await blob.arrayBuffer();
  const ac = getAudioContext();
  return await ac.decodeAudioData(arrayBuf.slice(0));
}

function encodeMp3(buffer: AudioBuffer, onProgress?: (p: number) => void): Blob {
  const channels = Math.min(buffer.numberOfChannels, 2);
  const sampleRate = buffer.sampleRate;
  const left = floatTo16(buffer.getChannelData(0));
  const right = channels === 2 ? floatTo16(buffer.getChannelData(1)) : left;
  const encoder = new lamejs.Mp3Encoder(channels, sampleRate, KBPS);
  const mp3Chunks: Uint8Array[] = [];
  const total = left.length;
  for (let i = 0; i < total; i += MP3_SAMPLE_BLOCK) {
    const l = left.subarray(i, i + MP3_SAMPLE_BLOCK);
    const r = channels === 2 ? right.subarray(i, i + MP3_SAMPLE_BLOCK) : undefined;
    const buf = encoder.encodeBuffer(l, r);
    if (buf.length > 0) mp3Chunks.push(buf);
    if (onProgress && i % (MP3_SAMPLE_BLOCK * 50) === 0) {
      onProgress(Math.min(1, i / total));
    }
  }
  const flush = encoder.flush();
  if (flush.length > 0) mp3Chunks.push(flush);
  onProgress?.(1);
  return new Blob(mp3Chunks as BlobPart[], { type: 'audio/mpeg' });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export async function exportToMp3({
  code,
  durationSec,
  filename,
  onProgress,
}: ExportOptions): Promise<Blob> {
  // Arranca la reproducción (necesaria para que el output tenga señal)
  await play(code);
  try {
    const total = durationSec;
    onProgress?.({ phase: 'recording', elapsed: 0, total });
    const blob = await recordStream(durationSec, (elapsed) =>
      onProgress?.({ phase: 'recording', elapsed, total }),
    );

    onProgress?.({ phase: 'decoding' });
    const audio = await decodeBlob(blob);

    onProgress?.({ phase: 'encoding', progress: 0 });
    const mp3 = encodeMp3(audio, (p) =>
      onProgress?.({ phase: 'encoding', progress: p }),
    );

    const name =
      filename ??
      `strudel-${new Date().toISOString().replace(/[:.]/g, '-')}.mp3`;
    downloadBlob(mp3, name);
    onProgress?.({ phase: 'done', blob: mp3, durationSec });
    return mp3;
  } finally {
    await stop();
  }
}
