/* Autor: Jonathan Hüls */
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import componentStyle from './meetingUser.css';

@customElement('meet-user')
class MeetUserComponent extends PageMixin(LitElement) {
  static styles = componentStyle;

  @property({ type: String }) userId = '';
  @property({ type: String }) firstname = 'Max';
  @property({ type: String }) name = 'Mustermann';
  @property({ type: String }) age = '21';
  @property({ type: String }) imgSrc = './temp_logo.jpg';

  render() {
    return html`<div class="meetingUser">
      <img src=${this.imgSrc} />
      <h3>${this.name}, ${this.firstname}</h3>
      <h3>${this.age}</h3>
    </div>`;
  }
}
