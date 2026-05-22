import type { MasterFxState } from './MasterFx';
import { DEFAULT_FX } from './MasterFx';

// Wrap user code with master FX operators, applied as Strudel pattern chains.
// Only operators whose values differ from neutral defaults are injected so the
// generated code stays clean when nothing is active.
export function wrapCode(code: string, fx: MasterFxState): string {
  const trimmed = code.trim();
  if (!trimmed) return code;

  const ops: string[] = [];
  if (fx.room > 0.001) ops.push(`.room(${fx.room.toFixed(3)})`);
  if (fx.delay > 0.001) ops.push(`.delay(${fx.delay.toFixed(3)})`);
  if (fx.lpf < DEFAULT_FX.lpf - 1) ops.push(`.lpf(${Math.round(fx.lpf)})`);
  if (fx.hpf > DEFAULT_FX.hpf + 1) ops.push(`.hpf(${Math.round(fx.hpf)})`);
  if (Math.abs(fx.gain - 1) > 0.001) ops.push(`.gain(${fx.gain.toFixed(3)})`);

  if (ops.length === 0) return code;

  // Wrap entire user code as a single expression then chain operators.
  // Closing paren must be on its own line so any trailing `// inline comment`
  // in the user's code does not swallow the master FX chain.
  const stripped = trimmed.replace(/;+\s*$/, '');
  return `(\n${stripped}\n)${ops.join('')}`;
}
