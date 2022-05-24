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
  category: string;
}

@customElement('find-activity')
class FindActivityComponent extends PageMixin(LitElement) {
  static styles = componentStyle;

  @property({ type: Array }) private activityList: Array<Actitity> = [];
  @property({ type: Array }) private activityListLocal: Array<Actitity> = [];
  @query('#myForm') private myForm!: HTMLDivElement;
  @query('#title') private titlee!: HTMLInputElement;
  @query('#description') private description!: HTMLInputElement;
  @query('#motivationTitle') private motivationTitle!: HTMLInputElement;
  @query('#category') private category!: HTMLSelectElement;
  @state() private imgSrc!: string;
  @property() meetId!: string;

  /**
   * Creates an activity and sends it to the server
   * @param event Activity (Partial) to be submitted
   */
  async submit(event: Event) {
    event.preventDefault();
    const partialActivity: Partial<Actitity> = {
      title: this.titlee.value,
      description: this.description.value,
      motivationtitle: this.motivationTitle.value,
      image: this.imgSrc,
      category: this.category.value
    };
    try {
      const response = await httpClient.post('/activity', partialActivity);
      const activity: Actitity = await response.json();
      //emty fields of form
      this.titlee.value = '';
      this.description.value = '';
      this.motivationTitle.value = '';
      this.category.value = '';
      //TODO empty image upload,
      //emty fields of form end
      this.activityList = [...this.activityList, activity]; //append activity to screen so user does not have to reload the page to see the activity
      this.activityListLocal = [...this.activityListLocal, activity]; //also add activity to localList
    } catch (e) {
      this.showNotification((e as Error).message, 'error');
    }
  }

  /**
   * Initial tasks required to load the page
   */
  async firstUpdated() {
    try {
      this.startAsyncInit();
      const response = await httpClient.get(`activity/${this.meetId}` + location.search);
      this.activityList = (await response.json()).results;
      this.activityListLocal = this.activityList;
    } catch (e) {
      this.showNotification((e as Error).message, 'error');
    } finally {
      this.finishAsyncInit();
    }
  }

  /**
   * Handling of image upload for the "createActivity"-button
   * @param e InputEvent
   */
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
            <input type="text" placeholder="Enter Title" name="title" id="title" required autocomplete="false" />

            <label for="description"><b>Description</b></label>
            <input
              type="text"
              placeholder="Enter Description"
              name="description"
              id="description"
              required
              autocomplete="false"
            />

            <label for="category">Choose a category:</label> <br />
            <select id="category" name="category" required>
              <option value="Sport">Sport</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Drinking">Drinking</option>
              <option value="Other">Other</option></select
            ><br /><br />

            <label for="Image"><b>Image</b></label>
            <input @change="${this.updateImage}" type="file" accept="image/png, image/jpeg" required />

            <img style="max-width: 200px; max-height: 200px" src="${this.imgSrc}" />

            <label for="description"><b>Motivation Title</b></label>
            <input
              type="text"
              placeholder="Enter Motivation Title"
              name="motivationTitle"
              id="motivationTitle"
              required
              autocomplete="false"
            />

            <button type="submit" class="btn">Create Actitity</button>
            <button type="button" class="btn cancel" @click="${this.closeForm}">Close</button>
          </form>
        </div>
        <!-- Pop up end-->
        <!-- Filter Buttons -->
        <div id="myBtnContainer">
          <button class="btn active" @click=${() => this.selectFilter('all')}>All</button>
          <button class="btn" @click=${() => this.selectFilter('Highest Rating')}>Highest Rating</button>
          <button class="btn" @click=${() => this.selectFilter('Entertainment')}>Entertainment</button>
          <button class="btn" @click=${() => this.selectFilter('Drinking')}>Drinking</button>
          <button class="btn" @click=${() => this.selectFilter('Sport')}>Sport</button>
        </div>
        <!-- Filter Buttons End -->
        <!-- Render Activities -->
        ${repeat(
          this.activityListLocal,
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

  /**
   * Apply a filter to the currently shown activites
   * @param category Name of the Category to filter
   */
  selectFilter(category: String) {
    if (category === 'all') {
      this.activityListLocal = this.activityList;
    } else {
      this.activityListLocal = this.activityList.filter(activity => activity.category === category);
    }
  }

  openForm() {
    this.myForm.style.display = 'block';
  }

  closeForm() {
    this.myForm.style.display = 'none';
  }
}
