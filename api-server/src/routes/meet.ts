/* Autor: Jonathan Hüls */

import express from 'express';

import { GenericDAO } from '../models/generic.dao.js';
import { UniversalDAO } from '../models/universal.dao.js';

import { Mate } from '../models/mate.js';
import { MateMeet } from '../models/matemeet.js';
import { Meet } from '../models/meet.js';

import { authService } from '../services/auth.service.js';

const router = express.Router();

interface ReturnMate {
  id: string;
  name: string;
  firstName: string;
  src: string;
  age: string;
}
interface FullMeet {
  id: string;
  name: string;
  mates: ReturnMate[];
}

router.get('/', authService.authenticationMiddleware, async (req, res) => {
  const matemeetDAO: UniversalDAO<MateMeet> = req.app.locals.matemeetDAO;
  const mateMeetFilter: Partial<MateMeet> = { mateid: res.locals.user.id };
  const mateMeets = await matemeetDAO.findAll(mateMeetFilter);

  /*
  const meetDAO: GenericDAO<Meet> = req.app.locals.meetDAO;
  const meets = await meetDAO.findAll();
  */
  res.status(201).json(mateMeets);
});

router.get('/:id', authService.authenticationMiddleware, async (req, res) => {
  const mateId = res.locals.user.id;
  const meetId = req.params.id;
  /*
  if (!checkParamsAsUuIdv4(mateId)) {
    res.status(401).send;
    console.log('Wrong Parameter');
    return;
  }
  */

  const matemeetDAO: UniversalDAO<MateMeet> = req.app.locals.matemeetDAO;
  const meetDAO: GenericDAO<Meet> = req.app.locals.meetDAO;
  const mateDAO: GenericDAO<Mate> = req.app.locals.mateDAO;

  //Get all Meet-Ids from User
  const mateMeet = await matemeetDAO.findOne({ meetid: meetId, mateid: mateId });

  if (mateMeet === null) {
    return null;
  }
  //Build Meet with Mates
  const meet: Meet | null = await meetDAO.findOne({ id: mateMeet!.meetid });
  let mates: Mate[];
  const rMates: ReturnMate[] = [];

  if (meet === null) return null;

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
      age: mate.birthday
    });
  });

  if (!meet) {
    res.status(400).json({ message: `Es existiert kein Meet mit der ID : ${meetId} ` });
  } else {
    const fullMeet: FullMeet = { id: meet.id, name: meet.name, mates: rMates };
    res.status(201).json(fullMeet);
    setMeetAsOpened(meetId, mateId, matemeetDAO);
  }
});

async function setMeetAsOpened(meetId: string, mateId: string, matemeetDAO: UniversalDAO<MateMeet>) {
  const opened = await matemeetDAO.update({ opened: true }, [
    { key: 'mateid', value: mateId },
    { key: 'meetid', value: meetId }
  ]);
}

router.post('/changeName', authService.authenticationMiddleware, async (req, res) => {
  //console.log(`User: ${res.locals.user.id} change Name from Meet: ${req.body.meetId} to "${req.body.name}"`);

  const meetDAO: GenericDAO<Meet> = req.app.locals.meetDAO;

  const meet = await meetDAO.update({
    id: req.body.meetId,
    name: req.body.newName
  });

  if (!meet) {
    res.status(400).json({ message: `Fehler beim ändern des Names von Meet: ${req.body.meetId} ` });
  } else {
    res.status(201).json(meet);
  }
});

// remove Mate from Meet
router.delete('/:meetid', authService.authenticationMiddleware, async (req, res) => {
  //console.log(`Remove User: userid${res.locals.user.id} from Meet: ${req.params.meetid}`);
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
  result ? res.status(200).send() : res.status(400).send;
});

export default router;
