/* Autor: Jonathan Hüls */
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import componentStyle from './userIcon.css';

interface Mate {
  id: string;
  name: string;
  firstName: string;
  src: string;
}
@customElement('meets-mate-icon')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class UserIconComponent extends PageMixin(LitElement) {
  static styles = componentStyle;
  @property({ reflect: true }) mate = {} as Mate;

  render() {
    return html`<img src="${this.mate.src}" alt="${this.mate.firstName.charAt(0)}.${this.mate.name.charAt(0)} " />`;
  }
}
