/**
 * Translation. The app is written in English, and the English text itself is
 * the key: `t('Buy / Long')` returns the Chinese when the app is in Chinese
 * and the English otherwise, so any text without a translation still reads.
 *
 * - `{name}` placeholders are filled from `vars` after translating, so the
 *   translation can put them in a different order.
 * - `context::Text` tells apart one English word with two meanings (see
 *   `withoutContext`).
 * - Dictionaries are keyed by a hash of the English (see `textKey`) so long
 *   lesson paragraphs do not have to be repeated in full as keys.
 * - Only the dictionary for the chosen language is downloaded, before the
 *   app first renders. Changing language reloads the page.
 *
 * Pure TypeScript: lib/ may use it.
 */

export type Locale = 'en' | 'zh-Hant';

export const LOCALES: { id: Locale; name: string }[] = [
  { id: 'en', name: 'English' },
  { id: 'zh-Hant', name: '繁體中文' },
];

/** A dictionary: translation keyed by `textKey(english)`. */
export type Dictionary = Map<string, string>;

let current: Locale = 'en';
let dictionary: Dictionary = new Map();

/**
 * Short, stable key for a piece of English text (cyrb53, base 36). 53 bits
 * keep collisions out of reach for a few thousand strings.
 */
export function textKey(text: string): string {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < text.length; i++) {
    const ch = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

/**
 * A word with two meanings in English but not in other languages gets a
 * context before '::', such as t('position::Close') beside t('Close') for a
 * closing price. The context picks the translation and is never shown.
 */
function withoutContext(text: string): string {
  const i = text.indexOf('::');
  return i > 0 && /^[a-z-]+$/.test(text.slice(0, i)) ? text.slice(i + 2) : text;
}

function fill(text: string, vars?: Record<string, string | number>): string {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (whole, name: string) => (name in vars ? String(vars[name]) : whole));
}

/** Translates English text into the current language, then fills `{name}` placeholders. */
export function t(text: string, vars?: Record<string, string | number>): string {
  if (current === 'en' || !text) return fill(withoutContext(text), vars);
  return fill(dictionary.get(textKey(text)) ?? withoutContext(text), vars);
}

/**
 * Marks English text kept in data (menus, tab lists, option lists) that is
 * translated later, with `t(item.label)` where it is drawn. Returns the text
 * unchanged. It exists so the translation test can find these strings: data
 * is built once at import, before a language is known, so it cannot call t().
 */
export function msg(text: string): string {
  return text;
}

/** True when `text` has a translation in the current language (always true in English). */
export function hasTranslation(text: string): boolean {
  return current === 'en' || dictionary.has(textKey(text));
}

export function getLocale(): Locale {
  return current;
}

/** The language tag for `Intl` and `toLocaleString`, so dates follow the app's language rather than the browser's. */
export function intlLocale(locale: Locale = current): string {
  return locale === 'zh-Hant' ? 'zh-HK' : 'en-US';
}

/** The `lang` attribute for <html>. */
export function htmlLang(locale: Locale = current): string {
  return locale === 'zh-Hant' ? 'zh-Hant-HK' : 'en';
}

/** First-visit language: Traditional Chinese for Hong Kong, Taiwan and Macau browsers, English otherwise. */
export function detectLocale(languages: readonly string[] = typeof navigator === 'undefined' ? [] : navigator.languages): Locale {
  for (const lang of languages) {
    const l = lang.toLowerCase();
    if (l.startsWith('zh')) return /hant|tw|hk|mo/.test(l) ? 'zh-Hant' : 'en';
    if (l.startsWith('en')) return 'en';
  }
  return 'en';
}

/** Downloads the dictionary for `locale` and makes it current. Call before the first render. */
export async function loadLocale(locale: Locale): Promise<void> {
  if (locale === 'zh-Hant') {
    const { buildDictionary } = await import('./zh-Hant');
    dictionary = buildDictionary();
  } else {
    dictionary = new Map();
  }
  current = locale;
}

/** For tests: switch language with a dictionary already in hand. */
export function setDictionaryForTests(locale: Locale, dict: Dictionary): void {
  current = locale;
  dictionary = dict;
}
