/* Autor: Jonathan Hüls */

import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { httpClient } from '../../http-client';
import { router } from '../../router/router';
import { PageMixin } from '../page.mixin';
import componentStyle from './meets.css';

interface Meet {
  id: string;
  name: string;
  opened: boolean;
  mates: Mate[];
}
interface Mate {
  id: string;
  name: string;
  src: string;
  age: string;
}

@customElement('app-meets')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class MeetsComponent extends PageMixin(LitElement) {
  static styles = componentStyle;
  @property({ type: Array }) private meets: Array<Meet> = [];
  @state() private new: Meet[] = [];

  private oldMeets: Meet[] = [];
  private newMeets: Meet[] = [];

  async firstUpdated() {
    try {
      this.startAsyncInit();
      const response = await httpClient.get('/meets' + location.search);
      this.meets = await response.json();

      this.meets.forEach(meet => {
        if (meet.opened) {
          this.oldMeets.push(meet);
        } else {
          this.newMeets.push(meet);
        }
      });
    } catch (err) {
      if ((err as { statusCode: number }).statusCode === 401) {
        router.navigate('mates/sign-in');
      } else {
        this.showNotification((err as Error).message, 'error');
      }
    }
  }

  render() {
    return html`${this.renderNotification()}
      <div class="meets">
        ${this.newMeets.length > 0
          ? html`<div class="meets-header"><h2>New Meets</h2></div>
              <div class="meets-body">${repeat(this.newMeets, meet => html`<meets-meet .meet=${meet} />`)}</div>`
          : html``}
        ${this.oldMeets.length > 0
          ? html`<div class="meets-header"><h2>Your Meets</h2></div>
              <div class="meets-body">${repeat(this.oldMeets, meet => html`<meets-meet .meet=${meet} />`)}</div>`
          : html``}
      </div>`;
  }
}
