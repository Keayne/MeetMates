/* Autor: Arne Schaper */

import { expect } from 'chai';
import { fixture } from '@open-wc/testing-helpers';
import './activity-info';
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

const activity: Actitity = {
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
};

describe('activity-info', () => {
  it('should render a card title with the ID "cardtitle" ', async () => {
    const element = (await fixture(html`<activity-info .activity=${activity}></activity-info>`)) as LitElement;
    const div = element.shadowRoot!.querySelector('#cardtitle') as HTMLDivElement;
    expect(div).to.exist;
  });

  it('should render a card description with the ID "cardtitle" ', async () => {
    const element = (await fixture(html`<activity-info .activity=${activity}></activity-info>`)) as LitElement;
    const div = element.shadowRoot!.querySelector('.card-content') as HTMLDivElement;
    expect(div).to.exist;
  });
});
