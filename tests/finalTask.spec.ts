import { expect } from '@playwright/test';
import { test } from '../fixtures/authenticatedShopPage';
import { CartPage } from '../pages/automationExercise/CartPage';
import { CheckoutPage } from '../pages/automationExercise/CheckoutPage';
import { PaymentPage } from '../pages/automationExercise/PaymentPage';
import { PaymentConfirmationPage } from '../pages/automationExercise/PaymentConfirmationPage';
import { ProductDetailPage } from '../pages/automationExercise/ProductDetailPage';
import { ProductsPage } from '../pages/automationExercise/ProductsPage';
import { ShopHomePage } from '../pages/automationExercise/ShopHomePage';
import { SignupLoginPage } from '../pages/automationExercise/SignupLoginPage';
import { ShopApiClient } from '../utils/shopApiClient';
import { CardDetails, cardData, generateUser } from '../utils/testData';

import {
  epic, feature, story, severity, Severity,
} from 'allure-js-commons';

test.describe('TC-SHOP-001', () => {
  test('Happy path: full shopping flow (register -> browse -> checkout)', async ({ authenticatedShopPage, user }) => {
    await epic('Shopping')
    await feature('Checkout')
    await story('Full E2E flow')
    await severity(Severity.CRITICAL);

    const shopHomePage = new ShopHomePage(authenticatedShopPage);
    const productsPage = new ProductsPage(authenticatedShopPage);
    const cartPage = new CartPage(authenticatedShopPage);
    const checkoutPage = new CheckoutPage(authenticatedShopPage);
    const paymentPage = new PaymentPage(authenticatedShopPage);
    const confirmationPage = new PaymentConfirmationPage(authenticatedShopPage);

    await shopHomePage.clickProductsNavLink();
    await productsPage.assertOnProductsPage();

    await productsPage.addToCart(0);
    await productsPage.assertAddedToCart();
    await productsPage.clickViewCartNavLink();

    await cartPage.assertOnCartPage();
    await cartPage.assertProceedToCheckoutVisible();
    await cartPage.clickProceedToCheckout();

    await checkoutPage.assertOnCheckoutPage();
    await checkoutPage.assertDeliveryAddress(user);
    await checkoutPage.clickPlaceOrder();

    await paymentPage.assertOnPaymentPage();
    await paymentPage.fillCardDetails(cardData);
    await paymentPage.clickPayAndConfirm();

    await confirmationPage.assertOrderPlaced();
    await confirmationPage.assertUrlContainsPaymentDone();
  });
});

test.describe('TC-SHOP-002', () => {
  test('Search: keyword search returns only matching products', async ({ page }) => {
    await epic('Shopping')
    await feature('Product Search')
    await story('Keyword search')
    await severity(Severity.NORMAL);

    // using .fail() because products without "top" keyword appears in search result
    test.fail(true, 'automationexercise product search also matches by category, not just product name');

    const productsPage = new ProductsPage(page);

    await productsPage.goto();
    await productsPage.clickConsentButton();
    await productsPage.assertOnProductsPage();

    await productsPage.searchProduct('dress');

    await productsPage.assertSearchedProductsHeadingVisible();
    await productsPage.assertAtLeastOneProductShown();
    await productsPage.assertAllProductNamesContain('dress');
  });
});

test.describe('TC-SHOP-003', () => {
  test('Cart: adding multiple products updates the item count', async ({ page }) => {
    await epic('Shopping')
    await feature('Cart')
    await story('Add multiple products')
    await severity(Severity.NORMAL);

    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await productsPage.goto();
    await productsPage.clickConsentButton();
    await productsPage.assertOnProductsPage();

    const firstProductName = await productsPage.getProductName(0);
    const firstProductPrice = await productsPage.getProductPrice(0);
    const secondProductName = await productsPage.getProductName(1);
    const secondProductPrice = await productsPage.getProductPrice(1);

    await productsPage.addToCart(0);
    await productsPage.assertAddedToCart();
    await productsPage.clickContinueShopping();
    await productsPage.addToCart(1);
    await productsPage.assertAddedToCart();
    await productsPage.clickViewCartNavLink();

    await cartPage.assertOnCartPage();
    await cartPage.assertProductRowCount(2);

    await cartPage.assertProductName(0, firstProductName);
    await cartPage.assertProductPrice(0, firstProductPrice);
    await cartPage.assertProductQuantity(0, '1');
    await cartPage.assertProductTotalPrice(0);

    await cartPage.assertProductName(1, secondProductName);
    await cartPage.assertProductPrice(1, secondProductPrice);
    await cartPage.assertProductQuantity(1, '1');
    await cartPage.assertProductTotalPrice(1);
  });
});

