import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

const FEATURES = [
  'dashboard', 'lessons', 'trainer', 'glossary', 'workspace', 'paper-trading', 'options',
  'replay', 'backtester', 'journal', 'analytics', 'tools', 'settings',
];

// A feature may import another feature only through its index.ts.
const featureBoundaries = FEATURES.map((name) => ({
  files: [`src/features/!(${name})/**/*.{ts,tsx}`, 'src/app/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [{
        group: [`@/features/${name}/*`],
        message: `Import from '@/features/${name}' (its index.ts), not its internals.`,
      }],
    }],
  },
}));

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'public'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: { ecmaVersion: 2023, globals: globals.browser },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  {
    // lib/ is pure TypeScript: no React, no stores, no features.
    files: ['src/lib/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['react', 'react-dom', 'react-*', '@/stores/*', '@/features/*', '@/components/*', '@/app/*'],
          message: 'lib/ must stay pure TypeScript.',
        }],
      }],
    },
  },
  {
    // Shared code never depends on a feature.
    files: ['src/components/**/*.{ts,tsx}', 'src/stores/**/*.ts', 'src/content/**/*.ts', 'src/types/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{ group: ['@/features/*'], message: 'Shared code must not import from features.' }],
      }],
    },
  },
  ...featureBoundaries,
);
