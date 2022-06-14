/* Autor: Jonathan Hüls */
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { router } from '../../router/router';
import { PageMixin } from '../page.mixin';
import componentStyle from './meetingUser.css';

interface Mate {
  id: string;
  name: string;
  firstName: string;
  src: string;
  age: string;
}

@customElement('meet-user')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class MeetUserComponent extends PageMixin(LitElement) {
  static styles = componentStyle;

  @property({ reflect: true }) mate = {} as Mate;

  render() {
    return html`<button type="button" class="meetingUser" @click=${(e: Event) => this.mateClicked(e)}>
      <img src=${this.mate.src} />
      <span class="h3">${this.mate.name}, ${this.mate.firstName}</span>
      <span class="mateAge">${this.mate.age}</span>
    </button>`;
  }

  private mateClicked(e: Event) {
    router.navigate('mates/profile/' + this.mate.id);
  }
}
