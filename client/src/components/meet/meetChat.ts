/* Autor: Jonathan Hüls */
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import componentStyle from './meetChat.css';

@customElement('meet-chat')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class MeetChatComponent extends PageMixin(LitElement) {
  static styles = componentStyle;

  render() {
    return html`<div class="meetingChat">
        <meet-chatmassage></meet-chatmassage>
        <meet-chatmassage ownMessage="true" message="eeeeooo"></meet-chatmassage>
        <meet-chatmassage ownMessage="false" message="lululul"></meet-chatmassage>
        <meet-chatmassage ownMessage="false" message="eeeeooo"></meet-chatmassage>
        <meet-chatmassage ownMessage="true" message="kekekekeke"></meet-chatmassage>
        <meet-chatmassage ownMessage="false" message="hehohooooooo000000000"></meet-chatmassage>
      </div>
      <div class="chatInput">
        <input type="text" placeholder="Schreibe eine Nachricht" />
        <input type="button" value="senden" />
      </div>`;
  }
}
