/* Autor: Arne Schaper */
import { LitElement, html } from 'lit';
import { query, customElement, property, state } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import componentStyle from './find-activity.css';
import { repeat } from 'lit/directives/repeat.js';
import { httpClient } from '../../http-client';

export interface Actitity {
  id: string;
  title: string;
  description: string;
  tooltip: string;
  tooltipcreatedby: string;
  motivationtitle: string;
  chosen: boolean;
  meetId: string;
  image: string;
  category: string;
  personalRating: number;
  avgRating: number;
  deletepermission: boolean;
}

export interface Rating {
  activityid: string;
  userid: string;
  rating: number;
}

@customElement('find-activity')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class FindActivityComponent extends PageMixin(LitElement) {
  static styles = componentStyle;

  @property() meetId!: string;
  @property({ type: Array }) private activityList: Array<Actitity> = [];
  @property({ type: Array }) private activityListLocal: Array<Actitity> = [];
  @query('#myForm') private myForm!: HTMLDivElement;
  @query('#title') private titlee!: HTMLInputElement;
  @query('#image') private image!: HTMLInputElement;
  @query('#description') private description!: HTMLInputElement;
  @query('#motivationTitle') private motivationTitle!: HTMLInputElement;
  @query('#category') private category!: HTMLSelectElement;
  @query('#btn1') private btn1!: HTMLButtonElement;
  @query('#btn2') private btn2!: HTMLButtonElement;
  @query('#btn3') private btn3!: HTMLButtonElement;
  @query('#btn4') private btn4!: HTMLButtonElement;
  @query('#btn5') private btn5!: HTMLButtonElement;
  @state() private imgSrc!: string;

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
      category: this.category.value,
      deletepermission: true
    };
    try {
      const response = await httpClient.post(`/activity/${this.meetId}`, partialActivity);
      const activity: Actitity = await response.json();
      //emty fields of form
      this.titlee.value = '';
      this.description.value = '';
      this.motivationTitle.value = '';
      this.category.value = '';
      //this.image = ''; TODO
      //emty fields of form end
      this.activityList = [...this.activityList, activity]; //append activity to screen so user does not have to reload the page to see the activity
      this.activityListLocal = [...this.activityListLocal, activity]; //also add activity to localList
    } catch (e) {
      this.showNotification((e as Error).message, 'error');
    }
    this.closeForm();
    this.showNotification('Added activity.', 'info');
  }

  async updateAuthor(authorId: string) {
    let response;
    try {
      const mate = await httpClient.get(`/getName/${authorId}`);
      response = await mate.json();
    } catch (error) {
      this.showNotification((error as Error).message, 'error');
    }
    return response.message;
  }

  async updateAvgRating(activityId: string) {
    let response;
    try {
      const responseRatingAll = await httpClient.get(`rating/findAverageRating/${activityId}` + location.search);
      response = (await responseRatingAll.json()).results;
    } catch (error) {
      this.showNotification((error as Error).message, 'error');
    }
    return response;
  }

  /**
   * Initial tasks required to load the page
   */
  async firstUpdated() {
    try {
      this.startAsyncInit();
      const response = await httpClient.get(`activity/${this.meetId}` + location.search);
      this.activityList = (await response.json()).results;
      await Promise.all(
        this.activityList.map(async (activity: Actitity): Promise<void> => {
          activity.tooltipcreatedby = await this.updateAuthor(activity.tooltipcreatedby);
          activity.avgRating = await this.updateAvgRating(activity.id);
        })
      );
      this.activityListLocal = this.activityList;
      this.btn1.style.backgroundColor = 'grey'; //preselect all filter
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
        <!-- Filter Buttons -->
        
        <!-- Filter Buttons End -->

        <!-- New Create Activity -->
        <button class="open-button" @click="${this.openForm}">Create an activity</button>
        <div class="form-popup" id="myForm">
          <form @submit="${this.submit}" class="form-container">
            <h2>New Activity</h2>
            <label for="title"><b>Title</b></label><br>
            <input type="text" placeholder="Your Title" name="title" id="title" maxlength="18" minlength="4" required autocomplete="off" />
            <br><label for="description"><b>Description</b></label><br>
            <input 
              type="text"
              placeholder="What is your activity?"
              name="description"
              id="description"
              required
              autocomplete="off"
              maxlength="100" minlength="20"
            /><br>
            <label for="category"><b>Choose a category</b></label><br>
            <select id="category" name="category" required>
              <option value="Sport">Sport</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Drinking">Drinking</option>
              <option value="Other">Other</option></select
            ><br /><br />
            <label for="Image"><b>Image</b></label><br>
            <input @change="${this.updateImage}" type="file" accept="image/png, image/jpeg" required /><br>
            <img style="max-width: 200px; max-height: 200px" src="${this.imgSrc}" />
            <br><label for="description"><b>Motivation Title</b></label><br>
            <input
              type="text"
              placeholder="Why should you do this together?"
              name="motivationTitle"
              id="motivationTitle"
              required
              autocomplete="off"
            /><br>
            <button type="submit" class="btn">Create Actitity</button><br>
            <button type="button" class="btn cancel" @click="${this.closeForm}">Close</button>
          </form>
        </div>
          <!-- End New Create Activity -->
        <div id="myBtnContainer">
          <button class="btn" id="btn1" @click=${() => this.selectFilter('all')}>All</button>
          <button class="btn" id="btn2" @click=${() => this.selectFilter('Highest Rating')}>Highest Rating</button>
          <button class="btn" id="btn3" @click=${() => this.selectFilter('Entertainment')}>Entertainment</button>
          <button class="btn" id="btn4" @click=${() => this.selectFilter('Drinking')}>Drinking</button>
          <button class="btn" id="btn5" @click=${() => this.selectFilter('Sport')}>Sport</button>
        </div>
          <!-- Render Activities -->
          ${repeat(
            this.activityListLocal,
            activity =>
              html` <div class="activity-container">
              <div class="activity">
                <activity-info 
                .activity=${activity}></activity-info>
              </div>
              <div class="activity" class="rating">
                <activity-rating .activity=${activity} .activityId=${activity.id} @appactivityremoveclick=${() =>
                this.deleteActivity(activity)}></activity-rating>
              </div>
            </div>
        </div>`
          )}
        </div>
      </div>`;
  }

  /**
   * Apply a filter to the currently shown activites
   * @param category Name of the category to filter
   */
  selectFilter(category: string) {
    this.btn1.style.backgroundColor = 'white';
    this.btn2.style.backgroundColor = 'white';
    this.btn3.style.backgroundColor = 'white';
    this.btn4.style.backgroundColor = 'white';
    this.btn5.style.backgroundColor = 'white';

    if (category === 'all') {
      this.activityListLocal = this.activityList;
      this.btn1.style.backgroundColor = 'grey';
    } else if (category === 'Highest Rating') {
      this.btn2.style.backgroundColor = 'grey';
      this.activityListLocal = this.activityList;
      this.activityListLocal.sort((a, b) => (a.avgRating < b.avgRating ? 1 : -1));
    } else {
      this.activityListLocal = this.activityList.filter(activity => activity.category === category);
      if (category === 'Entertainment') this.btn3.style.backgroundColor = 'grey';
      if (category === 'Sport') this.btn5.style.backgroundColor = 'grey';
      if (category === 'Drinking') this.btn4.style.backgroundColor = 'grey';
      if (this.activityListLocal.length === 0) {
        this.showNotification('There are currently no activities for this topic.', 'info');
      }
    }
  }

  async deleteActivity(activityToDelete: Actitity) {
    try {
      await httpClient.delete('activity/' + activityToDelete.id);
      this.activityList = this.activityList.filter(activity => activity.id !== activityToDelete.id);
      this.activityListLocal = this.activityListLocal.filter(activity => activity.id !== activityToDelete.id);
    } catch (error) {
      this.showNotification((error as Error).message, 'error');
    }
  }

  openForm() {
    if (this.myForm.style.display === '' || this.myForm.style.display === 'none') this.myForm.style.display = 'block';
    else this.myForm.style.display = 'none';
  }

  closeForm() {
    this.myForm.style.display = 'none';
  }
}
