import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { contrastRatio } from '@/lib/contrast';

const css = readFileSync(fileURLToPath(new URL('./theme.css', import.meta.url)), 'utf8');

function block(selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`);
  if (start < 0) throw new Error(`selector not found: ${selector}`);
  const body = css.slice(css.indexOf('{', start) + 1, css.indexOf('}', start));
  const vars: Record<string, string> = {};
  for (const m of body.matchAll(/--c-([\w-]+):\s*(#[0-9a-f]{6})/gi)) vars[m[1]] = m[2];
  return vars;
}

const dark = block("[data-theme='dark']");
const light = block("[data-theme='light']");
const themes = {
  dark,
  light,
  'dark colour-blind': { ...dark, ...block("[data-cb='true']") },
  'light colour-blind': { ...light, ...block("[data-cb='true']"), ...block("[data-theme='light'][data-cb='true']") },
};

const AA = 4.5;
const TEXT = ['fg', 'muted', 'accent-text', 'up-text', 'down-text', 'warning-text'];
const SURFACES = ['bg', 'surface', 'raised'];
const SOLIDS = ['accent', 'up', 'down', 'warning'];

describe.each(Object.entries(themes))('%s theme contrast', (_name, t) => {
  it.each(TEXT.flatMap((text) => SURFACES.map((s) => [text, s] as const)))(
    '%s on %s meets AA',
    (text, surface) => {
      expect(contrastRatio(t[text], t[surface])).toBeGreaterThanOrEqual(AA);
    },
  );

  it.each(SOLIDS)('on-solid text on %s fill meets AA', (solid) => {
    expect(contrastRatio(t['on-solid'], t[solid])).toBeGreaterThanOrEqual(AA);
  });

  it('indicator palette is readable on the chart background', () => {
    for (let i = 1; i <= 6; i++) {
      expect(contrastRatio(t[`series-${i}`], t.surface)).toBeGreaterThanOrEqual(AA);
    }
  });
});

describe('spec colours', () => {
  it('keeps the specified base palette', () => {
    expect(dark).toMatchObject({
      bg: '#0b0e14', surface: '#131722', raised: '#1c2030', border: '#2a2e39',
      fg: '#e6e8ee', muted: '#9096a5', accent: '#3b82f6', up: '#26a69a', down: '#ef5350', warning: '#f5a524',
    });
    expect(light).toMatchObject({
      bg: '#f7f8fa', surface: '#ffffff', raised: '#ffffff', border: '#e1e4ea',
      fg: '#131722', muted: '#5d6472', accent: '#3b82f6', up: '#26a69a', down: '#ef5350', warning: '#f5a524',
    });
  });
});
