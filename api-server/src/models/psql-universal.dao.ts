/* Autor: Valentin Lieberknecht */

import { Client } from 'pg';
import { UniversalDAO } from './universal.dao.js';
import { Universal } from './universal.js';

export class PsqlUniversalDAO<T extends Universal> implements UniversalDAO<T> {
  constructor(private db: Client, private table: string) {}

  public async create(partEntity: Omit<T, keyof Universal>) {
    const entity = { ...partEntity, createdAt: new Date().getTime() };

    const propertyNames = getPropertyNames(entity);
    const columnNames = propertyNames.map(prop => toColumnName(prop));
    const columnValues = propertyNames.map(propertyName => {
      return toColumnValue(entity[propertyName as keyof typeof entity]);
    });
    const stmt =
      'INSERT INTO ' + this.table + '(' + columnNames.join(',') + ')' + ' VALUES(' + columnValues.join(', ') + ')';

    await this.db.query(stmt);
    return entity as unknown as T;
  }

  public async findAll(entityFilter?: Partial<T>) {
    const query = 'SELECT * FROM ' + this.table + ' ' + createWhereClause(entityFilter);
    const result = await this.db.query(query);
    return result.rows as T[];
  }

  public async findOne(entityFilter: Partial<T>) {
    const query = 'SELECT * FROM ' + this.table + ' ' + createWhereClause(entityFilter) + ' LIMIT 1';
    const result = await this.db.query(query);
    return result && result.rows ? (result.rows[0] as T) : null;
  }

  public async update(entity: Partial<T>, primaryKeys: Array<{ key: string; value: unknown }>) {
    const parts: Array<string> = [];
    primaryKeys.forEach(primarykey => {
      parts.push(`${primarykey.key} = '${primarykey.value}' `);
    });

    let whereClause = ' WHERE ';

    for (let i = 0; i <= parts.length - 1; i++) {
      whereClause = i === parts.length - 1 ? whereClause + parts[i] : whereClause + parts[i] + 'AND ';
    }
    const query = 'UPDATE ' + this.table + ' ' + createSetClause(entity) + whereClause;
    await this.db.query(query);

    return true;
  }

  public async delete(createdAt: string) {
    const query = 'DELETE FROM ' + this.table + ' WHERE createdAt = ' + toColumnValue(createdAt);
    await this.db.query(query);
    return true;
  }

  public async deleteOne(entityFilter: Partial<T>) {
    const query = 'DELETE FROM ' + this.table + ' ' + createWhereClause(entityFilter);
    await this.db.query(query);
    return true;
  }

  public async deleteAll(entityFilter?: Partial<T>) {
    const query = 'DELETE FROM ' + this.table + ' ' + createWhereClause(entityFilter);
    const result = await this.db.query(query);
    return result.rowCount;
  }
}

function getPropertyNames<T extends Universal>(entity: Partial<T>) {
  return Object.getOwnPropertyNames(entity) as Array<Extract<keyof T, string>>;
}

function toColumnName(propertyName: string) {
  return '"' + propertyName + '"';
}

function toColumnValue(value: unknown) {
  if (typeof value === 'string') {
    return `'` + value.replace(/'/g, `''`) + `'`;
  } else {
    return value;
  }
}

function createWhereClause<T extends Universal>(entityFilter?: Partial<T>) {
  if (!entityFilter || !Object.getOwnPropertyNames(entityFilter).length) {
    return '';
  }
  const parts = getPropertyNames(entityFilter).map(propertyName => {
    const propertyValue = entityFilter[propertyName];
    return toColumnName(propertyName) + ' = ' + toColumnValue(propertyValue);
  });
  return 'WHERE ' + parts.join(' AND ');
}

function createSetClause<T extends Universal>(entityFilter: Partial<T>) {
  const parts = getPropertyNames(entityFilter).map(propertyName => {
    const propertyValue = entityFilter[propertyName];
    return toColumnName(propertyName) + ' = ' + toColumnValue(propertyValue);
  });
  return 'SET ' + parts.join(', ');
}
