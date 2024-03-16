// eslint-disable-next-line import/named
import { DOMOutputSpec, Node as ProseMirrorNode } from 'prosemirror-model';
// eslint-disable-next-line import/named
import { NodeView as BaseNodeView, EditorView } from 'prosemirror-view';
import { FORMAT_TYPE } from '../libs/types';

import { IMatcherConfig, TextMatcherHandler, ParseDOMMatcher } from './matcher';
import { FrankyEditor } from '../core-editor';
import { FrankyApi } from '../api';

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
  public config: S;

  constructor(formatType: FORMAT_TYPE, name: string, schema: S) {
    this.formatType = formatType;
    this.name = name;
    this.config = schema;
  }
  public getDisplay(): 'nodes' | 'marks' {
    if (this.formatType & FORMAT_TYPE.INLINE) {
      if (
        this.formatType & FORMAT_TYPE.CARD ||
        this.formatType & FORMAT_TYPE.ATOM
      ) {
        return 'nodes';
      }

      return 'marks';
    }
    return 'nodes';
  }
}

class Formattable<
  Structure extends any = any,
  Props extends any = any,
> extends FrankySchema<any> {
  public editor?: FrankyEditor;
  public props?: Partial<Props> = {};

  constructor(editor?: FrankyEditor, props?: Partial<Props>) {
    super();
    this.editor = editor;
    this.props = props;
  }
  public nodeView?: {
    new (
      api: FrankyApi,
      node: ProseMirrorNode,
      view: EditorView,
      getPos: boolean | (() => number),
    ): BaseNodeView;
  };
}

export { FrankySchema, SchemaMeta, Formattable };
