import { updateSchema } from './normalize';
import { FrankySchema, SchemaMeta } from './schema';
import { FORMAT_TYPE, StringMap } from '../libs/types';
import { parseDomStyleToAttrs, parseAttrsToDomStyle } from '../libs/parse';
// eslint-disable-next-line import/named
import { DOMOutputSpec, Node as ProseMirrorNode } from 'prosemirror-model';

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

class Paragraph extends FrankySchema<IParagraphAttrs> {
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

// class Break extends Formattable<never> {
//   public group = 'inline';
//   public inline = true;
//   public name = 'break';
//   public selectable = false;
//   public content = undefined;
//   public parseDOM = [{ tag: 'br' }];
//   public toDOM = () => ['br'] as DOMOutputSpecArray;
// }

const basicSchema = updateSchema(
  {
    nodes: {},
    marks: {},
  },
  [
    new SchemaMeta(FORMAT_TYPE.BLOCK, 'doc', new Doc()),
    new SchemaMeta(FORMAT_TYPE.BLOCK, 'paragraph', new Paragraph()),
    new SchemaMeta(FORMAT_TYPE.ATOM, 'text', new Text()),
    // new SchemaMeta(FORMAT_TYPE.ATOM, 'break', new Break()),
  ],
);

export { basicSchema };
