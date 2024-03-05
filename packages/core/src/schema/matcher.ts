import { StringMap, BoundingStatic } from '../libs/types';

type TextMatcherHandler = (
  match: RegExpExecArray,
  offset?: number,
  boundStatics?: {
    getStart: () => BoundingStatic;
    getEnd: () => BoundingStatic;
  },
) => StringMap<any> | undefined | null | boolean;

type IMatcherConfig<
  MatcherType = RegExp | RegExp[],
  HandlerType = TextMatcherHandler,
> = {
  name?: string;
  matcher: MatcherType;
  inputOnly?: boolean;
  handler?: HandlerType;
  timing?: 'enter' | 'input' | string;
};

type ParseDOMMatcher<Structure> =
  | {
      tag: string;
      priority?: number;
      preserveWhitespace?: 'full' | undefined;
      getAttrs?(dom: HTMLElement): Partial<Structure> | boolean | void;
    }
  | {
      style: string;
      priority?: number;
      preserveWhitespace?: 'full' | undefined;
      getAttrs?(dom: string): Partial<Structure> | boolean | void;
    };

export type { IMatcherConfig, TextMatcherHandler, ParseDOMMatcher };
