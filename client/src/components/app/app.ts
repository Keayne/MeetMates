/* Autor: Arne Schaper */
/* Autor: Valentin Lieberknecht */

import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { httpClient } from '../../http-client.js';
import { router } from '../../router/router.js';

@customElement('app-root')
class AppComponent extends LitElement {
  @state() private linkItems = [
    { title: 'Konto erstellen', routePath: 'users/sign-up' },
    { title: 'Anmelden', routePath: 'users/sign-in' },
    { title: 'Abmelden', routePath: 'users/sign-out' },
    { title: 'Über', routePath: 'about' }
  ];

  firstUpdated() {
    router.subscribe(() => this.requestUpdate());
  }

  renderRouterOutlet() {
    return router.select(
      {
        // integrate other pages here
        'users/sign-in': () => html`<app-sign-in></app-sign-in>`,
        'about': () => html`<app-about></app-about>`
      },
      () => html`<main></main>`
    );
  }

  render() {
    return html` <app-header .linkItems=${this.linkItems}></app-header>
      <div class="main">${this.renderRouterOutlet()}</div>
      <app-footer .linkItems=${this.linkItems}></app-footer>`;
  }
}
