/* Autor: Arne Schaper */

import { expect } from 'chai';
import { fixture } from '@open-wc/testing-helpers';
import './find-activity';

describe('find-activity', () => {
  it('should render the title "Available Activities"', async () => {
    const element = await fixture('<find-activity></find-activity>');
    const h1Elem = element.shadowRoot!.querySelector('h2') as HTMLElement;
    expect(h1Elem.innerText).to.equal('Available Activities');
  });

  it('should render the button container for filters', async () => {
    const element = await fixture('<find-activity></find-activity>');
    const buttonDiv = element.shadowRoot!.getElementById('myBtnContainer') as HTMLDivElement;
    expect(buttonDiv).to.exist;
  });
});
