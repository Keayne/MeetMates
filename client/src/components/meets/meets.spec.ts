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
  age: number;
}

const mates: Mate[] = [
  {
    id: '3939bac7-f0ef-46ec-ac32-cecc98b4926f',
    name: 'Müller',
    firstName: 'Peter',
    src: '',
    age: 53
  },
  {
    id: 'eeab19ed-e87b-49a1-878e-e2a62494b050',
    name: 'Hamill',
    firstName: 'Mark',
    src: '',
    age: 70
  },
  {
    id: '5376a8df-a292-460e-865b-27441f357398',
    name: 'Pacino',
    firstName: 'Alfredo',
    src: '',
    age: 82
  },
  {
    id: '28781233-1891-4b61-9a3e-423992b161e7',
    name: 'Hüls',
    firstName: 'Jonathan',
    src: '',
    age: 25
  }
];
const meets: Meet[] = [
  {
    id: '7a28633f-1af7-4e3e-bf8b-f16f66265ae4',
    name: 'Hello Meet',
    opened: true,
    mates: mates
  },
  {
    id: '2a337de3-f69b-4363-946e-57f498cb2d32',
    name: 'Hello Meet',
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

  it('should render the newMeets and YourMeets Header', async () => {
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

    const meetsHeader = element.shadowRoot!.querySelectorAll('.meets-header');
    expect(meetsHeader.length).to.equal(2);
  });

  it('should render the Meets', async () => {
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

    const meetsElements = element.shadowRoot!.querySelectorAll('meets-meet');
    expect(meetsElements.length).to.equal(2);
  });
});
