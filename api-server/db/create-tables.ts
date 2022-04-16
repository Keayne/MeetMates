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
  email: string;
  birthday: string;
  gender: string;
  lastLoggedIn: string;
};

async function createPsqlScheme(client: ClientType) {
  await client.connect();
  await client.query('drop table if exists meet, matemeet, mate, matedescription, mateinterest, interest, servicedata');
  await client.query(
    `Create Table meet(
      id VARCHAR(40) PRIMARY KEY,
      "createdAt" bigint Not Null,
      name Varchar(60) Not Null
    )`
  );
  await client.query(
    `Create Table matemeet(
      userId Varchar(40) PRIMARY KEY,
      meetId Varchar(40) UNIQUE NOT NULL,
      "createdAt" bigint Not Null,
      rating int
      )`
  );
  await client.query(
    `Create Table mates(
      id Varchar(40) PRIMARY KEY,
      "createdAt" bigint Not Null,
      name VARCHAR(100) NOT NULL,
      firstname VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      birthday VARCHAR(10),
      gender Varchar(10),
      password Varchar(255),
      lastloggedin Varchar(10)
    )`
  );

  await client.query(
    `Create Table interests(
      id Varchar(40) PRIMARY KEY,
      text Varchar(80),
      sort Varchar(80)
    )`
  );

  await client.query(
    `Create Table mateinterest(
      userId Varchar(40) PRIMARY KEY,
      interestId Varchar(40) UNIQUE NOT NULL
    )`
  );
}

async function fillSchemeWithData(client: ClientType) {
  const testData = JSON.parse(fs.readFileSync(new URL('./dbTest_data.json', import.meta.url), 'utf-8'));

  testData.meet.forEach(async (element: { id: string; name: string }) => {
    const query = `INSERT INTO meet (id,"createdAt",name) VALUES('${element.id}',${Date.now()},'${element.name}');`;
    await client.query(query);
  });

  testData.mates.forEach(async (element: Mate) => {
    const query = `Insert into mates (
      id,"createdAt",name,firstname,email,birthday, gender, lastLoggedIn
    ) 
    values(
      '${element.id}',
      ${Date.now()},
      '${element.name}',
      '${element.firstName}',
      '${element.email}',
      '${element.birthday}',
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
