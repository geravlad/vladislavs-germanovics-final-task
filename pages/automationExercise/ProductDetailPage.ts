import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductDetailPage extends BasePage {
    //Locators
    readonly productNameHeading: Locator;
    readonly categoryText: Locator;
    readonly priceText: Locator;
    readonly availabilityText: Locator;
    readonly conditionText: Locator;
    readonly brandText: Locator;
    readonly addToCartButton: Locator;

    constructor(page: Page) {
        super(page);

        this.productNameHeading = page.locator('.product-information h2');
        this.categoryText = page.locator('.product-information p', { hasText: 'Category:' });
        this.priceText = page.locator('.product-information span span').first();
        this.availabilityText = page.locator('.product-information p', { hasText: 'Availability:' });
        this.conditionText = page.locator('.product-information p', { hasText: 'Condition:' });
        this.brandText = page.locator('.product-information p', { hasText: 'Brand:' });
        this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
    }

    async assertOnProductDetailPage() {
        await expect(this.page).toHaveURL(/\/product_details\/\d+/);
        await expect(this.productNameHeading).toBeVisible();
    }

    async assertProductNameVisible() {
        await expect(this.productNameHeading).toBeVisible();
        await expect(this.productNameHeading).not.toBeEmpty();
    }

    async assertProductDetailsVisible() {
        await expect(this.categoryText).toBeVisible();
        await expect(this.categoryText).not.toBeEmpty();

        await expect(this.priceText).toBeVisible();
        await expect(this.priceText).not.toBeEmpty();

        await expect(this.availabilityText).toBeVisible();
        await expect(this.availabilityText).not.toBeEmpty();

        await expect(this.conditionText).toBeVisible();
        await expect(this.conditionText).not.toBeEmpty();

        await expect(this.brandText).toBeVisible();
        await expect(this.brandText).not.toBeEmpty();
    }

    async assertAddToCartButtonVisible() {
        await expect(this.addToCartButton).toBeVisible();
    }
}
