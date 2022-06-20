/* Autor: Valentin Lieberknecht */

import { expect } from 'chai';
import { Browser, BrowserContext, chromium, Page } from 'playwright';
import config from './config.js';
import { UserSession } from './user-session.js';

describe('settings/change-password', () => {
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

  it('should edit profile', async () => {
    await userSession.registerUser();
    await page.goto(config.clientUrl('/mates/settings/edit-profile'));
    await page.locator('#firstname').fill('NEWNAME');
    await page.locator('#name').click();
    await page.locator('#name').fill('NEWNAME');
    await page.locator('select').selectOption('diverse');
    await page.locator('text=Puzzeln').click();
    // Click text=Update Profile
    await Promise.all([page.waitForResponse('**/edit'), page.locator('text=Update Profile').click()]);

    expect(await page.locator('text="Profile updated successfully"').count()).to.equal(1);

    await userSession.deleteUser();
  });
});
