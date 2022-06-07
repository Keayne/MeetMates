/* Autor: Arne Schaper */

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import componentStyle from './header.css';

@customElement('app-header')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class HeaderComponent extends LitElement {
  static styles = componentStyle;

  @property({ type: Array }) headerOptions: Array<{ title: string; routePath: string }> = [];

  render() {
    return html`
      <div class="header">
        <div class="innerHeader">
          <div class="logoContainer">
            <a href="/">
              <img class="logo" src="meetmates.png" style="width:50px;height:50px;" />
            </a>
          </div>
          <ol class="navigation">
            ${this.headerOptions.map(linkItem => html`<li><a href="${linkItem.routePath}">${linkItem.title}</a></li>`)}
          </ol>
        </div>
      </div>
    `;
  }
}
