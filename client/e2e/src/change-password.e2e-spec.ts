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

  it('should change password', async () => {
    await userSession.registerUser();
    await page.goto(config.clientUrl('/mates/settings/change-password'));

    await page.locator('#currentPassword').click();
    await page.locator('#currentPassword').fill(userSession.password);
    await page.locator('#password').click();
    await page.locator('#password').fill('123456Aa');
    await page.locator('#password').press('Tab');
    await page.locator('#passwordCheck').fill('123456Aa');

    await Promise.all([page.waitForResponse('**/changepassword'), page.locator('text=Send').click()]);

    expect(await page.locator('text="Changed password"').count()).to.equal(1);

    await userSession.deleteUser();
  });
});
