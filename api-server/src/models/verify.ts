/* Autor: Valentin Lieberknecht */

import { Entity } from './entity.js';

export interface Verify extends Entity {
  mateid: string;
  token: string;
}
