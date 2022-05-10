/* Autor: Valentin Lieberknecht */

import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import { httpClient } from '../../http-client.js';
import { router } from '../../router/router.js';
import componentStyle from './sign-up.css';

@customElement('app-sign-up')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class SignUpComponent extends PageMixin(LitElement) {
  static styles = componentStyle;

  @query('form') private form!: HTMLFormElement;
  @query('#name') private nameElement!: HTMLInputElement;
  @query('#firstname') private firstnameElement!: HTMLInputElement;
  @query('#email') private emailElement!: HTMLInputElement;
  @query('#birthday') private birthdayElement!: HTMLInputElement;
  @query('#gender') private genderElement!: HTMLInputElement;
  @query('#password') private passwordElement!: HTMLInputElement;

  @state() private descriptions: Array<{ id: string; ltext: string; rtext: string }> = [];
  @state() private interests: Array<{ id: string; text: string }> = [];
  @state() private imgSrc!: string;
  private selectedInterests: string[] = [];
  private selectedDescriptions: { id: string; value: number }[] = [];

  async firstUpdated() {
    try {
      const description = await httpClient.get('/profile/descriptions');
      this.descriptions = await description.json();
      const interests = await httpClient.get('/profile/interests');
      this.interests = await interests.json();
      this.descriptions.forEach((e: { id: string }) => {
        this.selectedDescriptions.push({
          id: e.id,
          value: 0
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
        e.currentTarget.style.backgroundColor = '#04204a';
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
        name: this.nameElement.value,
        firstname: this.firstnameElement.value,
        email: this.emailElement.value,
        birthday: this.birthdayElement.value,
        gender: this.genderElement.value,
        image: this.imgSrc,
        password: this.passwordElement.value,
        interests: this.selectedInterests,
        descriptions: this.selectedDescriptions
      };
      try {
        httpClient.post('mates/sign-up', accountData);
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
      <h1>Registrieren</h1>
      <form>
        <label>Vorname:</label>
        <input type="text" id="firstname" required />
        <label>Nachname:</label>
        <input type="text" id="name" required />
        <label>Geschlecht:</label>
        <select id="gender" required>
          <option></option>
          <option value="male">Männlich</option>
          <option value="female">Weiblich</option>
          <option value="diverse">Divers</option>
        </select>
        <label>Geburtstag:</label>
        <input type="date" id="birthday" required>
        <label>Email:</label>
        <input type="email" id="email" required />
        <label>Passwort:</label>
        <input type="password" id="password" required />
        <h3>Rate hier dich selbst<h3>
        ${this.descriptions.map(
          e =>
            html` <sign-slider
              @updateDescription=${this.updateDescription}
              id=${e.id}
              ltext="${e.ltext}"
              rtext="${e.rtext}"
            ></sign-slider>`
        )}
        <h3>Wähle hier ein paar Hobbys aus</h3>
        ${this.interests.map(
          interst =>
            html`<div class="pill" @click=${(e: MouseEvent) => this.selectHobby(e, interst.id)}>
              <span>${interst.text}</span>
            </div>`
        )}
        <h3>Profilbild auswählen</h3>
        <input @change="${this.updateImage}" type="file" accept="image/png, image/jpeg" required>
        <br>
        <img style="max-width: 200px; max-height: 200px" src="${this.imgSrc}">
        <button type="button" @click="${this.submit}" >Konto erstellen</button>
      </form>
    `;
  }
}
