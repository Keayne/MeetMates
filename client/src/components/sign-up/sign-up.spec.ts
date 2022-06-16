/* Autor: Valentin Lieberknecht */

import { expect } from 'chai';
import { fixture } from '@open-wc/testing-helpers';
import { LitElement } from 'lit';
import './sign-up';
import sinon from 'sinon';
import { httpClient } from '../../http-client';

describe('app-sign-up', () => {
  let element: LitElement;

  before(async () => {
    element = await fixture('<app-sign-up></app-sign-up>');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should render the title "Register"', async () => {
    const h1Elem = element.shadowRoot!.querySelector('h1') as HTMLElement;
    expect(h1Elem.innerHTML).to.eq('Register');
  });

  it('should redner the inputs', async () => {
    const firstnameElement = element.shadowRoot!.getElementById('firstname') as HTMLInputElement;
    expect(firstnameElement).to.have.property('type', 'text');
    const birthdayElement = element.shadowRoot!.getElementById('birthday') as HTMLInputElement;
    expect(birthdayElement).to.have.property('type', 'date');
    const emailElement = element.shadowRoot!.getElementById('email') as HTMLInputElement;
    expect(emailElement).to.have.property('type', 'email');
  });

  it('should fetch interests on first update', async () => {
    const stub = sinon.stub(httpClient, 'get');
    const elem = (await fixture('<app-sign-up></app-sign-up>')) as LitElement;
    await elem.updateComplete;

    expect(stub.called).true;
  });

  it('should render the interests', async () => {
    const elem = (await fixture('<app-sign-up></app-sign-up>')) as LitElement;
    await elem.updateComplete;
    const interests = [
      { id: '66939399-b094-4966-b2a7-b8bfd1b4ca6b', createdAt: '1653491900929', text: 'Schwimmen', sort: 'Sport' },
      { id: '922e018f-f6a0-4674-b4af-8b3d8fe37afc', createdAt: '1653491900929', text: 'Segeln', sort: 'Sport' },
      { id: 'e23bf132-f8b0-46cd-b8f6-51f82e4b992b', createdAt: '1653491900929', text: 'Fußball', sort: 'Sport' },
      { id: '35772142-03a8-4a4b-a994-cfd22e9d510d', createdAt: '1653491900929', text: 'Handball', sort: 'Sport' },
      { id: '42baac58-f58f-44f7-a0c1-29306f7a60e5', createdAt: '1653491900929', text: 'Gym', sort: 'Sport' },
      { id: 'ef4c6756-da08-4328-a9ea-da155e76094d', createdAt: '1653491900929', text: 'Tanzen', sort: 'Sport' },
      { id: '0769e9c5-7863-401b-baff-18b489f3538a', createdAt: '1653491900929', text: 'Volleyball', sort: 'Sport' },
      { id: '9b6f6222-c011-4e51-bcb3-717f710b7c10', createdAt: '1653491900929', text: 'Basketball', sort: 'Sport' },
      { id: '9e8cae38-f1a9-4a0e-83ae-4dcd4077890a', createdAt: '1653491900929', text: 'Golf', sort: 'Sport' },
      { id: '19859ce9-4a6f-41aa-9110-0ae4a43af8e3', createdAt: '1653491900929', text: 'Quidditch', sort: 'Sport' },
      { id: '048dfe50-bdaa-4e96-9dac-1f26c727a295', createdAt: '1653491900929', text: 'Bowlen', sort: 'Sport' },
      { id: '2c9de31f-d01a-4503-bab6-55760812b8ed', createdAt: '1653491900929', text: 'Spikeball', sort: 'Sport' },
      { id: '55f9e928-1101-45b9-b9f2-009092afa3a4', createdAt: '1653491900929', text: 'Spikeball', sort: 'Sport' },
      { id: 'a544a087-7f7c-4ff4-b003-b731dfe01063', createdAt: '1653491900929', text: 'Theater', sort: 'Creative' },
      { id: 'cb7eb374-0ce6-4adb-bcce-66a7d5518bde', createdAt: '1653491900929', text: 'Filme', sort: 'Creative' },
      { id: '7d595757-992d-46f3-89bd-c44534b0ad71', createdAt: '1653491900929', text: 'Fotografie', sort: 'Creative' },
      { id: '5ca7d9fd-44c3-48c9-a5b7-e777a0168a32', createdAt: '1653491900929', text: 'Malen', sort: 'Creative' },
      { id: '75abe84c-6dd1-43d9-b6f4-202ca1c27315', createdAt: '1653491900929', text: 'Lesen', sort: 'Indoor' },
      { id: '1e36b759-4336-4f8f-a0a2-b6df0d236d55', createdAt: '1653491900929', text: 'Kochen/Backen', sort: 'Indoor' },
      { id: 'ce6e1f0e-05d6-4aed-8700-eb0e2f4e085e', createdAt: '1653491900929', text: 'Brettspiele', sort: 'Indoor' },
      { id: 'e9c6c11f-be06-4c8d-a0a8-f24c155316fb', createdAt: '1653491900929', text: 'Puzzeln', sort: 'Indoor' },
      { id: 'a3afd16d-df52-49f4-a69a-6ce90ca88d97', createdAt: '1653491900929', text: 'Wandern', sort: 'Outdoor' },
      { id: '6eae239b-edf2-4c11-92d5-9dd21b7128ce', createdAt: '1653491900929', text: 'Angeln', sort: 'Outdoor' }
    ];
    sinon.stub(httpClient, 'get').returns(
      Promise.resolve({
        json() {
          return Promise.resolve(interests);
        }
      } as Response)
    );
    element.requestUpdate();
    await element.updateComplete;
    const interestsElements = element.shadowRoot!.querySelectorAll('.pill');

    expect(interestsElements.length).to.equal(23);
  });
});
