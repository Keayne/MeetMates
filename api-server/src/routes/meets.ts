/* Autor: Jonathan Hüls */

import express from 'express';
import { GenericDAO } from '../models/generic.dao.js';
import { Mate } from '../models/mate.js';
import { MateMeet } from '../models/matemeet.js';
import { Meet } from '../models/meet.js';
import { UniversalDAO } from '../models/universal.dao.js';
import { authService } from '../services/auth.service.js';

/*
import bcrypt from 'bcryptjs';
*/

interface FullMeet {
  id: string;
  name: string;
  activityId: string;
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

  if (!checkParamsAsUuIdv4(mateId)) {
    res.status(401).send;
    console.log('Wrong Parameter');
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
            rMates.push({
              id: mate.id,
              name: mate.name,
              firstName: mate.firstname,
              src: mate.image,
              age: mate.birthday
            });
          });
        }
        return { id: meet.id, name: meet.name, activityId: meet.activityId, mates: rMates };
      })
    )
  ).filter(fullMeet => !!fullMeet) as FullMeet[];

  res.status(201).json(meets);
});

function checkParamsAsUuIdv4(...Ids: string[]): boolean {
  const regexp = new RegExp('^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$', 'i'); //Regex vor UuidV4 lo

  //check for values
  if (Ids.length === 0) return false;

  //check Ids
  let result = true;
  Ids.forEach(id => {
    if (!regexp.test(id)) {
      result = false;
    }
  });

  return result;
}

export default router;
