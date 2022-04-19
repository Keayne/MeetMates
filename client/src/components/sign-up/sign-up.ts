/* Autor: Valentin Lieberknecht */

import { LitElement, html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import { httpClient } from '../../http-client.js';
import { router } from '../../router/router.js';
import componentStyle from './sign-up.css';
import hobbies from './hobbies.json';
import ratings from './ratings.json';

@customElement('app-sign-up')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class SignUpComponent extends PageMixin(LitElement) {
  static styles = componentStyle;

  @query('form') private form!: HTMLFormElement;
  @query('#name') private nameElement!: HTMLInputElement;
  @query('#firstname') private firstnameElement!: HTMLInputElement;
  @query('#email') private emailElement!: HTMLInputElement;
  @query('#birthday') private birthdayElement!: HTMLInputElement;
  @query('#gender') private genderElement!: HTMLInputElement;
  @query('#password') private passwordElement!: HTMLInputElement;

  selectedHobbies: string[] = [];

  selectHobby(e: any, hobby: string) {
    const index = this.selectedHobbies.indexOf(hobby);
    if (index == -1) {
      this.selectedHobbies.push(hobby);
      e.currentTarget.style.backgroundColor = '#04204a';
    } else {
      this.selectedHobbies.splice(index, 1);
      e.currentTarget.style.backgroundColor = '#eee';
    }
  }

  submit() {
    console.log('test' + this.form.checkValidity());

    if (this.form.checkValidity()) {
      const accountData = {
        name: this.nameElement.value,
        firstname: this.firstnameElement.value,
        email: this.emailElement.value,
        birthday: this.birthdayElement.value,
        gender: this.genderElement.value,
        password: this.passwordElement.value
      };
      try {
        httpClient.post('users', accountData);
        router.navigate('/');
      } catch (e) {
        this.showNotification((e as Error).message, 'error');
      }
    } else {
      this.form.reportValidity();
    }
  }

  render() {
    return html`
      ${this.renderNotification()}
      <h1>Registrieren</h1>
      <form>
        <label>Vorname:</label>
        <input type="text" id="firstname" required />
        <label>Nachname:</label>
        <input type="text" id="name" required />
        <label>Geschlecht:</label>
        <select id="gender" required>
          <option></option>
          <option value="male">Männlich</option>
          <option value="female">Weiblich</option>
          <option value="diverse">Divers</option>
        </select>
        <label>Geburtstag:</label>
        <input type="date" id="birthday" required>
        <label>Email:</label>
        <input type="email" id="email" required />
        <label>Passwort:</label>
        <input type="password" id="password" required />
        <h3>Rate hier dich selbst<h3>
        ${ratings.map(rating => html` <sign-slider left="${rating.left}" right="${rating.right}"></sign-slider>`)}
        <h3>Wähle hier ein paar Hobbys aus</h3>
        ${hobbies.map(
          hobby => html`<div class="pill" @click=${(e: any) => this.selectHobby(e, hobby)}><span>${hobby}</span></div>`
        )}
        <br>
        <button type="button" @click="${this.submit}" >Konto erstellen</button>
      </form>
    `;
  }
}
