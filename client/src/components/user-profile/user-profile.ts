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
      <h1>Dein Profil</h1>
      <h2>Login Daten</h2>
      <h3>E-Mail</h3>
      <h3>Passwort</h3>
      <h2>Grundlegendes</h2>
      <h3>Vorname</h3>
      <h3>Nachname</h3>
      <label>Geschlecht</label>
      <select id="gender" required>
        <option></option>
        <option value="male">Männlich</option>
        <option value="female">Weiblich</option>
        <option value="diverse">Divers</option>
      </select>
      <br />
      <label>Geburtstag:</label>
      <input type="date" id="birthday" required />
      <br />
      <h2>Deine Aktivitäten und Hobbys</h2>
      <button type="button">Aktualisieren</button> `;
  }
}
