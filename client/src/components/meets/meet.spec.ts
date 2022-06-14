/* Autor: Jonathan Hüls */

import { expect } from 'chai';
import { fixture } from '@open-wc/testing-helpers';
import { html } from 'lit';

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

describe('meets-meet', () => {
  it('should render Meet Name', async () => {
    const element = await fixture(html`<meets-meet .meet=${meet} />`);
    const meetElem = element.shadowRoot!.querySelector('.name') as HTMLHeadingElement;
    expect(meetElem.textContent).to.equal(meet.name);
  });

  it('should render Meet Mates', async () => {
    const element = await fixture(html`<meets-meet .meet=${meet} />`);
    const divArry = element.shadowRoot!.querySelectorAll('meets-mate-icon');
    expect(divArry.length).to.equal(mates.length);
  });
});
