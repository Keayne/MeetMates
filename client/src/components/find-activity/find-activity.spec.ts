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

  it('should render create-activity button with title "Create an activity"', async () => {
    const element = await fixture('<find-activity></find-activity>');
    const button = element.shadowRoot!.querySelector('button') as HTMLButtonElement;
    expect(button.textContent).to.equal('Create an activity');
  });

  it('should open create activity dropdown and check for input with placeholder "Your Title"', async () => {
    const element = await fixture('<find-activity></find-activity>');
    const button = element.shadowRoot!.querySelector('button') as HTMLButtonElement;
    button.click();
    const input = element.shadowRoot!.getElementById('title') as HTMLInputElement;
    expect(input.placeholder).to.equal('Your Title');
  });

  it('should open create activity dropdown and check for input with id "description"', async () => {
    const element = await fixture('<find-activity></find-activity>');
    const button = element.shadowRoot!.querySelector('button') as HTMLButtonElement;
    button.click();
    const input = element.shadowRoot!.getElementById('description') as HTMLInputElement;
    expect(input).to.exist;
  });

  it('should open create activity dropdown and check for input with id "description"', async () => {
    const element = await fixture('<find-activity></find-activity>');
    const button = element.shadowRoot!.querySelector('button') as HTMLButtonElement;
    button.click();
    const input = element.shadowRoot!.getElementById('description') as HTMLInputElement;
    expect(input).to.exist;
  });

  it('should open create activity dropdown and check for select with id "category"', async () => {
    const element = await fixture('<find-activity></find-activity>');
    const button = element.shadowRoot!.querySelector('button') as HTMLButtonElement;
    button.click();
    const input = element.shadowRoot!.getElementById('category') as HTMLInputElement;
    expect(input).to.exist;
  });

  it('should open create activity dropdown and check for input type file', async () => {
    const element = await fixture('<find-activity></find-activity>');
    const button = element.shadowRoot!.querySelector('button') as HTMLButtonElement;
    button.click();
    const input = element.shadowRoot!.getElementById('inputimage') as HTMLInputElement;
    expect(input).to.exist;
  });

  it('should open create activity, fill all fields, and check for the created activity with title "Testtitle"', async () => {
    //todo
  });
});
