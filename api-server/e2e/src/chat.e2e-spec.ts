/* Autor: Valentin Lieberknecht */

import { expect } from 'chai';
import { UserSession } from './user-session.js';

describe('/chat', () => {
  let userSession: UserSession;

  beforeEach(async () => {
    userSession = new UserSession();
  });

  afterEach(async () => {
    userSession.deleteUser();
  });

  it('should add chat message and get message', async () => {
    await userSession.registerUser();
    const create = await userSession.post('/chat', {
      room: 'be8ce656-875a-4b56-8c7f-8b071fe87e01',
      body: 'New Message ' + userSession.uuid
    });
    expect(create.status).to.eq(201);

    const response = await userSession.get('/chat/messages/be8ce656-875a-4b56-8c7f-8b071fe87e01');
    const messages = (await response.json()) as [{ id: string; body: string }];
    let message = '';

    messages.forEach(e => {
      if (e.body == 'New Message ' + userSession.uuid) {
        message = e.body;
        userSession.delete('/chat/' + e.id);
      }
    });
    expect(message).to.eq('New Message ' + userSession.uuid);
  });
});
