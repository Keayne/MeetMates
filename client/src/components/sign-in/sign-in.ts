/* Autor: Arne Schaper */

import { LitElement, html } from 'lit';
import { query, customElement } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import componentStyle from './sign-in.css';
import { httpClient } from '../../http-client.js';
import { router } from '../../router/router.js';

@customElement('app-sign-in')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class SignInComponent extends PageMixin(LitElement) {
  static styles = componentStyle;

  @query('form') private form!: HTMLFormElement;

  @query('#email') private emailElement!: HTMLInputElement;

  @query('#password') private passwordElement!: HTMLInputElement;

  render() {
    return html`
      ${this.renderNotification()}
      <h1>Anmelden</h1>
      <h3>Du hast noch kein Konto? <a href="mates/sign-up">Hier Registrieren</a></h3>

      <!--Login Form-->
      <form>
        <div>
          <label for="email">E-Mail</label>
          <input
            id="email"
            type="email"
            placeholder="E-Mail"
            value="arne.schaper@online.de"
            autofocus
            required
            id="email"
          />
        </div>
        <div>
          <label for="password">Passwort</label>
          <input type="password" placeholder="Passwort" value="123456789" required id="password" />
        </div>
        <div>
          <button type="button" @click="${this.submit}">Anmelden</button>
        </div>
      </form>
    `;
  }

  async submit() {
    if (this.isFormValid()) {
      const authData = {
        email: this.emailElement.value,
        password: this.passwordElement.value
      };
      try {
        await httpClient.post('/mates/sign-in', authData);
        router.navigate('/meets'); //link to your meets after login
      } catch (e) {
        console.log(e);
        this.showNotification((e as Error).message, 'error');
      }
    } else {
      this.form.classList.add('was-validated');
    }
  }

  isFormValid() {
    console.log('isFormValid Method');
    return this.form.checkValidity();
  }
}
