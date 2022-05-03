/* Autor: Valentin Lieberknecht */

import express from 'express';
import { GenericDAO } from '../models/generic.dao.js';
import { Description } from '../models/description.js';
import { Interest } from '../models/interest.js';

const router = express.Router();

router.get('/descriptions', async (req, res) => {
  const descriptionDAO: GenericDAO<Description> = req.app.locals.descriptionDAO;
  const descirptions = await descriptionDAO.findAll();
  res.json(descirptions);
});

router.get('/interests', async (req, res) => {
  const interestDAO: GenericDAO<Interest> = req.app.locals.interestDAO;
  const interests = await interestDAO.findAll();
  res.json(interests);
});

export default router;
