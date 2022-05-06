/* Autor: Valentin Lieberknecht */

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import { Message } from './message';
import componentStyle from './chat.css';

@customElement('app-chat')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ChatComponent extends PageMixin(LitElement) {
  static styles = componentStyle;

  @property() private messages: Message[] = [];
  private ws!: WebSocket;

  async firstUpdated() {
    this.ws = new WebSocket('ws://localhost:3000');
    this.ws.onopen = () => {
      console.log('Connection Opened!');
    };
    this.ws.onmessage = ({ data }) =>
      (this.messages = [...this.messages, { own: 'msg-remote', id: 'test', author: 'Valentin', body: data }]);
  }

  async messageSubmit(e: SubmitEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    if (form.message.value) {
      this.ws.send(form.message.value);
      this.messages = [...this.messages, { own: 'msg-self', id: 'test', author: 'Valentin', body: form.message.value }];
      form.message.value = '';
    } else {
      this.showNotification('Nachricht darf nicht leer sein!');
    }
  }

  render() {
    return html`
      ${this.renderNotification()}
      <body>
        <h1>Chat</h1>
        <div class="chat-window">
          ${this.messages.map(
            e => html`<app-chat-message own=${e.own} author=${e.author} body=${e.body}></app-chat-message>`
          )}
        </div>
        <form class="chat-input" @submit="${this.messageSubmit}">
          <input class="chat-window-message" type="text" name="message" placeholder="Ihre Nachricht.." />
          <button type="submit">Send</button>
        </form>
      </body>
    `;
  }
}
