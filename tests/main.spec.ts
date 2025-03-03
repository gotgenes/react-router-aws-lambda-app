import { MainPage } from "./pages/main.ts";
import { test, expect } from "@playwright/test";

test('Displays "What\'s next?" on the main page', async ({ page }) => {
  const mainPage = new MainPage(page);
  await mainPage.goto();
  const isVisible = await mainPage.isWhatsNetTextVisible();
  expect(isVisible).toBe(true);
});
