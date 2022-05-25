/* Autor: Valentin Lieberknecht */

import { Universal } from './universal.js';

export interface UniversalDAO<T extends Universal> {
  create(partEntity: Omit<T, keyof Universal>): Promise<T>;

  findAll(entityFilter?: Partial<T>): Promise<T[]>;

  findOne(entityFilter: Partial<T>): Promise<T | null>;

  update(entity: Partial<T>, primaryKeys: Array<{ key: string; value: unknown }>): Promise<boolean>;

  delete(id: string): Promise<boolean>;

  deleteOne(entityFilter: Partial<T>): Promise<boolean>;

  deleteAll(entityFilter?: Partial<T>): Promise<number>;
}
