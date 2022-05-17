/* Autor: Arne Schaper */

import { LitElement, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { httpClient } from '../../../http-client';
import { PageMixin } from '../../page.mixin';
import { Actitity } from '../find-activity';

import componentStyle from './new-activity.css';

@customElement('new-activity')
class CardComponent extends PageMixin(LitElement) {
  static styles = componentStyle;

  @property({ reflect: true }) activity = {} as Actitity;
  @query('#myForm') private myForm!: HTMLDivElement;
  @query('#title') private titlee!: HTMLInputElement;
  @query('#description') private description!: HTMLInputElement;
  @query('#motivationTitle') private motivationTitle!: HTMLInputElement;

  async submit(event: Event) {
    event.preventDefault();
    const partialActivity: Partial<Actitity> = {
      title: this.titlee.value,
      description: this.description.value,
      motivationtitle: this.motivationTitle.value
    };
    try {
      const response = await httpClient.post('/activity', partialActivity);
      this.titlee.value = '';
      this.description.value = '';
      this.motivationTitle.value = '';
    } catch (e) {
      this.showNotification((e as Error).message, 'error');
    }
  }

  render() {
    return html`
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
    `;
  }
  openForm() {
    this.myForm.style.display = 'block'; //TODO can't find object
  }

  closeForm() {
    this.myForm.style.display = 'none';
  }
}
