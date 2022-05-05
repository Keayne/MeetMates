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
  await client.query(
    'drop table if exists matemeet, matedescription , mateinterest , meet,  mate, interest, matedescription, description, servicedata'
  );
  await client.query(
    `create table meet(
      id VARCHAR(40) PRIMARY KEY,
      "createdAt" bigint Not Null,
      name Varchar(60) Not Null
    )`
  );

  await client.query(
    `create table mate(
      id Varchar(40) PRIMARY KEY,
      "createdAt" bigint Not Null,
      name VARCHAR(100) NOT NULL,
      firstname VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      birthday VARCHAR(10),
      gender Varchar(10),
      image BYTEA,
      password Varchar(255),
      lastloggedin Varchar(10)
    )`
  );

  await client.query(
    `create table matemeet(
      userId Varchar(40) NOT NULL references mate(id),
      meetId Varchar(40) NOT NULL references meet(id),
      "createdAt" bigint Not Null,
      rating int
      )`
  );

  await client.query(
    `create table interest(
      id Varchar(40) PRIMARY KEY,
      "createdAt" bigint Not Null,
      text Varchar(80),
      sort Varchar(80)
    )`
  );

  await client.query(
    `create table mateinterest(
      userId Varchar(40) NOT NULL references mate(id),
      interestId Varchar(40) NOT NULL references interest(id),
      "createdAt" bigint Not Null
    )`
  );

  await client.query(
    `create table description(
      id Varchar(40) PRIMARY KEY,
      "createdAt" bigint Not Null,
      lText Varchar(255) NOT NULL,
      rText Varchar(255) NOT NULL
    )`
  );

  await client.query(
    `create table matedescription(
      userId Varchar(40) NOT NULL references mate(id),
      descriptionId Varchar(40) NOT NULL references description(id),
      "createdAt" bigint Not Null,
      value int NOT NULL
    )`
  );
}

async function fillSchemeWithData(client: ClientType) {
  const testData = JSON.parse(fs.readFileSync(new URL('./dbTest_data.json', import.meta.url), 'utf-8'));

  //fill meet-DBTable
  testData.meet.forEach(async (element: { id: string; name: string }) => {
    const query = `insert into meet(id,"createdAt",name) VALUES('${element.id}',${Date.now()},'${element.name}');`;
    await client.query(query);
  });

  //fill mate-DBTable
  testData.mates.forEach(async (element: Mate) => {
    const query = `insert into mate(
      id,"createdAt",name,firstname,email,birthday, gender, lastloggedin
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

    //fill interest-DBTable
    testData.interest.forEach(async (element: { id: string; text: string; sort: string }) => {
      const query = `insert into interest(
        id,
        "createdAt",
        text,
        sort
      ) 
      values(
        '${element.id}',
        '${Date.now()}',
        '${element.text}',
        '${element.sort}'
      )`;

      await client.query(query);
    });

    //fill mateMeet-DBTable
    testData.mateMeet.forEach(async (element: { userId: string; meetId: string }) => {
      const query = `insert into matemeet(
        userid,
        meetid,
        "createdAt"
      )
      values(
        '${element.userId}',
        '${element.meetId}',
        '${Date.now()}'
      )`;

      await client.query(query);
    });

    //fill MateInterest-DBTable
    testData.mateInterest.forEach(async (element: { userId: string; interestId: string }) => {
      const query = `insert into mateinterest(
        userid,
        interestid,
        "createdAt"
      )
      values(
        '${element.userId}',
        '${element.interestId}',
        '${Date.now()}'
      )`;

      await client.query(query);
    });

    //fill Description-DBTable
    testData.description.forEach(async (element: { id: string; lText: string; rText: string }) => {
      const query = `insert into description(
        id,
        "createdAt",
        ltext,
        rtext
      )
      values(
        '${element.id}',
        '${Date.now()}',
        '${element.lText}',
        '${element.rText}'
      )`;

      await client.query(query);
    });

    testData.matedescription.forEach(async (element: { userId: string; descriptionId: string; value: number }) => {
      const query = `insert into matedescription(
        userId,
        descriptionId,
        "createdAt",
        value
      )
      values(
        '${element.userId}',
        '${element.descriptionId}',
        '${Date.now()}',
        '${element.value}'
      )`;

      await client.query(query);
    });
  });
}

createPsqlScheme(client).then(() => {
  fillSchemeWithData(client).then(() => {
    console.log('Created Tables with contents');
  });
});
