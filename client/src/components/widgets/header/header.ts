/* Autor: Arne Schaper */

import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { router } from '../../../router/router';

import componentStyle from './header.css';

@customElement('app-header')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class HeaderComponent extends LitElement {
  static styles = componentStyle;

  @property({ type: Array }) headerOptions: Array<{ title: string; routePath: string }> = [];
  @state() menuOpen = false;

  openMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  render() {
    return html`
      <img class="logo" src="meetmates.png" style="width:50px;height:50px;" @click=${() => this.routeToLandingpage()} />
      <span class="menu-button" @click="${this.openMenu}"></span>
      <ol ?open=${this.menuOpen}>
        ${this.headerOptions.map(
          linkItem => html`<li><a href="${linkItem.routePath}" @click=${this.closeMenu}>${linkItem.title}</a></li>`
        )}
      </ol>
    `;
  }

  async routeToLandingpage() {
    router.navigate('');
  }
}
