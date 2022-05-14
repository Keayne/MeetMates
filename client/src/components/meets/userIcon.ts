/* Autor: Jonathan Hüls */
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import componentStyle from './userIcon.css';

@customElement('user-icon')
class UserIconComponent extends PageMixin(LitElement) {
  static styles = componentStyle;
  @property({ type: String }) src = '/temp_logo.jpg';
  @property({ type: String }) name = '';
  @property({ type: String }) firstName = '';

  render() {
    return html`<img src="${this.src}" alt="${this.firstName.charAt(0)}.${this.name.charAt(0)}" />`;
  }
}
//<img src="img_girl.jpg" alt="Girl in a jacket" width="500" height="600">
