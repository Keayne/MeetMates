/* Autor: Jonathan Hüls */

import { expect } from 'chai';
import { fixture } from '@open-wc/testing-helpers';
import { html, LitElement } from 'lit';

import sinon from 'sinon';
import { httpClient } from '../../http-client.js';
import './meets';

interface Meet {
  id: string;
  name: string;
  opened: boolean;
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
const meets: Meet[] = [
  {
    id: 'a4b32e76-020f-42ff-ab2f-4021d292c85f',
    name: 'openedTestMeet',
    opened: true,
    mates: mates
  },
  {
    id: 'a4b32e76-020f-42ff-ab2f-4021d292c85f',
    name: 'unOpenedTestMeet',
    opened: false,
    mates: mates
  }
];

describe('app-meets', () => {
  /*
beforeEach(() =>{
    sinon.
})
*/
  afterEach(() => {
    sinon.restore();
  });

  /*
  it('should fetch Meets on first update', async () => {
    const stub = sinon.stub(httpClient, 'get').returns(
      Promise.resolve({
        json() {
          return Promise.resolve(meets);
        }
      } as Response)
    );

    const element = (await fixture(html`<app-meets></app-meets>`)) as LitElement;
    await element.updateComplete;
    expect(stub.calledOnce).to.be.true;
  });

  it('should render the fetched Meets', async () => {
    sinon.stub(httpClient, 'get').returns(
      Promise.resolve({
        json() {
          return Promise.resolve(meets);
        }
      } as Response)
    );

    const element = (await fixture(html`<app-meets></app-meets>`)) as LitElement;
    await element.updateComplete;

    element.requestUpdate(); // da in firstUpdated() das Property tasks asynchron gesetzt wird
    await element.updateComplete;

    const taskElems = element.shadowRoot!.querySelectorAll('.meets-header');
    expect(taskElems.length).to.equal(2);
  });
  */
});
