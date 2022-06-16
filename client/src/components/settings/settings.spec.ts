/* Autor: Valentin Lieberknecht */

import { expect } from 'chai';
import { fixture } from '@open-wc/testing-helpers';
import { LitElement } from 'lit';
import './settings';
import sinon from 'sinon';

describe('app-settings', () => {
  let element: LitElement;

  before(async () => {
    element = await fixture('<app-settings></app-settings>');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('render all links', async () => {
    const anchorElements = element.shadowRoot!.querySelectorAll('a');
    expect(anchorElements.length).to.eq(4);

    expect(anchorElements[0].text).to.eq('Edit Profile');
    expect(anchorElements[1].text).to.eq('Change Email');
    expect(anchorElements[2].text).to.eq('Change Password');
    expect(anchorElements[3].text).to.eq('Delete profile');
  });
});
