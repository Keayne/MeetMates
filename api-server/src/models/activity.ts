import { Entity } from './entity.js';

export interface Activity extends Entity {
  title: String;
  description: String;
  tooltip: String;
  tooltipcreatedby: String;
  motivationTitle: String;
  rating: number;
  chosen: number;
  meetId: String;
}
