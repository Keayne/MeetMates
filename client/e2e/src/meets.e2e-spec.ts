/* Autor: Jonathan Hüls */

import { Browser, BrowserContext, Page, chromium } from 'playwright';
import { expect } from 'chai';
import { UserSession } from './user-session.js';
import config from './config.js';

describe('/meets', () => {
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

    await page.goto(config.clientUrl('/meets'));
  });

  afterEach(async () => {
    await userSession.deleteUser();
    await context.close();
  });

  it('should render Meets-Title "New Meets"', async () => {
    await page.waitForSelector('app-meets');

    const newMeetsHeader = await page.textContent('.meets-header > h2');
    expect(newMeetsHeader).to.equal('New Meets');
  });

  it('should render Meet "Hello Meet"', async () => {
    await page.waitForSelector('app-meets');

    const newMeet = await page.textContent('.meet .name');
    expect(newMeet).to.equal('Hello Meet');
  });

  it('should direct from Meets to Meet "Hello Meet"', async () => {
    await page.waitForSelector('app-meets');

    const newMeet = await page.textContent('.meet .name');
    await page.click('.meet .name');

    const headingElement = await page.locator('input[name="meetHeading"]').inputValue();

    expect(newMeet).to.equal(headingElement);
  });

  it('after "Hello Meet" gets opend "Your-Meets" header should be shown "', async () => {
    await page.waitForSelector('app-meets');

    await page.click('.meet .name', { delay: 50 });
    await page.goBack({ timeout: 50 });

    const oldMeetsHeader = await page.textContent('#oldMeets h2');
    expect(oldMeetsHeader).to.equal('Your Meets');
  }).timeout(100000);
});
