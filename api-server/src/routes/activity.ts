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

router.get('/', async (req, res) => {
  console.log('GET ANFRAGE');
  const activityDAO: GenericDAO<Activity> = req.app.locals.activityDAO;
  const activites = await activityDAO.findAll();
  res.json({ results: activites });
});

router.post('/', authService.authenticationMiddleware, async (req, res) => {
  console.log('POST REQUEST');
  const activityDAO: GenericDAO<Activity> = req.app.locals.activitiesDAO;

  const createdActivity = await activityDAO.create({
    title: 'datenbankAktivity1',
    description: 'datenbankDescription1',
    tooltip: 'dbtooltip1',
    motivationTitle: 'dbmotionvationtitle1'
  });
  res.status(201).json(createdActivity);
});

export default router;
