const nextConfig = require('eslint-config-next');

const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'out/**',
      'dist/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      'coverage/**',
      '*.config.js',
      '*.config.ts',
      'vitest.d.ts',
      'next-env.d.ts',
    ],
  },
  ...nextConfig,
  {
    settings: {
      react: {
        version: '19',
      },
    },
  },
];

module.exports = eslintConfig;