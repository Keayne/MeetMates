/* Autor: Arne Schaper */

import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import componentStyle from './landing-page.css';

@customElement('landing-page')
class SignInComponent extends PageMixin(LitElement) {
  static styles = componentStyle;
  render() {
    return html`
      ${this.renderNotification()}
      <h1>Hello</h1>
    `;
  }
}
