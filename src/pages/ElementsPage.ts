import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ElementsPage extends BasePage {
  // Role-based selectors
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly submitButton: Locator;

  // CSS selectors
  readonly currentAddressInput: Locator;
  readonly permanentAddressInput: Locator;
  readonly outputName: Locator;
  readonly outputEmail: Locator;

  // getByText selector
  readonly textBoxMenuItem: Locator;
  readonly checkBoxMenuItem: Locator;
  readonly radioButtonMenuItem: Locator;

  // Checkbox tree selectors
  readonly homeCheckbox: Locator;
  readonly checkboxResult: Locator;

  // Radio button selectors
  readonly yesRadio: Locator;
  readonly impressiveRadio: Locator;
  readonly radioResult: Locator;

  constructor(page: Page) {
    super(page);

    // Text Box form — mix of getByRole, CSS, getByPlaceholder
    this.fullNameInput = page.getByPlaceholder('Full Name');
    this.emailInput = page.locator('#userEmail');
    this.currentAddressInput = page.locator('#currentAddress');
    this.permanentAddressInput = page.locator('textarea#permanentAddress');
    this.submitButton = page.locator('#submit');
    this.outputName = page.locator('#name');
    this.outputEmail = page.locator('#email');

    // Side menu items — getByText
    this.textBoxMenuItem = page.getByText('Text Box');
    this.checkBoxMenuItem = page.getByText('Check Box');
    this.radioButtonMenuItem = page.getByText('Radio Button');

    // Checkbox section
    this.homeCheckbox = page.locator('.rct-checkbox').first();
    this.checkboxResult = page.locator('#result');

    // Radio button section
    this.yesRadio = page.locator('label[for="yesRadio"]');
    this.impressiveRadio = page.locator('label[for="impressiveRadio"]');
    this.radioResult = page.locator('.mt-3');
  }

  async gotoTextBox() {
    await this.navigate('/text-box');
    await this.waitForPageLoad();
  }

  async gotoCheckBox() {
    await this.navigate('/checkbox');
    await this.waitForPageLoad();
  }

  async gotoRadioButton() {
    await this.navigate('/radio-button');
    await this.waitForPageLoad();
  }

  async fillTextBoxForm(name: string, email: string, currentAddr: string, permanentAddr: string) {
    await this.fillInput(this.fullNameInput, name);
    await this.fillInput(this.emailInput, email);
    await this.fillInput(this.currentAddressInput, currentAddr);
    await this.fillInput(this.permanentAddressInput, permanentAddr);
  }

  async submitForm() {
    await this.clickElement(this.submitButton);
  }

  async getOutputName(): Promise<string> {
    return this.getText(this.outputName);
  }

  async getOutputEmail(): Promise<string> {
    return this.getText(this.outputEmail);
  }

  async toggleHomeCheckbox() {
    await this.clickElement(this.homeCheckbox);
  }

  async getCheckboxResult(): Promise<string> {
    return this.getText(this.checkboxResult);
  }

  async selectYesRadio() {
    await this.clickElement(this.yesRadio);
  }

  async selectImpressiveRadio() {
    await this.clickElement(this.impressiveRadio);
  }

  async getRadioResult(): Promise<string> {
    return this.getText(this.radioResult);
  }
}
