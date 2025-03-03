import { Page } from "@playwright/test";

export class MainPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/");
  }

  async isWhatsNetTextVisible(): Promise<boolean> {
    const textLocator = this.page.getByText("What's next?");
    return await textLocator.isVisible();
  }
}
