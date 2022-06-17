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

    await page.goto(config.clientUrl('/meets'));

    //Route to find-activity component..
    await page.waitForSelector('app-meets');
    await page.textContent('.meet .name');
    await page.click('.meet .name');

    await page.locator('.routeBtn').click();
    const correctDirected = page.url().includes('app/meet/find-activity/');
  });

  afterEach(async () => {
    await userSession.deleteUser();
    await context.close();
  });

  it('should find div "activity-header"', async () => {
    const availableActivitiesHeader = await page.locator('.activity-header');
    expect(availableActivitiesHeader).to.exist;
  });

  it('should find class ".open-button"', async () => {
    const availableActivitiesHeader = await page.locator('.open-button');
    expect(availableActivitiesHeader).to.exist;
  });

  it('should find class ".open-button", click it, and find element with ID "myForm" that is visible', async () => {
    const availableActivitiesHeader = await page.locator('.open-button');
    await availableActivitiesHeader.click({ delay: 50 });

    const form = await page.locator('#myForm:visible');
    expect(form).to.exist;
  });

  /*
  it('should not find visible form element with ID "myForm"', async () => {
    expect(page.locator('#myForm >> visible=false')).to.not.exist;
  });

  /*
  it('should render the title "Available Activities"', async () => {
    await page.goto(config.clientUrl('/meet/find-activity'));
    const title = await page.textContent('find-activity h2');
    expect(title).to.equal('Available Activities');
  });*/
});
