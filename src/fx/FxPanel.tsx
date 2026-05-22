import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PianoRoll } from '../viz/PianoRoll';
import { Oscilloscope } from './Oscilloscope';
import { Spectrum } from './Spectrum';
import { FxKnob } from './FxKnob';
import {
  getMasterFxState,
  resetMasterFx,
  setMasterFxState,
  subscribeFx,
  type MasterFxState,
} from './MasterFx';
import { triggerReeval } from '../strudel/engine';

type Tab = 'fx' | 'eq' | 'spectrum' | 'scope' | 'piano';

const TAB_IDS: Tab[] = ['fx', 'eq', 'spectrum', 'scope', 'piano'];

export function FxPanel() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>('fx');
  const [fx, setFx] = useState<MasterFxState>(() => ({ ...getMasterFxState() }));

  useEffect(() => subscribeFx((s) => setFx({ ...s })), []);

  const update = (patch: Partial<MasterFxState>) => {
    setMasterFxState(patch);
    triggerReeval();
  };

  return (
    <div className="fx-panel">
      <div className="fx-tabs" role="tablist">
        {TAB_IDS.map((id) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            className={tab === id ? 'active' : ''}
            onClick={() => setTab(id)}
          >
            {t(`fx.tab_${id}`)}
          </button>
        ))}
        {(tab === 'fx' || tab === 'eq') && (
          <button
            className="fx-reset"
            onClick={() => {
              resetMasterFx();
              triggerReeval();
            }}
            title={t('fx.reset_title')}
          >
            {t('fx.reset')}
          </button>
        )}
      </div>

      <div className="fx-tab-body">
        {tab === 'fx' && (
          <div className="fx-knobs">
            <FxKnob
              label={t('fx.knob_room')}
              value={fx.room}
              min={0}
              max={1}
              step={0.01}
              onChange={(v) => update({ room: v })}
            />
            <FxKnob
              label={t('fx.knob_delay')}
              value={fx.delay}
              min={0}
              max={1}
              step={0.01}
              onChange={(v) => update({ delay: v })}
            />
            <FxKnob
              label={t('fx.knob_gain')}
              value={fx.gain}
              min={0}
              max={1.5}
              step={0.01}
              onChange={(v) => update({ gain: v })}
            />
            <div className="fx-hint">{t('fx.fx_hint')}</div>
          </div>
        )}

        {tab === 'eq' && (
          <div className="fx-knobs">
            <FxKnob
              label={t('fx.knob_hpf')}
              value={fx.hpf}
              min={20}
              max={2000}
              step={5}
              unit="Hz"
              format={(v) => Math.round(v).toString()}
              onChange={(v) => update({ hpf: v })}
            />
            <FxKnob
              label={t('fx.knob_lpf')}
              value={fx.lpf}
              min={200}
              max={20000}
              step={50}
              unit="Hz"
              format={(v) =>
                v >= 1000 ? `${(v / 1000).toFixed(1)}k` : Math.round(v).toString()
              }
              onChange={(v) => update({ lpf: v })}
            />
            <div className="fx-hint">{t('fx.eq_hint')}</div>
          </div>
        )}

        {tab === 'spectrum' && (
          <div className="fx-spectrum">
            <Spectrum />
          </div>
        )}

        {tab === 'scope' && (
          <div className="fx-scope">
            <Oscilloscope />
          </div>
        )}

        {tab === 'piano' && (
          <div className="fx-piano">
            <PianoRoll />
          </div>
        )}
      </div>
    </div>
  );
}
