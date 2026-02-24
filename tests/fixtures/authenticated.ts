import { test as base, expect, type Page } from '@playwright/test';

async function ensureAuthenticated(page: Page) {
  const baseUrl = 'http://localhost:5173';
  const tenantId = process.env.E2E_TENANT_ID ?? '-0000-0000-0000-000000000001';
  const appUrlPattern = new RegExp(
    `${baseUrl}/(home|catalogue|artifact|editor|publish)(?:/|\\?|$)`
  );

  await page.goto(`${baseUrl}/login`);

  const ssoButton = page.getByRole('button', { name: 'Accedi con SSO' });
  if (await ssoButton.isVisible({ timeout: 5000 }).catch(() => false)) {
    await ssoButton.click();

    const usernameField = page.getByRole('textbox', { name: 'Username or email' });
    if (await usernameField.isVisible({ timeout: 10000 }).catch(() => false)) {
      await usernameField.fill(process.env.E2E_USERNAME ?? 'developer');
      await page
        .getByRole('textbox', { name: 'Password' })
        .fill(process.env.E2E_PASSWORD ?? 'developer');
      await page.getByRole('button', { name: 'Sign In' }).click();
    }

    await page.waitForURL(`${baseUrl}/**`, { timeout: 60000 });
  }

  async function selectTenantIfNeeded() {
    if (!/\/select-tenant(?:\?|$)/.test(page.url())) {
      return;
    }

    const selectTenantHeading = page.getByRole('heading', { name: 'Seleziona Tenant' });
    await selectTenantHeading.waitFor({ state: 'visible', timeout: 20000 }).catch(() => undefined);

    const tenantButton = page.getByRole('button', { name: tenantId });
    if (await tenantButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await tenantButton.click();
    } else {
      const firstTenantButton = page
        .getByRole('button')
        .filter({ has: page.locator('div.font-mono') })
        .first();
      if (await firstTenantButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await firstTenantButton.click();
      }
    }

    const manualTenantInput = page.getByPlaceholder('00000000-0000-0000-0000-000000000001');
    const continueButton = page.getByRole('button', { name: 'Continua' });
    if (await continueButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      if (await manualTenantInput.isVisible({ timeout: 1000 }).catch(() => false)) {
        await manualTenantInput.fill(tenantId);
      }
      await continueButton.click();
    }

    await page.waitForURL(appUrlPattern, { timeout: 20000 }).catch(() => undefined);
  }

  await selectTenantIfNeeded();
  await page.goto(`${baseUrl}/home`, { waitUntil: 'domcontentloaded' }).catch(() => undefined);
  await selectTenantIfNeeded();
  await page.waitForURL(appUrlPattern, { timeout: 20000 });
  await expect(page).not.toHaveURL(/\/login(?:\?|$)/);
  await expect(page).not.toHaveURL(/\/select-tenant(?:\?|$)/);
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
