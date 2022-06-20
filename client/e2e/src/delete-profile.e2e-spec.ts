/* Autor: Valentin Lieberknecht */

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

  it('should delete profile', async () => {
    await userSession.registerUser();
    await page.goto(config.clientUrl('/mates/settings/delete-profile'));
    // Click text=Yes remove my account!
    page.locator('text=Yes remove my account!').click();

    page.on('dialog', dialog => dialog.accept());

    await userSession.deleteUser();
  });
});
