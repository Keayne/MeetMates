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
    'drop table if exists matemeet, matedescription , mateinterest , meet,  mate, interest, matedescription, description, servicedata, activitymeet, activity, report cascade'
  );
  await client.query(
    `create table meet(
      id varchar(40) primary key,
      "createdAt" bigint not null,
      name varchar(60) not null
    )`
  );

  await client.query(
    `create table mate(
      id varchar(40) primary key,
      "createdAt" bigint not null,
      active boolean not null default false,
      name varchar(100) not null,
      firstname varchar(100) not null,
      email varchar(100) not null,
      birthday varchar(10),
      gender varchar(10),
      image BYTEA,
      password varchar(255),
      lastloggedin varchar(10)
    )`
  );

  await client.query(
    `create table matemeet(
      mateId varchar(40) not null references mate(id),
      meetId varchar(40) not null references meet(id),
      "createdAt" bigint not null,
      rating int
      )`
  );

  await client.query(
    `create table interest(
      id varchar(40) primary key,
      "createdAt" bigint not null,
      text varchar(80),
      sort varchar(80)
    )`
  );

  await client.query(
    `create table mateinterest(
      mateId varchar(40) not null references mate(id) on delete cascade,
      interestId varchar(40) not null references interest(id) on delete cascade,
      "createdAt" bigint not null
    )`
  );

  await client.query(
    `create table description(
      id varchar(40) primary key,
      "createdAt" bigint not null,
      lText varchar(255) not null,
      rText varchar(255) not null
    )`
  );

  await client.query(
    `create table matedescription(
      mateId varchar(40) not null references mate(id) on delete cascade,
      descriptionId varchar(40) not null references description(id) on delete cascade,
      "createdAt" bigint not null,
      value int not null
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
      meetId Varchar(40) NOT NULL references meet(id) ON DELETE CASCADE,
      image BYTEA,
      category VARCHAR(40)
    )`
  );

  /*
  await client.query(
    `create table activitymeet(
      userId varchar(40) not null references mate(id),
      meetId varchar(40) not null references meet(id),
      activityId varchar(40) not null references activity(id),
      rating int
    )
  `
  );*/

  await client.query(
    `create table chat(
      id varchar(40) primary key,
      "createdAt" bigint not null,
      author varchar(40) not null references mate(id),
      room varchar(40) not null references meet(id),
      body varchar(255) not null
    )`
  );

  await client.query(
    `create table report(
      id varchar(40) primary key,
      "createdAt" bigint not null,
      document_uri varchar(255),
      referrer varchar(255),
      violated_directive varchar(255),
      effective_directive varchar(255),
      original_policy varchar(255),
      disposition varchar(255),
      blocked_uri varchar(255),
      status_code int
    )`
  );

  await client.query(
    `create table rating(
      "createdAt" bigint Not Null,
      activityId Varchar(40) references activity(id) ON DELETE CASCADE, 
      userId Varchar(40) NOT NULL references mate(id) ON DELETE CASCADE,
      rating int`
  );
  await client.query(
    `create table verify (
      id varchar(40) primary key,
      "createdAt" bigint not null,
      mateId varchar(40) not null references mate(id) on delete cascade,
      token varchar(250) not null default null
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
