import { test, expect } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test('login', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.getByRole('button').filter({ hasText: /^$/ }).click();
  await page.getByRole('menuitem', { name: 'Scuro' }).click();
  await page.getByRole('button', { name: 'Accedi con SSO' }).click();
  await page.getByRole('textbox', { name: 'Username or email' }).click();
  await page
    .getByRole('textbox', { name: 'Username or email' })
    .fill(process.env.E2E_USERNAME ?? 'developer');
  await page.getByRole('textbox', { name: 'Username or email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.E2E_PASSWORD ?? 'developer');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page
    .getByRole('button', { name: process.env.E2E_TENANT_ID ?? '-0000-0000-0000-000000000001' })
    .click();
  await expect(page).not.toHaveURL('http://localhost:5173/login');
});
