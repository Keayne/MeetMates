/* Autor: Arne Schaper */
import { LitElement, html } from 'lit';
import { query, customElement } from 'lit/decorators.js';
import { PageMixin } from '../../page.mixin';
import componentStyle from './find-activity.css';

@customElement('activity-rating')
class ActivityRating extends PageMixin(LitElement) {
  static styles = componentStyle;

  render() {
    return html`${this.renderNotification()}
      <h1>find activity component :)</h1>`;
  }
}
