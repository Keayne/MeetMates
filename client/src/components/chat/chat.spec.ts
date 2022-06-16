/* Autor: Valentin Lieberknecht */

import { expect } from 'chai';
import { fixture } from '@open-wc/testing-helpers';
import { LitElement } from 'lit';
import './chat';
import sinon from 'sinon';
import { httpClient } from '../../http-client';

describe('app-chat', () => {
  let element: LitElement;

  before(async () => {
    element = await fixture('<app-chat></app-chat>');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should redner the input message', async () => {
    const firstnameElement = element.shadowRoot!.getElementById('message') as HTMLInputElement;
    expect(firstnameElement).to.have.property('type', 'text');
    expect(firstnameElement).to.have.property('placeholder', 'Your message..');
  });

  it('should fetch messages on first update', async () => {
    const stub = sinon.stub(httpClient, 'get');
    const elem = (await fixture('<app-chat></app-chat>')) as LitElement;
    await elem.updateComplete;

    expect(stub.called).true;
  });

  it('should render the interests', async () => {
    const elem = (await fixture('<app-sign-up></app-sign-up>')) as LitElement;
    await elem.updateComplete;
    const messages = [
      {
        id: '66875fb2-e92c-4d2f-a606-ec5a97b14659',
        createdAt: '1655153722892',
        author: 'Marie Curie',
        room: '7c7ef26c-c70d-4a0c-8866-6acac28d55ef',
        body: 'test',
        posttime: '13.6.2022, 22:55:22',
        own: 'msg-remote'
      },
      {
        id: '9c106ac8-bc5d-467e-b8cd-fe9d21d332db',
        createdAt: '1655153724965',
        author: 'Me',
        room: '7c7ef26c-c70d-4a0c-8866-6acac28d55ef',
        body: 'hallo',
        posttime: '13.6.2022, 22:55:24',
        own: 'msg-self'
      }
    ];
    sinon.stub(httpClient, 'get').returns(
      Promise.resolve({
        json() {
          return Promise.resolve({ messages });
        }
      } as Response)
    );
    element.requestUpdate();
    await element.updateComplete;
    const messageElements = element.shadowRoot!.querySelectorAll('app-chat-message');
    console.log(messageElements);

    expect(messageElements.length).to.equal(2);
  });
});
