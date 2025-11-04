const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const typescriptParser = require('@typescript-eslint/parser');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const importPlugin = require('eslint-plugin-import');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  // Ignore patterns
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/out/**',
      '**/build/**',
      '**/dist/**',
      '**/.git/**',
      '**/coverage/**',
      '**/*.config.js',
      '**/*.config.mjs',
      '**/*.config.ts',
    ],
  },

  // Base configuration
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },

  // Extend Next.js and Prettier configs
  ...compat.extends('next/core-web-vitals', 'prettier'),

  // TypeScript plugin
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },

  // Named exports enforcement
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/no-default-export': 'error',
    },
    ignores: [
      'src/app/**/page.tsx',
      'src/app/**/page.ts',
      'src/app/**/layout.tsx',
      'src/app/**/layout.ts',
      'src/app/**/error.tsx',
      'src/app/**/loading.tsx',
      'src/app/**/not-found.tsx',
      'src/app/**/template.tsx',
      'src/app/**/default.tsx',
      'src/app/**/route.ts',
      'src/middleware.ts',
      'src/**/middleware.ts',
    ],
  },

  // Allow Next.js app router defaults
  {
    files: ['**/app/**/page.{ts,tsx}', '**/app/**/layout.{ts,tsx}'],
    rules: {
      'import/no-default-export': 'off',
    },
  },

  // Complexity guardrails for Directors Studio page
  {
    files: ['src/app/(main)/directors-studio/page.tsx'],
    rules: {
      complexity: ['error', 8],
      'max-lines-per-function': [
        'error',
        { max: 50, skipBlankLines: true, skipComments: true },
      ],
      'max-lines': [
        'error',
        { max: 300, skipBlankLines: true, skipComments: true },
      ],
    },
  },
];
