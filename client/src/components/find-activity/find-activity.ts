/* Autor: Arne Schaper */
import { LitElement, html } from 'lit';
import { query, customElement, state } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import componentStyle from './find-activity.css';

@customElement('find-activity')
class FindActivityComponent extends PageMixin(LitElement) {
  static styles = componentStyle;

  render() {
    return html`${this.renderNotification()}
      <h1>find activity component :)</h1>
      <h2>---------</h2>
      <!-- TODO render activity component with corresponding activity-rating component-->`;
  }
}
