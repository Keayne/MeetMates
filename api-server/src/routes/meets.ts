/* Autor: Jonathan Hüls */

import { randomInt } from 'crypto';
import express from 'express';
import { GenericDAO } from '../models/generic.dao.js';
import { Mate } from '../models/mate.js';
import { MateMeet } from '../models/matemeet.js';
import { Meet } from '../models/meet.js';
import { UniversalDAO } from '../models/universal.dao.js';
import { authService } from '../services/auth.service.js';
import { validatorService } from '../services/validation.service.js';

/*
import bcrypt from 'bcryptjs';
*/

interface FullMeet {
  id: string;
  name: string;
  opened: boolean;
  mates: ReturnMate[];
}
interface ReturnMate {
  id: string;
  name: string;
  firstName: string;
  src: string;
  age: string;
}

const router = express.Router();

router.get('/', authService.authenticationMiddleware, async (req, res) => {
  const mateId = res.locals.user.id;

  if (!validatorService.validateUuidv4(mateId)) {
    console.log(mateId);
    res.status(400).send;
    return;
  }

  const matemeetDAO: UniversalDAO<MateMeet> = req.app.locals.matemeetDAO;
  const meetDAO: GenericDAO<Meet> = req.app.locals.meetDAO;
  const mateDAO: GenericDAO<Mate> = req.app.locals.mateDAO;

  //Get all Meet-Ids from User
  const mateMeets = await matemeetDAO.findAll({ mateid: mateId });

  //Build all Meets with Mates
  const meets = (
    await Promise.all(
      mateMeets.map(async (mateMeet): Promise<FullMeet | null> => {
        //Get Meet
        const meetFilter: Partial<Meet> = { id: mateMeet.meetid };
        const meet: Meet | null = await meetDAO.findOne(meetFilter);
        let mates: Mate[];
        const rMates: ReturnMate[] = [];

        if (meet === null) return null;

        //Get Mates for Meet
        const meetmates = await matemeetDAO.findAll({ meetid: meet.id });
        if (meetmates !== null) {
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
        }
        return { id: meet.id, name: meet.name, opened: mateMeet.opened, mates: rMates };
      })
    )
  ).filter(fullMeet => !!fullMeet) as FullMeet[];

  if (meets.length < 2) {
    meets.push(await createNewMeet(mateId, req));
  }

  res.status(200).json(meets);
});

async function createNewMeet(mateId: string, req: express.Request): Promise<FullMeet> {
  const matemeetDAO: UniversalDAO<MateMeet> = req.app.locals.matemeetDAO;
  const meetDAO: GenericDAO<Meet> = req.app.locals.meetDAO;
  const mateDAO: GenericDAO<Mate> = req.app.locals.mateDAO;

  const newMeet = await meetDAO.create({ name: 'Hello Meet' });

  //find MeetMates
  const meetMates: ReturnMate[] = [];
  const mates = await mateDAO.findAll({ active: true });
  for (let index = 0; index < randomInt(3, 4); index++) {
    const mate = getMateFromMates(mateId, mates);
    mate.image = mate.image ? Buffer.from(mate.image).toString() : '';
    meetMates.push({
      id: mate.id,
      name: mate.name,
      firstName: mate.firstname,
      src: mate.image,
      age: mate.birthday
    });
  }
  const mateMeet: MateMeet[] = await Promise.all(
    meetMates.map(async (mate: ReturnMate): Promise<MateMeet> => {
      const newMateMeet = await matemeetDAO.create({ mateid: mate.id, meetid: newMeet.id, opened: false, rating: 0 });
      return newMateMeet;
    })
  );

  //add requested User to Meet
  mateMeet.push(await matemeetDAO.create({ mateid: mateId, meetid: newMeet.id, opened: false, rating: 0 }));

  const mate = await mateDAO.findOne({ id: mateId });
  if (mate !== null) {
    mate.image = mate.image ? Buffer.from(mate.image).toString() : '';
    meetMates.push({
      id: mate.id,
      name: mate.name,
      firstName: mate.firstname,
      src: mate.image,
      age: mate.birthday
    });
  }

  return { id: newMeet.id, name: newMeet.name, mates: meetMates, opened: false };
}

function getMateFromMates(mateId: string, mates: Mate[]): Mate {
  const mate = mates[randomInt(mates.length - 1)];
  if (mate.id === mateId) return getMateFromMates(mateId, mates);
  return mate;
}

export default router;
