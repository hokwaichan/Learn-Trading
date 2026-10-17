import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { contentStrings } from './contentStrings';
import { detectLocale, setDictionaryForTests, t, textKey } from './index';
import { CONTENT } from './zh-Hant/content';
import { UI } from './zh-Hant/ui';
import { buildDictionary } from './zh-Hant';

const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === 'i18n' ? [] : sourceFiles(path);
    return /\.tsx?$/.test(name) && !name.endsWith('.test.ts') ? [path] : [];
  });
}

/** Every string literal passed straight to t() or msg(), or as <Trans text>, in the app's source. */
function uiStrings(): Map<string, string> {
  const found = new Map<string, string>();
  for (const file of sourceFiles(join(process.cwd(), 'src'))) {
    const source = readFileSync(file, 'utf8');
    for (const m of source.matchAll(/\b(?:t|msg)\(\s*'((?:[^'\\]|\\.)*)'/g)) found.set(m[1].replace(/\\(.)/g, '$1'), file);
    for (const m of source.matchAll(/\b(?:t|msg)\(\s*"((?:[^"\\]|\\.)*)"/g)) found.set(m[1].replace(/\\(.)/g, '$1'), file);
    for (const m of source.matchAll(/<Trans\s+text="([^"]*)"/g)) found.set(m[1], file);
  }
  return found;
}

describe('t()', () => {
  afterEach(() => setDictionaryForTests('en', new Map()));

  it('returns the English, with placeholders filled, when there is no translation', () => {
    expect(t('Buy {qty} BTC', { qty: 2 })).toBe('Buy 2 BTC');
    setDictionaryForTests('zh-Hant', new Map());
    expect(t('Not translated')).toBe('Not translated');
  });

  it('translates, and fills placeholders in the translated order', () => {
    setDictionaryForTests('zh-Hant', new Map([[textKey('{n} of {total} lessons'), '{total} 課中的 {n} 課']]));
    expect(t('{n} of {total} lessons', { n: 3, total: 86 })).toBe('86 課中的 3 課');
  });

  it('drops a context prefix in English, and uses it to pick the translation', () => {
    expect(t('position::Close')).toBe('Close');
    setDictionaryForTests('zh-Hant', new Map([[textKey('position::Close'), '平倉'], [textKey('Close'), '收市']]));
    expect(t('position::Close')).toBe('平倉');
    expect(t('Close')).toBe('收市');
    expect(t('other::Close')).toBe('Close');
  });

  it('gives different texts different keys', () => {
    expect(textKey('Long')).not.toBe(textKey('long'));
    expect(textKey('a')).toMatch(/^[0-9a-z]+$/);
  });

  it('picks Traditional Chinese for Hong Kong, Taiwan and Macau browsers only', () => {
    expect(detectLocale(['zh-HK'])).toBe('zh-Hant');
    expect(detectLocale(['zh-TW', 'en'])).toBe('zh-Hant');
    expect(detectLocale(['zh-Hant-MO'])).toBe('zh-Hant');
    expect(detectLocale(['zh-CN'])).toBe('en');
    expect(detectLocale(['en-GB', 'zh-HK'])).toBe('en');
    expect(detectLocale([])).toBe('en');
  });
});

describe('Traditional Chinese', () => {
  it('translates every piece of lesson, quiz, glossary and other content', () => {
    const missing: string[] = [];
    for (const [group, texts] of Object.entries(contentStrings())) {
      const dict = CONTENT[group] ?? {};
      for (const text of texts) {
        const key = textKey(text);
        if (!(key in dict)) missing.push(`${group}.ts\n  // ${text}\n  '${key}': '',`);
      }
    }
    expect(missing, `Missing translations; add these entries:\n\n${missing.join('\n')}`).toEqual([]);
  });

  it('has no translations left over from English that has since changed', () => {
    const groups = contentStrings();
    const stale: string[] = [];
    for (const [group, dict] of Object.entries(CONTENT)) {
      const live = new Set((groups[group] ?? []).map(textKey));
      for (const key of Object.keys(dict)) if (!live.has(key)) stale.push(`${group}: '${key}'`);
    }
    expect(stale, 'Remove these entries: their English text no longer exists').toEqual([]);
  });

  it('translates every text the screens pass to t()', () => {
    const missing = [...uiStrings()].filter(([text]) => !(text in UI)).map(([text, file]) => `  ${JSON.stringify(text)}: '',  // ${file}`);
    expect(missing, `Add these to src/i18n/zh-Hant/ui.ts:\n${missing.join('\n')}`).toEqual([]);
  });

  it('keeps the same {placeholders} as the English', () => {
    const wrong = Object.entries(UI).filter(([en, zh]) => placeholders(en).join() !== placeholders(zh).join());
    expect(wrong).toEqual([]);
  });

  it('has no blank translations and no clashing keys', () => {
    const blank = [...Object.entries(UI), ...Object.values(CONTENT).flatMap((d) => Object.entries(d))].filter(([, zh]) => !zh.trim());
    expect(blank).toEqual([]);
    // Two different English texts must never share a key.
    const all = new Set([...Object.values(contentStrings()).flat(), ...Object.keys(UI)]);
    expect(new Set([...all].map(textKey)).size).toBe(all.size);
    expect(buildDictionary().size).toBeGreaterThan(0);
  });
});
