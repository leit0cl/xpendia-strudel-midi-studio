// Singleton AnalyserNode tapped passively off superdough's destinationGain.
// Shared by Oscilloscope and Dancing mode's waveform band.
import {
  getAudioContext,
  getSuperdoughAudioController,
} from 'superdough';

let cached: AnalyserNode | null = null;

export function getAnalyser(): AnalyserNode {
  if (cached) return cached;
  const ac = getAudioContext() as AudioContext;
  const controller = getSuperdoughAudioController() as {
    output: { destinationGain: AudioNode };
  };
  const analyser = ac.createAnalyser();
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = 0.6;
  controller.output.destinationGain.connect(analyser);
  cached = analyser;
  return analyser;
}
