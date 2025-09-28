import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
    babel: {
      plugins: [['styled-jsx/babel', { "optimizeForSpeed": true }]]
    }
  })],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules/**', 'e2e/**', '.next/**', 'out/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      exclude: [
        'node_modules/**',
        '__tests__/**',
        '*.config.*',
        'next.config.js',
        'next-env.d.ts',
        '.next/**',
        'dist/**',
        'coverage/**',
        'vitest.d.ts',
        'test-results/**'
      ],
      thresholds: {
        global: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': '.'
    }
  }
})