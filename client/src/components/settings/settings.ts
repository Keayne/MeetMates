/* Autor: Valentin Lieberknecht */

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { httpClient } from '../../http-client';
import { router } from '../../router/router';
import { PageMixin } from '../page.mixin';
import componentStyle from './settings.css';

@customElement('app-settings')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class SettingsComponent extends PageMixin(LitElement) {
  static styles = componentStyle;
  @property() comp!: string;

  async firstUpdated() {
    this.currentComponent();
  }

  currentComponent() {
    switch (this.comp) {
      case 'edit-profile':
        return html`<app-edit-profile></app-edit-profile>`;
      case 'change-email':
        return html`<app-change-email></app-change-email>`;
      case 'change-password':
        return html`<app-change-password></app-change-password>`;
    }
  }

  async deleteProfile() {
    if (confirm('Do you really want to delete your profile?')) {
      const response = await httpClient.delete('/delete');
      if (response.status === 200) {
        this.showNotification('Profile deleted');
        router.navigate('/');
      }
    } else {
      console.log('Cancelled');
    }
  }

  render() {
    return html`${this.renderNotification()}
      <div class="sidenav">
        <a href="/mates/settings/edit-profile">Edit Profile</a>
        <a href="/mates/settings/change-email">Change Email</a>
        <a href="/mates/settings/change-password">Change Password</a>
        <a @click=${this.deleteProfile}>Delete your profile</a>
      </div>
      <div class="main">${this.currentComponent()}</div> `;
  }
}
