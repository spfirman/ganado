/**
 * Ganado — Smoke Tests
 *
 * Basic health checks to verify the web app loads correctly.
 */

import { test, expect } from '@playwright/test';

test.describe('Ganado Smoke Tests', () => {
  test('app loads successfully', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBeLessThan(400);
  });

  test('login page has form elements', async ({ page }) => {
    await page.goto('/');

    const emailInput = page.locator('input[name="email"], input[type="email"], input[name="username"]');
    const passwordInput = page.locator('input[type="password"]');

    await expect(emailInput.or(passwordInput)).toBeVisible({ timeout: 15_000 });
  });

  test('page has a title', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('no console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');
    // Use domcontentloaded instead of networkidle (SSE/WS keep network active)
    await page.waitForLoadState('domcontentloaded');
    // Give JS a moment to execute
    await page.waitForTimeout(2_000);

    expect(errors).toHaveLength(0);
  });
});
