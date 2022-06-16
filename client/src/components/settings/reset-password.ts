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
    label {
      width: 10em;
      display: inline-block;
    }
    form {
      max-width: 600px;
      text-align: left;
      margin: 30px auto;
    }
    label {
      color: rgb(104, 103, 103);
      display: inline-block;
      margin: 10px 0 15px;
      font-size: 0.7em;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: bold;
    }
    input {
      display: block;
      padding: 10px 6px;
      width: 100%;
      box-sizing: border-box;
      border: none;
      border-bottom: 1px solid rgb(168, 168, 168);
      color: #555;
    }
    button {
      margin-top: 5%;
      width: 100%;
      border: none;
      outline: none;
      padding: 12px 16px;
      background-color: #f1f1f1;
      cursor: pointer;
      border-radius: 8px;
    }
  `;
  @property() private mateid!: string;
  @property() private token!: string;

  @query('form') private form!: HTMLFormElement;
  @query('#password') private passwordElement!: HTMLInputElement;
  @query('#password-check') private passwordCheckElement!: HTMLInputElement;

  @state() private passwordMessage!: string;
  @state() private passwordCheckMessage!: string;
  regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*#?&-_=()]{8,}$/gm;

  render() {
    return html`
      ${this.renderNotification()}
      <form>
        <h1>Reset Password</h1>
        <div>
          <label>New Password:</label>
          <input type="password" id="password" @keyup="${this.checkPassword}" required />
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

  async submit() {
    if (this.form.checkValidity()) {
      if (!this.regex.test(this.passwordElement.value)) {
        if (this.passwordElement.value === this.passwordCheckElement.value) {
          try {
            const response = await httpClient.patch('resetpassword', {
              id: this.mateid,
              token: this.token,
              password: this.passwordElement.value,
              checkPassword: this.passwordCheckElement.value
            });
            const json = await response.json();
            router.navigate('/meets');
            this.showNotification(json.message, 'info');
          } catch (e) {
            console.log(e);
            this.showNotification((e as Error).message, 'error');
          }
        } else {
          this.showNotification('Password does not match!');
        }
      } else {
        this.showNotification('Password does not meet requeirements!', 'error');
      }
    } else {
      this.form.reportValidity();
    }
  }

  checkPassword() {
    if (!this.regex.test(this.passwordElement.value)) {
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
