/* Autor: Valentin Lieberknecht */

import { Universal } from './universal.js';

export interface Verify extends Universal {
  mateid: string;
  type: string;
  token: string;
  code?: number;
  email?: string;
}
