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
    expect(profile.image).not.to.be.empty;
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
});
