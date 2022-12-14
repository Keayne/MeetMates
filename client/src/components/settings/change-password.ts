/* Autor: Valentin Lieberknecht */

import { LitElement, html } from 'lit';
import { query, customElement, state } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import { httpClient } from '../../http-client.js';
import { router } from '../../router/router.js';
import componentStyle from './forms.css';

@customElement('app-change-password')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ResetPasswordComponent extends PageMixin(LitElement) {
  static styles = componentStyle;

  @query('form') private form!: HTMLFormElement;
  @query('#currentPassword') private currentPasswordElement!: HTMLInputElement;
  @query('#password') private passwordElement!: HTMLInputElement;
  @query('#passwordCheck') private passwordCheckElement!: HTMLInputElement;

  @state() private passwordMessage!: string;
  @state() private passwordCheckMessage!: string;
  regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*#?&-_=()]{8,}$/;

  render() {
    return html`
      ${this.renderNotification()}
      <form>
        <h1>Change Password</h1>
        <div>
          <label>Current Password:</label>
          <input type="password" id="currentPassword" required />
          <br />
          <label>Password:</label>
          <input type="password" id="password" @keyup="${this.checkPassword}" required />
          <span>${this.passwordMessage}</span>
          <br />
          <label>Password Check:</label>
          <input type="password" @keyup="${this.checkCheckPassword}" id="passwordCheck" required />
          <span>${this.passwordCheckMessage}</span>
        </div>
        <br />
        <div>
          <button type="button" @click="${this.submit}">Send</button>
        </div>
      </form>
    `;
  }

  async submit() {
    if (this.form.checkValidity()) {
      if (this.regex.test(this.passwordElement.value)) {
        if (this.passwordElement.value === this.passwordCheckElement.value) {
          try {
            const response = await httpClient.patch('changepassword', {
              currentPassword: this.currentPasswordElement.value,
              password: this.passwordElement.value
            });
            const json = await response.json();
            this.showNotification(json.message, 'info');
            setTimeout(() => router.navigate('/meets'), 1500);
          } catch (e) {
            this.currentPasswordElement.value = '';
            this.passwordElement.value = '';
            this.passwordCheckElement.value = '';
            this.passwordMessage = '';
            this.passwordCheckMessage = '';
            this.showNotification((e as Error).message, 'error');
          }
        } else {
          this.showNotification('Password does not match.', 'error');
        }
      } else {
        this.showNotification('Password does not meet requirements.', 'error');
      }
    } else {
      this.form.reportValidity();
    }
  }

  checkPassword() {
    if (!this.regex.test(this.passwordElement.value)) {
      this.passwordMessage =
        'Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more, no withespaces';
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
