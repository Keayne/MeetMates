import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { router } from '../../router/router.js';
import { httpClient } from '../../http-client.js';
import { EventEmitter } from 'events';

@customElement('app-root')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class AppComponent extends LitElement {
  @state() private headerOptions = [
    { title: 'Register', routePath: 'mates/sign-up' },
    { title: 'Login', routePath: 'mates/sign-in' }
  ];

  constructor() {
    super();
    const port = 3000;
    httpClient.init({ baseURL: `${location.protocol}//${location.hostname}:${port}/api/` });
  }

  firstUpdated() {
    router.subscribe(() => this.requestUpdate());
  }

  @state() private loggedInHeaderOptions = [
    { title: 'Meets', routePath: 'meets' },
    { title: 'About Us', routePath: 'about' }
  ];

  renderRouterOutlet() {
    return router.select(
      {
        // integrate other pages here
        'mates/sign-in': () => html`<app-sign-in></app-sign-in>`,
        'mates/sign-up': () => html`<app-sign-up></app-sign-up>`,
        'mates/profile': () => html`<user-profile></user-profile>`,
        'about': () => html`<app-about></app-about>`,
        'meets': () => html`<app-meets></app-meets>`,
        'meet': () => html`<app-your-meet></app-your-meet>`,
        'chat': () => html`<app-chat></app-chat>`
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

  renderWhileLoggedIn() {
    return html` <app-header .headerOptions=${this.loggedInHeaderOptions}></app-header>
      <div class="main">${this.renderRouterOutlet()}</div>
      <app-footer></app-footer>`;
  }
}
