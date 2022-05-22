/* Autor: Jonathan Hüls */

import express from 'express';
import { GenericDAO } from '../models/generic.dao';

import { MateMeet } from '../models/matemeet';
//import { Meet } from '../models/meet';
import { UniversalDAO } from '../models/universal.dao';
const router = express.Router();

interface Mate {
  id: string;
  name: string;
  firstName: string;
  src: string;
  age: string;
}
interface Meet {
  id: string;
  name: string;
  activityId: string;
  mates: Mate[];
}

const mates: Mate[] = [
  {
    id: '123123',
    name: 'Müller',
    firstName: 'Peter',
    src: '/favicon.png',
    age: '15'
  },
  {
    id: 'sdgwegsd',
    name: 'Bach',
    firstName: 'Jürgen',
    src: '',
    age: '123'
  },
  {
    id: 'dvbnkjdfbhgi',
    name: 'Meyer',
    firstName: 'Lisa',
    src: '',
    age: '23'
  }
];

const meet: Meet = {
  id: '12341245',
  name: 'SoccerKings',
  activityId: '1234567890',
  mates: mates
};

router.get('/', async (req, res) => {
  const matemeetDAO: UniversalDAO<MateMeet> = req.app.locals.matemeetDAO;
  const mateMeetFilter: Partial<MateMeet> = { mateid: res.locals.user.id };
  const mateMeets = await matemeetDAO.findAll(mateMeetFilter);

  /*
  const meetDAO: GenericDAO<Meet> = req.app.locals.meetDAO;
  const meets = await meetDAO.findAll();
  */
  res.status(201).json(mateMeets);
});

router.get('/:id', async (req, res) => {
  /*
  const meetDAO: GenericDAO<Meet> = req.app.locals.meetDAO;
  const filter: Partial<Meet> = { id: req.params.id };
  const meet = await meetDAO.findOne(filter);
  */

  res.status(201).json(meet);
});

/* //ein user kann kein Meet anlegen 
router.post('/create', async (req, res) => {
  const meetDAO: GenericDAO<Meet> = req.app.locals.meetDAO;
  const filter: Partial<Meet> = { id: req.body.id };

  console.log(res.locals);
  res.status(200).json(meet);
});
*/

// remove Mate from Meet
router.delete('/:meetid', async (req, res) => {
  console.log(`Remove User: mateid{req.params.mateid} from Meet: ${req.params.meetid}`);
  /*
  const mateMeetDAO: UniversalDAO<MateMeet> = req.app.locals.matemeetDAO;
  const filter: Partial<MateMeet> = { meetid: req.params.meetid, userid: req.params.userid };

  console.log(mateMeetDAO);

  const result = await mateMeetDAO.deleteOne(filter);
  if (result) res.status(200).send();
  res.status(400).send;
  */
});

export default router;
