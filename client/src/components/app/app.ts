import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { router } from '../../router/router.js';
import { httpClient } from '../../http-client.js';
import componentStyle from './app.css';

@customElement('app-root')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class AppComponent extends LitElement {
  static styles = componentStyle;

  @property() loggedIn = false;
  @state() private headerOptions = [
    { title: 'Register', routePath: 'mates/sign-up' },
    { title: 'Login', routePath: 'mates/sign-in' }
  ];

  @state() private loggedInHeaderOptions = [
    { title: 'Meets', routePath: 'meets' },
    { title: 'Settings', routePath: 'mates/settings' },
    { title: 'Logout', routePath: 'mates/sign-out' }
  ];

  constructor() {
    super();
    const port = 3000;
    httpClient.init({ baseURL: `${location.protocol}//${location.hostname}:${port}/api/` });
  }

  firstUpdated() {
    router.subscribe(() => this.requestUpdate());
  }
  async checkLoggedIn() {
    try {
      const response = await httpClient.get('verify');
      const json = await response.json();
      if (json.login) {
        this.loggedIn = true;
      }
    } catch (error) {
      console.log(error);
    }
  }

  renderRouterOutlet() {
    return router.select(
      {
        // integrate other pages here
        'mates/sign-in': () => html`<app-sign-in></app-sign-in>`,
        'mates/sign-up': () => html`<app-sign-up></app-sign-up>`,
        'mates/sign-out': () => html`<app-sign-out></app-sign-out>`,
        'mates/settings': () => html`<app-settings .comp="edit-profile"></app-settings>`,
        'mates/settings/:comp': params => html`<app-settings .comp=${params.comp}></app-settings>`,
        'mates/reset': () => html`<app-request-password></app-request-password>`,
        'mates/resetpassword/:mateid/:token': params =>
          html`<app-reset-password .mateid=${params.mateid} .token=${params.token}></app-reset-password>`,
        'mates/reset-email': () => html`<app-request-email></app-request-email>`,
        'about': () => html`<app-about></app-about>`,
        'mates/profile/:profileId': params => html`<user-profile .profileId=${params.profileId}></user-profile>`,
        'meets': () => html`<app-meets></app-meets>`,
        'meet/find-activity/:meetId': params => html`<find-activity .meetId=${params.meetId}></find-activity>`,
        'meet/:meetId': params => html` <app-your-meet .meetId=${params.meetId}></app-your-meet>`,
        'chat/:id': params => html`<app-chat .room=${params.id}></app-chat>`,
        'meet': () => html`<app-your-meet></app-your-meet>`
      },
      () => html`<landing-page></landing-page>`
    );
  }

  render() {
    this.checkLoggedIn();
    return html` <app-header
        .headerOptions=${this.loggedIn ? this.loggedInHeaderOptions : this.headerOptions}
      ></app-header>
      <div class="main">${this.renderRouterOutlet()}</div>
      <app-footer></app-footer>`;
  }
}
