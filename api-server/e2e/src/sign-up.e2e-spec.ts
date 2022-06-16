/* Autor: Valentin Lieberknecht */

import { expect } from 'chai';
import { UserSession } from './user-session.js';

type ResponseType = {
  message: string;
};

describe('/sign-in', () => {
  let userSession: UserSession;

  beforeEach(async () => {
    userSession = new UserSession();
  });

  afterEach(async () => {
    userSession.deleteUser();
  });

  it('should fail given wrong credentials', async () => {
    const response = await userSession.post('/sign-in', userSession.signUpData());
    expect(response.status).to.eq(401);
  });

  it('should succeed given proper credentials', async () => {
    await userSession.registerUser();
    const response = await userSession.post('/sign-in', userSession.signInData());

    expect(response.status).to.eq(201);
  });

  it('should not create user, not meet the requirements', async () => {
    // const user: Mate = {
    //   name: 'Lieberknecht',
    //   firstname: 'Valentin',
    //   email: 'asdfasdfasdf@test.de',
    //   birthday: '2022-04-26',
    //   gender: 'diverse',
    //   image: 'data:image/png;base64,iV',
    //   password: '123456',
    //   passwordCheck: '123456',
    //   interests: [],
    //   descriptions: []
    // };
    const response = await userSession.post('/sign-up', {
      ...userSession.signUpData(),
      password: '123456',
      passwordCheck: '123456'
    });
    const text = (await response.json()) as ResponseType;
    expect(response.status).to.eq(400);
    expect(text.message).to.eq('Passwort entspricht nicht den Anforderungen!');
  });

  it('should not create user, password and passwordCheck does not match', async () => {
    const response = await userSession.post('/sign-up', {
      ...userSession.signUpData(),
      password: '123456Aa$',
      passwordCheck: '123456Aa'
    });
    const text = (await response.json()) as ResponseType;
    expect(response.status).to.eq(400);
    expect(text.message).to.eq('Die beiden Passwörter stimmen nicht überein.');
  });

  it('should not create user, email already exists', async () => {
    const response = await userSession.post('/sign-up', { ...userSession.signUpData(), email: 'BayerLisa@gmail.com' });
    const text = (await response.json()) as ResponseType;
    expect(response.status).to.eq(400);
    expect(text.message).to.eq('Es existiert bereits ein Konto mit der angegebenen E-Mail-Adresse.');
  });

  it('should fail when not logged in /verify', async () => {
    const verify = await userSession.get('/verify');
    expect(verify.status).to.eq(200);
    const res = (await verify.json()) as { login: boolean };
    expect(res.login).false;
  });

  it('should work when loggedin when logged in /verify', async () => {
    await userSession.registerUser();
    const response = await userSession.post('/sign-in', userSession.signInData());
    expect(response.status).to.eq(201);
    const verify = await userSession.get('/verify');
    expect(verify.status).to.eq(200);
    const res = (await verify.json()) as { login: boolean };
    expect(res.login).true;
  });

  it('should sign out when logged-in', async () => {
    await userSession.registerUser();
    const response = await userSession.post('/sign-in', userSession.signInData());
    const out = await userSession.delete('/sign-out');
    expect(out.status).to.eq(200);
    const verify = await userSession.get('/verify');
    const res = (await verify.json()) as { login: boolean };
    expect(res.login).false;
    expect(response.status).to.eq(201);
  });
});
