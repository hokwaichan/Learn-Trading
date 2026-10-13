import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from './cn';

interface FieldShellProps {
  id: string;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  className?: string;
  children: ReactNode;
}

function FieldShell({ id, label, hint, error, className, children }: FieldShellProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-muted">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p id={`${id}-msg`} role="alert" className="text-xs text-down-text">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-msg`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

const CONTROL =
  'h-8 w-full rounded-control border bg-bg px-2 text-sm text-fg placeholder:text-muted ' +
  'transition-colors duration-150 disabled:opacity-50 ' +
  'focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-0';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  /** Shown inside the field on the left, e.g. '$'. */
  prefix?: ReactNode;
  /** Shown inside the field on the right, e.g. 'BTC' or '%'. */
  suffix?: ReactNode;
  /** Monospace with tabular figures, for prices and quantities. */
  numeric?: boolean;
  wrapperClassName?: string;
}

export function Input({
  label,
  hint,
  error,
  prefix,
  suffix,
  numeric,
  className,
  wrapperClassName,
  id: idProp,
  ...rest
}: InputProps) {
  const auto = useId();
  const id = idProp ?? auto;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={wrapperClassName}>
      <div className="relative flex items-center">
        {prefix && <span className="pointer-events-none absolute left-2 text-xs text-muted">{prefix}</span>}
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? `${id}-msg` : undefined}
          inputMode={numeric ? 'decimal' : rest.inputMode}
          autoComplete="off"
          className={cn(
            CONTROL,
            numeric && 'num text-right',
            prefix && 'pl-6',
            suffix && 'pr-12',
            error ? 'border-down' : 'border-border',
            className,
          )}
          {...rest}
        />
        {suffix && <span className="pointer-events-none absolute right-2 text-xs text-muted">{suffix}</span>}
      </div>
    </FieldShell>
  );
}

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface SelectProps<T extends string = string>
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  wrapperClassName?: string;
}

/** A styled native select: full keyboard and screen-reader support for free. */
export function Select<T extends string = string>({
  label,
  hint,
  error,
  options,
  value,
  onChange,
  className,
  wrapperClassName,
  id: idProp,
  ...rest
}: SelectProps<T>) {
  const auto = useId();
  const id = idProp ?? auto;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={wrapperClassName}>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? `${id}-msg` : undefined}
          className={cn(CONTROL, 'appearance-none pr-7', error ? 'border-down' : 'border-border', className)}
          {...rest}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-muted"
        />
      </div>
    </FieldShell>
  );
}

export interface SwitchProps {
  label: ReactNode;
  description?: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

/** An on/off setting. The state is conveyed by position and aria, not colour alone. */
export function Switch({ label, description, checked, onChange, disabled, className }: SwitchProps) {
  const id = useId();
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div className="min-w-0">
        <label htmlFor={id} className="text-sm text-fg">
          {label}
        </label>
        {description && (
          <p id={`${id}-desc`} className="mt-0.5 text-xs text-muted">
            {description}
          </p>
        )}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={description ? `${id}-desc` : undefined}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative mt-0.5 h-5 w-9 shrink-0 rounded-full border transition-colors duration-150 disabled:opacity-50',
          checked ? 'border-accent bg-accent' : 'border-border bg-bg',
        )}
      >
        <span
          aria-hidden
          className={cn(
            'absolute top-0.5 left-0.5 size-3.5 rounded-full transition-transform duration-150',
            checked ? 'translate-x-4 bg-on-solid' : 'bg-muted',
          )}
        />
      </button>
    </div>
  );
}

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> {
  label: ReactNode;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  /** How the current value is displayed next to the label. */
  format?: (value: number) => string;
  wrapperClassName?: string;
}

export function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  format = String,
  wrapperClassName,
  id: idProp,
  ...rest
}: SliderProps) {
  const auto = useId();
  const id = idProp ?? auto;
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;
  return (
    <div className={cn('flex flex-col gap-1', wrapperClassName)}>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-xs font-medium text-muted">
          {label}
        </label>
        <output htmlFor={id} className="num text-xs text-fg">
          {format(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={format(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ '--fill': `${pct}%` } as React.CSSProperties}
        className="ts-slider h-5 w-full cursor-pointer appearance-none bg-transparent"
        {...rest}
      />
    </div>
  );
}
