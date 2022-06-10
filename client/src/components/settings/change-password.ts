/* Autor: Valentin Lieberknecht */

import { LitElement, html, css } from 'lit';
import { query, customElement, state } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import { httpClient } from '../../http-client.js';
import { router } from '../../router/router.js';

@customElement('app-change-password')
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
  `;

  @query('form') private form!: HTMLFormElement;
  @query('#currentPassword') private currentPasswordElement!: HTMLInputElement;
  @query('#password') private passwordElement!: HTMLInputElement;
  @query('#password-check') private passwordCheckElement!: HTMLInputElement;

  @state() private passwordMessage!: string;
  @state() private passwordCheckMessage!: string;

  render() {
    return html`
      ${this.renderNotification()}
      <h1>Change Password</h1>
      <form>
        <div>
          <label>Current Password:</label>
          <input type="password" id="currentPassword" required />
          <br />
          <label>Password:</label>
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
        <br />
        <div>
          <button type="button" @click="${this.submit}">Send</button>
        </div>
      </form>
    `;
  }

  submit() {
    if (this.form.checkValidity()) {
      if (this.passwordElement.value === this.passwordCheckElement.value) {
        try {
          httpClient.patch('changepassword', {
            currentPassword: this.currentPasswordElement.value,
            password: this.passwordElement.value
          });
          router.navigate('/meets');
        } catch (e) {
          console.log(e);
          this.showNotification((e as Error).message, 'error');
        }
      } else {
        alert('Password does not match!');
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
