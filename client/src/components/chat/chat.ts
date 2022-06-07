/* Autor: Valentin Lieberknecht */

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import { Message } from './message';
import componentStyle from './chat.css';
import { httpClient } from '../../http-client';

@customElement('app-chat')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ChatComponent extends PageMixin(LitElement) {
  static styles = componentStyle;

  @property() private messages: Message[] = [];
  @property() private room!: string;
  private ws!: WebSocket;

  async firstUpdated() {
    this.ws = new WebSocket('ws://localhost:3000/' + this.room);
    this.ws.onopen = () => {
      console.log('Connection Opened!');
    };
    const messages = await httpClient.get('/chat/messages/' + this.room);
    this.messages = await messages.json();
    scrollTo(0, document.body.scrollHeight);

    this.ws.onmessage = async () => {
      const messages = await httpClient.get('/chat/messages/' + this.room);
      this.messages = await messages.json();
    };
  }

  async messageSubmit(e: SubmitEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    if (form.message.value) {
      this.ws.send(this.room);
      try {
        httpClient.post('chat', {
          room: this.room,
          body: form.message.value
        });
      } catch (e) {
        this.showNotification((e as Error).message, 'error');
      }
      form.message.value = '';
      const messages = await httpClient.get('/chat/messages/' + this.room);
      this.messages = await messages.json();
    } else {
      this.showNotification('Nachricht darf nicht leer sein!');
    }
  }

  render() {
    return html`
      ${this.renderNotification()}
      <body>
        <div class="chat-window">
          ${this.messages.map(
            e =>
              html`<app-chat-message
                own=${e.own}
                author=${e.author}
                posttime=${e.posttime}
                body=${e.body}
              ></app-chat-message>`
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
