/* Autor: Valentin Lieberknecht */

import { expect } from 'chai';
import { fixture } from '@open-wc/testing-helpers';
import { LitElement } from 'lit';
import './about';
import sinon from 'sinon';

describe('app-about', () => {
  let element: LitElement;

  before(async () => {
    element = await fixture('<app-about></app-about>');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should render the text', async () => {
    const pElements = element.shadowRoot!.querySelectorAll('p');
    console.log(pElements[0].innerHTML);
    console.log(pElements[1].innerHTML);
    expect(pElements[0].innerHTML).to.contains('Wir sind Arne, Jonathan und Valentin.');
    expect(pElements[1].innerHTML).to.contains('In unserem Studium haben wir Coronabedingt kaum möglichkeiten');
  });
});
