import express from 'express';
import { GenericDAO } from '../models/generic.dao.js';
import { Activity } from '../models/activity.js';
import { authService } from '../services/auth.service.js';
import { MateMeet } from '../models/matemeet.js';
import { UniversalDAO } from '../models/universal.dao.js';
import { Meet } from '../models/meet.js';
import { cryptoService } from '../services/crypto.service.js';

const router = express.Router();

/**
 * Returns all activities registered for a meetId
 */
router.get('/:id', authService.authenticationMiddleware, async (req, res) => {
  const mateId = res.locals.user.id;
  const activityDAO: GenericDAO<Activity> = req.app.locals.activityDAO;
  const meetDAO: GenericDAO<Meet> = req.app.locals.meetDAO;
  //check if meet is present
  const meet: Meet | null = await meetDAO.findOne({ id: req.params.id });
  if (meet === null || meet === undefined) res.status(404).end();
  //end check
  //check if user is in meet
  const matemeetDAO: UniversalDAO<MateMeet> = req.app.locals.matemeetDAO;
  const mateMeet = await matemeetDAO.findOne({ meetid: req.params.id, mateid: mateId });
  if (mateMeet === null) res.status(403).end();
  //end check

  const filter: Partial<Activity> = { meetid: req.params.id };

  //e.title = cryptoService.decrypt(e.title);
  //e.description = cryptoService.decrypt(e.description);
  const decrActivities = (await activityDAO.findAll(filter)).map(activity => {
    return {
      ...activity,
      title: cryptoService.decrypt(activity.title),
      description: cryptoService.decrypt(activity.description),
      image: Buffer.from(activity.image as string).toString()
    };
  });
  decrActivities.forEach(activity => {
    if (mateId === activity.tooltipcreatedby) activity.deletepermission = true;
    else activity.deletepermission = false;
  });
  res.json({ results: decrActivities });
});

//    if (mateId === e.tooltipcreatedby) e.deletepermission = true;
//  for (const e of activites) {

/**
 * Adds a new activity to a meet
 */
router.post('/:id', authService.authenticationMiddleware, async (req, res) => {
  //check if meet is present
  const meetDAO: GenericDAO<Meet> = req.app.locals.meetDAO;
  const meet: Meet | null = await meetDAO.findOne({ id: req.params.id });
  if (meet === null || meet === undefined) res.status(404).end(); //meet is not present
  //end check
  //check if user is in meet
  const mateId = res.locals.user.id;
  const matemeetDAO: UniversalDAO<MateMeet> = req.app.locals.matemeetDAO;
  const mateMeet = await matemeetDAO.findOne({ meetid: req.params.id, mateid: mateId });
  if (mateMeet === null) res.status(403).end(); //user is not in meet
  //end check
  const activityDAO: GenericDAO<Activity> = req.app.locals.activityDAO;
  const utc = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
  const createdActivity = await activityDAO.create({
    title: cryptoService.encrypt(req.body.title),
    description: cryptoService.encrypt(req.body.description),
    tooltip: utc,
    tooltipcreatedby: res.locals.user.id,
    motivationtitle: req.body.motivationtitle,
    chosen: 0,
    meetid: req.params.id,
    image: req.body.image,
    category: req.body.category,
    deletepermission: true
  });
  res.status(201).json({
    ...createdActivity,
    title: cryptoService.decrypt(createdActivity.title),
    description: cryptoService.decrypt(createdActivity.description)
  });
});

/**
 * Deletes the activiyId with all corresponding ratings registered to this activity.
 */
router.delete('/:id', authService.authenticationMiddleware, async (req, res) => {
  const activityDAO: GenericDAO<Activity> = req.app.locals.activityDAO;
  const filter: Partial<Activity> = { id: req.params.id };
  const activity: Activity | null = await activityDAO.findOne(filter);

  //check if meet is present
  const meetDAO: GenericDAO<Meet> = req.app.locals.meetDAO;
  const meet: Meet | null = await meetDAO.findOne({ id: activity?.meetid });
  if (meet === null || meet === undefined) {
    res.status(404).end(); //meet is not present
  }
  //end check
  //check if user is in meet
  const mateId = res.locals.user.id;
  const matemeetDAO: UniversalDAO<MateMeet> = req.app.locals.matemeetDAO;
  const mateMeet = await matemeetDAO.findOne({ meetid: req.params.id, mateid: mateId });
  if (mateMeet === null) res.status(403).end(); //user is not in meet
  //end check

  //TODO check if the user is allowed to delete this activity.

  if (activity != null || activity != undefined) {
    if (mateId === activity.tooltipcreatedby) {
      const success = await activityDAO.delete(req.params.id); //table cascades to corresponding ratings, so no delete request necessary for ratings
      if (success) {
        res.status(200).end();
      } else {
        //TODO
      }
    }
  } else {
    res.status(404).end();
  }
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
    activites.image = Buffer.from(activites.image as string).toString();
    res.status(200).json(activites);
  } else {
    res.status(200).json({});
  }
});

export default router;
