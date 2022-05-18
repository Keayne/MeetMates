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
  mates: Mate[];
}
interface Mate {
  id: string;
  name: string;
  src: string;
  age: string;
}

@customElement('app-meets')
class MeetsComponent extends PageMixin(LitElement) {
  static styles = componentStyle;
  @property({ type: Array }) private meets: Array<Meet> = [];
  @state() private new: Meet[] = [];

  async firstUpdated() {
    try {
      this.startAsyncInit();
      const response = await httpClient.get('/meets' + location.search);
      this.meets = await response.json();
      console.log(this.meets);
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
        <div class="meets-header">
          <h2>Your Meets</h2>
        </div>
        <div class="meets-body">${repeat(this.meets, meet => html`<meets-meet .meet=${meet} />`)}</div>
      </div>`;
  }
}
