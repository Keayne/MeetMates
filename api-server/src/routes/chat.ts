/* Autor: Valentin Lieberknecht */

import express from 'express';
import { GenericDAO } from '../models/generic.dao.js';
import { Chat } from '../models/message.js';
import { authService } from '../services/auth.service.js';

const router = express.Router();

router.get('/messages/:room', authService.authenticationMiddleware, async (req, res) => {
  const chatDAO: GenericDAO<Chat> = req.app.locals.chatDAO;

  const messages: Array<Chat> = await chatDAO.findAllASC({ room: req.params.room });
  messages.forEach(e => {
    if (e.author === 'fa0977c5-ae5f-40ef-a78a-7da44539fc77') {
      e.author = 'Me';
      e.own = 'msg-self';
    } else {
      e.author = 'Other';
      e.own = 'msg-remote';
    }
  });
  res.json(messages);
});

router.post('/message', authService.authenticationMiddleware, async (req, res) => {
  const chatDAO: GenericDAO<Chat> = req.app.locals.chatDAO;
  chatDAO.create({
    author: res.locals.user.id,
    room: req.body.room,
    body: req.body.body
  });
});

export default router;
