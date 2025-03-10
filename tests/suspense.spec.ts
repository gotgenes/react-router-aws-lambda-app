import { SuspensePage } from "./pages/suspense";
import { test, expect } from "@playwright/test";

test("Displays placeholder text initially", async ({ page }) => {
  const suspensePage = new SuspensePage(page);
  await suspensePage.goto();
  await expect(suspensePage.pageTitle).toBeVisible();
  await expect(suspensePage.placeholderText).toBeVisible();
});
