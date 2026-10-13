import type { GlossaryEntry, LessonBlock } from '@/types';

export type TextSegment =
  | { type: 'text'; text: string }
  | { type: 'bold'; text: string }
  | { type: 'term'; text: string; id: string };

interface Phrase {
  phrase: string;
  id: string;
}

export interface GlossaryMatcher {
  pattern: RegExp;
  idOf: Map<string, string>;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Builds one regular expression that finds any glossary term or alias.
 * Longer phrases come first so "stop-loss order" wins over "stop-loss".
 */
export function buildMatcher(entries: GlossaryEntry[]): GlossaryMatcher {
  const phrases: Phrase[] = [];
  for (const entry of entries) {
    const linkable = entry.autoLink === false ? entry.aliases : [entry.term, ...entry.aliases];
    for (const phrase of linkable) phrases.push({ phrase: phrase.toLowerCase(), id: entry.id });
  }
  phrases.sort((a, b) => b.phrase.length - a.phrase.length);
  const idOf = new Map<string, string>();
  for (const p of phrases) if (!idOf.has(p.phrase)) idOf.set(p.phrase, p.id);
  const body = [...idOf.keys()].map(escapeRegExp).join('|');
  // Not preceded or followed by a letter, digit or hyphen, so "short" does not match inside "shortly".
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}-])(${body || '(?!)'})(?![\\p{L}\\p{N}-])`, 'giu');
  return { pattern, idOf };
}

/**
 * Splits lesson text into plain, bold and glossary-term segments.
 *
 * - `**text**` becomes bold.
 * - Each glossary term is linked the first time it appears; `seen` carries
 *   the ids already linked so one term is not underlined again and again.
 * - Terms inside bold text are left alone.
 */
export function linkGlossary(text: string, matcher: GlossaryMatcher, seen: Set<string> = new Set()): TextSegment[] {
  const out: TextSegment[] = [];
  const push = (segment: TextSegment) => {
    const last = out[out.length - 1];
    if (segment.type === 'text' && last?.type === 'text') last.text += segment.text;
    else if (segment.text) out.push(segment);
  };

  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  for (const part of parts) {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      push({ type: 'bold', text: part.slice(2, -2) });
      continue;
    }
    let cursor = 0;
    matcher.pattern.lastIndex = 0;
    for (const match of part.matchAll(matcher.pattern)) {
      const id = matcher.idOf.get(match[0].toLowerCase());
      if (!id || seen.has(id)) continue;
      seen.add(id);
      push({ type: 'text', text: part.slice(cursor, match.index) });
      push({ type: 'term', text: match[0], id });
      cursor = match.index + match[0].length;
    }
    push({ type: 'text', text: part.slice(cursor) });
  }
  return out;
}

/**
 * Links every block of a lesson in reading order, so each glossary term is
 * linked once per lesson, at its first appearance. Returns, for each block,
 * the segments of each piece of running text in it (in the order the block
 * lists them); blocks with no running text get an empty list.
 */
export function linkLessonBlocks(blocks: LessonBlock[], matcher: GlossaryMatcher): TextSegment[][][] {
  const seen = new Set<string>();
  const link = (text: string) => linkGlossary(text, matcher, seen);
  return blocks.map((block) => {
    switch (block.type) {
      case 'paragraph':
        return [link(block.text)];
      case 'list':
        return block.items.map(link);
      case 'callout':
        return [link(block.text)];
      case 'worked-example':
        return block.steps.map(link);
      default:
        return [];
    }
  });
}
