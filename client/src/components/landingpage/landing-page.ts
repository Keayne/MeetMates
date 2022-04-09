/* Autor: Arne Schaper */

import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import componentStyle from './landing-page.css';

@customElement('landing-page')
class SignInComponent extends PageMixin(LitElement) {
  static styles = componentStyle;
  render() {
    return html`
      ${this.renderNotification()}
      <section>
        <div class="content">
          <div class="info">
            <p>We are MeetMates!</p>

            <a href="#" class="info-btn">Additional information</a>
          </div>
        </div>
      </section>
    `;
  }
}