test.describe('TC-SHOP-004', () => {
  test('Cart: removing a product updates the cart', async ({ page }) => {
    await epic('Shopping')
    await feature('Cart')
    await story('Remove Product')
    await severity(Severity.NORMAL);

    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await productsPage.goto();
    await productsPage.clickConsentButton();

    await productsPage.assertOnProductsPage();
    await productsPage.addToCart(1);
    await productsPage.assertAddedToCart();
    await productsPage.clickViewCartNavLink();

    await cartPage.assertOnCartPage();
    await cartPage.assertProductRowCount(1);

    await cartPage.deleteNthProduct(0);

    await cartPage.assertProductRowCount(0);
    await cartPage.assertEmptyCartMessageVisible();
    await cartPage.assertOnCartPage(); //asserts page stays on same page
  });
});

test.describe('TC-SHOP-005', () => {
  test('Product detail: product information page shows correct data', async ({ page }) => {
    await epic('Shopping')
    await feature('Product Detail')
    await story('View product info')
    await severity(Severity.MINOR);

    const productsPage = new ProductsPage(page);
    const productDetailPage = new ProductDetailPage(page);

    await productsPage.goto();
    await productsPage.clickConsentButton();
    await productsPage.assertOnProductsPage();

    await productsPage.clickViewProduct(0);

    await productDetailPage.assertOnProductDetailPage();
    await productDetailPage.assertProductNameVisible();
    await productDetailPage.assertProductDetailsVisible();
    await productDetailPage.assertAddToCartButtonVisible();
  });
});

test.describe('TC-SHOP-006', () => {
  test('API: GET /api/productsList returns a valid product list', async ({ request }) => {
    await epic('API')
    await feature('Products API')
    await story('List all products')
    await severity(Severity.CRITICAL);

    const shopApiClient = new ShopApiClient(request);
    const { responseCode, products } = await shopApiClient.getProducts();

    expect(responseCode).toBe(200);
    expect(products.length).toBeGreaterThan(0);

    for (const product of products) {
      expect(product.id).toBeDefined();
      expect(product.name).toBeDefined();
      expect(product.price).toBeDefined();
      expect(product.brand).toBeDefined();
      expect(product.category).toBeDefined();
    }

    const uniqueIds = new Set(products.map((product) => product.id));
    expect(uniqueIds.size).toBe(products.length);
  });
});

test.describe('TC-SHOP-007', () => {
  test('API: POST /api/searchProduct returns matching results', async ({ request }) => {
    await epic('API')
    await feature('Products API')
    await story('Search products')
    await severity(Severity.NORMAL);

    // using .fail() because products without "top" keyword appears in search result
    test.fail(true, 'automationexercise /api/searchProduct also matches by category, not just product name');

    const shopApiClient = new ShopApiClient(request);
    const { responseCode, products } = await shopApiClient.searchProducts('top');

    expect(responseCode).toBe(200);
    expect(products.length).toBeGreaterThan(0);

    for (const product of products) {
      expect(product.name.toLowerCase()).toContain('top');
    }
  });
});

test.describe('TC-SHOP-008', () => {
  test('API: POST /api/searchProduct with missing parameter returns 400', async ({ request }) => {
    await epic('API')
    await feature('Products API')
    await story('Missing parameter')
    await severity(Severity.MINOR);

    const response = await request.post('/api/searchProduct');
    const body = await response.json();

    expect(body.responseCode).toBe(400);
    expect(body.message).toBeTruthy();
  });
});

test.describe('TC-SHOP-009', () => {
  test('Subscription: subscribing from the footer shows a success message', async ({ page }) => {
    await epic('Marketing')
    await feature('Newsletter')
    await story('Footer subscription')
    await severity(Severity.MINOR);

    const shopHomePage = new ShopHomePage(page);
    const { email } = generateUser();

    await shopHomePage.goto();
    await shopHomePage.clickConsentButton();

    await shopHomePage.subscribe(email);

    await shopHomePage.assertSubscribedSuccessfully();
  });
});

test.describe('TC-SHOP-010', () => {
  test('Session: authenticated user is redirected away from the login page', async ({ authenticatedShopPage, user }) => {
    await epic('Auth')
    await feature('Session')
    await story('Redirect logged-in user')
    await severity(Severity.MINOR);

    const shopHomePage = new ShopHomePage(authenticatedShopPage);
    const signupLoginPage = new SignupLoginPage(authenticatedShopPage);

    await signupLoginPage.goto();
    await authenticatedShopPage.waitForURL('/');

    await shopHomePage.assertLoggedIn(user.name);
  });
});