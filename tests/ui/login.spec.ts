import { test, expect } from '../../src/fixtures/test-fixtures';
import { credentials } from '../../src/data/test-data';

test.describe('Login Page', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.evaluate(() => window.localStorage.clear());
  });

  test('Login form is displayed', { tag: ['@smoke'] }, async ({ loginPage }) => {
    await expect(loginPage.usernameInput, 'Username input should be visible').toBeVisible();
    await expect(loginPage.passwordInput, 'Password input should be visible').toBeVisible();
    await expect(loginPage.loginButton, 'Login button should be visible').toBeVisible();
    await expect(loginPage.newUserButton, 'New User button should be visible').toBeVisible();
  });

  test('Login with valid credentials', { tag: ['@smoke', '@regression'] }, async ({ loginPage, page }) => {
    await loginPage.login(credentials.valid.username, credentials.valid.password);
    await page.waitForURL('**/profile');
    await expect(page.locator('.main-header'), 'Should redirect to Profile page after login').toHaveText('Profile');
  });

  test('Login with invalid credentials shows error', { tag: ['@regression'] }, async ({ loginPage }) => {
    await loginPage.login(credentials.invalid.username, credentials.invalid.password);
    await expect(loginPage.invalidCredentialsMessage, 'Error message should appear for invalid credentials').toBeVisible();
    await expect(loginPage.invalidCredentialsMessage, 'Error text should indicate invalid credentials').toHaveText('Invalid username or password!');
  });

  test('Login header text is correct', { tag: ['@regression'] }, async ({ loginPage }) => {
    const header = await loginPage.getText(loginPage.headerText);
    expect(header, 'Page header should read "Login"').toBe('Login');
  });

  test('New User button navigates to register page', { tag: ['@regression'] }, async ({ loginPage, page }) => {
    await loginPage.clickNewUser();
    await page.waitForURL('**/register');
    await expect(page.locator('.main-header'), 'Should navigate to Register page').toHaveText('Register');
  });
});
