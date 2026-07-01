import { test as base, Page } from '@playwright/test';
import { generateUser, ShopUser } from '../utils/testData';
import { ShopApiClient } from '../utils/shopApiClient';
import { ShopHomePage } from '../pages/automationExercise/ShopHomePage';
import { SignupLoginPage } from '../pages/automationExercise/SignupLoginPage';
import { AccountCreationPage } from '../pages/automationExercise/AccountCreationPage';

export type AuthenticatedShopPageFixture = {
    user: ShopUser;
    authenticatedShopPage: Page;
}

// Block ad iframes
export const test = base.extend<AuthenticatedShopPageFixture>({
    page: async ({ page }, use) => {
        await page.route(/doubleclick\.net|googlesyndication\.com|googleadservices\.com|pagead/, (route) => route.abort());
        await use(page);
    },

    user: async ({}, use) => {
        await use(generateUser());
    },

    authenticatedShopPage: [
        async ({ page, user }, use) => {
            const shopHomePage = new ShopHomePage(page);
            const signUpLoginPage = new SignupLoginPage(page);
            const accountCreationPage = new AccountCreationPage(page);

            await shopHomePage.goto();
            await shopHomePage.clickConsentButton();
            await shopHomePage.clickSignUpLoginButton();

            await signUpLoginPage.assertOnSignupLoginPage();
            await signUpLoginPage.fillNewUserSignup(user.name, user.email);

            await accountCreationPage.assertOnSignupPage();
            await accountCreationPage.fillAccountDetails(user)
            await accountCreationPage.clickCreateAccount();
            await accountCreationPage.assertAccountCreated();
            await accountCreationPage.clickContinue();

            await shopHomePage.assertLoggedIn(user.name);

            await use(page); // test body runs here
        },
        { timeout: 60_000 }
    ],
});

test.afterEach(async ({ request, user }) => {
    const apiClient = new ShopApiClient(request);
    await apiClient.deleteAccount(user.email, user.password);
});
