/* Autor: Jonathan Hüls */

import express from 'express';
import { GenericDAO } from '../models/generic.dao';
//import { Meet } from '../models/meet.js';
/*import bcrypt from 'bcryptjs';
import { GenericDAO } from '../models/generic.dao.js';
import { Mate } from '../models/mate.js';
import { authService } from '../services/auth.service.js';
*/

interface Meet {
  id: string;
  name: string;
  mates: Mate[];
}
interface Mate {
  id: string;
  name: string;
  firstName: string;
  src: string;
  age: string;
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
  mates: mates
};
const meets: Array<Meet> = [meet, meet];

const router = express.Router();

router.get('/', async (req, res) => {
  //const meetDAO: GenericDAO<Meet> = req.app.locals.meetDAO;
  //const meets = await meetDAO.findAll();
  res.status(201).json(meets);
});

/*
router.get('/userIcons/:id', async (req, res) => {
  const meetDAO: GenericDAO<Meet> = req.app.locals.meetDAO;
  const filter: Partial<Meet> = { id: req.params.id };

  const meets = await meetDAO.findOne(filter);
  res.status(201).json(meets);
});
*/
export default router;
