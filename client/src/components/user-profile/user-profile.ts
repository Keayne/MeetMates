/* Autor: Valentin Lieberknecht */

import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { httpClient } from '../../http-client';
import { PageMixin } from '../page.mixin';
import { Mate } from './mate';
import componentStyle from './user-profile.css';

@customElement('user-profile')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class UserProfileComponent extends PageMixin(LitElement) {
  static styles = componentStyle;
  @property() profileId!: string;
  @state() mate: Mate = {
    name: '',
    firstName: '',
    birthday: '',
    gender: ''
  };
  @state() private interests: string[] = [];
  @state() private descriptions: { ltext: string; rtext: string; value: number }[] = [];
  @state() private imgSrc!: string;

  async firstUpdated() {
    const mate = await httpClient.get('/profile/' + this.profileId);
    const response = await mate.json();
    this.mate = await response.mate;
    this.interests = response.interests;
    this.imgSrc = response.image;
    this.descriptions = response.descriptons;
  }

  render() {
    return html`${this.renderNotification()}
      <div class="main">
        <img style="max-width: 200px; max-height: 200px" src="${this.imgSrc}" />
        <p>Fistname: ${this.mate.firstName}</p>
        <p>Name: ${this.mate.name}</p>
        <p>Birthday: ${this.mate.birthday}</p>
        <p>Gender: ${this.mate.gender}</p>
        <h4>Aktivitäten und Hobbys</h4>
        ${this.interests.map(
          interst =>
            html`<div class="pill">
              <span>${interst}</span>
            </div>`
        )}
        <h4>Ratings</h4>
        ${this.descriptions.map(
          e => html` <show-rating ltext="${e.ltext}" rtext="${e.rtext}" value="${e.value}"></show-rating>`
        )}
      </div>`;
  }
}
