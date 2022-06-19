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
  age: number;
}

const router = express.Router();

router.get('/', authService.authenticationMiddleware, async (req, res) => {
  const mateId = res.locals.user.id;

  if (!validatorService.validateUuidv4(mateId)) {
    res.status(400).send;
    return;
  }

  const matemeetDAO: UniversalDAO<MateMeet> = req.app.locals.matemeetDAO;
  const meetDAO: GenericDAO<Meet> = req.app.locals.meetDAO;
  const mateDAO: GenericDAO<Mate> = req.app.locals.mateDAO;

  //Get all Meet-Ids from User
  let mateMeets = await matemeetDAO.findAll({ mateid: mateId });
  //check for meets if none create new
  if (mateMeets.length < 2) {
    await createNewMeet(mateId, req);
    mateMeets = await matemeetDAO.findAll({ mateid: mateId });
  }
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
              age: new Date().getFullYear() - new Date(mate.birthday).getFullYear()
            });
          });
        }
        return { id: meet.id, name: meet.name, opened: mateMeet.opened, mates: rMates };
      })
    )
  ).filter(fullMeet => !!fullMeet) as FullMeet[];

  res.status(200).json(meets);
});

async function createNewMeet(mateId: string, req: express.Request): Promise<void> {
  const matemeetDAO: UniversalDAO<MateMeet> = req.app.locals.matemeetDAO;
  const meetDAO: GenericDAO<Meet> = req.app.locals.meetDAO;
  const mateDAO: GenericDAO<Mate> = req.app.locals.mateDAO;

  const newMeet = await meetDAO.create({ name: 'Hello Meet' });

  //find possible Mates
  const possibleMates = await mateDAO.findAll();
  let chosenMates: Mate[] = [];
  for (let index = 0; index < randomInt(3, 4); index++) {
    const mate = getMateFromMates(mateId, possibleMates, chosenMates);
    chosenMates.push(mate);
  }

  chosenMates = rmDuplicates(chosenMates);

  await Promise.all(
    chosenMates.map(async (mate: Mate): Promise<void> => {
      await matemeetDAO.create({ mateid: mate.id, meetid: newMeet.id, opened: false, rating: 0 });
    })
  );
  //add requested Mate to Meet
  await matemeetDAO.create({ mateid: mateId, meetid: newMeet.id, opened: false, rating: 0 });
  console.log(chosenMates);
  /*
  //find MeetMates
  const meetMates: ReturnMate[] = [];
  const mates = await mateDAO.findAll({ active: true });
  console.log(mates.length);

  for (let index = 0; index < 3; index++) {
    const mate = getMateFromMates(mateId, mates, meetMates);
    mate.image = mate.image ? Buffer.from(mate.image).toString() : '';
    meetMates.push({
      id: mate.id,
      name: mate.name,
      firstName: mate.firstname,
      src: mate.image,
      age: new Date().getFullYear() - new Date(mate.birthday).getFullYear()
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
  console.log(`requested User ${mateId} `);
  const mate = await mateDAO.findOne({ id: mateId });
  if (mate !== null) {
    mate.image = mate.image ? Buffer.from(mate.image).toString() : '';
    meetMates.push({
      id: mate.id,
      name: mate.name,
      firstName: mate.firstname,
      src: mate.image,
      age: new Date().getFullYear() - new Date(mate.birthday).getFullYear()
    });
  }
*/
  //return { id: newMeet.id, name: newMeet.name, mates: meetMates, opened: false };
}

function getMateFromMates(mateId: string, mates: Mate[], chosenMates: Mate[]): Mate {
  const mate = mates[randomInt(mates.length - 1)];
  if (mate.id === mateId) return getMateFromMates(mateId, mates, chosenMates);

  //check if Mate is already in Meet
  chosenMates.forEach(cMate => {
    if (mate.id === cMate.id) return getMateFromMates(mateId, mates, chosenMates);
  });
  return mate;
}

function rmDuplicates(chosenMates: Mate[]): Mate[] {
  chosenMates = chosenMates.filter((value, index, self) => index === self.findIndex(t => t.id === value.id));
  return chosenMates;
}

export default router;
