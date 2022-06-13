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
      <h1>Login</h1>
      <h3>Don't have an account? <a href="mates/sign-up">Sign up here</a></h3>

      <!--Login Form-->
      <form>
        <div id="emaildiv">
          <label for="email">E-Mail</label>
          <br />
          <input id="email" type="email" placeholder="E-Mail" autofocus required id="email" />
        </div>

        <div id="pwdiv">
          <label for="password">Password</label>
          <br />
          <input type="password" placeholder="Password" required id="password" />
          <!-- TODO: remove autofillbehaviour from browser-->
        </div>
        <div id="submitdiv">
          <button type="button" @click="${this.submit}">Login</button>
        </div>
        <div>
          <p>Forgot your password?</p>
          <p>Click <a href="mates/reset">here</a>!</p>
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
        await httpClient.post('sign-in', authData);
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
    return this.form.checkValidity();
  }
}
