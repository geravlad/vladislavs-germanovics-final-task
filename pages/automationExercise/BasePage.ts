import { Locator, Page } from "@playwright/test";

export class BasePage {
    // Locators
    readonly consentButton: Locator;

    constructor(readonly page: Page) {
        this.consentButton = page.getByRole('button', { name: 'Consent' });
    }

    // Methods
    async clickConsentButton() {
        if (await this.consentButton.isVisible({ timeout: 5000 }).catch(() => false)) {
            await this.consentButton.click();
        }
    }
}