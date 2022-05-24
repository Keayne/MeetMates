/* Autor: Valentin Lieberknecht */

export interface Message {
  id: string;
  createdAt: number;
  author: string;
  posttime?: string;
  body: string;
  own: string;
}
