/* Autor: Jonathan Hüls */
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import componentStyle from './meet.css';

interface mate {
  name: string;
  firstName: string;
  src: string;
  age: string;
}
const userJson: mate[] = [
  {
    name: 'Müller',
    firstName: 'Peter',
    src: '/favicon.png',
    age: '15'
  },
  {
    name: 'Bach',
    firstName: 'Jürgen',
    src: '',
    age: '123'
  },
  {
    name: 'Meyer',
    firstName: 'Lisa',
    src: '',
    age: '23'
  }
];

@customElement('app-your-meet')
class YourMeetComponent extends PageMixin(LitElement) {
  static styles = componentStyle;
  @property({ type: JSON }) mates = userJson;
  @property() meetId!: string;
  @property({ type: String }) meetingName = 'Filler Text';

  render() {
    const matesTemp = [];
    for (const m of this.mates) {
      matesTemp.push(
        html`<meet-user name="${m.name}" firstName="${m.firstName}" age="${m.age}" imgSrc="${m.src}"></meet-user>`
      );
    }
    return html`${this.renderNotification()}
      <div class="meeting">
        <h1 class="meetingName">${this.meetingName}</h1>
        <div class="meetingUsers">${matesTemp}</div>
        <meet-chat></meet-chat>
      </div>`;
  }
}
