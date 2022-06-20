/* Autor: Valentin Lieberknecht */

import { expect } from 'chai';
import { Browser, BrowserContext, chromium, Page } from 'playwright';
import config from './config.js';
import { UserSession } from './user-session.js';

describe('chat', () => {
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

  /*
  it('should send a message', async () => {
    await userSession.registerUser();
    await page.goto(config.clientUrl('/chat/0ea6639d-c6d5-4030-bb1b-e687ecb850fb'));
    await page.locator('[placeholder="Your message\\.\\."]').click();
    await page.locator('[placeholder="Your message\\.\\."]').fill('Hello');
    await page.locator('text=Send').click();
    expect(await page.locator('text="Hello"').count()).to.equal(1);
    await userSession.deleteUser();
  });*/
});
