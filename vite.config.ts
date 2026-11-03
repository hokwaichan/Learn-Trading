/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import type { Plugin } from 'vite';

const root = fileURLToPath(new URL('.', import.meta.url));

/** Every file under `dir`, as paths relative to it with forward slashes. */
function listFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? listFiles(path).map((f) => `${name}/${f}`) : [name];
  });
}

/**
 * Writes dist/sw.js from pwa/service-worker.js, listing every built file and every
 * file in public/ (lesson pictures, bundled prices, icons) so the installed app works
 * offline. The version is a hash of all of them, so each deploy updates installed copies.
 */
function offline(): Plugin {
  return {
    name: 'tradeschool-offline',
    apply: 'build',
    generateBundle(_options, bundle) {
      const publicDir = join(root, 'public');
      const publicFiles = listFiles(publicDir);
      const built = Object.keys(bundle).filter((f) => f !== 'index.html' && !f.endsWith('.map'));
      const files = [...new Set([...built, ...publicFiles])].sort();
      const hash = createHash('sha256').update(built.join('\n'));
      for (const f of publicFiles) hash.update(f).update(readFileSync(join(publicDir, f)));
      const source = readFileSync(join(root, 'pwa', 'service-worker.js'), 'utf8')
        .replace("const VERSION = '__VERSION__';", () => `const VERSION = ${JSON.stringify(hash.digest('hex').slice(0, 12))};`)
        .replace('const FILES = __FILES__;', () => `const FILES = ${JSON.stringify(files)};`);
      if (source.includes("= '__VERSION__'") || source.includes('= __FILES__')) throw new Error('pwa/service-worker.js: placeholders not filled in');
      this.emitFile({ type: 'asset', fileName: 'sw.js', source });
    },
  };
}

export default defineConfig({
  // Served from a sub-folder on GitHub Pages (https://<user>.github.io/<repo>/). The deploy
  // workflow sets BASE_PATH; locally the app runs at the root.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss(), offline()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { port: 5173, strictPort: false },
  // The Traditional Chinese dictionary (every lesson, quiz and glossary entry) is one ~540 kB
  // chunk. It is only fetched when that language is selected, so the default limit is raised
  // just above it.
  build: { chunkSizeWarningLimit: 600 },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
