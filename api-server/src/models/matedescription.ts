/* Autor: Valentin LIeberknecht */

import { Universal } from './universal.js';

export interface MateDescription extends Universal {
  userid: string;
  descriptionid: string;
  value: number;
}
