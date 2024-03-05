import { StringMap } from '../libs/types';

interface ITypesetAttrs {
  align?: 'left' | 'center' | 'right' | 'justify';
  spaceBefore?: number;
  spaceAfter?: number;
  spaceBoth?: number;
  lineHeight?: number;
  lineIndent?: number;
}

const FONT_SIZE = 16;

const isPx = (v: string) => /px$/.test(v);
const isPt = (v: string) => /pt$/.test(v);
const isEm = (v: string) => /[^r]em$/.test(v);
const isNum = (v: string) => /^[\d|.]+$/.test(v);

const hasVal = (v?: any) => v !== undefined && v !== '';

const ptToPx = (v: number) => Math.round((v * 3) / 4);
const emToPx = (v: number, fontSize: number) => Math.round(v * fontSize);

const pxToEm = (v: number, fontSize: number) => Math.round(v / fontSize);
const ptToEm = (v: number, fontSize: number) =>
  Math.round(ptToPx(v) / fontSize);

const getFixedVal = (val: number) => +val.toFixed(2).replace(/\.?0+$/, '');

const getNum = (val: string, fontSize: number) => {
  if (isNum(val)) return getFixedVal(parseFloat(val));
  if (isEm(val)) return getFixedVal(parseFloat(val));
  if (isPx(val)) return getFixedVal(parseFloat(val) / fontSize);
  if (isPt(val)) return getFixedVal(ptToPx(parseFloat(val)) / fontSize);

  return 0;
};

const getEm = (val: string, fontSize: number) => {
  if (isEm(val)) return parseFloat(val);
  if (isPx(val)) return pxToEm(parseFloat(val), fontSize);
  if (isPt(val)) return ptToEm(parseFloat(val), fontSize);
  return 0;
};

const getPx = (val: string, fontSize: number) => {
  if (isPx(val)) return parseFloat(val);
  if (isEm(val)) return emToPx(parseFloat(val), fontSize);
  if (isPt(val)) return ptToPx(parseFloat(val));
  return 0;
};

const setSpace = (
  res: StringMap<number | string>,
  name: string[],
  value: string,
  fontSize: number,
) => {
  name.forEach((_name) => {
    res[_name] = Math.max(
      getPx(value, fontSize),
      res[_name] === undefined ? 0 : +res[_name],
    );
  });
};

const parseSpace = (
  res: StringMap<number | string>,
  name: string,
  value: string,
  fontSize: number,
) => {
  const parseName = name.replace(/(\w)+-/, '');
  if (parseName === 'margin' || parseName === 'padding') {
    const values = value.split(/\s+/);
    if (values.length === 1) {
      setSpace(res, ['top', 'bottom', 'left', 'right'], values[0], fontSize);
    } else if (values.length === 2) {
      setSpace(res, ['top', 'bottom'], values[0], fontSize);
      setSpace(res, ['left', 'right'], values[1], fontSize);
    } else if (values.length === 3) {
      setSpace(res, ['top'], values[0], fontSize);
      setSpace(res, ['left', 'right'], values[1], fontSize);
      setSpace(res, ['bottom'], values[2], fontSize);
    } else if (values.length === 4) {
      setSpace(res, ['top'], values[0], fontSize);
      setSpace(res, ['right'], values[1], fontSize);
      setSpace(res, ['bottom'], values[2], fontSize);
      setSpace(res, ['left'], values[3], fontSize);
    }
  } else {
    setSpace(res, [parseName], value, fontSize);
  }
};
const readSomeStyle = (
  res: StringMap<number | string>,
  name: string,
  value: string,
  fontSize: number,
) => {
  if (name === 'text-indent') {
    res.lineIndent = getEm(value, fontSize);
  } else if (name === 'line-height') {
    res.lineHeight = getNum(value, fontSize);
  } else if (name === 'text-align') {
    res.align = value;
  } else if (/^margin|padding/.test(name)) {
    parseSpace(res, name, value, fontSize);
  }
};
const parseDomStyleToAttrs = (
  style: string,
  formatStyle: (
    res: StringMap<number | string>,
    name: string,
    value: string,
    fontSize: number,
  ) => any = readSomeStyle,
  fontSize = 16,
) => {
  const map: StringMap<any> = {};
  const styleExecReg = /\s*([\w-]+)\s*:\s*([^;]+)/g;
  let match = styleExecReg.exec(style);

  while (match) {
    formatStyle(map, match[1], match[2], fontSize);
    match = styleExecReg.exec(style);
  }

  return {
    ...map,
    spaceBefore: map.top || 0,
    spaceAfter: map.bottom || 0,
    spaceBoth: map.left || map.right || 0,
  };
};

// toDom
const checkIfRender = (name: string, value: any, attrs: StringMap<any>) => {
  if (!hasVal(value)) return false;
  if (attrs[name]) {
    const defaultValue = attrs[name].default;
    if (typeof defaultValue === 'string' && defaultValue === value.toString())
      return false;
    if (
      typeof defaultValue === 'number' &&
      defaultValue === parseInt(value, 10)
    )
      return false;
    if (defaultValue === value) return false;
  }
  return true;
};

const getMarginStyle = (
  spaceBefore: string | number = '',
  spaceAfter: string | number = '',
  spaceBoth: string | number = '',
  dAttrs: StringMap<any>,
) => {
  const hasBefore = checkIfRender('spaceBefore', spaceBefore, dAttrs);
  const hasAfter = checkIfRender('spaceAfter', spaceAfter, dAttrs);
  const hasBoth = checkIfRender('spaceBoth', spaceBoth, dAttrs);
  if (hasBefore && hasAfter && hasBoth) {
    return `margin: ${spaceBefore || 0}px ${spaceBoth || 0}px ${
      spaceAfter || 0
    }px;`;
  }
  let style = '';
  if (hasBefore) style += `margin-top: ${spaceBefore}px;`;
  if (hasAfter) style += `margin-bottom: ${spaceAfter}px;`;
  if (hasBoth)
    style += `margin-left: ${spaceBoth}px; margin-right: ${spaceBoth}px;`;

  return style;
};

const parseAttrsToDomStyle = (
  attrs: ITypesetAttrs & StringMap<any>,
  defaultAttrs: StringMap<any> = {},
) => {
  let style = '';
  const { align, spaceAfter, spaceBefore, spaceBoth, lineHeight, lineIndent } =
    attrs;

  if (align !== (defaultAttrs.align && defaultAttrs.align.default))
    style += `text-align: ${align};`;
  if (
    lineHeight &&
    lineHeight !== (defaultAttrs.lineHeight && defaultAttrs.lineHeight.default)
  ) {
    style += `line-height: ${lineHeight};`;
  }
  if (
    lineIndent &&
    lineIndent !== (defaultAttrs.lineIndent && defaultAttrs.lineIndent.default)
  ) {
    style += `text-indent: ${lineIndent}em;`;
  }
  if (hasVal(spaceAfter) || hasVal(spaceBefore) || hasVal(spaceBoth)) {
    style += getMarginStyle(spaceBefore, spaceAfter, spaceBoth, defaultAttrs);
  }

  return style;
};

export { parseDomStyleToAttrs, parseAttrsToDomStyle };
