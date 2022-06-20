/* Autor: Valentin Lieberknecht */

import { expect } from 'chai';
import { fixture } from '@open-wc/testing-helpers';
import { LitElement } from 'lit';
import './change-email';
import sinon from 'sinon';

describe('app-change-email', () => {
  let element: LitElement;

  before(async () => {
    element = await fixture('<app-change-email></app-change-email>');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should render the title "Register"', async () => {
    const h1Elem = element.shadowRoot!.querySelector('h1') as HTMLElement;
    expect(h1Elem.innerHTML).to.eq('Change E-Mail');
  });

  it('should render the input elements', async () => {
    const currentPasswordElement = element.shadowRoot!.getElementById('email') as HTMLInputElement;
    expect(currentPasswordElement).to.have.property('type', 'email');
  });
});
