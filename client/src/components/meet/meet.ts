/* Autor: Jonathan Hüls */
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import { router } from '../../router/router.js';
import componentStyle from './meet.css';
import { httpClient } from '../../http-client';

interface Mate {
  id: string;
  name: string;
  firstName: string;
  src: string;
  age: string;
}
interface Meet {
  id: string;
  name: string;
  mates: Mate[];
}

@customElement('app-your-meet')
class YourMeetComponent extends PageMixin(LitElement) {
  static styles = componentStyle;
  @property() meetId!: string;

  private meet!: Meet;

  async firstUpdated() {
    try {
      const response = await httpClient.get('/meet/' + this.meetId + location.search);
      this.meet = await response.json();
      console.log(this.meet);
      this.requestUpdate();
      await this.updateComplete;
    } catch (err) {
      if ((err as { statusCode: number }).statusCode === 401) {
        router.navigate('mates/sign-in');
      } else {
        this.showNotification((err as Error).message, 'error');
      }
    }
  }

  render() {
    if (this.meet !== undefined) {
      const matesTemp = [];
      for (const m of this.meet.mates) {
        matesTemp.push(
          html`<meet-user
            mateId="${m.id}"
            name="${m.name}"
            firstName="${m.firstName}"
            age="${m.age}"
            imgSrc="${m.src}"
          ></meet-user>`
        );
      }
      return html`${this.renderNotification()}
        <div class="meeting">
          <div class="meet-header">
            <h1 class="meetName">${this.meet.name}</h1>
            <div class="meet-Delete" @click=${(e: Event) => this.deleteMeetClicked(e)}>x</div>
          </div>
          <div class="meetingUsers">${matesTemp}</div>
          <meet-chat></meet-chat>
        </div>`;
    }
  }
  async deleteMeetClicked(e: Event) {
    if (confirm('Do you realy wish to quit the Meet ?')) {
      try {
        await httpClient.delete('/meet/' + this.meetId);
        router.navigate('meets');
      } catch (err) {
        this.showNotification((err as Error).message, 'error');
      }
    }
  }
}
