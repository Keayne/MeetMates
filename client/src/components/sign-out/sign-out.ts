/* Autor: Valentin Lieberknecht */

import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import { httpClient } from '../../http-client.js';

@customElement('app-logout')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class LogoutComponent extends PageMixin(LitElement) {
  render() {
    return html` ${this.renderNotification()} `;
  }

  async firstUpdated() {
    try {
      await httpClient.delete('/mates/sign-out');
      this.showNotification('Sie wurden erfolgreich abgemeldet!');
    } catch (e) {
      this.showNotification((e as Error).message, 'error');
    }
  }
}
