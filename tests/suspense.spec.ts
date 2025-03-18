import { SuspensePage } from "./pages/suspense";
import { test, expect } from "@playwright/test";

test("Displays placeholder text initially", async ({ page }) => {
  const suspensePage = new SuspensePage(page);
  await suspensePage.goto();
  // The suspended state does not seem to be accessible in Playwright.
  // See https://github.com/microsoft/playwright/issues/17199
  // await expect(suspensePage.pageTitle).toBeVisible();
  // await expect(suspensePage.placeholderText).toBeVisible();
  await expect(suspensePage.suspendedText).toBeVisible();
});
