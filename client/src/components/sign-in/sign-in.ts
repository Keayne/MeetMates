/* Autor: Arne Schaper */

import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';

import componentStyle from './sign-in.css';
@customElement('app-sign-in')
class SignInComponent extends PageMixin(LitElement) {
  static styles = componentStyle;
  render() {
    return html`
      ${this.renderNotification()}
      <h1>Anmelden</h1>
      <h3>Du hast noch kein Konto? Hier Registrieren</h3>
      <!--Hier Link zu RegPage-->

      <!--Login Form-->
      <form>
        <div>
          <input id="email" type="email" autofocus required />
        </div>
        <div>
          <input type="password" required />
        </div>
        <div>
          <button type="button">Anmelden</button>
          <!-- TODO -->
        </div>
      </form>
    `;
  }
  //TODO -> Submit function for form, validation, rework html form
}
