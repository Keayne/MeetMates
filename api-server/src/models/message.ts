/* Autor: Valentin Lieberknecht */

import { Entity } from './entity.js';

export interface Chat extends Entity {
  author: string;
  room: string;
  body: string;
  own?: string;
}
