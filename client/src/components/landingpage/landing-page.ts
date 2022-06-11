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
          <div>
            <img class="quoteImg" src="/arne.jpg" />
          </div>
          <div>
            <span>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
              et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
              Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit
              amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna
              aliquyam erat, sed diam voluptua.
            </span>
            <div class="quoteAuthor">~ Arne Schaper</div>
          </div>
        </div>

        <div class="btnContainer">
          <input id="tryItBtn" type="button" @click=${() => router.navigate(`/meets`)} value="Try it Yourself !" />
        </div>

        <div class="quoteContainer">
          <div>
            <img class="quoteImg" src="/valentin.jpg" />
          </div>
          <div>
            <span>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
              et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
              Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit
              amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna
              aliquyam erat, sed diam voluptua.
            </span>
            <div class="quoteAuthor">~ Valentin Lieberknecht</div>
          </div>
        </div>

        <div class="quoteContainer">
          <div>
            <img class="quoteImg" src="/jonathan.jpg" />
          </div>
          <div>
            <span>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
              et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
              Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit
              amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna
              aliquyam erat, sed diam voluptua.
            </span>
            <div class="quoteAuthor">~ Jonathan Hüls</div>
          </div>
        </div>
      </div>`;
  }
}
