/* Autor: Jonathan Hüls */

import { expect } from 'chai';
import { fixture } from '@open-wc/testing-helpers';
import './landing-page';

describe('landing-page', () => {
  it('should render try-it Button', async () => {
    const element = await fixture('<landing-page></landing-page>');
    const inputElem = element.shadowRoot!.querySelector('#tryItBtn') as HTMLButtonElement;
    expect(inputElem.value).to.equal('Try it Yourself !');
  });

  it('should render Quotes', async () => {
    const element = await fixture('<landing-page></landing-page>');
    const divArry = element.shadowRoot!.querySelectorAll('.quoteContainer');
    expect(divArry.length).to.equal(3);
  });
});
