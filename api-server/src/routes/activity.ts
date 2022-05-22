import express from 'express';
import { GenericDAO } from '../models/generic.dao.js';
import { Activity } from '../models/activity.js';
import { authService } from '../services/auth.service.js';
import * as crypto from 'crypto';

const router = express.Router();

const algorithm = 'aes-256-cbc';
const keyBase64 = 's9p1PG9edXqxNWaBXORZ1SPVSQ7Gwan5XgKlAudOkBI=';

function encrypt(text: string) {
  if (!text) return '';
  const iv = crypto.randomBytes(16); // Blocklänge: 128 Bit
  const key = Buffer.from(keyBase64, 'base64');
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const ivPlusCipherText = Buffer.concat([iv, cipher.update(text, 'utf8'), cipher.final()]);
  return ivPlusCipherText.toString('base64');
}

function decrypt(ivPlusCipherTextBase64: string) {
  if (!ivPlusCipherTextBase64) return '';
  const buffer = Buffer.from(ivPlusCipherTextBase64, 'base64');
  const [iv, ciphertext] = [buffer.slice(0, 16), buffer.slice(16)];
  const key = Buffer.from(keyBase64, 'base64');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  return decipher.update(ciphertext, undefined, 'utf8') + decipher.final('utf8');
}
//TODO implement encription/decription

router.get('/:id', async (req, res) => {
  const activityDAO: GenericDAO<Activity> = req.app.locals.activityDAO;
  const filter: Partial<Activity> = { meetid: req.params.id }; //TODO NEEDS TO CHECK IF USER IS ALLOWED TO MAKE REQUEST
  const activites = await activityDAO.findAll(filter);
  res.json({ results: activites });
});

router.post('/', authService.authenticationMiddleware, async (req, res) => {
  const activityDAO: GenericDAO<Activity> = req.app.locals.activityDAO;
  var utc = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
  const createdActivity = await activityDAO.create({
    title: req.body.title,
    description: req.body.description,
    tooltip: 'Description Tooltip',
    tooltipcreatedby: `Created by ${res.locals.user.id} on ${String(utc)}`,
    motivationtitle: req.body.motivationtitle,
    rating: 1,
    chosen: 0,
    meetid: '0ea6639d-c6d5-4030-bb1b-e687ecb850fb', //todo meetId needs to be handed over on submit
    image: req.body.image
  });
  res.status(201).json(createdActivity);
});

export default router;