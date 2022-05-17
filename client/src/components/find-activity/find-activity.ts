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
  tooltipcreatedby: string;
  motivationtitle: string;
  rating: number;
}

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
      <div class="activity-outer">
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
              <div class="activity" class="rating">
                <activity-rating .activity=${activity}></activity-rating>
              </div>
            </div>
        </div>`
        )}
      </div>`;
  }
}
