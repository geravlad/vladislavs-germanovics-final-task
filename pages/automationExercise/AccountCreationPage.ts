import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { ShopUser } from "../../utils/testData";

export class AccountCreationPage extends BasePage {
    //Locators
    readonly passwordInput: Locator;
    readonly daysSelect: Locator;
    readonly monthsSelect: Locator;
    readonly yearsSelect: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly addressInput: Locator;
    readonly countrySelect: Locator;
    readonly stateInput: Locator;
    readonly cityInput: Locator;
    readonly zipCodeInput: Locator;
    readonly mobileInput: Locator;
    readonly createAccountButton: Locator;
    readonly accountCreatedHeading: Locator;
    readonly continueButton: Locator;

    constructor(page: Page) {
        super(page);

        this.passwordInput = page.locator('#password')
        this.daysSelect = page.locator('#days');
        this.monthsSelect = page.locator('#months');
        this.yearsSelect = page.locator('#years');
        this.firstNameInput = page.locator('#first_name');
        this.lastNameInput = page.locator('#last_name');
        this.addressInput = page.locator('#address1');
        this.countrySelect = page.locator('#country');
        this.stateInput = page.locator('#state');
        this.cityInput = page.locator('#city');
        this.zipCodeInput = page.locator('#zipcode');
        this.mobileInput = page.locator('#mobile_number');
        this.createAccountButton = page.getByRole('button', { name: 'Create Account'});
        this.accountCreatedHeading = page.locator('b', { hasText: 'Account Created!' });
        this.continueButton = page.getByRole('link', { name: 'Continue'});
    }

    async fillAccountDetails(user: ShopUser) {
        await this.passwordInput.fill(user.password);
        await this.daysSelect.selectOption(user.birthDay);
        await this.monthsSelect.selectOption(user.birthMonth);
        await this.yearsSelect.selectOption(user.birthYear);
        await this.firstNameInput.fill(user.firstName);
        await this.lastNameInput.fill(user.lastName);
        await this.addressInput.fill(user.address);
        await this.countrySelect.selectOption(user.country);
        await this.stateInput.fill(user.state);
        await this.cityInput.fill(user.city);
        await this.zipCodeInput.fill(user.zipCode);
        await this.mobileInput.fill(user.mobileNumber);
    }

    async assertOnSignupPage() {
        await expect(this.page).toHaveURL('/signup');
    }

    async clickCreateAccount() {
        await this.createAccountButton.click();
    }

    async assertAccountCreated() {
        await expect(this.page).toHaveURL('/account_created')
        await expect(this.accountCreatedHeading).toBeVisible();
    }

    async clickContinue() {
        await this.continueButton.click();
    }
}
