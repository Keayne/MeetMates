/* Autor: Arne Schaper */
import { LitElement, html, getCompatibleStyle } from 'lit';
import { query, customElement, state, property } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import componentStyle from './find-activity.css';
import { repeat } from 'lit/directives/repeat.js';
import { httpClient } from '../../http-client';

export interface Actitity {
  title: string;
  description: string;
  tooltip: string;
  motivationTitle: string;
}

let activity_array: { title: String; description: String; tooltip: String; motivationTitle: String }[] = [
  {
    title: 'title1',
    description: 'description1',
    tooltip: 'tooltip desc1',
    motivationTitle: 'Wie viel Lust hast du auf title1?'
  },
  {
    title: 'title2',
    description: 'description2',
    tooltip: 'tooltip desc2',
    motivationTitle: 'Wie viel Lust hast du auf title2?'
  }
];
@customElement('find-activity')
class FindActivityComponent extends PageMixin(LitElement) {
  static styles = componentStyle;

  @property({ type: Array }) private activityList: Array<Actitity> = [];

  async firstUpdated() {
    try {
      this.startAsyncInit();
      const response = await httpClient.get('activity' + location.search);
      this.activityList = (await response.json()).results;
    } catch (e) {
      this.showNotification((e as Error).message, 'error');
    } finally {
      this.finishAsyncInit();
    }
  }

  render() {
    return html`${this.renderNotification()}
      <h3>Find Actitity Component start</h3>
      <div class="activity-header">
        <h2>Available Activities</h2>
      </div>

      ${repeat(
        this.activityList,
        activity =>
          html` <div class="activity-container">
            <div class="activity">
              <activity-info .activity=${activity}></activity-info>
            </div>
            <div class="activity">
              <activity-rating .activity=${activity}></activity-rating>
            </div>
          </div>`
      )}

      <h3>Find Actitity Component finish</h3>`;
  }
}
