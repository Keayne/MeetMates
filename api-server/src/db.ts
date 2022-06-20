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
import { Message } from './models/message.js';
import { Report } from './models/report.js';
import { Rating } from './models/rating.js';
import { Verify } from './models/verify.js';
import { InMemoryGenericDAO } from './models/in-memory-generic.dao.js';
import { InMemoryUniversalDAO } from './models/in-memory-universal.dao.js';

const config = JSON.parse(fs.readFileSync(new URL('../config.json', import.meta.url), 'utf-8'));
const { Client } = pg;

export default async function startDB(app: Express) {
  switch (config.db.use) {
    case 'in-memory-db':
      return await startInMemoryDB(app);
    case 'psql':
      return await startPsql(app);
    default:
      return await startPsql(app);
  }
}

async function startInMemoryDB(app: Express) {
  app.locals.mateDAO = new InMemoryGenericDAO<Mate>();
  app.locals.descriptionDAO = new InMemoryGenericDAO<Description>();
  //app.locals.matedescriptionDAO = new InMemoryUniversalDAO<MateDescription>();
  app.locals.interestDAO = new InMemoryGenericDAO<Interest>();
  //app.locals.mateinterestDAO = new InMemoryUniversalDAO<MateInterest>();
  app.locals.meetDAO = new InMemoryGenericDAO<Meet>();
  //app.locals.matemeetDAO = new InMemoryUniversalDAO<MateMeet>();
  app.locals.activityDAO = new InMemoryGenericDAO<Activity>();
  app.locals.chatDAO = new InMemoryGenericDAO<Message>();
  //app.locals.verifyDAO = new InMemoryUniversalDAO<Verify>();
  app.locals.reportDAO = new InMemoryGenericDAO<Report>();
  //app.locals.ratingDAO = new InMemoryUniversalDAO<Rating>();
  return async () => Promise.resolve();
}

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
  app.locals.chatDAO = new PsqlGenericDAO<Message>(client!, 'chat');
  app.locals.verifyDAO = new PsqlUniversalDAO<Verify>(client!, 'verify');
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
