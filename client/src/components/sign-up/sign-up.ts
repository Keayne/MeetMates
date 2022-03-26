/* Autor: Valentin Lieberknecht */

import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import componentStyle from './sign-up.css';
import hobbies from './hobbies.json';
import ratings from './ratings.json';

@customElement('app-sign-up')
class SignUpComponent extends PageMixin(LitElement) {
  static styles = componentStyle;
  selectedHobbies: string[] = [];

  selectHobby(e: any, hobby: string) {
    console.log(e);
    this.selectedHobbies.push(hobby);
    console.log(this.selectedHobbies);

    e.target.style.backgroundColor = 'red';
  }

  render() {
    return html`
      ${this.renderNotification()}
      <h1>Registrieren</h1>
      <form>
        <label>Vorname:</label>
        <input type="text" id="firstname" required />
        <label>Geschlecht:</label>
        <select id="sex" required>
          <option></option>
          <option value="male">Männlich</option>
          <option value="female">Weiblich</option>
          <option value="diverse">Divers</option>
        </select>
        <label>Email:</label>
        <input type="email" id="email" required />
        <label>Passwort:</label>
        <input type="password" id="password" required />
        <h3>Rate hier dich selbst<h3>
        ${ratings.map(rating => html` <sign-rating left="${rating.left}" right="${rating.right}"></sign-rating>`)}
        <h3>Wähle hier ein paar Hobbys aus</h3>
        ${hobbies.map(
          hobby => html`<div class="pill" @click=${(e: any) => this.selectHobby(e, hobby)}><span>${hobby}</span></div>`
        )}
        <input type="submit" value="Senden" />
      </form>
    `;
  }
}
