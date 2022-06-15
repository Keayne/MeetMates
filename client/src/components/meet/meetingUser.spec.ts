/* Autor: Jonathan Hüls */

import { expect } from 'chai';
import { fixture } from '@open-wc/testing-helpers';
import './meetingUser';
import { html } from 'lit';

const mate = {
  id: '8f0740c7-65ed-47ac-afec-0ca67518c348',
  name: 'Doe',
  firstName: 'Jon',
  src: '',
  age: '25'
};

describe('meetingUser', () => {
  it('should render Mate age', async () => {
    const element = await fixture(html`<meet-user .mate=${mate}></meet-user>`);
    const ageElem = element.shadowRoot!.querySelector('.mateAge') as HTMLSpanElement;
    expect(ageElem.textContent).to.contains(mate.age);
  });

  it('should render Mate Name', async () => {
    const element = await fixture(html`<meet-user .mate=${mate}></meet-user>`);
    const nameElem = element.shadowRoot!.querySelector('.h3') as HTMLSpanElement;
    expect(nameElem.textContent).to.contains(mate.name + ', ' + mate.firstName);
  });

  it('should render MateImg', async () => {
    const element = await fixture(html`<meet-user .mate=${mate}></meet-user>`);
    const imgElem = element.shadowRoot!.querySelector('img') as HTMLImageElement;
    expect(imgElem.src).to.contains(mate.src);
  });
});
