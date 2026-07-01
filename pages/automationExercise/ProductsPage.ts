import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductsPage extends BasePage {
    //Locators
    readonly productItem: Locator;
    readonly addToCartButton: Locator;
    readonly continueShoppingButton: Locator;
    readonly productNames: Locator;
    readonly productPrices: Locator;
    readonly cartModal: Locator;
    readonly viewCartNavLink: Locator;
    readonly allProductsHeading: Locator;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly searchedProductsHeading: Locator;
    readonly viewProductLink: Locator;


    constructor(page: Page) {
        super(page);

        this.productItem = page.locator('.single-products');
        this.addToCartButton = this.productItem.locator('.overlay-content .add-to-cart');
        this.productNames = this.productItem.locator('.productinfo p');
        this.productPrices = this.productItem.locator('.productinfo h2');
        this.cartModal = page.locator('#cartModal');
        this.viewCartNavLink = this.cartModal.getByRole('link', { name: 'View Cart' });
        this.continueShoppingButton = this.cartModal.getByRole('button', { name: 'Continue Shopping' });
        this.allProductsHeading = page.getByRole('heading', { name: 'All Products', level: 2 });
        this.searchInput = page.getByPlaceholder('Search Product');
        this.searchButton = page.locator('#submit_search');
        this.searchedProductsHeading = page.getByRole('heading', { name: 'Searched Products', level: 2 });
        this.viewProductLink = page.getByRole('link', { name: 'View Product' });
    }

    async goto() {
        await this.page.goto('/products');
    }

    async assertOnProductsPage() {
        await expect(this.page).toHaveURL('/products');
        await expect(this.allProductsHeading).toBeVisible();
    }

    async addToCart(index: number) {
        await this.productItem.nth(index).scrollIntoViewIfNeeded();
        await this.productItem.nth(index).hover();
        await expect(this.addToCartButton.nth(index)).toBeVisible();
        await this.addToCartButton.nth(index).click();
    }

    async assertAddedToCart() {
        await expect(this.cartModal).toBeVisible();
    }

    async clickContinueShopping() {
        await this.continueShoppingButton.click();
    }

    async clickViewCartNavLink() {
        await this.viewCartNavLink.click();
    }

    async searchProduct(keyword: string) {
        await this.searchInput.fill(keyword);
        await Promise.all([
            this.page.waitForURL(/\/products\?search=/),
            this.searchButton.click(),
        ]);
    }

    async assertSearchedProductsHeadingVisible() {
        await expect(this.searchedProductsHeading).toBeVisible();
    }

    async assertAllProductNamesContain(keyword: string) {
        const names = await this.productNames.allTextContents();
        for (const name of names) {
            expect(name.toLowerCase()).toContain(keyword.toLowerCase());
        }
    }

    async assertAtLeastOneProductShown() {
        await expect(this.productItem.first()).toBeVisible();
    }

    async clickViewProduct(productNumber: number) {
        await this.viewProductLink.nth(productNumber).click();
    }

    async getProductName(index: number): Promise<string> {
        return (await this.productNames.nth(index).innerText()).trim();
    }

    async getProductPrice(index: number): Promise<number> {
        const priceText = await this.productPrices.nth(index).innerText();
        return Number(priceText.replace('Rs. ', '').trim());
    }
}