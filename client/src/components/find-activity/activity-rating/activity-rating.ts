/* Autor: Arne Schaper */

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { httpClient } from '../../../http-client';
import { PageMixin } from '../../page.mixin';
import { Actitity, Rating } from '../find-activity';
import componentStyle from './activity-rating.css';

@customElement('activity-rating')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ActivityRatingComponent extends PageMixin(LitElement) {
  static styles = componentStyle;

  @property({ reflect: true }) activity = {} as Actitity;
  @property() rating = {} as Rating;
  @property() avgRating = 0;
  @property() sliderValue = '0';

  //TODO: Save slider values on change, make sure this works on new activities as well, update db script to include images, add/delete for activities

  async firstUpdated() {
    try {
      this.startAsyncInit();
      const responseRating = await httpClient.get(`rating/findOne/${this.activity.id}` + location.search);
      this.rating = (await responseRating.json()).results;
      const responseRatingAll = await httpClient.get(`rating/findAverageRating/${this.activity.id}` + location.search);
      this.avgRating = (await responseRatingAll.json()).results;
      this.sliderValue = String(this.rating.rating);
    } catch (e) {
      this.showNotification((e as Error).message, 'error');
    } finally {
      this.finishAsyncInit();
    }
  }

  render() {
    return html`
      <div class="outer-rating">
        <p>${this.activity.motivationtitle}</p>
        <div class="slidecontainer">
          <label for="overallRating">Overall Rating</label>
          <input type="range" min="0" max="100" value=${this.avgRating} class="slider" id="overallRating" disabled />
        </div>
        <div class="slidecontainer">
          <label for="myRating">My Rating</label>
          <input
            type="range"
            min="0"
            max="100"
            value=${this.rating.rating}
            class="slider"
            id="myRating"
            @change="${(e: Event) => this.readSliderValue(e)}"
          />
          <img src="/refresh.png" alt="update" @click=${this.saveSliderValueToDb} style="width:60px;height:50px;" />
          <img
            class="remove-task"
            src="/deleteicon.png"
            style="width:60px;height:50px;"
            alt="update"
            @click="${() => this.emit('appactivityremoveclick')}"
          />
        </div>
      </div>
    `;
  }

  readSliderValue(e: Event) {
    const target = e.target as HTMLInputElement;
    if (e) {
      this.sliderValue = target?.value;
      this.activity.personalRating = Number(this.sliderValue);
    }
  }

  async saveSliderValueToDb() {
    console.log(this.sliderValue);
    const partialRating: Partial<Rating> = {
      activityid: this.activity.id,
      rating: Number(this.sliderValue) //userID is not included here as it is being provided by the auth Middleware on patch request.
    };
    await httpClient.patch(`rating/${this.activity.id}` + location.search, partialRating);
    const responseRatingAll = await httpClient.get(`rating/findAverageRating/${this.activity.id}` + location.search);
    this.avgRating = (await responseRatingAll.json()).results;
    this.activity.personalRating = this.rating.rating;
    this.activity.avgRating = this.avgRating;
  }

  emit(eventType: string, eventData = {}) {
    const event = new CustomEvent(eventType, {
      detail: eventData,
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }
}
