/* Autor: Arne Schaper */

import { LitElement, html } from 'lit';
import { query, customElement, property } from 'lit/decorators.js';
import { PageMixin } from '../../page.mixin';
import { Actitity } from '../find-activity';
import componentStyle from './activity-rating.css';

@customElement('activity-rating')
class ActivityRatingComponent extends PageMixin(LitElement) {
  static styles = componentStyle;

  @property({ reflect: true }) activity = {} as Actitity;
  @property() sliderValue = '50';

  render() {
    return html`
      <div class="outer-rating">
        <p>${this.activity.motivationtitle}</p>
        <div class="slidecontainer">
          <input
            type="range"
            min="1"
            max="100"
            value="${this.activity.rating}"
            class="slider"
            id="myRange"
            @change="${(e: Event) => this.readSliderValue(e)}"
          />
          <p>Value: ${this.sliderValue}</p>
        </div>
      </div>
    `;
  }

  readSliderValue(e: Event) {
    const target = e.target as HTMLInputElement;
    if (e) {
      this.sliderValue = target?.value;
    }
  }
}
