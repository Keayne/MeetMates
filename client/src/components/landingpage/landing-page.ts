/* Autor: Jonathan Hüls */

import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import componentStyle from './landing-page.css';
import { router } from '../../router/router.js';
@customElement('landing-page')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class AboutComponent extends PageMixin(LitElement) {
  static styles = componentStyle;

  render() {
    return html`${this.renderNotification()}
      <div class="landingPage">
        <div class="quoteContainer">
          <img class="quoteImg" src="arne.jpg" />
          <div>
            <span> Noch nie war andere Menschen mit gleichen Interessen zu finden so einfach! </span>
            <div class="quoteAuthor">~ Arne Schaper</div>
          </div>
        </div>

        <div class="btnContainer">
          <input id="tryItBtn" type="button" @click=${() => router.navigate(`/meets`)} value="Try it Yourself !" />
        </div>

        <div class="quoteContainer">
          <img class="quoteImg" src="valentin.jpg" />
          <div>
            <span>
              MeetMates ermöglicht es jedem, sich mit neuen Menschen zu verbinden und Freundschaften zu schließen.
            </span>
            <div class="quoteAuthor">~ Valentin Lieberknecht</div>
          </div>
        </div>

        <div class="quoteContainer">
          <img class="quoteImg" src="jonathan.jpg" />
          <div>
            <span> Endlich wird Freunde finden einfach, und dazu noch entspannt. </span>
            <div class="quoteAuthor">~ Jonathan Hüls</div>
          </div>
        </div>
      </div>`;
  }
}
