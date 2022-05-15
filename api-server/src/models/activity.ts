import { Entity } from './entity.js';

export interface Activity extends Entity {
  title: String;
  description: String;
  tooltip: String;
  motivationTitle: String;
}
