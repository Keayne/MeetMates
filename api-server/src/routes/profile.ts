/* Autor: Valentin Lieberknecht */

import express from 'express';
import { GenericDAO } from '../models/generic.dao.js';
import { Description } from '../models/description.js';
import { Interest } from '../models/interest.js';
import { Mate } from '../models/mate.js';
import { MateDescription } from '../models/matedescription.js';
import { MateInterest } from '../models/mateinterest.js';
import { UniversalDAO } from '../models/universal.dao.js';

const router = express.Router();

router.get('/descriptions', async (req, res) => {
  const descriptionDAO: GenericDAO<Description> = req.app.locals.descriptionDAO;
  const descriptions = await descriptionDAO.findAll();
  res.json(descriptions);
});

router.get('/interests', async (req, res) => {
  const interestDAO: GenericDAO<Interest> = req.app.locals.interestDAO;
  const interests = await interestDAO.findAll();
  res.json(interests);
});

router.get('/:id', async (req, res) => {
  const mateDAO: GenericDAO<Mate> = req.app.locals.mateDAO;
  const mateinterestDAO: UniversalDAO<MateInterest> = req.app.locals.mateinterestDAO;
  const interestDAO: GenericDAO<Interest> = req.app.locals.interestDAO;
  const matedescriptionDAO: UniversalDAO<MateDescription> = req.app.locals.matedescriptionDAO;
  const descriptionDAO: GenericDAO<Description> = req.app.locals.descriptionDAO;

  const mate = await mateDAO.findOne({ id: req.params.id });
  const interests = await mateinterestDAO.findAll({ mateid: req.params.id });
  const mateInterests: string[] = [];
  const mateDescriptions: { ltext: string; rtext: string; value: number }[] = [];
  for (const e of interests) {
    const interest = await interestDAO.findOne({ id: e.interestid });
    if (interest) {
      mateInterests.push(interest.text);
    }
  }
  const descriptions = await matedescriptionDAO.findAll({ mateid: req.params.id });
  for (const e of descriptions) {
    const description = await descriptionDAO.findOne({ id: e.descriptionid });
    if (description) {
      mateDescriptions.push({ ltext: description.ltext, rtext: description.rtext, value: e.value });
    }
  }
  if (mate) {
    res.json({
      mate: {
        name: mate.name,
        firstName: mate.firstname,
        birthday: mate.birthday,
        gender: mate.gender
      },
      image: Buffer.from(mate.image).toString(),
      interests: mateInterests,
      descriptons: mateDescriptions
    });
  } else {
    res.sendStatus(404);
  }
});

export default router;
