/* Autor: Jonathan Hüls */

import { expect } from 'chai';
import { fixture } from '@open-wc/testing-helpers';
import { html } from 'lit';

import './userIcon';

interface Mate {
  id: string;
  name: string;
  firstName: string;
  src: string;
}

const mate: Mate = {
  id: '992c96c4-3cec-4901-86fb-575e6ae10798',
  name: 'Doe',
  firstName: 'Jon',
  src: ''
};

describe('meets-mate-icon', () => {
  it('should render alternative ImageText', async () => {
    const element = await fixture(html`<meets-mate-icon .mate=${mate} />`);
    const imgElem = element.shadowRoot!.querySelector('img') as HTMLImageElement;
    expect(imgElem.alt).to.equal('J.D');
  });

  it('should render tooltip with MateName', async () => {
    const element = await fixture(html`<meets-mate-icon .mate=${mate} />`);
    const spanElem = element.shadowRoot!.querySelector('.tooltiptext') as HTMLSpanElement;
    expect(spanElem.textContent).to.equal(mate.firstName + ', ' + mate.name);
  });
});
