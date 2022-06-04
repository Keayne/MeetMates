/* Autor: Jonathan Hüls */
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { PageMixin } from '../page.mixin';
import { router } from '../../router/router.js';
import componentStyle from './meet.css';

interface Meet {
  id: string;
  name: string;
  mates: Mate[];
}
interface Mate {
  id: string;
  name: string;
  firstName: string;
  src: string;
}
@customElement('meets-meet')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class MeetsMeetComponent extends PageMixin(LitElement) {
  static styles = componentStyle;

  @property({ reflect: true }) meet = {} as Meet;

  render() {
    //console.log(this.meet.mates);

    return html`<button type="button" class="meet" @click=${() => router.navigate(`/meet/${this.meet.id}`)}>
      <h2 class="name">${this.meet.name}</h2>
      <div>${repeat(this.meet.mates, mate => html`<meets-mate-icon .mate=${mate} />`)}</div>
    </button>`;
  }
}
