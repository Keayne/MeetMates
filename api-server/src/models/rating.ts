import { Universal } from './universal.js';

export interface Rating extends Universal {
  activityid: String;
  userid: String;
  rating: number;
}
