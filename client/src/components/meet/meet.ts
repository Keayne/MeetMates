/* Autor: Jonathan Hüls */
import { LitElement, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
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
  @query('#meetName') private meetName: HTMLInputElement | undefined;

  private meet!: Meet;

  async firstUpdated() {
    try {
      const response = await httpClient.get('/meet/' + this.meetId + location.search);
      this.meet = await response.json();
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
        matesTemp.push(html`<meet-user class="meetMate" .mate=${m} />`);
      }
      return html`${this.renderNotification()}
        <div class="meeting">
          <div class="meet-header">
            <input
              type="text"
              class="meetName"
              id="meetName"
              name="meetHeading"
              @blur="${this.meetNameChanged}"
              value="${this.meet.name}"
            />
            <button type="button" class="meet-Delete" @click=${(e: Event) => this.deleteMeetClicked(e)}>
              &#10006;
            </button>
          </div>
          <div class="centerMates">
            <div class="meetingUsers">${matesTemp}</div>
          </div>
          <div>
            <button type="button" class="routeBtn" @click="${this.routeToActiviySeelction}">Find Actitity</button>
          </div>
          <meet-chat></meet-chat>
        </div>`;
    }
  }

  async routeToActiviySeelction() {
    router.navigate('meet/find-activity/' + this.meetId);
  }
  async meetNameChanged() {
    if (this.meetName?.value !== this.meet.name) {
      console.log(this.meetName?.value);
      console.log('old value: ' + this.meet.name);

      try {
        const response = await httpClient.post('/meet/changeName' + location.search, {
          meetId: this.meetId,
          newName: this.meetName?.value
        });

        await response.json();
        this.meet.name = this.meetName === undefined ? this.meet.name : this.meetName?.value;
      } catch (err) {
        console.log(err);
      }
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
