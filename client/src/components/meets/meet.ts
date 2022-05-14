/* Autor: Jonathan Hüls */
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import { router } from '../../router/router.js';
import { httpClient } from '../../http-client';
import componentStyle from './meet.css';

interface Mate {
  id: string;
  name: string;
  firstName: string;
  src: string;
}
@customElement('meets-meet')
class MeetsMeetComponent extends PageMixin(LitElement) {
  static styles = componentStyle;

  @property({ type: String }) id = '';
  @property({ type: String }) name = '';
  @property() userIcons: Mate[] = [];

  async firstUpdated() {
    console.log('firstUpdated id:' + this.id);

    try {
      this.startAsyncInit();
      const response = await httpClient.get(`/meets/userIcons/:${this.id}` + location.search);
      this.userIcons = await response.json();
    } catch (err) {
      if ((err as { statusCode: number }).statusCode === 401) {
        router.navigate('mates/sign-in');
      } else {
        this.showNotification((err as Error).message, 'error');
      }
    }
  }

  render() {
    const mateTemp = [];
    console.log(this.userIcons);
    for (const m of this.userIcons) {
      mateTemp.push(
        html`<user-icon class="userIcon" name="${m.name}" firstName="${m.firstName}" src="${m.src}"></user-icon>`
      );
    }

    return html`<button type="button" class="meet" @click=${() => router.navigate(`/meet/${this.id}`)}>
      <h2 class="name">${this.name}</h2>
      <div>${mateTemp}</div>
    </button>`;
  }
}
