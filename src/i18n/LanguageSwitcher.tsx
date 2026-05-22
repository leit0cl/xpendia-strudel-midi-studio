import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGS, type Lang } from './index';

const LABELS: Record<Lang, string> = {
  es: 'ES',
  en: 'EN',
  pt: 'PT',
};

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = (i18n.resolvedLanguage ?? i18n.language ?? 'es').slice(
    0,
    2,
  ) as Lang;

  return (
    <div className="lang-switcher" role="group" aria-label="Idioma">
      {SUPPORTED_LANGS.map((lng) => (
        <button
          key={lng}
          type="button"
          className={current === lng ? 'active' : ''}
          onClick={() => i18n.changeLanguage(lng)}
          aria-pressed={current === lng}
        >
          {LABELS[lng]}
        </button>
      ))}
    </div>
  );
}
