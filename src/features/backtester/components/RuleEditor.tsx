import { Plus, Trash2 } from 'lucide-react';
import { Button, IconButton, Input, Select } from '@/components/ui';
import { COMPARATORS, conditionLabel, defaultOutput } from '@/lib/backtest';
import { defaultParams, getIndicator, INDICATORS } from '@/lib/indicators';
import type { BacktestRule, Comparator, Condition, IndicatorId, Operand } from '@/types';

const PRICE_FIELDS = [
  { value: 'price:close', label: 'Close price' },
  { value: 'price:open', label: 'Open price' },
  { value: 'price:high', label: 'High price' },
  { value: 'price:low', label: 'Low price' },
  { value: 'price:volume', label: 'Volume' },
];

const SOURCE_OPTIONS = [
  ...PRICE_FIELDS,
  ...INDICATORS.map((d) => ({ value: `indicator:${d.id}`, label: `${d.short} · ${d.name}` })),
  { value: 'constant', label: 'A number' },
];

const sourceOf = (operand: Operand) => (operand.kind === 'price' ? `price:${operand.field}` : operand.kind === 'indicator' ? `indicator:${operand.indicator}` : 'constant');

function operandFor(source: string, previous: Operand): Operand {
  if (source === 'constant') return { kind: 'constant', value: previous.kind === 'constant' ? previous.value : 0 };
  const [kind, id] = source.split(':');
  if (kind === 'price') return { kind: 'price', field: id as 'open' | 'high' | 'low' | 'close' | 'volume' };
  const indicator = id as IndicatorId;
  return { kind: 'indicator', indicator, params: defaultParams(indicator), output: defaultOutput(indicator) };
}

/** One side of a comparison: a price, an indicator line with its settings, or a fixed number. */
function OperandPicker({ label, operand, onChange }: { label: string; operand: Operand; onChange: (operand: Operand) => void }) {
  const def = operand.kind === 'indicator' ? getIndicator(operand.indicator) : null;
  return (
    <div className="flex flex-col gap-1.5">
      <Select aria-label={label} value={sourceOf(operand)} onChange={(source) => onChange(operandFor(source, operand))} options={SOURCE_OPTIONS} />
      {operand.kind === 'constant' && (
        <Input
          aria-label={`${label}: number`}
          type="number"
          numeric
          step="any"
          value={Number.isFinite(operand.value) ? operand.value : ''}
          onChange={(e) => onChange({ kind: 'constant', value: e.target.value === '' ? NaN : Number(e.target.value) })}
        />
      )}
      {operand.kind === 'indicator' && def && (def.params.length > 0 || def.outputs.length > 1) && (
        <div className="flex flex-wrap items-end gap-1.5">
          {def.outputs.length > 1 && (
            <Select
              aria-label={`${label}: ${def.short} line`}
              wrapperClassName="min-w-24 flex-1"
              value={operand.output ?? defaultOutput(operand.indicator)}
              onChange={(output) => onChange({ ...operand, output })}
              options={def.outputs.map((o) => ({ value: o.key, label: `${o.label} line` }))}
            />
          )}
          {def.params.map((p) => (
            <Input
              key={p.key}
              label={<span className="text-[11px]">{p.label}</span>}
              aria-label={`${label}: ${def.short} ${p.label.toLowerCase()}`}
              type="number"
              numeric
              min={p.min}
              max={p.max}
              step={p.step}
              wrapperClassName="w-20"
              value={operand.params[p.key] ?? p.default}
              onChange={(e) => onChange({ ...operand, params: { ...operand.params, [p.key]: Number(e.target.value) } })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

let counter = 0;
const newId = () => `c${Date.now().toString(36)}${counter++}`;

const newCondition = (): Condition => ({
  id: newId(),
  left: { kind: 'price', field: 'close' },
  op: 'crosses_above',
  right: { kind: 'indicator', indicator: 'sma', params: defaultParams('sma'), output: 'value' },
});

export interface RuleEditorProps {
  /** 'Entry' or 'Exit'; names the controls for screen readers. */
  name: string;
  rule: BacktestRule;
  onChange: (rule: BacktestRule) => void;
  /** Shown when there are no conditions. */
  emptyText: string;
}

/** A list of conditions joined by "all of" or "any of". */
export function RuleEditor({ name, rule, onChange, emptyText }: RuleEditorProps) {
  const update = (id: string, patch: Partial<Condition>) => onChange({ ...rule, conditions: rule.conditions.map((c) => (c.id === id ? { ...c, ...patch } : c)) });

  return (
    <div className="flex flex-col gap-2">
      {rule.conditions.length > 1 && (
        <Select<'all' | 'any'>
          aria-label={`${name}: how conditions combine`}
          value={rule.combine}
          onChange={(combine) => onChange({ ...rule, combine })}
          options={[
            { value: 'all', label: 'When all of these are true' },
            { value: 'any', label: 'When any of these is true' },
          ]}
        />
      )}
      {rule.conditions.length === 0 && <p className="rounded-control border border-dashed border-border px-3 py-2 text-xs text-muted">{emptyText}</p>}
      <ol className="flex flex-col gap-2">
        {rule.conditions.map((condition, i) => {
          const label = `${name} condition ${i + 1}`;
          return (
            <li key={condition.id} className="rounded-control border border-border bg-bg p-2" aria-label={`${label}: ${conditionLabel(condition)}`}>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className="text-xs text-muted">{conditionLabel(condition)}</span>
                <IconButton
                  label={`Remove ${label.toLowerCase()}`}
                  size="sm"
                  icon={<Trash2 className="size-3.5" />}
                  onClick={() => onChange({ ...rule, conditions: rule.conditions.filter((c) => c.id !== condition.id) })}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <OperandPicker label={`${label}, left side`} operand={condition.left} onChange={(left) => update(condition.id, { left })} />
                <Select<Comparator>
                  aria-label={`${label}, comparison`}
                  value={condition.op}
                  onChange={(op) => update(condition.id, { op })}
                  options={COMPARATORS.map((c) => ({ value: c.id, label: c.label }))}
                />
                <OperandPicker label={`${label}, right side`} operand={condition.right} onChange={(right) => update(condition.id, { right })} />
              </div>
            </li>
          );
        })}
      </ol>
      <Button size="sm" className="self-start" icon={<Plus aria-hidden className="size-3.5" />} onClick={() => onChange({ ...rule, conditions: [...rule.conditions, newCondition()] })}>
        Add {name.toLowerCase()} condition
      </Button>
    </div>
  );
}
