import { Entity } from './entity.js';

export interface Activity extends Entity {
  title: String;
  description: String;
  tooltip: String;
  tooltipcreatedby: String;
  motivationtitle: String;
  rating: number;
  chosen: number;
  meetid: String;
}
