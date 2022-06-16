/* Autor: Arne Schaper */

import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { PageMixin } from '../../page.mixin';
import { Activity } from '../find-activity';
import componentStyle from './create-activity.css';

@customElement('create-activity')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ActivityRatingComponent extends PageMixin(LitElement) {
  static styles = componentStyle;

  @query('#myForm') private myForm!: HTMLDivElement;
  @query('#title') private titlee!: HTMLInputElement;
  @query('#image') private image!: HTMLInputElement;
  @query('#description') private description!: HTMLInputElement;
  @query('#motivationTitle') private motivationTitle!: HTMLInputElement;
  @query('#category') private category!: HTMLSelectElement;
  @state() private imgSrc!: string;

  render() {
    return html`
      <!-- New Create Activity -->
      <button class="open-button" @click="${this.openForm}"><h2>Create an activity</h2></button>
      <div class="form-popup" id="myForm">
        <form @submit="${this.submit}" class="form-container">
          <h2>New Activity</h2>
          <label for="title"><b>Title</b></label
          ><br />
          <input
            type="text"
            placeholder="Your Title"
            name="title"
            id="title"
            maxlength="18"
            minlength="4"
            required
            autocomplete="off"
          />
          <br /><label for="description"><b>Description</b></label
          ><br />
          <input
            type="text"
            placeholder="What is your activity?"
            name="description"
            id="description"
            required
            autocomplete="off"
            maxlength="100"
            minlength="20"
          /><br />
          <label for="category"><b>Choose a category</b></label
          ><br />
          <select id="category" name="category" required>
            <option value="Sport">Sport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Drinking">Drinking</option>
            <option value="Other">Other</option></select
          ><br /><br />
          <label for="Image"><b>Image</b></label
          ><br />
          <input
            @change="${this.updateImage}"
            type="file"
            id="inputimage"
            accept="image/png, image/jpeg"
            required
          /><br />
          <img style="max-width: 200px; max-height: 200px" />
          <br /><label for="description"><b>Motivation Title</b></label
          ><br />
          <input
            type="text"
            placeholder="Why should you do this together?"
            name="motivationTitle"
            id="motivationTitle"
            required
            autocomplete="off"
          /><br />
          <button type="submit" class="btn">Create Activity</button><br />
          <button type="button" class="btn cancel" @click="${this.closeForm}">Close</button>
        </form>
      </div>
      <!-- End New Create Activity -->
    `;
  }

  /**
   * Creates an activity and sends it to the server
   * @param event Activity (Partial) to be submitted
   */
  async submit(event: Event) {
    event.preventDefault();
    const partialActivity: Partial<Activity> = {
      title: this.titlee.value,
      description: this.description.value,
      motivationtitle: this.motivationTitle.value,
      image: this.imgSrc,
      category: this.category.value,
      deletepermission: true
    };
    try {
      this.emit('activitycreated', partialActivity);
      //emty fields of form
      this.titlee.value = '';
      this.description.value = '';
      this.motivationTitle.value = '';
      this.category.value = '';
      this.imgSrc = ''; //only clears preview of image
      //this.image = ''; TODO
      //emty fields of form end
    } catch (e) {
      this.showNotification((e as Error).message, 'error');
    }
    this.closeForm();
    this.showNotification('Added activity.', 'info');
  }

  openForm() {
    if (this.myForm.style.display === '' || this.myForm.style.display === 'none') this.myForm.style.display = 'block';
    else this.myForm.style.display = 'none';
  }

  closeForm() {
    this.myForm.style.display = 'none';
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

  emit(eventType: string, eventData = {}) {
    const event = new CustomEvent(eventType, {
      detail: eventData,
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }
}
