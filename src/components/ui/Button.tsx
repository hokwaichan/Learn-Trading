import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from './cn';
import { Tooltip } from './Tooltip';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'buy' | 'sell' | 'warning' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-on-solid font-semibold hover:brightness-110',
  secondary: 'bg-surface text-fg border border-border hover:bg-raised',
  ghost: 'text-muted hover:text-fg hover:bg-raised',
  buy: 'bg-up text-on-solid font-semibold hover:brightness-110',
  sell: 'bg-down text-on-solid font-semibold hover:brightness-110',
  warning: 'bg-warning text-on-solid font-semibold hover:brightness-110',
  danger: 'border border-down text-down-text hover:bg-down/10',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-7 px-2 text-xs gap-1',
  md: 'h-8 px-3 text-sm gap-1.5',
  lg: 'h-10 px-4 text-sm gap-2',
};

const BASE =
  'inline-flex items-center justify-center rounded-control whitespace-nowrap select-none ' +
  'transition-[background-color,color,filter] duration-150 ' +
  'disabled:opacity-50 disabled:pointer-events-none';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  block?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  block,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(BASE, VARIANTS[variant], SIZES[size], block && 'w-full', className)}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Required: read by screen readers and shown as the tooltip. */
  label: string;
  icon: ReactNode;
  size?: ButtonSize;
  active?: boolean;
  tooltipSide?: 'top' | 'bottom' | 'left' | 'right';
}

const ICON_SIZES: Record<ButtonSize, string> = { sm: 'size-7', md: 'size-8', lg: 'size-10' };

export function IconButton({
  label,
  icon,
  size = 'md',
  active,
  tooltipSide = 'bottom',
  className,
  type = 'button',
  ...rest
}: IconButtonProps) {
  return (
    <Tooltip content={label} side={tooltipSide}>
      <button
        type={type}
        aria-label={label}
        aria-pressed={active}
        className={cn(
          BASE,
          ICON_SIZES[size],
          'shrink-0',
          active ? 'bg-accent/15 text-accent-text' : VARIANTS.ghost,
          className,
        )}
        {...rest}
      >
        {icon}
      </button>
    </Tooltip>
  );
}
