/* Autor: Arne Schaper */

import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import componentStyle from './activity.css';

@customElement('activity')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ActivityComponent extends LitElement {
  static styles = componentStyle;

  render() {
    return html`
      <template id="card-template">
        <img class="image" />
        <div class="body">
          <div class="title"></div>
          <div class="content"></div>
        </div>
      </template>
      <h1>ACTIVITY!</h1>
      <div class="card" data-title="Titel" data-image="pic.png">Dies ist der <b>Inhalt</b> der Karte</div>
    `;
  }
}
