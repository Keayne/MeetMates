/* Autor: Jonathan Hüls */
import { LitElement, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
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

export interface Activity {
  id: string;
  title: string;
  description: string;
  tooltip: string;
  tooltipcreatedby: string;
  motivationtitle: string;
  chosen: boolean;
  meetId: string;
  image: string;
  category: string;
  personalRating: number;
  avgRating: number;
  deletepermission: boolean;
}

@customElement('app-your-meet')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class YourMeetComponent extends PageMixin(LitElement) {
  static styles = componentStyle;
  @property() meetId!: string;
  @query('#meetName') private meetName: HTMLInputElement | undefined;

  private meet!: Meet;
  private activity: Activity | undefined;

  async firstUpdated() {
    try {
      const meetResponse = await httpClient.get('/meet/' + this.meetId + location.search);
      this.meet = await meetResponse.json();
      const activityResponse = await httpClient.get('/activity/findChosenActivity/' + this.meetId + location.search);
      this.activity = await activityResponse.json();

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

      //either render chosen Activity or navigationButton
      let activity;
      if (typeof this.activity === 'object') {
        activity =
          Object.keys(this.activity).length === 0
            ? html`<h3>What would you like to do? Create an activity or rate others!</h3>
                <div>
                  <button type="button" class="routeBtn" @click="${this.routeToActiviySeelction}">Find Actitity</button>
                </div>`
            : html` <h3>You have chosen the following activity:</h3>
                <div class="activity-container">
                  <activity-info .activity=${this.activity}></activity-info>
                </div>`;
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
          <div id="activitydiv">${activity}</div>
          <div id="chatdiv"><app-chat class="chat" .room=${this.meetId}></app-chat></div>
        </div>`;
    }
  }

  async routeToActiviySeelction() {
    router.navigate('meet/find-activity/' + this.meetId);
  }
  async meetNameChanged() {
    if (this.meetName?.value !== this.meet.name) {
      try {
        const response = await httpClient.post('/meet/changeName' + location.search, {
          meetId: this.meetId,
          newName: this.meetName?.value
        });

        await response.json();
        this.meet.name = this.meetName === undefined ? this.meet.name : this.meetName?.value;
      } catch (err) {
        this.showNotification((err as Error).message, 'error');
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
