/* Autor: Jonathan Hüls */

import express from 'express';

const router = express.Router();

const meet = [
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

router.get('/', async (req, res) => {
  res.status(201).json(meet);
});

router.post('/create', async (req, res) => {
  console.log(res.locals);
  res.status(200).json(meet);
});

export default router;
