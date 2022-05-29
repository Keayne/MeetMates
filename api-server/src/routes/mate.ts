/* Autor: Valentin Lieberknecht */
/* Autor: Arne Schaper */

import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { GenericDAO } from '../models/generic.dao.js';
import { Mate } from '../models/mate.js';
import { authService } from '../services/auth.service.js';
import { MateDescription } from '../models/matedescription.js';
import { MateInterest } from '../models/mateinterest.js';
import { UniversalDAO } from '../models/universal.dao.js';
import { Verify } from '../models/verify.js';
import { emailService } from '../services/email.service.js';

const router = express.Router();

router.post('/sign-up', async (req, res) => {
  const mateDAO: GenericDAO<Mate> = req.app.locals.mateDAO;
  const matedescriptionDAO: UniversalDAO<MateDescription> = req.app.locals.matedescriptionDAO;
  const mateinterestDAO: UniversalDAO<MateInterest> = req.app.locals.mateinterestDAO;
  const verifyDAO: GenericDAO<Verify> = req.app.locals.verifyDAO;
  const errors: string[] = [];

  const sendErrorMessage = (message: string) => {
    authService.removeToken(res);
    res.status(400).json({ message });
  };

  //Validate
  if (
    !hasRequiredFields(
      req.body,
      ['name', 'firstname', 'email', 'birthday', 'gender', 'image', 'password', 'interests', 'descriptions'],
      errors
    )
  ) {
    console.log(req.body);
    return sendErrorMessage(errors.join('\n'));
  }

  const filter: Partial<Mate> = { email: req.body.email };
  if (await mateDAO.findOne(filter)) {
    return sendErrorMessage('Es existiert bereits ein Konto mit der angegebenen E-Mail-Adresse.');
  }
  if (
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      String(req.body.email)
    ) == false
  ) {
    return sendErrorMessage('Email Format ungültig');
  }
  if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/gm.test(String(req.body.password)) == false) {
    return sendErrorMessage('Passwort entspricht nicht den Anforderungen!');
  }

  //Create User
  const createdUser = await mateDAO.create({
    name: req.body.name,
    firstname: req.body.firstname,
    email: req.body.email,
    birthday: req.body.birthday,
    gender: req.body.gender,
    image: req.body.image,
    password: await bcrypt.hash(req.body.password, 10)
  });

  //Create Interests
  await req.body.interests.forEach((e: string) => {
    mateinterestDAO.create({
      mateid: createdUser.id,
      interestid: e
    });
  });

  //Create Descriptions
  await req.body.descriptions.forEach((e: { id: string; value: number }) => {
    matedescriptionDAO.create({
      mateid: createdUser.id,
      descriptionid: e.id,
      value: e.value
    });
  });

  //Create VerifyToken
  const token = await verifyDAO.create({
    mateid: createdUser.id,
    token: crypto.randomBytes(32).toString('hex')
  });
  //Send E-Mail
  await emailService.sendEmail(createdUser.email, { token: token.token, mateid: createdUser.id });

  res.status(201).json({ message: 'User was registered! Please check your email' });
});

router.post('/sign-in', async (req, res) => {
  const mateDAO: GenericDAO<Mate> = req.app.locals.mateDAO;
  const filter: Partial<Mate> = { email: req.body.email };
  const errors: string[] = [];

  if (!hasRequiredFields(req.body, ['email', 'password'], errors)) {
    res.status(400).json({ message: errors.join('\n') });
    return;
  }
  const user = await mateDAO.findOne(filter);

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    authService.removeToken(res);
    res.status(401).json({ message: 'E-Mail oder Passwort ungültig!' });
    return;
  }

  //check if user is active (verified e-mail)
  if (user.active == false) {
    res.status(401).json({ message: 'E-Mail Adresse noch nicht verifizert!' });
    return;
  }
  authService.createAndSetToken({ id: user.id }, res);
  res.status(201).json(user);
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

router.get('/verify', authService.verifyToken);

router.get('/edit', authService.authenticationMiddleware, async (req, res) => {
  const mateDAO: GenericDAO<Mate> = req.app.locals.mateDAO;
  const mateinterestDAO: UniversalDAO<MateInterest> = req.app.locals.mateinterestDAO;
  const interests = await mateinterestDAO.findAll({ mateid: res.locals.user.id });
  const matedescriptionDAO: UniversalDAO<MateDescription> = req.app.locals.matedescriptionDAO;
  const descriptions = await matedescriptionDAO.findAll({ mateid: res.locals.user.id });
  const mate = await mateDAO.findOne({ id: res.locals.user.id });
  if (mate) {
    res.json({
      mate: {
        firstname: mate.firstname,
        name: mate.name,
        gender: mate.gender,
        birthday: mate.birthday,
        email: mate.email
      },
      interests: interests,
      descriptions: descriptions,
      image: Buffer.from(mate.image).toString()
    });
  }
});

router.post('/edit', authService.authenticationMiddleware, async (req, res) => {
  const mateDAO: GenericDAO<Mate> = req.app.locals.mateDAO;
  const matedescriptionDAO: UniversalDAO<MateDescription> = req.app.locals.matedescriptionDAO;
  const mateinterestDAO: UniversalDAO<MateInterest> = req.app.locals.mateinterestDAO;

  req.body.mate.id = res.locals.user.id;
  if (req.body.password) {
    req.body.mate.password = await bcrypt.hash(req.body.password, 10);
  }
  await mateDAO.update(req.body.mate);

  mateinterestDAO.deleteAll({ mateid: res.locals.user.id });
  await req.body.interests.forEach((e: string) => {
    mateinterestDAO.create({
      mateid: res.locals.user.id,
      interestid: e
    });
  });

  matedescriptionDAO.deleteAll({ mateid: res.locals.user.id });
  await req.body.descriptions.forEach((e: { id: string; value: number }) => {
    matedescriptionDAO.create({
      mateid: res.locals.user.id,
      descriptionid: e.id,
      value: e.value
    });
  });
});

router.get('/confirm/:id/:token', async (req, res) => {
  const verifyDAO: GenericDAO<Verify> = req.app.locals.verifyDAO;
  const mateDAO: GenericDAO<Mate> = req.app.locals.mateDAO;

  const token = await verifyDAO.findOne({ mateid: req.params.id });
  if (!token) return res.status(400).send('Invalid link');

  if (token.token === req.params.token) {
    mateDAO.update({ id: req.params.id, active: true });
    res.send('email confirmed sucessfully');
  }
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
