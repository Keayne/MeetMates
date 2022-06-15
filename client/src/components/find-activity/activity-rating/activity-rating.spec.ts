/* Autor: Arne Schaper */

import { expect } from 'chai';
import { fixture } from '@open-wc/testing-helpers';
import './activity-rating';
import { html } from 'lit';

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

describe('activity-rating', () => {
  it('should render a slider with the class disabled with the ID "overallRating"', async () => {
    const element = await fixture(html`<activity-rating .activity=${activity}></activity-rating>`);
    const slider = element.shadowRoot!.querySelector('slidecontainer') as HTMLDivElement;
    expect(slider).to.have.property('disabled');
  });
});
