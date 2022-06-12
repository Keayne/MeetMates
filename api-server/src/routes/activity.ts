import express from 'express';
import { GenericDAO } from '../models/generic.dao.js';
import { Activity } from '../models/activity.js';
import { authService } from '../services/auth.service.js';

const router = express.Router();

/**
 * Returns all activities registered for a meetId
 */
router.get('/:id', authService.authenticationMiddleware, async (req, res) => {
  const activityDAO: GenericDAO<Activity> = req.app.locals.activityDAO;
  const filter: Partial<Activity> = { meetid: req.params.id };
  const activites = await activityDAO.findAll(filter);
  for (const e of activites) {
    e.image = Buffer.from(e.image as string).toString();
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
 * Finds the highest voted activity of a MeetId.
 * If there is no current chosen activity, return an empty string.
 */
router.get('/findChosenActivity/:id', authService.authenticationMiddleware, async (req, res) => {
  const activityDAO: GenericDAO<Activity> = req.app.locals.activityDAO;
  const filter: Partial<Activity> = { meetid: req.params.id, chosen: 1 };
  const activites = await activityDAO.findOne(filter);

  if (activites) {
    res.status(200).json(activites);
  } else {
    res.status(200).json({});
  }
});

export default router;
