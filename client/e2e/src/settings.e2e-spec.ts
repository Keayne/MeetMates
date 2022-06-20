/* Autor: Valentin Lieberknecht */

import { expect } from 'chai';
import { Browser, BrowserContext, chromium, Page } from 'playwright';
import config from './config.js';
import { UserSession } from './user-session.js';

describe('settings', () => {
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

  it('should change to all sites', async () => {
    await userSession.registerUser();
    await page.goto(config.clientUrl('/mates/settings/edit-profile'));
    await page.goto(config.clientUrl('/mates/settings/edit-profile'));
    // Click a:has-text("Edit Profile")
    await page.locator('a:has-text("Edit Profile")').click();
    expect(page.url()).to.eq(config.clientUrl('/mates/settings/edit-profile'));
    // Click text=Change Email
    await page.locator('text=Change Email').click();
    expect(page.url()).to.eq(config.clientUrl('/mates/settings/change-email'));
    // Click text=Change Password
    await page.locator('text=Change Password').click();
    expect(page.url()).to.eq(config.clientUrl('/mates/settings/change-password'));
    // Click text=Delete Profile
    await page.locator('text=Delete Profile').click();
    expect(page.url()).to.eq(config.clientUrl('/mates/settings/delete-profile'));

    await userSession.deleteUser();
  });
});
