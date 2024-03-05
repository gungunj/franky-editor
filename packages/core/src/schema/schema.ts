// eslint-disable-next-line import/named
import { DOMOutputSpec, Node as ProseMirrorNode } from 'prosemirror-model';
import { FORMAT_TYPE } from '../libs/types';

import { IMatcherConfig, TextMatcherHandler, ParseDOMMatcher } from './matcher';

class FrankySchema<Structure> {
  public name = '';
  public attrs?: {
    [key in keyof Structure]: {
      default?: Structure[key];
    };
  };
  public isolating?: boolean;
  // it will help `toDOM` if provide `tagName`, otherwise will use default `tagName`
  public tagName?(node: ProseMirrorNode): string;
  public textMatcher?: Array<
    IMatcherConfig<RegExp | RegExp[], TextMatcherHandler>
  >;
  public parseDOM?: ParseDOMMatcher<Structure>[];
  public toDOM?(node: ProseMirrorNode): DOMOutputSpec;
}

class SchemaMeta<S extends FrankySchema<any> = FrankySchema<any>> {
  public formatType: FORMAT_TYPE;
  public name: string;
  public schema: S;

  constructor(formatType: FORMAT_TYPE, name, schema: S) {
    this.formatType = formatType;
    this.name = name;
    this.schema = schema;
  }
}
export { FrankySchema, SchemaMeta };
