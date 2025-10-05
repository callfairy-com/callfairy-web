import { test, expect } from '@playwright/test';

const routes = [
  { path: '/terms-of-service', name: 'terms' },
  { path: '/privacy-policy', name: 'privacy' },
  { path: '/cookie-policy', name: 'cookies' },
  { path: '/security', name: 'security' },
];

for (const r of routes) {
  test.describe(`Legal page visual regression: ${r.name}`, () => {
    test(`light vs dark: ${r.name}`, async ({ page }) => {
      // Light mode
      await page.goto(r.path);
      // Wait for main content
      await page.waitForSelector('main');
      await expect(page).toHaveScreenshot(`${r.name}-light.png`, { fullPage: true });

      // Dark mode by adding the Tailwind dark class to <html>
      await page.evaluate(() => document.documentElement.classList.add('dark'));
      await page.waitForTimeout(100); // allow repaint
      await expect(page).toHaveScreenshot(`${r.name}-dark.png`, { fullPage: true });
    });
  });
}
