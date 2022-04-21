/* Autor: Arne Schaper */

import express from 'express';
import bcrypt from 'bcryptjs';
import { GenericDAO } from '../models/generic.dao.js';
import { Mate } from '../models/mate.js';

import { authService } from '../services/auth.service.js';
import { stringify } from 'querystring';

const router = express.Router();

function hasRequiredFields(object: { [key: string]: unknown }, requiredFields: string[], errors: string[]) {
  let hasErrors = false;
  requiredFields.forEach(fieldName => {
    if (!object[fieldName]) {
      errors.push(fieldName + ' darf nicht leer sein.');
      hasErrors = true;
    }
  });
  return !hasErrors;
}

router.post('/', async (req, res) => {
  const MateDAO: GenericDAO<Mate> = req.app.locals.MateDAO;
  const errors: string[] = [];

  const sendErrorMessage = (message: string) => {
    authService.removeToken(res);
    res.status(400).json({ message });
  };

  if (!hasRequiredFields(req.body, ['email', 'name', 'password', 'passwordCheck'], errors)) {
    return sendErrorMessage(errors.join('\n'));
  }

  if (req.body.password !== req.body.passwordCheck) {
    return sendErrorMessage('Die beiden Passwörter stimmen nicht überein.');
  }

  const filter: Partial<Mate> = { email: req.body.email };
  if (await MateDAO.findOne(filter)) {
    return sendErrorMessage('Es existiert bereits ein Konto mit der angegebenen E-Mail-Adresse.');
  }

  const createdMate = await MateDAO.create({
    name: req.body.name,
    firstname: req.body.firstname,
    email: req.body.email,
    birthday: req.body.birthday,
    gender: req.body.gender,
    password: await bcrypt.hash(req.body.password, 10)
  });
  authService.createAndSetToken({ id: createdMate.id }, res);
  res.status(201).json(createdMate);
});

router.post('/sign-in', async (req, res) => {
  const MateDAO: GenericDAO<Mate> = req.app.locals.MateDAO;
  const filter: Partial<Mate> = { email: req.body.email };
  const errors: string[] = [];

  if (!hasRequiredFields(req.body, ['email', 'password'], errors)) {
    res.status(400).json({ message: errors.join('\n') });
    return;
  }

  const Mate = await MateDAO.findOne(filter);

  if (Mate && (await bcrypt.compare(req.body.password, Mate.password))) {
    authService.createAndSetToken({ id: Mate.id }, res);
    res.status(201).json(Mate);
  } else {
    authService.removeToken(res);
    res.status(401).json({ message: 'E-Mail oder Passwort ungültig!' });
  }
});

router.delete('/sign-out', (req, res) => {
  authService.removeToken(res);
  res.status(200).end();
});

router.delete('/', authService.authenticationMiddleware, async (req, res) => {
  /* Delete User */
  const MateDAO: GenericDAO<Mate> = req.app.locals.MateDAO;

  MateDAO.delete(res.locals.Mate.id);

  authService.removeToken(res);
  res.status(200).end();
});

export default router;
