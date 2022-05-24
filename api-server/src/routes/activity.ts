import express from 'express';
import { GenericDAO } from '../models/generic.dao.js';
import { Activity } from '../models/activity.js';
import { authService } from '../services/auth.service.js';
import * as crypto from 'crypto';
import { Rating } from '../models/rating.js';

const router = express.Router();

router.get('/:id', authService.authenticationMiddleware, async (req, res) => {
  const activityDAO: GenericDAO<Activity> = req.app.locals.activityDAO;
  const filter: Partial<Activity> = { meetid: req.params.id }; //TODO NEEDS TO CHECK IF USER IS ALLOWED TO MAKE REQUEST
  const activites = await activityDAO.findAll(filter);
  for (const e of activites) {
    e.image = Buffer.from(e.image).toString();
  }
  res.json({ results: activites });
});

router.post('/', authService.authenticationMiddleware, async (req, res) => {
  const activityDAO: GenericDAO<Activity> = req.app.locals.activityDAO;
  var utc = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
  const createdActivity = await activityDAO.create({
    title: req.body.title,
    description: req.body.description,
    tooltip: `Created at ${utc}`,
    tooltipcreatedby: res.locals.user.id,
    motivationtitle: req.body.motivationtitle,
    chosen: 0,
    meetid: '0ea6639d-c6d5-4030-bb1b-e687ecb850fb', //read id from req url
    image: req.body.image,
    category: req.body.category
  });
  res.status(201).json(createdActivity);
});

export default router;
