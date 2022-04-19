/* Autor: Jonathan Hüls */

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import componentStyle from './meets.css';

const userJson = [
  {
    name: 'Müller',
    firstname: 'Peter',
    src: 'https://lh3.googleusercontent.com/ogw/ADea4I4oHiicNWrPtZiaZzAMB-Nl35i4NbU4ymarKsVN=s32-c-mo'
  },
  {
    name: 'Bach',
    firstname: 'Jürgen',
    src: 'team_10/client/public/temp_logo.jpg'
  },
  {
    name: 'Meyer',
    firstname: 'Lisa',
    src: 'team_10/client/public/temp_logo.jpg'
  }
];

@customElement('app-meets')
class MeetsComponent extends PageMixin(LitElement) {
  static styles = componentStyle;
  @property({ type: JSON }) users = userJson;

  render() {
    return html`${this.renderNotification()}
      <div class="meets">
        <div class="meets-header">
          <h2>New Meets</h2>
        </div>
        <div class="meets-body">
          <meets-meet id="123" name="Test" users=${this.users}></meets-meet>
          <meets-meet id="456" name="Test2"></meets-meet>
          <meets-meet id="789" name="Test3"></meets-meet>
        </div>
      </div>`;
  }
}
