// Downloads the pictures used in lessons from Wikimedia Commons and records who
// made each one and under which licence.
//
//   npm run fetch-images            (only images not downloaded yet)
//   npm run fetch-images -- --all   (download every image again)
//
// The list lives in scripts/lesson-images.json: { "<id>": { "file": "<Commons file
// name>", "width": 800 } }. Each image is saved to public/images/lessons/<id>.<ext>
// at that width (SVGs arrive as PNG renders), and src/content/images.ts is
// rewritten with its size and credit. Only public-domain and Creative Commons
// licences are accepted.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const LIST = join(ROOT, 'scripts', 'lesson-images.json');
const OUT_DIR = join(ROOT, 'public', 'images', 'lessons');
const REGISTRY = join(ROOT, 'src', 'content', 'images.ts');
const API = 'https://commons.wikimedia.org/w/api.php';
// Wikimedia asks automated clients to identify themselves.
const UA = 'TradeSchool/1.0 (https://github.com/hokwaichan/Learn-Trading; lesson image fetcher)';
const ALLOWED = /^(cc0|public domain|pd\b|pdm|cc[ -]by(-sa)?[ -]\d)/i;

const all = process.argv.includes('--all');
const list = JSON.parse(readFileSync(LIST, 'utf8'));
const previous = existsSync(REGISTRY) ? readRegistry() : {};
mkdirSync(OUT_DIR, { recursive: true });

const strip = (html = '') =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

async function getJson(url) {
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error(`${r.status} for ${url}`);
  return r.json();
}

async function fetchOne(id, { file, width = 800 }) {
  const params = new URLSearchParams({
    action: 'query', format: 'json', formatversion: '2', titles: `File:${file}`,
    prop: 'imageinfo', iiprop: 'url|size|user|extmetadata', iiurlwidth: String(width),
  });
  const page = (await getJson(`${API}?${params}`)).query.pages[0];
  if (page.missing || !page.imageinfo) throw new Error(`${id}: no Commons file named "${file}"`);
  const info = page.imageinfo[0];
  const meta = info.extmetadata ?? {};
  const license = strip(meta.LicenseShortName?.value) || 'Unknown';
  if (!ALLOWED.test(license)) throw new Error(`${id}: licence "${license}" is not public domain or Creative Commons`);

  const src = info.thumburl ?? info.url;
  const ext = (src.match(/\.(png|jpe?g|gif|webp)(?:$|\?)/i)?.[1] ?? 'png').toLowerCase().replace('jpeg', 'jpg');
  const r = await fetch(src, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error(`${id}: download failed with ${r.status}`);
  const name = `${id}.${ext}`;
  writeFileSync(join(OUT_DIR, name), Buffer.from(await r.arrayBuffer()));

  // "Own work" is how uploaders say they made it themselves; credit them by name instead.
  const artist = strip(meta.Artist?.value);
  const author = !artist || /^own work$/i.test(artist) ? info.user ?? 'Unknown author' : artist;

  return {
    file: name,
    width: info.thumbwidth ?? info.width,
    height: info.thumbheight ?? info.height,
    author,
    license,
    licenseUrl: meta.LicenseUrl?.value ?? null,
    source: info.descriptionurl,
  };
}

function readRegistry() {
  const text = readFileSync(REGISTRY, 'utf8');
  const start = text.indexOf('{', text.indexOf('IMAGES'));
  try {
    return JSON.parse(text.slice(start, text.lastIndexOf('}') + 1));
  } catch {
    return {};
  }
}

/**
 * Versions of a picture with its drawn-in labels translated, made by hand from the
 * Commons original (allowed by its licence) and saved beside it, such as
 * candle-scheme.zh-Hant.png. The list names them: "localized": { "zh-Hant": "<file>" }.
 */
function localized(id, entry) {
  if (!entry.localized) return undefined;
  const out = {};
  for (const [locale, file] of Object.entries(entry.localized)) {
    const path = join(OUT_DIR, file);
    if (!existsSync(path)) throw new Error(`${id}: ${locale} version ${file} is missing from public/images/lessons`);
    const png = readFileSync(path);
    if (png.toString('ascii', 1, 4) !== 'PNG') throw new Error(`${id}: ${file} is not a PNG`);
    out[locale] = { file, width: png.readUInt32BE(16), height: png.readUInt32BE(20) };
  }
  return out;
}

const result = {};
let failed = 0;
for (const [id, entry] of Object.entries(list)) {
  const kept = previous[id];
  try {
    if (!all && kept && existsSync(join(OUT_DIR, kept.file))) {
      result[id] = kept;
    } else {
      result[id] = await fetchOne(id, entry);
      console.log(`fetched  ${id}  (${result[id].license}, ${result[id].author})`);
    }
    const versions = localized(id, entry);
    if (versions) result[id] = { ...result[id], localized: versions };
    else delete result[id].localized;
  } catch (e) {
    delete result[id];
    failed++;
    console.error(`failed   ${e.message}`);
  }
}

writeFileSync(
  REGISTRY,
  `// Generated by scripts/fetch-lesson-images.mjs from scripts/lesson-images.json. Do not edit.
import type { LessonImage } from '@/types';

export const IMAGES: Record<string, LessonImage> = ${JSON.stringify(result, null, 2)};
`,
);
console.log(`\n${Object.keys(result).length} images in src/content/images.ts${failed ? `, ${failed} failed` : ''}`);
if (failed) process.exitCode = 1;
