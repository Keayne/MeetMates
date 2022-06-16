/* Autor: Arne Schaper */

import { expect } from 'chai';
import { fixture } from '@open-wc/testing-helpers';
import './find-activity';
import sinon from 'sinon';
import { httpClient } from '../../http-client';
import { html, LitElement } from 'lit';

interface Actitity {
  id: string;
  title: string;
  description: string;
  tooltip: string;
  tooltipcreatedby: string;
  motivationtitle: string;
  chosen: boolean;
  meetId: string;
  image: string;
  category: string;
  personalRating: number;
  avgRating: number;
  deletepermission: boolean;
}

//const authors: string[] = ['Arne Schaper', 'Robert Müller'];

const activities: Actitity[] = [
  {
    id: '1',
    title: 'title',
    description: 'description',
    tooltip: 'tooltip',
    tooltipcreatedby: 'tooltipCreatedBy',
    motivationtitle: 'motivationTitle',
    chosen: false,
    meetId: '1234567890',
    image: '',
    category: 'Sport',
    personalRating: 5,
    avgRating: 50,
    deletepermission: true
  },
  {
    id: '2',
    title: 'title2',
    description: 'description2',
    tooltip: 'tooltip2',
    tooltipcreatedby: 'tooltipCreatedBy2',
    motivationtitle: 'motivationTitle2',
    chosen: false,
    meetId: '12345678902',
    image: '',
    category: 'Sport',
    personalRating: 100,
    avgRating: 50,
    deletepermission: true
  }
];

describe('find-activity', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should fetch two activities on first updated', async () => {
    const stubInitial = sinon.stub(httpClient, 'get').returns(
      Promise.resolve({
        json() {
          return Promise.resolve(activities);
        }
      } as Response)
    );
    const element = (await fixture(html`<find-activity></find-activity>`)) as LitElement;
    await element.updateComplete;
    expect(stubInitial.callCount === 2);
  });

  /*
  it('should fetch two activities on first updated and update avgRating and author', async () => {
    const stubInitial = sinon.stub(httpClient, 'get').returns(
      Promise.resolve({
        json() {
          return Promise.resolve(activities);
        }
      } as Response)
    );
    //TODO how do I specify the get URL?
    const stubGetNameOfAuthor = sinon.stub(httpClient, 'get').returns(
      Promise.resolve({
        json() {
          return Promise.resolve(authors);
        }
      } as Response)
    );
    const element = (await fixture(html`<find-activity></find-activity>`)) as LitElement;
    await element.updateComplete;
    expect(stubInitial.callCount === 2);
    expect(stubGetNameOfAuthor.callCount === 2);
  });*/

  it('should render a div with the ID "nothingHere" if there are no activities registered', async () => {
    const element = await fixture('<find-activity></find-activity>');
    const div = element.shadowRoot!.querySelector('#nothingHereDiv') as HTMLDivElement;
    expect(div).to.exist;
  });

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
