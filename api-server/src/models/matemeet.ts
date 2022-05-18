/* Autor: Jonathan Hüls */

import { Universal } from './universal.js';

export interface MateMeet extends Universal {
  userid: string;
  meetid: string;
  rating: number;
}
