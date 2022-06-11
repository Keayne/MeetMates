/* Author: Jonathan Hüls */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
    'drop table if exists matemeet, matedescription , mateinterest , meet,  mate, interest, matedescription, description, servicedata, activitymeet, chat, activity, report, rating, verify cascade;'
  );

  await client.query(
    `create table meet(
      id varchar(40) primary key,
      "createdAt" bigint NOT NULL,
      name varchar(60) NOT NULL
    )`
  );

  await client.query(
    `create table mate(
      id varchar(40) primary key,
      "createdAt" bigint NOT NULL,
      active boolean NOT NULL default false,
      name varchar(100) NOT NULL,
      firstname varchar(100) NOT NULL,
      email varchar(100),
      birthday varchar(10),
      gender varchar(10),
      image BYTEA,
      password varchar(255)
    );`
  );

  await client.query(
    `create table matemeet(
      mateid varchar(40) NOT NULL references mate(id) on delete cascade,
      meetid varchar(40) NOT NULL references meet(id),
      opened boolean default false,
      "createdAt" bigint NOT NULL,
      rating int
      );`
  );

  await client.query(
    `create table interest(
      id varchar(40) primary key,
      "createdAt" bigint NOT NULL,
      text varchar(80),
      sort varchar(80)
    );`
  );

  await client.query(
    `create table mateinterest(
      mateid varchar(40),
      interestid varchar(40),
      "createdAt" bigint NOT NULL,
      FOREIGN KEY(mateid) REFERENCES mate(id) on delete cascade,
      FOREIGN KEY(interestid) REFERENCES interest(id) on delete cascade
    );`
  );

  await client.query(
    `create table description(
      id varchar(40) primary key,
      "createdAt" bigint NOT NULL,
      lText varchar(255) NOT NULL,
      rText varchar(255) NOT NULL
    );`
  );

  await client.query(
    `create table matedescription(
      mateid varchar(40) NOT NULL references mate(id) on delete cascade,
      descriptionid varchar(40) NOT NULL references description(id) on delete cascade,
      "createdAt" bigint NOT NULL,
      value int NOT NULL
    );`
  );

  await client.query(
    `create table activity(
      id Varchar(40) PRIMARY KEY,
      "createdAt" bigint NOT NULL,
      title Varchar(255) NOT NULL,
      description Varchar(255) NOT NULL,
      tooltip Varchar(255) NOT NULL,
      tooltipCreatedBy Varchar(255) NOT NULL,
      motivationTitle Varchar(255) NOT NULL,
      chosen int NOT NULL,
      meetid Varchar(40) NOT NULL references meet(id) ON DELETE CASCADE,
      image BYTEA,
      category VARCHAR(40)
    );`
  );

  await client.query(
    `create table chat(
      id varchar(40) primary key,
      "createdAt" bigint NOT NULL,
      author varchar(40) NOT NULL references mate(id) on delete cascade,
      room varchar(40) NOT NULL references meet(id),
      body varchar(255) NOT NULL
    );`
  );

  await client.query(
    `create table report(
      id varchar(40) primary key,
      "createdAt" bigint NOT NULL,
      document_uri varchar(255),
      referrer varchar(255),
      violated_directive varchar(255),
      effective_directive varchar(255),
      original_policy varchar(255),
      disposition varchar(255),
      blocked_uri varchar(255),
      status_code int
    );`
  );

  await client.query(
    `create table rating(
      "createdAt" bigint NOT NULL,
      activityid Varchar(40) references activity(id) ON DELETE CASCADE, 
      userid Varchar(40) NOT NULL references mate(id) ON DELETE CASCADE,
      rating int);`
  );
  await client.query(
    `create table verify(
      "createdAt" bigint NOT NULL,
      mateid varchar(40) NOT NULL references mate(id) on delete cascade,
      type char(1) NOT NULL,
      token varchar(250) NOT NULL,
      code int default null,
      email varchar(100) default null,
      unique (mateid, type)
    );`
  );
}

async function fillSchemeWithData(client: ClientType) {
  const testData = JSON.parse(fs.readFileSync(new URL('./dbTest_data.json', import.meta.url), 'utf-8'));

  //fill meet-DBTable
  console.log('fill meet-DBTable');
  await Promise.all(
    testData.meet.map(async (element: any): Promise<{ id: string; name: string } | null> => {
      const query = `insert into meet(id,"createdAt",name) VALUES('${element.id}',${Date.now()},'${element.name}');`;
      await client.query(query);
      return element;
    })
  );

  //fill mate-DBTable
  console.log('fill mate-DBTable');
  await Promise.all(
    testData.mates.map(async (element: Mate): Promise<void> => {
      const query = `insert into mate(
        id,"createdAt",name,firstname,email,birthday, gender, password, active
      ) 
      values(
        '${element.id}',
         ${Date.now()},
        '${element.name}',
        '${element.firstName}',
        '${element.eMail}',
        '${element.Birthday}',
        '${element.gender}',
        '${element.password}',
         ${true}
      )`;
      await client.query(query);
    })
  );

  //fill interest-DBTable
  console.log('fill interest-DBTable');
  await Promise.all(
    testData.interest.map(async (element: any): Promise<void> => {
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
    })
  );

  //fill mateMeet-DBTable
  console.log('fill mateMeet-DBTable');
  await Promise.all(
    testData.mateMeet.map(async (element: any): Promise<void> => {
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
    })
  );

  //fill Description-DBTable
  console.log('fill Description-DBTable');
  await Promise.all(
    testData.description.map(async (element: any): Promise<void> => {
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
    })
  );

  //fill MateInterest-DBTable
  console.log('fill MateInterest-DBTable');
  await Promise.all(
    testData.mateInterest.map(async (element: any): Promise<void> => {
      const query = `insert into mateinterest(
        mateid,
        interestid,
        "createdAt"
      )
      values(
        '${element.mateId}',
        '${element.interestId}',
        '${Date.now()}'
      )`;

      await client.query(query);
    })
  );

  await Promise.all(
    testData.activity.map(async (element: any): Promise<void> => {
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
        '${element.meetId}',
        '${element.image}',
        '${element.category}'
      )`;
      await client.query(query);
    })
  );

  await Promise.all(
    testData.rating.map(async (element: any): Promise<void> => {
      const query = `insert into rating(
        "createdAt",
        activityid,
        userid,
        rating
      )
      values(
        '${Date.now()}',
        '${element.activityId}',
        '${element.userId}',
        '${element.rating}'
      )`;
      await client.query(query);
    })
  );

  //fill MateDescription-DBTable
  console.log('fill MateDescription-DBTable');
  await Promise.all(
    testData.matedescription.map(async (element: any): Promise<void> => {
      const query = `insert into matedescription(
        mateid,
        descriptionid,
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
    })
  );
}

createPsqlScheme(client).then(() => {
  fillSchemeWithData(client).then(() => {
    console.log('Created Tables with contents');
  });
});
