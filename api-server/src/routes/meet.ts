/* Autor: Jonathan Hüls */

import express from 'express';

const router = express.Router();
interface Mate {
  mateId: string;
  name: string;
  firstName: string;
  src: string;
  age: string;
}
interface Meet {
  id: string;
  name: string;
  mates: Mate[];
}

const mates: Mate[] = [
  {
    mateId: '123123',
    name: 'Müller',
    firstName: 'Peter',
    src: '/favicon.png',
    age: '15'
  },
  {
    mateId: 'sdgwegsd',
    name: 'Bach',
    firstName: 'Jürgen',
    src: '',
    age: '123'
  },
  {
    mateId: 'dvbnkjdfbhgi',
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

router.get('/', async (req, res) => {
  res.status(201).json(meet);
});

router.get('/:id', async (req, res) => {
  res.status(201).json(meet);
});

router.post('/create', async (req, res) => {
  console.log(res.locals);
  res.status(200).json(meet);
});

router.delete('/:id', async (req, res) => {
  console.log(`delete: ${req.params.id}`);
  res.status(200).send();
});

export default router;
