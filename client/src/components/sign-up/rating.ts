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
    @media (max-width: 600px) {
      td {
        font-size: 14px;
        width: 34%;
      }
      .slider {
        width: 95%;
      }
    }
  `;
  @property() ltext = '';
  @property() rtext = '';
  @property() id = '';
  @property() value = 6;

  updateDescription(e: Event) {
    if (e.target instanceof HTMLInputElement) {
      this.dispatchEvent(
        new CustomEvent('updateDescription', {
          detail: {
            id: this.id,
            value: e.target.value
          }
        })
      );
    }
  }

  render() {
    return html`
      <table>
        <tr>
          <td>${this.ltext}</td>
          <td>
            <input
              id="${this.id}"
              type="range"
              @input="${this.updateDescription}"
              min="1"
              max="11"
              value="${this.value}"
              class="slider"
            />
          </td>
          <td>${this.rtext}</td>
        </tr>
      </table>
    `;
  }
}
