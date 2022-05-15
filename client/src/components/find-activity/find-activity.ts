/* Autor: Arne Schaper */
import { LitElement, html, getCompatibleStyle } from 'lit';
import { query, customElement, state, property } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import componentStyle from './find-activity.css';
import { repeat } from 'lit/directives/repeat.js';

export interface Actitity {
  id: string;
  title: string;
  description: string;
  tooltip: string;
  motivationTitle: string;
}

let activity_array: { id: number; title: String; description: String; tooltip: String; motivationTitle: String }[] = [
  {
    id: 1,
    title: 'title1',
    description: 'description1',
    tooltip: 'tooltip desc1',
    motivationTitle: 'Wie viel Lust hast du auf title1?'
  },
  {
    id: 2,
    title: 'title2',
    description: 'description2',
    tooltip: 'tooltip desc2',
    motivationTitle: 'Wie viel Lust hast du auf title2?'
  }
];
@customElement('find-activity')
class FindActivityComponent extends PageMixin(LitElement) {
  static styles = componentStyle;

  @property({ type: Array }) private ActivityList: Array<Actitity> = []; //this should take info from db, currently unused

  async firstUpdated() {
    try {
      this.startAsyncInit();
    } catch (e) {
      this.showNotification((e as Error).message, 'error');
    } finally {
      this.finishAsyncInit();
    }
  }

  render() {
    return html`${this.renderNotification()}
      <h3>Find Actitity Component start</h3>
      ${repeat(
        activity_array, //this should render this.ActivityList
        activity =>
          html` <div class="activity">
              <activity-info .activity=${activity}></activity-info>
            </div>
            <div class="activity">
              <activity-rating .activity=${activity}></activity-rating>
            </div>`
      )}

      <h3>Find Actitity Component finish</h3>`;
  }
}
