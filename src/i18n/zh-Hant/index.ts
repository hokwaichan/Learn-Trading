import { textKey, type Dictionary } from '../index';
import { CONTENT } from './content';
import { UI } from './ui';

/**
 * Traditional Chinese (Hong Kong usage: 期權, 止蝕, 保證金, 陰陽燭).
 *
 * - ui.ts: screens, buttons and messages, keyed by the English text.
 * - content/*.ts: lessons, quizzes, glossary and the rest of content/, keyed
 *   by `textKey(english)` with the English as a comment above each entry.
 *
 * `npm test` fails when a piece of content has no translation, and prints
 * the entries to add.
 */
export function buildDictionary(): Dictionary {
  const map: Dictionary = new Map();
  for (const group of Object.values(CONTENT)) for (const [key, text] of Object.entries(group)) map.set(key, text);
  for (const [english, text] of Object.entries(UI)) map.set(textKey(english), text);
  return map;
}
