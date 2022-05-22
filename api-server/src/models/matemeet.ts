/* Autor: Jonathan Hüls */

import { Universal } from './universal.js';

export interface MateMeet extends Universal {
  mateid: string;
  meetid: string;
  rating: number;
}
