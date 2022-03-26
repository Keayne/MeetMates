/* Autor: Valentin Lieberknecht */

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { range } from 'lit/directives/range.js';

@customElement('sign-rating')
class RatingComponent extends LitElement {
  static styles = css`
    :host {
      color: lightgray;
      cursor: default;
    }
    [checked] {
      color: #0093d1;
    }
    p {
      display: inline;
      color: black;
    }
  `;
  @property({ type: Number }) value = 1;
  @property({ type: Number }) max = 5;
  @property({ type: String }) left = '';
  @property({ type: String }) right = '';

  render() {
    return html`<p>${this.left}</p>
      ${map(
        range(this.max),
        (i: number) => html`<span ?checked=${i + 1 <= this.value} @click=${() => (this.value = i + 1)}>★</span>`
      )}
      <p>${this.right}</p>
      <br />`;
  }
}
