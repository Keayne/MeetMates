/* Autor: Jonathan Hüls */

import { expect } from 'chai';
import { fixture } from '@open-wc/testing-helpers';
import { html, LitElement } from 'lit';

import sinon from 'sinon';
import { httpClient } from '../../http-client.js';
import './meet';

interface Meet {
  id: string;
  name: string;
  mates: Mate[];
}
interface Mate {
  id: string;
  name: string;
  firstName: string;
  src: string;
}

const mates: Mate[] = [
  {
    id: '6d46e37c-2b34-49db-9b4e-711ac64cab75',
    name: 'Doe',
    firstName: 'Joe',
    src: ''
  },
  {
    id: 'ac0a0153-8bc0-43de-a8bb-17cc862145eb',
    name: 'Mustermann',
    firstName: 'Max',
    src: ''
  }
];

const meet: Meet = {
  id: 'a4b32e76-020f-42ff-ab2f-4021d292c85f',
  name: 'TestMeet',
  mates: mates
};

describe('app-your-meet', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should fetch Meetcontent on first update', async () => {
    const stub = sinon.stub(httpClient, 'get').returns(
      Promise.resolve({
        json() {
          return Promise.resolve(meet);
        }
      } as Response)
    );

    const element = (await fixture(html` <app-your-meet .meetId=${meet.id}></app-your-meet>`)) as LitElement;
    await element.updateComplete;
    expect(stub.callCount === 2).to.be.true;
  });

  it('should render Mates after first update', async () => {
    sinon.stub(httpClient, 'get').returns(
      Promise.resolve({
        json() {
          return Promise.resolve(meet);
        }
      } as Response)
    );

    const element = (await fixture(html` <app-your-meet .meetId=${meet.id}></app-your-meet>`)) as LitElement;
    await element.updateComplete;

    const matesArr = element.shadowRoot!.querySelectorAll('meet-user');
    expect(matesArr.length).to.equal(2);
  });

  it('should render Chat for Mates after first update', async () => {
    sinon.stub(httpClient, 'get').returns(
      Promise.resolve({
        json() {
          return Promise.resolve(meet);
        }
      } as Response)
    );

    const element = (await fixture(html` <app-your-meet .meetId=${meet.id}></app-your-meet>`)) as LitElement;
    await element.updateComplete;

    const matesArr = element.shadowRoot!.querySelectorAll('app-chat');
    expect(matesArr.length).to.equal(1);
  });

  /*
      sinon.stub(httpClient, 'get').rejects(
      Promise.reject({
        json() {
          return Promise.reject({ statusCode: 401 });
        }
      } as Response)
    );
  */
});
