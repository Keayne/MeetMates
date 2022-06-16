/* Autor: Valentin Lieberknecht */

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

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*#?&-_=()]{8,}$/;
const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

router.post('/sign-up', async (req, res) => {
  const mateDAO: GenericDAO<Mate> = req.app.locals.mateDAO;
  const matedescriptionDAO: UniversalDAO<MateDescription> = req.app.locals.matedescriptionDAO;
  const mateinterestDAO: UniversalDAO<MateInterest> = req.app.locals.mateinterestDAO;
  const verifyDAO: UniversalDAO<Verify> = req.app.locals.verifyDAO;
  const errors: string[] = [];

  const sendErrorMessage = (message: string) => {
    authService.removeToken(res);
    res.status(400).json({ message });
  };

  //Validate
  if (
    !hasRequiredFields(
      req.body,
      [
        'name',
        'firstname',
        'email',
        'birthday',
        'gender',
        'image',
        'password',
        'passwordCheck',
        'interests',
        'descriptions'
      ],
      errors
    )
  ) {
    return sendErrorMessage(errors.join('\n'));
  }

  if (req.body.password !== req.body.passwordCheck) {
    return sendErrorMessage('Die beiden Passwörter stimmen nicht überein.');
  }

  const filter: Partial<Mate> = { email: req.body.email };
  if (await mateDAO.findOne(filter)) {
    return sendErrorMessage('Es existiert bereits ein Konto mit der angegebenen E-Mail-Adresse.');
  }
  if (emailRegex.test(String(req.body.email)) == false) {
    return sendErrorMessage('Email Format ungültig');
  }

  if (passwordRegex.test(String(req.body.password)) == false) {
    return sendErrorMessage('Passwort entspricht nicht den Anforderungen!');
  }

  //Create User
  const createdUser = await mateDAO.create({
    name: req.body.name,
    firstname: req.body.firstname,
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

  if (req.app.locals.testing) {
    mateDAO.update({ id: createdUser.id, active: true, email: req.body.email });
    authService.createAndSetToken({ id: createdUser.id }, res);
    res.status(201).send({ message: 'logged-in with test account!' });
    return;
  }

  //Create VerifyToken
  const token = await verifyDAO.createAndOverwrite({
    mateid: createdUser.id,
    type: 'e',
    token: crypto.randomBytes(32).toString('hex'),
    code: Math.floor(Math.random() * 90000) + 10000,
    email: req.body.email
  });
  //Send E-Mail
  await emailService.sendEmail(req.body.email, {
    subject: 'E-Mail Verification',
    text:
      'Verify with this code: ' +
      token.code +
      '  ' +
      'Or verify with this link: ' +
      'http://localhost:3000/api/confirm/' +
      createdUser.id +
      '/' +
      token.token
  });

  res.status(201).json({ message: 'User was registered! Please check your email', id: createdUser.id });
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
    res.status(401).json({ message: 'E-Mail or Password not correct.' });
    return;
  }

  //check if user is active (verified e-mail)
  if (user.active == false) {
    res.status(401).json({ message: 'E-Mail Adresse noch nicht verifizert!' });
    return;
  }

  authService.createAndSetToken({ id: user.id }, res);
  res.status(201).json({ id: user.id });
});

router.delete('/sign-out', (req, res) => {
  //sign user out
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
        birthday: mate.birthday
      },
      interests: interests,
      descriptions: descriptions,
      image: mate.image ? Buffer.from(mate.image).toString() : ''
    });
  }
});

