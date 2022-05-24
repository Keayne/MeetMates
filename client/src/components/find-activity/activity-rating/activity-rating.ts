/* Autor: Arne Schaper */

import { LitElement, html } from 'lit';
import { query, customElement, property } from 'lit/decorators.js';
import { httpClient } from '../../../http-client';
import { PageMixin } from '../../page.mixin';
import { Actitity, Rating } from '../find-activity';
import componentStyle from './activity-rating.css';

@customElement('activity-rating')
class ActivityRatingComponent extends PageMixin(LitElement) {
  static styles = componentStyle;

  @property({ reflect: true }) activity = {} as Actitity;
  @property() rating = {} as Rating;
  @property() avgRating = 0;
  @property() sliderValue = '50';

  async firstUpdated() {
    try {
      this.startAsyncInit();
      const responseRating = await httpClient.get(`rating/findOne/${this.activity.id}` + location.search);
      this.rating = (await responseRating.json()).results;
      const responseRatingAll = await httpClient.get(`rating/findAverageRating/${this.activity.id}` + location.search);
      this.avgRating = (await responseRatingAll.json()).results;
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
          <input
            type="range"
            min="0"
            max="100"
            value=${this.avgRating || 0}
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
            value=${this.rating}
            class="slider"
            id="myRating"
            @change="${(e: Event) => this.readSliderValue(e)}"
          />
          <p>Value: ${this.sliderValue}</p>
          <div>
            <button>Save Changes</button>
          </div>
        </div>
      </div>
    `;
  }

  readSliderValue(e: Event) {
    const target = e.target as HTMLInputElement;
    if (e) {
      this.sliderValue = target?.value;
      //this.activity.rating = Number(this.sliderValue);
    }
  }
}
