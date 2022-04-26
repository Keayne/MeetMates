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

  @state() private headerOptions = [
    { title: 'Register', routePath: 'users/sign-up' },
    { title: 'Login', routePath: 'users/sign-in' }
  ];

  renderRouterOutlet() {
    return router.select(
      {
        // integrate other pages here
        'users/sign-in': () => html`<app-sign-in></app-sign-in>`,
        'users/sign-up': () => html`<app-sign-up></app-sign-up>`,
        'about': () => html`<app-about></app-about>`,
        'meets': () => html`<app-meets></app-meets>`,
        'meet': () => html`<app-your-meet></app-your-meet>`
      },
      () => html`<landing-page></landing-page>`
    );
  }

  //TODO: Render a different header if we are logged in or make sure that we do render additional elements
  render() {
    return html` <app-header .headerOptions=${this.headerOptions}></app-header>
      <div class="main">${this.renderRouterOutlet()}</div>
      <app-footer></app-footer>`;
  }
}
