import { test, expect } from "@playwright/test";

test("Nuovo Artefatto", async ({ page }) => {
  await page.goto("/home");

  await page.getByRole("main").getByRole("link", { name: "Nuovo Artefatto" }).click();

  await page.getByRole("button", { name: "BPMN Process Definizione di" }).click();

  const nameField = page.getByRole("textbox", { name: "es. Processo approvazione" });
  await nameField.fill("Test automatico");
  await nameField.press("Tab");

  await page.getByRole("button", { name: "Crea Artefatto" }).click();
  await page.getByRole("button", { name: "Salva" }).click();

  await expect(page).not.toHaveURL(/\/new-artifact(?:\?|$)/);
});
