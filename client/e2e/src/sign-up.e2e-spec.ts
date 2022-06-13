import { expect } from 'chai';
import { Browser, BrowserContext, chromium, Page } from 'playwright';
import config from './config.js';
import { UserSession } from './user-session.js';

describe('sign-up', () => {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;
  let userSession: UserSession;

  before(async () => {
    browser = await chromium.launch(config.launchOptions);
  });

  after(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    context = await browser.newContext();
    page = await context.newPage();
    userSession = new UserSession(context);
  });

  afterEach(async () => {
    await context.close();
  });

  it('should register new user', async () => {
    // Go to http://localhost:8081/
    await page.goto(config.clientUrl('/mates/sign-up'));
    // Click #firstname
    await page.locator('#firstname').click();
    // Fill #firstname
    await page.locator('#firstname').fill('Max');
    // Fill #name
    await page.locator('#name').fill('Mustermann');
    // Select male
    await page.locator('select').selectOption('male');
    //Set Birthday
    await page.locator('#birthday').fill('2020-02-02');
    // Click input[type="email"]
    await page.locator('input[type="email"]').click();
    // Click input[type="email"]
    await page.locator('input[type="email"]').click();
    // Fill input[type="email"]
    await page.locator('input[type="email"]').fill('test@test.de');
    // Click #password
    await page.locator('#password').click();
    // Fill #password
    await page.locator('#password').fill('123456Aa');
    // Click #password-check
    await page.locator('#passwordCheck').click();
    // Fill #password-check
    await page.locator('#passwordCheck').fill('123456Aa');
    // Click text=Basketball
    await page.locator('text=Basketball').click();
    // Click text=Golf
    await page.locator('text=Golf').click();
    //Select Profile Picture
    await page.setInputFiles('input[type="file"]', 'e2e/src/photo.jpg');
    const [response] = await Promise.all([
      page.waitForResponse('**/sign-up'),
      page.locator('text=Konto erstellen').click()
    ]);
    expect(response.status()).to.equal(201);
  }).timeout(1000000);
});
