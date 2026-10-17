import { GLOSSARY } from '@/content/glossary';
import { INDICATOR_INFO } from '@/content/indicators';
import { MODULES } from '@/content/lessons';
import { PATTERNS } from '@/content/patterns';
import { QUIZZES } from '@/content/quizzes';
import { BACKTEST_PRESETS, OPTION_STRATEGIES, OUTLOOK_SCENARIOS } from '@/content/strategies';
import { t } from './index';

/**
 * The teaching text in content/: what needs translating, and translating it.
 *
 * Content stays plain English data. When the app runs in another language,
 * `localizeContent` swaps every reader-facing string in it for its
 * translation once, at startup, before any screen is drawn; so lessons,
 * quizzes, the glossary and the rest need no translation code of their own.
 */

/** Fields that hold ids, enums or code rather than reader-facing text. */
const NOT_TEXT = new Set([
  'id', 'moduleId', 'lessonId', 'quizId', 'correctChoiceId', 'lesson', 'symbol', 'timeframe', 'type', 'kind',
  'tone', 'widget', 'family', 'bias', 'detectorId', 'outlook', 'seeAlso', 'related', 'aliases', 'indicator',
  'comparator', 'side', 'direction', 'expiry', 'source', 'strategy', 'operand', 'output', 'field', 'sizing',
  'answer', 'distractors', 'combine', 'op', 'english', 'focus',
]);

/** Candle data and indicator parameters carry no text. */
const NO_TEXT_INSIDE = new Set(['candles', 'params']);

const isText = (s: string) => /[A-Za-z]/.test(s);

/** Calls `visit` for each reader-facing string in `value`; its return value replaces the string. */
function walk(value: unknown, visit: (text: string) => string): unknown {
  if (typeof value === 'string') return isText(value) ? visit(value) : value;
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) value[i] = walk(value[i], visit);
  } else if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    for (const [k, v] of Object.entries(record)) {
      if (NOT_TEXT.has(k) || NO_TEXT_INSIDE.has(k) || typeof v === 'function') continue;
      record[k] = walk(v, visit);
    }
  }
  return value;
}

/**
 * Content grouped by the dictionary file its translation lives in: one per
 * lesson module (its lessons and their quizzes), plus glossary, patterns,
 * strategies and indicators.
 */
function contentGroups(): Record<string, unknown[]> {
  const groups: Record<string, unknown[]> = {};
  for (const module of MODULES) {
    const quizzes = QUIZZES.filter((q) => module.lessons.some((l) => l.quizId === q.id));
    groups[`${String(module.order).padStart(2, '0')}-${module.id}`] = [module, quizzes];
  }
  groups.glossary = [GLOSSARY];
  groups.patterns = [PATTERNS];
  groups.strategies = [OPTION_STRATEGIES, OUTLOOK_SCENARIOS, BACKTEST_PRESETS];
  groups.indicators = [Object.values(INDICATOR_INFO)];
  return groups;
}

/** Dictionary file name -> the English strings it must translate. Read-only. */
export function contentStrings(): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const [name, roots] of Object.entries(contentGroups())) {
    const found = new Set<string>();
    // Walk a copy so collecting never changes the content itself.
    walk(JSON.parse(JSON.stringify(roots)), (text) => (found.add(text), text));
    out[name] = [...found];
  }
  return out;
}

let localized = false;

/**
 * Replaces the English in all content with the current language, in place.
 * Run once, after `loadLocale` and before the app is imported, so that
 * anything built from content at import time (sorted lists, the glossary
 * matcher) is built from the translated text.
 */
export function localizeContent(): void {
  if (localized) return;
  localized = true;
  // Keep each glossary term's English: it is shown beside the translation,
  // and English abbreviations such as "RSI" still link inside lesson text.
  for (const entry of GLOSSARY) {
    entry.english = entry.term;
    if (!entry.aliases.includes(entry.term)) entry.aliases = [...entry.aliases, entry.term];
  }
  for (const roots of Object.values(contentGroups())) walk(roots, (text) => t(text));
}
