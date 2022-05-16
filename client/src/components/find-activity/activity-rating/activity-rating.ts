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

  render() {
    return html`
      <p>${this.activity.motivationtitle}</p>
      <div class="slidecontainer">
        <input type="range" min="1" max="100" value="50" class="slider" id="myRange" />
      </div>
    `;
  }
}
