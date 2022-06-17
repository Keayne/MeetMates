/* Autor: Arne Schaper */

import { expect } from 'chai';
import { UserSession } from './user-session.js';

describe('/mates/sign-in', () => {
  let userSession: UserSession;

  beforeEach(async () => {
    userSession = new UserSession();
  });

  it('should fail given faulty logindata', async () => {
    const response = await userSession.post('/sign-in', userSession.signUpData());
    expect(response.status).to.equal(401);
  });

  it('should successfully login', async () => {
    await userSession.registerUser();
    const response = await userSession.post('/sign-in', userSession.signInData());
    expect(response.status).to.equal(201);
    userSession.deleteUser();
  });
});
