import { useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';
const LS_KEY = 'xpendia.theme';

function getInitial(): Theme {
  try {
    const stored = localStorage.getItem(LS_KEY) as Theme | null;
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {}
  if (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: light)').matches
  ) {
    return 'light';
  }
  return 'dark';
}

function apply(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const t = getInitial();
    apply(t);
    return t;
  });

  useEffect(() => {
    apply(theme);
    try {
      localStorage.setItem(LS_KEY, theme);
    } catch {}
  }, [theme]);

  // React to OS changes if the user hasn't explicitly chosen yet.
  useEffect(() => {
    const mql = window.matchMedia?.('(prefers-color-scheme: light)');
    if (!mql) return;
    const onChange = (e: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem(LS_KEY)) return;
      } catch {}
      setTheme(e.matches ? 'light' : 'dark');
    };
    mql.addEventListener?.('change', onChange);
    return () => mql.removeEventListener?.('change', onChange);
  }, []);

  return [theme, setTheme] as const;
}
