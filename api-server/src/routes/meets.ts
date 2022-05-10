/* Autor: Jonathan Hüls */

import express from 'express';
/*import bcrypt from 'bcryptjs';
import { GenericDAO } from '../models/generic.dao.js';
import { Mate } from '../models/mate.js';
import { authService } from '../services/auth.service.js';
*/
const meets = [
  {
    name: 'SoccerKings',
    users: [
      {
        userId: 'asdfasfasgdsfgdsfg',
        rating: '3',
        name: 'Igor'
      },
      {
        userId: 'kjluijolzhgghnm',
        rating: '1',
        name: 'Meyer'
      },
      {
        userId: 'bm,fmgnvnbvdgv',
        rating: '5',
        name: 'Hannah'
      }
    ]
  },
  {
    name: 'SoccerKings',
    users: [
      {
        userId: 'asdfasfasgdsfgdsfg',
        rating: '3',
        name: 'Igor'
      },
      {
        userId: 'kjluijolzhgghnm',
        rating: '1',
        name: 'Meyer'
      },
      {
        userId: 'bm,fmgnvnbvdgv',
        rating: '5',
        name: 'Hannah'
      }
    ]
  }
];

const router = express.Router();

router.get('/', async (req, res) => {
  res.status(201).json(meets);
});

export default router;
