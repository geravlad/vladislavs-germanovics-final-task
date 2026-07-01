import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class SignupLoginPage extends BasePage {
    //Locators
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly signupButton: Locator;

    constructor(page: Page) {
        super(page);

        this.nameInput = page.getByPlaceholder('Name');
        this.emailInput = page.locator('input[data-qa="signup-email"]');
        this.signupButton = page.getByRole('button', { name: 'Signup' });
    }

    async goto() {
        await this.page.goto('/login');
    }

    async assertOnSignupLoginPage() {
        await expect(this.page).toHaveURL('/login');
    }

    async fillNewUserSignup(name: string, email: string) {
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        await this.signupButton.click();
    }
}