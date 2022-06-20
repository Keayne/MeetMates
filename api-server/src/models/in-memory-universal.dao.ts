/* Autor: Prof. Dr. Norman Lahme-Hütig (FH Münster) */

import { UniversalDAO } from './universal.dao.js';
import { Universal } from './universal.js';

export class InMemoryUniversalDAO<T extends Universal> implements UniversalDAO<T> {
  private entities = new Map<string, T>();

  createAndOverwrite(partEntity: Omit<T, 'createdAt'>): Promise<T> {
    throw new Error('Method not implemented.');
  }
  deleteOne(entityFilter: Partial<T>): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  findAllASC(entityFilter?: Partial<T> | undefined): Promise<T[]> {
    const result = [] as T[];
    for (const entity of Array.from(this.entities.values()).reverse()) {
      if (!entityFilter || this._matches(entity, entityFilter)) {
        result.push(entity);
      }
    }
    return Promise.resolve(result);
  }

  public async create(partEntity: Omit<T, keyof Universal>) {
    const entity = { ...partEntity, createdAt: new Date().getTime() };
    this.entities.set(entity.mateid, entity as T);
    return Promise.resolve(entity as T);
  }

  public async findAll(entityFilter?: Partial<T>) {
    const result = [] as T[];
    for (const entity of this.entities.values()) {
      if (!entityFilter || this._matches(entity, entityFilter)) {
        result.push(entity);
      }
    }
    return Promise.resolve(result);
  }

  public async findOne(entityFilter: Partial<T>) {
    for (const entity of this.entities.values()) {
      if (this._matches(entity, entityFilter)) {
        return Promise.resolve(entity);
      }
    }
    return Promise.resolve(null);
  }

  public async update(entity: Partial<T> & Pick<Universal, 'mateid'>) {
    if (entity.id && this.entities.has(entity.mateid)) {
      this._update(this.entities.get(entity.mateid)!, entity);
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  }

  public async delete(id: string) {
    return Promise.resolve(this.entities.delete(id));
  }

  public async deleteAll(entityFilter?: Partial<T>) {
    if (!entityFilter) {
      const entityCount = this.entities.size;
      this.entities.clear();
      return Promise.resolve(entityCount);
    } else {
      const entities = await this.findAll(entityFilter);
      for (const entity of entities) {
        this.entities.delete(entity.id);
      }
      return Promise.resolve(entities.length);
    }
  }

  private _matches(entity: T, filter: Partial<T>) {
    for (const prop of Object.getOwnPropertyNames(filter) as [keyof Partial<T>]) {
      if (entity[prop] !== filter[prop]) {
        return false;
      }
    }
    return true;
  }

  private _update(entity: T, updateEntity: Partial<T>) {
    for (const prop of Object.getOwnPropertyNames(updateEntity) as [keyof Partial<T>]) {
      entity[prop] = updateEntity[prop]!;
    }
  }
}
