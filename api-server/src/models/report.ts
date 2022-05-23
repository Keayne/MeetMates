/* Autor: Jonathan Hüls */
import { Entity } from './entity.js';

export interface Report extends Entity {
  document_uri: string;
  referrer: string;
  violated_directive: string;
  effective_directive: string;
  original_policy: string;
  disposition: string;
  blocked_uri: string;
  status_code: number;
}
