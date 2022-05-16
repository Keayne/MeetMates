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

  @state() private loggedInHeaderOptions = [
    { title: 'Meets', routePath: 'meets' },
    { title: 'Profil', routePath: 'mates/profile' },
    { title: 'Activity', routePath: 'meet/find-activity' }
  ];

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
        'mates/sign-in': () =>
          html`<app-header .headerOptions=${this.headerOptions}></app-header><app-sign-in></app-sign-in>`,
        'mates/sign-up': () =>
          html`<app-header .headerOptions=${this.headerOptions}></app-header><app-sign-up></app-sign-up>`,
        'about': () => html`<app-header .headerOptions=${this.headerOptions}></app-header><app-about></app-about>`,
        'mates/profile': () =>
          html`<app-header .headerOptions=${this.loggedInHeaderOptions}></app-header><user-profile></user-profile>`,
        'meets': () =>
          html`<app-header .headerOptions=${this.loggedInHeaderOptions}></app-header><app-meets></app-meets>`,
        'meet/find-activity': () =>
          html`<app-header .headerOptions=${this.loggedInHeaderOptions}></app-header><find-activity></find-activity>`,
        'meet/:meetId': params =>
          html`<app-header .headerOptions=${this.loggedInHeaderOptions}></app-header>
            <app-your-meet .meetId=${params.meetId}></app-your-meet>`,
        'chat': () => html`<app-header .headerOptions=${this.loggedInHeaderOptions}></app-header><app-chat></app-chat>`,
        'meet': () =>
          html`<app-header .headerOptions=${this.loggedInHeaderOptions}></app-header><app-your-meet></app-your-meet>`
      },
      () => html`<app-header .headerOptions=${this.loggedInHeaderOptions}></app-header><landing-page></landing-page>`
    );
  }

  render() {
    return html` <div class="main">${this.renderRouterOutlet()}</div>
      <app-footer></app-footer>`;
  }
}
