import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { router } from '../../router/router.js';
import { httpClient } from '../../http-client.js';

@customElement('app-root')
class AppComponent extends LitElement {
  constructor() {
    super();
    const port = 3000;
    httpClient.init({ baseURL: `${location.protocol}//${location.hostname}:${port}/api/` });
  }

  firstUpdated() {
    router.subscribe(() => this.requestUpdate());
  }

  renderRouterOutlet() {
    return router.select(
      {
        // integrate other pages here
        'users/sign-in': () => html`<app-sign-in></app-sign-in>`,
        'users/sign-up': () => html`<app-sign-up></app-sign-up>`,
        'about': () => html`<app-about></app-about>`,
        'meets': () => html`<app-meets></app-meets>`
      },
      () => html`<landing-page></landing-page>`
    );
  }

  render() {
    return html` <app-header></app-header>
      <div class="main">${this.renderRouterOutlet()}</div>
      <app-footer></app-footer>`;
  }
}
