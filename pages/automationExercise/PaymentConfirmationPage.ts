import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class PaymentConfirmationPage extends BasePage {
    //Locators
    readonly orderPlacedHeading: Locator;

    constructor(page: Page) {
        super(page);

        this.orderPlacedHeading = page.locator('[data-qa="order-placed"]');
    }

    async assertOrderPlaced() {
        await expect(this.orderPlacedHeading).toBeVisible();
        await expect(this.orderPlacedHeading).toContainText('Order Placed!');
    }

    async assertUrlContainsPaymentDone() {
        await expect(this.page).toHaveURL(/\/payment_done\//);
    }
}
