import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CartPage extends BasePage {
    //Locators
    readonly proceedToCheckoutButton: Locator;
    readonly cartRows: Locator;
    readonly emptyCartMessage: Locator;

    constructor(page: Page) {
        super(page);

        this.proceedToCheckoutButton = page.locator('a.check_out');
        this.cartRows = page.locator('#cart_info_table tbody tr');
        this.emptyCartMessage = page.locator('#empty_cart');
    }

    async assertOnCartPage() {
        await expect(this.page).toHaveURL('/view_cart');
    }

    async assertProceedToCheckoutVisible() {
        await expect(this.proceedToCheckoutButton).toBeVisible();
    }

    async clickProceedToCheckout() {
        await this.proceedToCheckoutButton.click();
    }

    async assertProductRowCount(count: number) {
        await expect(this.cartRows).toHaveCount(count);
    }

    async assertProductName(productRow: number, name: string) {
        await expect(this.cartRows.nth(productRow).locator('.cart_description h4 a')).toHaveText(name);
    }

    async assertProductPrice(productRow: number, price: number) {
        const priceText = await this.cartRows.nth(productRow).locator('.cart_price p').innerText();
        const priceNumber = Number(priceText.replace('Rs. ', ''));
        expect(priceNumber).toBe(price);
    }

    async assertProductQuantity(productRow: number, quantity: string) {
        await expect(this.cartRows.nth(productRow).locator('.cart_quantity button')).toHaveText(quantity);
    }

    async assertProductTotalPrice(productRow: number) {
        const priceText = await this.cartRows.nth(productRow).locator('.cart_price p').innerText();
        const price = Number(priceText.replace('Rs. ', ''));

        const quantityText = await this.cartRows.nth(productRow).locator('.cart_quantity button').innerText();
        const quantity = Number(quantityText);

        const totalText = await this.cartRows.nth(productRow).locator('.cart_total_price').innerText();
        const total = Number(totalText.replace('Rs. ', ''));

        expect(total).toBe(price * quantity);
    }

    async deleteNthProduct(productRow: number) {
        await this.cartRows.nth(productRow).locator('.cart_quantity_delete').click();
    }

    async assertEmptyCartMessageVisible() {
        await expect(this.emptyCartMessage).toBeVisible();
    }
}
