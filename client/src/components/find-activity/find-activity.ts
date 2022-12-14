/* Autor: Arne Schaper */
import { LitElement, html } from 'lit';
import { query, customElement, property } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import componentStyle from './find-activity.css';
import { repeat } from 'lit/directives/repeat.js';
import { httpClient } from '../../http-client';
import { router } from '../../router/router';

export interface Activity {
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
  @property({ type: Array }) private activityList: Array<Activity> = [];
  @property({ type: Array }) private activityListLocal: Array<Activity> = [];

  @query('#btn1') private btn1!: HTMLButtonElement;
  @query('#btn2') private btn2!: HTMLButtonElement;
  @query('#btn3') private btn3!: HTMLButtonElement;
  @query('#btn4') private btn4!: HTMLButtonElement;
  @query('#btn5') private btn5!: HTMLButtonElement;
  @query('#btn6') private btn6!: HTMLButtonElement;
  @query('.nothingHere') private nothingHere!: HTMLDivElement;

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

  async updatePersonalRating(activityId: string) {
    const responseRating = await httpClient.get(`rating/findOne/${activityId}` + location.search);
    const response = (await responseRating.json()).results;
    return response.rating;
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
        this.activityList.map(async (activity: Activity): Promise<void> => {
          activity.tooltipcreatedby = await this.updateAuthor(activity.tooltipcreatedby);
          activity.avgRating = await this.updateAvgRating(activity.id);
          activity.personalRating = await this.updatePersonalRating(activity.id);
        })
      );
      this.activityListLocal = this.activityList;
      this.btn1.style.backgroundColor = '#83a5c2'; //preselect all filter
      if (this.activityListLocal.length !== 0) this.nothingHere.style.display = 'none';
    } catch (e) {
      if ((e as { statusCode: number }).statusCode === 401) {
        router.navigate('mates/sign-in');
      } else {
        this.showNotification((e as Error).message, 'error');
      }
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
        <create-activity
          @activitycreated=${(activityPartial: CustomEvent) => this.createActivity(activityPartial)}
        ></create-activity>
        <!-- Filter Buttons -->
        <div id="myBtnContainer">
          <button class="btn" id="btn1" @click=${() => this.selectFilter('all')}>All</button>
          <button class="btn" id="btn2" @click=${() => this.selectFilter('Highest Rating')}>Highest Rating</button>
          <button class="btn" id="btn3" @click=${() => this.selectFilter('Entertainment')}>Entertainment</button>
          <button class="btn" id="btn4" @click=${() => this.selectFilter('Drinking')}>Drinking</button>
          <button class="btn" id="btn5" @click=${() => this.selectFilter('Sport')}>Sport</button>
          <button class="btn" id="btn6" @click=${() => this.selectFilter('Other')}>Other</button>
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
                <activity-rating
                  .activity=${activity}
                  @appactivityremoveclick=${() => this.deleteActivity(activity)}
                ></activity-rating>
              </div>
            </div>`
        )}
        <div class="nothingHere" id="nothingHereDiv">
          <h2 class="nothingHere">There seems to be nothing here... yet!</h2>
          <h3 class="nothingHere">Create an activity to get started!</h3>
        </div>
      </div>`;
  }

  sortActivityListLocal() {
    this.activityListLocal = [...this.activityList];
    this.activityListLocal = this.activityListLocal.sort((a, b) => (a.avgRating < b.avgRating ? 1 : -1));
  }

  /**
   * Apply a filter to the currently shown activites
   * @param category Name of the category to filter
   */
  selectFilter(category: string) {
    this.btn1.style.backgroundColor = '#d0dbdf';
    this.btn2.style.backgroundColor = '#d0dbdf';
    this.btn3.style.backgroundColor = '#d0dbdf';
    this.btn4.style.backgroundColor = '#d0dbdf';
    this.btn5.style.backgroundColor = '#d0dbdf';
    this.btn6.style.backgroundColor = '#d0dbdf';
    this.nothingHere.style.display = 'none';
    if (category === 'all') {
      this.activityListLocal = this.activityList;
      this.btn1.style.backgroundColor = '#83a5c2';
      if (this.activityListLocal.length === 0) {
        this.nothingHere.style.display = 'block';
      }
    } else if (category === 'Highest Rating') {
      this.btn2.style.backgroundColor = '#83a5c2';
      this.sortActivityListLocal();
      if (this.activityListLocal.length === 0) {
        this.nothingHere.style.display = 'block';
      }
    } else {
      this.activityListLocal = this.activityList.filter(activity => activity.category === category);
      if (category === 'Entertainment') this.btn3.style.backgroundColor = '#83a5c2';
      if (category === 'Sport') this.btn5.style.backgroundColor = '#83a5c2';
      if (category === 'Drinking') this.btn4.style.backgroundColor = '#83a5c2';
      if (category === 'Other') this.btn6.style.backgroundColor = '#83a5c2';
      if (this.activityListLocal.length === 0) {
        this.nothingHere.style.display = 'block';
      }
    }
  }

  async deleteActivity(activityToDelete: Activity) {
    try {
      await httpClient.delete('activity/' + activityToDelete.id);
      this.activityList = this.activityList.filter(activity => activity.id !== activityToDelete.id);
      this.activityListLocal = this.activityListLocal.filter(activity => activity.id !== activityToDelete.id);
      this.showNotification('Deleted activity', 'info');
    } catch (error) {
      this.showNotification((error as Error).message, 'error');
    }
  }

  async createActivity(activityPartial: CustomEvent) {
    try {
      const partialActivity: Partial<Activity> = {
        title: activityPartial.detail.title,
        description: activityPartial.detail.description,
        motivationtitle: activityPartial.detail.motivationtitle,
        image: activityPartial.detail.image,
        category: activityPartial.detail.category,
        deletepermission: true
      };
      const response = await httpClient.post(`/activity/${this.meetId}`, partialActivity);
      const activity: Activity = await response.json();
      this.activityList = [...this.activityList, activity]; //append activity to screen so user does not have to reload the page to see the activity
      this.activityListLocal = [...this.activityListLocal, activity]; //also add activity to localList
      this.showNotification('Created activity', 'info');
    } catch (error) {
      this.showNotification((error as Error).message, 'error');
    }
    this.selectFilter('all');
  }
}
