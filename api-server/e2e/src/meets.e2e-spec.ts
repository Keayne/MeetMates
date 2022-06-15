/* Autor: Jonathan Hüls */

import { expect } from 'chai';
import { UserSession } from './user-session.js';

interface Meet {
  id: string;
  name: string;
  opened: boolean;
  mates: Mate[];
}
interface Mate {
  id: string;
  name: string;
  src: string;
  age: string;
}

describe('meets', () => {
  let userSession: UserSession;

  beforeEach(async () => {
    userSession = new UserSession();
  });

  afterEach(async () => {
    await userSession.deleteUser();
  });

  describe('#GET', () => {
    it('should fail given that the Mate is not logged in', async () => {
      const response = await userSession.get('/meets/');
      expect(response.status).to.equal(401);
    });

    it('should succeed given that the Mate is logged in', async () => {
      await userSession.registerUser();
      const response = await userSession.get('/meets/');
      expect(response.status).to.equal(200);
    });

    it('should return initial Meet for newMate ', async () => {
      await userSession.registerUser();
      const response = await userSession.get('/meets/');
      const meets = (await response.json()) as Array<Meet>;
      expect(meets.length).to.equal(1);
    });

    it('should return second Meet for newMate ', async () => {
      await userSession.registerUser();
      await userSession.get('/meets/');
      const response2 = await userSession.get('/meets/');
      const meets = (await response2.json()) as Array<Meet>;
      expect(meets.length).to.equal(2);
    });
  });
});
