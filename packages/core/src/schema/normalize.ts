// eslint-disable-next-line import/named
import { Schema, SchemaSpec } from 'prosemirror-model';
import { StringMap } from '../libs/types';
import clone from 'lodash.clonedeep';
import { SchemaMeta } from './schema';

const createSchema = (schema: SchemaSpec) => new Schema(schema);

const updateSchema = (origin: SchemaSpec, patches: SchemaMeta[]) => {
  const newSchema = clone(origin);

  patches
    .filter((p) => p && p.name)
    .reduce((res, cur) => {
      const name = cur.name;
      const type = cur.getDisplay();
      const spec = res[type] as StringMap<any>;

      spec[name] && console.warn('repeat registration', name);
      spec[name] = cur.config;

      return res;
    }, newSchema);

  return newSchema;
};

export { createSchema, updateSchema };
