import { test, expect } from '../../src/fixtures/test-fixtures';

test.describe('Book Store', () => {
  test.beforeEach(async ({ bookStorePage }) => {
    await bookStorePage.goto();
  });

  test.afterEach(async ({ bookStorePage }) => {
    await bookStorePage.searchBook('');
  });

  test('Book Store page loads correctly', { tag: ['@smoke'] }, async ({ bookStorePage }) => {
    const header = await bookStorePage.getHeaderText();
    expect(header, 'Page header should read "Book Store"').toBe('Book Store');
    await expect(bookStorePage.booksTable, 'Books table should be visible on page load').toBeVisible();
  });

  test('Search box is functional', { tag: ['@smoke', '@regression'] }, async ({ bookStorePage }) => {
    await bookStorePage.searchBook('JavaScript');
    const count = await bookStorePage.getBookCount();
    expect(count, 'Search for "JavaScript" should return at least one book').toBeGreaterThan(0);
  });

  test('Search returns no results for gibberish', { tag: ['@regression'] }, async ({ bookStorePage }) => {
    await bookStorePage.searchBook('xyznonexistentbook123');
    const count = await bookStorePage.getBookCount();
    expect(count, 'Gibberish search should return zero results').toBe(0);
  });

  test('Click first book opens book details', { tag: ['@regression'] }, async ({ bookStorePage, page }) => {
    const firstBookTitle = await bookStorePage.firstBookLink.textContent();
    await bookStorePage.clickFirstBook();
    await expect(page.locator('.main-header'), 'Should remain on Book Store section').toHaveText('Book Store');
    await expect(page.locator('#title-wrapper #userName-value'), 'Book detail title should match the clicked book').toHaveText(firstBookTitle!);
  });

  test('Login button is visible on Book Store page', { tag: ['@regression'] }, async ({ bookStorePage }) => {
    await expect(bookStorePage.loginButton, 'Login button should be visible for unauthenticated users').toBeVisible();
  });
});
