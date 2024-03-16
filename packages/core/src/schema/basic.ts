import { updateSchema } from './normalize';
import { Formattable, FrankySchema, SchemaMeta } from './schema';
import { FORMAT_TYPE, StringMap } from '../libs/types';
import { parseDomStyleToAttrs, parseAttrsToDomStyle } from '../libs/parse';
import {
  // eslint-disable-next-line import/named
  DOMOutputSpec,
  Node as ProseMirrorNode,
  // eslint-disable-next-line import/named
} from 'prosemirror-model';

interface IParagraphAttrs {
  align: string;
  class: string;
  lineIndent: string | number;
  spaceBefore: string | number;
  spaceBoth: string | number;
  lineHeight: string | number;
}

class Doc extends FrankySchema<never> {
  public name = 'doc';
  public content = 'block+';
}

const createWrapperDOM = (
  tagName: string,
  attrs: StringMap<any> = {},
  hasContent = false,
): DOMOutputSpec => {
  const displayAttrs: StringMap<string> = {};
  Object.keys(attrs).forEach((key) => {
    const attr = attrs[key] as string;
    if (attr) displayAttrs[key] = attr as string;
  });

  const pDOM: DOMOutputSpec = [tagName, displayAttrs];
  // if (hasContent) pDOM[2] = 0;

  return pDOM;
};

class Block<Structure> extends Formattable<Structure> {
  public group = 'block';
  public content = 'inline*';
  public inline = false;
  public defining = true;
  public draggable = false;
  public selectable = false;
  public tagName(node: ProseMirrorNode) {
    return 'div';
  }
  public toDOM = (node: ProseMirrorNode) =>
    createWrapperDOM(this.tagName(node), node.attrs, Boolean(this.content));
}

class Paragraph extends Block<IParagraphAttrs> {
  public name = 'paragraph';

  // calc em/rem
  public defaultFontSize = 16;
  public canMatch = (dom: HTMLParagraphElement) => true;
  public formatAttrs = (v: StringMap<any>, dom: HTMLElement) => v;

  public attrs = {
    align: {
      default: 'left',
    },
    class: {
      default: '',
    },
    lineIndent: {
      default: 0,
    },
    spaceBefore: {
      default: 0,
    },
    spaceBoth: {
      default: 0,
    },
    lineHeight: {
      default: 1.5,
    },
  };

  public parseDOM = [
    {
      tag: 'p',
      // priority 规则优先级
      getAttrs: (dom: HTMLParagraphElement) => {
        if (!this.canMatch(dom)) return false;

        const style = dom.getAttribute('style') || '';
        this.formatAttrs(
          {
            ...parseDomStyleToAttrs(style, undefined, this.defaultFontSize),
            class: dom.className,
          },
          dom,
        );
      },
    },
  ];

  public toDOM = (node: ProseMirrorNode) => {
    const attrs: { style?: string; class?: string } = {};
    const style = parseAttrsToDomStyle(node.attrs, this.attrs);
    if (style) attrs.style = style;
    if (node.attrs.class) attrs.class = node.attrs.class;
    return ['p', attrs, 0] as DOMOutputSpec;
  };
}

class Text extends FrankySchema<never> {
  public name = 'text';
  public group = 'inline';
}

class Break extends Formattable<never> {
  public group = 'inline';
  public inline = true;
  public name = 'break';
  public selectable = false;
  public content = undefined;
  public parseDOM = [{ tag: 'br' }];
  public toDOM = () => ['br'] as DOMOutputSpec;
}

const basicSchema = updateSchema(
  {
    nodes: {},
    marks: {},
  },
  [
    new SchemaMeta(FORMAT_TYPE.BLOCK, 'doc', new Doc()),
    new SchemaMeta(FORMAT_TYPE.BLOCK, 'paragraph', new Paragraph()),
    new SchemaMeta(FORMAT_TYPE.ATOM, 'text', new Text()),
    new SchemaMeta(FORMAT_TYPE.ATOM, 'break', new Break()),
  ],
);
console.log(basicSchema);

export { basicSchema };
