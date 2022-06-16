/* Autor: Arne Schaper */

import { expect } from 'chai';
import { Response } from 'node-fetch';
import { Activity } from '../../src/models/activity.js';
import { Rating } from '../../src/models/rating.js';
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

describe('rating', () => {
  let userSession: UserSession;

  beforeEach(async () => {
    userSession = new UserSession();
  });

  afterEach(async () => {
    await userSession.deleteUser();
  });

  describe('rating while not logged in', () => {
    it('should fail to get rating given that the user is not logged in.', async () => {
      const response = await userSession.get(`/rating/findOne/0e8309e1-76eb-4eb9-9558-704b9358309d`);
      expect(response.status).to.equal(401);
    });

    it('should fail to get rating given that the user is not logged in.', async () => {
      const response = await userSession.get(`/rating/findAverageRating/0e8309e1-76eb-4eb9-9558-704b9358309d`);
      expect(response.status).to.equal(401);
    });

    it('should fail to get rating given that the user is not logged in.', async () => {
      const partialRating: Partial<Rating> = {
        activityid: '',
        rating: 52
      };
      const response = await userSession.patch(`/rating/0e8309e1-76eb-4eb9-9558-704b9358309d`, partialRating);
      expect(response.status).to.equal(401);
    });
  });

  describe('rating while logged in', () => {
    let userSession: UserSession;

    let meetIds: string[] = [];
    let meetResponse: Response | null;
    let activities: Array<Activity>;
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
      if (meetResponse === null) expect.fail('Response is null.');

      const activity: Partial<Activity> = {
        title: 'title',
        description: 'desc',
        tooltipcreatedby: '1234',
        motivationtitle: 'motTitle',
        meetid: `${meetIds[0]}`,
        image: '',
        category: 'Sport'
      };
      //Post a new activity as there are none on creation
      const post = await userSession.post(`/activity/${meetIds[0]}`, activity);
      if (post.status != 201) expect.fail('Failed to post new activity.');

      //Get all activities..
      const getResponse = await userSession.get(`/activity/${meetIds[0]}`);
      if (getResponse.status === 403 || getResponse.status === 404) expect.fail('Failed get requests for activities');
      // disabling es lint complaint as type is dynamic and we can ensure that this works.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      activities = ((await getResponse.json()) as any).results as Array<Activity>;
    });

    afterEach(async () => {
      await userSession.deleteUser();
      meetIds = [];
      meetResponse = null;
      activities = [];
    });

    it('should create a new rating for an activity that exists.', async () => {
      const partialRating: Partial<Rating> = {
        activityid: `${activities[0].id}`,
        rating: 52
      };
      const response = await userSession.patch(`/rating/${activities[0].id}`, partialRating);
      expect(response.status).to.equal(200);
    });

    it('should fail to patch a rating for an activity that doesnt exist.', async () => {
      const partialRating: Partial<Rating> = {
        activityid: `24242`,
        rating: 52
      };
      const response = await userSession.patch(`/rating/24242`, partialRating);
      expect(response.status).to.equal(404);
    });

    it('should not get average rating for an activity that doesnt exist.', async () => {
      const response = await userSession.get(`/rating/findAverageRating/24242`);
      expect(response.status).to.equal(404);
    });

    it('should create rating and call findAverageRating that returns the correct avgRating.', async () => {
      const partialRating: Partial<Rating> = {
        activityid: `${activities[0].id}`,
        rating: 52
      };
      const response = await userSession.patch(`/rating/${activities[0].id}`, partialRating);
      if (response.status != 200) expect.fail('Failed to create rating.');
      const response2 = await userSession.get(`/rating/findAverageRating/${activities[0].id}`);
      // disabling es lint complaint as type is dynamic and we can ensure that this works.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const avgRating = ((await response2.json()) as any).results;
      expect(avgRating).to.equal(52);
    });
  });
});
