import { Locator, Page } from "@playwright/test";

export class SuspensePage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly placeholderText: Locator;
  readonly suspendedText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = this.page.getByRole("heading", { name: "Suspense Demo" });
    this.placeholderText = this.page.getByText("loading");
    this.suspendedText = this.page.getByText("revealed");
  }

  async goto() {
    await this.page.goto("/suspense");
  }
}
