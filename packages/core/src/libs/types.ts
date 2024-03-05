import { Plugin } from 'prosemirror-state';

type FrankyPlugin = Plugin;

type StringMap<T> = { [key: string]: T };

type BoundingStatic = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

enum FORMAT_TYPE {
  CARD = 0b1000,
  ATOM = 0b0100,
  INLINE = 0b0010,
  BLOCK = 0b0001,
  INLINE_ATOM = 0b0110,
  BLOCK_ATOM = 0b0101,
  INLINE_CARD = 0b1010,
  BLOCK_CARD = 0b1001,
}

export type { FrankyPlugin, StringMap, BoundingStatic };

export { FORMAT_TYPE };
