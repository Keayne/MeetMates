/* Autor: Valentin Lieberknecht */

import { Entity } from './entity.js';

export interface Message extends Entity {
  author: string;
  room: string;
  body: string;
  posttime?: string;
  own?: string;
}
