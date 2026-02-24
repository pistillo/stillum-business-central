import { test as base, expect, type Page } from '@playwright/test';

async function ensureAuthenticated(page: Page) {
  await page.goto('http://localhost:5173/login');
  if (!page.url().endsWith('/login')) {
    return;
  }

  await page.getByRole('button', { name: 'Accedi con SSO' }).click();

  const usernameField = page.getByRole('textbox', { name: 'Username or email' });
  if (await usernameField.isVisible().catch(() => false)) {
    await usernameField.fill(process.env.E2E_USERNAME ?? 'developer');
    await page.getByRole('textbox', { name: 'Password' }).fill(process.env.E2E_PASSWORD ?? 'developer');
    await page.getByRole('button', { name: 'Sign In' }).click();
  }

  const tenantId = process.env.E2E_TENANT_ID ?? '-0000-0000-0000-000000000001';
  const tenantButton = page.getByRole('button', { name: tenantId });
  if (await tenantButton.isVisible().catch(() => false)) {
    await tenantButton.click();
  }

  await expect(page).not.toHaveURL('http://localhost:5173/login');
}

export const test = base.extend({
  page: async ({ browser, browserName }, use) => {
    const context =
      browserName === 'firefox'
        ? await browser.newContext()
        : await browser.newContext({ storageState: 'playwright/.auth/state.json' });
    const page = await context.newPage();
    await ensureAuthenticated(page);
    await use(page);
    await context.close();
  },
});

export { expect };
