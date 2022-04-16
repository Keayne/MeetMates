/* Autor: Valentin Lieberknecht */

import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import componentStyle from './user-profile.css';

@customElement('app-user-profile')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class AboutComponent extends PageMixin(LitElement) {
  static styles = componentStyle;

  render() {
    return html`${this.renderNotification()}
      <h1>User Profile</h1>`;
  }
}
