/* Autor: Valentin Lieberknecht */

import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { httpClient } from '../../http-client';
import { router } from '../../router/router';
import { PageMixin } from '../page.mixin';

@customElement('app-delete-profile')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class DeleteProfileComponent extends PageMixin(LitElement) {
  async deleteProfile() {
    if (confirm('Do you really want to delete your profile?')) {
      const response = await httpClient.delete('/delete');
      if (response.status === 200) {
        this.showNotification('Profile deleted');
        router.navigate('/');
      }
    }
  }

  render() {
    return html`${this.renderNotification()}
      <div class="about-section">
        <h1>Delete your Profile</h1>
        <p>Do you really want to delete your profile?</p>
        <p>All your data gets deleted. Forever.</p>
        <button type="button" @click="${this.deleteProfile}">Yes remove my account!</button>
      </div> `;
  }
}
