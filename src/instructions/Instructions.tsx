import { useTranslation } from 'react-i18next';
import { CodeInstructions } from './CodeInstructions';
import { StudioInstructions } from './StudioInstructions';
import type { Mode } from '../persistence';

const LS_KEY = 'xpendia.instructions.open';

function loadOpen(): boolean {
  try {
    return localStorage.getItem(LS_KEY) === '1';
  } catch {
    return false;
  }
}

function saveOpen(v: boolean) {
  try {
    localStorage.setItem(LS_KEY, v ? '1' : '0');
  } catch {}
}

export function Instructions({ mode }: { mode: Mode }) {
  const { t } = useTranslation();
  return (
    <details
      className="instructions"
      open={loadOpen()}
      onToggle={(e) => saveOpen(e.currentTarget.open)}
    >
      <summary>
        <span className="instructions-icon">📖</span>
        <span className="instructions-title">{t('instructions.open')}</span>
        <span className="instructions-meta">
          {mode === 'studio'
            ? t('instructions.mode_studio')
            : t('instructions.mode_code')}
        </span>
      </summary>
      <div className="instructions-body">
        {mode === 'studio' ? <StudioInstructions /> : <CodeInstructions />}
      </div>
    </details>
  );
}
