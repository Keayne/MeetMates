/* Autor: Jonathan Hüls */
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import componentStyle from './meetChatMessage.css';

@customElement('meet-chatmassage')
class MeetChatMessageComponent extends PageMixin(LitElement) {
  static styles = componentStyle;
  @property({ type: String }) ownMessage = 'false';
  @property({ type: String }) message = '...';
  @property({ type: String }) from = 'User';

  render() {
    return html`<div class="message" ownMessage="${this.ownMessage}">
      <div class="messageHeader">${this.from}</div>
      <div class="messageContent">${this.message}</div>
    </div>`;
  }
}
