/* Autor: Valentin Lieberknecht */

import { LitElement, html, css } from 'lit';
import { query, customElement, property } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import { httpClient } from '../../http-client.js';
import { router } from '../../router/router.js';

@customElement('app-verify-code')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class VerifyCodeComponent extends PageMixin(LitElement) {
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
  @property() id!: string;
  @query('form') private form!: HTMLFormElement;
  @query('#code') private codeElement!: HTMLInputElement;

  render() {
    return html`
      ${this.renderNotification()}
      <form>
        <h1>Verify Code</h1>
        <div>
          <label for="code">Verification Code</label>
          <input id="code" type="number" placeholder="Verification Code" autofocus required />
        </div>
        <div>
          <button type="button" @click="${this.submit}">Send</button>
        </div>
      </form>
    `;
  }

  async submit() {
    if (this.form.checkValidity()) {
      try {
        const response = await httpClient.patch('confirmcode', {
          id: this.id,
          code: this.codeElement.value
        });
        const json = await response.json();
        this.showNotification(json.message, 'info');
        setTimeout(() => router.navigate('/meets'), 1500);
      } catch (e) {
        this.showNotification((e as Error).message, 'error');
      }
    } else {
      this.form.reportValidity();
    }
  }
}
