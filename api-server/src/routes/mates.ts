/* Autor: Valentin Lieberknecht */
/* Autor: Arne Schaper */

import express from 'express';
import bcrypt from 'bcryptjs';
import { GenericDAO } from '../models/generic.dao.js';
import { Mate } from '../models/mate.js';
import { authService } from '../services/auth.service.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const mateDAO: GenericDAO<Mate> = req.app.locals.mateDAO;
  const errors: string[] = [];

  const sendErrorMessage = (message: string) => {
    authService.removeToken(res);
    res.status(400).json({ message });
  };

  if (!hasRequiredFields(req.body, ['name', 'firstname', 'email', 'birthday', 'gender', 'password'], errors)) {
    console.log(req.body);

    return sendErrorMessage(errors.join('\n'));
  }

  const filter: Partial<Mate> = { email: req.body.email };
  if (await mateDAO.findOne(filter)) {
    return sendErrorMessage('Es existiert bereits ein Konto mit der angegebenen E-Mail-Adresse.');
  }

  const createdUser = await mateDAO.create({
    name: req.body.name,
    firstname: req.body.firstname,
    email: req.body.email,
    birthday: req.body.birthday,
    gender: req.body.gender,
    password: await bcrypt.hash(req.body.password, 10)
  });
  authService.createAndSetToken({ id: createdUser.id }, res);
  res.status(201).json(createdUser);
});

router.post('/sign-in', async (req, res) => {
  const mateDAO: GenericDAO<Mate> = req.app.locals.mateDAO;
  const filter: Partial<Mate> = { email: req.body.email };
  const errors: string[] = [];

  if (!hasRequiredFields(req.body, ['email', 'password'], errors)) {
    res.status(400).json({ message: errors.join('\n') });
    return;
  }

  const user = await mateDAO.findOne(filter); //find user in DB

  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    authService.createAndSetToken({ id: user.id }, res);
    res.status(201).json(user);
    console.log('logged in!');
  } else {
    authService.removeToken(res); //unnecessary?
    res.status(401).json({ message: 'E-Mail oder Passwort ungültig!' });
  }
});

router.delete('/sign-out', (req, res) => {
  //sign user out
  authService.removeToken(res);
  res.status(200).end();
});

router.delete('/', authService.authenticationMiddleware, async (req, res) => {
  //delete user from DB
  const mateDAO: GenericDAO<Mate> = req.app.locals.mateDAO;

  mateDAO.delete(res.locals.user.id);

  authService.removeToken(res);
  res.status(200).end();
});

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

export default router;
