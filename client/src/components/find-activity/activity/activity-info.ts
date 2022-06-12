/* Autor: Arne Schaper */

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PageMixin } from '../../page.mixin';
import { Actitity } from '../find-activity';

import componentStyle from './activity-info.css';

@customElement('activity-info')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class CardComponent extends PageMixin(LitElement) {
  static styles = componentStyle;

  @property({ reflect: true }) activity = {} as Actitity;

  render() {
    return html`
      <div id="card" class="card" style="width: 18rem">
        <img src="${this.activity.image}" class="card-image" style="max-height: 190px" />

        <div class="card-body">
          <div class="tooltip">
            <div class="card-title">${this.activity.title}</div>
            <span class="tooltiptext">Author: ${this.activity.tooltipcreatedby}</span>
          </div>
          <div class="tooltip">
            <div class="card-content">${this.activity.description}</div>
            <span class="tooltiptext">Created at ${this.activity.tooltip}</span>
          </div>
        </div>
      </div>
    `;
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
