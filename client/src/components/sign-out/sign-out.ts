/* Autor: Valentin Lieberknecht */

import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import { httpClient } from '../../http-client.js';
import { router } from '../../router/router';

@customElement('app-sign-out')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class LogoutComponent extends PageMixin(LitElement) {
  render() {
    return html` ${this.renderNotification()} `;
  }

  async firstUpdated() {
    try {
      await httpClient.delete('/sign-out');
      this.showNotification('Sie wurden erfolgreich abgemeldet!');
      router.navigate('/');
      location.reload();
    } catch (e) {
      this.showNotification((e as Error).message, 'error');
    }
  }
}
