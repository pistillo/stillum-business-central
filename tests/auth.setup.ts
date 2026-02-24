import { test as setup, expect } from '@playwright/test';
import { mkdirSync } from 'fs';

const storageStatePath = 'playwright/.auth/state.json';

setup('auth', async ({ page }) => {
  mkdirSync('playwright/.auth', { recursive: true });

  await page.goto('/login');
  await page.getByRole('button', { name: 'Accedi con SSO' }).click();

  const usernameField = page.getByRole('textbox', { name: 'Username or email' });
  await usernameField.fill(process.env.E2E_USERNAME ?? 'developer');
  await usernameField.press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.E2E_PASSWORD ?? 'developer');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('/**');
  await expect(page).not.toHaveURL('/login');
  await page.context().storageState({ path: storageStatePath });
});
