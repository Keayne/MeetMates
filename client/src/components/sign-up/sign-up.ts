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
  @query('#passwordCheck') private passwordCheckElement!: HTMLInputElement;

  @state() private descriptions: { id: string; ltext: string; rtext: string }[] = [];
  @state() private interests: { id: string; text: string }[] = [];
  @state() private imgSrc!: string;
  @state() private passwordMessage!: string;
  @state() private passwordCheckMessage!: string;
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
          value: 6
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
  checkPassword() {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*#?&-_=()]{8,}$/gm;
    if (!regex.test(this.passwordElement.value)) {
      this.passwordMessage =
        'Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters';
    } else {
      this.passwordMessage = 'good password!';
    }
    this.checkCheckPassword();
  }

  checkCheckPassword() {
    if (this.passwordElement.value !== this.passwordCheckElement.value) {
      this.passwordCheckMessage = 'does not match';
    } else {
      this.passwordCheckMessage = 'matching';
    }
  }

  submit() {
    if (this.form.checkValidity()) {
      if (this.passwordElement.value === this.passwordCheckElement.value) {
        const accountData = {
          name: this.nameElement.value,
          firstname: this.firstnameElement.value,
          email: this.emailElement.value,
          birthday: this.birthdayElement.value,
          gender: this.genderElement.value,
          image: this.imgSrc,
          password: this.passwordElement.value,
          passwordCheck: this.passwordCheckElement.value,
          interests: this.selectedInterests,
          descriptions: this.selectedDescriptions
        };
        try {
          httpClient.post('/sign-up', accountData);
          router.navigate('/');
        } catch (e) {
          this.showNotification((e as Error).message, 'error');
        }
      } else {
        alert('Password does not match!');
      }
    } else {
      this.form.reportValidity();
    }
  }

  render() {
    return html`
      ${this.renderNotification()}
      <form>
      <h1>Register</h1>
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
        <label>Email:</label>
        <input type="email" id="email" required />
        <label>Password:</label>
        <input type="password" id="password" @keyup="${
          this.checkPassword
        }" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$" required />
        <span>${this.passwordMessage}</span>
        <br>
        <label>Password Check:</label>
        <input type="password" @keyup="${this.checkCheckPassword}" id="passwordCheck" required />
        <span>${this.passwordCheckMessage}</span>
        <h3>Rate yourself here<h3>
        ${this.descriptions.map(
          e =>
            html` <sign-slider
              @updateDescription=${this.updateDescription}
              id=${e.id}
              ltext="${e.ltext}"
              rtext="${e.rtext}"
            ></sign-slider>`
        )}
        <h3>Choose your hobbies</h3>
        ${this.interests.map(
          interst =>
            html`<div class="pill" @click=${(e: MouseEvent) => this.selectHobby(e, interst.id)}>
              <span>${interst.text}</span>
            </div>`
        )}
        <h3>Select profile picture</h3>
        <input @change="${this.updateImage}" type="file" accept="image/png, image/jpeg" required>
        <br>
        <img style="max-width: 200px; max-height: 200px" src="${this.imgSrc}">
        <button type="button" @click="${this.submit}" >Konto erstellen</button>
      </form>
    `;
  }
}
