import { useEffect, useMemo, useState } from 'react';
import { GraduationCap, SearchX } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn, EmptyState, Input, Page, PageHeader } from '@/components/ui';
import { getGlossaryEntry, GLOSSARY } from '@/content/glossary';
import { getLesson } from '@/content/lessons';
import { t } from '@/i18n';
import type { GlossaryEntry } from '@/types';

/**
 * Sorted by the English term in every language, so the A to Z index works
 * and the glossary doubles as a dictionary of the English jargon a learner
 * meets on real trading platforms.
 */
const englishTerm = (entry: GlossaryEntry) => entry.english ?? entry.term;
const SORTED = [...GLOSSARY].sort((a, b) => englishTerm(a).localeCompare(englishTerm(b), 'en', { sensitivity: 'base' }));

function matches(entry: GlossaryEntry, query: string): boolean {
  if (!query) return true;
  const haystack = `${entry.term} ${entry.english ?? ''} ${entry.aliases.join(' ')} ${entry.definition}`.toLowerCase();
  return query.split(/\s+/).every((word) => haystack.includes(word));
}

/** Every term used in the app, searchable, with links to related terms and lessons. */
export function GlossaryPage() {
  const { hash } = useLocation();
  const target = decodeURIComponent(hash.replace(/^#/, ''));
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const found = SORTED.filter((entry) => matches(entry, q));
    // Terms whose name matches come before terms that only mention the word.
    return q ? found.sort((a, b) => Number(b.term.toLowerCase().includes(q)) - Number(a.term.toLowerCase().includes(q))) : found;
  }, [query]);

  // Arriving from a link to one term: clear any search and bring it into view.
  const [seenTarget, setSeenTarget] = useState('');
  if (target !== seenTarget) {
    setSeenTarget(target);
    if (target) setQuery('');
  }
  useEffect(() => {
    if (!target) return;
    const el = document.getElementById(target);
    el?.scrollIntoView({ block: 'center' });
    el?.focus({ preventScroll: true });
  }, [target]);

  const letters = useMemo(() => {
    const first = new Map<string, string>();
    for (const entry of results) {
      const letter = englishTerm(entry)[0].toUpperCase();
      if (!first.has(letter)) first.set(letter, entry.id);
    }
    return first;
  }, [results]);

  return (
    <Page className="max-w-3xl">
      <PageHeader title={t('Glossary')} description={t('{n} trading terms in plain words. Terms are also linked wherever they first appear in a lesson.', { n: GLOSSARY.length })} />

      <div className="sticky top-0 z-10 -mx-4 flex flex-col gap-2 bg-bg px-4 py-2 md:-mx-6 md:px-6">
        <Input
          type="search"
          aria-label={t('Search the glossary')}
          placeholder={t('Search terms and definitions')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {!query && (
          <nav aria-label={t('Jump to letter')} className="flex flex-wrap gap-0.5">
            {[...letters].map(([letter, id]) => (
              <a key={letter} href={`#${id}`} className="num grid size-7 place-items-center rounded-control text-xs text-muted hover:bg-raised hover:text-fg">
                {letter}
              </a>
            ))}
          </nav>
        )}
        <p role="status" className="sr-only">
          {results.length === 1 ? t('1 term shown') : t('{n} terms shown', { n: results.length })}
        </p>
      </div>

      {results.length === 0 ? (
        <EmptyState
          icon={<SearchX />}
          title={t('No term matches "{query}"', { query })}
          description={t('Try a shorter word, or a related one such as margin, option or trend.')}
        />
      ) : (
        <dl className="flex flex-col">
          {results.map((entry) => {
            const lesson = entry.lesson && getLesson(entry.lesson.moduleId, entry.lesson.lessonId);
            return (
              <div
                key={entry.id}
                id={entry.id}
                tabIndex={-1}
                className={cn(
                  'scroll-mt-28 border-b border-border px-3 py-4 focus-visible:outline-offset-[-2px]',
                  entry.id === target && 'rounded-control bg-accent/10',
                )}
              >
                <dt className="text-base font-semibold text-fg">
                  {entry.term}
                  {entry.english && entry.english !== entry.term && (
                    <span lang="en" className="ml-2 text-sm font-normal text-muted">
                      {entry.english}
                    </span>
                  )}
                </dt>
                <dd className="mt-1 text-[15px] leading-relaxed text-fg">{entry.definition}</dd>
                {entry.details && <dd className="mt-1 text-sm leading-relaxed text-muted">{entry.details}</dd>}
                {(entry.seeAlso.length > 0 || lesson) && (
                  <dd className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    {entry.seeAlso.length > 0 && (
                      <span className="text-muted">
                        {t('See also:')}{' '}
                        {entry.seeAlso.map((id, i) => (
                          <span key={id}>
                            {i > 0 && t(', ')}
                            <a href={`#${id}`} className="text-accent-text underline underline-offset-4">
                              {getGlossaryEntry(id)?.term ?? id}
                            </a>
                          </span>
                        ))}
                      </span>
                    )}
                    {lesson && (
                      <Link
                        to={`/learn/${lesson.moduleId}/${lesson.id}`}
                        className="inline-flex items-center gap-1.5 text-accent-text underline underline-offset-4"
                      >
                        <GraduationCap aria-hidden className="size-4" />
                        {t('Lesson: {title}', { title: lesson.title })}
                      </Link>
                    )}
                  </dd>
                )}
              </div>
            );
          })}
        </dl>
      )}
    </Page>
  );
}
