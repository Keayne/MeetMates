import { Entity } from './entity.js';

export interface Activity extends Entity {
  title: String;
  description: String;
  tooltip: String;
  tooltipcreatedby: String;
  motivationtitle: String;
  chosen: number;
  meetid: String;
  image: String;
  category: String;
}
