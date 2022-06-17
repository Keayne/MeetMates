/* Autor: Valentin Lieberknecht */

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('show-rating')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class RatingComponent extends LitElement {
  static styles = css`
    table {
      width: 100%;
    }
    td {
      width: 26%;
    }
    .slider {
      height: 15px;
      border-radius: 5px;
      background: #d3d3d3;
      outline: none;
    }
    .slider::-moz-range-thumb {
      width: 20px;
      height: 20px;
      background: #04aa6d;
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
  @property() value!: number;

  render() {
    return html`
      <table>
        <tr>
          <td>${this.ltext}</td>
          <td>
            <input id="${this.id}" type="range" min="1" max="11" value="${this.value}" class="slider" disabled />
          </td>
          <td>${this.rtext}</td>
        </tr>
      </table>
    `;
  }
}
