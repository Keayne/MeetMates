/* Author: Jonathan Hüls */

import pg, { Client as ClientType } from 'pg';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync(new URL('../config.json', import.meta.url), 'utf-8'));

const { Client } = pg;
const client = new Client({
  user: config.db.connect.user,
  host: config.db.connect.host,
  database: config.db.connect.database,
  password: config.db.connect.password,
  port: config.db.connect.port.psql
});

type Mate = {
  id: string;
  name: string;
  firstName: string;
  eMail: string;
  Birthday: string;
  gender: string;
  lastLoggedIn: string;
};

async function createPsqlScheme(client: ClientType) {
  await client.connect();
  await client.query('Drop Table If Exists Meet, MateMeet, Mate, MateDescription, MateInterest, Interest, serviceData');
  await client.query(
    `Create Table Meet(
      id VARCHAR(40) PRIMARY KEY,
      "createdAt" bigint Not Null,
      name Varchar(60) Not Null
    )`
  );
  await client.query(
    `Create Table MateMeet(
      userId Varchar(40) PRIMARY KEY,
      meetId Varchar(40) UNIQUE NOT NULL,
      "createdAt" bigint Not Null,
      rating int
      )`
  );
  await client.query(
    `Create Table Mate(
      id Varchar(40) PRIMARY KEY,
      "createdAt" bigint Not Null,
      name VARCHAR(100) NOT NULL,
      firstname VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      birthday VARCHAR(10),
      gender Varchar(10),
      pwHash Varchar(255),
      lastLoggedIn Varchar(10)
    )`
  );

  await client.query(
    `Create Table Interest(
      id Varchar(40) PRIMARY KEY,
      text Varchar(80),
      sort Varchar(80)
    )`
  );

  await client.query(
    `Create Table MateInterest(
      userId Varchar(40) PRIMARY KEY,
      interestId Varchar(40) UNIQUE NOT NULL
    )`
  );
}

async function fillSchemeWithData(client: ClientType) {
  const testData = JSON.parse(fs.readFileSync(new URL('./dbTest_data.json', import.meta.url), 'utf-8'));

  testData.meet.forEach(async (element: { id: string; name: string }) => {
    const query = `INSERT INTO Meet(id,"createdAt",name) VALUES('${element.id}',${Date.now()},'${element.name}');`;
    await client.query(query);
  });

  testData.mates.forEach(async (element: Mate) => {
    const query = `Insert into Mate (
      id,"createdAt",name,firstname,email,birthday, gender, lastLoggedIn
    ) 
    values(
      '${element.id}',
      ${Date.now()},
      '${element.name}',
      '${element.firstName}',
      '${element.eMail}',
      '${element.Birthday}',
      '${element.gender}',
      '${element.lastLoggedIn}'
    )`;

    await client.query(query);
  });
}

createPsqlScheme(client).then(() => {
  fillSchemeWithData(client).then(() => {
    console.log('Created Tables with contents');
  });
});
