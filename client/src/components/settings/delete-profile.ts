/* Autor: Valentin Lieberknecht */

import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { httpClient } from '../../http-client';
import { router } from '../../router/router';
import { PageMixin } from '../page.mixin';

@customElement('app-delete-profile')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class DeleteProfileComponent extends PageMixin(LitElement) {
  static styles = css`
    label {
      width: 10em;
      display: inline-block;
    }
    .section {
      max-width: 600px;
      text-align: left;
      margin: 30px auto;
    }
    label {
      color: rgb(104, 103, 103);
      display: inline-block;
      margin: 10px 0 15px;
      font-size: 0.7em;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: bold;
    }
    input {
      display: block;
      padding: 10px 6px;
      width: 100%;
      box-sizing: border-box;
      border: none;
      border-bottom: 1px solid rgb(168, 168, 168);
      color: #555;
    }
    button {
      margin-top: 5%;
      width: 100%;
      border: none;
      outline: none;
      padding: 12px 16px;
      background-color: #f1f1f1;
      cursor: pointer;
      border-radius: 8px;
    }
  `;
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
      <div class="section">
        <h1>Delete your Profile</h1>
        <p>Do you really want to delete your profile?</p>
        <p>All your data gets deleted. Forever.</p>
        <button type="button" @click="${this.deleteProfile}">Yes remove my account!</button>
      </div> `;
  }
}
