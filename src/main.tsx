import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.tsx'

// Silence a noisy internal superdough deprecation that the host can't fix
// (it fires per-sample-trigger and floods the console). Matches whether the
// message arrives as a single concatenated string or split across args.
function shouldSilence(args: unknown[]): boolean {
  const joined = args
    .map((a) => (typeof a === 'string' ? a : ''))
    .join(' ');
  return /\[superdough\][\s\S]*node\.onended/i.test(joined);
}
const origWarn = console.warn;
const origLog = console.log;
console.warn = (...args: unknown[]) => {
  if (shouldSilence(args)) return;
  origWarn.apply(console, args as Parameters<typeof console.warn>);
};
console.log = (...args: unknown[]) => {
  if (shouldSilence(args)) return;
  origLog.apply(console, args as Parameters<typeof console.log>);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
