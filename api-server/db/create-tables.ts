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
  password: string;
};

async function createPsqlScheme(client: ClientType) {
  await client.connect();
  await client.query(
    'drop table if exists matemeet, matedescription , mateinterest , meet,  mate, interest, matedescription, description, servicedata, activitymeet, activity, chat, report, rating'
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
      mateId Varchar(40) NOT NULL references mate(id),
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
      mateId Varchar(40) NOT NULL references mate(id),
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
      mateId Varchar(40) NOT NULL references mate(id),
      descriptionId Varchar(40) NOT NULL references description(id),
      "createdAt" bigint Not Null,
      value int NOT NULL
    )`
  );

  await client.query(
    `create table activity(
      id Varchar(40) PRIMARY KEY,
      "createdAt" bigint Not Null,
      title Varchar(255) NOT NULL,
      description Varchar(255) NOT NULL,
      tooltip Varchar(255) NOT NULL,
      tooltipCreatedBy Varchar(255) NOT NULL,
      motivationTitle Varchar(255) NOT NULL,
      chosen int NOT NULL,
      meetId Varchar(40) NOT NULL references meet(id),
      image BYTEA,
      category VARCHAR(40)
    )`
  );

  /*
  await client.query(
    `create table activitymeet(
      userId Varchar(40) NOT NULL references mate(id),
      meetId Varchar(40) NOT NULL references meet(id),
      activityId Varchar(40) NOT NULL references activity(id),
      rating int
    )
  `
  );*/

  await client.query(
    `create table chat(
      id Varchar(40) PRIMARY KEY,
      "createdAt" bigint Not Null,
      author Varchar(40) NOT NULL references mate(id),
      room Varchar(40) NOT NULL references meet(id),
      body Varchar(255) NOT NULL
    )`
  );

  await client.query(
    `create table report(
      id Varchar(40) PRIMARY KEY,
      "createdAt" bigint Not Null,
      document_uri Varchar(255),
      referrer Varchar(255),
      violated_directive Varchar(255),
      effective_directive Varchar(255),
      original_policy Varchar(255),
      disposition Varchar(255),
      blocked_uri Varchar(255),
      status_code int
    )`
  );

  await client.query(
    `create table rating(
      "createdAt" bigint Not Null,
      activityId Varchar(40) references activity(id),
      userId Varchar(40) NOT NULL references mate(id),
      rating int
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
      id,"createdAt",name,firstname,email,birthday, gender, lastloggedin, password
    ) 
    values(
      '${element.id}',
      ${Date.now()},
      '${element.name}',
      '${element.firstName}',
      '${element.eMail}',
      '${element.Birthday}',
      '${element.gender}',
      '${element.lastLoggedIn}',
      '${element.password}'
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
    testData.mateMeet.forEach(async (element: { mateId: string; meetId: string }) => {
      const query = `insert into matemeet(
        mateId,
        meetid,
        "createdAt"
      )
      values(
        '${element.mateId}',
        '${element.meetId}',
        '${Date.now()}'
      )`;

      await client.query(query);
    });

    //fill MateInterest-DBTable
    testData.mateInterest.forEach(async (element: { mateId: string; interestId: string }) => {
      const query = `insert into mateinterest(
        mateId,
        interestid,
        "createdAt"
      )
      values(
        '${element.mateId}',
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

    testData.matedescription.forEach(async (element: { mateId: string; descriptionId: string; value: number }) => {
      const query = `insert into matedescription(
        mateId,
        descriptionId,
        "createdAt",
        value
      )
      values(
        '${element.mateId}',
        '${element.descriptionId}',
        '${Date.now()}',
        '${element.value}'
      )`;

      await client.query(query);
    });

    testData.activity.forEach(
      async (element: {
        id: string;
        createdAt: number;
        title: string;
        description: string;
        tooltip: string;
        tooltipCreatedBy: string;
        motivationTitle: string;
        chosen: number;
        meetId: string;
        image: string;
        category: string;
      }) => {
        const query = `insert into activity(
        id,
        "createdAt",
        title,
        description,
        tooltip,
        tooltipCreatedBy,
        motivationTitle,
        chosen,
        meetId,
        image,
        category
      )
      values(
        '${element.id}',
        '${Date.now()}',
        '${element.title}',
        '${element.description}',
        '${element.tooltip}',
        '${element.tooltipCreatedBy}',
        '${element.motivationTitle}',
        '${element.chosen}',
        '${element.meetId}',
        '${element.image}',
        '${element.category}'
      )`;
        await client.query(query);
      }
    );

    testData.rating.forEach(
      async (element: { createdAt: number; activityId: string; userId: string; rating: number }) => {
        const query = `insert into rating(
        "createdAt",
        activityId,
        userId,
        rating
      )
      values(
        '${Date.now()}',
        '${element.activityId}',
        '${element.userId}',
        '${element.rating}'
      )`;
        await client.query(query);
      }
    );
  });
}

createPsqlScheme(client).then(() => {
  fillSchemeWithData(client).then(() => {
    console.log('Created Tables with contents');
  });
});
