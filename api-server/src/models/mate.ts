/* Autor: Valentin Lieberknecht */

import { Entity } from './entity.js';

export interface Mate extends Entity {
  active?: boolean;
  name: string;
  firstname: string;
  email?: string;
  birthday: string;
  gender: string;
  image: string;
  password: string;
}
