/* Autor: Valentin Lieberknecht */

import { expect } from 'chai';
import { Browser, BrowserContext, chromium, Page } from 'playwright';
import config from './config.js';
import { UserSession } from './user-session.js';

describe('chat', () => {
  let browser: Browser;
  let browser2: Browser;
  let context: BrowserContext;
  let context2: BrowserContext;
  let page: Page;
  let page2: Page;
  let userSession: UserSession;
  let userSession2: UserSession;

  before(async () => {
    browser = await chromium.launch(config.launchOptions);
    browser2 = await chromium.launch(config.launchOptions);
  });

  after(async () => {
    await browser.close();
    await browser2.close();
  });

  beforeEach(async () => {
    context = await browser.newContext();
    context2 = await browser2.newContext();
    page = await context.newPage();
    page2 = await context2.newPage();
    userSession = new UserSession(context);
    userSession2 = new UserSession(context2);
  });

  afterEach(async () => {
    await context.close();
    await context2.close();
  });

  it('should send a message', async () => {
    await userSession.registerUser();
    await page.goto(config.clientUrl('/chat/0ea6639d-c6d5-4030-bb1b-e687ecb850fb'));
    await page.locator('[placeholder="Your message\\.\\."]').click();
    await page.locator('[placeholder="Your message\\.\\."]').fill('Hello');
    await page.locator('text=Send').click();
    expect(await page.locator('text="Hello"').count()).to.equal(1);

    await userSession.deleteUser();
  });

  it('check if chat works with two accounts', async () => {
    await userSession.registerUser();
    await userSession2.registerUser();
    await page.goto(config.clientUrl('/chat/0ea6639d-c6d5-4030-bb1b-e687ecb850fb'));
    await page2.goto(config.clientUrl('/chat/0ea6639d-c6d5-4030-bb1b-e687ecb850fb'));
    await page.locator('[placeholder="Your message\\.\\."]').click();
    await page.locator('[placeholder="Your message\\.\\."]').fill('New Message');
    await page.locator('text=Send').click();
    expect(await page.locator('text="New Message"').count()).to.equal(1);
    expect(await page2.locator('text="New Message"').count()).to.equal(1);
    await userSession.deleteUser();
    await userSession2.deleteUser();
  });
});
