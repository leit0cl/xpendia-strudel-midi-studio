import { Trans, useTranslation } from 'react-i18next';

// Inline components used by <Trans> for rich-text translations.
const COMPONENTS = {
  kbd: <kbd />,
  code: <code />,
  strong: <strong />,
};

export function CodeInstructions() {
  const { t } = useTranslation();
  return (
    <>
      <section className="instructions-section">
        <h4>{t('instructions.code.shortcuts_title')}</h4>
        <ul className="instructions-kbds">
          <li>
            <Trans i18nKey="instructions.code.shortcut_eval" components={COMPONENTS} />
          </li>
          <li>
            <Trans i18nKey="instructions.code.shortcut_hush" components={COMPONENTS} />
          </li>
        </ul>
      </section>

      <section className="instructions-section">
        <h4>{t('instructions.code.flow_title')}</h4>
        <ol>
          <li><Trans i18nKey="instructions.code.flow_1" components={COMPONENTS} /></li>
          <li><Trans i18nKey="instructions.code.flow_2" components={COMPONENTS} /></li>
          <li><Trans i18nKey="instructions.code.flow_3" components={COMPONENTS} /></li>
          <li><Trans i18nKey="instructions.code.flow_4" components={COMPONENTS} /></li>
        </ol>
      </section>

      <section className="instructions-section">
        <h4>{t('instructions.code.palette_title')}</h4>
        <p>
          <Trans i18nKey="instructions.code.palette_body" components={COMPONENTS} />
        </p>
      </section>

      <section className="instructions-section">
        <h4>{t('instructions.code.tap_title')}</h4>
        <p>
          <Trans i18nKey="instructions.code.tap_body" components={COMPONENTS} />
        </p>
      </section>

      <section className="instructions-section">
        <h4>{t('instructions.code.fx_title')}</h4>
        <p>
          <Trans i18nKey="instructions.code.fx_body" components={COMPONENTS} />
        </p>
      </section>

      <section className="instructions-section">
        <h4>{t('instructions.code.export_title')}</h4>
        <ul>
          <li><Trans i18nKey="instructions.code.export_mp3" components={COMPONENTS} /></li>
          <li><Trans i18nKey="instructions.code.export_dancing" components={COMPONENTS} /></li>
        </ul>
      </section>
    </>
  );
}
