import { Trans, useTranslation } from 'react-i18next';

interface Props {
  onStart: () => void;
  error: string | null;
}

export function CameraPermissionCard({ onStart, error }: Props) {
  const { t } = useTranslation();
  return (
    <div className="dancing-permission">
      <div className="dancing-permission-card">
        <div className="dancing-permission-icon">💃</div>
        <h2>{t('dancing.permission_title')}</h2>
        <p>
          <Trans
            i18nKey="dancing.permission_body_part1"
            components={{ strong: <strong /> }}
          />{' '}
          <strong>{t('dancing.permission_body_strong')}</strong>{' '}
          {t('dancing.permission_body_part2')}
        </p>
        {error && (
          <div className="dancing-permission-error">
            <span>⚠</span> {error}
          </div>
        )}
        <button className="dancing-permission-btn" onClick={onStart}>
          {t('dancing.permission_button')}
        </button>
        <small>{t('dancing.permission_footer')}</small>
      </div>
    </div>
  );
}
