import { Fragment, type ReactNode } from 'react';
import { t } from '@/i18n';

export interface TransProps {
  /** English with `{name}` placeholders, translated like t(). Write it as a plain string literal so the translation test finds it. */
  text: string;
  /** What goes in each placeholder: text, numbers, or elements such as links and emphasis. */
  values: Record<string, ReactNode>;
}

/**
 * A translated sentence with elements inside it. The translation decides
 * where each placeholder goes, so word order can change between languages:
 *
 *   <Trans text="You got {correct} of {total}." values={{ correct: <b>{n}</b>, total }} />
 */
export function Trans({ text, values }: TransProps) {
  const parts = t(text).split(/\{(\w+)\}/g);
  return (
    <>
      {parts.map((part, i) => (i % 2 === 1 ? <Fragment key={i}>{part in values ? values[part] : `{${part}}`}</Fragment> : part))}
    </>
  );
}
