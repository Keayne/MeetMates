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

describe('Meet', () => {
  let userSession: UserSession;

  describe('Requests without registered Mate', () => {
    beforeEach(async () => {
      userSession = new UserSession();
    });

    it('should fail to get Meet ', async () => {
      const response = await userSession.get('/meet/3e1f9e5b-616c-4d91-9be1-90dc8d52a621');
      expect(response.status).to.equal(401);
    });

    it('should fail to post new Meetname ', async () => {
      const response = await userSession.post('/meet/changeName', {
        meetId: '3e1f9e5b-616c-4d91-9be1-90dc8d52a621',
        newName: 'FAIL'
      });
      expect(response.status).to.equal(401);
    });

    it('should fail to remove Mate from Meet ', async () => {
      const response = await userSession.delete('/meet/3e1f9e5b-616c-4d91-9be1-90dc8d52a621');
      expect(response.status).to.equal(401);
    });
  });

  describe('#Requests with faulty ID ', () => {
    beforeEach(async () => {
      userSession = new UserSession();
      await userSession.registerUser();
    });

    it('should fail to get Meet', async () => {
      const response = await userSession.get('/meet/3e1f9e5b9be1-90dc8d52a621');
      expect(response.status).to.equal(400);
    });

    it('should fail to change MeetName', async () => {
      const response = await userSession.post('/meet/changeName', {
        meetId: '3e1f9e5b9be1-90dc8d52a621',
        newName: 'FAIL'
      });
      expect(response.status).to.equal(400);
    });

    it('should fail to change MeetName with unkown MeetId', async () => {
      const response = await userSession.post('/meet/changeName', {
        meetId: '5ee5e5ca-b3b7-41ed-8292-d53eb5eddbf9',
        newName: 'FAIL'
      });
      expect(response.status).to.equal(404);
    });

    it('should fail to remove Mate from Meet', async () => {
      const response = await userSession.delete('/meet/3e1f9e5b9be1-90dc8d52a621');
      expect(response.status).to.equal(400);
    });
  });

  describe('#Successful Requests ', () => {
    let meetId: string;
    beforeEach(async () => {
      userSession = new UserSession();
      await userSession.registerUser();

      // Get MeetId to work with
      const response = await userSession.get('/meets/');
      const meets = (await response.json()) as Array<Meet>;
      if (meets.length > 0) {
        meetId = meets[0].id;
      }
    });
    describe('#GET ', () => {
      it('should succeed to get single Meet', async () => {
        const response = await userSession.get(`/meet/${meetId}`);
        expect(response.status).to.equal(201);
      });

      it('should succeed to get requested Meet', async () => {
        const response = await userSession.get(`/meet/${meetId}`);
        const meet = (await response.json()) as Meet;
        expect(meet.id).to.equal(meetId);
      });
    });

    describe('#Post ', () => {
      it('should succeed to change a MeetName', async () => {
        const response = await userSession.post(`/meet/changeName`, {
          meetId: meetId,
          newName: 'noFAIL'
        });
        const success = (await response.json()) as boolean;
        expect(success).to.equal(true);
      });

      it('should succeed to change the MeetName', async () => {
        const changeResponse = await userSession.post(`/meet/changeName`, {
          meetId: meetId,
          newName: 'noFAIL'
        });
        const success = (await changeResponse.json()) as boolean;

        //Check if meet has been changed
        if (success) {
          const meetResponse = await userSession.get(`/meet/${meetId}`);
          const meet = (await meetResponse.json()) as Meet;
          expect(meet.name).to.equal('noFAIL');
        }
      });
    });

    describe('#Delete ', () => {
      it('should succed to remove Mate from Meet', async () => {
        const response = await userSession.delete(`/meet/${meetId}`);
        expect(response.status).to.equal(200);
      });

      it('Mate always has min 1 Meet', async () => {
        const deleteResponse = await userSession.delete(`/meet/${meetId}`);
        if (deleteResponse.status === 200) {
          await userSession.get('/meets/');
          const meetsResponse2 = await userSession.get('/meets/');
          const meets = (await meetsResponse2.json()) as Array<Meet>;
          expect(meets.length).to.be.greaterThan(0);
        } else expect.fail('Failed to delet');
      });

      it('deleted Meet not in Mates-meets after delet', async () => {
        const deleteResponse = await userSession.delete(`/meet/${meetId}`);

        if (deleteResponse.status === 200) {
          await userSession.get('/meets/');
          const meetsResponse2 = await userSession.get('/meets/');
          const meets = (await meetsResponse2.json()) as Array<Meet>;

          meets.forEach(meet => {
            if (meet.id === meetId) expect.fail('Failed Mate still has deleted meet');
          });
          expect(meets.length).to.be.greaterThan(0);
        } else expect.fail('Failed to delet');
      });
    });

    afterEach(async () => {
      await userSession.deleteUser();
    });
  });
});
