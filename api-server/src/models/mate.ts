/* Autor: Valentin LIeberknecht */

import { Entity } from './entity.js';

export interface Mate extends Entity {
  id: string;
  name: string;
  firstname: string;
  email: string;
  birthday: string;
  gender: string;
  password: string;
}
