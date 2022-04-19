/* Autor: Jonathan Hüls */
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import componentStyle from './meet.css';

@customElement('meets-meet')
class MeetsMeetComponent extends PageMixin(LitElement) {
  static styles = componentStyle;

  @property({ type: String }) id = '';
  @property({ type: String }) name = '';
  @property({ type: JSON }) users = [];

  render() {
    return html`<div class="meet" onclick="location.href='meet/${this.id}'">
      <h2 class="name">${this.name}</h2>
      <div>
        <user-icon src="/favicon.png"></user-icon>
        <user-icon></user-icon>
        <user-icon></user-icon>
        <user-icon></user-icon>
      </div>
    </div>`;
  }
}
