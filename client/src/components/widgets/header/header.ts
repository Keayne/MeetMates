/* Autor: Arne Schaper */

import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import componentStyle from './header.css';

@customElement('app-header')
class HeaderComponent extends LitElement {
  static styles = componentStyle;

  render() {
    return html`
      <p>Placeholder</p>
      <span class="logo">Logo Placeholder</span>
    `;
  }
}
