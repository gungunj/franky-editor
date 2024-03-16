import { FrankyApi } from '../api';
import { FrankyEditor } from '../core-editor';
import { StringMap } from '../libs/types';
import { IMatcherConfig, TextMatcherHandler } from './matcher';

type TControllerCommand = {
  [key: string]: (editor: FrankyEditor, ...props: any) => any;
};
type TToolbar = {
  className?: string;
  tooltip?: string | ((node: any) => any);
  type?: string;
  icon?: any;
} & StringMap<any>;

type TKeymapHandler = (editor: FrankyEditor, ...props: any) => boolean;
class Controller<T extends StringMap<any> = any> {
  public name: string = '';
  public editor: FrankyEditor;
  public toolbar: TToolbar = {};
  public textMacher?: Array<
    IMatcherConfig<RegExp | RegExp[], TextMatcherHandler>
  >;
  public props: Partial<T> = {};
  public command?: TControllerCommand;
  public keymap?: StringMap<TKeymapHandler>;

  constructor(editor: FrankyEditor, props: Partial<T>) {
    this.editor = editor;
    this.props = props;
  }
  public editorWillUnmount() {
    // destroy virtual function
  }
}

export { Controller };
