import { useState, type ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getGlossaryEntry } from '@/content/glossary';
import { t } from '@/i18n';
import { BottomSheet } from './Modal';
import { Tooltip } from './Tooltip';
import { useIsTouch } from './useMediaQuery';

export interface GlossaryTermProps {
  /** Glossary entry id. */
  id: string;
  /** The text to show; defaults to the entry's term. */
  children?: ReactNode;
}

const LINK = 'rounded-sm underline decoration-muted decoration-dotted underline-offset-4 hover:decoration-accent hover:decoration-solid';

/**
 * Inline link to a glossary entry that shows the definition on hover or focus.
 * On touch screens, where there is no hover, a tap opens the definition in a
 * sheet so the reader keeps their place, with a link through to the glossary.
 */
export function GlossaryTerm({ id, children }: GlossaryTermProps) {
  const entry = getGlossaryEntry(id);
  const touch = useIsTouch();
  const [open, setOpen] = useState(false);
  if (!entry) return <>{children}</>;

  if (touch) {
    return (
      <>
        <Link
          to={`/glossary#${entry.id}`}
          aria-haspopup="dialog"
          className={LINK}
          onClick={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          {children ?? entry.term}
        </Link>
        <BottomSheet open={open} onClose={() => setOpen(false)} title={entry.term}>
          <div className="flex flex-col gap-3 px-4 pb-4 text-sm leading-relaxed">
            <p className="text-fg">{entry.definition}</p>
            {entry.details && <p className="text-muted">{entry.details}</p>}
            <Link to={`/glossary#${entry.id}`} className="inline-flex items-center gap-1 self-start text-accent-text" onClick={() => setOpen(false)}>
              {t('Open in the glossary')}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </BottomSheet>
      </>
    );
  }

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
      <Link to={`/glossary#${entry.id}`} className={LINK}>
        {children ?? entry.term}
      </Link>
    </Tooltip>
  );
}
