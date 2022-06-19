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
import { cryptoService } from '../services/crypto.service.js';

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
        return { id: meet.id, name: cryptoService.decrypt(meet.name), opened: mateMeet.opened, mates: rMates };
      })
    )
  ).filter(fullMeet => !!fullMeet) as FullMeet[];

  res.status(200).json(meets);
});

async function createNewMeet(mateId: string, req: express.Request): Promise<void> {
  const matemeetDAO: UniversalDAO<MateMeet> = req.app.locals.matemeetDAO;
  const meetDAO: GenericDAO<Meet> = req.app.locals.meetDAO;
  const mateDAO: GenericDAO<Mate> = req.app.locals.mateDAO;

  const newMeet = await meetDAO.create({ name: cryptoService.encrypt('Hello Meet') });

  //find possible Mates
  const possibleMates = await mateDAO.findAll({ active: true });
  let chosenMates: Mate[] = [];
  const rNumber = await randomInt(2, 4);

  while (rNumber > chosenMates.length) {
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
}

function getMateFromMates(mateId: string, mates: Mate[], chosenMates: Mate[]): Mate {
  const randomNumber = randomInt(0, mates.length);
  const mate = mates[randomNumber];
  if (mate.id === mateId) {
    return getMateFromMates(mateId, mates, chosenMates);
  }

  //check if Mate is already in Meet
  if (containsMate(mate, chosenMates)) {
    return getMateFromMates(mateId, mates, chosenMates);
  }

  return mate;
}

function containsMate(mate: Mate, chosenMates: Mate[]) {
  let i;
  for (i = 0; i < chosenMates.length; i++) {
    if (chosenMates[i] === mate) {
      return true;
    }
  }
  return false;
}

function rmDuplicates(chosenMates: Mate[]): Mate[] {
  chosenMates = chosenMates.filter((value, index, self) => index === self.findIndex(t => t.id === value.id));
  return chosenMates;
}

export default router;
