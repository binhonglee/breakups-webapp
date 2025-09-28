const { FlatCompat } = require('@eslint/eslintrc');
const path = require('path');

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'out/**',
      'dist/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      '*.config.js',
      '*.config.ts',
      'vitest.d.ts',
      'next-env.d.ts',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
];

module.exports = eslintConfig;