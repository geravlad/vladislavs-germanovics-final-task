import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ShopHomePage extends BasePage {
    //Locators

    readonly signUpLoginButton: Locator;
    readonly loggedInAs: Locator;
    readonly productsNavLink: Locator;
    readonly subscribeEmailInput: Locator;
    readonly subscribeButton: Locator;
    readonly subscribeSuccessMessage: Locator;

    constructor(page: Page) {
        super(page);

        this.signUpLoginButton = page.getByRole('link', { name: ' Signup / Login' });
        this.loggedInAs = page.locator('a', { hasText: 'Logged in as' });
        this.productsNavLink = page.getByRole('link', { name: ' Products' });
        this.subscribeEmailInput = page.locator('#susbscribe_email');
        this.subscribeButton = page.locator('#subscribe');
        this.subscribeSuccessMessage = page.locator('#success-subscribe .alert-success');
    }

    async goto() {
        await this.page.goto('/');
    }

    async assertOnHomePage() {
        await expect(this.page).toHaveURL('/');
    }

    async clickSignUpLoginButton() {
        await this.signUpLoginButton.click();
    }

    async assertLoggedIn(username: string) {
        await expect(this.loggedInAs).toContainText(username);
    }

    async clickProductsNavLink() {
        await this.productsNavLink.click();
    }

    async subscribe(email: string) {
        await this.subscribeEmailInput.scrollIntoViewIfNeeded();
        await this.subscribeEmailInput.fill(email);
        await this.subscribeButton.click();
    }

    async assertSubscribedSuccessfully() {
        await expect(this.subscribeSuccessMessage).toBeVisible();
        await expect(this.subscribeSuccessMessage).toContainText('You have been successfully subscribed!');
    }

}