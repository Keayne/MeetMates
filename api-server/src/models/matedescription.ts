/* Autor: Valentin LIeberknecht */

import { Universal } from './universal.js';

export interface MateDescription extends Universal {
  meetid: string;
  mateid: string;
  rating: number;
}
