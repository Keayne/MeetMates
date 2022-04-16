/* Autor: Valentin Lieberknecht */

import pg from 'pg';
import { Express } from 'express';
import { PsqlGenericDAO } from './models/psql-generic.dao.js';
import fs from 'fs';
import { Mate } from './models/mate.js';

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
  app.locals.mateDAO = new PsqlGenericDAO<Mate>(client!, 'mates');
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
