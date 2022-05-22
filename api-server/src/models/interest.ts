/* Autor: Valentin Lieberknecht */

import { Entity } from './entity.js';

export interface Interest extends Entity {
  text: string;
  sort: string;
}
