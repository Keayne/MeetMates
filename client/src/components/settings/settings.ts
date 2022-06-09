/* Autor: Valentin Lieberknecht */

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
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
      case 'delete-profile':
        return html`<app-delete-profile></app-delete-profile>`;
    }
  }

  render() {
    return html`${this.renderNotification()}
      <div class="div">
        <a href="/mates/settings/edit-profile">Edit Profile</a>
        <a href="/mates/settings/change-email">Change Email</a>
        <a href="/mates/settings/change-password">Change Password</a>
        <a href="/mates/settings/delete-profile">Delete profile</a>
      </div>
      <div class="main">${this.currentComponent()}</div> `;
  }
}
