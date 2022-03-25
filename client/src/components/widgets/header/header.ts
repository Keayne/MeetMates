/* Autor: Arne Schaper */

import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import componentStyle from './header.css';

@customElement('app-header')
class HeaderComponent extends LitElement {
  static styles = componentStyle;

  render() {
    return html`
      <div class="header">
        <div class="innerHeader">
          <div class="logoContainer">
            <img class="logo" src="/temp_logo.jpg" style="width:50px;height:50px;" />
          </div>
          <ol class="navigation">
            <a><li>Login</li></a>
            <a><li>About</li></a>
          </ol>
        </div>
      </div>
    `;
  }
}
