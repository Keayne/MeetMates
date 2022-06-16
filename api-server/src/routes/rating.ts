/* Autor: Arne Schaper */
import express from 'express';
import { Activity } from '../models/activity.js';
import { GenericDAO } from '../models/generic.dao.js';
import { MateMeet } from '../models/matemeet.js';
import { Rating } from '../models/rating.js';
import { UniversalDAO } from '../models/universal.dao.js';
import { authService } from '../services/auth.service.js';

const router = express.Router();

interface FullActivity {
  id: string;
  title: string;
  chosen: number;
  meetid: string;
  category: string;
  ratings: ReturnRating[];
}
interface ReturnRating {
  mateId: string;
  rating: number;
}

router.get('/findOne/:id', authService.authenticationMiddleware, async (req, res) => {
  //check if activity exists
  const activityDAO: GenericDAO<Activity> = req.app.locals.activityDAO;
  const filterActivity: Partial<Activity> = { id: req.params.id };
  const activity = await activityDAO.findOne(filterActivity);
  if (activity === null || activity === undefined) {
    res.status(404).end(); //could not find the activity for the rating
  }
  //end check
  //check if mate is in meet
  const mateId = res.locals.user.id;
  const matemeetDAO: UniversalDAO<MateMeet> = req.app.locals.matemeetDAO;
  const mateMeet = await matemeetDAO.findOne({ meetid: activity?.id, mateid: mateId });
  if (mateMeet === null) res.status(403).end();
  //end check
  const ratingDAO: UniversalDAO<Rating> = req.app.locals.ratingDAO;
  const filter: Partial<Rating> = { activityid: req.params.id, userid: mateId };
  const rating = await ratingDAO.findOne(filter);
  if (rating) {
    res.status(200).json({ results: rating });
  } else {
    res.status(200).json({ results: 0 });
  }
});

router.get('/findAverageRating/:id', authService.authenticationMiddleware, async (req, res) => {
  //check if activity exists
  const activityDAO: GenericDAO<Activity> = req.app.locals.activityDAO;
  const filterActivity: Partial<Activity> = { id: req.params.id };
  const activity = await activityDAO.findOne(filterActivity);
  if (activity === null || activity === undefined) {
    res.status(404).end(); //could not find the activity for the rating
  }
  //end check
  //check if mate is in meet
  const mateId = res.locals.user.id;
  const matemeetDAO: UniversalDAO<MateMeet> = req.app.locals.matemeetDAO;
  const mateMeet = await matemeetDAO.findOne({ meetid: activity?.id, mateid: mateId });
  if (mateMeet === null) res.status(403).end();
  //end check
  const ratingDAO: UniversalDAO<Rating> = req.app.locals.ratingDAO;
  const filter: Partial<Rating> = { activityid: req.params.id };
  const ratings = await ratingDAO.findAll(filter);
  //calculate average value

  let sum = 0;
  let counter = 0;
  ratings.forEach(element => {
    sum = sum + element.rating;
    counter++;
  });
  const avgRating = sum / counter;

  res.status(200).json({ results: avgRating || 0 });
});

/**
 * id: activityId
 */
router.patch('/:id', authService.authenticationMiddleware, async (req, res) => {
  //check if activity exists
  const activityDAO: GenericDAO<Activity> = req.app.locals.activityDAO;
  const filter: Partial<Activity> = { id: req.params.id };
  const activity = await activityDAO.findOne(filter);
  if (activity === null || activity === undefined) {
    res.status(404).end(); //could not find the activity for the rating
  }
  //end check
  //check if mate is in meet
  const mateId = res.locals.user.id;
  const matemeetDAO: UniversalDAO<MateMeet> = req.app.locals.matemeetDAO;
  const mateMeet = await matemeetDAO.findOne({ meetid: activity?.id, mateid: mateId });
  if (mateMeet === null) res.status(403).end();
  //end check
  const ratingDAO: UniversalDAO<Rating> = req.app.locals.ratingDAO;
  const rating = await ratingDAO.findOne({ activityid: req.body.activityid, userid: res.locals.user.id });
  let result = false;
  if (rating) {
    const updatedRating = await ratingDAO.update(
      {
        activityid: req.body.activityid,
        userid: res.locals.user.id,
        rating: req.body.rating
      },
      [
        { key: 'activityid', value: req.body.activityid },
        { key: 'userid', value: res.locals.user.id }
      ]
    );
    result = updatedRating ? true : false;
  } else {
    const createdRating = await ratingDAO.create({
      activityid: req.body.activityid,
      userid: res.locals.user.id,
      rating: req.body.rating
    });
    result = createdRating ? true : false;
  }
  if (result) {
    updateChosenActivity(req, res);
    res.status(200).end();
  } else {
    res.status(500).end();
  }
});

async function updateChosenActivity(req: express.Request, res: express.Response) {
  const ratingDAO: UniversalDAO<Rating> = req.app.locals.ratingDAO;

  //get meetId
  const activityDAO: GenericDAO<Activity> = req.app.locals.activityDAO;
  const filter: Partial<Activity> = { id: req.body.activityid };
  const currentActivity = await activityDAO.findOne(filter);
  const meetId = currentActivity?.meetid;

  if (!meetId) res.status(500).end(); //could not find meetId for corresponding rating

  //get the number of mates for a meet
  const mateMeetDAO: UniversalDAO<MateMeet> = req.app.locals.matemeetDAO;
  const matesInMeet = await mateMeetDAO.findAll({ meetid: meetId });
  const numberOfMatesInMeet = matesInMeet.length;
  if (numberOfMatesInMeet === 0) res.status(500).end(); //if no mates were found for a meet, terminate as this should not be possible

  //find all Activities for a Meet
  const filterGetAllActivitiesForMeetId: Partial<Activity> = { meetid: meetId };
  const activityList = await activityDAO.findAll(filterGetAllActivitiesForMeetId);

  //
  const activityRatings = await Promise.all(
    activityList.map(async (activity): Promise<FullActivity | null> => {
      const ratings = await ratingDAO.findAll({ activityid: activity.id });
      const jsonRating: ReturnRating[] = [];
      ratings.forEach(rating => {
        jsonRating.push({
          mateId: rating.userid,
          rating: rating.rating
        });
      });
      return { ...activity, ratings: jsonRating };
    })
  );
  if (!activityRatings[0]) res.status(500).send(); //no activity found, should not be possible as rating has to be assigned to an activity

  //iterate through all activities, check if the activity has all criteria to be considered as chosen activity
  let eligibleLeadingActivity: FullActivity = {
    id: '',
    title: '',
    chosen: 0,
    meetid: '',
    category: '',
    ratings: []
  };
  let eligibleLeadingActivityCalcSUm = 0;
  activityRatings.forEach(activity => {
    let rating = 0;
    let numberOfRatings = 0;
    activity?.ratings.forEach(element => {
      numberOfRatings++;
      rating += element.rating;
    });
    //eligible activity
    if (numberOfRatings === numberOfMatesInMeet && rating > eligibleLeadingActivityCalcSUm) {
      eligibleLeadingActivity = activity as FullActivity;
      eligibleLeadingActivityCalcSUm = rating;
    }
  });

  //set attr. of chosen activity to 1
  const chosenActivity = await activityDAO.findOne({ id: eligibleLeadingActivity.id });
  if (chosenActivity) {
    chosenActivity.chosen = 1;
    delete chosenActivity.image;
    activityDAO.update(chosenActivity);
  }
}

export default router;
