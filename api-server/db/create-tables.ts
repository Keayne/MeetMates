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
      email varchar(100),
      birthday varchar(10),
      gender varchar(10),
      image BYTEA,
      password varchar(255)
    )`
  );

  await client.query(
    `create table matemeet(
      mateid varchar(40) not null references mate(id) on delete cascade,
      meetid varchar(40) not null references meet(id),
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
      mateid varchar(40) not null references mate(id) on delete cascade,
      interestid varchar(40) not null references interest(id) on delete cascade,
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
      mateid varchar(40) not null references mate(id) on delete cascade,
      descriptionid varchar(40) not null references description(id) on delete cascade,
      "createdAt" bigint not null,
      value int not null
    )`
  );

  await client.query(
    `create table activity(
      id Varchar(40) PRIMARY KEY,
      "createdAt" bigint not null,
      title Varchar(255) not null,
      description Varchar(255) not null,
      tooltip Varchar(255) not null,
      tooltipCreatedBy Varchar(255) not null,
      motivationTitle Varchar(255) not null,
      chosen int not null,
      meetid Varchar(40) not null references meet(id) ON DELETE CASCADE,
      image BYTEA,
      category VARCHAR(40)
    )`
  );

  /*
  await client.query(
    `create table activitymeet(
      userid varchar(40) not null references mate(id),
      meetid varchar(40) not null references meet(id),
      activityid varchar(40) not null references activity(id),
      rating int
    )
  `
  );*/

  await client.query(
    `create table chat(
      id varchar(40) primary key,
      "createdAt" bigint not null,
      author varchar(40) not null references mate(id) on delete cascade,
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
      "createdAt" bigint not null,
      activityid Varchar(40) references activity(id) ON DELETE CASCADE, 
      userid Varchar(40) not null references mate(id) ON DELETE CASCADE,
      rating int`
  );
  await client.query(
    `create table verify(
      "createdAt" bigint not null,
      mateid varchar(40) not null references mate(id) on delete cascade,
      type char(1) not null,
      token varchar(250) not null,
      code int default null,
      email varchar(100) default null,
      unique (mateid, type)
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
      id,"createdAt",name,firstname,email,birthday, gender, password
    ) 
    values(
      '${element.id}',
      ${Date.now()},
      '${element.name}',
      '${element.firstName}',
      '${element.eMail}',
      '${element.Birthday}',
      '${element.gender}',
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
    testData.mateMeet.forEach(async (element: { mateid: string; meetid: string }) => {
      const query = `insert into matemeet(
        mateid,
        meetid,
        "createdAt"
      )
      values(
        '${element.mateid}',
        '${element.meetid}',
        '${Date.now()}'
      )`;

      await client.query(query);
    });

    //fill MateInterest-DBTable
    testData.mateInterest.forEach(async (element: { mateid: string; interestid: string }) => {
      const query = `insert into mateinterest(
        mateid,
        interestid,
        "createdAt"
      )
      values(
        '${element.mateid}',
        '${element.interestid}',
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

    testData.matedescription.forEach(async (element: { mateid: string; descriptionid: string; value: number }) => {
      const query = `insert into matedescription(
        mateid,
        descriptionid,
        "createdAt",
        value
      )
      values(
        '${element.mateid}',
        '${element.descriptionid}',
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
        meetid: string;
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
        meetid,
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
        '${element.meetid}',
        '${element.image}',
        '${element.category}'
      )`;
        await client.query(query);
      }
    );

    testData.rating.forEach(
      async (element: { createdAt: number; activityid: string; userid: string; rating: number }) => {
        const query = `insert into rating(
        "createdAt",
        activityid,
        userid,
        rating
      )
      values(
        '${Date.now()}',
        '${element.activityid}',
        '${element.userid}',
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
