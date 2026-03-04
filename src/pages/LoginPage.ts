import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // CSS selectors
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  // ID selector
  readonly newUserButton: Locator;

  // Xpath-style and text selectors
  readonly headerText: Locator;
  readonly invalidCredentialsMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#userName');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login');
    this.newUserButton = page.locator('#newUser');
    this.headerText = page.locator('.main-header');
    this.invalidCredentialsMessage = page.locator('#name');
  }

  async goto() {
    await this.navigate('/login');
    await this.waitForPageLoad();
  }

  async login(username: string, password: string) {
    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement(this.loginButton);
  }

  async getErrorMessage(): Promise<string> {
    return this.getText(this.invalidCredentialsMessage);
  }

  async clickNewUser() {
    await this.clickElement(this.newUserButton);
  }

  async isLoginFormVisible(): Promise<boolean> {
    return (
      (await this.isVisible(this.usernameInput)) &&
      (await this.isVisible(this.passwordInput))
    );
  }
}
