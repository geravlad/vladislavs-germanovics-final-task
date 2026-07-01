import { expect, Locator, Page } from "@playwright/test";
import { CardDetails } from '../../utils/testData';
import { BasePage } from "./BasePage";

export class PaymentPage extends BasePage {
    //Locators
    readonly nameOnCardInput: Locator;
    readonly cardNumberInput: Locator;
    readonly cvcInput: Locator;
    readonly expiryMonthInput: Locator;
    readonly expiryYearInput: Locator;
    readonly payAndConfirmOrderButton: Locator;

    constructor(page: Page) {
        super(page);

        this.nameOnCardInput = page.locator('input[name="name_on_card"]');
        this.cardNumberInput = page.locator('input[name="card_number"]');
        this.cvcInput = page.locator('input[name="cvc"]');
        this.expiryMonthInput = page.locator('input[name="expiry_month"]');
        this.expiryYearInput = page.locator('input[name="expiry_year"]');
        this.payAndConfirmOrderButton = page.getByRole('button', { name: 'Pay and Confirm Order' });
    }

    async assertOnPaymentPage() {
        await expect(this.page).toHaveURL('/payment');
    }

    async fillCardDetails(card: CardDetails) {
        await this.nameOnCardInput.fill(card.name);
        await this.cardNumberInput.fill(card.cardNumber);
        await this.cvcInput.fill(card.cvc);
        await this.expiryMonthInput.fill(card.expiryMonth);
        await this.expiryYearInput.fill(card.expiryYear);
    }

    async clickPayAndConfirm() {
        await this.payAndConfirmOrderButton.click();
    }
}
