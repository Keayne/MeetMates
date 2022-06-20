/* Autor: Valentin Lieberknecht */

import { LitElement, html } from 'lit';
import { query, customElement, state } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import { httpClient } from '../../http-client.js';
import { router } from '../../router/router.js';
import componentStyle from './forms.css';

@customElement('app-change-email')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ChangeEmailComponent extends PageMixin(LitElement) {
  static styles = componentStyle;

  @query('form') private form!: HTMLFormElement;
  @query('#email') private emailElement!: HTMLInputElement;

  @state() private email!: string;

  async firstUpdated() {
    try {
      const response = await httpClient.get('/currentemail');
      const json = await response.json();
      this.email = json.email;
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return html`
      ${this.renderNotification()}
      <form>
        <h1>Change E-Mail</h1>
        <p>Current E-Mail: ${this.email}</p>
        <div>
          <label>New E-Mail:</label>
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
        const response = await httpClient.patch('changeemail', {
          email: this.emailElement.value
        });
        const json = await response.json();
        this.showNotification(json.message, 'info');
        setTimeout(() => router.navigate('/mates/verify-code/' + json.id));
      } catch (e) {
        console.log(e);
        this.showNotification((e as Error).message, 'error');
      }
    } else {
      this.form.reportValidity();
    }
  }
}
