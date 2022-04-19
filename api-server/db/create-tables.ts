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
    `Create Table meet(
      id VARCHAR(40) PRIMARY KEY,
      "createdAt" bigint Not Null,
      name Varchar(60) Not Null
    )`
  );

  await client.query(
    `Create Table mate(
      id Varchar(40) PRIMARY KEY,
      "createdAt" bigint Not Null,
      name VARCHAR(100) NOT NULL,
      firstname VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      birthday VARCHAR(10),
      gender Varchar(10),
      password Varchar(255),
      salt Varchar(255),
      lastloggedin Varchar(10)
    )`
  );

  await client.query(
    `Create Table matemeet(
      userId Varchar(40) NOT NULL references mate(id),
      meetId Varchar(40) NOT NULL references meet(id),
      "createdAt" bigint ,
      rating int
      )`
  );

  await client.query(
    `Create Table interest(
      id Varchar(40) PRIMARY KEY,
      text Varchar(80),
      sort Varchar(80)
    )`
  );

  await client.query(
    `Create Table mateinterest(
      userId Varchar(40) NOT NULL references mate(id),
      interestId Varchar(40) NOT NULL references interest(id)
    )`
  );

  await client.query(
    `Create Table description(
      id Varchar(40) PRIMARY KEY,
      lText Varchar(255) NOT NULL,
      rText Varchar(255) NOT NULL
    )`
  );

  await client.query(
    `Create Table matedescription(
      userId Varchar(40) NOT NULL references mate(id),
      descriptionId Varchar(40) NOT NULL references description(id),
      value int NOT NULL
    )`
  );
}

async function fillSchemeWithData(client: ClientType) {
  const testData = JSON.parse(fs.readFileSync(new URL('./dbTest_data.json', import.meta.url), 'utf-8'));

  //fill meet-DBTable
  testData.meet.forEach(async (element: { id: string; name: string }) => {
    const query = `INSERT INTO meet (id,"createdAt",name) VALUES('${element.id}',${Date.now()},'${element.name}');`;
    await client.query(query);
  });

  //fill mate-DBTable
  testData.mates.forEach(async (element: Mate) => {
    const query = `Insert into mate (
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
      const query = `Insert into interest (
        id,text,sort
      ) 
      values(
        '${element.id}',
        '${element.text}',
        '${element.sort}'
      )`;

      await client.query(query);
    });

    //fill mateMeet-DBTable
    testData.mateMeet.forEach(async (element: { userId: string; meetId: string }) => {
      const query = `Insert into matemeet(
        userid,
        meetid,
        "createdAt"
      )
      values(
        '${element.userId}',
        '${element.meetId}',
        ${Date.now()}
      )`;

      await client.query(query);
    });

    //fill MateInterest-DBTable
    testData.mateInterest.forEach(async (element: { userId: string; interestId: string }) => {
      const query = `Insert into mateinterest(
        userid,
        interestid
      )
      values(
        '${element.userId}',
        '${element.interestId}'
      )`;

      await client.query(query);
    });

    //fill Description-DBTable
    testData.description.forEach(async (element: { id: string; lText: string; rText: string }) => {
      const query = `Insert into description(
        id,
        ltext,
        rtext
      )
      values(
        '${element.id}',
        '${element.lText}',
        '${element.rText}'
      )`;

      await client.query(query);
    });

    testData.matedescription.forEach(async (element: { userId: string; descriptionId: string; value: number }) => {
      const query = `Insert into matedescription(
        userId,
        descriptionId,
        value
      )
      values(
        '${element.userId}',
        '${element.descriptionId}',
        ${element.value}
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
