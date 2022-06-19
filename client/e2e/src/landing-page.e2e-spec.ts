/* Autor: Jonathan Hüls */

import { Browser, BrowserContext, Page, chromium } from 'playwright';
import { expect } from 'chai';
import { UserSession } from './user-session.js';
import config from './config.js';

describe('/landing-Page', () => {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;
  let userSession: UserSession;
  /*
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
    //no navigation through clicks. The Reason for that is that playwrith crash when implemented
  });

  afterEach(async () => {
    await context.close();
  });

  it('should route logged in Mate to Meets', async () => {
    await userSession.registerUser();
    await page.goto(config.clientUrl('/'));

    await page.locator('#tryItBtn').click();

    const correctPage = page.url().includes('/meets');

    await userSession.deleteUser();
    expect(correctPage).to.be.true;
  });

   
  it('should route not logged in Mate to Login', async () => {
    await page.goto(config.clientUrl('/'));
    await page.locator('#tryItBtn').click();

    const correctPage = page.url().includes('/sign-in');
    expect(correctPage).to.be.true;
  });

  */
});
