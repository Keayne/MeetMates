/* Autor: Valentin Lieberknecht */

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import componentStyle from './chat.css';

@customElement('app-chat-message')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ChatMessageComponent extends PageMixin(LitElement) {
  static styles = componentStyle;
  @property({ type: String }) own = '';
  @property({ type: String }) author = '';
  @property({ type: String }) body = '';

  render() {
    return html` <div class="msg-container ${this.own}">
      <div class="msg-box">
        <div class="flr">
          <p class="msg">${this.body}</p>
          <span class="timestamp"
            ><span class="username">${this.author}</span> &bull;<span class="posttime">a frew seconds ago</span></span
          >
        </div>
      </div>
    </div>`;
  }
}
