/**
 * Playwright Configuration for Ganado (Livestock Management)
 *
 * E2E tests for the ganado Next.js web app.
 * Runs inside the shared playwright-runner Docker container
 * connecting to ganado-frontend on proxy-net.
 */

import { defineConfig } from '@playwright/test';

const isDocker = process.env.CI === 'true';
const baseURL = isDocker ? 'http://ganado-frontend:3000' : 'http://localhost:3000';

export default defineConfig({
  testDir: './e2e',
  testMatch: ['**/*.spec.ts'],

  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],
    ['html', { outputFolder: isDocker ? '/results/ganado/html' : 'playwright-report', open: 'never' }],
    ['json', { outputFile: isDocker ? '/results/ganado/results.json' : 'playwright-results.json' }],
  ],

  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    locale: 'es-CO',
  },

  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],

  timeout: 60_000,
  expect: { timeout: 10_000 },
  outputDir: isDocker ? '/results/ganado/artifacts/' : 'test-results/',
});
