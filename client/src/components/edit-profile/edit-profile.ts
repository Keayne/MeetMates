/* Autor: Valentin Lieberknecht */

import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import { httpClient } from '../../http-client.js';
import { router } from '../../router/router.js';
import componentStyle from './edit-profile.css';

@customElement('app-edit-profile')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class SignUpComponent extends PageMixin(LitElement) {
  static styles = componentStyle;

  @query('form') private form!: HTMLFormElement;
  @query('#name') private nameElement!: HTMLInputElement;
  @query('#firstname') private firstnameElement!: HTMLInputElement;
  @query('#birthday') private birthdayElement!: HTMLInputElement;
  @query('#gender') private genderElement!: HTMLInputElement;

  @state() private descriptions: { id: string; ltext: string; rtext: string; value: number }[] = [];
  @state() private interests: { id: string; text: string; status: boolean }[] = [];
  @state() private imgSrc!: string;
  private selectedInterests: string[] = [];
  private selectedDescriptions: { id: string; value: number }[] = [];

  async firstUpdated() {
    try {
      const description = await httpClient.get('/profile/descriptions');
      this.descriptions = await description.json();
      const interests = await httpClient.get('/profile/interests');
      this.interests = await interests.json();
      const mate = await httpClient.get('/edit');
      const response = await mate.json();
      this.imgSrc = response.image;
      this.nameElement.value = response.mate.name;
      this.firstnameElement.value = response.mate.firstname;
      this.birthdayElement.value = response.mate.birthday;
      this.genderElement.value = response.mate.gender;
      response.interests.forEach((e: { interestid: string }) => {
        this.selectedInterests.push(e.interestid);
        const i = this.interests.findIndex(obj => obj.id === e.interestid);
        this.interests[i].status = true;
      });
      this.descriptions.forEach((e: { id: string; value: number }, i) => {
        e.value = response.descriptions[i].value;
        this.selectedDescriptions.push({
          id: e.id,
          value: response.descriptions[i].value
        });
      });
    } catch (e) {
      console.log(e);
    }
  }

  selectHobby(e: Event, hobby: string) {
    if (e.currentTarget instanceof HTMLElement) {
      const index = this.selectedInterests.indexOf(hobby);
      if (index == -1) {
        this.selectedInterests.push(hobby);
        e.currentTarget.style.backgroundColor = '#04aa6d';
      } else {
        this.selectedInterests.splice(index, 1);
        e.currentTarget.style.backgroundColor = '#eee';
      }
    }
  }

  updateDescription(e: CustomEvent) {
    const details = e.detail;
    const index = this.selectedDescriptions.findIndex(obj => obj.id == details.id);
    this.selectedDescriptions[index].value = Number(details.value);
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

  submit() {
    if (this.form.checkValidity()) {
      const accountData = {
        mate: {
          name: this.nameElement.value,
          firstname: this.firstnameElement.value,
          birthday: this.birthdayElement.value,
          gender: this.genderElement.value,
          image: this.imgSrc
        },
        interests: this.selectedInterests,
        descriptions: this.selectedDescriptions
      };
      try {
        httpClient.put('/edit', accountData);
        router.navigate('/');
      } catch (e) {
        this.showNotification((e as Error).message, 'error');
      }
    } else {
      this.form.reportValidity();
    }
  }

  render() {
    return html`
      ${this.renderNotification()}
      <form>
      <h1>Edit Profile</h1>
        <label>Firstname:</label>
        <input type="text" id="firstname" required />
        <label>Name:</label>
        <input type="text" id="name" required />
        <label>Gender:</label>
        <select id="gender" required>
          <option></option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="diverse">Diverse</option>
        </select>
        <label>Birthday:</label>
        <input type="date" id="birthday" required>
        <h3>Rate yourself here<h3>
        ${this.descriptions.map(
          e =>
            html` <sign-slider
              @updateDescription=${this.updateDescription}
              id=${e.id}
              ltext="${e.ltext}"
              rtext="${e.rtext}"
              value="${e.value}"
            ></sign-slider>`
        )}
        <h3>Choose your hobbies</h3>
        ${this.interests.map(
          interst =>
            //ts error comes from open issue: https://github.com/iFwu/vscode-styled-jsx/issues/18
            html`<div
              style=${interst.status ? 'background-color: #04aa6d' : 'background-color: #eee'}
              class="pill"
              @click=${(e: MouseEvent) => this.selectHobby(e, interst.id)}
            >
              <span>${interst.text}</span>
            </div>`
        )}
        <h3>Select profile picture</h3>
        <input @change="${this.updateImage}" type="file" accept="image/png, image/jpeg">
        <br>
        <img style="max-width: 200px; max-height: 200px;" src="${this.imgSrc}">
        <button type="button" @click="${this.submit}">Update Profile</button>
      </form>
    `;
  }
}
