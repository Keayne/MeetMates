/* Autor: Valentin Lieberknecht */

import { LitElement, html, css } from 'lit';
import { query, customElement } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import { httpClient } from '../../http-client.js';
import { router } from '../../router/router.js';

@customElement('app-request-password')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class RequestPasswordReset extends PageMixin(LitElement) {
  static styles = css`
    form {
      max-width: 600px;
      margin: 30px auto;
      background: white;
      text-align: left;
      border-radius: 10px;
    }
  `;
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
          <button type="button" @click="${this.submit}">Senden</button>
        </div>
      </form>
    `;
  }

  async submit() {
    if (this.form.checkValidity()) {
      try {
        const response = await httpClient.get('resetpassword/' + this.emailElement.value);
        if (response.status === 200) {
          router.navigate('/meets');
        } else {
          this.showNotification(await response.json());
        }
      } catch (e) {
        console.log(e);
        this.showNotification((e as Error).message, 'error');
      }
    } else {
      this.form.classList.add('was-validated');
    }
  }
}
