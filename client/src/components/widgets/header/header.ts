/* Autor: Arne Schaper */

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import componentStyle from './header.css';

@customElement('app-header')
class HeaderComponent extends LitElement {
  static styles = componentStyle;

  @property({ type: Array }) linkItems: Array<{ title: string; routePath: string }> = [];

  render() {
    return html`
      <div class="header">
        <div class="innerHeader">
          <div class="logoContainer">
            <img class="logo" src="/temp_logo.jpg" style="width:50px;height:50px;" />
          </div>
          <ol class="navigation">
            <li><a href="${this.linkItems[1].routePath}">Login</a></li>
          </ol>
        </div>
      </div>
    `;
  }
}
