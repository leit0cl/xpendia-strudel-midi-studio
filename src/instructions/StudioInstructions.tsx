import { Trans, useTranslation } from 'react-i18next';

const COMPONENTS = {
  kbd: <kbd />,
  code: <code />,
  strong: <strong />,
};

export function StudioInstructions() {
  const { t } = useTranslation();
  return (
    <>
      <section className="instructions-section">
        <h4>{t('instructions.studio.flow_title')}</h4>
        <ol>
          <li><Trans i18nKey="instructions.studio.flow_1" components={COMPONENTS} /></li>
          <li><Trans i18nKey="instructions.studio.flow_2" components={COMPONENTS} /></li>
          <li><Trans i18nKey="instructions.studio.flow_3" components={COMPONENTS} /></li>
        </ol>
      </section>

      <section className="instructions-section">
        <h4>{t('instructions.studio.tracks_title')}</h4>
        <p>
          <Trans i18nKey="instructions.studio.tracks_body" components={COMPONENTS} />
        </p>
      </section>

      <section className="instructions-section">
        <h4>{t('instructions.studio.segments_title')}</h4>
        <p>
          <Trans i18nKey="instructions.studio.segments_body" components={COMPONENTS} />
        </p>
        <ul>
          <li><Trans i18nKey="instructions.studio.segments_add" components={COMPONENTS} /></li>
          <li><Trans i18nKey="instructions.studio.segments_silence" components={COMPONENTS} /></li>
          <li><Trans i18nKey="instructions.studio.segments_dblclick" components={COMPONENTS} /></li>
        </ul>
      </section>

      <section className="instructions-section">
        <h4>{t('instructions.studio.banks_title')}</h4>
        <p>
          <Trans i18nKey="instructions.studio.banks_body" components={COMPONENTS} />
        </p>
        <p>
          <Trans i18nKey="instructions.studio.patterns_body" components={COMPONENTS} />
        </p>
      </section>

      <section className="instructions-section">
        <h4>{t('instructions.studio.tap_title')}</h4>
        <p>
          <Trans i18nKey="instructions.studio.tap_body" components={COMPONENTS} />
        </p>
      </section>

      <section className="instructions-section">
        <h4>{t('instructions.studio.fx_title')}</h4>
        <p>
          <Trans i18nKey="instructions.studio.fx_body" components={COMPONENTS} />
        </p>
      </section>

      <section className="instructions-section">
        <h4>{t('instructions.studio.export_title')}</h4>
        <ul>
          <li><Trans i18nKey="instructions.studio.export_mp3" components={COMPONENTS} /></li>
          <li><Trans i18nKey="instructions.studio.export_dancing" components={COMPONENTS} /></li>
        </ul>
      </section>
    </>
  );
}
