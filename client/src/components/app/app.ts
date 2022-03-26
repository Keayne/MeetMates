/* Autor: Arne Schaper */
/* Autor: Valentin Lieberknecht */

import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { httpClient } from '../../http-client.js';
import { router } from '../../router/router.js';

@customElement('app-root')
class AppComponent extends LitElement {
  firstUpdated() {
    router.subscribe(() => this.requestUpdate());
  }

  renderRouterOutlet() {
    return router.select(
      {
        // integrate other pages here
        'users/sign-in': () => html`<app-sign-in></app-sign-in>`,
        'users/sign-up': () => html`<app-sign-up></app-sign-up>`,
        'about': () => html`<app-about></app-about>`
      },
      () => html`<main></main>`
    );
  }

  render() {
    return html` <app-header></app-header>
      <div class="main">${this.renderRouterOutlet()}</div>
      <app-footer></app-footer>`;
  }
}
