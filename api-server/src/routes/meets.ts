/* Autor: Jonathan Hüls */

import express from 'express';
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
}

const userJson: Mate[] = [
  {
    id: '12123',
    name: 'Müller',
    firstName: 'Peter',
    src: 'https://lh3.googleusercontent.com/ogw/ADea4I4oHiicNWrPtZiaZzAMB-Nl35i4NbU4ymarKsVN=s32-c-mo'
  },
  {
    id: '134534',
    name: 'Bach',
    firstName: 'Jürgen',
    src: '/favicon.png'
  },
  {
    id: '768967',
    name: 'Meyer',
    firstName: 'Lisa',
    src: 'team_10/client/public/temp_logo.jpg'
  }
];

const meets: Meet[] = [
  {
    id: '23423',
    name: 'Flunkyball-Pros',
    mates: userJson
  },
  {
    id: '6798',
    name: 'Kitchen-Killer',
    mates: userJson
  }
];

const router = express.Router();

router.get('/', async (req, res) => {
  res.status(201).json(meets);
});

router.get('/userIcons/:id', async (req, res) => {
  res.status(201).json(userJson);
});

export default router;
