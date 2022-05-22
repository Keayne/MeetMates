/* Autor: Valentin Lieberknecht */

import { Entity } from './entity.js';

export interface Description extends Entity {
  ltext: string;
  rtext: string;
}
