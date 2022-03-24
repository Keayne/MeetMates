/* Autor: TODO */

import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { router } from '../../router/router.js';

@customElement('app-root')
class AppComponent extends LitElement {
  render() {
    return html`<app-sign-in></app-sign-in>`;
  }
  /** 
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
