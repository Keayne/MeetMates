/* Autor: Valentin Lieberknecht */

import express from 'express';
import { GenericDAO } from '../models/generic.dao.js';
import { Mate } from '../models/mate.js';
import { Message } from '../models/message.js';
import { authService } from '../services/auth.service.js';

const router = express.Router();

router.get('/messages/:room', authService.authenticationMiddleware, async (req, res) => {
  const chatDAO: GenericDAO<Message> = req.app.locals.chatDAO;
  const mateDAO: GenericDAO<Mate> = req.app.locals.mateDAO;

  const messages: Array<Message> = await chatDAO.findAllASC({ room: req.params.room });
  for (const e of messages) {
    const date = new Date(Number(e.createdAt));
    e.posttime = date.toLocaleString('de-DE', { timeZone: 'Europe/Berlin' });
    if (e.author === res.locals.user.id) {
      e.author = 'Me';
      e.own = 'msg-self';
    } else {
      const author = await mateDAO.getName({ id: e.author });
      if (author) {
        e.author = author.firstname + ' ' + author.name;
        e.own = 'msg-remote';
      }
    }
  }
  res.json(messages);
});

router.post('/', authService.authenticationMiddleware, async (req, res) => {
  const chatDAO: GenericDAO<Message> = req.app.locals.chatDAO;
  await chatDAO.create({
    author: res.locals.user.id,
    room: req.body.room,
    body: req.body.body
  });
  res.status(201).end();
});

router.delete('/:id', async (req, res) => {
  const chatDAO: GenericDAO<Message> = req.app.locals.chatDAO;
  if (req.app.locals.testing) {
    await chatDAO.deleteAll({ id: req.params.id });
  } else {
    res.status(401).end();
  }
});

export default router;
