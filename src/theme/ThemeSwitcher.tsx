import { useTheme } from './useTheme';

export function ThemeSwitcher() {
  const [theme, setTheme] = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      className="theme-switcher"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
      aria-label={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      {isDark ? '☀' : '☾'}
    </button>
  );
}
