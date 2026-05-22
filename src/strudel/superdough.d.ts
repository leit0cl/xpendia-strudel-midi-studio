// Type shim for `superdough` — the package ships only `dist/index.mjs`
// with no .d.ts. We declare the subset of exports the app actually uses
// so `tsc -b` can resolve the named imports.

declare module 'superdough' {
  /** Loads sample packs. Accepts a URL/shortcut string or a name→URL map. */
  export function samples(
    src: string | Record<string, string | string[]>,
    base?: string,
  ): Promise<void>;

  /** The shared Web Audio context superdough drives. */
  export function getAudioContext(): AudioContext;

  /** Current time of the shared audio context (helper). */
  export function getAudioContextCurrentTime(): number;

  /** Master audio controller exposing the output graph (destinationGain). */
  export function getSuperdoughAudioController(): {
    output: {
      destinationGain: GainNode;
      [k: string]: unknown;
    };
    [k: string]: unknown;
  };

  /** Registers ZZFX-based synths (z_sine, z_sawtooth, z_square, etc.). */
  export function registerZZFXSounds(): void;
}
