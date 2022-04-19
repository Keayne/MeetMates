/* Autor: Valentin Lieberknecht */

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('sign-slider')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class RatingComponent extends LitElement {
  static styles = css`
    table {
      width: 100%;
    }
    td {
      width: 36%;
    }
    .slider {
      height: 15px;
      border-radius: 5px;
      background: #d3d3d3;
      outline: none;
    }
    .slider::-moz-range-thumb {
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background: #04aa6d;
      cursor: pointer;
    }
  `;
  @property({ type: Number }) value = 1;
  @property({ type: Number }) max = 5;
  @property({ type: String }) left = '';
  @property({ type: String }) right = '';

  render() {
    return html`
      <table>
        <tr>
          <td>${this.left}</td>
          <td><input type="range" min="1" max="11" value="6" class="slider" /></td>
          <td>${this.right}</td>
        </tr>
      </table>
    `;
  }
}
