/* Autor: Valentin Lieberknecht */

import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PageMixin } from '../page.mixin';
import componentStyle from './about.css';

@customElement('app-about')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class AboutComponent extends PageMixin(LitElement) {
  static styles = componentStyle;

  render() {
    return html`${this.renderNotification()}
      <div class="about-section">
        <h1>Über Uns</h1>
        <p>
          Wir sind Arne, Jonathan und Valentin. Zur Zeit studieren wir im 4. Semester Wirtschaftsinformatik an der
          Fachhochschule in Münster.
        </p>
        <p>
          In unserem Studium haben wir Coronabedingt kaum möglichkeiten andere Menschen kennen zu lernen so, dass wir im
          Laufe unserer gemeinsamen Web-Engineering Vorlesung auf die Idee von MeetMates als Projektarbeit kamen.
        </p>
      </div> `;
  }
}
