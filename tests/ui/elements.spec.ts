import { test, expect } from '../../src/fixtures/test-fixtures';
import { textBoxData } from '../../src/data/test-data';

test.describe('Elements - Text Box', () => {
  test.beforeEach(async ({ elementsPage }) => {
    await elementsPage.gotoTextBox();
  });

  test('Text Box form is displayed', { tag: ['@smoke'] }, async ({ elementsPage }) => {
    await expect(elementsPage.fullNameInput, 'Full Name input should be visible').toBeVisible();
    await expect(elementsPage.emailInput, 'Email input should be visible').toBeVisible();
    await expect(elementsPage.currentAddressInput, 'Current Address textarea should be visible').toBeVisible();
    await expect(elementsPage.permanentAddressInput, 'Permanent Address textarea should be visible').toBeVisible();
  });

  test('Fill and submit text box form', { tag: ['@smoke', '@regression'] }, async ({ elementsPage }) => {
    await elementsPage.fillTextBoxForm(
      textBoxData.fullName,
      textBoxData.email,
      textBoxData.currentAddress,
      textBoxData.permanentAddress
    );
    await elementsPage.submitForm();

    const outputName = await elementsPage.getOutputName();
    const outputEmail = await elementsPage.getOutputEmail();
    expect(outputName, 'Output should contain the submitted full name').toContain(textBoxData.fullName);
    expect(outputEmail, 'Output should contain the submitted email').toContain(textBoxData.email);
  });
});

test.describe('Elements - Check Box', () => {
  test.beforeEach(async ({ elementsPage }) => {
    await elementsPage.gotoCheckBox();
  });

  test('Toggle home checkbox selects all items', { tag: ['@regression'] }, async ({ elementsPage }) => {
    await elementsPage.toggleHomeCheckbox();
    const result = await elementsPage.getCheckboxResult();
    expect(result, 'Selecting "Home" should check all child items').toContain('home');
  });
});

test.describe('Elements - Radio Button', () => {
  test.beforeEach(async ({ elementsPage }) => {
    await elementsPage.gotoRadioButton();
  });

  test('Select Yes radio button', { tag: ['@regression'] }, async ({ elementsPage }) => {
    await elementsPage.selectYesRadio();
    const result = await elementsPage.getRadioResult();
    expect(result, 'Result should display "Yes" after selecting Yes radio').toContain('Yes');
  });

  test('Select Impressive radio button', { tag: ['@regression'] }, async ({ elementsPage }) => {
    await elementsPage.selectImpressiveRadio();
    const result = await elementsPage.getRadioResult();
    expect(result, 'Result should display "Impressive" after selecting Impressive radio').toContain('Impressive');
  });
});
