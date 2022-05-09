/* Autor: Arne Schaper */

import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import componentStyle from './user-profile.css';

@customElement('user-profile')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class AboutComponent extends PageMixin(LitElement) {
  static styles = componentStyle;

  render() {
    return html`${this.renderNotification()}
      <h1>User Profile</h1>
      <h2>Login Daten</h2>
      <h3>E-Mail</h3>
      <h3>Passwort</h3>
      <h2>Deine Hobbies</h2>
      <h3>Hobby 1</h3>
      <h3>Hobby 2</h3>
      <button type="button">Aktualisieren</button> `;
  }
}
