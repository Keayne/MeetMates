/* Autor: Prof. Dr. Norman Lahme-Hütig (FH Münster) */

import { Browser, BrowserContext, Page, chromium } from 'playwright';
import { expect } from 'chai';
import { UserSession } from './user-session.js';
import config from './config.js';

describe('/users/sign-in', () => {
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

  it('should render the title "Login"', async () => {
    await page.goto(config.clientUrl('/mates/sign-in'));
    const title = await page.textContent('app-sign-in h1');
    expect(title).to.equal('Login');
  });

  it('should fail given wrong credentials', async () => {
    await page.goto(config.clientUrl('/mates/sign-in'));
    await page.fill('input:below(:text("E-Mail"))', userSession.email);
    await page.fill('input:below(:text("Password"))', userSession.password);
    const [response] = await Promise.all([page.waitForResponse('**/sign-in'), page.click('button:text("Login")')]);
    expect(response.status()).to.equal(401);
  });

  it('should render "E-Mail or Password not correct." on login failure', async () => {
    await page.goto(config.clientUrl('/mates/sign-in'));
    await page.fill('input:below(:text("E-Mail"))', userSession.email);
    await page.fill('input:below(:text("Password"))', userSession.password);
    await Promise.all([page.waitForResponse('**/sign-in'), page.click('button:text("Login")')]);
    expect(await page.locator('text="E-Mail or Password not correct."').count()).to.equal(1);
  });

  it('should succeed given correct credentials', async () => {
    await userSession.registerUser();
    await page.goto(config.clientUrl('/mates/sign-in'));
    await page.fill('input:below(:text("E-Mail"))', userSession.email);
    await page.fill('input:below(:text("Password"))', userSession.password);
    const [response] = await Promise.all([page.waitForResponse('**/sign-in'), page.click('button:text("Login")')]);
    expect(response.status()).to.equal(201);
    await userSession.deleteUser();
  });

  it('should render "Sign up here"', async () => {
    await userSession.registerUser();
    await page.goto(config.clientUrl('/mates/sign-in'));
    page.click('button:text("Sign up here")');
    expect(page.locator('text=Sign up here'));
    await userSession.deleteUser();
  });

  it('should render "Sign up here" and redirect to sign-up page', async () => {
    await userSession.registerUser();
    await page.goto(config.clientUrl('/mates/sign-in'));
    page.click('button:text("Sign up here")');
    expect('Location', '**/sign-up');
    await userSession.deleteUser();
  });

  /*
  it('should render forgot password reference', async () => {
    
  });*/
});
