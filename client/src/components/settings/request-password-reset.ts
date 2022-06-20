/* Autor: Valentin Lieberknecht */

import { LitElement, html } from 'lit';
import { query, customElement } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import { httpClient } from '../../http-client.js';
import { router } from '../../router/router.js';
import componentStyle from './forms.css';

@customElement('app-request-password')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class RequestPasswordReset extends PageMixin(LitElement) {
  static styles = componentStyle;

  @query('form') private form!: HTMLFormElement;
  @query('#email') private emailElement!: HTMLInputElement;

  render() {
    return html`
      ${this.renderNotification()}
      <form>
        <h1>Reset Password</h1>
        <div>
          <label>Your E-Mail Address: </label>
          <input type="email" id="email" required />
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
      try {
        const response = await httpClient.get('resetpassword/' + this.emailElement.value);
        const json = await response.json();
        this.showNotification(json.message, 'info');
        setTimeout(() => router.navigate('/meets'), 1500);
      } catch (e) {
        console.log(e);
        this.showNotification((e as Error).message, 'error');
      }
    } else {
      this.form.reportValidity();
    }
  }
}
