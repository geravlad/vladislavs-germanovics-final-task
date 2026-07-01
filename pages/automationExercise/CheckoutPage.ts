import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { ShopUser } from "../../utils/testData";

export class CheckoutPage extends BasePage {
    //Locators
    readonly deliveryAddress: Locator;
    readonly placeOrderButton: Locator;

    constructor(page: Page) {
        super(page);

        this.deliveryAddress = page.locator('#address_delivery');
        this.placeOrderButton = page.getByRole('link', { name: 'Place Order' });
    }

    async assertOnCheckoutPage() {
        await expect(this.page).toHaveURL('/checkout');
    }

    async assertDeliveryAddress(user: ShopUser) {
        await expect(this.deliveryAddress).toContainText(user.address);
        await expect(this.deliveryAddress).toContainText(user.city);
        await expect(this.deliveryAddress).toContainText(user.state);
        await expect(this.deliveryAddress).toContainText(user.zipCode);
        await expect(this.deliveryAddress).toContainText(user.country);
    }

    async clickPlaceOrder() {
        await this.placeOrderButton.click();
    }
}