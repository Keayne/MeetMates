/* Autor: Valentin Lieberknecht */

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import componentStyle from './footer.css';

@customElement('app-footer')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class FooterComponent extends LitElement {
  static styles = componentStyle;

  @property({ type: Array }) linkItems: Array<{ title: string; routePath: string }> = [];

  render() {
    return html`<footer class="footer-distributed fixedFooter ">
      <div class="footer-right"></div>

      <div class="footer-left">
        <p class="footer-links">
          <a class="link-1" href="#">Home</a>
          <a href="#">FAQ</a>
          <a href="about">About</a>
        </p>
        <p>Meet Mates &copy; 2022</p>
      </div>
    </footer>`;
  }
}
