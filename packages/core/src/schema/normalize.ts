import { Schema, SchemaSpec } from 'prosemirror-model';
import clone from 'lodash.clonedeep';

const createSchema = (schema: SchemaSpec) => new Schema(schema);

const updateSchema = (origin: SchemaSpec, patches: SchemaMeta[]) => {
  const newSchema = clone(origin);

  patches
    .filter((p) => p && p.name)
    .reduce((res, cur) => {
      const name = cur.name;
      const type = cur.getDisplay();
      const spec = res[type] as Types.StringMap<any>;

      spec[name] && console.warn('repeat registration', name);
      spec[name] = cur.config;

      return res;
    }, newSchema);

  return newSchema;
};

export { createSchema, updateSchema };
