declare module '@strudel/core' {
  export const Pattern: { prototype: Record<string, unknown> };
  export function evalScope(...args: unknown[]): unknown;
  export function setTime(fn: () => number): void;
}

declare module '@strudel/mini' {
  export function miniAllStrings(): void;
}

declare module '@strudel/tonal' {
  // re-exports for evalScope
}

declare module '@strudel/webaudio' {
  export function initAudioOnFirstClick(): void;
  export function registerSynthSounds(): Promise<unknown>;
  export function webaudioRepl(opts: { transpiler: unknown }): any;
}

declare module '@strudel/transpiler' {
  export const transpiler: unknown;
}

declare module 'superdough' {
  export function samples(
    source: string | object,
    baseUrl?: string,
    options?: Record<string, unknown>,
  ): Promise<unknown>;
  export const soundMap: {
    get: () => Record<string, { onTrigger: unknown; data: { type?: string; tag?: string } }>;
    setKey: (k: string, v: unknown) => void;
  };
}

declare module '@strudel/soundfonts' {
  export function registerSoundfonts(): void;
}

declare module '@strudel/midi' {
  // side-effect import, no exports needed
}

declare module '@strudel/hydra' {
  export function initHydra(opts?: Record<string, unknown>): Promise<unknown>;
  export function clearHydra(): void;
}
