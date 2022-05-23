/* Autor: Arne Schaper */
import { LitElement, html } from 'lit';
import { query, customElement, property, state } from 'lit/decorators.js';
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
  image: string;
}

@customElement('find-activity')
class FindActivityComponent extends PageMixin(LitElement) {
  static styles = componentStyle;

  @property({ type: Array }) private activityList: Array<Actitity> = [];
  @query('#myForm') private myForm!: HTMLDivElement;
  @query('#title') private titlee!: HTMLInputElement;
  @query('#description') private description!: HTMLInputElement;
  @query('#motivationTitle') private motivationTitle!: HTMLInputElement;
  @state() private imgSrc!: string;
  @property() meetId!: string;

  async submit(event: Event) {
    event.preventDefault();
    const partialActivity: Partial<Actitity> = {
      title: this.titlee.value,
      description: this.description.value,
      motivationtitle: this.motivationTitle.value,
      image: this.imgSrc
    };
    try {
      const response = await httpClient.post('/activity', partialActivity);
      const activity: Actitity = await response.json();
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

  async updateImage(e: InputEvent) {
    const toBase64 = (file: Blob): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
    const input = e.target as HTMLInputElement;
    this.imgSrc = await toBase64(input.files![0]);
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

            <label for="Image"><b>Image</b></label>
            <input @change="${this.updateImage}" type="file" accept="image/png, image/jpeg" required />
            <br />
            <img style="max-width: 200px; max-height: 200px" src="${this.imgSrc}" />

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
        <!-- Filters -->
        <div id="myBtnContainer">
          <button class="btn active" onclick="filterSelection('all')">Highest Rated</button>
          <button class="btn active" onclick="filterSelection('all')">My Activities</button>
          <button class="btn" onclick="filterSelection('cars')">Sport</button>
          <button class="btn" onclick="filterSelection('animals')">Entertainment</button>
        </div>
        <!-- Filters -->
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
    this.myForm.style.display = 'block';
  }

  closeForm() {
    this.myForm.style.display = 'none';
  }
}
