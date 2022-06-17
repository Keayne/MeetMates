/* Autor: Valentin Lieberknecht */

import { expect } from 'chai';
import { Browser, BrowserContext, chromium, Page } from 'playwright';
import config from './config.js';
import { UserSession } from './user-session.js';
import fetch from 'node-fetch';

describe('sign-up', () => {
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

  it('should render "Firstname has illegal characters." on login failure', async () => {
    await page.goto(config.clientUrl('/mates/sign-up'));
    await page.locator('#firstname').click();
    await page.locator('#firstname').fill('Max%h@ack$d');
    await page.locator('#name').fill('Mustermann');
    await page.locator('select').selectOption('male');
    await page.locator('#birthday').fill('2020-02-02');
    await page.locator('input[type="email"]').click();
    await page.locator('input[type="email"]').click();
    await page.locator('input[type="email"]').fill('BayerLisa@gmail.com');
    await page.locator('#password').click();
    await page.locator('#password').fill(userSession.password);
    await page.locator('#passwordCheck').click();
    await page.locator('#passwordCheck').fill(userSession.password);
    await page.locator('text=Basketball').click();
    await page.locator('text=Golf').click();
    //Select Profile Picture
    await page.setInputFiles('input[type="file"]', 'e2e/src/photo.jpg');

    await Promise.all([page.waitForResponse('**/sign-up'), page.locator('text=Create account').click()]);

    expect(await page.locator('text="Firstname has illegal characters."').count()).to.equal(1);
  });

  it('should render "An account already exists with the given email address." on login failure', async () => {
    await page.goto(config.clientUrl('/mates/sign-up'));
    await page.locator('#firstname').click();
    await page.locator('#firstname').fill('Max');
    await page.locator('#name').fill('Mustermann');
    await page.locator('select').selectOption('male');
    await page.locator('#birthday').fill('2020-02-02');
    await page.locator('input[type="email"]').click();
    await page.locator('input[type="email"]').click();
    await page.locator('input[type="email"]').fill('BayerLisa@gmail.com');
    await page.locator('#password').click();
    await page.locator('#password').fill(userSession.password);
    await page.locator('#passwordCheck').click();
    await page.locator('#passwordCheck').fill(userSession.password);
    await page.locator('text=Basketball').click();
    await page.locator('text=Golf').click();
    //Select Profile Picture
    await page.setInputFiles('input[type="file"]', 'e2e/src/photo.jpg');

    await Promise.all([page.waitForResponse('**/sign-up'), page.locator('text=Create account').click()]);

    expect(await page.locator('text="An account already exists with the given email address."').count()).to.equal(1);
  });

  it('should register new user', async () => {
    await page.goto(config.clientUrl('/mates/sign-up'));
    await page.locator('#firstname').click();
    await page.locator('#firstname').fill('Max');
    await page.locator('#name').fill('Mustermann');
    await page.locator('select').selectOption('male');
    await page.locator('#birthday').fill('2020-02-02');
    await page.locator('input[type="email"]').click();
    await page.locator('input[type="email"]').click();
    await page.locator('input[type="email"]').fill(userSession.email);
    await page.locator('#password').click();
    await page.locator('#password').fill(userSession.password);
    await page.locator('#passwordCheck').click();
    await page.locator('#passwordCheck').fill(userSession.password);
    await page.locator('text=Basketball').click();
    await page.locator('text=Golf').click();
    //Select Profile Picture
    await page.setInputFiles('input[type="file"]', 'e2e/src/photo.jpg');

    const [response] = await Promise.all([
      page.waitForResponse('**/sign-up'),
      page.locator('text=Create account').click()
    ]);

    expect(response.status()).to.equal(201);

    //Delete User
    const delres = await fetch(config.serverUrl('delete'), {
      method: 'DELETE',
      headers: { Cookie: `jwt-token=${((await context.cookies()) as unknown as [{ value: string }])[0].value}` }
    });

    expect(delres.status).to.equal(200);
  });
});
