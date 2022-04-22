/* Autor: Jonathan Hüls */
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import componentStyle from './meet.css';

const userJson = [
  {
    name: 'Müller',
    firstname: 'Peter',
    src: 'team_10/client/public/temp_logo.jpg',
    age: '15'
  },
  {
    name: 'Bach',
    firstname: 'Jürgen',
    src: 'team_10/client/public/temp_logo.jpg',
    age: '123'
  },
  {
    name: 'Meyer',
    firstname: 'Lisa',
    src: 'team_10/client/public/temp_logo.jpg',
    age: '23'
  }
];

@customElement('app-your-meet')
class YourMeetComponent extends PageMixin(LitElement) {
  static styles = componentStyle;
  @property({ type: JSON }) users = userJson;
  @property({ type: String }) meetingName = 'Filler Text';

  render() {
    return html`${this.renderNotification()}
      <div class="meeting">
        <h1 class="meetingName">${this.meetingName}</h1>
        <div class="meetingUsers">
          <meet-user name="Peter" firstName="Meyer" age="12"></meet-user>
          <meet-user name="Peter" firstName="Meyer" age="12" imgSrc="/favicon.png"></meet-user>
          <meet-user name="Peter" firstName="Meyer" age="12"></meet-user>
        </div>
        <meet-chat></meet-chat>
      </div>`;
  }
}
