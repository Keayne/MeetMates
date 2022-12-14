/* Autor: Valentin Lieberknecht */

import { expect } from 'chai';
import { fixture } from '@open-wc/testing-helpers';
import { LitElement } from 'lit';
import './change-password';
import sinon from 'sinon';

describe('app-change-password', () => {
  let element: LitElement;

  before(async () => {
    element = await fixture('<app-change-password></app-change-password>');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should render the title "Register"', async () => {
    const h1Elem = element.shadowRoot!.querySelector('h1') as HTMLElement;
    expect(h1Elem.innerHTML).to.eq('Change Password');
  });

  it('should render the input elements', async () => {
    const currentPasswordElement = element.shadowRoot!.getElementById('currentPassword') as HTMLInputElement;
    expect(currentPasswordElement).to.have.property('type', 'password');
    const passwordElement = element.shadowRoot!.getElementById('password') as HTMLInputElement;
    expect(passwordElement).to.have.property('type', 'password');
    const passwordCheckElement = element.shadowRoot!.getElementById('passwordCheck') as HTMLInputElement;
    expect(passwordCheckElement).to.have.property('type', 'password');
  });
});
