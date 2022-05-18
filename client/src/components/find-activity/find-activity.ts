/* Autor: Arne Schaper */
import { LitElement, html } from 'lit';
import { query, customElement, property } from 'lit/decorators.js';
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
  chosen: boolean;
  meetId: string;
}

@customElement('find-activity')
class FindActivityComponent extends PageMixin(LitElement) {
  static styles = componentStyle;

  @property({ type: Array }) private activityList: Array<Actitity> = [];
  @query('#myForm') private myForm!: HTMLDivElement;
  @query('#title') private titlee!: HTMLInputElement;
  @query('#description') private description!: HTMLInputElement;
  @query('#motivationTitle') private motivationTitle!: HTMLInputElement;
  @property() meetId!: string;

  async submit(event: Event) {
    event.preventDefault();
    const partialActivity: Partial<Actitity> = {
      title: this.titlee.value,
      description: this.description.value,
      motivationtitle: this.motivationTitle.value
    };
    try {
      const response = await httpClient.post('/activity', partialActivity);
      const activity: Actitity = await response.json();
      console.log('published new Activity');
      this.titlee.value = '';
      this.description.value = '';
      this.motivationTitle.value = '';
      this.activityList = [...this.activityList, activity];
    } catch (e) {
      this.showNotification((e as Error).message, 'error');
    }
  }

  async firstUpdated() {
    try {
      this.startAsyncInit();
      const response = await httpClient.get(`activity/${this.meetId}` + location.search);
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
        <!-- Pop up -->
        <button class="open-button" @click="${this.openForm}">Create Activity</button>
        <div class="form-popup" id="myForm">
          <form @submit="${this.submit}" class="form-container">
            <h1>New Activity</h1>

            <label for="title"><b>Title</b></label>
            <input type="text" placeholder="Enter Title" name="title" id="title" required />

            <label for="description"><b>Description</b></label>
            <input type="text" placeholder="Enter Description" name="description" id="description" required />

            <label for="description"><b>Motivation Title</b></label>
            <input
              type="text"
              placeholder="Enter Motivation Title"
              name="motivationTitle"
              id="motivationTitle"
              required
            />

            <button type="submit" class="btn">Create Actitity</button>
            <button type="button" class="btn cancel" @click="${this.closeForm}">Close</button>
          </form>
        </div>
        <!-- Pop up end-->
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
      </div> `;
  }
  openForm() {
    this.myForm.style.display = 'block'; //TODO can't find object
  }

  closeForm() {
    this.myForm.style.display = 'none';
  }
}
