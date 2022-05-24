/* Autor: Valentin Lieberknecht */

import pg from 'pg';
import { Express } from 'express';
import { PsqlGenericDAO } from './models/psql-generic.dao.js';
import fs from 'fs';
import { Mate } from './models/mate.js';
import { Description } from './models/description.js';
import { Interest } from './models/interest.js';
import { PsqlUniversalDAO } from './models/psql-universal.dao.js';
import { MateDescription } from './models/matedescription.js';
import { MateInterest } from './models/mateinterest.js';
import { Meet } from './models/meet.js';
import { MateMeet } from './models/matemeet.js';
import { Activity } from './models/activity.js';
import { Chat } from './models/message.js';
import { Report } from './models/report.js';
import { Rating } from './models/rating.js';

const config = JSON.parse(fs.readFileSync(new URL('../config.json', import.meta.url), 'utf-8'));
const { Client } = pg;

export default async function startDB(app: Express) {
  return await startPsql(app);
}

// async function startInMemoryDB(app: Express) {
//   // TODO: DAOs erzeugen
//   return async () => Promise.resolve();
// }

// async function startMongoDB(app: Express) {
//   const client = await connectToMongoDB();
//   const db = client.db('myapp');
//   // TODO: DAOs erzeugen
//   return async () => await client.close();
// }

// async function connectToMongoDB() {
//   const url = `mongodb://${config.db.connect.host}:${config.db.connect.port.mongodb}`;
//   const client = new MongoClient(url, {
//     auth: { username: config.db.connect.user, password: config.db.connect.password },
//     authSource: config.db.connect.database
//   });
//   try {
//     await client.connect();
//   } catch (err) {
//     console.log('Could not connect to MongoDB: ', err);
//     process.exit(1);
//   }
//   return client;
// }

async function startPsql(app: Express) {
  const client = await connectToPsql();
  app.locals.mateDAO = new PsqlGenericDAO<Mate>(client!, 'mate');
  app.locals.descriptionDAO = new PsqlGenericDAO<Description>(client!, 'description');
  app.locals.matedescriptionDAO = new PsqlUniversalDAO<MateDescription>(client!, 'matedescription');
  app.locals.interestDAO = new PsqlGenericDAO<Interest>(client!, 'interest');
  app.locals.mateinterestDAO = new PsqlUniversalDAO<MateInterest>(client!, 'mateinterest');
  app.locals.meetDAO = new PsqlGenericDAO<Meet>(client!, 'meet');
  app.locals.matemeetDAO = new PsqlUniversalDAO<MateMeet>(client!, 'matemeet');
  app.locals.activityDAO = new PsqlGenericDAO<Activity>(client!, 'activity');
  app.locals.chatDAO = new PsqlGenericDAO<Chat>(client!, 'chat');
  app.locals.reportDAO = new PsqlGenericDAO<Report>(client!, 'report');
  app.locals.ratingDAO = new PsqlUniversalDAO<Rating>(client!, 'rating');
  return async () => await client.end();
}

async function connectToPsql() {
  const client = new Client({
    user: config.db.connect.user,
    host: config.db.connect.host,
    database: config.db.connect.database,
    password: config.db.connect.password,
    port: config.db.connect.port.psql
  });

  try {
    await client.connect();
    return client;
  } catch (err) {
    console.log('Could not connect to PostgreSQL: ', err);
    process.exit(1);
  }
}
