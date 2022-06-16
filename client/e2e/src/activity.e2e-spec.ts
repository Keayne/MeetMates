/* Autor: Arne Schaper */

import { Browser, BrowserContext, Page, chromium } from 'playwright';
import { expect } from 'chai';
import { UserSession } from './user-session.js';
import config from './config.js';

describe('/meet/find-activity/', () => {
  //TODO URl
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
    await userSession.registerUser();
  });

  afterEach(async () => {
    await userSession.deleteUser();
    await context.close();
  });

  /*
  it('should render the title "Available Activities"', async () => {
    await page.goto(config.clientUrl('/meet/find-activity'));
    const title = await page.textContent('find-activity h2');
    expect(title).to.equal('Available Activities');
  });*/
});
