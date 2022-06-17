/* Autor: Arne Schaper */

import { LitElement, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { httpClient } from '../../../http-client';
import { PageMixin } from '../../page.mixin';
import { Activity, Rating } from '../find-activity';
import componentStyle from './activity-rating.css';

@customElement('activity-rating')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ActivityRatingComponent extends PageMixin(LitElement) {
  static styles = componentStyle;

  @property({ reflect: true }) activity = {} as Activity;
  @property() rating = {} as Rating;
  @query('#deleteButton') private deleteButton!: HTMLImageElement;

  private currentSliderValue = -1;

  async updated() {
    console.log(
      `Personal rating for ${this.activity.title} is ${this.activity.personalRating}, avgRating ${this.activity.avgRating}, currentSliderValue ${this.currentSliderValue}`
    );
    this.currentSliderValue = this.activity.personalRating ? this.activity.personalRating : 0;
    console.log(`Current slider value after: ${this.currentSliderValue}`);

    if (this.activity.deletepermission === false) this.deleteButton.style.display = 'none';
    else this.deleteButton.style.display = 'inline';
  }

  render() {
    return html`
      ${this.renderNotification()}
      <div class="outer-rating">
        <p>${this.activity.motivationtitle}</p>
        <div class="slidecontainer">
          <label for="overallRating">Overall Rating</label>
          <input
            type="range"
            min="0"
            max="100"
            value=${this.activity.avgRating ? this.activity.avgRating : 0}
            class="slider"
            id="overallRating"
            disabled
          />
        </div>
        <div class="slidecontainer">
          <label for="myRating">My Rating</label>
          <input
            type="range"
            min="0"
            max="100"
            value=${this.activity.personalRating ? this.activity.personalRating : '0'}
            class="slider"
            id="myRating"
            @change="${(e: Event) => this.readcurrentSliderValue(e)}"
          />
          <img id="personalSlider" src="/refresh.png" alt="update" @click=${this.savecurrentSliderValueToDb} />
          <img
            class="remove-task"
            src="/deleteicon.png"
            alt="update"
            id="deleteButton"
            @click="${this.confirmDelete}"
          />
        </div>
      </div>
    `;
  }

  confirmDelete(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target) {
      const result = confirm('Want to delete?');
      if (result) {
        this.emit('appactivityremoveclick');
      }
    }
  }

  readcurrentSliderValue(e: Event) {
    const target = e.target as HTMLInputElement;
    if (e) {
      this.currentSliderValue = Number(target?.value);
      console.log('Read new slider value ' + Number(target?.value));
    }
  }

  async savecurrentSliderValueToDb() {
    const partialRating: Partial<Rating> = {
      activityid: this.activity.id,
      rating: Number(this.currentSliderValue) //userID is not included here as it is being provided by the auth Middleware on patch request.
    };
    await httpClient.patch(`rating/${this.activity.id}${location.search}`, partialRating);

    const responseRatingAll = await httpClient.get(`rating/findAverageRating/${this.activity.id}` + location.search);
    try {
      this.activity.avgRating = (await responseRatingAll.json()).results;
      this.activity.personalRating = partialRating.rating ? partialRating.rating : 0;
    } catch (error) {
      this.showNotification((error as Error).message, 'error');
    }
    this.requestUpdate();
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
