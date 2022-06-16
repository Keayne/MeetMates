/* Autor: Arne Schaper */

import { expect } from 'chai';
import { Response } from 'node-fetch';
import { Activity } from '../../src/models/activity.js';
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

describe('activity', () => {
  let userSession: UserSession;

  beforeEach(async () => {
    userSession = new UserSession();
  });

  afterEach(async () => {
    await userSession.deleteUser();
  });

  describe('Fail to login', () => {
    it('should fail given that the user is not logged in.', async () => {
      const response = await userSession.get(`/activity/0e8309e1-76eb-4eb9-9558-704b9358309d`);
      expect(response.status).to.equal(401);
    });

    it('should fail to post an activity as the user is not logged in.', async () => {
      const activity: Partial<Activity> = {
        title: 'title',
        description: 'desc',
        tooltipcreatedby: '1234',
        motivationtitle: 'motTitle',
        meetid: ``,
        image: '',
        category: 'Sport'
      };
      const post = await userSession.post(`/activity/b3b9f92b-3845-479b-a896-540c049ab1b3`, activity);
      expect(post.status).to.equal(401);
    });

    it('should fail to delete an activity as the user is not logged in.', async () => {
      const deleteReq = await userSession.delete(`/activity/db1a0c51-8f60-46c2-af93-b84204166610`);
      expect(deleteReq.status).to.equal(401);
    });
  });

  describe('Get activities for meet', () => {
    let meetIds: string[] = [];
    let meetResponse: Response | null;
    beforeEach(async () => {
      userSession = new UserSession();
      await userSession.registerUser();
      await userSession.get('/meets/');
      meetResponse = await userSession.get('/meets/');
      const meets = (await meetResponse.json()) as Array<Meet>;
      if (meets.length !== 0) {
        meets.forEach(meet => {
          meetIds.push(meet.id);
        });
      }
    });

    afterEach(async () => {
      await userSession.deleteUser();
      meetIds = [];
      meetResponse = null;
    });

    it('should be able to access find activity page for correct meetId', async () => {
      const redirect = await userSession.get(`/activity/${meetIds[0]}`);
      if (meetResponse != null) {
        expect(redirect.status).to.equal(200);
      } else {
        expect(meetResponse).to.not.be.equal(null);
      }
    });

    it('should fail given that the MeetId is not present.', async () => {
      const response = await userSession.get(`/activity/0e8309e1-76eb-4eb9-9558-704b9358309d`);
      expect(response.status).to.equal(404);
    });
  });

  describe('Create and delete activities for a meet', () => {
    let meetIds: string[] = [];
    let meetResponse: Response | null;
    beforeEach(async () => {
      userSession = new UserSession();
      await userSession.registerUser();
      await userSession.get('/meets/');
      meetResponse = await userSession.get('/meets/');
      const meets = (await meetResponse.json()) as Array<Meet>;
      if (meets.length !== 0) {
        meets.forEach(meet => {
          meetIds.push(meet.id);
        });
      }
    });

    afterEach(async () => {
      await userSession.deleteUser();
      meetIds = [];
      meetResponse = null;
    });

    it('should be able to create a new activity', async () => {
      if (meetResponse === null) expect(meetResponse).to.not.be.equal(null);
      const activity: Partial<Activity> = {
        title: 'title',
        description: 'desc',
        tooltipcreatedby: '1234',
        motivationtitle: 'motTitle',
        meetid: `${meetIds[0]}`,
        image: '',
        category: 'Sport'
      };
      const post = await userSession.post(`/activity/${meetIds[0]}`, activity); //TODO make sure redirect is valid and doenst return error
      expect(post.status).to.equal(201);
    });

    it('should fail to post a new activity for a meet that doesnt exist.', async () => {
      if (meetResponse === null) expect(meetResponse).to.not.be.equal(null);
      const activity: Partial<Activity> = {
        title: 'title',
        description: 'desc',
        tooltipcreatedby: '1234',
        motivationtitle: 'motTitle',
        meetid: `${meetIds[0]}`,
        image: '',
        category: 'Sport'
      };
      const post = await userSession.post(`/activity/b3b9f92b-3845-479b-a896-540c049ab1b3`, activity); //TODO make sure redirect is valid and doenst return error
      expect(post.status).to.equal(404);
    });

    it('should create an activity for a meet, then successfully get all activities, and finally delete it.', async () => {
      if (meetResponse === null) expect(meetResponse).to.not.be.equal(null);
      const activity: Partial<Activity> = {
        title: 'title',
        description: 'desc',
        motivationtitle: 'motTitle',
        meetid: `${meetIds[0]}`,
        image: '',
        category: 'Sport'
      };
      const post = await userSession.post(`/activity/${meetIds[0]}`, activity); //TODO make sure redirect is valid and doenst return error
      if (post.status === 404) expect.fail('Failed to post activity.'); //could not create an activity to delete..

      const getResponse = await userSession.get(`/activity/${meetIds[0]}`);
      if (getResponse.status === 403 || getResponse.status === 404) expect.fail('Failed get requests for activities');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const activities = ((await getResponse.json()) as any).results as Array<Activity>;

      const deleteReq = await userSession.delete(`/activity/${activities[0].id}`);
      expect(deleteReq.status).to.equal(200);
    });
  });
});
