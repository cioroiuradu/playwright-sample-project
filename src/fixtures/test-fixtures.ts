import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { BookStorePage } from '../pages/BookStorePage';
import { ElementsPage } from '../pages/ElementsPage';

type TestFixtures = {
  loginPage: LoginPage;
  bookStorePage: BookStorePage;
  elementsPage: ElementsPage;
};

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  bookStorePage: async ({ page }, use) => {
    await use(new BookStorePage(page));
  },
  elementsPage: async ({ page }, use) => {
    await use(new ElementsPage(page));
  },
});

export { expect } from '@playwright/test';
