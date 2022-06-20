/* Autor: Valentin Lieberknecht */

import { expect } from 'chai';
import { UserSession } from './user-session.js';

describe('/profile', () => {
  let userSession: UserSession;

  beforeEach(async () => {
    userSession = new UserSession();
  });

  afterEach(async () => {
    userSession.deleteUser();
  });

  it('should return mate profile', async () => {
    const response = await userSession.get('/profile/3939bac7-f0ef-46ec-ac32-cecc98b4926f');
    const profile = (await response.json()) as {
      mate: {
        name: string;
        firstName: string;
        birthday: string;
        gender: string;
      };
      image: string;
      interests: string[];
      descriptons: { ltext: string; rtext: string; value: number }[];
    };

    expect(profile.mate.firstName).to.eq('Peter');
    expect(profile.mate.name).to.eq('Müller');
    expect(profile.mate.birthday).to.eq('28.02.1995');
    expect(profile.mate.gender).to.eq('male');
    expect(profile.interests).to.deep.eq(['Bowlen']);
    expect(profile.descriptons).to.deep.eq([
      { ltext: 'Öffis', rtext: 'Auto', value: 5 },
      { ltext: 'Fast Fashion', rtext: 'Second Hand', value: 1 }
    ]);
  });

  it('should return all possible interests', async () => {
    const checkIntersts = [
      'Schwimmen',
      'Segeln',
      'Fußball',
      'Handball',
      'Gym',
      'Tanzen',
      'Volleyball',
      'Basketball',
      'Golf',
      'Quidditch',
      'Bowlen',
      'Spikeball',
      'Spikeball',
      'Theater',
      'Filme',
      'Fotografie',
      'Malen',
      'Lesen',
      'Kochen/Backen',
      'Brettspiele',
      'Puzzeln',
      'Wandern',
      'Angeln'
    ];
    const response = await userSession.get('/profile/interests');
    const interests = (await response.json()) as [{ text: string }];
    const interst: string[] = [];
    interests.forEach(e => {
      interst.push(e.text);
    });
    expect(interst).to.deep.eq(checkIntersts);
  });

  it('should return all possible descriptions', async () => {
    const checkDescriptions = [
      {
        id: 'c1958e31-0ca3-45ac-ad07-d2c8ddbc61da',
        ltext: 'Introvertiert',
        rtext: 'Extrovertiert'
      },
      {
        id: 'bdb68733-030a-495f-a2d5-288552a4f05e',
        ltext: 'Abenteuerlustig',
        rtext: 'Netflix & Chill'
      },
      {
        id: '2bc81190-bcfa-4204-a20d-2b9051027762',
        ltext: 'Kanal',
        rtext: 'Aasee'
      },
      {
        id: '164a038c-3e5e-4fc5-b555-8caa0a66d551',
        ltext: 'Bier',
        rtext: 'Wein'
      },
      {
        id: 'f0e0e009-8450-4130-a258-0dca231d34d4',
        ltext: 'Fleisch',
        rtext: 'Vegetarisch'
      },
      {
        id: '2d91588c-84d2-43c0-89f6-85dab19f2c15',
        ltext: 'Redebedürftig',
        rtext: 'Ruhig'
      },
      {
        id: '8bd07273-949c-43d0-82d2-474d1d4961bd',
        ltext: 'Fast Fashion',
        rtext: 'Second Hand'
      },
      {
        id: '5d130dbc-9714-4a91-af39-5fa6f6f77d63',
        ltext: 'Öffis',
        rtext: 'Auto'
      }
    ];
    const response = await userSession.get('/profile/descriptions');
    const descriptions = (await response.json()) as [{ id: string; ltext: string; rtext: string }];
    const description: { id: string; ltext: string; rtext: string }[] = [];
    descriptions.forEach(e => {
      description.push({ id: e.id, ltext: e.ltext, rtext: e.rtext });
    });

    expect(description).to.deep.eq(checkDescriptions);
  });
});
