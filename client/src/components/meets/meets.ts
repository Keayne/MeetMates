/* Autor: Jonathan Hüls */

import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
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
}

@customElement('app-meets')
class MeetsComponent extends PageMixin(LitElement) {
  static styles = componentStyle;
  @state() private meets: Meet[] = [];

  async firstUpdated() {
    try {
      this.startAsyncInit();
      const response = await httpClient.get('/meets' + location.search);
      this.meets = await response.json();
    } catch (err) {
      if ((err as { statusCode: number }).statusCode === 401) {
        router.navigate('mates/sign-in');
      } else {
        this.showNotification((err as Error).message, 'error');
      }
    }
  }

  render() {
    const meetsTemp = [];
    for (const m of this.meets) {
      meetsTemp.push(html`<meets-meet id="${m.id}" name="${m.name}" mates=${m.mates}></meets-meet>`);
    }

    return html`${this.renderNotification()}
      <div class="meets">
        <div class="meets-header">
          <h2>New Meets</h2>
        </div>
        <div class="meets-body">${meetsTemp}</div>
      </div>`;
  }
}
