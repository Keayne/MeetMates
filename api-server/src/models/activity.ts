/* Autor: Arne Schaper */
import { Entity } from './entity.js';

export interface Activity extends Entity {
  title: string;
  description: string;
  tooltip: string;
  tooltipcreatedby: string;
  motivationtitle: string;
  chosen: number;
  meetid: string;
  image?: string;
  category: string;
}
