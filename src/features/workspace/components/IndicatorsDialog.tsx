import { useState } from 'react';
import { Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import { Badge, Button, EmptyState, IconButton, Input, Modal } from '@/components/ui';
import { INDICATOR_INFO } from '@/content/indicators';
import { t } from '@/i18n';
import { defaultParams, getIndicator, indicatorLabel, INDICATORS, normalizeParams } from '@/lib/indicators';
import type { IndicatorConfig, IndicatorId } from '@/types';

export const MAX_INDICATORS = 8;

const PLACEMENT_LABEL = { overlay: t('On price'), volume: t('On volume'), pane: t('Own pane') };

/** A numeric parameter that commits a valid value on blur or Enter. */
function ParamField({
  label,
  value,
  min,
  max,
  step,
  onCommit,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onCommit: (value: number) => void;
}) {
  const [text, setText] = useState(String(value));
  const [seen, setSeen] = useState(value);
  if (seen !== value) {
    setSeen(value);
    setText(String(value));
  }
  const n = Number(text);
  const invalid = text.trim() === '' || !Number.isFinite(n) || n < min || n > max;
  const commit = () => (invalid ? setText(String(value)) : onCommit(n));
  return (
    <Input
      label={label}
      numeric
      inputMode={step >= 1 ? 'numeric' : 'decimal'}
      wrapperClassName="w-28"
      value={text}
      error={invalid ? t('{min} to {max}', { min, max }) : undefined}
      onChange={(e) => setText(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => e.key === 'Enter' && commit()}
    />
  );
}

export interface IndicatorsDialogProps {
  open: boolean;
  onClose: () => void;
  indicators: IndicatorConfig[];
  onChange: (indicators: IndicatorConfig[]) => void;
  /** Open the Explain tab for an indicator. */
  onExplain: (key: string) => void;
}

/** Add, configure, hide and remove indicators on the current chart. */
export function IndicatorsDialog({ open, onClose, indicators, onChange, onExplain }: IndicatorsDialogProps) {
  const full = indicators.length >= MAX_INDICATORS;

  const add = (id: IndicatorId) => {
    if (full) return;
    onChange([...indicators, { key: crypto.randomUUID(), id, params: defaultParams(id), visible: true }]);
  };
  const patch = (key: string, changes: Partial<IndicatorConfig>) =>
    onChange(indicators.map((i) => (i.key === key ? { ...i, ...changes } : i)));
  const remove = (key: string) => onChange(indicators.filter((i) => i.key !== key));

  return (
    <Modal open={open} onClose={onClose} title={t('Indicators')} size="lg" footer={<Button variant="primary" onClick={onClose}>{t('Done')}</Button>}>
      <section aria-labelledby="ind-active">
        <h3 id="ind-active" className="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">
          {t('On this chart ({n} of {max})', { n: indicators.length, max: MAX_INDICATORS })}
        </h3>
        {indicators.length === 0 ? (
          <EmptyState
            className="rounded-control border border-border py-6"
            title={t('No indicators yet')}
            description={t('An indicator is a line calculated from price or volume that makes something easier to see, such as the trend. Add one from the list below.')}
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {indicators.map((config) => {
              const def = getIndicator(config.id);
              return (
                <li key={config.key} className="rounded-control border border-border p-3">
                  <div className="flex items-center gap-2">
                    <span className="min-w-0 flex-1">
                      <span className="text-sm font-medium text-fg">{def.name}</span>{' '}
                      <span className="num text-xs text-muted">{indicatorLabel(config)}</span>
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        onExplain(config.key);
                        onClose();
                      }}
                    >
                      {t('Explain')}
                    </Button>
                    <IconButton
                      size="sm"
                      label={config.visible ? t('Hide {name}', { name: def.short }) : t('Show {name}', { name: def.short })}
                      icon={config.visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                      onClick={() => patch(config.key, { visible: !config.visible })}
                    />
                    <IconButton
                      size="sm"
                      label={t('Remove {name}', { name: def.short })}
                      icon={<Trash2 className="size-4" />}
                      onClick={() => remove(config.key)}
                    />
                  </div>
                  {def.params.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-3">
                      {def.params.map((p) => (
                        <ParamField
                          key={p.key}
                          label={p.label}
                          value={config.params[p.key] ?? p.default}
                          min={p.min}
                          max={p.max}
                          step={p.step}
                          onCommit={(value) =>
                            patch(config.key, { params: normalizeParams(config.id, { ...config.params, [p.key]: value }) })
                          }
                        />
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section aria-labelledby="ind-add" className="mt-5">
        <h3 id="ind-add" className="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">
          {t('Add an indicator')}
        </h3>
        {full && (
          <p role="status" className="mb-2 text-xs text-warning-text">
            {t('The chart holds up to {max} indicators. Remove one to add another.', { max: MAX_INDICATORS })}
          </p>
        )}
        <ul className="flex flex-col">
          {INDICATORS.map((def) => (
            <li key={def.id} className="flex items-start gap-3 border-b border-border py-2.5 last:border-b-0">
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-fg">
                  {def.name}
                  <Badge>{PLACEMENT_LABEL[def.placement]}</Badge>
                </p>
                <p className="mt-0.5 text-xs text-muted">{INDICATOR_INFO[def.id].summary}</p>
              </div>
              <Button
                size="sm"
                disabled={full}
                icon={<Plus aria-hidden className="size-3.5" />}
                aria-label={t('Add {name}', { name: def.name })}
                onClick={() => add(def.id)}
              >
                {t('Add')}
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </Modal>
  );
}
