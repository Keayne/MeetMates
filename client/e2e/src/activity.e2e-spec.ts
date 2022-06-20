/* Autor: Arne Schaper */

import { Browser, BrowserContext, Page, chromium } from 'playwright';
import { expect } from 'chai';
import { UserSession } from './user-session.js';
import config from './config.js';

describe('/meet/find-activity', () => {
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
  });

  afterEach(async () => {
    await userSession.deleteUser();
    await context.close();
  });

  it('should find class ".open-button"', async () => {
    const availableActivitiesHeader = page.locator('.open-button');
    expect(availableActivitiesHeader).to.exist;
  });

  it('should find div "activity-header"', async () => {
    const availableActivitiesHeader = page.locator('.activity-header');
    expect(availableActivitiesHeader).to.exist;
  });

  it('should find class ".open-button", click it, and find element with ID "myForm" that is visible', async () => {
    const availableActivitiesHeader = page.locator('.open-button');
    await availableActivitiesHeader.click({ delay: 50 });

    const form = page.locator('#myForm:visible');
    expect(form).to.exist;
  });

  it('should find class ".open-button", click it, find title field with ID "title" and assure it works', async () => {
    const availableActivitiesHeader = page.locator('.open-button');
    await availableActivitiesHeader.click({ delay: 50 });

    await page.click('input[name="title"]'); //focus input
    await page.fill('input[name="title"]', 'testTitle');

    const result = await page.locator('#title').inputValue();
    expect(result).to.equal('testTitle');
  });

  it('should find class ".open-button", click it, find field with ID "inputimage"', async () => {
    const availableActivitiesHeader = page.locator('.open-button');
    await availableActivitiesHeader.click({ delay: 50 });

    const form = await page.locator('#inputimage');
    expect(form).to.exist;
  });

  it('should find class ".open-button", click it, find field with ID "description"', async () => {
    const availableActivitiesHeader = page.locator('.open-button');
    await availableActivitiesHeader.click({ delay: 50 });

    const form = page.locator('#description');
    expect(form).to.exist;
  });

  it('should find class ".open-button", click it, find field with ID "category"', async () => {
    const availableActivitiesHeader = page.locator('.open-button');
    await availableActivitiesHeader.click({ delay: 50 });

    const form = page.locator('#category');
    expect(form).to.exist;
  });

  it('should find class ".open-button", click it, find field with ID "motivationTitle"', async () => {
    const availableActivitiesHeader = page.locator('.open-button');
    await availableActivitiesHeader.click({ delay: 50 });

    const form = page.locator('#motivationTitle');
    expect(form).to.exist;
  });

  it('should click the image button and upload an image', async () => {
    const availableActivitiesHeader = page.locator('.open-button');
    await availableActivitiesHeader.click({ delay: 50 });

    await page.setInputFiles('#inputimage', 'e2e/src/photo.jpg');
  });

  it('should successfully create an activity', async () => {
    const availableActivitiesHeader = page.locator('.open-button');
    await availableActivitiesHeader.click({ delay: 50 });

    //fill title
    await page.click('input[name="title"]'); //focus input
    await page.fill('input[name="title"]', 'testTitle');

    //fill description
    await page.click('input[name="description"]'); //focus input
    await page.fill('input[name="description"]', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

    //choose category
    //await page.click('input[name="title"]'); //focus input
    //await page.fill('input[name="title"]', 'testTitle');

    //fill motTitle
    await page.click('input[name="motivationTitle"]'); //focus input
    await page.fill('input[name="motivationTitle"]', 'motTitle');

    await page.locator('#createBtn').click();
    const activity = page.locator('#card');
    expect(activity).to.exist;
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
