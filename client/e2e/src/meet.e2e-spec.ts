/* Autor: Jonathan Hüls */

import { Browser, BrowserContext, Page, chromium } from 'playwright';
import { expect } from 'chai';
import { UserSession } from './user-session.js';
import config from './config.js';

describe('/meet/:id', () => {
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
    //no navigation through clicks. The Reason for that is that playwrith crash when implemented
  });

  afterEach(async () => {
    await userSession.deleteUser();
    await context.close();
  });

  it('should render right Meet-Name', async () => {
    await page.waitForSelector('app-meets');
    const opendMeetName = await page.textContent('.meet .name');
    await page.click('.meet .name');

    const headingElement = await page.locator('input[name="meetHeading"]').inputValue();

    expect(headingElement).to.equal('Hello Meet').and.to.equal(opendMeetName);
  });

  it('should should change Meet-Name', async () => {
    await page.waitForSelector('app-meets');
    await page.textContent('.meet .name');
    await page.click('.meet .name');

    //change name
    await page.click('input[name="meetHeading"]'); //focus input
    await page.fill('input[name="meetHeading"]', 'changedMeetName');
    await page.locator('.centerMates').click({ delay: 50 }); // unfocus input to send post

    //go back and compare
    await page.goBack();

    const changedName = await page.locator('text=changedMeetName').textContent();
    expect(changedName).to.equal('changedMeetName');
  });

  it('should render delete Button', async () => {
    await page.waitForSelector('app-meets');
    await page.textContent('.meet .name');
    await page.click('.meet .name');

    const deleteBtn = await page.textContent('.meet-Delete');
    const deleteBtnHasContent = deleteBtn ? true : false;
    expect(deleteBtnHasContent).to.be.true;
  });

  it('should redirect to Meets after delete', async () => {
    await page.waitForSelector('app-meets');
    await page.textContent('.meet .name');
    await page.click('.meet .name');

    page.on('dialog', dialog => dialog.accept());
    await page.locator('.meet-Delete').click({ delay: 50 });

    const newMeetsHeader = await page.textContent('#newMeets h2');
    const redirected = newMeetsHeader ? true : false;
    expect(redirected).to.be.true;
  });

  it('should stay at Meet after declined delete ', async () => {
    await page.waitForSelector('app-meets');
    const opendMeetName = await page.textContent('.meet .name');
    await page.click('.meet .name');

    await page.locator('.meet-Delete').click({ delay: 50 });

    const headingElement = await page.locator('input[name="meetHeading"]').inputValue();
    expect(headingElement).to.equal('Hello Meet').and.to.equal(opendMeetName);
  });

  it('should render "Find-Activities"-Btn ', async () => {
    await page.waitForSelector('app-meets');
    await page.textContent('.meet .name');
    await page.click('.meet .name');

    const activityBtnContent = await page.textContent('.routeBtn');

    expect(activityBtnContent).to.equal('Find Actitity');
  });

  it('should direct to Activities "Find-Activities"-Btn ', async () => {
    await page.waitForSelector('app-meets');
    await page.textContent('.meet .name');
    await page.click('.meet .name');

    await page.locator('.routeBtn').click();
    const correctDirected = page.url().includes('app/meet/find-activity/');

    expect(correctDirected).to.be.true;
  });
});
