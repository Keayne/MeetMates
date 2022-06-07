/* Autor: Valentin Lieberknecht */

import { LitElement, html, css } from 'lit';
import { query, customElement, state, property } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import { httpClient } from '../../http-client.js';
import { router } from '../../router/router.js';

@customElement('app-reset-password')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ResetPasswordComponent extends PageMixin(LitElement) {
  static styles = css`
    form {
      max-width: 600px;
      margin: 30px auto;
      background: white;
      text-align: left;
      border-radius: 10px;
    }
    label {
      width: 10em;
      display: inline-block;
    }
  `;
  @property() private mateid!: string;
  @property() private token!: string;

  @query('form') private form!: HTMLFormElement;
  @query('#password') private passwordElement!: HTMLInputElement;
  @query('#password-check') private passwordCheckElement!: HTMLInputElement;

  @state() private passwordMessage!: string;
  @state() private passwordCheckMessage!: string;

  render() {
    return html`
      ${this.renderNotification()}
      <form>
        <h1>Reset Password</h1>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            id="password"
            @keyup="${this.checkPassword}"
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$"
            required
          />
          <span>${this.passwordMessage}</span>
          <br />
          <label>Password Check:</label>
          <input type="password" @keyup="${this.checkCheckPassword}" id="password-check" required />
          <span>${this.passwordCheckMessage}</span>
        </div>
        <div>
          <button type="button" @click="${this.submit}">Senden</button>
        </div>
      </form>
    `;
  }

  submit() {
    if (this.form.checkValidity()) {
      try {
        httpClient.patch('resetpassword', {
          id: this.mateid,
          token: this.token,
          password: this.passwordElement.value,
          checkPassword: this.passwordCheckElement.value
        });
        router.navigate('/meets');
      } catch (e) {
        console.log(e);
        this.showNotification((e as Error).message, 'error');
      }
    } else {
      this.form.reportValidity();
    }
  }

  checkPassword() {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*#?&-_=()]{8,}$/gm;
    if (!regex.test(this.passwordElement.value)) {
      this.passwordMessage =
        'Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters';
    } else {
      this.passwordMessage = 'good password!';
    }
    this.checkCheckPassword();
  }

  checkCheckPassword() {
    if (this.passwordElement.value !== this.passwordCheckElement.value) {
      this.passwordCheckMessage = 'does not match';
    } else {
      this.passwordCheckMessage = 'matching';
    }
  }
}
