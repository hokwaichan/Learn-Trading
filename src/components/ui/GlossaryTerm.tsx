import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { getGlossaryEntry } from '@/content/glossary';
import { Tooltip } from './Tooltip';

export interface GlossaryTermProps {
  /** Glossary entry id. */
  id: string;
  /** The text to show; defaults to the entry's term. */
  children?: ReactNode;
}

/** Inline link to a glossary entry that shows the definition on hover or focus. */
export function GlossaryTerm({ id, children }: GlossaryTermProps) {
  const entry = getGlossaryEntry(id);
  if (!entry) return <>{children}</>;
  return (
    <Tooltip
      rich
      content={
        <>
          <span className="font-semibold">{entry.term}</span>
          <span className="mt-0.5 block text-muted">{entry.definition}</span>
        </>
      }
    >
      <Link
        to={`/glossary#${entry.id}`}
        className="rounded-sm underline decoration-muted decoration-dotted underline-offset-4 hover:decoration-accent hover:decoration-solid"
      >
        {children ?? entry.term}
      </Link>
    </Tooltip>
  );
}
