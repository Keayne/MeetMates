/* Autor: Jonathan Hüls */

import { Entity } from './entity.js';

export interface Meet extends Entity {
  name: string;
  activityId: string;
}
