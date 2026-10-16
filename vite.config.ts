/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  // Served from a sub-folder on GitHub Pages (https://<user>.github.io/<repo>/). The deploy
  // workflow sets BASE_PATH; locally the app runs at the root.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { port: 5173, strictPort: false },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
