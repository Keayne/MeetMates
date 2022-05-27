/* Autor: Arne Schaper */
import { Universal } from './universal.js';

export interface Rating extends Universal {
  activityid: string;
  userid: string;
  rating: number;
}
