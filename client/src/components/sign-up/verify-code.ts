/* Autor: Valentin Lieberknecht */

import { LitElement, html } from 'lit';
import { query, customElement } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import { httpClient } from '../../http-client.js';
import { router } from '../../router/router.js';

@customElement('app-verify-code')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class VerifyCodeComponent extends PageMixin(LitElement) {
  @query('form') private form!: HTMLFormElement;
  @query('#code') private codeElement!: HTMLInputElement;

  render() {
    return html`
      ${this.renderNotification()}
      <h1>Verify Code</h1>
      <form>
        <div>
          <label for="code">E-Mail</label>
          <input id="code" type="number" placeholder="Verification Code" autofocus required />
        </div>
        <div>
          <button type="button" @click="${this.submit}">Senden</button>
        </div>
      </form>
    `;
  }

  async submit() {
    if (this.form.checkValidity()) {
      try {
        await httpClient.post('sign-in', this.codeElement.value);
        router.navigate('/mates/sign-in');
      } catch (e) {
        console.log(e);
        this.showNotification((e as Error).message, 'error');
      }
    } else {
      this.form.reportValidity();
    }
  }
}