router.put('/edit', authService.authenticationMiddleware, async (req, res) => {
  const mateDAO: GenericDAO<Mate> = req.app.locals.mateDAO;
  const matedescriptionDAO: UniversalDAO<MateDescription> = req.app.locals.matedescriptionDAO;
  const mateinterestDAO: UniversalDAO<MateInterest> = req.app.locals.mateinterestDAO;

  req.body.mate.id = res.locals.user.id;
  if (req.body.password || req.body.email) {
    res.status(401).json({ message: 'wrong data' });
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
  const verifyDAO: UniversalDAO<Verify> = req.app.locals.verifyDAO;
  const mateDAO: GenericDAO<Mate> = req.app.locals.mateDAO;

  const verify = await verifyDAO.findOne({ mateid: req.params.id, type: 'e' });
  if (!verify) return res.status(400).send('Invalid link');

  if (verify.token === req.params.token) {
    await mateDAO.update({ id: req.params.id, active: true, email: verify.email });
    res.send('email confirmed sucessfully');
  }
});

router.patch('/confirmcode', async (req, res) => {
  const verifyDAO: UniversalDAO<Verify> = req.app.locals.verifyDAO;
  const mateDAO: GenericDAO<Mate> = req.app.locals.mateDAO;

  const verify = await verifyDAO.findOne({ mateid: req.body.id });
  if (!verify) return res.status(400).send({ message: 'Invalid link' });

  if (verify.code === Number(req.body.code)) {
    await mateDAO.update({ id: req.body.id, active: true, email: verify.email });
    await verifyDAO.deleteOne({ mateid: req.body.id, type: 'e' });
    res.send('email confirmed sucessfully');
  } else {
    res.status(400).send({ message: 'wrong code' });
  }
});

router.get('/currentemail', authService.authenticationMiddleware, async (req, res) => {
  const mateDAO: GenericDAO<Mate> = req.app.locals.mateDAO;
  const mate = await mateDAO.findOne({ id: res.locals.user.id });

  if (!mate) return res.status(503).send('Could not found user in db');

  res.json({ email: mate.email });
});

router.patch('/changeemail', authService.authenticationMiddleware, async (req, res) => {
  const verifyDAO: UniversalDAO<Verify> = req.app.locals.verifyDAO;
  const mateDAO: GenericDAO<Mate> = req.app.locals.mateDAO;

  const mate = await mateDAO.findOne({ id: res.locals.user.id });

  if (!mate) return res.status(503).send('Could not found user in db');

  //Create VerifyToken
  const token = await verifyDAO.createAndOverwrite({
    mateid: mate.id,
    type: 'e',
    token: crypto.randomBytes(32).toString('hex'),
    code: Math.floor(Math.random() * 90000) + 10000,
    email: req.body.email
  });
  //Send E-Mail
  await emailService.sendEmail(req.body.email, {
    subject: 'E-Mail Verification',
    text:
      'Verify with this code: ' +
      token.code +
      '  ' +
      'Or verify with this link: ' +
      'http://localhost:3000/api/confirm/' +
      mate.id +
      '/' +
      token.token
  });
  res.status(201).json({ message: 'You have to verify your new e-mail address', id: res.locals.user.id });
});

router.patch('/changepassword', authService.authenticationMiddleware, async (req, res) => {
  const mateDAO: GenericDAO<Mate> = req.app.locals.mateDAO;
  const mate = await mateDAO.findOne({ id: res.locals.user.id });

  if (!mate || !(await bcrypt.compare(req.body.currentPassword, mate.password))) {
    res.status(401).send('Aktuelle Passwort ist falsch');
    return;
  }

  if (passwordRegex.test(String(req.body.password)) == false) {
    res.status(401).send('Passwort entspricht nicht den Anforderungen!');
    return;
  }
  await mateDAO.update({ id: mate.id, password: await bcrypt.hash(req.body.password, 10) });
  res.send('Changed password');
});

router.get('/resetpassword/:email', async (req, res) => {
  const verifyDAO: UniversalDAO<Verify> = req.app.locals.verifyDAO;
  const mateDAO: GenericDAO<Mate> = req.app.locals.mateDAO;

  const mate = await mateDAO.findOne({ email: req.params.email });
  if (!mate) return res.status(400).send({ message: 'E-Mail does not exist' });

  //Create VerifyToken
  const token = await verifyDAO.createAndOverwrite({
    mateid: mate.id,
    type: 'p',
    token: crypto.randomBytes(32).toString('hex')
  });
  if (!mate.email) return res.status(400).send({ message: 'E-Mail needs to be verified before changing password' });
  //Send E-Mail
  await emailService.sendEmail(mate.email, {
    subject: 'Reset Password',
    text:
      'Reset the password with this link: ' +
      'http://localhost:8081/mates/resetpassword/' +
      mate.id +
      '/' +
      token.token +
      ' valid for 24h.'
  });

  res.status(200).json({ message: 'Please check your emails' });
});

router.patch('/resetpassword', async (req, res) => {
  const verifyDAO: UniversalDAO<Verify> = req.app.locals.verifyDAO;
  const mateDAO: GenericDAO<Mate> = req.app.locals.mateDAO;

  const verify = await verifyDAO.findOne({ mateid: req.body.id, type: 'p' });
  if (!verify) return res.status(400).send('Invalid');

  if (verify.token !== req.body.token) return res.status(401).send('invalid token');
  const hoursBetween = Math.abs(verify.createdAt - Date.now() / (60 * 60 * 1000));
  if (hoursBetween > 24) res.status(401).send('token expired');

  await mateDAO.update({ id: req.body.id, password: await bcrypt.hash(req.body.password, 10) });
  await verifyDAO.deleteOne({ mateid: req.body.id, type: 'p' });
  res.send('password changed');
});

// router.patch('/verifycode', async (req, res) => {
//   const verifyDAO: UniversalDAO<Verify> = req.app.locals.verifyDAO;
//   const mateDAO: GenericDAO<Mate> = req.app.locals.mateDAO;

//   const verify = await verifyDAO.findOne({ mateid: req.body.id, type: 'e' });
//   if (!verify) return res.status(400).send('Invalid');

//   if (verify.code !== req.body.code) return res.status(401).send('invalid code');
//   await mateDAO.update({ id: req.body.id, password: await bcrypt.hash(req.body.password, 10) });
//   await verifyDAO.deleteOne({ mateid: req.body.id, type: 'e' });
//   res.send('email verified');
// });

router.delete('/delete', authService.authenticationMiddleware, async (req, res) => {
  //delete user from DB
  const mateDAO: GenericDAO<Mate> = req.app.locals.mateDAO;

  mateDAO.delete(res.locals.user.id);

  authService.removeToken(res);
  res.status(200).end();
});

router.get('/getName/:id', authService.authenticationMiddleware, async (req, res) => {
  const mateDAO: GenericDAO<Mate> = req.app.locals.mateDAO;
  const mate = await mateDAO.findOne({ id: res.locals.user.id });

  if (!mate) return res.status(503).send('Could not find user in db');
  const fullName = mate.firstname + ' ' + mate.name;
  res.status(200).json({ message: fullName });
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
