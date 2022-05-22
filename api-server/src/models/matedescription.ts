/* Autor: Valentin Lieberknecht */

import { Universal } from './universal.js';

export interface MateDescription extends Universal {
  mateid: string;
  descriptionid: string;
  value: number;
}
