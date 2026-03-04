import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class BookStorePage extends BasePage {
  // CSS class selector
  readonly searchInput: Locator;

  // Placeholder-based selector
  readonly searchBox: Locator;

  // Role-based selectors
  readonly booksTable: Locator;
  readonly loginButton: Locator;

  // nth() and filter selectors
  readonly firstBookLink: Locator;
  readonly bookRows: Locator;

  // Text selector
  readonly headerText: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('#searchBox');
    this.searchBox = page.getByPlaceholder('Type to search');
    this.booksTable = page.locator('.rt-tbody');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.firstBookLink = page.locator('.rt-tbody .action-buttons a').first();
    this.bookRows = page.locator('.rt-tbody .rt-tr-group');
    this.headerText = page.locator('.main-header');
  }

  async goto() {
    await this.navigate('/books');
    await this.waitForPageLoad();
  }

  async searchBook(title: string) {
    await this.fillInput(this.searchBox, title);
  }

  async getBookCount(): Promise<number> {
    const rows = this.bookRows.filter({
      has: this.page.locator('.action-buttons a'),
    });
    return rows.count();
  }

  async clickFirstBook() {
    await this.clickElement(this.firstBookLink);
  }

  async getHeaderText(): Promise<string> {
    return this.getText(this.headerText);
  }

  async isBookTableVisible(): Promise<boolean> {
    return this.isVisible(this.booksTable);
  }
}
