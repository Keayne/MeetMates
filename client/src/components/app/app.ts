/* Autor: Arne Schaper */

import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { httpClient } from '../../http-client.js';
import { router } from '../../router/router.js';

@customElement('app-root')
class AppComponent extends LitElement {
  constructor() {
    super();
  }

  render() {
    return html`
      <app-header></app-header>
      <app-sign-in></app-sign-in>
    `;
  }

  /** Arne
  renderRouterOutlet() {
    return router.select(
      {
        // integrate other pages here
        'users/sign-in': () => html`<app-sign-in></app-sign-in>`
      },
      () => html`<app-sign-in></app-sign-in>` //this should, by default, link to landing/meetmates main page
    );
  }
  */
}
