import express from 'express';
import { GenericDAO } from '../models/generic.dao.js';
import { Activity } from '../models/activity.js';
import { authService } from '../services/auth.service.js';
import { UniversalDAO } from '../models/universal.dao.js';
import { Rating } from '../models/rating.js';

const router = express.Router();

/**
 * Returns all activities registered for a meetId
 */
router.get('/:id', authService.authenticationMiddleware, async (req, res) => {
  const activityDAO: GenericDAO<Activity> = req.app.locals.activityDAO;
  const filter: Partial<Activity> = { meetid: req.params.id };
  const activites = await activityDAO.findAll(filter);
  for (const e of activites) {
    e.image = Buffer.from(e.image).toString();
  }
  res.json({ results: activites });
});

/**
 * Adds a new activity to a meet
 */
router.post('/:id', authService.authenticationMiddleware, async (req, res) => {
  const activityDAO: GenericDAO<Activity> = req.app.locals.activityDAO;
  const utc = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
  const createdActivity = await activityDAO.create({
    title: req.body.title,
    description: req.body.description,
    tooltip: utc,
    tooltipcreatedby: res.locals.user.id,
    motivationtitle: req.body.motivationtitle,
    chosen: 0,
    meetid: req.params.id,
    image: req.body.image,
    category: req.body.category
  });
  res.status(201).json(createdActivity);
});

/**
 * Deletes the activiyId with all corresponding ratings registered to this activity.
 */
router.delete('/:id', authService.authenticationMiddleware, async (req, res) => {
  const activityDAO: GenericDAO<Activity> = req.app.locals.activityDAO;
  await activityDAO.delete(req.params.id); //table cascades to corresponding ratings, so no delete request necessary for ratings
  res.status(200).end();
});

/**
 * TODO
 * Finds the highest voted activity of a MeetId. If multiple activities have the best rating, a random one is chosen.
 * Returns the activityId of the highest voted activity.
 * If there is no activity to be chosen as the highest voted one, returns an emty string.
 */
router.get('/findHighestVotedActivity/:id', authService.authenticationMiddleware, async (req, res) => {
  const mateId = res.locals.user.id;
  const meetId = req.params.id;

  const activityDAO: GenericDAO<Activity> = req.app.locals.activityDAO;
  const filter: Partial<Activity> = { meetid: req.params.id };
  const activites = await activityDAO.findAll(filter);
  const numberOfMatesRegisteredForActivity = 1; //TODO
  let leadingActivity: Activity;

  //check if an activity has already been chosen
  //TODO

  for (const e in activites) {
    //Start: Logic for finding the highest voted activity
    //End: Logic for finding the highest voted activity
  }
  /* 
  for each activity of a meeting
    get avarage voting of the activity IF all members of the meet have voted on it, save current leader 
  if leader has acvRating of 0 or there is no leader, return emtpy string-> break
  if previous check didn't catch, set the chosen attribute of the highest voted activity to "1".
  
  */
});

export default router;
