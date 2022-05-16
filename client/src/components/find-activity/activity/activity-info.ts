/* Autor: Arne Schaper */

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PageMixin } from '../../page.mixin';
import { Actitity } from '../find-activity';

import componentStyle from './activity-info.css';

@customElement('activity-info')
class CardComponent extends PageMixin(LitElement) {
  static styles = componentStyle;

  @property({ reflect: true }) activity = {} as Actitity;
  @property({ type: String }) imgSrc = './kino.jpg';

  render() {
    return html`
      ${console.log(this.activity)}
      <div id="card" class="card" style="width: 18rem">
        <img src=${this.imgSrc} class="card-image" />
        <div class="card-body">
          <div class="tooltip">
            <div class="card-title">${this.activity.title}</div>
            <span class="tooltiptext">${this.activity.tooltipcreatedby}</span>
          </div>
          <div class="tooltip">
            <div class="card-content">${this.activity.description}</div>
            <span class="tooltiptext">${this.activity.tooltip}</span>
          </div>
        </div>
      </div>
    `;
  }
}
