/* Autor: Jonathan Hüls */

import express from 'express';

import { GenericDAO } from '../models/generic.dao.js';
import { UniversalDAO } from '../models/universal.dao.js';

import { Mate } from '../models/mate.js';
import { MateMeet } from '../models/matemeet.js';
import { Meet } from '../models/meet.js';

import { authService } from '../services/auth.service.js';
import { validatorService } from '../services/validation.service.js';

const router = express.Router();

interface ReturnMate {
  id: string;
  name: string;
  firstName: string;
  src: string;
  age: number;
}
interface FullMeet {
  id: string;
  name: string;
  mates: ReturnMate[];
}

router.get('/', authService.authenticationMiddleware, async (req, res) => {
  if (!validatorService.validateUuidv4(res.locals.user.id)) {
    res.status(400).end();
    return;
  }

  const matemeetDAO: UniversalDAO<MateMeet> = req.app.locals.matemeetDAO;
  const mateMeetFilter: Partial<MateMeet> = { mateid: res.locals.user.id };
  const mateMeets = await matemeetDAO.findAll(mateMeetFilter);

  res.status(201).json(mateMeets);
});

router.get('/:id', authService.authenticationMiddleware, async (req, res) => {
  if (!validatorService.validateMultipleUuidv4(res.locals.user.id, req.params.id)) {
    res.status(400).end();
  }
  {
    const mateId = res.locals.user.id;
    const meetId = req.params.id;

    const matemeetDAO: UniversalDAO<MateMeet> = req.app.locals.matemeetDAO;
    const meetDAO: GenericDAO<Meet> = req.app.locals.meetDAO;
    const mateDAO: GenericDAO<Mate> = req.app.locals.mateDAO;

    //Get all Meet-Ids from User
    const mateMeet = await matemeetDAO.findOne({ meetid: meetId, mateid: mateId });

    if (!mateMeet) {
      res.status(404).end();
    }
    //Build Meet with Mates
    const meet: Meet | null = await meetDAO.findOne({ id: mateMeet!.meetid });
    let mates: Mate[];
    const rMates: ReturnMate[] = [];

    if (!meet) {
      res.status(404).end();
    }
    //Get Mates for Meet
    const meetmates = await matemeetDAO.findAll({ meetid: meet!.id });
    if (meetmates === null) {
      return null;
    }

    const matesFilter: Partial<Mate>[] = [];
    meetmates.forEach(meetMate => {
      matesFilter.push({ id: meetMate.mateid });
    });

    mates! = await mateDAO.findMultiple(...matesFilter);

    mates.forEach(mate => {
      mate.image = mate.image ? Buffer.from(mate.image).toString() : '';
      rMates.push({
        id: mate.id,
        name: mate.name,
        firstName: mate.firstname,
        src: mate.image,
        age: new Date().getFullYear() - new Date(mate.birthday).getFullYear()
      });
    });

    if (!meet) {
      res.status(400).json({ message: `Es existiert kein Meet mit der ID : ${meetId} ` });
    } else {
      const fullMeet: FullMeet = { id: meet.id, name: meet.name, mates: rMates };
      res.status(201).json(fullMeet);
      setMeetAsOpened(meetId, mateId, matemeetDAO);
    }
  }
});

async function setMeetAsOpened(meetId: string, mateId: string, matemeetDAO: UniversalDAO<MateMeet>) {
  await matemeetDAO.update({ opened: true }, [
    { key: 'mateid', value: mateId },
    { key: 'meetid', value: meetId }
  ]);
}

router.post('/changeName', authService.authenticationMiddleware, async (req, res) => {
  if (!validatorService.validateMultipleUuidv4(res.locals.user.id, req.body.meetId)) {
    res.status(400).end();
    return;
  }

  //check for Meet and if Mate is in Meet
  const meetDAO: GenericDAO<Meet> = req.app.locals.meetDAO;
  const matemeetDAO: UniversalDAO<MateMeet> = req.app.locals.matemeetDAO;
  const meetFound = await meetDAO.findOne({ id: req.body.meetId });
  const mateMeetFound = await matemeetDAO.findOne({ meetid: req.body.meetId, mateid: res.locals.user.id });

  let meetUpdated = false;
  if (!meetFound || !mateMeetFound) {
    res
      .status(404)
      .json({ message: `Meet not found: ${req.body.meetId} ` })
      .end();
  } else {
    meetUpdated = await meetDAO.update({
      id: req.body.meetId,
      name: req.body.newName
    });
  }

  if (!meetUpdated) {
    res
      .status(409)
      .json({ message: `Fehler beim ändern des Names von Meet: ${req.body.meetId} ` })
      .end();
  } else {
    res.status(201).json(meetUpdated).end();
  }
});

// remove Mate from Meet
router.delete('/:meetid', authService.authenticationMiddleware, async (req, res) => {
  if (!validatorService.validateMultipleUuidv4(res.locals.user.id, req.params.meetid)) {
    res.status(400).end();
    return;
  }

  const meetDAO: GenericDAO<Meet> = req.app.locals.meetDAO;
  const mateMeetDAO: UniversalDAO<MateMeet> = req.app.locals.matemeetDAO;
  const filter: Partial<MateMeet> = { meetid: req.params.meetid, mateid: res.locals.user.id };

  const meetMates = await mateMeetDAO.findAll({ meetid: req.params.meetid });
  let result = false;

  //check if Mate is in Meet
  if (meetMates.find(mateMeet => mateMeet.mateid === res.locals.user.id)) {
    //check if meet contains more than 2 users
    if (meetMates.length > 2) {
      //remove user from Meet
      result = await mateMeetDAO.deleteOne(filter);
    } else {
      //Remove whole Meet
      result = (await mateMeetDAO.deleteAll({ meetid: req.params.meetid })) > 0 ? true : false;
      result = await meetDAO.delete(req.params.meetid);
    }
  }
  result ? res.status(200).send() : res.status(403).send;
});

export default router;
